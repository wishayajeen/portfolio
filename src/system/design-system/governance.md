# Governance

This document covers how the design system is maintained: versioning, contribution process, and the discrepancy log.

---

## Version numbering

The design system uses `major.minor.patch` versioning, tracked in `src/system/system.json`.

**Bump the patch version when any of the following change:**
- A component was added, changed, or deprecated
- A token was added, changed, or deprecated
- A discrepancy was resolved or newly logged
- A page or section was added or removed
- Any structural change to `system.json` itself

**Fields to update together (keep in sync):**
```json
"version": "X.Y.Z",
"lastUpdated": "YYYY-MM-DD",
"release": {
  "version": "X.Y.Z",
  "lastUpdated": "YYYY-MM-DD",
  "notes": "one-line summary of what changed"
}
```

The dashboard at `/design-system/dashboard` reads `version` and `lastUpdated` for its stats display.

## Contribution process

Before committing any change, run the full checklist in [`CLAUDE.md` → Required review checklist](../../../CLAUDE.md#required-review-checklist).

The non-obvious steps that get missed:
1. `npm run build` must pass — always, without exception
2. `system.json` must be updated if components, tokens, discrepancies, or routes changed
3. No hardcoded colors — check `tokens.css` first
4. Run `/review-ds` if making changes to CSS or components

## Discrepancy log

Known deviations from the design system specification are tracked in `system.json discrepancies[]`. Each entry records:
- `id`: kebab-case slug
- `status`: `"open"` | `"resolved"` | `"decision"`
- `title`: short description
- `body`: what was wrong or decided, and why
- `date`: when it was logged
- `resolvedIn`: commit hash (resolved entries only)

The dashboard at `/design-system/dashboard` renders these entries. Edit them in `system.json` — the dashboard reads from there.

The audit history in `src/system/failure-modes.md` is separate from the discrepancy log. `failure-modes.md` is a taxonomy of recurring AI collaboration failure patterns — it documents systemic risks, not instance-level issues. Do not edit it to log individual discrepancies.

## Roadmap

The roadmap is currently tracked in `system.json roadmap[]`. This location is under review — a dependency audit of `dashboard.astro` is needed to determine whether the roadmap data is consumed there before any migration. Until that audit is complete, continue adding roadmap items to `system.json roadmap[]`.

Migration target (post-audit): a `roadmap` section in this file, making governance self-contained.

## Experiment protocol

Changes to this documentation can affect active experiments. Before starting documentation migrations, check `src/system/experiment-001.md` to understand what the experiment baseline looks like and whether a commit should be pinned first.
