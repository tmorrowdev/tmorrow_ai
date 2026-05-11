---
name: cre8-mcp-ui
description: Bridge for serving CRE8 web components (@tmorrow/cre8-wc) as interactive UI through Python MCP servers via the mcp-ui-server SDK. Use whenever the user wants a Python FastMCP server whose tools return cre8-wc UIs, wraps an A2UI / cre8-a2ui schema as an mcp-ui rawHtml resource, exposes CRE8 / Innovexa design system components through MCP, builds interactive cre8-wc forms or dashboards that postMessage back to an MCP host, or mentions mcp-ui + cre8-wc, mcp-ui-server + FastMCP, ui:// resources with cre8 components, or "cre8 in mcp-ui." Compose this skill with cre8-a2ui (which generates the HTML body); this skill provides the page shell, the postMessage bridge, the Python helper, and the FastMCP tool patterns. Trigger eagerly — if the request involves both a Python MCP server and any CRE8 / cre8-wc UI, use this skill even when the user didn't say "mcp-ui" by name.
---

# cre8-mcp-ui — CRE8 ↔ mcp-ui bridge

Serve `@tmorrow/cre8-wc` components as interactive UI through Python MCP tools. This skill provides three things the agent needs to build correctly:

1. **A page shell** (`assets/page-shell.html`) — a self-contained HTML document that loads cre8-wc from CDN, applies brand theme tokens, and wires the mcp-ui postMessage bridge.
2. **A Python helper** (`scripts/build_ui_resource.py`) — `from_schema(...)` and `from_html(...)` produce `UIResource` instances ready to return from FastMCP tools.
3. **An event-binding convention** — declarative `events: {...}` in cre8-a2ui schemas (or `data-cre8-action` attributes on raw HTML) get auto-wired to the postMessage bridge so the agent never writes JavaScript.

This skill **composes with** `cre8-a2ui`, which knows how to express UIs as cre8-wc schemas. That skill produces the body; this one wraps it.

---

## When this skill triggers

- "Build a Python MCP server with cre8-wc UI for X"
- "Wrap this cre8-a2ui schema as an mcp-ui resource"
- "Make a FastMCP tool that returns a cre8 dashboard"
- "Expose `@tmorrow/cre8-wc` components through MCP"
- "Add a postMessage callback to this cre8 form"

If the request involves both a Python MCP server (FastMCP, `mcp-ui-server`, `ui://`) and cre8-wc / CRE8 / Innovexa components, this is the skill — even if the user didn't name it.

---

## Workflow

### 1. Determine the input path

| Input the user gave you | Do this |
| --- | --- |
| A cre8-a2ui JSON schema | Path A — `from_schema(schema, uri=...)` |
| Plain HTML / a description in words | Path B — invoke the `cre8-a2ui` skill to produce a schema first, then Path A |
| Just an HTML body fragment | Path C — `from_html(html_body, uri=...)` |

**Always prefer Path A** when generating fresh UIs. The schema is the contract; the HTML is the artifact. This means a future change can re-render the same schema with different themes or breakpoints without re-running the agent.

### 2. Scaffold the FastMCP server

Imports the agent must include verbatim — `mcp-ui-server` is pip-installable and `mcp` is the official Anthropic Python MCP SDK:

```python
from mcp.server.fastmcp import FastMCP
from mcp_ui_server.core import UIResource
from cre8_mcp_ui import from_schema, from_html  # this skill's helper
```

Every UI-returning tool must:

- Be decorated with `@mcp.tool()`.
- Return `list[UIResource]` (always a list — even for one resource).
- Use a URI starting with `ui://`. Pattern: `ui://<server-name>/<resource-name>[/<instance-id>]`.

### 3. Wire interactivity through the schema

If the UI needs to call back to MCP, declare events in the schema. Do **not** write `<script>` blocks or inline `onclick` handlers — the page shell handles wiring.

```json
{
  "component": "cre8-button",
  "events": { "click": { "type": "tool", "toolName": "save_contact" } },
  "slots": { "default": [{ "text": "Submit" }] }
}
```

For forms, wrap the form in `cre8-form` (or any element with `data-cre8-form-scope`). All `[name]` fields under that scope are collected automatically when the submit button fires.

### 4. Return the resource

```python
@mcp.tool()
def show_contact_form() -> list[UIResource]:
    schema = { "schema": "cre8-a2ui/1.0", "root": { ... } }
    return [from_schema(schema, uri="ui://demo/contact-form", title="Contact")]
```

### 5. Implement the callback tools

Any `toolName` referenced in the schema must exist as an `@mcp.tool()` on the same server. Argument names must match the form field `[name]` attributes.

---

## Event-binding convention

The page shell auto-wires elements with `data-cre8-action`. The schema's `events` field is a thin sugar that generates these attributes.

| Action attribute               | Schema sugar                                                  | What it does                                  |
| ------------------------------ | ------------------------------------------------------------- | --------------------------------------------- |
| `data-cre8-action="tool:NAME"` | `events: { click: { type: "tool", toolName: "NAME" } }`       | Calls an MCP tool with form params + Promise. |
| `data-cre8-action="prompt"`    | `events: { click: { type: "prompt", text: "..." } }`          | Injects a follow-up message.                  |
| `data-cre8-action="link"`      | `events: { click: { type: "link", url: "..." } }`             | Asks host to open a URL.                      |
| `data-cre8-action="notify"`    | `events: { click: { type: "notify", message: "..." } }`       | Logs to host (no UI effect).                  |
| `data-cre8-action="intent:N"`  | `events: { click: { type: "intent", intent: "N", params } }`  | Host-specific semantic action.                |

