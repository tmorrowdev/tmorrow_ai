export const meta = {
  name: 'workflow-themed-mcp-app',
  description: 'Theme, build, and verify a branded CRE8 MCP App across Claude Desktop and ChatGPT.',
  whenToUse:
    'Use for an end-to-end branded CRE8 MCP App: brand extraction, ext-apps integration, and per-host rendering verification. Also use to re-verify or repair an existing app by entering at the integrate or debug stage.',
  phases: [
    { title: 'Scope', detail: 'Inspect the project, resolve plugin root, hosts, and entry stage' },
    { title: 'Theme', detail: 'cre8-brand-themer: theme.css + brand-handoff.md' },
    { title: 'Integrate', detail: 'cre8-mcp-app-builder: server, UI, integration-handoff.md' },
    { title: 'Verify', detail: 'cre8-mcp-render-debugger: one lane per requested host' },
    { title: 'Audit', detail: 'Independent skeptics refute unevidenced pass claims' },
    { title: 'Fix', detail: 'Bounded repair rounds, re-verifying hosts that shared code touched' },
    { title: 'Report', detail: 'Consolidated handoff with per-host status' },
  ],
}

// ---------------------------------------------------------------------------
// Config. Overridable via args so the caller can dial scope without editing.
// ---------------------------------------------------------------------------

const input = args || {}
const DEFAULT_HOSTS = ['Claude Desktop', 'ChatGPT']
const MAX_FIX_ROUNDS = typeof input.maxFixRounds === 'number' ? input.maxFixRounds : 2

// Two independent lenses on the first pass; the single highest-value lens on
// re-checks, to keep repair rounds affordable. Reductions are logged, never silent.
const SKEPTIC_LENSES = ['evidence', 'host-reality']
const RECHECK_LENSES = ['host-reality']

// Severity ordering for downgrades. A skeptic may only move a claim DOWN this
// list, never up: pass < unsupported < unverified < fail. When two skeptics
// disagree, the most severe correction wins.
const SEVERITY = { pass: 0, unsupported: 1, unverified: 2, fail: 3 }

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------

const SCOPE_SCHEMA = {
  type: 'object',
  properties: {
    pluginRoot: { type: 'string', description: 'Absolute path to the cre8 plugin root (the directory containing skills/ and agents/)' },
    project: { type: 'string', description: 'Absolute path to the target project' },
    artifactDir: { type: 'string', description: 'Absolute artifact directory; project convention if one exists, else <project>/artifacts/cre8-mcp-app' },
    useCase: { type: 'string' },
    stack: { type: 'string', description: 'e.g. python-fastmcp, typescript-mcp, unknown' },
    usesReact: { type: 'boolean' },
    hosts: { type: 'array', items: { type: 'string' } },
    brandSource: { type: 'string', description: 'URL, image, or document path. Empty string if none available.' },
    hasVerifiedTheme: { type: 'boolean' },
    hasExistingServer: { type: 'boolean' },
    entry: { type: 'string', enum: ['theme', 'integrate', 'debug'] },
    blockers: { type: 'array', items: { type: 'string' } },
  },
  required: ['pluginRoot', 'project', 'artifactDir', 'hosts', 'entry', 'brandSource', 'hasVerifiedTheme', 'blockers'],
}

const THEME_SCHEMA = {
  type: 'object',
  properties: {
    themeCss: { type: 'string', description: 'Absolute path to theme.css' },
    brandHandoff: { type: 'string', description: 'Absolute path to brand-handoff.md' },
    packageVersion: { type: 'string' },
    importPath: { type: 'string' },
    visualChecks: { type: 'string', enum: ['verified', 'unverified'] },
    assumptions: { type: 'array', items: { type: 'string' } },
    blockers: { type: 'array', items: { type: 'string' } },
  },
  required: ['themeCss', 'brandHandoff', 'visualChecks', 'blockers'],
}

