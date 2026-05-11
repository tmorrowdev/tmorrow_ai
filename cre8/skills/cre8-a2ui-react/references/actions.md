# Actions Components

2 components for user interactions.

## Cre8Button

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | — | **Required.** Button text. Keep short, max 3 words. Title Case. |
| `variant` | `"primary" \| "secondary" \| "tertiary"` | "primary" | Visual priority level |
| `size` | `"sm" \| "md" \| "lg"` | "md" | Button size |
| `disabled` | boolean | false | Disabled state |
| `fullWidth` | boolean | false | 100% width |
| `loading` | boolean | false | Loading state |
| `href` | string | — | Makes button an anchor element |
| `type` | `"button" \| "submit" \| "reset"` | "button" | Button type |

```jsx
<Cre8Button text="Submit" variant="primary" />
<Cre8Button text="Cancel" variant="secondary" />
<Cre8Button text="Saving..." loading={true} />
<Cre8Button text="Sign In" variant="primary" fullWidth />
```

**AI Rules:**
- One `variant="primary"` per screen/view
- Keep `text` short: max 3 words, Title Case
- Use `type="submit"` inside forms

---

## Cre8DangerButton

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | — | **Required.** Button text |
| `disabled` | boolean | false | Disabled state |

```jsx
<Cre8DangerButton text="Delete" />
```

**AI Rules:** Reserve for destructive actions only. Always confirm with `Cre8Modal`.
