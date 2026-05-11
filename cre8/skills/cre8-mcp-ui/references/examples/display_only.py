"""
display_only.py — Minimal mcp-ui server that returns a static cre8-wc dashboard.

Run:
    pip install mcp mcp-ui-server
    # Put build_ui_resource.py and assets/page-shell.html somewhere on PYTHONPATH
    python display_only.py
"""

from mcp.server.fastmcp import FastMCP
from mcp_ui_server.core import UIResource

from cre8_mcp_ui import from_schema

mcp = FastMCP("cre8-display-demo")


@mcp.tool()
def show_kpi_dashboard() -> list[UIResource]:
    """Display a Q4 KPI dashboard with three stat cards."""
    schema = {
        "schema": "cre8-a2ui/1.0",
        "target": "web-components",
        "root": {
            "component": "cre8-section",
            "props": {"headline": "Q4 2025 Performance"},
            "slots": {
                "default": [
                    {
                        "component": "cre8-grid",
                        "props": {"columns": 3, "gap": "md"},
                        "slots": {
                            "default": [
                                {
                                    "component": "cre8-stat",
                                    "props": {
                                        "label": "Revenue",
                                        "value": "$2.4M",
                                        "trend": "up",
                                        "delta": "+12%",
                                    },
                                },
                                {
                                    "component": "cre8-stat",
                                    "props": {
                                        "label": "Active Users",
                                        "value": "12,431",
                                        "trend": "up",
                                        "delta": "+8%",
                                    },
                                },
                                {
                                    "component": "cre8-stat",
                                    "props": {
                                        "label": "Retention",
                                        "value": "94%",
                                        "trend": "flat",
                                        "delta": "0%",
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
            uri="ui://cre8-display-demo/q4-kpis",
            title="Q4 2025 KPIs",
        )
    ]


if __name__ == "__main__":
    mcp.run()
