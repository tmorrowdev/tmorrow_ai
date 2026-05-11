# Data Components

14 components for data display.

## Cre8Table

```jsx
<Cre8Table>
  <Cre8TableHeader>
    <Cre8TableRow>
      <Cre8TableHeaderCell>Name</Cre8TableHeaderCell>
      <Cre8TableHeaderCell>Status</Cre8TableHeaderCell>
    </Cre8TableRow>
  </Cre8TableHeader>
  <Cre8TableBody>
    <Cre8TableRow>
      <Cre8TableCell>John Doe</Cre8TableCell>
      <Cre8TableCell><Cre8Badge text="Active" variant="success" /></Cre8TableCell>
    </Cre8TableRow>
  </Cre8TableBody>
</Cre8Table>
```

---

## Cre8List / Cre8ListItem

```jsx
<Cre8List>
  <Cre8ListItem>First item</Cre8ListItem>
  <Cre8ListItem>Second item</Cre8ListItem>
</Cre8List>
```

---

## Cre8Tag / Cre8TagList

```jsx
<Cre8TagList>
  <Cre8Tag text="JavaScript" />
  <Cre8Tag text="React" />
  <Cre8Tag text="TypeScript" />
</Cre8TagList>
```

---

## Complete Table Pattern

```jsx
<Cre8Card>
  <Cre8Heading type="h3">Users</Cre8Heading>
  <Cre8Table>
    <Cre8TableHeader>
      <Cre8TableRow>
        <Cre8TableHeaderCell>Name</Cre8TableHeaderCell>
        <Cre8TableHeaderCell>Email</Cre8TableHeaderCell>
        <Cre8TableHeaderCell>Status</Cre8TableHeaderCell>
      </Cre8TableRow>
    </Cre8TableHeader>
    <Cre8TableBody>
      <Cre8TableRow>
        <Cre8TableCell>John Doe</Cre8TableCell>
        <Cre8TableCell>john@example.com</Cre8TableCell>
        <Cre8TableCell><Cre8Badge text="Active" variant="success" /></Cre8TableCell>
      </Cre8TableRow>
    </Cre8TableBody>
  </Cre8Table>
  <Cre8Pagination currentPage={1} totalPages={5} />
</Cre8Card>
```
