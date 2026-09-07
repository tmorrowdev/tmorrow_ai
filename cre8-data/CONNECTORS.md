# Connectors

## Connectors for this plugin

| Category | Tool | MCP Server |
|----------|------|------------|
| Data warehouse | Snowflake | Snowflake MCP |
| Notebook | Amazon SageMaker | *(no MCP available — use via AWS console)* |
| Product analytics | Amplitude | Amplitude MCP |
| Project tracker | Jira (Atlassian) | Atlassian MCP |
| Core data API | OpenAPI/Swagger | *(schema-only — Claude reads spec, never calls data endpoints)* |
| Agent authentication | Clerk | Clerk MCP (`https://mcp.clerk.com/mcp`) |

## What the Clerk connector is, and is not

The Clerk MCP server exposes two tools — `clerk_sdk_snippet` and
`list_clerk_sdk_snippets` — that return Clerk SDK code patterns. It is a
documentation server. **It does not authenticate you to any data source, and
adding it grants no access to anything.**

Reaching an auth-gated source is a separate job done by Clerk *machine auth*
(M2M tokens, API keys, or OAuth tokens) in the service you are calling. The
connector helps you write that code correctly; it does not perform the auth.

See the `auth-gated-data-sources` skill for which strategy to use and how to
wire it up.

The other connectors above authenticate on their own — Snowflake, Amplitude,
and Atlassian each run their own OAuth. Clerk does not sit in front of them.
