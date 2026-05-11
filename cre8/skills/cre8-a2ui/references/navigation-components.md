# Navigation Components

18 components for navigation patterns.

## cre8-primary-nav

Main site navigation bar.

```html
<cre8-primary-nav>
  <cre8-nav-item><cre8-link href="/features">Features</cre8-link></cre8-nav-item>
  <cre8-nav-item><cre8-link href="/pricing">Pricing</cre8-link></cre8-nav-item>
</cre8-primary-nav>
```

---

## cre8-vertical-nav

Sidebar vertical navigation.

```html
<cre8-vertical-nav>
  <cre8-vertical-nav-item href="/dashboard" icon="home" label="Dashboard" isActive></cre8-vertical-nav-item>
  <cre8-vertical-nav-item href="/analytics" icon="chart" label="Analytics"></cre8-vertical-nav-item>
</cre8-vertical-nav>
```

---

## cre8-tabs

Tabbed navigation container.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `'default' \| 'pills' \| 'underline'` | "default" | Visual style |

```html
<cre8-tabs variant="underline">
  <cre8-tab label="Overview" isSelected>
    <p>Overview content</p>
  </cre8-tab>
  <cre8-tab label="Features">
    <p>Features content</p>
  </cre8-tab>
</cre8-tabs>
```

---

## cre8-breadcrumbs

```html
<cre8-breadcrumbs>
  <cre8-breadcrumb-item href="/">Home</cre8-breadcrumb-item>
  <cre8-breadcrumb-item href="/products">Products</cre8-breadcrumb-item>
  <cre8-breadcrumb-item isCurrent>Widget Pro</cre8-breadcrumb-item>
</cre8-breadcrumbs>
```

---

## cre8-pagination

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `currentPage` | number | 1 | Current page |
| `totalPages` | number | - | **Required.** Total pages |

```html
<cre8-pagination currentPage="3" totalPages="10"></cre8-pagination>
```

---

## cre8-stepper

Multi-step progress indicator.

```html
<cre8-stepper currentStep="2">
  <cre8-step label="Account" completed></cre8-step>
  <cre8-step label="Profile" isActive></cre8-step>
  <cre8-step label="Review"></cre8-step>
</cre8-stepper>
```
