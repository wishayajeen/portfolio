# DESIGN.md — AI Entry Point for the Jeen Design System

This file is a routing map. It does not contain design decisions — it points to where they live.

If you are an AI agent working in this codebase, start here.

---

## What this system is

A living design system that doubles as a portfolio. Tokens, components, and rules are documented as structured data so both humans and AI agents can read and act on them correctly.

The guiding principle: **one authoritative origin per decision, not one file containing every decision**.

---

## Where to find things

### Rules — what you must follow
| What | File | When to use |
|---|---|---|
| Architectural constraints, token rules, a11y, element types | [`CLAUDE.md`](./CLAUDE.md) | Always — loaded automatically by Claude Code |
| Component purpose, props, variants, usage rules | [`src/system/component-inventory.md`](./src/system/component-inventory.md) | Before adding or modifying a component |
| All CSS classes (homepage, DS, utilities) | [`src/system/class-inventory.md`](./src/system/class-inventory.md) | Before writing a new class |
| Recurring AI collaboration failure patterns | [`src/system/failure-modes.md`](./src/system/failure-modes.md) | When something feels like it's going wrong |

### Tokens — what colors, spacing, and type to use
| What | File |
|---|---|
| All token names and values | [`src/styles/tokens.css`](./src/styles/tokens.css) |

Tokens are the only source of truth for colors, radii, shadows, and type. Never hardcode a hex value, font name, or spacing value if a token exists.

### Design knowledge — foundations, components, patterns, governance
| What | File |
|---|---|
| Token usage principles, surface model, cascade architecture | [`src/system/design-system/foundations.md`](./src/system/design-system/foundations.md) |
| Component index, ownership table, cross-cutting rules | [`src/system/design-system/components.md`](./src/system/design-system/components.md) |
| Per-component design intent (CRDs) | `src/system/design-system/components/*.crd.md` *(portfolio components — M2b/M2c in progress)* |
| Selection controls *(XConf 2026 educational example — fictional Acme product, not a portfolio component)* | [`src/system/design-system/components/selection-controls.crd.md`](./src/system/design-system/components/selection-controls.crd.md) |
| Versioning, contribution process, discrepancy log | [`src/system/design-system/governance.md`](./src/system/design-system/governance.md) |
| Composition patterns | [`src/system/design-system/patterns.md`](./src/system/design-system/patterns.md) *(stub)* |

### Components — machine-readable
| What | File |
|---|---|
| Machine-readable component registry | [`src/system/system.json`](./src/system/system.json) |
| Human-readable component docs (current monolith) | [`src/system/component-inventory.md`](./src/system/component-inventory.md) |
| Component contracts (props, variants, HTML output) | `src/components/system/*.metadata.json` |
| Actual adoption data (import counts, mimics) | [`src/system/system.generated.json`](./src/system/system.generated.json) |

### Architecture — how pages and components are assembled
| What | Where |
|---|---|
| Page layout | All pages go through [`src/layouts/Layout.astro`](./src/layouts/Layout.astro) |
| Static sections | `.astro` components in `src/components/home/` and `src/components/global/` |
| Interactive islands | `.jsx` components with `client:load`, `client:visible`, or `client:only="react"` |
| Global styles | [`src/styles/tokens.css`](./src/styles/tokens.css), [`src/styles/homepage.css`](./src/styles/homepage.css), [`src/styles/design-system.css`](./src/styles/design-system.css) |

---

## Before you change anything

1. **Check `failure-modes.md`** — this project has documented recurring AI failure patterns. The element-type failure (`<button>` → `<a>`) is the most common. Read before touching interactive elements.
2. **Check the tokens** — every color, radius, shadow, and font has a token. Use it.
3. **Check the component inventory** — the component may already exist.
4. **Run `npm run build`** — always verify before committing.

---

## Experiments

Active experiments in this repo are documented in `src/system/`:

| Experiment | File | Status |
|---|---|---|
| AI-Ready Design System (Experiment 001) | [`src/system/experiment-001.md`](./src/system/experiment-001.md) | Active |

---

## Live design system

The public-facing design system lives at `/design-system/`. It is documentation, not the source of truth — the files above are.
