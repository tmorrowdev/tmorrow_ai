# Navigation Components

16 components for navigation patterns.

## Cre8Header

```jsx
<Cre8Header>
  <Cre8Logo />
  <Cre8GlobalNav>
    <Cre8GlobalNavItem href="/">Home</Cre8GlobalNavItem>
    <Cre8GlobalNavItem href="/about">About</Cre8GlobalNavItem>
  </Cre8GlobalNav>
</Cre8Header>
```

---

## Cre8Tabs / Cre8Tab / Cre8TabPanel

```jsx
<Cre8Tabs>
  <Cre8Tab label="Overview" selected />
  <Cre8Tab label="Features" />
  <Cre8TabPanel>Overview content</Cre8TabPanel>
  <Cre8TabPanel>Features content</Cre8TabPanel>
</Cre8Tabs>
```

---

## Cre8Breadcrumbs

```jsx
<Cre8Breadcrumbs>
  <Cre8BreadcrumbsItem href="/">Home</Cre8BreadcrumbsItem>
  <Cre8BreadcrumbsItem href="/products">Products</Cre8BreadcrumbsItem>
  <Cre8BreadcrumbsItem>Widget Pro</Cre8BreadcrumbsItem>
</Cre8Breadcrumbs>
```

---

## Cre8Pagination

```jsx
<Cre8Pagination currentPage={3} totalPages={10} />
```

---

## Header Pattern Example

```jsx
<Cre8Header>
  <Cre8LayoutContainer>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <Cre8Logo />
      <Cre8GlobalNav>
        <Cre8GlobalNavItem href="/">Home</Cre8GlobalNavItem>
        <Cre8GlobalNavItem href="/features">Features</Cre8GlobalNavItem>
      </Cre8GlobalNav>
      <div>
        <Cre8Button text="Log In" variant="tertiary" />
        <Cre8Button text="Sign Up" variant="primary" />
      </div>
    </div>
  </Cre8LayoutContainer>
</Cre8Header>
```
