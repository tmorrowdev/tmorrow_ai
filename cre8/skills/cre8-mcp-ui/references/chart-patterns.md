# cre8-chart Patterns for MCP UI Tools

`cre8-chart` renders Chart.js visualizations as a cre8-wc component. It accepts
`type` and `title` as HTML attributes, but `data` and `options` must be set as
JavaScript **properties** — which means this component always uses `from_html`,
never `from_schema`.

## Component API

```html
<cre8-chart
  type="bar"        <!-- bar | line | pie | donut | area -->
  title="Revenue"
></cre8-chart>
```

| Property  | Type           | Description                       |
| --------- | -------------- | --------------------------------- |
| `.data`   | `ChartData`    | Chart.js data object (required)   |
| `.options`| `ChartOptions` | Chart.js config options           |

Event emitted: `data-click` — fires when a data point is clicked.

```js
// detail shape
{ dataPoint: { label: string, value: number, datasetIndex: number, index: number } }
```

## Setting data via inline script

Because `.data` is a JS property, use `from_html` and set it after the element
upgrades:

```python
def _chart_html(chart_type: str, title: str, labels: list, datasets: list) -> str:
    import json
    chart_data = json.dumps({"labels": labels, "datasets": datasets})
    return f"""
<cre8-chart id="cre8-chart-root" type="{chart_type}" title="{title}"></cre8-chart>
<script>
  (function () {{
    const el = document.getElementById('cre8-chart-root');
    const data = {chart_data};
    function init() {{ el.data = data; }}
    if (customElements.get('cre8-chart')) init();
    else customElements.whenDefined('cre8-chart').then(init);
  }})();
</script>
"""

@mcp.tool()
def show_chart(labels: list[str], values: list[float]) -> list[UIResource]:
    body = _chart_html(
        chart_type="bar",
        title="Results",
        labels=labels,
        datasets=[{"label": "Value", "data": values}],
    )
    return [from_html(body, uri="ui://demo/chart", title="Results")]
```

## Wiring data-click to an MCP tool

The bridge's auto-wire (`data-cre8-trigger`) doesn't capture `CustomEvent.detail`,
so handle `data-click` manually inside the inline script:

```python
def _chart_html_interactive(title: str, labels: list, datasets: list, callback_tool: str) -> str:
    import json
    chart_data = json.dumps({"labels": labels, "datasets": datasets})
    return f"""
<cre8-chart id="cre8-chart-root" type="bar" title="{title}"></cre8-chart>
<script>
  (function () {{
    const el = document.getElementById('cre8-chart-root');
    const data = {chart_data};
    function init() {{
      el.data = data;
      el.addEventListener('data-click', function (e) {{
        const dp = e.detail.dataPoint;
        cre8Bridge.callTool('{callback_tool}', {{
          label: dp.label,
          value: dp.value,
          dataset_index: dp.datasetIndex,
          index: dp.index,
        }});
      }});
    }}
    if (customElements.get('cre8-chart')) init();
    else customElements.whenDefined('cre8-chart').then(init);
  }})();
</script>
"""
```

## Chart types

| `type`   | Use when                                    |
| -------- | ------------------------------------------- |
| `bar`    | Comparing values across categories          |
| `line`   | Showing trends over time                    |
| `area`   | Line with fill; emphasizes volume           |
| `pie`    | Part-of-whole proportions (≤6 slices)       |
| `donut`  | Same as pie, with a center label slot       |

## Multi-dataset example

```python
datasets = [
    {"label": "Revenue", "data": [1.2, 1.5, 1.1, 1.8]},
    {"label": "Cost",    "data": [0.9, 1.0, 0.8, 1.1]},
]
```

Passed to `.data` as `{ labels: [...], datasets: [...] }`.

## Common mistakes

| Symptom | Fix |
| --- | --- |
| Chart renders empty | `.data` wasn't set before `customElements.whenDefined` resolved. Ensure the property is set inside the `init()` callback. |
| `data-click` fires but tool never called | `cre8Bridge` wasn't ready when listener attached. The bridge is synchronous by DOMContentLoaded — guard with `if (window.cre8Bridge)` or defer inside `init()`. |
| Using `from_schema` | `cre8-chart` needs JS properties, not HTML attributes. Always use `from_html`. |
| `type` attribute ignored | The component reads `type` at upgrade time; set it as an HTML attribute before the element is in the DOM, not via JS. |
