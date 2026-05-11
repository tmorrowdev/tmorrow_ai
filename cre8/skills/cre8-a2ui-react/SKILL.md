---
name: cre8-a2ui-react
description: Agent-to-UI schema for CRE8 React Components (@tmorrow/cre8-react). Use when building React UIs with CRE8/Innovexa design system, generating React pages or applications using Cre8* components, creating landing pages, dashboards, forms, or any React UI with the CRE8 component library. Triggers on requests mentioning CRE8 React, @tmorrow/cre8-react, Innovexa React components, or building React UI with the CRE8 design system. Provides 72 React components with props, patterns, and usage examples.
---

# CRE8 A2UI React — Agent-to-UI Schema

React component library for the CRE8 design system. 72 components organized by category.

## REQUIRED WORKFLOW

**You MUST follow this workflow for all CRE8 React UI generation tasks:**

### 1. Pre-Generation: UI Validation

Before writing any code, validate the UI design:

- Use the `/ui-designer` skill or UI design validator to review the proposed interface
- Confirm component selection matches the use case
- Verify layout structure follows CRE8 patterns
- Check accessibility requirements are addressed

### 2. Code Generation

Generate the React components using CRE8 React following this schema.

### 3. Post-Generation: Visual & DevTools Testing (MANDATORY)

**After code generation is complete, you MUST perform visual and DevTools testing before marking the task as complete.**

Use Chrome DevTools MCP to:
- Open the React app in Chrome
- Verify all components render correctly
- Check for console errors or warnings
- Inspect responsive behavior at different viewport sizes
- Test component interactivity (buttons, forms, modals)

### 4. Verification Checklist

Before marking complete, confirm:
- [ ] UI design was validated before generation
- [ ] React app compiles without errors
- [ ] All CRE8 components render with proper styling
- [ ] Design tokens CSS is properly imported
- [ ] No console errors related to missing dependencies
- [ ] Interactive elements function correctly
- [ ] Layout is responsive

## System Overview

```yaml
library: "@tmorrow/cre8-react"
version: "1.0.0"
framework: React
componentCount: 72
naming: PascalCase (Cre8Button, Cre8Card, etc.)
```

## Required Setup

```bash
npm install @tmorrow/cre8-react @cre8_dev/cre8-design-tokens
```

Add to app entry point:

```tsx
import '@cre8_dev/cre8-design-tokens/lib/web/brands/cre8/css/tokens_cre8.css';
```

## Component Categories

| Category | Count | Key Components |
|----------|-------|----------------|
| Actions | 2 | Cre8Button, Cre8DangerButton |
| Forms | 10 | Cre8Field, Cre8Select, Cre8CheckboxField, Cre8RadioField, Cre8DatePicker |
| Layout | 10 | Cre8Layout, Cre8Card, Cre8Grid, Cre8Section, Cre8Hero, Cre8Band |
| Typography | 3 | Cre8Heading, Cre8TextPassage, Cre8TextLink |
| Navigation | 16 | Cre8Header, Cre8Footer, Cre8GlobalNav, Cre8PrimaryNav, Cre8Tabs, Cre8Breadcrumbs |
| Disclosure | 7 | Cre8Accordion, Cre8Modal, Cre8Dropdown, Cre8Popover, Cre8Tooltip |
| Feedback | 7 | Cre8Alert, Cre8Badge, Cre8LoadingSpinner, Cre8ProgressMeter |
| Data | 14 | Cre8Table, Cre8List, Cre8LinkList, Cre8Tag, Cre8Chart |

## Quick Patterns

### Page Layout
```jsx
<Cre8Layout>
  <Cre8Header>
    <Cre8GlobalNav>
      <Cre8GlobalNavItem href="/">Home</Cre8GlobalNavItem>
    </Cre8GlobalNav>
  </Cre8Header>
  <main>
    <Cre8LayoutContainer>{/* Page content */}</Cre8LayoutContainer>
  </main>
  <Cre8Footer />
</Cre8Layout>
```

### Login Form
```jsx
<Cre8Card>
  <Cre8Heading type="h2">Sign In</Cre8Heading>
  <Cre8Field label="Email" type="email" />
  <Cre8Field label="Password" type="password" />
  <Cre8Button text="Sign In" variant="primary" fullWidth />
</Cre8Card>
```

## Reference Files

Load component details as needed:

- **[references/actions.md](references/actions.md)** — Cre8Button, Cre8DangerButton
- **[references/forms.md](references/forms.md)** — Field, Select, Checkbox, Radio, DatePicker
- **[references/layout.md](references/layout.md)** — Layout, Card, Grid, Section, Hero, Band
- **[references/navigation.md](references/navigation.md)** — Header, Footer, Nav, Tabs, Breadcrumbs
- **[references/disclosure.md](references/disclosure.md)** — Accordion, Modal, Dropdown, Popover, Tooltip
- **[references/feedback.md](references/feedback.md)** — Alert, Badge, LoadingSpinner, Progress
- **[references/data.md](references/data.md)** — Table, List, LinkList, Tag, Chart
