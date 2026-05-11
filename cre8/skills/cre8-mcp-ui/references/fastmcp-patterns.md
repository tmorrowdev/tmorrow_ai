# FastMCP Patterns for cre8-wc UI Tools

How to expose cre8-wc UIs as MCP tools using `mcp.server.fastmcp.FastMCP`. The `mcp-ui-server` package returns `UIResource` instances; FastMCP tools return them in a list and the host renders the iframe.

## Minimal server

```python
from mcp.server.fastmcp import FastMCP
from mcp_ui_server.core import UIResource

# Adjust the import path to where you place build_ui_resource.py.
# Typical layout: cre8_mcp_ui/build_ui_resource.py
from cre8_mcp_ui import from_schema, from_html

mcp = FastMCP("cre8-demo")

@mcp.tool()
def show_welcome() -> list[UIResource]:
    """Display a welcome card."""
    return [
        from_html(
            '<cre8-card><h2 slot="header">Welcome</h2>'
            '<p>Hello from cre8-wc via mcp-ui.</p></cre8-card>',
            uri="ui://cre8-demo/welcome",
            title="Welcome",
        )
    ]

if __name__ == "__main__":
    mcp.run()
```

## Tool that returns A2UI schema-rendered UI

```python
@mcp.tool()
def show_dashboard() -> list[UIResource]:
    """Display Q4 KPIs."""
    schema = {
        "schema": "cre8-a2ui/1.0",
        "root": {
            "component": "cre8-grid",
            "props": {"columns": 3, "gap": "md"},
            "slots": {"default": [
                {"component": "cre8-stat", "props": {"label": "Revenue", "value": "$2.4M"}},
                {"component": "cre8-stat", "props": {"label": "Users", "value": "12,431"}},
                {"component": "cre8-stat", "props": {"label": "Retention", "value": "94%"}},
            ]},
        },
    }
    return [from_schema(schema, uri="ui://cre8-demo/dashboard", title="Q4 KPIs")]
```

## Tool that returns interactive UI

The UI declares `events` in the schema. The page shell wires postMessage automatically — the agent doesn't write any JS.

```python
@mcp.tool()
def show_contact_form() -> list[UIResource]:
    """Display a contact form. Clicking Submit calls save_contact."""
    schema = {
        "schema": "cre8-a2ui/1.0",
        "root": {
            "component": "cre8-form",
            "props": {"data-cre8-form-scope": True},
            "slots": {"default": [
                {"component": "cre8-input",
                 "props": {"name": "name", "label": "Name", "required": True}},
                {"component": "cre8-input",
                 "props": {"name": "email", "label": "Email", "type": "email"}},
                {"component": "cre8-button",
                 "props": {"variant": "primary"},
                 "events": {"click": {"type": "tool", "toolName": "save_contact"}},
                 "slots": {"default": [{"text": "Submit"}]}},
            ]},
        },
    }
    return [from_schema(schema, uri="ui://cre8-demo/contact-form", title="Contact")]

@mcp.tool()
def save_contact(name: str, email: str) -> dict:
    """Persist a contact. Called by the UI when the user submits the form."""
    # ... store somewhere ...
    return {"ok": True, "id": "contact-123"}
```

## Linking tools to UI resources (MCP Apps `_meta.ui`)

For hosts that support the MCP Apps profile, link a tool to its pre-registered UI resource so the host can render the UI before the tool runs (e.g. show a loading skeleton, stream partial inputs). This requires registering the resource separately — most basic FastMCP servers don't need this and can just return the resource directly from the tool result.

```python
# Conceptual — concrete implementation depends on FastMCP version.
@mcp.tool(_meta={"ui": {"resourceUri": "ui://cre8-demo/dashboard"}})
def show_dashboard() -> list[UIResource]:
    ...
```

If unsure, return the `UIResource` from the tool result. It works on every host.

## Return-type rules

- Always return `list[UIResource]` (even for a single resource).
- The list can mix `UIResource` and regular text/data content. The host renders the UI inline alongside text.
- Don't `print()` from inside an MCP tool — it corrupts stdio transport. Use logging if you must.

## Encoding choice (`text` vs `blob`)

- Default is `encoding="text"`. Fine for most pages.
- Use `encoding="blob"` (Base64) for very large HTML (>100KB) or HTML with characters that JSON would otherwise need to escape heavily.
- Tradeoff: blob increases payload by ~33% but is more robust through aggressive JSON pipelines.

## Running the server

Stdio (default, for desktop MCP clients):

```bash
python server.py
```

HTTP/SSE (for web hosts):

```python
mcp.run(transport="sse", host="0.0.0.0", port=8000)
```

## Common mistakes

| Mistake | Fix |
| --- | --- |
| URI missing `ui://` prefix | `mcp_ui_server` raises `InvalidURIError`. Always prefix. |
| Returning a single `UIResource`, not a list | FastMCP expects `list[UIResource]`. |
| Loading cre8-wc in the tool body instead of the shell | Don't — the shell handles it. Just return the schema/HTML. |
| Inlining JS that uses `cre8Bridge` before DOMContentLoaded | Either guard with `if (window.cre8Bridge)` or run in a `DOMContentLoaded` listener. |
| Putting secrets in `htmlString` | Anyone with the resource sees them. Fetch sensitive data via a child tool call. |
