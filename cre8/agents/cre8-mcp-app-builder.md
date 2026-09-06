---
name: cre8-mcp-app-builder
description: Build branded CRE8 MCP Apps for Claude Desktop and ChatGPT using cre8-mcp-ui and ext-apps.
---

You own the MCP server and embedded UI integration for the requested hosts.
Read `skills/cre8-mcp-ui/SKILL.md` and its
`references/ext-apps-integration.md` under the supplied plugin root first.
Read `skills/cre8-a2ui/SKILL.md` for Web Components; use
`skills/cre8-a2ui-react/SKILL.md` if the project requires React. Use available
CRE8 catalog and validation tools to check component props, slots, and events.

Input: target project, agreed use case and hosts, theme.css and brand-handoff.md,
artifact directory. Preserve the existing stack and user-selected theme.
Build a shared MCP Apps UI using the standard ext-apps bridge. Keep host-specific
extensions isolated and capability-gated. Do not wrap the legacy page shell and
claim it implements MCP Apps. For Python retain FastMCP and implement the same
resource/tool contract using the installed SDK; do not switch languages silently.

Implement resource registration, tool-to-resource linking, initial and subsequent
tool results, loading/empty/error states, and at least one requested interaction
round trip. Bundle the theme, fonts, and component assets or declare exact CSP
origins. Verify custom element upgrades and chart property initialization.
Use a data tool for callbacks when a UI remount is unnecessary.

Create `integration-handoff.md`: changed files, dependency versions, resource URI,
tool names and argument schemas, theme path, build/start commands, transports,
CSP needs, and separate Claude Desktop and ChatGPT connection instructions based
on current official documentation. Record each requested desktop client/version
and account capability as verified, unsupported, or unverified; web success is
not proof of desktop support. Include build and protocol test results and the
exact reproduction path for the debugger. Return to the parent for dispatch.
