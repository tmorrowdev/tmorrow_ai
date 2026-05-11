# Layout Components

10 components for page structure and containers.

## cre8-layout

Top-level page layout wrapper.

```html
<cre8-layout>
  <cre8-header>...</cre8-header>
  <cre8-main>...</cre8-main>
  <cre8-footer>...</cre8-footer>
</cre8-layout>
```

---

## cre8-layout-container

Max-width content container.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `size` | `'sm' \| 'md' \| 'lg' \| 'full'` | "lg" | Container width |

```html
<cre8-layout-container>
  <!-- Content constrained to max-width -->
</cre8-layout-container>
```

---

## cre8-section

Content section with optional headline.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `headline` | string | - | Section heading |

```html
<cre8-section headline="Features">
  <cre8-layout-container>
    <cre8-grid variant="3up">...</cre8-grid>
  </cre8-layout-container>
</cre8-section>
```

---

## cre8-band

Full-width background section.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `'branded'` | - | Brand background |

```html
<cre8-band variant="branded">
  <cre8-layout-container>
    <!-- Hero content -->
  </cre8-layout-container>
</cre8-band>
```

---

## cre8-grid

CSS Grid layout with preset patterns.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `variant` | `'side-by-side' \| '2up' \| '3up' \| '4up' \| '1-3up' \| '1-4up' \| '1-2-4up'` | - | Grid pattern |
| `gap` | `'none' \| 'sm' \| 'lg'` | - | Gutter size |

```html
<cre8-grid variant="3up" gap="lg">
  <cre8-card>...</cre8-card>
  <cre8-card>...</cre8-card>
  <cre8-card>...</cre8-card>
</cre8-grid>
```

---

## cre8-sidebar

Side navigation container.

```html
<cre8-layout variant="left-sidebar">
  <cre8-sidebar slot="sidebar" sticky collapsible>
    <cre8-vertical-nav>...</cre8-vertical-nav>
  </cre8-sidebar>
  <cre8-main>...</cre8-main>
</cre8-layout>
```
