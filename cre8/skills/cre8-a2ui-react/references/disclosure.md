# Disclosure Components

7 components for expandable/hideable content.

## Cre8Accordion

```jsx
<Cre8Accordion>
  <Cre8AccordionItem label="What is your refund policy?" expanded>
    We offer a 30-day money-back guarantee on all plans.
  </Cre8AccordionItem>
  <Cre8AccordionItem label="How do I cancel?">
    You can cancel anytime from your account settings.
  </Cre8AccordionItem>
</Cre8Accordion>
```

---

## Cre8Modal

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `open` | boolean | false | Modal visibility |

```jsx
<Cre8Modal open={isOpen}>
  <Cre8Heading type="h2">Confirm Delete</Cre8Heading>
  <Cre8TextPassage><p>This cannot be undone.</p></Cre8TextPassage>
  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
    <Cre8Button text="Cancel" variant="secondary" onClick={handleClose} />
    <Cre8DangerButton text="Delete" onClick={handleDelete} />
  </div>
</Cre8Modal>
```

---

## Cre8Dropdown

```jsx
<Cre8Dropdown>
  <Cre8Button text="Actions" variant="secondary" />
  <Cre8DropdownItem>Edit</Cre8DropdownItem>
  <Cre8DropdownItem>Delete</Cre8DropdownItem>
</Cre8Dropdown>
```

---

## Cre8Tooltip

```jsx
<Cre8Tooltip content="Click to save your changes">
  <Cre8Button text="Save" variant="primary" />
</Cre8Tooltip>
```
