# Cre8 Plugin for Claude Code

Claude Code plugin for the Cre8 design system. Provides component intelligence for both Web Components (`@tmorrow/cre8-wc`) and React (`@tmorrow/cre8-react`).

## Features

### MCP Tools

The plugin registers the `cre8` MCP server with these tools:

- **list_components** - List all components by category
- **get_component** - Get detailed component API (props, slots, events)
- **search_components** - Search components by keyword
- **get_patterns** - Pre-built UI patterns (login, table, layout)
- **generate_code** - Generate React/HTML from component schema

### Skills

- **cre8-a2ui** - Web Components guidance (vanilla JS/HTML, Lit)
- **cre8-a2ui-react** - React component guidance
- **cre8-mcp-ui** - MCP UI bridge for serving cre8-wc UIs through Python MCP servers

## Installation

```bash
claude plugin install cre8@tmorrow_ai
```

## Requirements

- Node.js 18+
- npm/npx available in PATH

## License

MIT