const INTEGRATION_SCHEMA = {
  type: 'object',
  properties: {
    integrationHandoff: { type: 'string', description: 'Absolute path to integration-handoff.md' },
    changedFiles: { type: 'array', items: { type: 'string' } },
    resourceUri: { type: 'string' },
    toolNames: { type: 'array', items: { type: 'string' } },
    buildCommand: { type: 'string' },
    startCommand: { type: 'string' },
    reproPath: { type: 'string', description: 'Exact reproduction path for the debugger' },
    buildPassed: { type: 'boolean' },
    blockers: { type: 'array', items: { type: 'string' } },
  },
  required: ['integrationHandoff', 'changedFiles', 'buildPassed', 'blockers'],
}

const SCENARIO_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string' },
    status: { type: 'string', enum: ['pass', 'fail', 'unverified', 'unsupported'] },
    evidence: { type: 'string', description: 'Concrete artifact path, log excerpt, or screenshot path. Empty if none.' },
    observedOn: { type: 'string', enum: ['real-host', 'local-harness', 'none'] },
    rootCause: { type: 'string' },
  },
  required: ['name', 'status', 'evidence', 'observedOn'],
}

const VERIFY_SCHEMA = {
  type: 'object',
  properties: {
    host: { type: 'string' },
    client: { type: 'string' },
    version: { type: 'string' },
    reportPath: { type: 'string', description: 'Absolute path to render-report.md' },
    scenarios: { type: 'array', items: SCENARIO_SCHEMA },
    changedSharedFiles: { type: 'array', items: { type: 'string' } },
    blockers: { type: 'array', items: { type: 'string' } },
  },
  required: ['host', 'scenarios', 'changedSharedFiles', 'blockers'],
}

const AUDIT_SCHEMA = {
  type: 'object',
  properties: {
    rulings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          scenario: { type: 'string' },
          upheld: { type: 'boolean', description: 'true only if the pass claim is backed by cited first-hand evidence' },
          correctedStatus: { type: 'string', enum: ['pass', 'fail', 'unverified', 'unsupported'] },
          reason: { type: 'string' },
        },
        required: ['scenario', 'upheld', 'correctedStatus', 'reason'],
      },
    },
  },
  required: ['rulings'],
}

const FIX_SCHEMA = {
  type: 'object',
  properties: {
    fixed: { type: 'array', items: { type: 'string' } },
    changedFiles: { type: 'array', items: { type: 'string' } },
    touchedSharedCode: { type: 'boolean', description: 'true if the fix changed code shared across hosts' },
    stillFailing: { type: 'array', items: { type: 'string' } },
    newEvidence: { type: 'boolean', description: 'false if this round produced no new diagnostic information' },
    blockers: { type: 'array', items: { type: 'string' } },
  },
  required: ['changedFiles', 'touchedSharedCode', 'stillFailing', 'newEvidence', 'blockers'],
}

// ---------------------------------------------------------------------------
// Prompt helpers. Every specialist gets the full handoff context the agent
// definitions require: plugin root, project, artifact dir, prior artifacts,
// file ownership, and acceptance criteria.
// ---------------------------------------------------------------------------

function contextBlock(scope, hosts) {
  return [
    'Shared context (authoritative - do not re-derive):',
    '- Plugin root: ' + scope.pluginRoot,
    '- Target project: ' + scope.project,
    '- Artifact directory: ' + scope.artifactDir,
    '- Use case: ' + (scope.useCase || 'see project inspection'),
    '- Stack: ' + (scope.stack || 'unknown') + (scope.usesReact ? ' (React)' : ''),
    '- Requested hosts: ' + hosts.join(', '),
    '',
    'Child sessions may start in a different directory, so treat every path above as absolute.',
  ].join('\n')
}

