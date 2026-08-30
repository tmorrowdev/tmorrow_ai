---
name: cre8-theming
description: Extract a brand's colors, type and shape from a website, a docs site, a Design.md / brand-guide file, or a picture (logo, screenshot, mockup) and turn it into a cre8 seed-token override. Use when asked to theme, rebrand, or "match our brand" for a CRE8/Innovexa (@tmorrow/cre8-wc or @tmorrow/cre8-react) build, or when given a URL, an image, or a brand doc and asked to make a cre8 app look like it. Complements cre8-a2ui / cre8-a2ui-react, which cover component usage, not brand extraction.
---

# CRE8 theming — brand extraction

Turns an external brand source into the small set of **seed tokens** that
drive a cre8 theme — not a full retheme, not a new component, just the
handful of raw values everything else derives from.

## Start from `whitelabel` unless told otherwise

`@tmorrow/cre8-wc` ships a `whitelabel` brand built for exactly this: a
complete, fully seed-driven brand with deliberately unbranded defaults — a
muted slate primary, the conventional green/red/amber status mapping, a
system font stack, an 8px corner radius. Nothing in it reads as "someone's
brand" before you reseed it, and nothing in it is a literal outside the seed
block, so a full reseed genuinely covers everything. Use it as the base for a
fresh build. Only target a different brand (`cre8-a2ui`, or one the user
names) when the user is already committed to it — reseeding an existing
brand's opinionated defaults still works, but you're overriding its look, not
starting from blank.

Load it by package subpath — this is the import to hand the user:

```css
@import "@tmorrow/cre8-wc/themes/whitelabel";
/* your seed override block goes after this */
```

`themes/<brand>` resolves to that brand's entry stylesheet, which pulls in
the full token sheet and its fonts. The same shape works for any brand:
`@tmorrow/cre8-wc/themes/cre8-a2ui`.

**Do not conclude the brand is missing because you can't find it on disk.**
In an installed package the tokens live under `lib/` and `dist/`, not at the
package root — `node_modules/@tmorrow/cre8-wc/design-tokens/` does not
exist, by design, and the `exports` map is what makes the subpath above
work. (Inside this monorepo the source is at
`packages/cre8-wc/design-tokens/brands/whitelabel/` — a repo path, not an
import path.) If the subpath genuinely fails to resolve, say so and stop
rather than silently falling back to a different base: check the installed
version with `npm ls @tmorrow/cre8-wc`, since `whitelabel` ships in 2.3.10
and later.

## Check this applies before starting

Seed-based theming only works on a brand built on cre8's seed/tier system —
`whitelabel` and `cre8-a2ui` both qualify. If the user names a different
brand, confirm it actually defines `--cre8-seed-*` custom properties
(inspect its shipped CSS, or ask if unsure) before promising a result. Some
cre8 brands are flat, complete sheets with no seed indirection — literal
colors baked into every token, on purpose. Setting `--cre8-seed-primary`
on one of those changes nothing, silently, because nothing reads it. If the
target brand is flat, say so and stop: the fix there is overriding the
specific component tokens directly, which is a different, larger job than
this skill does.

## Step 1 — see what you actually have

The source dictates the method. Use whatever the model running this skill
can actually do — don't guess at a method your tools don't support:

| Given | Use | If you don't have it |
|---|---|---|
| A picture — logo, screenshot, mockup, brand board | Look at it directly (multimodal vision) | Ask for a URL, a Design.md, or a text description of the colors instead. Don't infer a palette from a filename. |
| A live website or docs site URL | Fetch it (WebFetch, or a browser tool if one is available) | If only a non-browsing text fetch is available, work from the raw HTML/CSS returned — flag that this is lower-fidelity than a rendered inspection |
| A Design.md, brand guide, or any local doc | Read it directly | — |
| Only a description in prose ("navy and gold, modern sans") | Extract what's stated; don't invent the rest | Ask before filling gaps with a guess |

A browser tool that can render the page and read computed styles (e.g.
Chrome DevTools MCP, Playwright) beats a text-only fetch — it gives you the
*actual resolved* color and font values, not ones buried in a minified
bundle or overridden three stylesheets later. Prefer it when available.

## Step 2 — what to look for, per source

**Website / docs site.** The primary brand color is almost always the
highest-frequency saturated color on interactive elements: the primary
button background, active nav item, or link color — not the color that
merely appears most often on the page (that's usually a neutral). Neutral
comes from body text and page background. Look for an accent used sparingly
for highlights/badges, separate from primary. Read `font-family` from `body`
and headings (check what's actually applied via computed style, not just
declared in a `@font-face` that may not be the one in use). Read
`border-radius` from **both cards and buttons** — cre8's button radius
scales off the same seed as cards but rounder by convention, so if the
source's buttons and cards genuinely differ in treatment (square buttons
with rounded cards, or the reverse), that's a real signal, not noise: note
both so Step 4 can express it as a per-component override instead of
forcing one shape onto everything. Note whether spacing reads tight,
default, or generous.

**Picture.** Identify the largest saturated, deliberate color block — a
logo's dominant hue, or a screenshot's primary CTA — as primary. Pull neutral
from backgrounds/text. If a distinct highlight color appears (badges,
gradients, a secondary CTA), that's the accent. For type, don't name a
specific font from a glance — describe what you see (geometric sans,
humanist serif, rounded, condensed) and pick the closest available Google
Font as a stand-in, flagged as an approximation. Note visible corner
rounding on both cards and buttons for radius — if one is noticeably
squarer or rounder than the other, that asymmetry is worth capturing
directly (Step 4) rather than flattened into a single value. Note dense or
airy spacing for scale.

