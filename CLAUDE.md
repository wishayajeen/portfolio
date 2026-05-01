# Jeen Portfolio — Project Rules

This project is a living portfolio and agentic design system built with Astro + inline React (Babel).

---

## Target repo architecture

The project should move toward this structure:

```text
src/
├── layouts/
│   └── Layout.astro
├── pages/
│   ├── index.astro
│   ├── design-system.astro
│   ├── diary.astro
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
│       └── Card.astro
├── content/
│   └── diary/
├── system/
│   ├── system.json
│   ├── system-rules.md
│   └── component-inventory.md
├── styles/
│   ├── tokens.css
│   ├── homepage.css
│   ├── article.css
│   └── design-system.css
└── assets/
```

### React in this project

`@astrojs/react` is **not** installed. React (18) and ReactDOM are loaded as UMD globals via CDN scripts in `Layout.astro`. Babel Standalone processes JSX at runtime.

Component files in `src/components/**/*.jsx` contain only component function definitions — **no import statements**. They are imported in page frontmatter with `?raw` (Vite raw import) and concatenated into a single `<script type="text/babel">` block via `set:html`. Astro does not process these files as component islands.

Rule: **If a section needs React state → `.jsx` file (embedded via `?raw`). If a section is static → `.astro` component (server-rendered, no hydration cost).**

Pages should assemble components. Components should reuse existing tokens and CSS classes. The `design-system.astro` page is documentation/dashboard — not the source of truth.

---

## Source of truth

- All design tokens live in `src/styles/tokens.css`. This is the only place token values are defined.
- Existing CSS classes are the first option before writing new styles.
- `Layout.astro` (`src/layouts/Layout.astro`) must be used for all pages. It accepts `title` and `description` props (both optional, with defaults) and a `<slot name="head">` for page-specific head content.
- **Never** create a standalone page shell (`<html>`, `<head>`, `<body>`). All pages — including `design-system.astro` — go through `Layout.astro`.
- Page-specific stylesheets (e.g. `design-system.css`) are imported in the page frontmatter as a global import: `import '/src/styles/design-system.css'`.

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
2. Check `design-system.astro`'s `<style>` block for DS-scoped classes.
3. If an existing class is close but needs a modifier, add a modifier variant — do not create a parallel class.
4. Only create a new class if nothing existing can be extended.
5. Do not change existing components or classes unless explicitly instructed.

New component files go in `src/components/`. New shared styles go in the relevant CSS file with semantic class names.

---

## Current component / class inventory

### Layout
- `Layout.astro` — global shell: `<html>`, `<head>`, nav, global styles. **All pages use this.**

### Pages
- `src/pages/index.astro` — assembler page: imports static Astro components + mounts React components via `?raw` + `set:html`
- `src/pages/design-system.astro` — DS viewer; uses `Layout.astro` like all other pages

### Global components (`src/components/global/`)
- `Header.jsx` — fixed nav with scroll + mobile menu state; mounted to `#header-root` via React
- `Footer.jsx` — CTA band + footer bottom with copy-email state; mounted to `#footer-root` via React

### Home components (`src/components/home/`)
- `Hero.astro` — static hero section; scroll-to handled via inline `<script>`; props: `pockyIdleSrc`
- `PlaygroundSection.astro` — static experiments grid + diary list; props: `diaryEntries`, `diaryTotal`
- `AboutSection.astro` — static about grid + profile card; props: `logoSrc`
- `WorkSection.jsx` — static work rows (no state but target specifies .jsx); mounted to `#work-root` via React
- `TweaksPanel.jsx` — edit-mode tweaks panel with postMessage; appended to `<body>` via React
- `src/pages/diary/[slug].astro` — article pages

### Stylesheets
- `src/styles/tokens.css` — all design tokens (colors, type, spacing, shadows, radii, animation)
- `src/styles/homepage.css` — all homepage + shared component styles (loaded via `Layout.astro`)
- `src/styles/design-system.css` — DS-page-scoped styles (imported in `design-system.astro` frontmatter only)

### Homepage component classes (`homepage.css`)

**Navigation**
`nav-link`, `mobile-menu-btn`

**Hero**
`hero-badge`, `hero-badge-dot`, `hero-badge-label`, `hero-headline`, `hero-headline-accent`, `hero-headline-squiggle`, `hero-sub`, `hero-ctas`, `hero-cta-primary`, `hero-cta-secondary`, `hero-grid`, `hero-bg-grid`, `hero-scroll-indicator`, `hero-scroll-mouse`, `hero-scroll-dot`, `hero-scroll-label`, `hero-social-row`, `hero-social-link`, `hero-social-label`

**Work section**
`work-section`, `work-inner`, `work-eyebrow`, `work-headline`, `work-header`, `work-table-header`, `work-row`, `work-row-grid`, `work-col-label`, `work-num`, `work-tag-row`, `work-tag`, `work-title`, `work-desc`, `work-detail-row`, `work-meta-label`, `work-meta-dot`, `work-year`, `work-year-col`, `work-tools`, `work-tool`, `work-count`, `work-arrow`, `work-expand`, `work-coming-soon-badge`, `work-coming-soon-badge-label`, `work-coming-soon-dot`

**Playground section**
`playground-section`, `playground-inner`, `pg-section-header`, `pg-header-row`, `pg-eyebrow`, `pg-headline`, `pg-subhead`, `pg-cards-grid`, `pg-diary-header`, `pg-diary-title`, `pg-diary-count`, `pg-diary-list`, `pg-diary-link`, `play-card`, `play-card--accent`, `play-card-header`, `play-card-tag`, `play-card-title`, `play-card-desc`, `play-card-cta`

