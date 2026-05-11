"""
interactive_form.py — mcp-ui server with a cre8-wc form that round-trips
through the host via postMessage.

Flow:
  1. Host calls `show_contact_form` → returns a cre8-wc form UI.
  2. User fills the form and clicks Submit.
  3. The page shell collects [name] fields in the form scope and calls
     `save_contact` as an MCP tool via postMessage with `messageId`.
  4. The host invokes the `save_contact` tool below.
  5. The result is posted back as `ui-message-response`, which resolves
     the Promise inside the iframe. The iframe could then dispatch
     `cre8-action-success` to update the UI.

Run:
    pip install mcp mcp-ui-server
    python interactive_form.py
"""

from mcp.server.fastmcp import FastMCP
from mcp_ui_server.core import UIResource

from cre8_mcp_ui import from_schema


mcp = FastMCP("cre8-interactive-demo")


# In-memory store for the demo. Replace with your actual persistence layer.
_CONTACTS: list[dict] = []


@mcp.tool()
def show_contact_form() -> list[UIResource]:
    """Display a contact form. Submit calls save_contact via postMessage."""
    schema = {
        "schema": "cre8-a2ui/1.0",
        "target": "web-components",
        "root": {
            "component": "cre8-card",
            "props": {},
            "slots": {
                "header": [{"component": "h2", "slots": {"default": [{"text": "Add a contact"}]}}],
                "default": [
                    {
                        "component": "cre8-form",
                        # data-cre8-form-scope marks this subtree as the form
                        # scope. All [name] fields under it are collected into
                        # params when the submit button fires.
                        "props": {"data-cre8-form-scope": True},
                        "slots": {
                            "default": [
                                {
                                    "component": "cre8-input",
                                    "props": {
                                        "name": "name",
                                        "label": "Full name",
                                        "required": True,
                                    },
                                },
                                {
                                    "component": "cre8-input",
                                    "props": {
                                        "name": "email",
                                        "label": "Email",
                                        "type": "email",
                                        "required": True,
                                    },
                                },
                                {
                                    "component": "cre8-textarea",
                                    "props": {
                                        "name": "notes",
                                        "label": "Notes",
                                        "rows": 3,
                                    },
                                },
                                {
                                    "component": "cre8-button",
                                    "props": {"variant": "primary"},
                                    "events": {
                                        "click": {
                                            "type": "tool",
                                            "toolName": "save_contact",
                                        }
                                    },
                                    "slots": {"default": [{"text": "Save contact"}]},
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
            uri="ui://cre8-interactive-demo/contact-form",
            title="Add contact",
        )
    ]


@mcp.tool()
def save_contact(name: str, email: str, notes: str = "") -> dict:
    """Persist a contact. Called by the form UI via postMessage."""
    record = {
        "id": f"contact-{len(_CONTACTS) + 1}",
        "name": name,
        "email": email,
        "notes": notes,
    }
    _CONTACTS.append(record)
    return {"ok": True, "contact": record}


@mcp.tool()
def list_contacts() -> list[UIResource]:
    """Display all saved contacts as a cre8-wc list."""
    items = []
    for c in _CONTACTS:
        items.append(
            {
                "component": "cre8-list-item",
                "props": {"headline": c["name"], "supporting-text": c["email"]},
            }
        )
    if not items:
        items.append(
            {
                "component": "cre8-empty-state",
                "props": {
                    "headline": "No contacts yet",
                    "description": "Add one with the contact form.",
                },
            }
        )
    schema = {
        "schema": "cre8-a2ui/1.0",
        "target": "web-components",
        "root": {
            "component": "cre8-list",
            "props": {},
            "slots": {"default": items},
        },
    }
    return [
        from_schema(
            schema,
            uri=f"ui://cre8-interactive-demo/contacts-{len(_CONTACTS)}",
            title="Contacts",
        )
    ]


if __name__ == "__main__":
    mcp.run()
