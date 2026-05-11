"""
Welcome server — minimal cre8-wc card via mcp-ui.

Run:
    pip install mcp mcp-ui-server
    python server.py

Layout:
    welcome-server/
    ├── server.py
    └── cre8_mcp_ui/
        ├── __init__.py
        ├── build_ui_resource.py   # copied from cre8-mcp-ui skill
        └── assets/
            └── page-shell.html    # copied from cre8-mcp-ui skill
"""

from mcp.server.fastmcp import FastMCP
from mcp_ui_server.core import UIResource

from cre8_mcp_ui import from_schema

mcp = FastMCP("welcome-server")


@mcp.tool()
def show_welcome() -> list[UIResource]:
    """Display a welcome card."""
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
                        "slots": {"default": [{"text": "Welcome, Tyler"}]},
                    }
                ],
                "default": [
                    {
                        "component": "p",
                        "slots": {"default": [{"text": "Last login: 2 hours ago"}]},
                    }
                ],
            },
        },
    }
    return [
        from_schema(
            schema,
            uri="ui://welcome-server/greeting",
            title="Welcome",
        )
    ]


if __name__ == "__main__":
    mcp.run()