Override the trigger event with `data-cre8-trigger="change"` (default is `click`).

Static params can be added with `data-cre8-params='{"key":"value"}'`. They merge with form-scope values, with explicit params winning on conflict.

For advanced cases, custom inline scripts can use the global `window.cre8Bridge`:

```js
const result = await cre8Bridge.callTool('search', { q: 'cre8' });
// or:
cre8Bridge.prompt('Tell me about Q4');
cre8Bridge.openLink('https://example.com');
```

---

## Project layout to suggest

When the user wants a full server, recommend this structure:

```
my-cre8-server/
├── pyproject.toml          # depends on: mcp, mcp-ui-server
├── server.py               # FastMCP entry point with tools
└── cre8_mcp_ui/
    ├── __init__.py         # re-exports from_schema, from_html
    ├── build_ui_resource.py   # copy from this skill's scripts/
    └── assets/
        └── page-shell.html    # copy from this skill's assets/
```

The `__init__.py` should be:

```python
from .build_ui_resource import from_schema, from_html, render_schema, wrap_in_shell

__all__ = ["from_schema", "from_html", "render_schema", "wrap_in_shell"]
```

The shell HTML path is resolved relative to `build_ui_resource.py`, so as long as it sits at `<package>/assets/page-shell.html`, it works.

---

## Theming with brand tokens

Pass extracted brand CSS as `theme_css` — the shell injects it into a `<style>` block before user content. Compose with the `brand-theme-extractor` skill to generate the token override:

```python
theme_css = """
:root {
  --cre8-color-primary: #001d8e;
  --cre8-color-accent: #03bbb9;
  --cre8-font-family-body: 'SF Pro', system-ui, sans-serif;
}
"""

return [from_schema(schema, uri="ui://demo/dashboard", theme_css=theme_css)]
```

For a multi-tool server with shared theming, define the CSS once at module level and pass it to every call.

---

## Common gotchas

| Symptom                                                  | Cause / Fix                                                                                              |
| -------------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| `InvalidURIError`                                        | URI missing `ui://` prefix. Always prefix.                                                               |
| Iframe loads but cre8 elements stay un-upgraded          | CDN script tag was overwritten by the body HTML. Don't write `<head>` or `<html>` in the body fragment.  |
| Click fires but no tool call                             | Form scope mismatch — make sure inputs have `name` attrs and the button is inside `data-cre8-form-scope`. |
| Promise from `callTool` never resolves                   | Host doesn't implement `onUIAction` or doesn't post `ui-message-response`. Use `{ async: false }` to fire-and-forget. |
| Iframe doesn't resize                                    | Host doesn't honor `ui-size-change`. Fall back to a fixed-height container in the host.                  |
| `print()` from inside a tool breaks the server           | Stdio transport reads stdout — never print. Use `logging` to stderr instead.                             |
| Single `UIResource` returned, not a list                 | FastMCP expects `list[UIResource]`. Wrap in `[ ]`.                                                       |
| User sees raw HTML instead of a rendered UI              | Host doesn't recognize `ui://` resources. Check `Supported Hosts` in the mcp-ui docs. (The Python SDK currently emits `mimeType: text/html`; some hosts also look for the `text/html;profile=mcp-app` profile from the MCP Apps spec.) |

---

## Reference files

Load these on demand:

- `references/postmessage-protocol.md` — full wire protocol (guest↔host), messageId pattern, async round-trip. Read when the agent needs to send custom messages or handle host notifications outside the auto-wire convention.
- `references/fastmcp-patterns.md` — FastMCP tool patterns, `_meta.ui` linking, encoding tradeoffs, transports. Read when scaffolding a new server or troubleshooting tool registration.
- `references/examples/display_only.py` — minimal static dashboard. Use as a starting template.
- `references/examples/interactive_form.py` — full postMessage round-trip with form scope and a callback tool. Use as a starting template when the UI needs to write back.

---

## Quick-start: minimal interactive server

```python
# server.py
from mcp.server.fastmcp import FastMCP
from mcp_ui_server.core import UIResource

from cre8_mcp_ui import from_schema

mcp = FastMCP("cre8-demo")

@mcp.tool()
def greet_form() -> list[UIResource]:
    """Show a form that calls say_hi when submitted."""
    return [from_schema(
        {
            "schema": "cre8-a2ui/1.0",
            "root": {
                "component": "cre8-form",
                "props": {"data-cre8-form-scope": True},
                "slots": {"default": [
                    {"component": "cre8-input",
                     "props": {"name": "who", "label": "Your name"}},
                    {"component": "cre8-button",
                     "props": {"variant": "primary"},
                     "events": {"click": {"type": "tool", "toolName": "say_hi"}},
                     "slots": {"default": [{"text": "Greet me"}]}},
                ]},
            },
        },
        uri="ui://cre8-demo/greet",
        title="Greet",
    )]

@mcp.tool()
def say_hi(who: str) -> dict:
    return {"message": f"Hello, {who}!"}

if __name__ == "__main__":
    mcp.run()
```

That's the whole loop: schema in, `UIResource` out, postMessage round-trips for free.
