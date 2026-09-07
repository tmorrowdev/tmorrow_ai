---
name: auth-gated-data-sources
description: >
  Authenticate an agent to a data source that requires credentials, using Clerk
  machine authentication — M2M tokens, API keys, or OAuth tokens.

  Triggers: "auth gated data", "agent can't access the API", "401 from the data
  source", "authenticate the agent", "Clerk M2M", "machine token", "service
  account for the agent", "protect my MCP server", "agent needs credentials"

  Use when an agent must read from an API, warehouse, or internal service that
  rejects unauthenticated requests, or when exposing your own data through an
  MCP server that should not be open to everyone. Covers choosing a strategy,
  minting and verifying tokens, and the secret-handling rules that go with it.
---

# Auth-gated data sources

## First: the Clerk connector does not grant access

This plugin ships a `clerk` MCP connector pointing at `https://mcp.clerk.com/mcp`.
It exposes exactly two tools — `clerk_sdk_snippet` and `list_clerk_sdk_snippets` —
which return Clerk SDK code patterns. Both are annotated `readOnlyHint: true`
by the server itself. **It is a documentation server.**

Adding it authenticates nothing and grants access to nothing. It helps you write
the auth code correctly; the code you write is what performs the authentication.

Do not tell a user their data source is reachable because this connector is
configured. Those are unrelated facts.

The other connectors in this plugin authenticate themselves — Snowflake,
Amplitude, and Atlassian each run their own OAuth. Clerk does not sit in front
of them, and no Clerk setup makes them reachable. Clerk is for **your own**
services and APIs.

## Choose a strategy before writing code

Clerk offers three machine authentication strategies. Picking the wrong one is
the most expensive mistake here, because it is discovered late.

| Strategy | Use when | Identity the token carries |
| --- | --- | --- |
| **M2M tokens** | An agent or service you own calls another service you own. No end user is involved. | The machine |
| **API keys** | An end user delegates access so the agent can act against your API on their behalf. | The user who issued the key |
| **OAuth tokens** | The agent acts on behalf of a signed-in user, with scoped consent. | The user, with scopes |

The deciding question is *whose* data is being read. If the answer is "a
specific user's", an M2M token is wrong — it carries no user identity, so your
API cannot scope the query and will either over-return or fail authorization.

## M2M tokens

Two services you control. Mint on the caller, verify on the receiver.

**Mint** — requires `CLERK_MACHINE_SECRET_KEY` for the calling machine:

```ts
import { createClerkClient } from '@clerk/backend'

const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY })

const m2mToken = await clerk.m2m.createToken({
  machineSecretKey: process.env.CLERK_MACHINE_SECRET_KEY,
  secondsUntilExpiration: 300,
  minRemainingTtlSeconds: 60,
})
```

**Send** as a bearer token:

```ts
await fetch('<data-source-url>', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${m2mToken.secret}`,
  },
  body: JSON.stringify({ query }),
})
```

**Verify** on the receiving service:

```ts
const verified = await clerkClient.m2m.verify({ token })
```

Three parameters decide the security posture, and the defaults are not what you
want for an agent:

- `secondsUntilExpiration` defaults to `null`, which means **the token never
  expires**. Always set it. An agent token that lives forever is a credential
  leak waiting to happen.
- `tokenFormat` defaults to `'opaque'` (verified over the network, instantly
  revocable). Set `'jwt'` only when you need local stateless verification and
  can accept that revocation will not take effect until expiry.
- `minRemainingTtlSeconds` enables server-side reuse so repeated calls do not
  mint a new token each time. It applies to opaque tokens only — JWTs are never
  deduplicated. It must be **strictly less than** the token lifetime, or the
  call is rejected with a `400`.

Reach for `minRemainingTtlSeconds` when the caller cannot hold a token in memory
between requests: serverless functions, short-lived workers, autoscaling
containers that churn faster than the TTL.

## API keys

When the end user is delegating access to their own data, have them issue an API
key rather than minting a machine token. The key carries their identity, so your
API can scope the query to what they are allowed to see, and they can revoke it
themselves without redeploying anything.

## Protecting your own MCP server

To expose gated data *through* MCP, put Clerk OAuth in front of the server so
each caller arrives with a user-scoped token. Use `@clerk/mcp-tools`.

Express:

```ts
app.post('/mcp', mcpAuthClerk, streamableHttpHandler(server))