function scopePrompt() {
  return [
    'You are scoping a CRE8 MCP App build. Inspect only - change nothing.',
    '',
    'Establish and return:',
    '1. pluginRoot - absolute path to the cre8 plugin root: the directory containing both skills/ and agents/, with agents/cre8-brand-themer.md present. Verify it exists.',
    '2. project - absolute path to the target project.',
    '3. artifactDir - the project existing artifact convention if there is one, otherwise <project>/artifacts/cre8-mcp-app.',
    '4. useCase, stack (python-fastmcp / typescript-mcp / unknown), usesReact.',
    '5. hosts - which chat hosts are targeted. Default to both Claude Desktop and ChatGPT when the request implies both.',
    '6. brandSource - a brand URL, image, or document. Return an empty string if genuinely none is available. Never invent one.',
    '7. hasVerifiedTheme - whether a previously verified theme.css plus brand-handoff.md already exist in artifactDir.',
    '8. hasExistingServer - whether a runnable MCP server already exists.',
    '9. entry - theme if the brand work is not done; integrate if a verified theme exists but the server does not; debug if both exist and only verification/repair is wanted.',
    '10. blockers - anything that prevents progress.',
    '',
    input.hint ? 'Caller hint (authoritative where it conflicts with inference): ' + input.hint : '',
    input.project ? 'Caller specified project: ' + input.project : '',
    input.brandSource ? 'Caller specified brand source: ' + input.brandSource : '',
    input.artifactDir ? 'Caller specified artifact directory: ' + input.artifactDir : '',
    input.entry ? 'Caller specified entry stage: ' + input.entry : '',
  ].filter(Boolean).join('\n')
}

function themePrompt(scope, hosts) {
  return [
    'Extract and verify the CRE8 brand theme for this MCP App.',
    '',
    contextBlock(scope, hosts),
    '- Brand source: ' + (scope.brandSource || '(none supplied)'),
    '- Requested base theme: ' + (input.baseTheme || 'seed-driven whitelabel base'),
    '',
    'You own theme.css and brand-handoff.md in the artifact directory. No other file is yours.',
    '',
    'Acceptance criteria:',
    '- theme.css and brand-handoff.md exist at absolute paths you return.',
    '- brand-handoff.md records installed package version, verified import path, source evidence, inferred values, defaults, font assets/domains, CSS load order, and component overrides.',
    '- The base import and overrides are reusable in BOTH host builds.',
    '- Contrast findings and unresolved font substitutions are stated.',
    '- Set visualChecks to verified only if you actually inspected computed styles and a rendered button, badge, and body text. Otherwise unverified.',
    '',
    'If the brand source is missing or unusable, return the specific missing input in blockers and do not invent a brand.',
    'Do not start the integration agent. Return to the parent.',
  ].join('\n')
}

function integratePrompt(scope, hosts, theme) {
  return [
    'Build the branded CRE8 MCP App server and embedded UI for the requested hosts.',
    '',
    contextBlock(scope, hosts),
    '',
    'Theme artifacts from the brand stage (consume these first):',
    '- theme.css: ' + (theme ? theme.themeCss : '(reusing the existing verified theme in the artifact directory)'),
    '- brand-handoff.md: ' + (theme ? theme.brandHandoff : '(reusing the existing verified brand handoff)'),
    theme && theme.assumptions && theme.assumptions.length
      ? '- Theme assumptions you must preserve: ' + theme.assumptions.join('; ')
      : '',
    theme && theme.visualChecks === 'unverified'
      ? '- NOTE: theme visual checks were NOT verified. Do not describe the theme as visually confirmed.'
      : '',
    '',
    'You own the server, the embedded UI, and integration-handoff.md. Do not edit theme.css; return token disputes to the parent.',
    '',
    'Acceptance criteria:',
    '- Preserve the existing stack and the user-selected theme. Do not switch languages silently.',
    '- Shared MCP Apps UI on the standard ext-apps bridge; host-specific extensions isolated and capability-gated.',
    '- Do not wrap the legacy page shell and claim it implements MCP Apps.',
    '- Implement resource registration, tool-to-resource linking, initial and subsequent tool results, loading/empty/error states, and at least one interaction round trip.',
    '- Bundle theme, fonts, and component assets, or declare exact CSP origins.',
    '- Verify custom element upgrades and chart property initialization.',
    '- integration-handoff.md records changed files, dependency versions, resource URI, tool names and argument schemas, theme path, build/start commands, transports, CSP needs, and separate Claude Desktop and ChatGPT connection instructions.',
    '- Set buildPassed only from an actually executed build. Record the exact reproduction path the debugger will use.',
    '',
    'Return to the parent for dispatch. Do not start the debugger yourself.',
  ].filter(Boolean).join('\n')
}

