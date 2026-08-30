# Cre8 Plugin for Claude Code

Claude Code plugin for the Cre8 design system. Provides component intelligence for both Web Components (`@tmorrow/cre8-wc`) and React (`@tmorrow/cre8-react`).

## Features

### MCP Tools

The plugin registers the `cre8` MCP server (`npx @tmorrow/cre8-mcp@latest` —
always the currently-published version, no separate plugin update needed
when the server changes) with 15 tools:

#### Component lookup

- **list_components** - List all components by category
- **get_component** - Get detailed component API (props, slots, events, import, usage)
- **search_components** - Search components by name, description or category
- **get_patterns** - Pre-built UI patterns (login form, data table, page layout, etc.)
- **get_composition** - How a component actually nests, from the library's own stories/examples — not the naming convention
- **generate_code** - Generate Web Component HTML or React JSX from a component-tree schema

#### A2UI (agent-authored UI trees)

- **get_a2ui_catalog** - The full A2UI JSON-Schema catalog: every component, typed props, enum constraints, slots, events
- **validate_a2ui_spec** - Validates a ComponentSpec tree against the catalog before it ships
- **get_content_model** - Whether a component takes content through `children` or `slots` — never both
- **cre8_guide** - The briefing on emitting UI that validates first try and the traps that cost the most attempts

#### Live UI surfaces (streamed, not generated-and-done)

- **ui_open_surface** - Opens a live surface and returns a URL a human can watch update in place
- **ui_stream** - Streams a change into an open surface — the only mutation tool
- **ui_get_surface** - Returns a surface's current tree/data with bindings resolved
- **ui_events** - Reads events the user fired on a surface's bound handlers
- **ui_close_surface** - Closes a surface

### Skills

- **cre8-a2ui** - Web Components guidance (vanilla JS/HTML, Lit)
- **cre8-a2ui-react** - React component guidance
- **cre8-mcp-ui** - MCP UI bridge for serving cre8-wc UIs through Python MCP servers
- **cre8-theming** - Extract a brand's colors, type and shape from a website, docs site, Design.md, or picture, and turn it into a cre8 seed-token override

## Installation

```bash
claude plugin install cre8@tmorrow_ai
```

## Requirements

- Node.js 18+
- npm/npx available in PATH

## License

MIT
