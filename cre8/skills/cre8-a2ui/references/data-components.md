# Data Display Components

17 components for data visualization and content display.

## cre8-card

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `'default' \| 'elevated' \| 'outlined'` | "default" | Card style |
| `href` | string | - | Makes card clickable |
| `padding` | `'none' \| 'sm' \| 'md' \| 'lg'` | "md" | Content padding |

**Slots:** `default`, `header`, `body`, `footer`, `media`

```html
<cre8-card>
  <img slot="media" src="image.jpg" alt="Card image">
  <div slot="body">
    <cre8-heading tagVariant="h3">Card Title</cre8-heading>
    <cre8-text-passage>Card description.</cre8-text-passage>
  </div>
  <cre8-button slot="footer" text="Learn More" variant="tertiary"></cre8-button>
</cre8-card>
```

---

## cre8-table

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `striped` | boolean | - | Alternating row colors |
| `hoverable` | boolean | - | Row hover effect |
| `compact` | boolean | - | Reduced padding |

```html
<cre8-table striped hoverable>
  <thead>
    <tr><th>Name</th><th>Email</th><th>Role</th></tr>
  </thead>
  <tbody>
    <tr><td>John Doe</td><td>john@example.com</td><td>Admin</td></tr>
  </tbody>
</cre8-table>
```

---

## cre8-badge

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `'default' \| 'success' \| 'warning' \| 'error' \| 'info' \| 'brand'` | "default" | Color variant |

```html
<cre8-badge variant="success">Active</cre8-badge>
<cre8-badge variant="warning">Pending</cre8-badge>
<cre8-badge variant="error" pill>3</cre8-badge>
```

---

## cre8-stat

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | - | **Required.** Stat label |
| `value` | string | - | **Required.** Stat value |
| `change` | string | - | Change indicator |
| `changeType` | `'positive' \| 'negative' \| 'neutral'` | - | Change direction |

```html
<cre8-stat label="Total Revenue" value="$124,500" change="+12.5%" changeType="positive"></cre8-stat>
```

---

## cre8-accordion

```html
<cre8-accordion>
  <cre8-accordion-item headline="What is your refund policy?" isOpen>
    We offer a 30-day money-back guarantee.
  </cre8-accordion-item>
  <cre8-accordion-item headline="How do I cancel?">
    Cancel anytime from your account settings.
  </cre8-accordion-item>
</cre8-accordion>
```

---

## cre8-avatar

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `src` | string | - | Image URL |
| `initials` | string | - | Fallback initials |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | "md" | Avatar size |
| `status` | `'online' \| 'offline' \| 'busy' \| 'away'` | - | Status indicator |

```html
<cre8-avatar src="user.jpg" alt="John Doe" size="lg" status="online"></cre8-avatar>
<cre8-avatar initials="JD" size="md"></cre8-avatar>
```
