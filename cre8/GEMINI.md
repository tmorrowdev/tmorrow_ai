# CRE8 extension

For a branded MCP App in Claude Desktop or ChatGPT, activate the
`cre8-mcp-app-workflow` skill. The main session coordinates the three agents in
`agents/`: cre8-brand-themer, cre8-mcp-app-builder, cre8-mcp-render-debugger.
Pass the installed extension root and absolute artifact paths to each agent.
Agents return to the main session between stages; they do not delegate recursively.
For standalone theming or rendering debugging, invoke only the relevant agent.
