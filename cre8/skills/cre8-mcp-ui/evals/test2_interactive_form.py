"""
priority-server — cre8-wc form with postMessage callback.

Flow:
  1. Host calls show_priority_form → returns a cre8 form UI.
  2. User fills (title, owner, due date) and clicks Submit.
  3. The page shell collects the [name] fields under data-cre8-form-scope
     and posts a `tool` message back to the host with a messageId.
  4. Host invokes save_priority(...) below.
  5. Result returns to the iframe as ui-message-response; the Promise
     in the bridge resolves.

Run:
    pip install mcp mcp-ui-server
    python server.py
"""

from mcp.server.fastmcp import FastMCP
from mcp_ui_server.core import UIResource

from cre8_mcp_ui import from_schema

mcp = FastMCP("priority-server")

# Simple in-memory store. Replace with your real persistence layer.
_PRIORITIES: list[dict] = []


@mcp.tool()
def show_priority_form() -> list[UIResource]:
    """Display a form to capture a new priority (title, owner, due date)."""
    schema = {
        "schema": "cre8-a2ui/1.0",
        "target": "web-components",
        "root": {
            "component": "cre8-card",
            "props": {},
            "slots": {
                "header": [
                    {
                        "component": "h2",
                        "slots": {"default": [{"text": "Add a priority"}]},
                    }
                ],
                "default": [
                    {
                        "component": "cre8-form",
                        # Form scope: every [name] field below is auto-collected
                        # into the tool-call params when the button fires.
                        "props": {"data-cre8-form-scope": True},
                        "slots": {
                            "default": [
                                {
                                    "component": "cre8-input",
                                    "props": {
                                        "name": "title",
                                        "label": "Title",
                                        "required": True,
                                    },
                                },
                                {
                                    "component": "cre8-input",
                                    "props": {
                                        "name": "owner",
                                        "label": "Owner",
                                        "required": True,
                                    },
                                },
                                {
                                    "component": "cre8-input",
                                    "props": {
                                        "name": "due_date",
                                        "label": "Due date",
                                        "type": "date",
                                        "required": True,
                                    },
                                },
                                {
                                    "component": "cre8-button",
                                    "props": {"variant": "primary"},
                                    "events": {
                                        "click": {
                                            "type": "tool",
                                            "toolName": "save_priority",
                                        }
                                    },
                                    "slots": {"default": [{"text": "Submit"}]},
                                },
                            ]
                        },
                    }
                ],
            },
        },
    }
    return [
        from_schema(
            schema,
            uri="ui://priority-server/new",
            title="Add priority",
        )
    ]


@mcp.tool()
def save_priority(title: str, owner: str, due_date: str) -> dict:
    """Persist a priority. Called by the form UI via postMessage."""
    record = {
        "id": f"priority-{len(_PRIORITIES) + 1}",
        "title": title,
        "owner": owner,
        "due_date": due_date,
    }
    _PRIORITIES.append(record)
    return {
        "ok": True,
        "message": f"Saved priority '{title}' for {owner} (due {due_date}).",
        "priority": record,
    }


if __name__ == "__main__":
    mcp.run()
