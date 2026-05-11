# Layout Components

10 components for page structure and content containers.

## Cre8Layout

Page layout wrapper. Top-level container for pages.

```jsx
<Cre8Layout>
  <Cre8Header>...</Cre8Header>
  <main>...</main>
  <Cre8Footer />
</Cre8Layout>
```

**AI Rules:** Always use as root wrapper for full pages.

---

## Cre8LayoutContainer

Content container with max-width constraints.

```jsx
<Cre8LayoutContainer>
  <Cre8Heading type="h1">Page Title</Cre8Heading>
</Cre8LayoutContainer>
```

---

## Cre8Card

```jsx
<Cre8Card>
  <Cre8Heading type="h3">Card Title</Cre8Heading>
  <Cre8TextPassage><p>Card content.</p></Cre8TextPassage>
  <Cre8Button text="Learn More" variant="tertiary" />
</Cre8Card>
```

---

## Cre8Grid / Cre8GridItem

```jsx
<Cre8Grid>
  <Cre8GridItem><Cre8Card>Item 1</Cre8Card></Cre8GridItem>
  <Cre8GridItem><Cre8Card>Item 2</Cre8Card></Cre8GridItem>
  <Cre8GridItem><Cre8Card>Item 3</Cre8Card></Cre8GridItem>
</Cre8Grid>
```

---

## Cre8Hero

```jsx
<Cre8Hero>
  <Cre8LayoutContainer>
    <Cre8Heading type="h1">Welcome to Our Platform</Cre8Heading>
    <Cre8TextPassage><p>Build amazing things.</p></Cre8TextPassage>
    <Cre8Button text="Get Started" variant="primary" />
  </Cre8LayoutContainer>
</Cre8Hero>
```

---

## Landing Page Example

```jsx
<Cre8Layout>
  <Cre8Header>
    <Cre8GlobalNav>
      <Cre8GlobalNavItem href="/">Home</Cre8GlobalNavItem>
      <Cre8GlobalNavItem href="/features">Features</Cre8GlobalNavItem>
    </Cre8GlobalNav>
  </Cre8Header>
  <main>
    <Cre8Hero>
      <Cre8LayoutContainer>
        <Cre8Heading type="h1">Build Better Products</Cre8Heading>
        <Cre8Button text="Start Free Trial" variant="primary" />
      </Cre8LayoutContainer>
    </Cre8Hero>
    <Cre8Section>
      <Cre8LayoutContainer>
        <Cre8Grid>
          <Cre8GridItem><Cre8Card><Cre8Heading type="h3">Fast</Cre8Heading></Cre8Card></Cre8GridItem>
          <Cre8GridItem><Cre8Card><Cre8Heading type="h3">Secure</Cre8Heading></Cre8Card></Cre8GridItem>
        </Cre8Grid>
      </Cre8LayoutContainer>
    </Cre8Section>
  </main>
  <Cre8Footer />
</Cre8Layout>
```
