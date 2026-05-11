"""
data-preview-server — cre8-chart data visualization via mcp-ui.

Shows two patterns:
  A. Static chart — tool receives data and returns a bar chart.
  B. Interactive chart — clicking a bar calls `drill_down` with the
     selected data point's label and value.

Run:
    pip install mcp mcp-ui-server
    python test4_data_chart.py
"""

import json

from mcp.server.fastmcp import FastMCP
from mcp_ui_server.core import UIResource

from cre8_mcp_ui import from_html

mcp = FastMCP("data-preview-server")


def _chart_body(
    *,
    chart_type: str,
    title: str,
    labels: list,
    datasets: list,
    callback_tool: str | None = None,
) -> str:
    """Build an HTML fragment with a cre8-chart and optional data-click wiring."""
    chart_data = json.dumps({"labels": labels, "datasets": datasets})
    click_handler = ""
    if callback_tool:
        click_handler = f"""
      el.addEventListener('data-click', function (e) {{
        var dp = e.detail.dataPoint;
        cre8Bridge.callTool('{callback_tool}', {{
          label: dp.label,
          value: dp.value,
          dataset_index: dp.datasetIndex,
          index: dp.index,
        }});
      }});"""

    return f"""
<cre8-chart id="cre8-chart-root" type="{chart_type}" title="{title}"></cre8-chart>
<script>
  (function () {{
    var el = document.getElementById('cre8-chart-root');
    var data = {chart_data};
    function init() {{
      el.data = data;{click_handler}
    }}
    if (customElements.get('cre8-chart')) {{
      init();
    }} else {{
      customElements.whenDefined('cre8-chart').then(init);
    }}
  }})();
</script>
"""


# ── Pattern A: static chart ───────────────────────────────────────────────────

@mcp.tool()
def show_revenue_chart() -> list[UIResource]:
    """Display a static bar chart of Q4 revenue by month."""
    body = _chart_body(
        chart_type="bar",
        title="Q4 Revenue ($M)",
        labels=["October", "November", "December"],
        datasets=[{"label": "Revenue", "data": [1.1, 1.4, 1.8]}],
    )
    return [from_html(body, uri="ui://data-preview-server/revenue", title="Q4 Revenue")]


@mcp.tool()
def show_trend_chart() -> list[UIResource]:
    """Display a line chart comparing revenue and cost trends."""
    body = _chart_body(
        chart_type="line",
        title="Revenue vs Cost",
        labels=["Q1", "Q2", "Q3", "Q4"],
        datasets=[
            {"label": "Revenue", "data": [1.2, 1.5, 1.1, 1.8]},
            {"label": "Cost", "data": [0.9, 1.0, 0.8, 1.1]},
        ],
    )
    return [from_html(body, uri="ui://data-preview-server/trend", title="Revenue vs Cost")]


# ── Pattern B: interactive chart with data-click callback ─────────────────────

@mcp.tool()
def show_category_chart() -> list[UIResource]:
    """Display an interactive bar chart. Clicking a bar calls drill_down."""
    body = _chart_body(
        chart_type="bar",
        title="Sales by Category (click a bar to drill down)",
        labels=["Software", "Services", "Hardware", "Support"],
        datasets=[{"label": "Sales ($M)", "data": [2.4, 1.8, 0.9, 0.6]}],
        callback_tool="drill_down",
    )
    return [
        from_html(
            body,
            uri="ui://data-preview-server/categories",
            title="Sales by Category",
        )
    ]


@mcp.tool()
def drill_down(label: str, value: float, dataset_index: int = 0, index: int = 0) -> dict:
    """Handle a data point click from the category chart."""
    return {
        "selected": label,
        "value": value,
        "message": f"You clicked '{label}' (${value}M). Drill-down data would load here.",
    }


if __name__ == "__main__":
    mcp.run()