function verifyPrompt(scope, hosts, host, integration, theme, round) {
  return [
    round > 0
      ? 'Re-verify this host after repair round ' + round + '.'
      : 'Reproduce, fix, and verify rendering and interaction for ONE host.',
    '',
    'Host under test: ' + host + '. Report on this host only.',
    '',
    contextBlock(scope, hosts),
    '',
    'Handoffs to consume first:',
    '- brand-handoff.md: ' + (theme ? theme.brandHandoff : '(in the artifact directory)'),
    '- integration-handoff.md: ' + (integration ? integration.integrationHandoff : '(in the artifact directory)'),
    integration && integration.reproPath ? '- Reproduction path: ' + integration.reproPath : '',
    integration && integration.startCommand ? '- Start command: ' + integration.startCommand : '',
    '',
    'Trace in order: MCP connection, tool metadata/resource URI, resources/read MIME and HTML, iframe asset loading and CSP, bridge initialization, tool-result delivery, component upgrade, theme cascade, layout/resize, callback round trip.',
    '',
    'Cover these scenarios and return one row each: narrow layout, wide layout, host light context, host dark context, long content and iframe height, focus/keyboard behavior, loading state, empty state, error state, initial data, subsequent data, callback round trip.',
    '',
    'Status rules, enforced downstream by an independent auditor:',
    '- pass requires that you OBSERVED it. Set observedOn to real-host or local-harness accordingly, and cite concrete evidence (log excerpt, screenshot path, or artifact path).',
    '- A local harness success is NOT desktop verification. If you only ran the harness, observedOn is local-harness.',
    '- If you could not observe it at all, status is unverified and observedOn is none. Do not guess.',
    '- unsupported is for capability the host genuinely lacks.',
    '- Never report this host as passed without observing it. Do not require nonexistent desktop automation tools.',
    '',
    'Make the smallest supported fix for anything you can repair, and list any shared (cross-host) files you changed in changedSharedFiles. Write render-report.md and return its absolute path.',
  ].filter(Boolean).join('\n')
}

function auditPrompt(host, report, claims, lens) {
  const lensBrief =
    lens === 'evidence'
      ? 'Your lens is EVIDENCE. For each claim ask: is there a concrete, first-hand artifact cited - a log excerpt, screenshot path, or artifact path? Absent or vague evidence means the claim is not upheld.'
      : 'Your lens is HOST REALITY. For each claim ask: was this observed on the actual host, or only in a local harness or by inference? A local-harness observation is not evidence for desktop behaviour. Web success is not proof of desktop support.'

  return [
    'You are an independent auditor. You did NOT perform this work, and you are not here to be agreeable.',
    'Your job is to REFUTE pass claims that are not backed by observation.',
    '',
    lensBrief,
    '',
    'Host: ' + host,
    'Claimed passing scenarios, with the reporter own evidence and observation fields:',
    JSON.stringify(claims, null, 2),
    '',
    'Full report context:',
    JSON.stringify({ client: report.client, version: report.version, reportPath: report.reportPath, blockers: report.blockers }, null, 2),
    '',
    'For every scenario above return a ruling:',
    '- upheld true only if the evidence genuinely supports a pass under your lens.',
    '- Otherwise upheld false, and set correctedStatus to what the evidence actually supports: unverified when the outcome is simply unknown, unsupported when the host cannot do it, fail when the evidence shows it broken.',
    '- correctedStatus may only be equal to or more severe than the claim. Never upgrade a claim.',
    '- Default to NOT upheld when you are uncertain. A downgrade costs a re-check; a false pass ships broken.',
    '- reason must be one concrete sentence naming what is missing or contradictory.',
  ].join('\n')
}

