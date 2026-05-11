# Form Components

15 components for user input and form controls. All extend `Cre8FormElement`.

## cre8-button

Primary interactive element for actions.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `text` | string | - | **Required.** Button label |
| `variant` | `'primary' \| 'secondary' \| 'tertiary'` | - | Visual style |
| `size` | `'sm' \| 'lg'` | - | Size variant |
| `type` | `'button' \| 'submit' \| 'reset'` | "button" | Button type |
| `disabled` | boolean | false | Disabled state |
| `href` | string | - | Makes button a link |
| `fullWidth` | boolean | - | 100% width |
| `loading` | boolean | - | Loading state |

```html
<cre8-button text="Submit" variant="primary"></cre8-button>
<cre8-button text="Cancel" variant="secondary"></cre8-button>
<cre8-button text="Saving..." loading></cre8-button>
```

---

## cre8-field

Standard form input with label and validation.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `type` | `'text' \| 'email' \| 'number' \| 'url' \| 'tel' \| 'password' \| 'date'` | "text" | Input type |
| `label` | string | "Label" | **Required.** Field label |
| `name` | string | - | Form field name |
| `placeholder` | string | - | Placeholder text |
| `required` | boolean | - | Required field |
| `disabled` | boolean | - | Disabled state |
| `isError` | boolean | - | Error state |
| `errorNote` | string | - | Error message |

```html
<cre8-field type="email" label="Email Address" name="email" required></cre8-field>
<cre8-field type="text" label="Username" isError errorNote="Username already taken"></cre8-field>
```

---

## cre8-text-area

Multi-line text input.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | - | **Required.** Field label |
| `name` | string | - | Form field name |
| `rows` | number | 3 | Visible rows |
| `required` | boolean | - | Required field |

```html
<cre8-text-area label="Message" name="message" rows="5" required></cre8-text-area>
```

---

## cre8-select

Dropdown selection input.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | - | **Required.** Field label |
| `name` | string | - | Form field name |
| `required` | boolean | - | Required field |

```html
<cre8-select label="Country" name="country" required>
  <option value="">Select a country</option>
  <option value="us">United States</option>
  <option value="uk">United Kingdom</option>
</cre8-select>
```

---

## cre8-checkbox

Boolean toggle input.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `label` | string | - | **Required.** Checkbox label |
| `name` | string | - | Form field name |
| `checked` | boolean | - | Checked state |

```html
<cre8-checkbox label="I agree to the terms" name="terms" required></cre8-checkbox>
```

---

## cre8-radio-button-group

Container for radio buttons.

```html
<cre8-radio-button-group legend="Payment Method">
  <cre8-radio-button label="Credit Card" name="payment" value="card"></cre8-radio-button>
  <cre8-radio-button label="PayPal" name="payment" value="paypal"></cre8-radio-button>
</cre8-radio-button-group>
```

---

## cre8-date-picker

Date selection input.

```html
<cre8-date-picker label="Start Date" name="startDate" min="2024-01-01" required></cre8-date-picker>
```
