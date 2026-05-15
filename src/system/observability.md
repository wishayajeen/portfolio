# Design System Observability

How `system.generated.json` is produced and what it tracks.

---

## Running the script

```bash
npm run analyze-system
```

Output: `src/system/system.generated.json`

Run this after any of the following:
- A system component is newly imported in a product file
- A raw CSS mimic is added or removed from a source file
- A migration is completed (update `MIGRATION_OPPORTUNITIES` config in the script)
- Data arrays change size (update `RUNTIME_INSTANCE_OVERRIDES` config)

---

## What is auto-detected

**Import-based adoption** — the script scans product scope files for:
- `import X from '...system/ComponentName.astro'` → records which files import each component
- `<ComponentName` occurrences in the template section → counts source usages
- `variant=` prop values → records which variants are used

**Raw CSS class occurrences** — the script scans product and DS-page files for:
- `class=` / `className=` attribute values containing each known raw CSS class
- Reports file path and line number for each occurrence
- Detects element type (`<button>`, `<a>`, `<span>`) from surrounding context

**Derived fields** — computed from the above:
- `adoptionStatus`: adopted / partially-adopted / raw-pattern-only / not-used
- `variantsNotUsed`: all known variants minus direct-import variants minus raw-CSS variants
- `blockedUsages`: raw mimics found in `.jsx` files (React islands can't import Astro)

---

## What requires manual config (in the script)

These fields cannot be inferred from static analysis and must be maintained in `scripts/analyze-system.mjs`:

| Config section | What to update |
|---|---|
| `SYSTEM_COMPONENTS` | Add/remove components or change variant lists |
| `RAW_MIMIC_PATTERNS` | Add/remove raw CSS patterns; update `migrationStatus`, `migrationNote`, `runtimeCount` |
| `RUNTIME_INSTANCE_OVERRIDES` | Update when data arrays change size (e.g. more diary entries, projects) |
| `MIGRATION_OPPORTUNITIES` | Move items between `migrated`, `feasible`, `blocked`, `permanentlyBlocked` when migrations complete |

---

## Product scope vs DS-pages scope

**Product scope** (`PRODUCT_IMPORT_SCOPE`):
- `src/components/home/` — Astro and React home sections
- `src/components/global/` — Header, Footer
- `src/pages/index.astro`
- `src/pages/diary/[slug].astro`

Used for: import-based adoption tracking AND raw CSS mimic detection.

**DS pages scope** (`DS_PAGES_SCOPE`):
- `src/pages/design-system/`

Used for: raw CSS mimic detection ONLY.
Rationale: `components.astro` imports all 5 system components for documentation demos — counting those as product adoption would inflate the numbers. However, the DS pages still use raw `back-link` and `footer-nav-link` classes in their own navigation, which are real migration opportunities.

**Always excluded**:
- `src/components/system/` — the component definition files themselves

---

## Detection approach

### Import detection

```
import Badge from '../../components/system/Badge.astro'
```

Regex: `import\s+(\w+)\s+from\s+['"][^'"]*(?:system)/ComponentName\.astro['"]`

Captures the local alias (the `Badge` in `import Badge from ...`). Multi-level relative paths are handled by matching on the `system/` path segment regardless of depth.

### Usage detection

```
<Badge variant="skill" label={s} />
```

Searches the template section of `.astro` files (not the frontmatter) and the full content of `.jsx` files for `<ComponentName\b`. For each match, extracts the opening tag by parsing brace depth and quoted strings — this correctly handles multi-line tags without reading into child elements.

Variant extraction handles:
- Static: `variant="accent"` → `['accent']`
- Dynamic single: `variant={'accent'}` → `['accent']`
- Ternary/conditional: `variant={exp.accent ? 'accent' : 'default'}` → `['accent', 'default']`
- Fully dynamic (no string literals): `variant={someVar}` → `null` (recorded as `(fully dynamic)`)

### Raw CSS class detection

```
class="nav-link"   className="work-tag"
```

Regex: `class(?:Name)?=["'][^"']*(?<![a-zA-Z0-9-])cssClass(?![a-zA-Z0-9-])[^"']*["']`

The negative lookbehind/lookahead `(?<![a-zA-Z0-9-])` / `(?![a-zA-Z0-9-])` prevents partial matches:
- `nav-link` does NOT match inside `footer-nav-link` (preceded by `-`)
- `work-tag` does NOT match inside `work-tag-row` (followed by `-`)

Class attribute detection requires the match to be inside a `class=` or `className=` attribute value — text content occurrences (e.g., in documentation tables) are not counted.

---

## Approximations and known limitations

### Runtime instance counts

`estimatedRuntimeInstances` comes from `RUNTIME_INSTANCE_OVERRIDES` config, not from code analysis. The script cannot determine at static analysis time how many times a component renders inside a `.map()` call without knowing the data array's length.

If no override is specified, runtime equals source instances (conservative lower bound).

Update `RUNTIME_INSTANCE_OVERRIDES` when data arrays change:
- `badge: 14` — 4 tag + 2 coming-soon + 2 diary-tag + 6 skill (4 experiments, 2 diary entries, 6 skills)
- `card: 6` — 1 accent + 3 default + 2 diary (4 experiments, 2 diary entries)

### Element type detection for raw CSS classes

When a raw CSS class appears on its own line (multi-line JSX attribute), the script scans ±3 surrounding lines for an element tag. This heuristic works for the current codebase but may miss element type in unusual formatting.

`filterElement` config in `RAW_MIMIC_PATTERNS` constrains detection to specific element types, which handles the `footer-nav-link` case where `<button>` and `<a>` use the same class in the same file.

### Migration opportunity lists

`migrationOpportunities.migrated`, `.feasible`, `.blocked`, and `.permanentlyBlocked` are editorial text lists maintained in the script config. They are not derived from source analysis.

---

## Corrections over the initial manual file (v0.6.12)

When the script was introduced in v0.6.13, it found two inaccuracies in the prior manual `system.generated.json`:

- **badge `variantsUsedViaRawCSS`**: missing `coming-soon`. The `work-coming-soon-badge` raw CSS class maps to the `coming-soon` variant — the manual file listed the mimic but did not include `coming-soon` in the variant set.
- **icon-button `variantsUsedViaRawCSS`**: missing `default`. Same issue — the `icon-btn` mimic maps to `default` but the variant wasn't recorded.
- **summary `productScope.sourceOccurrences`**: was 5, correctly 6. The `icon-btn` mimic (product scope) was not counted in the summary total.

These are corrected automatically in every subsequent run.
