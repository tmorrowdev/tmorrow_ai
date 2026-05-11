---
name: cre8-a2ui
description: Agent-to-UI schema for CRE8 Web Components (@tmorrow/cre8-wc). Use when building vanilla JS/HTML UIs with CRE8/Innovexa design system using cre8-* custom elements, creating static landing pages, or integrating with non-React frameworks. Triggers on requests mentioning CRE8 web components, cre8-wc, cre8-* elements, Lit components, or vanilla HTML with CRE8 design system. For React projects, use cre8-a2ui-react instead.
---

# CRE8 A2UI — Web Components Schema

Web Components (Lit) library for the CRE8 design system. Uses custom elements with `cre8-` prefix.

## REQUIRED WORKFLOW

**You MUST follow this workflow for all CRE8 UI generation tasks:**

### 1. Pre-Generation: UI Validation

Before writing any code, validate the UI design:

- Use the `/ui-designer` skill or UI design validator to review the proposed interface
- Confirm component selection matches the use case
- Verify layout structure follows CRE8 patterns
- Check accessibility requirements are addressed

### 2. Code Generation

Generate the HTML/CSS using CRE8 web components following this schema.

### 3. Post-Generation: Visual & DevTools Testing (MANDATORY)

**After code generation is complete, you MUST perform visual and DevTools testing before marking the task as complete.**

**Option A: Use `/chrome` skill** (if available)
```
/chrome
```
Then navigate to the generated HTML file and verify rendering.

**Option B: Use Chrome DevTools MCP**

If the user doesn't have browser automation configured, help them add this to their MCP settings:

```json
{
  "mcpServers": {
    "chrome-devtools": {
      "command": "npx",
      "args": ["-y", "chrome-devtools-mcp@latest"]
    }
  }
}
```

Then use Chrome DevTools MCP to:
- Open the generated HTML file in Chrome
- Verify all components render correctly
- Check for console errors or warnings
- Inspect responsive behavior at different viewport sizes
- Validate no missing design tokens or broken styles

### 4. Verification Checklist

Before marking complete, confirm:
- [ ] UI design was validated before generation
- [ ] HTML file opens without errors
- [ ] All CRE8 components render with proper styling
- [ ] No console errors related to missing dependencies
- [ ] Interactive elements (buttons, dropdowns, modals) function correctly
- [ ] Layout is responsive and doesn't break at common breakpoints

**DO NOT mark the task as complete until visual testing confirms the UI renders correctly.**

## System Overview

```yaml
library: "@tmorrow/cre8-wc"
framework: Web Components (Lit)
baseClass: Cre8Element
formBaseClass: Cre8FormElement  
prefix: cre8-
naming: kebab-case (cre8-button, cre8-card, etc.)
```

## Required Imports

Both the design tokens CSS and the web components script are required:

```html
<!-- 1. Design Tokens (REQUIRED) - must load before components -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@cre8_dev/cre8-design-tokens@1.0.3/lib/web/brands/cre8/css/tokens_cre8.css"/>

<!-- 2. CRE8 Web Components -->
<script type="module" src="https://cdn.jsdelivr.net/npm/@tmorrow/cre8-wc@1.0.26/cdn/cre8-wc.esm.js"></script>
```

**Important**: The design tokens stylesheet provides all CSS custom properties (`--cre8-*`) that components depend on. Without it, components will render without proper styling.

## Usage

```html
<!-- Use components as custom elements -->
<cre8-button text="Submit" variant="primary"></cre8-button>
```

## Component Mapping (Web Components ↔ React)

| Web Component | React Component | Category |
|---------------|-----------------|----------|
| `<cre8-button>` | `<Cre8Button>` | Actions |
| `<cre8-danger-button>` | `<Cre8DangerButton>` | Actions |
| `<cre8-field>` | `<Cre8Field>` | Forms |
| `<cre8-select>` | `<Cre8Select>` | Forms |
| `<cre8-card>` | `<Cre8Card>` | Layout |
| `<cre8-grid>` | `<Cre8Grid>` | Layout |
| `<cre8-heading>` | `<Cre8Heading>` | Typography |
| `<cre8-alert>` | `<Cre8Alert>` | Feedback |
| `<cre8-modal>` | `<Cre8Modal>` | Disclosure |
| `<cre8-table>` | `<Cre8Table>` | Data |

## Quick Patterns

### Page Structure
```html
<cre8-layout>
  <cre8-header>
    <cre8-global-nav>
      <cre8-global-nav-item href="/">Home</cre8-global-nav-item>
    </cre8-global-nav>
  </cre8-header>
  <main>
    <cre8-layout-container>
      <!-- Content -->
    </cre8-layout-container>
  </main>
  <cre8-footer></cre8-footer>
</cre8-layout>
```

### Form
```html
<cre8-card>
  <cre8-heading type="h2">Sign In</cre8-heading>
  <cre8-field label="Email" type="email"></cre8-field>
  <cre8-field label="Password" type="password"></cre8-field>
  <cre8-button text="Sign In" variant="primary" full-width></cre8-button>
</cre8-card>
```

## Reference Files

Component details match the React version with kebab-case naming:

- **[references/tokens.md](references/tokens.md)** — Design token reference
- **[references/form-components.md](references/form-components.md)** — Form elements
- **[references/layout-components.md](references/layout-components.md)** — Layout elements
- **[references/navigation-components.md](references/navigation-components.md)** — Navigation elements
- **[references/feedback-components.md](references/feedback-components.md)** — Feedback elements
- **[references/data-components.md](references/data-components.md)** — Data display elements
- **[references/utility-components.md](references/utility-components.md)** — Utility elements

## When to Use Web Components vs React

**Use Web Components (`cre8-a2ui`) when:**
- Building static HTML pages
- Integrating with vanilla JavaScript
- Using non-React frameworks (Vue, Angular, Svelte)
- Need framework-agnostic components

**Use React (`cre8-a2ui-react`) when:**
- Building React applications
- Need React-specific features (hooks, context)
- Working in a React codebase
