# Cre8 Plugin for Claude Code, Codex, and Gemini CLI

Shared plugin distribution for the Cre8 design system. Provides component intelligence for both Web Components (`@tmorrow/cre8-wc`) and React (`@tmorrow/cre8-react`).

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

### Claude Code

```bash
claude plugin marketplace add tmorrowdev/tmorrow_ai
claude plugin install cre8@tmorrow_ai
```

### Codex

```bash
codex plugin marketplace add tmorrowdev/tmorrow_ai
codex plugin add cre8@tmorrow_ai
```

Start a new Codex thread after installing. Optional project agent registration is described below.

### Gemini CLI

From a terminal, clone the marketplace and install its extension subdirectory:

```bash
git clone https://github.com/tmorrowdev/tmorrow_ai.git
gemini extensions install ./tmorrow_ai/cre8
```

Keep the checkout for future updates and start a new Gemini CLI session.

For Cowork installation and upgrade instructions for every client, see the [marketplace guide](../README.md#installation).

## Upgrading

Follow the [client-specific upgrade instructions](../README.md#upgrading) to refresh the marketplace or checkout and update the installed plugin. Start a new session afterward. The Gemini development link below reads changes directly from its checkout.

## Requirements

- Node.js 18+
- npm/npx available in PATH

## License

MIT

## Branded MCP Apps agent workflow

Ask: “Build an MCP App for Claude Desktop and ChatGPT using this brand guide.”
In Claude Code this runs as the `cre8:theme-build-mcp-app` workflow; on other
hosts the main session coordinates the same specialists in the same order. You
can also request any specialist directly.

| Agent | Responsibility | Handoff |
| --- | --- | --- |
| `cre8-brand-themer` | Extract and verify the brand with cre8-theming | theme.css + brand-handoff.md |
| `cre8-mcp-app-builder` | Build both host integrations with cre8-mcp-ui and the appropriate A2UI skill | runnable app + integration-handoff.md |
| `cre8-mcp-render-debugger` | Reproduce, fix, and verify rendering and interactions per host | render-report.md |

The main session coordinates dependent stages and sends failed checks back to
whoever owns the fix. Existing apps can enter directly at integration or debugging.
The MCP Apps path uses ext-apps; legacy mcp-ui examples remain available for
hosts implementing that older protocol. Desktop results are recorded separately
from local harness/browser results.

### Claude Code

The plugin automatically discovers `agents/*.md`, `skills/*/SKILL.md`, and
`workflows/*.js`. Ask Claude to run the `cre8:theme-build-mcp-app` workflow by
name; workflows require an explicit opt-in, so a bare feature request will not
start one on its own. It accepts optional `args`: `project`, `brandSource`,
`hosts`, `artifactDir`, `entry` (`theme` | `integrate` | `debug`), `baseTheme`,
`maxFixRounds`, and `hint`. For local development, from this directory:
`claude --plugin-dir .`.

### Codex

The `.codex-plugin/plugin.json` manifest exposes the shared skills and MCP server.
Codex does not run Claude Code workflows, so ask the main session to coordinate
the three specialists in order. Named custom agent definitions are bundled in
`codex/agents/`; these are project agents, not an undocumented plugin manifest field.
From this plugin directory, preview and install them into your app project:

```bash
python3 scripts/install_codex_agents.py --project /path/to/app
python3 scripts/install_codex_agents.py --project /path/to/app --apply
```

Requires Python 3.11+. Existing differing agent files are reported as conflicts
before any writes. The installer leaves other project settings intact and binds
skill paths to this plugin directory. Keep that directory available; if it moves,
review the installed definitions and reinstall. Start a new Codex session in the
app project to discover the named agents. Without registration, the main session
can still dispatch workers with the same specialist prompts when delegation is enabled.

### Gemini CLI

This directory is also an extension root (`gemini-extension.json`), sharing the
same skills, Markdown agents, and MCP server. From this directory:

```bash
gemini extensions link .
```

Start a fresh Gemini CLI session and ask it to build a branded MCP App; `GEMINI.md`
directs the session through the same three stages. Agent support is a preview
feature; it must be enabled in the installed CLI. If disabled, the main session
reports that it is executing stages without isolated subagents.

### Validation

```bash
python3 scripts/validate_agents.py
python3 -m unittest discover -s scripts -p 'test_*.py'
claude plugin validate .
```

These validate packaging and installation behavior, not actual desktop rendering.
The generated app workflow separately requires host-specific verification evidence.

Agent formats follow the official [Claude Code subagent documentation](https://code.claude.com/docs/en/sub-agents),
[Codex custom agent documentation](https://developers.openai.com/codex/subagents),
and [Gemini extension documentation](https://geminicli.com/docs/extensions/reference/).
