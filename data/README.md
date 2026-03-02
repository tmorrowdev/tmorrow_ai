# Data Analyst Plugin

A data analyst plugin primarily designed for [Cowork](https://claude.com/product/cowork), Anthropic's agentic desktop application — though it also works in Claude Code. SQL queries, data exploration, visualization, dashboards, and insight generation. Configured for Snowflake, Amazon SageMaker, Amplitude, and Jira.

## Installation

```
claude plugins add knowledge-work-plugins/data
```

## What It Does

This plugin transforms Claude into a data analyst collaborator. It helps you explore datasets, write optimized SQL, build visualizations, create interactive dashboards, and validate analyses before sharing with stakeholders.

### With Snowflake Connected

Connect your Snowflake MCP server for the best experience. Claude will:

- Query Snowflake directly using your warehouse and role
- Explore schemas, databases, and table metadata
- Run analyses end-to-end without copy-pasting
- Iterate on queries based on live results

### With SageMaker

Use Amazon SageMaker Studio notebooks for deeper exploration, ML workflows, and sharing analysis with your team. Claude can write Python/SQL code optimized for SageMaker notebooks, generate cells you can paste directly, and help structure notebook-based analyses.

### Without a Data Warehouse Connection

Without a Snowflake connection, paste SQL results or upload CSV/Excel files for analysis and visualization. Claude can also write Snowflake SQL queries for you to run manually, and then analyze the results you provide.

## Commands

| Command | Description |
|---------|-------------|
| `/analyze` | Answer data questions -- from quick lookups to full analyses |
| `/explore-data` | Profile and explore a dataset to understand its shape, quality, and patterns |
| `/write-query` | Write optimized SQL for your dialect with best practices |
| `/create-viz` | Create publication-quality visualizations with Python |
| `/build-dashboard` | Build interactive HTML dashboards with filters and charts |
| `/validate` | QA an analysis before sharing -- methodology, accuracy, and bias checks |

## Skills

| Skill | Description |
|-------|-------------|
| `sql-queries` | SQL best practices across dialects, common patterns, and performance optimization |
| `data-exploration` | Data profiling, quality assessment, and pattern discovery |
| `data-visualization` | Chart selection, Python viz code patterns, and design principles |
| `statistical-analysis` | Descriptive stats, trend analysis, outlier detection, and hypothesis testing |
| `data-validation` | Pre-delivery QA, sanity checks, and documentation standards |
| `interactive-dashboard-builder` | HTML/JS dashboard construction with Chart.js, filters, and styling |
| `api-data-contracts` | Generate typed data contracts from your OpenAPI spec for the UI agent — without Claude seeing real data |

## Example Workflows

### Ad-Hoc Analysis

```
You: /analyze What was our monthly revenue trend for the past 12 months, broken down by product line?

Claude: [Writes SQL query] → [Executes against data warehouse] → [Generates trend chart]
       → [Identifies key patterns: "Product line A grew 23% YoY while B was flat"]
       → [Validates results with sanity checks]
```

### Data Exploration

```
You: /explore-data users table

Claude: [Profiles table: 2.3M rows, 47 columns]
       → [Reports: created_at has 0.2% nulls, email has 99.8% cardinality]
       → [Flags: status column has unexpected value "UNKNOWN" in 340 rows]
       → [Suggests: "High-value dimensions to explore: plan_type, signup_source, country"]
```

### Query Writing

```
You: /write-query I need a cohort retention analysis -- users grouped by signup month,
     showing what % are still active 1, 3, 6, and 12 months later. We use Snowflake.

Claude: [Writes optimized Snowflake SQL with CTEs]
       → [Adds comments explaining each step]
       → [Includes performance notes about partition pruning]
```

### Dashboard Building

```
You: /build-dashboard Create a sales dashboard with monthly revenue, top products,
     and regional breakdown. Here's the data: [pastes CSV]

Claude: [Generates self-contained HTML file]
       → [Includes interactive Chart.js visualizations]
       → [Adds dropdown filters for region and time period]
       → [Opens in browser for review]
```

### Pre-Share Validation

```
You: /validate [shares analysis document]

Claude: [Reviews methodology] → [Checks for survivorship bias in churn analysis]
       → [Verifies aggregation logic] → [Flags: "Denominator excludes trial users
          which could overstate conversion rate by ~5pp"]
       → [Confidence: "Ready to share with noted caveat"]
```

## Your Data Stack

> See [CONNECTORS.md](CONNECTORS.md) for the full list of connected tools.

This plugin is configured for your stack:

- **Data Warehouse**: Snowflake (connected via MCP)
- **Notebooks**: Amazon SageMaker Studio (use via AWS console)
- **Product Analytics**: Amplitude (connected via MCP)
- **Project Tracker**: Jira / Confluence via Atlassian (connected via MCP)
- **Core Data API**: OpenAPI/Swagger spec (Claude reads schema only — never sees real data)

Claude can query Snowflake directly, pull Amplitude insights, and reference Jira tickets. For SageMaker, Claude generates notebook-ready code you can run in Studio. For the core API, Claude generates typed data contracts from the OpenAPI spec that a separate UI agent uses to build data-driven interfaces.
