# CRE8 extension

For a branded MCP App in Claude Desktop or ChatGPT, the main session coordinates
the three agents in `agents/` in order: cre8-brand-themer, cre8-mcp-app-builder,
cre8-mcp-render-debugger. Run theming first, then integration, then per-host
verification, reading each agent's handoff before dispatching the next.
Pass the installed extension root and absolute artifact paths to each agent.
Agents return to the main session between stages; they do not delegate recursively.
For standalone theming or rendering debugging, invoke only the relevant agent.
