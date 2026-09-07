# Cre8 Data extension

Data analysis: SQL, dataset exploration, visualization, dashboards, and
validation before results reach stakeholders.

## Skills in `skills/`

| Skill | Use for |
| --- | --- |
| `sql-queries` | Writing and optimizing SQL, dialect differences |
| `data-exploration` | Profiling, quality assessment, pattern discovery |
| `data-visualization` | Chart selection and visualization code |
| `statistical-analysis` | Descriptive stats, trends, outliers, hypothesis tests |
| `data-validation` | Pre-delivery QA and sanity checks |
| `interactive-dashboard-builder` | HTML/JS dashboards with filters |
| `api-data-contracts` | Typed contracts from an OpenAPI spec, without reading real data |
| `data-context-extractor` | Packaging domain knowledge into a reusable skill |
| `auth-gated-data-sources` | Authenticating the agent to a credentialed source |

## Connected sources

Snowflake, Amplitude, and Atlassian are configured as MCP servers and each
handles its own OAuth. Sign in through the client when a call returns 401 —
no additional configuration in this extension affects them.

The `clerk` server is Clerk's documentation MCP. Its two tools return SDK
snippets and are read-only; it authenticates nothing and grants access to
nothing. When an agent needs to reach an auth-gated source, read the
`auth-gated-data-sources` skill and implement Clerk machine auth in the calling
service.

## Working rules

Never print credentials, tokens, or connection strings into analysis output,
dashboards, or saved artifacts. State row counts and filters alongside any
result, and keep query results distinct from inferences drawn from them.