app.get(
  '/.well-known/oauth-protected-resource/mcp',
  protectedResourceHandlerClerk({ scopes_supported: ['email', 'profile'] }),
)

// Still needed for clients on the older MCP spec
app.get('/.well-known/oauth-authorization-server', authServerMetadataHandlerClerk)
```

Next.js route handlers:

```ts
import {
  metadataCorsOptionsRequestHandler,
  protectedResourceHandlerClerk,
} from '@clerk/mcp-tools/next'

const handler = protectedResourceHandlerClerk({ scopes_supported: ['profile', 'email'] })
const corsHandler = metadataCorsOptionsRequestHandler()

export { handler as GET, corsHandler as OPTIONS }
```

Wrapping a handler directly:

```ts
const authHandler = withMcpAuth(
  handler,
  async (_, token) => {
    const clerkAuth = await auth({ acceptsToken: 'oauth_token' })
    return verifyClerkToken(clerkAuth, token)
  },
  { required: true, resourceMetadataPath: '/.well-known/oauth-protected-resource/mcp' },
)

export { authHandler as GET, authHandler as POST }
```

Two things break this most often:

- **The `.well-known` paths must stay publicly reachable.** They are discovery
  metadata. Putting them behind the same auth as `/mcp` means clients can never
  learn how to authenticate, and the failure looks like a generic connection
  error rather than an auth error.
- **Transport must be streamable HTTP.** Clerk's own server does not support SSE,
  and MCP clients increasingly expect streamable HTTP; an SSE-only server will
  connect from some clients and not others.

## Secret handling

- Secrets come from the environment — `CLERK_SECRET_KEY`,
  `CLERK_MACHINE_SECRET_KEY`. Never inline them in code, config, notebooks, or a
  query you are about to run.
- Never print a token, even truncated, into analysis output, a dashboard, a
  commit, or a chat transcript. A token in scrollback is a leaked token.
- Set an expiry on every agent token. Prefer minutes.
- Prefer opaque tokens when revocation matters, and confirm revocation actually
  takes effect — a revoked JWT stays valid until it expires.

## When it still returns 401

Check in this order; the first two account for most of it:

1. **Wrong strategy.** A user-scoped endpoint received a machine token, or vice
   versa. Re-read the table above — this is not fixed by regenerating anything.
2. **The source is not Clerk-gated at all.** Snowflake, Amplitude, and Atlassian
   run their own OAuth. If one of those is returning 401, the fix is in that
   connector's own login, and no amount of Clerk configuration will change it.
3. Token expired, or `secondsUntilExpiration` was left `null` and the token was
   revoked out from under you.
4. Verifying with the wrong key, or against the wrong Clerk instance
   (development keys against a production issuer).
5. For MCP servers: `.well-known` metadata is unreachable, so the client never
   started the OAuth flow.

## Sources

Verified against Clerk's documentation:

- [Clerk MCP server](https://clerk.com/docs/guides/ai/mcp/clerk-mcp-server)
- [Build an MCP server](https://clerk.com/docs/guides/ai/mcp/build-mcp-server)
- [Machine authentication overview](https://clerk.com/docs/guides/development/machine-auth/overview)
- [M2M tokens](https://clerk.com/docs/guides/development/machine-auth/m2m-tokens)

Clerk's MCP server is marked Beta and its API surface moves. Re-check the
snippet signatures above against current docs before shipping, and prefer
`clerk_sdk_snippet` from the connector over anything remembered.