function fixPrompt(scope, hosts, state, round, integration, theme) {
  const failing = state.scenarios.filter((s) => s.status === 'fail')
  return [
    'Repair round ' + round + ' for host ' + state.host + '.',
    '',
    contextBlock(scope, hosts),
    '',
    'Handoffs:',
    '- brand-handoff.md: ' + (theme ? theme.brandHandoff : '(in the artifact directory)'),
    '- integration-handoff.md: ' + (integration ? integration.integrationHandoff : '(in the artifact directory)'),
    state.reportPath ? '- Previous render report: ' + state.reportPath : '',
    '',
    'Failing scenarios to repair:',
    JSON.stringify(failing, null, 2),
    '',
    'Make the SMALLEST supported fix for each and rerun the failing scenario. Preserve brand intent; return token interpretation disputes to the parent rather than editing theme.css yourself.',
    'Do not claim a repair you did not observe working. Do not loop on a host you cannot access.',
    '',
    'Set touchedSharedCode true if you changed anything used by the other host - the parent uses this to decide whether to re-verify them.',
    'Set newEvidence false if this round produced no new diagnostic information; the parent stops retrying rather than burning rounds on an unavailable host.',
  ].filter(Boolean).join('\n')
}

// ---------------------------------------------------------------------------
// Ruling application
// ---------------------------------------------------------------------------

function applyRulings(report, panels) {
  const downgrades = new Map()
  for (const panel of panels) {
    for (const ruling of panel.rulings || []) {
      if (ruling.upheld) continue
      const corrected = ruling.correctedStatus
      if (!(corrected in SEVERITY)) continue
      const prev = downgrades.get(ruling.scenario)
      if (!prev || SEVERITY[corrected] > SEVERITY[prev.correctedStatus]) downgrades.set(ruling.scenario, ruling)
    }
  }

  let changed = 0
  const scenarios = report.scenarios.map((s) => {
    const d = downgrades.get(s.name)
    // A skeptic may only move a claim down the severity ladder, never up.
    if (!d || SEVERITY[d.correctedStatus] <= SEVERITY[s.status]) return s
    changed++
    return Object.assign({}, s, {
      status: d.correctedStatus,
      downgradedFrom: s.status,
      downgradeReason: d.reason,
    })
  })

  if (changed > 0) log(report.host + ': ' + changed + ' pass claim(s) downgraded by audit')
  return Object.assign({}, report, { scenarios: scenarios })
}

function statusCounts(state) {
  const c = { pass: 0, fail: 0, unverified: 0, unsupported: 0 }
  for (const s of state.scenarios) if (s.status in c) c[s.status]++
  return c
}

// ---------------------------------------------------------------------------
// Verification lane: verify then independently audit, one lane per host.
// pipeline() so ChatGPT can be auditing while Claude Desktop is still verifying.
// ---------------------------------------------------------------------------

