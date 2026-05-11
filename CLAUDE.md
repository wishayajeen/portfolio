# Jeen Portfolio — Project Rules

This project is a living portfolio and agentic design system built with Astro + React 19 (`@astrojs/react` islands).

---

## Target repo architecture

The project should move toward this structure:

```text
src/
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro
│   ├── design-system/
│   │   ├── index.astro        ← hub: overview + navigation
│   │   ├── foundations.astro  ← tokens, color, type, spacing, principles
│   │   ├── components.astro   ← live component demos + props tables
│   │   └── dashboard.astro    ← discrepancies, decisions, stats
│   └── diary/
│       └── [slug].astro
├── components/
│   ├── global/
│   │   ├── Header.jsx
│   │   └── Footer.jsx
│   ├── home/
│   │   ├── Hero.astro
│   │   ├── PlaygroundSection.astro
│   │   ├── AboutSection.astro
│   │   └── WorkSection.jsx
│   └── system/
│       ├── Badge.astro
│       ├── Button.astro
│       ├── Card.astro
│       └── Link.astro
├── content/
│   └── diary/
├── system/
│   ├── system.json            ← machine-readable registry (authoritative for components, tokens, stats, discrepancies)
│   ├── system-rules.md
│   └── component-inventory.md ← full component docs (purpose, props, variants, usage rules)
├── styles/
│   ├── tokens.css
│   ├── homepage.css
│   └── design-system.css
└── assets/
    ├── brand/
    ├── pocky/
    └── diary/
```

### React in this project

`@astrojs/react` is installed (React 19). React components are proper ES modules with named imports and `export default`. Astro bundles them via Vite — no CDN scripts, no Babel Standalone.

Hydration directives:
| Directive | When to use |
|---|---|
| `client:load` | Must be interactive on first paint (e.g. Header) |
| `client:visible` | Deferred until the component enters the viewport (e.g. WorkSection, Footer) |
| `client:only="react"` | Never server-rendered; uses window APIs (e.g. TweaksPanel) |

Rule: **If a section needs React state → `.jsx` file with `export default`, used as an Astro island. If a section is static → `.astro` component (server-rendered, zero hydration cost).**

Pages should assemble components. Components should reuse existing tokens and CSS classes. The design system routes (`/design-system/*`) are documentation/dashboard — not the source of truth.

---

## Source of truth

- All design tokens live in `src/styles/tokens.css`. This is the only place token values are defined.
- Existing CSS classes are the first option before writing new styles.
- `Layout.astro` (`src/layouts/Layout.astro`) must be used for all pages. It accepts `title` and `description` props (both optional, with defaults) and a `<slot name="head">` for page-specific head content.
- **Never** create a standalone page shell (`<html>`, `<head>`, `<body>`). All pages — including design system routes — go through `Layout.astro`.
- Page-specific stylesheets (e.g. `design-system.css`) are imported in the page frontmatter as a bare import: `import '/src/styles/design-system.css'`. All four `/design-system/*` pages share this import.
- **Component and token inventory live in `src/system/system.json` and `src/system/component-inventory.md`** — check these before adding a new component or token.

---

## Token usage rules

### Use semantic tokens first
Prefer semantic tokens over primitive ones in all product code:

| Purpose | Token |
|---|---|
| Page background | `--bg-primary` |
| Card / raised surface | `--bg-surface`, `--bg-surface-raised` |
| Dark section (hero, footer) | `--bg-dark` |
| Accent / CTA background | `--bg-accent` |
| Primary text | `--fg-primary` |
| Body / secondary text | `--fg-secondary` |
| Captions, labels | `--fg-tertiary` *(light bg only — see a11y rules)* |
| Text on dark background | `--fg-on-dark-primary`, `--fg-on-dark-secondary`, `--fg-on-dark-label` |
| Accent text on dark | `--fg-on-dark-accent` |
| Default border | `--border-primary` |
| Subtle border | `--border-subtle` |
| Divider on dark surface | `--border-on-dark` |
| Accent border | `--border-accent` |
| Focus ring | `--color-focus` |
| CTA color | `--color-cta` |
| Error / coming-soon | `--color-error` |

Use **primitive tokens** (e.g. `--color-yellow`, `--color-gray-300`) only when documenting the design system itself (e.g. in `design-system.astro`), not in product pages.

### No hardcoded values
- **Never** hardcode a hex color, font name, spacing value, shadow, or border radius if a token exists.
- If you are tempted to write a hex value, check `tokens.css` first.
- `rgba()` tints derived from a token color are acceptable *only* for subtle overlays (e.g. badge backgrounds); document why.

