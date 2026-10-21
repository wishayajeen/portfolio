# Foundations

This document explains the *reasoning* behind the design system's core constraints. Rules and hard values are in [`CLAUDE.md`](../../../CLAUDE.md) and [`tokens.css`](../../styles/tokens.css) — those are authoritative. This document adds the "why" layer that helps you apply those rules correctly at decision time.

---

## The core principle: surfaces determine text

Every visible element sits on a surface. The surface — not the element — determines which text and border tokens are valid. Using the wrong token for the surface produces a contrast failure, even if the token looks correct in isolation.

## Token hierarchy

Two layers:

- **Primitive tokens** (`--color-yellow`, `--color-gray-300`) — raw color values. Use only when documenting the design system (swatch displays, token tables). Never in product code.
- **Semantic tokens** (`--bg-accent`, `--fg-on-dark-primary`) — purpose-bound. These are what product code uses.

The semantic layer exists because "dark gray text" is not a purpose — "body text on a light surface" is. Semantic tokens encode that intent, so changing a raw color value propagates correctly everywhere it's used.

→ All token names and values: [`src/styles/tokens.css`](../../styles/tokens.css)
→ Usage constraints and semantic token table: [`CLAUDE.md` → Token usage rules](../../../CLAUDE.md#token-usage-rules)

## Surface token families

Each surface has a dedicated token family. Never mix families across surface boundaries.

| Surface | Background token | Text tokens | Notes |
|---------|-----------------|-------------|-------|
| Default page | `--bg-primary` | `--fg-primary`, `--fg-secondary` | `--fg-tertiary` fails AA here |
| Raised card | `--bg-surface`, `--bg-surface-raised` | `--fg-primary`, `--fg-secondary` | Same constraint as page bg |
| Dark section | `--bg-dark` | `--fg-on-dark-*` family only | `--fg-secondary` fails on dark |
| Accent (yellow) | `--bg-accent` | `--color-black` only | All grays and white fail on yellow |

The most common mistake: using `--fg-secondary` or `--fg-tertiary` on a dark surface. These tokens are designed for light surfaces and fail against `--bg-dark`.

→ Specific contrast ratios and pass/fail verdicts: [`CLAUDE.md` → Accessibility contrast rules](../../../CLAUDE.md#accessibility-contrast-rules)

## Why `--fg-tertiary` is restricted

`--fg-tertiary` (#9A9A90) passes WCAG AA on dark surfaces (~5:1) but **fails** on light surfaces (~2.6:1). It is labelled "light bg only" in the token table because it was designed for labeled/secondary text on `--bg-dark`, not for general body text on `--bg-primary` or `--bg-surface`.

Use `--fg-secondary` as the minimum contrast for any readable text on light surfaces.

## Global CSS cascade architecture

The global `a {}` rule in `tokens.css` applies to **all `<a>` elements sitewide**:
- `box-shadow`: yellow offset underline effect
- `color` on `:hover`: yellow (`--color-yellow`)

This cascade cannot be escaped by adding a class — it applies before any class-scoped styles. Any component or element that renders as `<a>` must override these defaults explicitly.

**What needs overriding:**
1. `box-shadow` (the underline effect)
2. `color` on `:hover` (yellow bleeds through)
3. `text-decoration` (browser defaults differ from `<button>`)
4. `line-height` (different default from `<button>`)

**What already handles this:** `Button.astro` (via `.hero-cta-primary`), `Link.astro` (via its own variants). If you add a new `<a>` element outside these components, you must handle all four explicitly.

→ For documented failure patterns from missing these overrides: [`failure-modes.md` → Architectural Blindness](../failure-modes.md), [Semantic Element Drift](../failure-modes.md)
→ For the element type decision rule: [`CLAUDE.md` → Element type rules](../../../CLAUDE.md#element-type-rules)

## What this document owns

| Topic | Owned here | Authoritative source |
|-------|-----------|---------------------|
| Token usage reasoning | ✓ | `foundations.md` |
| Token values | — | `tokens.css` |
| Hard constraint rules | — | `CLAUDE.md` |
| Component cascade details | — | Per-component CRDs |
| A11y contrast ratios | — | `CLAUDE.md` |
