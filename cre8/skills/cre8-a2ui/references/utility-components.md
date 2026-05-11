# Utility Components

Supporting structural components.

## cre8-header

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `sticky` | boolean | false | Fixed positioning |

**Slots:** `top`, `middle`, `bottom`

```html
<cre8-header sticky>
  <div slot="middle" style="display: flex; justify-content: space-between; align-items: center;">
    <cre8-logo href="/"></cre8-logo>
    <cre8-primary-nav>
      <cre8-nav-item><cre8-link href="/features">Features</cre8-link></cre8-nav-item>
    </cre8-primary-nav>
    <cre8-button text="Sign Up" variant="primary"></cre8-button>
  </div>
</cre8-header>
```

---

## cre8-footer

```html
<cre8-footer>
  <cre8-layout-container>
    <cre8-grid variant="4up" gap="lg">
      <div>
        <cre8-logo variant="inverse" href="/"></cre8-logo>
      </div>
      <div>
        <strong style="color: white;">Product</strong>
        <cre8-link-list inverted>
          <cre8-link href="/features">Features</cre8-link>
        </cre8-link-list>
      </div>
    </cre8-grid>
  </cre8-layout-container>
</cre8-footer>
```

---

## cre8-heading

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `tagVariant` | `'h1' \| 'h2' \| 'h3' \| 'h4' \| 'h5' \| 'h6'` | "h2" | Heading level |

```html
<cre8-heading tagVariant="h1">Page Title</cre8-heading>
<cre8-heading tagVariant="h2">Section Title</cre8-heading>
```

---

## cre8-form

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `novalidate` | boolean | false | Disable native validation |

**Events:** `cre8-submit`, `cre8-invalid`

```html
<cre8-form>
  <cre8-field label="Email" type="email" required></cre8-field>
  <cre8-field label="Password" type="password" required></cre8-field>
  <cre8-button type="submit" text="Sign In" variant="primary"></cre8-button>
</cre8-form>
```

---

## cre8-divider

```html
<cre8-divider></cre8-divider>
<cre8-divider orientation="vertical" style="height: 40px;"></cre8-divider>
```

---

## cre8-dropdown

```html
<cre8-dropdown>
  <cre8-button slot="trigger" text="Actions"></cre8-button>
  <cre8-menu slot="content">
    <cre8-menu-item>Edit</cre8-menu-item>
    <cre8-menu-item variant="danger">Delete</cre8-menu-item>
  </cre8-menu>
</cre8-dropdown>
```
