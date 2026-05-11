# Feedback Components

7 components for user feedback and status indicators.

## Cre8Alert

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `status` | `"info" \| "success" \| "warning" \| "error"` | "info" | Alert type |

```jsx
<Cre8Alert status="success">Your changes have been saved.</Cre8Alert>
<Cre8Alert status="error">Something went wrong.</Cre8Alert>
<Cre8Alert status="warning">Session expiring soon.</Cre8Alert>
<Cre8Alert status="info">New features available.</Cre8Alert>
```

---

## Cre8Badge

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | — | Badge text |
| `variant` | `"default" \| "success" \| "warning" \| "error"` | "default" | Badge style |

```jsx
<Cre8Badge text="Active" variant="success" />
<Cre8Badge text="Pending" variant="warning" />
<Cre8Badge text="Failed" variant="error" />
```

---

## Cre8LoadingSpinner

```jsx
<Cre8LoadingSpinner size="sm" />
<div style={{ display: 'flex', justifyContent: 'center', padding: '48px' }}>
  <Cre8LoadingSpinner size="lg" />
</div>
```

---

## Cre8ProgressMeter

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | number | — | Progress value 0-100 |

```jsx
<Cre8ProgressMeter value={65} />
```

---

## Form Feedback Pattern

```jsx
{status === 'success' && <Cre8Alert status="success">Message sent!</Cre8Alert>}
{status === 'error' && <Cre8Alert status="error">Something went wrong.</Cre8Alert>}
```