**Design.md / brand guide.** Highest-confidence path — read stated hex
values, font names, and spacing/radius numbers directly rather than
inferring them. If the document gives a full palette (multiple shades per
color), take the base/500-equivalent shade as the seed; the tier system
derives the rest of the ramp from it.

## Step 3 — map to the seed tokens

Eleven tokens, each a single raw value everything else chains from. Not
every source will supply all eleven — say which ones you inferred vs. read
directly, and which you left at cre8's own defaults because the source
didn't specify them (radius, spacing and border-width are the ones sources
most often omit; color and font are the ones they most often state).

| Seed token | Controls | Typical source cue |
|---|---|---|
| `--cre8-seed-primary` | Primary brand color, the whole primary ramp | Primary CTA / logo mark |
| `--cre8-seed-neutral` | Grays — text, borders, subtle backgrounds | Body text / page background |
| `--cre8-seed-success` | Success/positive states | Confirmation or "done" UI, if visible |
| `--cre8-seed-error` | Error/destructive states | Error or destructive-button color, if visible |
| `--cre8-seed-warning` | Warning states | Warning/caution UI, if visible |
| `--cre8-seed-accent` | Secondary emphasis, distinct from primary — surfaces on info-status badges, borders and icons | A highlight/badge color used sparingly |
| `--cre8-seed-font` | Body and heading font family | Computed `font-family`, or closest Google Font match |
| `--cre8-seed-radius` | Base corner-rounding scale — cards and fields use it directly, buttons scale off it too (rounder by convention, still proportional) | Card corner radius |
| `--cre8-seed-space` | Base unit for both component padding and page-layout spacing, which scale at different rates (see below) | Overall density (tight/default/airy) |
| `--cre8-seed-font-size` | Base type size | Body copy size, if determinable |
| `--cre8-seed-border-width` | Default border thickness | Visible dividers/outlines |

Status colors (success/error/warning) are rarely on-brand — most sources
never surface them at all. Leave them at the target brand's existing
defaults unless the source clearly defines its own (a design system doc
that specifies them, or visible confirmation/error UI to sample from).
Inventing a status ramp from a logo is a bad guess; an unstated status color
inherited from the base brand is not.

### Beyond the seed: override a component directly when it doesn't share the seed's ratio

The eleven seeds set the brand's *default* aesthetic — one coherent set of
ratios applied everywhere. A real brand's identity often isn't that uniform:
square buttons on rounded cards, a badge that's a different shape from
everything else, a status color that doesn't sit on the standard ramp. A
single global value can't express that, and it shouldn't try to — **the
component tier is a legitimate, independent override point, not just
internal plumbing.** Every `--cre8-border-radius-*`, `--cre8-color-*`, and
similar component-level token can be set directly in the same output block,
after the seed lines, and it wins over whatever the seed derived:

```css
:root, [data-cre8-theme] {
  --cre8-seed-radius: 8px;              /* cards: read directly */
  --cre8-border-radius-button: 2px;     /* buttons read visibly squarer than cards — override instead of forcing one ratio */
}
```

Reach for this whenever Step 2 turned up a real asymmetry, not as a routine
step — most brands *are* internally consistent, and a seed-only block is the
right, simpler answer for them. Common override points, by what they
control: `--cre8-border-radius-button` (buttons, 2x the card radius by
default), `--cre8-border-radius-badge` / `-round` (badges and pills — full
round by design, only override if the source badges are visibly not pills),
`--cre8-border-radius-container` (cards), `--cre8-border-radius-field`
(inputs/selects). Confirm the exact token name against the target brand's
shipped CSS before citing it — same rule as everywhere else in this skill.

One scale relationship stays fixed and is worth knowing rather than fighting:
`--cre8-seed-space` drives both `--cre8-padding-*` (a narrow 0.5x-6x range,
for padding and gaps inside a component) and the much wider
`--cre8-spacing-*` scale (0.5x-40x, for margins and macro layout).
Reseeding space for a chunkier padding feel also moves layout gaps, just
proportionally less — deliberate, not a bug to route around.

## Step 4 — output

A single CSS block redefining only the tokens you have values for, ready to
paste after the base theme's import:

```css
:root, [data-cre8-theme] {
  --cre8-seed-primary: #114B8F;      /* read from primary CTA */
  --cre8-seed-neutral: #5B6472;      /* read from body text */
  --cre8-seed-accent: #E0A526;       /* read from highlight badges */
  --cre8-seed-font: "Sora", sans-serif; /* closest match to headings; approximate */
  --cre8-seed-radius: 8px;           /* read from card corners */
  /* success / warning / error / space / font-size / border-width:
     not stated by the source — left at the base brand's defaults */
}
```

If buttons and cards showed different treatments, add a direct override
after the seed block — see "Beyond the seed" in Step 3.

Label every line with where it came from and how sure you are — "read
directly," "closest available match," or "inferred from X" — in the same
comment or in prose right after the block. A brand extraction that reads as
uniformly confident is worse than one that flags its two weakest guesses,
because the weak guess is usually the one someone builds a whole palette
correction around later.

Tell the user to load the base brand's tokens first
(`@import "@tmorrow/cre8-wc/themes/whitelabel";`), then this block, at the
page's entry point — same rule as any cre8 theming (see cre8-design's
"Theming a page to a brand"). Then **verify visually**: render it and check
the primary button, an info-status badge (the one element that actually
surfaces `--cre8-seed-accent`, per the seed table above), and running body
text actually reflect the source, not just that the CSS applied without
error.