**About section**
`about-section`, `about-inner`, `about-eyebrow`, `about-headline`, `about-grid`, `about-card`, `about-card-avatar`, `about-card-profile`, `about-card-name`, `about-card-role`, `about-card-quote`, `about-card-stats`, `about-stat`, `about-stat-num`, `about-stat-label`, `about-body`, `about-text-body`, `about-skills`, `about-skill-tag`, `pocky-circle`, `pocky-img`

**Diary cards**
`diary-card`, `diary-content`, `diary-date-block`, `diary-date-day`, `diary-date-month`, `diary-tag`, `diary-title`, `diary-meta`, `diary-read-time`, `diary-arrow`

**Footer**
`footer-inner`, `footer-cols`, `footer-brand-header`, `footer-brand-logo`, `footer-brand-name`, `footer-brand-desc`, `footer-nav-cols`, `footer-nav-col`, `footer-nav-heading`, `footer-link`, `footer-status-col`, `footer-status-badge`, `footer-status-dot`, `footer-status-heading`, `footer-cta`, `footer-cta-inner`, `footer-cta-content`, `footer-eyebrow`, `footer-headline`, `footer-sub`, `footer-email-row`, `footer-email-input`, `footer-email-btn`, `footer-email-copy-group`, `footer-copy-btn`, `footer-copy-icon`, `footer-contact-row`, `footer-contact-link`, `footer-contact-divider`, `footer-social-links`, `social-pill`, `footer-success`, `footer-success--inline`, `footer-success-dot`, `footer-bottom`, `footer-bottom-bar`, `footer-copyright`, `footer-version`, `footer-powered`, `footer-powered-avatar`, `footer-powered-label`

**Article / Diary page**
`article-page`, `article-header`, `article-header-inner`, `article-eyebrow`, `article-title`, `article-description`, `article-meta`, `article-content`, `article-footer`, `article-footer-inner`, `article-footer-link`, `article-back-link`

**Animation utilities**
`fade-up`, `fade-up-1`, `fade-up-2`, `fade-up-3`, `fade-up-4`

### Design system page classes (`design-system.astro`)
These are scoped to the DS page only. Do not reuse in other pages.

**Layout:** `ds-page`, `ds-topbar`, `ds-topbar-sep`, `ds-topbar-title`, `ds-hero`, `ds-hero-inner`, `ds-hero-eyebrow`, `ds-hero-title`, `ds-hero-sub`, `ds-hero-meta`, `ds-hero-meta-item`, `ds-section`, `ds-section-header`, `ds-section-num`, `ds-section-title`, `ds-subsection`, `ds-sub-label`, `ds-row`, `ds-col`, `ds-divider`, `ds-card`, `ds-code`, `toc`, `toc-dot`, `ds-footer`, `ds-footer-inner`, `ds-footer-link`

**Components:** `ds-btn`, `ds-btn-primary`, `ds-btn-dark`, `ds-btn-outline`, `ds-btn-ghost`, `ds-btn-sm`, `ds-badge`, `ds-badge-yellow`, `ds-badge-dark`, `ds-badge-outline`, `ds-badge-gray`, `ds-badge-success`, `ds-badge-error`, `ds-badge-ghost`, `ds-badge-coming`, `ds-tag`, `ds-tag-yellow`, `ds-tag-mono`, `ds-project-card`, `ds-project-card-dark`, `ds-project-card-accent`, `card-tag-inner`, `card-title-inner`, `card-body-inner`, `ds-input`, `ds-input-wrap`, `ds-field`, `ds-field-label`, `ds-helper`, `ds-ask-bar`, `ds-ask-input`, `ds-ask-btn`, `ds-table`, `principle-card`, `principles-grid`, `principle-icon`, `principle-title`, `principle-body`, `disc-card`, `disc-card-header`, `disc-card-title`, `disc-card-body`

**State modifiers (DS demo only):** `state-hover`, `state-active`, `dot` — utility classes for simulating interactive states in documentation. Do not use in product pages.

**Display helpers:** `swatch-grid`, `swatch-item`, `swatch-color`, `swatch-info`, `swatch-name`, `swatch-hex`, `swatch-use`, `semantic-grid`, `semantic-chip`, `semantic-dot`, `semantic-info`, `semantic-token`, `semantic-hex`, `semantic-desc`, `dark-text-demo`, `dark-text-item`, `dark-text-sample`, `dark-text-token`, `dark-text-ratio`, `type-specimen`, `type-meta`, `type-sample`, `space-row`, `space-bar`, `space-label`, `shadow-box`, `shadow-item`, `shadow-meta`, `radius-box`, `bg-swatch`, `bg-label`, `anim-row`, `anim-demo`, `anim-info`, `anim-name`, `anim-value`

---

## Required review checklist — run before every "done"

Before declaring any task complete, check all of the following:

- [ ] **Tokens used** — no hardcoded hex colors, font names, spacing values, shadow values, or border radii where a token exists
- [ ] **Semantic tokens preferred** — `--fg-primary` not `--color-black`; `--bg-surface` not `#F5F5F0`
- [ ] **No new colors invented** — every color value traces back to a token in `tokens.css`
- [ ] **Existing components reused** — checked the inventory above before writing a new class
- [ ] **No new component class created without reason** — if a new class exists, document why no existing one could be extended
- [ ] **A11y: light surface text** — all body/metadata text uses `--fg-secondary` or darker; `--fg-tertiary` not used for small readable text
- [ ] **A11y: dark surface text** — only `--fg-on-dark-*` tokens used; gray-500/700/900 never used on dark
- [ ] **A11y: yellow surface text** — only `--color-black` used
- [ ] **Layout.astro used** — new pages go through `Layout.astro`, not a custom shell
- [ ] **`npm run build` passes** — no build errors before pushing
