# Feedback Components

8 components for user feedback and status indicators.

## cre8-alert

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `'info' \| 'success' \| 'warning' \| 'error'` | "info" | Alert type |
| `headline` | string | - | Alert title |
| `dismissible` | boolean | - | Show close button |

```html
<cre8-alert variant="success" headline="Success!" dismissible>Your changes have been saved.</cre8-alert>
<cre8-alert variant="error" headline="Error">Something went wrong.</cre8-alert>
<cre8-alert variant="warning">Your session will expire in 5 minutes.</cre8-alert>
```

---

## cre8-modal

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `isActive` | boolean | - | Modal visibility |
| `headline` | string | - | Modal title |
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | "md" | Modal width |

```html
<cre8-modal isActive headline="Confirm Delete" size="sm">
  <p>Are you sure? This cannot be undone.</p>
  <cre8-button-group slot="footer">
    <cre8-button text="Cancel" variant="secondary"></cre8-button>
    <cre8-danger-button text="Delete"></cre8-danger-button>
  </cre8-button-group>
</cre8-modal>
```

---

## cre8-loading-spinner

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg'` | "md" | Spinner size |
| `label` | string | "Loading" | Accessible label |

```html
<cre8-loading-spinner size="lg" label="Loading results"></cre8-loading-spinner>
```

---

## cre8-progress-bar

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `value` | number | 0 | Progress 0-100 |
| `showLabel` | boolean | - | Show percentage |
| `indeterminate` | boolean | - | Unknown progress |

```html
<cre8-progress-bar value="65" showLabel label="Upload progress"></cre8-progress-bar>
```

---

## cre8-empty-state

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `headline` | string | - | Empty state title |
| `description` | string | - | Explanatory text |

```html
<cre8-empty-state headline="No results found" description="Try adjusting your filters.">
  <cre8-button text="Clear filters" variant="secondary"></cre8-button>
</cre8-empty-state>
```
