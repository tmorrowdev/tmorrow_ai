# MCP Apps integration for Claude Desktop and ChatGPT

Use this path for ext-apps and the branded chat-app workflow. The other Python
examples and page shell in this skill implement the legacy mcp-ui protocol;
they are not drop-in MCP Apps implementations.

## Shared contract

- Use the installed `@modelcontextprotocol/ext-apps` SDK for the iframe bridge
  and verify its APIs against that version. Register handlers before connecting
  the App instance to the host. Handle both initial and subsequent tool results.
- Register a readable `ui://` resource with `text/html;profile=mcp-app` (the SDK's
  RESOURCE_MIME_TYPE). Link its URI from the rendering tool's `_meta.ui.resourceUri`.
  Changing legacy HTML's MIME alone does not migrate its message protocol.
- Return useful text fallback and structured tool data. Validate callback argument
  schemas server-side and use the SDK's tool-call bridge for UI interactions.
- With TypeScript, use registerAppTool/registerAppResource from the SDK's server
  helpers. With Python/FastMCP, implement the equivalent registration and metadata
  using the installed Python SDK. Inspect resources/read and tools/list results.
- Apply theme.css after the verified base theme. Prefer bundled component/CSS/font
  assets; when loading external assets declare the exact resource/connect domains
  in `_meta.ui.csp`. Account for shadow DOM token inheritance and element upgrades.
- Handle host context changes and resize through supported SDK APIs. Treat
  ChatGPT-only window.openai features as optional enhancements, not the shared bridge.

## Host checks

Record client name, version, account/workspace capability, transport and observed
result separately for Claude Desktop and ChatGPT desktop. Consult current official
connection documentation. Do not assume that local stdio configuration or a URL
reachable only from localhost works for both hosts. Supply a reachable endpoint
when the selected host connection requires it. Do not equate web availability
with desktop availability; label unavailable targets explicitly.

Verify protocol metadata and build output first, then use a compatible local
host/harness to test iframe startup and interaction. Finally invoke the actual
render tool inside each accessible target host, exercise a callback, and capture
render/console/network evidence where available. Check cache refresh after UI
changes; update the resource URI when the host would otherwise reuse stale HTML.

## Sources

Check these for version-specific APIs and current host instructions:

- [MCP Apps overview](https://modelcontextprotocol.io/extensions/apps/overview)
- [ext-apps quickstart](https://apps.extensions.modelcontextprotocol.io/api/documents/Quickstart.html)
- [ChatGPT UI contract](https://developers.openai.com/apps-sdk/build/chatgpt-ui)
- [ChatGPT connection and testing](https://developers.openai.com/apps-sdk/deploy/connect-chatgpt)

For workflow handoffs use the sibling `cre8-mcp-app-workflow` skill. The
cre8-mcp-render-debugger agent owns the host-by-host verification report.