async function runVerification(hostList, scope, hosts, integration, theme, round, lenses) {
  const lanes = await pipeline(
    hostList,
    (host) =>
      agent(verifyPrompt(scope, hosts, host, integration, theme, round), {
        label: round > 0 ? 'reverify:' + host : 'verify:' + host,
        phase: 'Verify',
        agentType: 'cre8:cre8-mcp-render-debugger',
        schema: VERIFY_SCHEMA,
      }),
    async (report, host) => {
      if (!report) {
        log('Verification lane for ' + host + ' returned nothing - treating host as unverified.')
        return null
      }
      const claims = report.scenarios.filter((s) => s.status === 'pass')
      if (claims.length === 0) return applyRulings(report, [])

      // Independent auditors: deliberately NOT the debugger agent that made the claims.
      const panels = await parallel(
        lenses.map((lens) => () =>
          agent(auditPrompt(host, report, claims, lens), {
            label: 'audit:' + host + ':' + lens,
            phase: 'Audit',
            schema: AUDIT_SCHEMA,
          })
        )
      )
      return applyRulings(report, panels.filter(Boolean))
    }
  )
  return lanes.filter(Boolean)
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

phase('Scope')
const scope = await agent(scopePrompt(), { label: 'scope', schema: SCOPE_SCHEMA })
if (!scope) return { status: 'aborted', reason: 'Scoping agent returned nothing; nothing was changed.' }

const hosts = input.hosts && input.hosts.length ? input.hosts : scope.hosts && scope.hosts.length ? scope.hosts : DEFAULT_HOSTS
const entry = input.entry || scope.entry
log('Plugin root ' + scope.pluginRoot + ' | project ' + scope.project + ' | hosts ' + hosts.join(', ') + ' | entry ' + entry)
if (scope.blockers && scope.blockers.length) log('Scope blockers: ' + scope.blockers.join('; '))

// Gate: never invent a brand. Enforced here rather than left to the themer.
if (entry === 'theme' && !scope.brandSource && !scope.hasVerifiedTheme) {
  return {
    status: 'blocked',
    stage: 'Theme',
    reason: 'No brand source supplied and no verified theme exists. Supply a brand URL, image, or document via args.brandSource.',
    scope: scope,
  }
}

let theme = null
if (entry === 'theme') {
  phase('Theme')
  theme = await agent(themePrompt(scope, hosts), {
    label: 'theme',
    agentType: 'cre8:cre8-brand-themer',
    schema: THEME_SCHEMA,
  })
  if (!theme) return { status: 'blocked', stage: 'Theme', reason: 'Brand themer returned nothing.', scope: scope }
  if (theme.blockers && theme.blockers.length && !theme.themeCss) {
    return { status: 'blocked', stage: 'Theme', reason: theme.blockers.join('; '), scope: scope, theme: theme }
  }
  if (theme.visualChecks === 'unverified') log('Theme visual checks are UNVERIFIED - this propagates to the final report.')
} else {
  log('Entering at ' + entry + ' - reusing the existing verified theme in ' + scope.artifactDir + '.')
}

let integration = null
if (entry === 'theme' || entry === 'integrate') {
  phase('Integrate')
  integration = await agent(integratePrompt(scope, hosts, theme), {
    label: 'integrate',
    agentType: 'cre8:cre8-mcp-app-builder',
    schema: INTEGRATION_SCHEMA,
  })
  if (!integration) return { status: 'blocked', stage: 'Integrate', reason: 'App builder returned nothing.', scope: scope, theme: theme }
  if (!integration.buildPassed) log('Build did NOT pass - verifying anyway to collect diagnostics.')
} else {
  log('Entering at debug - reusing the existing server and integration handoff.')
}

let states = await runVerification(hosts, scope, hosts, integration, theme, 0, SKEPTIC_LENSES)
if (states.length === 0) {
  return { status: 'blocked', stage: 'Verify', reason: 'No host produced a verification report.', scope: scope, theme: theme, integration: integration }
}

// ---------------------------------------------------------------------------
// Bounded repair loop. Stops on: clean, round cap, or no new evidence.
// ---------------------------------------------------------------------------

phase('Fix')
let round = 0
const fixLog = []

while (round < MAX_FIX_ROUNDS) {
  const failing = states.filter((s) => s.scenarios.some((x) => x.status === 'fail'))
  if (failing.length === 0) break

  round++
  log('Repair round ' + round + '/' + MAX_FIX_ROUNDS + ' for: ' + failing.map((s) => s.host).join(', '))

  const fixes = (await parallel(
    failing.map((state) => () =>
      agent(fixPrompt(scope, hosts, state, round, integration, theme), {
        label: 'fix:' + state.host + ':r' + round,
        phase: 'Fix',
        agentType: 'cre8:cre8-mcp-render-debugger',
        schema: FIX_SCHEMA,
      }).then((r) => (r ? Object.assign({}, r, { host: state.host }) : null))
    )
  )).filter(Boolean)

  if (fixes.length === 0) {
    log('Repair round ' + round + ' returned nothing - stopping.')
    break
  }
  fixLog.push({ round: round, fixes: fixes })

  if (!fixes.some((f) => f.newEvidence)) {
    log('No new evidence this round - stopping retries rather than looping on an unavailable host.')
    break
  }

  // Re-verify the repaired hosts, plus every other host if shared code moved.
  const sharedTouched = fixes.some((f) => f.touchedSharedCode)
  const repaired = fixes.map((f) => f.host)
  const toRecheck = sharedTouched ? hosts.slice() : repaired
  if (sharedTouched) log('Shared code changed - re-verifying all hosts, not just the repaired ones.')
  log('Re-check auditing uses the ' + RECHECK_LENSES.join(' + ') + ' lens only (first pass used ' + SKEPTIC_LENSES.join(' + ') + ').')

  const rechecked = await runVerification(toRecheck, scope, hosts, integration, theme, round, RECHECK_LENSES)
  if (rechecked.length === 0) {
    log('Re-verification produced no report - keeping the previous round results.')
    break
  }

  const byHost = new Map(states.map((s) => [s.host, s]))
  for (const r of rechecked) byHost.set(r.host, r)
  states = Array.from(byHost.values())
}

const stillFailing = states.filter((s) => s.scenarios.some((x) => x.status === 'fail'))
if (stillFailing.length > 0 && round >= MAX_FIX_ROUNDS) {
  log('Hit the ' + MAX_FIX_ROUNDS + '-round repair cap with ' + stillFailing.length + ' host(s) still failing - raise args.maxFixRounds to go further.')
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

phase('Report')

const perHost = states.map((s) => ({
  host: s.host,
  client: s.client,
  version: s.version,
  reportPath: s.reportPath,
  counts: statusCounts(s),
  scenarios: s.scenarios,
  blockers: s.blockers,
}))

const summary = await agent(
  [
    'Write the final handoff for this branded CRE8 MCP App. Report only what the data below supports.',
    '',
    contextBlock(scope, hosts),
    '',
    'Theme: ' + JSON.stringify(theme),
    'Integration: ' + JSON.stringify(integration),
    'Per-host verification after audit and ' + round + ' repair round(s): ' + JSON.stringify(perHost),
    'Repair log: ' + JSON.stringify(fixLog),
    '',
    'The handoff must include: runnable project paths, build/start commands, theme evidence, per-host connection instructions, and a per-host/scenario status table.',
    '',
    'Honesty rules, non-negotiable:',
    '- Statuses above are post-audit. A scenario carrying downgradedFrom was claimed as passing and refuted; report the corrected status and say why.',
    '- Keep local harness success distinct from real desktop verification.',
    '- Do NOT claim both hosts work when either is unverified or unsupported.',
    '- State remaining blockers and the exact manual verification steps for anything unverified.',
    '- Building the integration does not authorize publishing it or changing desktop settings; do not imply otherwise.',
  ].join('\n'),
  { label: 'handoff', phase: 'Report' }
)

return {
  status: stillFailing.length > 0 ? 'completed-with-failures' : 'completed',
  entry: entry,
  hosts: hosts,
  repairRounds: round,
  scope: scope,
  theme: theme,
  integration: integration,
  perHost: perHost,
  fixLog: fixLog,
  handoff: summary,
}
