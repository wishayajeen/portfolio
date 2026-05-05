# System Component Inventory

**Last updated:** 2026-05-05  
**System version:** 0.5.9  
**Source of truth:** `src/components/system/`

> This document reflects the **actual current implementation** of each system component.
> It is the primary reference for any AI coding task that touches these components.
> Do not invent variants, props, or behaviours that are not listed here.

---

## Contents

- [Badge](#badge)
- [Button](#button)
- [Card](#card)
- [Link](#link)
- [IconButton](#iconbutton)
- [Input (planned)](#input-planned)
- [Global rules (all components)](#global-rules)

---

## Badge

### Purpose
Maps a semantic `variant` prop to an existing homepage.css badge/tag class.
Renders labels, category tags, and status indicators used throughout the site.
Introduces **no new CSS** — all visual styles come from pre-existing class definitions.

### File
```
src/components/system/Badge.astro
```

### Props

| Prop | Type | Default | Required | Notes |
|---|---|---|---|---|
| `label` | `string` | — | ✅ | The visible text |
| `variant` | `string` | `'tag'` | ❌ | See variants table below |
| `...rest` | `any` | — | ❌ | Passed to the root element (e.g. `style`, `data-*`) |

> **No `class` prop.** Extra classes can technically be passed via `...rest` but this is not recommended — use the variant system instead.

### Variants

| Variant | CSS class | Surface | Visual |
|---|---|---|---|
| `tag` | `.play-card-tag` | light | Yellow pill, black text, border, full radius |
| `diary-tag` | `.diary-tag` | light | Yellow box, black text, border, xs radius |
| `work-tag` | `.work-tag` | dark | Dark bg (`gray-900`), `--fg-on-dark-label` text, xs radius |
| `skill` | `.about-skill-tag` | dark (about card) | Black pill, yellow (`--fg-on-dark-accent`) text, border |
| `coming-soon` | `.work-coming-soon-badge` | dark | Red (`--color-error`) text + animated dot — **different DOM** |

### DOM output

`tag`, `diary-tag`, `work-tag`, `skill` all render identically in structure:
```html
<span class="[variant-class]">Label text</span>
```

`coming-soon` renders a **two-element span** — the dot is a separate child:
```html
<span class="work-coming-soon-badge">
  <span class="work-coming-soon-dot"></span>
  Coming soon
</span>
```
The `label` prop is the text next to the dot. Do not pass HTML into `label`.

### Usage examples

```astro
<!-- Category tag on a play card (light surface) -->
<Badge variant="tag" label="Experiment" />
<Badge variant="tag" label="AI Product" />

<!-- Diary entry category label -->
<Badge variant="diary-tag" label="Tutorial" />

<!-- Work section row tag (dark surface) -->
<Badge variant="work-tag" label="Design System" />

<!-- About section skill pill (dark surface) -->
<Badge variant="skill" label="AI × design" />

<!-- Coming-soon status (dark or light surface) -->
<Badge variant="coming-soon" label="Coming soon" />
```

### When to use
- Category labels on play-cards (`tag`)
- Entry tags on diary cards (`diary-tag`)
- Row type labels in the work section (`work-tag`)
- Skills list in the about section (`skill`)
- Any item that is not yet live (`coming-soon`)

### When NOT to use
- Do not use `tag` or `diary-tag` on dark surfaces — yellow badge on dark background is not accessible
- Do not use `skill` on light surfaces — black pill with yellow text on white has poor visual hierarchy
- Do not use `work-tag` on light surfaces — dark pill on white is fine visually but out of context
- Do not use `coming-soon` where the parent already sets `color: --color-error` (double red)
- Do not use Badge as a navigation element or button — it has no interactive states

### Rules Claude must follow
1. **Never invent a new variant.** If none of the 5 variants fit, discuss adding a new one — do not pass raw `class` names as a workaround.
2. **`label` is always plain text.** Never pass JSX or HTML tags into `label`.
3. **`coming-soon` has a different DOM structure.** Do not assume it renders like the others — it produces a dot + text, not just text.
4. **No slots.** Badge has no `<slot />`. All content comes through `label`.
5. **Cannot be imported in React files (.jsx).** Badge is an Astro component. WorkSection.jsx and other React islands must use the raw CSS class directly if needed.

---

## Button

### Purpose
Maps a `variant` prop to the two existing CTA button classes from `homepage.css`.
Renders as `<a>` when `href` is provided, `<button>` otherwise.
Introduces **no new CSS**.

### File
```
src/components/system/Button.astro
```

### Props

| Prop | Type | Default | Required | Notes |
|---|---|---|---|---|
| `label` | `string` | — | ✅ | Button text |
| `variant` | `'primary' \| 'secondary'` | `'primary'` | ❌ | |
| `href` | `string` | — | ❌ | If provided, renders `<a>`; otherwise `<button>` |
| `class` | `string` | — | ❌ | Appended to the generated class list |
| `...rest` | `any` | — | ❌ | Passed to the root element (e.g. `onClick`, `data-*`, `disabled`) |

### Variants

| Variant | CSS class | Surface | Visual |
|---|---|---|---|
| `primary` | `.hero-cta-primary` | any | Yellow bg (`--bg-accent`), black text, yellow glow shadow, lifts on hover |
| `secondary` | `.hero-cta-secondary` | **dark only** | Transparent bg, white text (`--fg-on-dark-primary`), glass border |

**`primary` hover:** `translateY(-2px)`, larger glow shadow  
**`primary` active:** `translateY(2px)`, no shadow (pressed feel)  
**`secondary` hover:** border brightens, subtle white fill

### Usage examples

```astro
<!-- Primary CTA — works on any surface -->
<Button label="See the system →" />
<Button variant="primary" label="View diary →" href="/diary" />

<!-- Secondary CTA — dark surfaces ONLY -->
<Button variant="secondary" label="Learn more" />

<!-- With extra class for state simulation (DS page only) -->
<Button variant="primary" label="Hover" class="state-hover" />

<!-- Disabled state -->
<Button label="Unavailable" disabled />
```

### When to use
- `primary`: main calls to action anywhere on the site — hero, cards, footers
- `secondary`: secondary actions placed directly on `--bg-dark` sections (e.g. alongside a primary button in the hero)

### When NOT to use
- Do not use `secondary` on light or yellow surfaces — white text on a light background is invisible
- Do not use Button for inline text navigation — use `<Link>` instead
- Do not use Button for icon-only actions — `label` is required and must be descriptive text
- Do not nest interactive elements inside Button (it renders as a leaf element)

### Rules Claude must follow
1. **`secondary` is dark-surface only.** Never place `<Button variant="secondary">` on `--bg-primary`, `--bg-surface`, or `--bg-accent`. It will be invisible.
2. **`label` is required.** Button has no slot — all button text goes through the `label` prop.
3. **Render type is controlled by `href`.** Passing `href` turns it into an `<a>`. Without `href` it is a `<button>`. Do not fight this by adding `role="button"` to an anchor or vice versa.
4. **`class` prop appends, does not replace.** The variant class is always applied first; `class` is concatenated after.
5. **Cannot be imported in React files (.jsx).** Use the raw class `.hero-cta-primary` / `.hero-cta-secondary` directly in JSX.

---

## Card

### Purpose
Outer container shell for card-pattern UI. Imposes layout and surface styling only.
Inner content is entirely free-form via `<slot />`.
Renders as `<a>` when `href` is provided (clickable card), `<div>` otherwise.
Introduces **no new CSS**.

### File
```
src/components/system/Card.astro
```

### Props

| Prop | Type | Default | Required | Notes |
|---|---|---|---|---|
| `variant` | `'default' \| 'accent' \| 'diary'` | `'default'` | ❌ | |
| `href` | `string` | — | ❌ | Makes the whole card an anchor |
| `class` | `string` | — | ❌ | Appended to class list |
| `...rest` | `any` | — | ❌ | Passed to the root element (e.g. `target`, `rel`) |

### Variants

| Variant | CSS classes | Layout | Surface |
|---|---|---|---|
| `default` | `.play-card` | column, gap 14px | `--bg-primary`, hard shadow, lifts on hover |
| `accent` | `.play-card .play-card--accent` | column, gap 14px | `--bg-accent` (yellow), hard shadow, lifts on hover |
| `diary` | `.diary-card` | row, `align-items: center` | `--bg-primary`, hard shadow, lifts on hover |

**Hover (all variants):** `translateY(-2px)` + `shadow-hover`

### Expected slot structure

Card imposes **no inner template**. However, each variant has an established inner structure used throughout the site. Follow these patterns for consistency:

**`default` and `accent` (play-card):**
```astro
<Card variant="default" href="/some-path">
  <!-- Header row: tag + optional coming-soon badge -->
  <div class="play-card-header">
    <Badge variant="tag" label="Experiment" />
    <Badge variant="coming-soon" label="Coming soon" />  <!-- optional -->
  </div>
  <!-- Title + description -->
  <div>
    <h3 class="play-card-title">Card title</h3>
    <p class="play-card-desc">Short description of this item.</p>
  </div>
  <!-- CTA — hidden by default, appears on hover -->
  <span class="play-card-cta">Explore →</span>
</Card>
```

**`diary`:**
```astro
<Card variant="diary" href={`/diary/${entry.slug}/`}>
  <!-- Date block -->
  <div class="diary-date-block">
    <span class="diary-date-day">{day}</span>
    <span class="diary-date-month">{month}</span>
  </div>
  <!-- Content -->
  <div class="diary-content">
    <p class="diary-title">{entry.title}</p>
    <div class="diary-meta">
      <Badge variant="diary-tag" label={entry.tag} />
      <span class="diary-read-time">{entry.readTime} read</span>
    </div>
  </div>
  <!-- Arrow icon -->
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="diary-arrow">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</Card>
```

### Usage examples

```astro
<!-- Static experiment card (no link) -->
<Card variant="accent">
  <div class="play-card-header">
    <Badge variant="tag" label="Experiment" />
    <Badge variant="coming-soon" label="Coming soon" />
  </div>
  <div>
    <h3 class="play-card-title">Ask Pocky</h3>
    <p class="play-card-desc">Query the design system via chat.</p>
  </div>
  <span class="play-card-cta">Explore →</span>
</Card>

<!-- Linked diary card -->
<Card variant="diary" href="/diary/my-post/">
  <div class="diary-date-block">
    <span class="diary-date-day">28</span>
    <span class="diary-date-month">APR</span>
  </div>
  <div class="diary-content">
    <p class="diary-title">Entry title here</p>
    <div class="diary-meta">
      <Badge variant="diary-tag" label="Tutorial" />
      <span class="diary-read-time">4 min read</span>
    </div>
  </div>
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" class="diary-arrow">
    <path d="M3 8h10M9 4l4 4-4 4" stroke="#0A0A0A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</Card>

<!-- External link card -->
<Card href="https://www.personalens.app/" target="_blank" rel="noopener noreferrer">
  ...
</Card>
```

### When to use
- `default`: standard experiment/project cards in the Playground section
- `accent`: featured or highlighted experiment cards (use sparingly — one accent card per group max)
- `diary`: diary/article entry rows in the Playground section diary list

### When NOT to use
- Do not use `diary` variant for experiment content — the row layout does not have space for a description
- Do not use `default` or `accent` for diary entries — the column layout lacks the date block pattern
- Do not put interactive elements (buttons, inputs) directly inside a Card with `href` — the whole card is already an anchor; nested interactives are invalid HTML
- Do not add custom background or border styles inside the slot — Card controls the surface

### Rules Claude must follow
1. **Card is a shell only.** Never add a wrapping `<div>` between `<Card>` and the inner content — the inner content IS the slot, directly inside the card element.
2. **Match variant to content type.** `diary` variant uses a row layout — it will break visually if filled with play-card inner content, and vice versa.
3. **`accent` on yellow surface changes tag colour.** `.play-card--accent .play-card-tag` inverts to black bg + yellow text. This is automatic — no action needed, but be aware when reviewing visual output.
4. **The arrow SVG stroke is hardcoded `#0A0A0A`.** This is intentional (light surface only). Do not change it without a system-level decision.
5. **Cannot be imported in React files (.jsx).** WorkSection.jsx must use raw class names if card structure is needed.

---

## Link

### Purpose
Unified anchor component. Covers all link contexts across the site through a single `variant` prop.
Replaces six previously ad-hoc link styles (nav-link, hero-social-link, footer-link, footer-contact-link, social-pill, article-back-link).
Always renders as `<a>`. The `external` prop adds security attributes automatically.

### File
```
src/components/system/Link.astro
```

### Props

| Prop | Type | Default | Required | Notes |
|---|---|---|---|---|
| `href` | `string` | — | ✅ | Destination URL |
| `variant` | `string` | `'default'` | ❌ | See variants table below |
| `external` | `boolean` | `false` | ❌ | Adds `target="_blank" rel="noopener noreferrer"` |
| `class` | `string` | — | ❌ | Appended to class list |
| `...rest` | `any` | — | ❌ | Passed to `<a>` (e.g. `aria-label`, `data-*`) |

### Variants

| Variant | CSS class | Surface | Rest state | Hover behaviour |
|---|---|---|---|---|
| `default` | *(none — global `<a>`)* | light | `--fg-primary`, box-shadow underline | box-shadow floods dark, text → `--fg-on-dark-accent` (yellow) |
| `on-dark` | `.hero-social-link` | dark | `--fg-on-dark-primary`, box-shadow underline | box-shadow floods light, text → `--fg-primary` |
| `nav` | `.nav-link` | dark | `--fg-on-dark-primary`, pill shape, no underline | text → `--fg-on-dark-accent` (yellow) |
| `back` | `.back-link` | dark | `--fg-on-dark-label` (muted), no underline | text → `--fg-on-dark-primary` |
| `footer-nav` | `.footer-nav-link` | dark | `--fg-on-dark-label` (muted), no underline | text → `--fg-on-dark-primary` |
| ~~`subtle`~~ | `.link-subtle` | light | **DEPRECATED (0.5.1)** — not used in any product page | — |

**`default` gets no CSS class.** It relies entirely on the global `a { }` rule in `tokens.css`.

### Usage examples

```astro
<!-- Default inline link on a light surface -->
<Link href="/diary">Read the diary</Link>

<!-- Inline link on a dark background (e.g. hero, work section) -->
<Link href="https://github.com" variant="on-dark" external>GitHub</Link>

<!-- Nav button (header navigation) -->
<Link href="#playground" variant="nav">Playground</Link>

<!-- Back navigation on dark article header -->
<Link href="/" variant="back">← Back home</Link>

<!-- Footer navigation item -->
<Link href="#work" variant="footer-nav">Work</Link>

<!-- External link with explicit label -->
<Link href="https://www.personalens.app/" external aria-label="PersonaLens app">
  PersonaLens ↗
</Link>
```

### When to use

| Variant | Use when… |
|---|---|
| `default` | Inline links in body copy, article content, or any light surface where a prominent underlined link is appropriate |
| `on-dark` | Inline links within dark sections (hero social row, dark callout blocks) |
| `nav` | Navigation items that look like buttons but navigate (header nav, in-page scroll links) |
| `back` | "Back" or "return" navigation from a detail page to a parent (article back link, DS topbar link) |
| `footer-nav` | Plain text navigation links in the footer bottom bar |

### When NOT to use
- Do not use `default` on dark surfaces — `--fg-primary` (black) text with a dark box-shadow on a dark background is invisible
- Do not use `on-dark`, `nav`, `back`, or `footer-nav` on light surfaces — all four use white or muted white text, which will be unreadable on light backgrounds
- Do not use `nav` when you need a true anchor with a visible URL — `nav` is styled as a button; use `default` for visible inline links
- **Do not use `subtle`** — it is deprecated (0.5.1). Use `default` instead.
- Do not use `back` for any link that is not a backwards navigation — the `margin-bottom: 40px` it carries assumes it sits above article header content
- Do not use Link inside React files — it is an Astro component and cannot be imported into `.jsx`

### Rules Claude must follow
1. **`href` is required.** Unlike Button, Link has no buttonless fallback. Always provide a destination.
2. **`default` applies no class.** The element will have `class={undefined}`, which Astro renders as no class attribute at all. This is correct. Do not add a `class="default"` workaround.
3. **Surface matching is mandatory.** The light-surface variant (`default`) on dark backgrounds and dark-surface variants (`on-dark`, `nav`, `back`, `footer-nav`) on light backgrounds will both produce unreadable text. Always match variant to surface.
4. **`external` is not automatic.** Any link to an external URL (starting with `http://` or `https://`) that opens in a new tab must use `external={true}`. Do not manually add `target="_blank"` and omit `external` — the `rel="noopener noreferrer"` will be missing.
5. **Content goes in the slot.** Unlike Badge and Button, Link uses `<slot />` — the visible text goes between the tags, not in a `label` prop.
6. **`back` variant carries `margin-bottom: 40px`.** This is intentional for the article page context. If using `back` outside an article header, override with `class` or a wrapping element.

---

## IconButton

### Purpose
Circular icon-only action button. Wraps any Lucide icon (or inline SVG) in a 32×32 px circle.
Transparent by default; shows a dim yellow background (`--bg-accent-dim`) on hover and press.
Accessible: `label` prop is required and becomes `aria-label`.
Renders as a `<button>` only — never an `<a>`.

### File
```
src/components/system/IconButton.astro
```

### Props

| Prop | Type | Default | Required | Notes |
|---|---|---|---|---|
| `label` | `string` | — | ✅ | Becomes `aria-label` — required for screen-reader accessibility |
| `class` | `string` | `undefined` | ❌ | Appended to `.icon-btn`; use for one-off overrides |
| `slot` | Lucide icon or inline SVG | — | ✅ | Pass at `size=20`; do not nest in a wrapper element |
| `...rest` | any | — | ❌ | Spread onto `<button>` (e.g. `onClick`, `disabled`, `type`) |

### Variants
There are no named `variant` values. Visual states are CSS-driven:

| State | Visual |
|---|---|
| Default | Transparent background, `--fg-primary` icon |
| Hover / Active | `--bg-accent-dim` (#E8F23D) background, icon colour unchanged |
| Focus-visible | 2px `--color-focus` outline, 2px offset |

### DOM output
```html
<button class="icon-btn" aria-label="[label]">
  <!-- slotted icon -->
</button>
```

### Usage examples

**Basic (in an `.astro` file):**
```astro
---
import IconButton from '../components/system/IconButton.astro';
import { Copy } from '@lucide/astro';
---
<IconButton label="Copy email address">
  <Copy size=20 />
</IconButton>
```

**In a React `.jsx` file (class-based, no Astro import):**
```jsx
import { Copy } from 'lucide-react';

<button type="button" className="icon-btn" aria-label="Copy email address">
  <Copy size={20} aria-hidden="true" />
</button>
```

### When to use
- Icon-only actions where the tap target must be clear (copy, share, dismiss, etc.)
- Toolbar-style rows of actions with no visible label

### When NOT to use
- When a visible text label is available — use `Button` instead
- As a navigation link — use `Link`
- At a size other than 32×32 (the CSS hard-codes dimensions; do not resize inline)

### Rules Claude must follow
1. **`label` is never optional.** An `<IconButton>` without `aria-label` fails WCAG SC 4.1.2.
2. **Icon size must be 20.** The 32 px button with a 20 px icon is the only defined size. In `.astro` files write `size=20`; in `.jsx` write `size={20}`.
3. **Cannot be imported in React files (.jsx).** Use the `.icon-btn` CSS class directly on a `<button>` element and import the icon from `lucide-react`.
4. **Do not add `background`, `width`, `height`, or `border-radius` inline.** All sizing and colour is controlled by `.icon-btn` in `homepage.css`.
5. **Slot only — no children outside the slot.** Do not add text, labels, or wrapper `<span>` elements alongside the icon.

---

## Global rules

These rules apply to **all four system components**.

### Import paths
Always import from `../components/system/` relative to the consuming file, or use the full path from project root:

```astro
---
import Badge from '../components/system/Badge.astro';
import Button from '../components/system/Button.astro';
import Card from '../components/system/Card.astro';
import Link from '../components/system/Link.astro';
---
```

From a page file in `src/pages/`:
```astro
import Badge from '../components/system/Badge.astro';
```

From a component in `src/components/home/`:
```astro
import Badge from '../system/Badge.astro';
```

### Astro-only — cannot be used in React
All four components are `.astro` files. They **cannot be imported into `.jsx` React files** (Header.jsx, Footer.jsx, WorkSection.jsx, TweaksPanel.jsx). In React files, use the raw CSS class names directly.

### No new CSS
These components introduce no net CSS of their own (`.link-subtle` was added for Link but is now deprecated). All visual output comes from pre-existing classes in `src/styles/homepage.css`. If a visual change is needed, update the CSS class — not the component.

### No hardcoded values
Components never contain hardcoded hex colours, spacing, or font values. All visual behaviour is driven by CSS tokens. If a component appears wrong, check `homepage.css` and `tokens.css`, not the component file.

### Do not modify without a system-level decision
These components are system primitives. Changing a component affects every usage site. Any addition of variants, props, or structural changes must be reflected in:
1. The component file
2. `src/system/system.json` (components array + componentUsesTokens)
3. `src/system/component-inventory.md` (this file)
4. `CLAUDE.md` (system components section + class inventory)
5. `src/pages/design-system/components.astro` and `src/pages/design-system/foundations.astro` (the relevant sections)

---

## Input (planned)

**Status:** Not yet a system component.

There is no `src/components/system/Input.astro`. Input styles exist in `design-system.css` as DS-documentation-only classes (`.ds-input`, `.ds-ask-bar`, `.ds-ask-input`, `.ds-field`, `.ds-field-label`, `.ds-helper`) but are scoped to the design system page and are **not shipped** to product pages.

When Input is promoted, it will be created at `src/components/system/Input.astro` with:
- Props: `type`, `label`, `placeholder`, `error`, `disabled`, `variant` (default | ask-bar)
- Classes: will reuse/promote relevant `homepage.css` or `design-system.css` rules to the main token layer
- This inventory, `system.json`, `CLAUDE.md`, and `components.astro` must all be updated at that time

Do not import or reference Input as a system component until this entry is updated with a file path and props table.
