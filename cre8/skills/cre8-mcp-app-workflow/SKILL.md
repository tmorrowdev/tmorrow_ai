---
name: cre8-mcp-app-workflow
description: Coordinate brand theming, MCP Apps integration, and rendering debugging for CRE8 apps in Claude Desktop and ChatGPT. Use for an end-to-end branded chat app or a request to orchestrate these specialist agents.
---

# Branded MCP Apps workflow

Run this workflow in the main session so it can dispatch specialist agents.
The plugin root is two directories above this skill directory. Resolve its
absolute path and pass it with every task; child sessions may start elsewhere.

## Entry and dispatch

Inspect the target project and establish the use case, brand source, requested
hosts, and existing artifacts. Default to both Claude Desktop and ChatGPT when
the user requests both chat integrations. Use the project's existing artifact
convention, otherwise `artifacts/cre8-mcp-app/`. Ask only for inputs that block
work; check current host availability while brand work proceeds.

| Stage | Agent | Required output |
| --- | --- | --- |
| Theme | cre8-brand-themer | theme.css, brand-handoff.md |
| Integration | cre8-mcp-app-builder | runnable server/UI, integration-handoff.md |
| Debug/verify | cre8-mcp-render-debugger | fixes, render-report.md |

Claude Code and Gemini CLI discover the plugin's `agents/*.md`. Select the
matching registered agent (Claude may namespace it as `cre8:<agent-name>`).
In Codex use the matching custom agent if installed. To register project agents,
run `python3 <plugin-root>/scripts/install_codex_agents.py --project <project>`.
It previews changes by default; add `--apply` to write the reviewed files within
the user's authorized scope. Start a new session if agent discovery requires it.
If custom agents are not registered but delegation is available, spawn a worker
with the complete body of the matching `agents/*.md` as its task instructions.
If delegation is unavailable, perform the same stages in the main session and
state that they ran sequentially without isolated agents.

## Handoffs and completion

Pass each agent the original requirements, target project, plugin root, artifact
directory, prior artifact paths, file ownership, and acceptance criteria. Read
its output before dispatching the next dependent stage. Specialists return to
the main session; do not ask them to spawn their successors. Avoid concurrent
writes to shared files.

For an existing app, reuse a verified theme and enter at integration or debugging
as appropriate. Missing brand input blocks theme extraction, but need not block
inspection of an existing server. If a check fails, route the reproduction and
evidence to the owning specialist, then rerun affected checks. Stop retries when
new evidence is unavailable and report the concrete blocker.

The final handoff includes runnable project paths, theme evidence, connection
instructions for each requested host, and a per-host rendering/interaction report.
Local harness success must stay distinct from desktop verification. Do not claim
both hosts work when either is unverified or unsupported. Building the integration
does not itself authorize publishing it or changing the user's desktop settings.
