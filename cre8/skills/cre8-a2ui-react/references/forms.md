# Forms Components

10 components for user input and form controls.

## Cre8Field

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | string | — | **Required.** Field label |
| `value` | string | — | Input value |
| `type` | `"text" \| "email" \| "password" \| "tel" \| "url" \| "number"` | "text" | Input type |
| `placeholder` | string | — | Placeholder text |
| `disabled` | boolean | false | Disabled state |
| `required` | boolean | false | Required field |
| `errorNote` | string | — | Error message to display |

```jsx
<Cre8Field label="Email" type="email" placeholder="Enter email" required />
<Cre8Field label="Username" value={username} errorNote="Username already taken" />
```

---

## Cre8Select

```jsx
<Cre8Select label="Country">
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="uk">United Kingdom</option>
</Cre8Select>
```

---

## Cre8CheckboxField

```jsx
<Cre8CheckboxField label="Interests">
  <Cre8CheckboxFieldItem label="Technology" value="tech" />
  <Cre8CheckboxFieldItem label="Sports" value="sports" />
</Cre8CheckboxField>
```

---

## Cre8RadioField

```jsx
<Cre8RadioField label="Payment Method" name="payment">
  <Cre8RadioFieldItem label="Credit Card" value="card" checked />
  <Cre8RadioFieldItem label="PayPal" value="paypal" />
</Cre8RadioField>
```

---

## Cre8DatePicker

```jsx
<Cre8DatePicker label="Start Date" value={startDate} onChange={handleDateChange} />
```

---

## Form Pattern Example

```jsx
<Cre8Card>
  <Cre8Heading type="h2">Contact Us</Cre8Heading>
  <Cre8Field label="Name" required />
  <Cre8Field label="Email" type="email" required />
  <Cre8Select label="Subject" required>
    <option value="">Select a subject</option>
    <option value="support">Support</option>
    <option value="sales">Sales</option>
  </Cre8Select>
  <Cre8Button text="Submit" variant="primary" type="submit" />
</Cre8Card>
```
