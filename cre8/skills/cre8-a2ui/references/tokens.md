# CRE8 Design Tokens

Design token architecture for the CRE8 Web Components system.

## Don't trust a hardcoded token list — including this one

An earlier version of this file listed a flat token catalog
(`--cre8-spacing-8`, `--cre8-font-size-xs`, `--cre8-font-family-default`,
`--cre8-color-button-primary-background`, `--cre8-color-link-default`, and
more) written from memory rather than the shipped CSS. Checked against the
real `tokens_brand.css`, roughly half those names were wrong — some had the
right prefix and a wrong suffix (`-background` vs. the real `-bg`,
`-normal` vs. the real `-regular`), some didn't exist under any name
(`--cre8-font-family-default`, `--cre8-color-link-default`), and the
font-size scale wasn't semantic (`-xs`/`-sm`/`-lg`) at all — it's an
abstract index (`--cre8-font-size-0` through `-13`). None of that produced a
build error; it just silently styled nothing.

Token names are cheap to verify and expensive to get wrong, so verify
before citing one:

```bash
grep -o -- '--cre8-[a-z0-9-]*button-primary[a-z0-9-]*:' \
  node_modules/@tmorrow/cre8-wc/design-tokens/brands/<brand>/css/tokens_brand.css
```

or open the file directly. It's plain, readable CSS with prose comments
explaining the tier it's in.

## The tier architecture

Tokens resolve through up to four tiers, each referencing only the tier
above it. This is what makes retheming predictable:

```text
Tier 0 · seed        →  Tier 1 · primitive     →  Tier 2 · semantic/mode   →  Tier 3 · component
--cre8-seed-primary  →  --cre8-primary-500     →  --cre8-mode-bg-brand     →  --cre8-color-button-primary-bg
                         (an oklch-derived ramp,    (+ legacy --cre8-color-*
                          --cre8-primary-50..950)    aliases, kept stable)
```

**Not every brand is built this way.** Some cre8 brands are flat, complete
sheets — every token a literal value, no seed indirection, by design (a
brand that ships as a single self-contained file). Setting a seed variable
on one of those changes nothing, silently, because nothing reads it. Check
for `--cre8-seed-*` declarations in the brand's `tokens_brand.css` before
assuming the seed override technique below applies. See the `cre8-brand`
skill for the full seed-extraction workflow.

### The seed tier, verified

Eleven raw values, all of them literals — the only literals in a seed-based
brand. Everything else is `var()` or a relative-color function computed
from these:

| Token | Controls |
| --- | --- |
| `--cre8-seed-primary` | Primary brand color and its whole ramp |
| `--cre8-seed-neutral` | Grays — text, borders, subtle backgrounds |
| `--cre8-seed-success` | Success/positive states |
| `--cre8-seed-error` | Error/destructive states |
| `--cre8-seed-warning` | Warning states |
| `--cre8-seed-accent` | Secondary emphasis, distinct from primary |
| `--cre8-seed-font` | Body and heading font family |
| `--cre8-seed-radius` | Corner rounding scale |
| `--cre8-seed-space` | Base spacing unit |
| `--cre8-seed-font-size` | Base type size |
| `--cre8-seed-border-width` | Default border thickness |

### Below the seed tier

Everything past the seed is generated or aliased, not hand-named for
memorability — expect index-based and composite names rather than semantic
short forms:

- **Spacing** is a numbered scale (`--cre8-spacing-0`, `-2`, `-4`, `-6`,
  `-8`, `-12`, ... up through `-160`), not `-sm`/`-md`/`-lg`.
- **Font size** is an index (`--cre8-font-size-0` through `-13`), consumed
  by composite typography tokens rather than used directly.
- **Typography** is composite: `--cre8-typography-{style}-{variant}-{property}`,
  e.g. `--cre8-typography-body-default-font-family`,
  `--cre8-typography-body-default-font-size`,
  `--cre8-typography-body-default-line-height`. There's no standalone
  `--cre8-font-family-default`.
- **Font weight** names are `--cre8-font-weight-regular` (not `-normal`),
  `-medium`, `-semibold`, `-bold`.
- **Color** follows `--cre8-color-{bg|border|content}-{variant}` for the
  common cases (`-default`, `-subtle`, `-strong`, `-brand`, and the status
  set `-error`/`-warning`/`-success`/`-info`), plus dedicated link tokens
  (`--cre8-color-content-link`, with `-hover`/`-focus`/`-active`/`-visited`
  variants) rather than a single generic `--cre8-color-link-default`. Not
  every `-default`/`-subtle`/`-strong` combination exists for every
  category — verify the specific one you need.

## Theming example

Override at the seed tier when the brand supports it — this is the whole
point of the architecture:

```css
:root, [data-cre8-theme] {
  --cre8-seed-primary: #6366F1;
}
```

That one line moves the primary ramp, the brand-strong background, the
primary button, and every other primary-derived token together. Repainting
`--cre8-color-button-primary-bg` and friends one at a time is the
pre-seed-tier way to do this, and it stops working the moment a brand you're
targeting doesn't define those exact legacy aliases.