### Do not invent new tokens or colors
- Do not add new CSS variables outside of `tokens.css`.
- Do not create a new visual language (new palette, new shadow style, new radius scale).
- Do not rename or change existing token values unless explicitly instructed.

---

## Accessibility contrast rules

These are hard rules. Violating them ships a WCAG AA failure.

### Text on light backgrounds (`--bg-primary` #FAFAFA, `--bg-surface` #F5F5F0, white)
| Token | Value | Contrast | Status |
|---|---|---|---|
| `--fg-primary` | #0A0A0A | ~19:1 | ✅ Safe |
| `--fg-secondary` | #3A3A35 | ~9:1 | ✅ Safe |
| `--fg-tertiary` | #9A9A90 | ~2.6:1 | ❌ **Fails AA — never use for small text on light bg** |
| `--color-gray-500` | #6A6A60 | ~5.1:1 | ⚠️ Borderline — avoid for small text |

**Rule:** Use `--fg-secondary` as the minimum for body text and metadata on light surfaces. `--fg-tertiary` fails AA — do not use it for readable text.

### Text on dark background (`--bg-dark` #0A0A0A)
| Token | Value | Contrast | Status |
|---|---|---|---|
| `--fg-on-dark-primary` | #FAFAFA | ~19:1 | ✅ Safe |
| `--fg-on-dark-secondary` | #C8C8C0 | ~9:1 | ✅ Safe |
| `--fg-on-dark-label` | #9A9A90 | ~5:1 | ✅ Safe (AA large text) |
| `--fg-on-dark-accent` | #F3FE52 | ~17.6:1 | ✅ Safe |
| `--color-gray-500` | #6A6A60 | ~1.6:1 | ❌ **Never use on dark** |
| `--color-gray-700` | #3A3A35 | ~1.96:1 | ❌ **Never use on dark** |
| `--color-gray-900` | #1A1A15 | ~1.1:1 | ❌ **Never use on dark** |

### Text on yellow (`--color-yellow` #F3FE52)
- **Only** use `--color-black` (#0A0A0A). Yellow is very light — all grays and white fail.

---

## Component reuse rules

Before writing any new CSS class:
1. Check `homepage.css` for an existing class that covers this use case.
2. Check `design-system.css` for DS-scoped classes (used by all `/design-system/*` pages).
3. If an existing class is close but needs a modifier, add a modifier variant — do not create a parallel class.
4. Only create a new class if nothing existing can be extended.
5. Do not change existing components or classes unless explicitly instructed.

New component files go in `src/components/`. New shared styles go in the relevant CSS file with semantic class names.

---

## Inventory — where to look

Before adding a component, class, token, or page — check the authoritative sources:

| What you need | Where to look |
|---|---|
| System components (Badge, Button, Card, Link) | `src/system/component-inventory.md` |
| All CSS classes (homepage, DS, article, utilities) | `src/system/class-inventory.md` |
| Machine-readable registry (routes, stats, discrepancies) | `src/system/system.json` |
| Token names and values | `src/styles/tokens.css` |

---

## Required review checklist — run before every "done"

Before declaring any task complete, check all of the following:

- [ ] **Tokens used** — no hardcoded hex colors, font names, spacing values, shadow values, or border radii where a token exists
- [ ] **Semantic tokens preferred** — `--fg-primary` not `--color-black`; `--bg-surface` not `#F5F5F0`
- [ ] **No new colors invented** — every color value traces back to a token in `tokens.css`
- [ ] **Existing components reused** — checked `class-inventory.md` and `component-inventory.md` before writing a new class
- [ ] **No new component class created without reason** — if a new class exists, document why no existing one could be extended
- [ ] **A11y: light surface text** — all body/metadata text uses `--fg-secondary` or darker; `--fg-tertiary` not used for small readable text
- [ ] **A11y: dark surface text** — only `--fg-on-dark-*` tokens used; gray-500/700/900 never used on dark
- [ ] **A11y: yellow surface text** — only `--color-black` used
- [ ] **Layout.astro used** — new pages go through `Layout.astro`, not a custom shell
- [ ] **`npm run build` passes** — no build errors before pushing
- [ ] **`system.json` kept current** — if any of the following changed, update `version` (patch bump), `lastUpdated` (today's date YYYY-MM-DD), and `release.notes` before committing:
  - a component was added, changed, or deprecated
  - a token was added, changed, or deprecated
  - a discrepancy was resolved or newly logged
  - a page or section was added or removed
  - any structural change to `system.json` itself
