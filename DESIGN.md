# DESIGN.md — AI Entry Point

This file provides high-level product context and design decision orientation. Detailed requirements and implementation rules live in their authoritative sources — linked below.

If you are an AI agent working in this codebase, start here.

---

## What this system is

A personal portfolio showcasing work and thinking at the intersection of design systems, product design, and AI — and a public experiment in building a design system that AI agents can read and act on correctly. Tokens, components, and rules are documented as structured data so both humans and AI agents can discover constraints, apply them correctly, and produce work that matches the system's intent.

Visitors are exploring design work, professional expertise, technical experiments, and the thinking behind design decisions. The core experience goal is to make complex design and technical ideas approachable without sacrificing depth, credibility, or craft.

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
| Versioning, contribution process, discrepancy log | [`src/system/design-system/governance.md`](./src/system/design-system/governance.md) |
| Composition patterns | [`src/system/design-system/patterns.md`](./src/system/design-system/patterns.md) *(stub)* |

> **⚠️ Educational examples — not authoritative portfolio CRDs**
> The following CRDs were created as illustrative examples for the XConf Americas 2026 talk "Your Design System Has a New User: AI." They demonstrate the CRD format using a fictional product called **Acme**. No Acme component exists in this portfolio's design system. Do not treat them as implemented requirements for jeensdesign.com.
>
> - [`src/system/design-system/components/switch.crd.md`](./src/system/design-system/components/switch.crd.md)
> - [`src/system/design-system/components/checkbox.crd.md`](./src/system/design-system/components/checkbox.crd.md)
> - [`src/system/design-system/components/radio-group.crd.md`](./src/system/design-system/components/radio-group.crd.md)

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

## How to approach design decisions

Before choosing a layout, component, or visual treatment:

1. **Understand purpose first** — identify the page's goal and the visitor's primary task before deciding on structure or components.
2. **Reuse before creating** — check the component inventory, class inventory, and token set before writing anything new.
3. **Follow documented intent** — use CRDs and `foundations.md` for design rationale; do not infer rules from visual similarity alone.
4. **Preserve the visual language** — do not change the established palette, type scale, spacing rhythm, or interaction patterns unless a change is explicitly requested.
5. **Name gaps, don't fill them** — when requirements are missing, ambiguous, or contradictory, surface the uncertainty rather than inventing a convention.

These principles apply alongside the mandatory constraints in `CLAUDE.md`, which always take precedence.

---

## Decision boundaries — where constraints live

`DESIGN.md` orients; the files below govern. Read them before acting.

| What you need | Where it lives |
|---|---|
| Mandatory implementation and accessibility constraints | [`CLAUDE.md`](./CLAUDE.md) |
| Token usage reasoning and surface rules | [`src/system/design-system/foundations.md`](./src/system/design-system/foundations.md) |
| Component selection and design intent | Component inventory + CRDs (`src/system/design-system/components/*.crd.md`) |
| Actual token names and values | [`src/styles/tokens.css`](./src/styles/tokens.css) |

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
