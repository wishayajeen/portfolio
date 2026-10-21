# Components

Five core components are available in the design system. All live in `src/components/system/`.

## Component index

| Component | Implementation | Machine contract | Design intent |
|-----------|---------------|-----------------|---------------|
| Badge | [Badge.astro](../../components/system/Badge.astro) | [Badge.metadata.json](../../components/system/Badge.metadata.json) | [badge.crd.md](./components/badge.crd.md) *(M2c)* |
| Button | [Button.astro](../../components/system/Button.astro) | [Button.metadata.json](../../components/system/Button.metadata.json) | [button.crd.md](./components/button.crd.md) *(M2b)* |
| Card | [Card.astro](../../components/system/Card.astro) | [Card.metadata.json](../../components/system/Card.metadata.json) | [card.crd.md](./components/card.crd.md) *(M2c)* |
| Link | [Link.astro](../../components/system/Link.astro) | [Link.metadata.json](../../components/system/Link.metadata.json) | [link.crd.md](./components/link.crd.md) *(M2c)* |
| IconButton | [IconButton.astro](../../components/system/IconButton.astro) | [IconButton.metadata.json](../../components/system/IconButton.metadata.json) | [icon-button.crd.md](./components/icon-button.crd.md) *(M2c)* |

CRD files are being created in M2b (Button) and M2c (remaining). Until they exist, use `src/system/component-inventory.md` for design intent documentation.

## What each layer owns

This table defines ownership clearly — each type of fact has exactly one authoritative source.

| Layer | File type | Owns | Does NOT own |
|-------|-----------|------|-------------|
| Implementation | `*.astro` | HTML structure, CSS classes, Astro props API, rendering logic | Design rationale, usage guidance |
| Machine contract | `*.metadata.json` | Props schema, variant list, HTML output spec, a11y attributes, usage rules (machine-readable) | Design reasoning, cascade warnings |
| Design intent (CRD) | `*.crd.md` | Why the component exists, visual behavior description, cascade risks, constraint reasoning | Props schema (→ metadata.json), token values (→ tokens.css) |
| Token values | `tokens.css` | All color, spacing, shadow, and radius values | Component-specific usage |

CRDs reference the other layers. They do not duplicate props tables or token values — they explain the decisions behind them.

## Cross-cutting rules

### Astro components cannot be imported in JSX
`Button.astro`, `Badge.astro`, `Card.astro`, `Link.astro`, and `IconButton.astro` are Astro server components. They cannot be imported or used inside React (`.jsx`) files. In `.jsx` contexts, use the equivalent CSS classes directly (e.g. `.hero-cta-primary`, `.hero-cta-secondary`).

### Element type behavior
`Button` renders as `<a href="...">` when `href` is passed, and as `<button>` otherwise. This is intentional — link semantics matter for keyboard navigation, right-click behavior, and accessibility. When working with Button, read [foundations.md → Global CSS cascade architecture](./foundations.md#global-css-cascade-architecture) before choosing whether to pass `href`.

### Before adding a new component
Check `src/system/component-inventory.md` first. Also check `src/system/class-inventory.md` — the right approach may be a new CSS class on an existing element, not a new component.

## Current monolith status
`src/system/component-inventory.md` is the current full documentation source (v0.5.9, last synced). It remains authoritative until the per-component CRD files are complete. After M2c, it will be deprecated in favor of the CRD files.
