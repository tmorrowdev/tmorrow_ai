"""
metrics-server — themed cre8-wc dashboard.

Two stat cards side-by-side with Innovexa brand tokens
(primary #001d8e, accent #03bbb9).

Run:
    pip install mcp mcp-ui-server
    python server.py
"""

from mcp.server.fastmcp import FastMCP
from mcp_ui_server.core import UIResource

from cre8_mcp_ui import from_schema

mcp = FastMCP("metrics-server")


# Brand tokens — override cre8-wc CSS custom properties with the
# Innovexa palette. Define once at module scope so every tool reuses it.
BRAND_TOKENS = """
:root {
  --cre8-color-primary: #001d8e;
  --cre8-color-primary-rgb: 0, 29, 142;
  --cre8-color-accent: #03bbb9;
  --cre8-color-accent-rgb: 3, 187, 185;
  --cre8-color-text: #0a0e2c;
  --cre8-color-bg: #ffffff;
  --cre8-font-family-body: 'SF Pro', system-ui, -apple-system, sans-serif;
}
"""


@mcp.tool()
def show_metrics_dashboard() -> list[UIResource]:
    """Display a two-card metrics dashboard (revenue, churn)."""
    schema = {
        "schema": "cre8-a2ui/1.0",
        "target": "web-components",
        "root": {
            "component": "cre8-section",
            "props": {"headline": "Key Metrics"},
            "slots": {
                "default": [
                    {
                        "component": "cre8-grid",
                        "props": {"columns": 2, "gap": "md"},
                        "slots": {
                            "default": [
                                {
                                    "component": "cre8-stat",
                                    "props": {
                                        "label": "Revenue",
                                        "value": "$1.2M",
                                        "trend": "up",
                                    },
                                },
                                {
                                    "component": "cre8-stat",
                                    "props": {
                                        "label": "Churn",
                                        "value": "3.2%",
                                        "trend": "down",
                                    },
                                },
                            ]
                        },
                    }
                ]
            },
        },
    }
    return [
        from_schema(
            schema,
            uri="ui://metrics-server/dashboard",
            title="Key Metrics",
            theme_css=BRAND_TOKENS,
        )
    ]


if __name__ == "__main__":
    mcp.run()
