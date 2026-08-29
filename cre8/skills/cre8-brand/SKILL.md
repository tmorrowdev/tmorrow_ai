---
name: cre8-brand
description: Extract a brand's colors, type and shape from a website, a docs site, a Design.md / brand-guide file, or a picture (logo, screenshot, mockup) and turn it into a cre8 seed-token override. Use when asked to theme, rebrand, or "match our brand" for a CRE8/Innovexa (@tmorrow/cre8-wc or @tmorrow/cre8-react) build, or when given a URL, an image, or a brand doc and asked to make a cre8 app look like it. Complements cre8-a2ui / cre8-a2ui-react, which cover component usage, not brand extraction.
---

# CRE8 brand extraction

Turns an external brand source into the small set of **seed tokens** that
drive a cre8 theme — not a full retheme, not a new component, just the
handful of raw values everything else derives from.

## Check this applies before starting

Seed-based theming only works on a brand built on cre8's seed/tier system.
Confirm the brand you're overriding actually defines `--cre8-seed-*` custom
properties (inspect its shipped CSS, or ask if unsure) before promising a
result. Some cre8 brands are flat, complete sheets with no seed indirection —
literal colors baked into every token, on purpose. Setting `--cre8-seed-primary`
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
`border-radius` from buttons and cards for shape, and note whether spacing
reads tight, default, or generous.

**Picture.** Identify the largest saturated, deliberate color block — a
logo's dominant hue, or a screenshot's primary CTA — as primary. Pull neutral
from backgrounds/text. If a distinct highlight color appears (badges,
gradients, a secondary CTA), that's the accent. For type, don't name a
specific font from a glance — describe what you see (geometric sans,
humanist serif, rounded, condensed) and pick the closest available Google
Font as a stand-in, flagged as an approximation. Note visible corner
rounding on buttons/cards for radius; dense or airy spacing for scale.

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
| `--cre8-seed-accent` | Secondary emphasis, distinct from primary | A highlight/badge color used sparingly |
| `--cre8-seed-font` | Body and heading font family | Computed `font-family`, or closest Google Font match |
| `--cre8-seed-radius` | Corner rounding scale | Button/card corner radius |
| `--cre8-seed-space` | Base spacing unit | Overall density (tight/default/airy) |
| `--cre8-seed-font-size` | Base type size | Body copy size, if determinable |
| `--cre8-seed-border-width` | Default border thickness | Visible dividers/outlines |

Status colors (success/error/warning) are rarely on-brand — most sources
never surface them at all. Leave them at the target brand's existing
defaults unless the source clearly defines its own (a design system doc
that specifies them, or visible confirmation/error UI to sample from).
Inventing a status ramp from a logo is a bad guess; an unstated status color
inherited from the base brand is not.

## Step 4 — output

A single CSS block redefining only the tokens you have values for, ready to
paste after the base theme's import:

```css
:root, [data-cre8-theme] {
  --cre8-seed-primary: #114B8F;      /* read from primary CTA */
  --cre8-seed-neutral: #5B6472;      /* read from body text */
  --cre8-seed-accent: #E0A526;       /* read from highlight badges */
  --cre8-seed-font: "Sora", sans-serif; /* closest match to headings; approximate */
  --cre8-seed-radius: 8px;           /* read from button corners */
  /* success / warning / error / space / font-size / border-width:
     not stated by the source — left at the base brand's defaults */
}
```

Label every line with where it came from and how sure you are — "read
directly," "closest available match," or "inferred from X" — in the same
comment or in prose right after the block. A brand extraction that reads as
uniformly confident is worse than one that flags its two weakest guesses,
because the weak guess is usually the one someone builds a whole palette
correction around later.

Tell the user to load the base brand's tokens first, then this block, at the
page's entry point — same rule as any cre8 theming (see cre8-design's
"Theming a page to a brand"). Then **verify visually**: render it and check
the primary button, a status badge if one exists, and running body text
actually reflect the source, not just that the CSS applied without error.
