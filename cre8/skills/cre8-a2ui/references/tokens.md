# CRE8 Design Tokens

Complete design token architecture for the CRE8 Web Components system.

## Token Namespace

All CSS custom properties follow: `--cre8-{category}-{property}-{variant}`

## Spacing Tokens

```css
--cre8-spacing-0      /* 0px - No spacing */
--cre8-spacing-2      /* 2px - Micro */
--cre8-spacing-4      /* 4px - Tight */
--cre8-spacing-8      /* 8px - Default */
--cre8-spacing-16     /* 16px - Standard */
--cre8-spacing-24     /* 24px - Large */
```

## Color Tokens

### Background Colors
```css
--cre8-color-bg-default
--cre8-color-bg-subtle
--cre8-color-bg-muted
--cre8-color-bg-inverse
--cre8-color-bg-brand-subtle
--cre8-color-bg-brand-strong
--cre8-color-bg-brand-xstrong
```

### Border Colors
```css
--cre8-color-border-default
--cre8-color-border-subtle
--cre8-color-border-strong
--cre8-color-border-inverse
--cre8-color-border-brand
```

### Content Colors
```css
--cre8-color-content-default
--cre8-color-content-subtle
--cre8-color-content-muted
--cre8-color-content-inverse
--cre8-color-content-brand
```

### Status Colors
```css
/* Error */
--cre8-color-bg-error
--cre8-color-border-error
--cre8-color-content-error

/* Warning */
--cre8-color-bg-warning
--cre8-color-border-warning
--cre8-color-content-warning

/* Success */
--cre8-color-bg-success
--cre8-color-border-success
--cre8-color-content-success

/* Info */
--cre8-color-bg-info
--cre8-color-border-info
--cre8-color-content-info
```

## Typography Tokens

```css
--cre8-font-family-default
--cre8-font-family-mono
--cre8-font-size-xs              /* 12px */
--cre8-font-size-sm              /* 14px */
--cre8-font-size-md              /* 16px */
--cre8-font-size-lg              /* 18px */
--cre8-font-size-xl              /* 20px */
--cre8-font-size-2xl             /* 24px */
--cre8-font-size-3xl             /* 30px */
--cre8-font-weight-normal        /* 400 */
--cre8-font-weight-medium        /* 500 */
--cre8-font-weight-semibold      /* 600 */
--cre8-font-weight-bold          /* 700 */
```

## Theming Example

```css
:root {
  --cre8-color-bg-brand-strong: #6366F1;
  --cre8-color-button-primary-background: #6366F1;
  --cre8-color-button-primary-background-hover: #4F46E5;
  --cre8-color-link-default: #6366F1;
}
```
