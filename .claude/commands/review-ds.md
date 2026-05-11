# /review-ds — Design System Audit

Audit files in this project against the Jeen Design System rules defined in `CLAUDE.md`.

---

## Scope: file-scoped vs. diff-scoped

**Before starting, determine the audit scope:**

1. Check if a clean-pass record exists: look for a file `.claude/review-ds-clean.txt` in the repo.
   - If the file **does not exist** → the codebase has never been fully audited and signed off as clean. Run a **file-scoped audit**: audit the full contents of `src/styles/homepage.css`, `src/styles/design-system.css`, and all `.astro` / `.jsx` / `.js` files under `src/`.
   - If the file **exists** → prior full audit has passed. Run a **diff-scoped audit**: use `git diff --name-only HEAD` (or `HEAD~1` if nothing staged) and audit only those changed files.

2. State which mode you are running at the top of the report.

**After a diff-scoped audit passes with zero violations and zero warnings,** create or update `.claude/review-ds-clean.txt` with the current date and commit SHA. This marks the codebase as audited.

---

## Step 1: Identify files to audit

**File-scoped mode:** Audit all `.astro`, `.css`, `.jsx`, `.ts`, `.tsx`, `.js` files under `src/`.

**Diff-scoped mode:** Run `git diff --name-only HEAD` to get all modified files (fall back to `HEAD~1` if empty). Filter to only `.astro`, `.css`, `.ts`, `.tsx`, `.jsx`, `.js` files.

List the files being audited before starting.

---

## Step 1b: Structural drift check — ALWAYS run regardless of scope

This step runs on every audit, file-scoped or diff-scoped. It verifies that `system.json` reflects actual disk state. Run these three checks using shell commands:

**A. Route files exist**

For each entry in `system.json routes[]`, check that `route.file` exists on disk:
```bash
# example
ls src/pages/design-system/index.astro
```
- File exists → OK
- File missing → **violation**: `system.json routes[] has stale entry for "<path>" — file not found`

**B. Component files exist**

For each entry in `system.json components[]`, check that `component.file` exists on disk:
```bash
ls src/components/system/Badge.astro
```
- File exists → OK
- File missing → **violation**: `system.json components[] has stale entry for "<file>" — file not found`

**C. Diary entries are in sync**

Compare `system.json content.collections[0].entries[].slug` against actual `.md` filenames in `src/content/diary/`:
```bash
ls src/content/diary/
```
- A slug in `entries[]` with no matching `.md` file → **violation**: `entries[] has stale slug "<slug>" — no matching file`
- A `.md` file in `src/content/diary/` with no matching slug in `entries[]` → **violation**: `diary file "<slug>.md" not in system.json entries[] — run /diary or add manually`

Report each violation in the Step 1b section before continuing. These are blocking — structural drift means the dashboard and audit are reading wrong data.

---

## Step 2: Hardcoded hex values

Grep each audited file for hex color patterns: `#[0-9A-Fa-f]{3,6}`.

For every match:
- Check if an equivalent token exists in `src/styles/tokens.css`.
- If a token exists → flag as **violation**.
- If no token exists (e.g. a one-off rgba overlay) → flag as **warning**, ask if it should be added to tokens.

Exempt: hex values inside `design-system.astro` used purely for documentation display (swatch colors, demo values). Flag everything else.

---

## Step 3: Unsafe text/background pairings — ALWAYS file-scoped for contrast checks

**Regardless of audit mode (diff or file), always scan the full `src/styles/homepage.css` and `src/styles/design-system.css` for contrast violations. Pre-existing violations are violations — there is no "pre-existing exemption".**

Look for any element that sets a text color (`color:`) in a context that implies a surface.

Cross-check against the unsafe combos from `CLAUDE.md`:

| Pairing | Verdict |
|---|---|
| `--fg-tertiary` / `#9A9A90` on light bg | ❌ FAIL — use `--fg-secondary` |
| `--color-gray-500` / `#6A6A60` on dark bg | ❌ FAIL |
| `--color-gray-700` / `#3A3A35` on dark bg | ❌ FAIL |
| `--color-gray-900` / `#1A1A15` on dark bg | ❌ FAIL |
| Non-`--fg-primary` / non-black on yellow bg | ⚠️ WARNING — prefer `--fg-primary` or `--color-black`; flag unless intentionally documented |

**Special rule for `--fg-tertiary`:** Scan the entire `homepage.css` file (not just changed lines) and list every rule that uses `--fg-tertiary`. For each one, evaluate whether it is on a light surface (which it almost always is). If so, flag as a violation — even if the line predates this diff.

Report format: `[file]:[line] — "[color]" on "[surface]": FAIL (reason)`

---

## Step 4: Missing token usage — spacing, radii, shadows, fonts

Grep audited files for raw values that have token equivalents:

| Raw value | Should be |
|---|---|
| `border-radius: 4px` | `var(--radius-xs)` |
| `border-radius: 6px` | `var(--radius-sm)` |
| `border-radius: 12px` | `var(--radius-md)` |
| `border-radius: 9999px` | `var(--radius-full)` |
| `font-family: 'Space Grotesk'` | `var(--font-display)` |
| `font-family: 'DM Sans'` | `var(--font-body)` |
| `font-family: 'JetBrains Mono'` | `var(--font-mono)` |
| `box-shadow: 3px 3px 0 0 #0A0A0A` | `var(--shadow-md)` |
| `box-shadow: 5px 5px 0 0 #0A0A0A` | `var(--shadow-lg)` |

Flag each match with: `[file]:[line] — raw value "[value]" should use token "[token]"`

---

## Step 5: New classes that duplicate existing system classes

Read `src/system/class-inventory.md` for the full CSS class reference (homepage, design system, article, animation utility classes).

For every new CSS class found in the diff (diff-scoped) or new file (file-scoped):
- Check if an existing class in `class-inventory.md` already covers the same purpose.
- If a near-duplicate exists → flag as **duplication risk** with the existing class name.
- If the class is a genuine addition (new component, new section) → mark as **OK — new**, then add it to the relevant section of `class-inventory.md`.

---

## Step 5b: Component sync check

For every `.astro` or `.jsx` file under `src/components/system/` that appears in the diff (diff-scoped) or is a new file (file-scoped):

**Check `system.json`** — open `src/system/system.json` and find the matching entry in `components[]` by `id`.
- If the file is **new** and no entry exists → flag as **violation**: add an entry to `components[]` before merging.
- If the file was **modified** and props, variants, or description are stale → flag as **violation**: update the entry.

**Check `src/system/component-inventory.md`** — find the matching component section.
- If the file is **new** and no section exists → flag as **violation**: add a full section (purpose, file path, props table, variants table, usage examples, when to use, when not to use, rules).
- If the file was **modified** and the inventory is stale → flag as **violation**: update the affected section.

**After fixing either violation**, bump `version` (patch), update `lastUpdated`, and update `release.notes` in `system.json` (per CLAUDE.md checklist).

Report format: `[component file] — system.json entry: OK | MISSING | STALE · inventory: OK | MISSING | STALE`

---

## Step 6: Standalone page shells

Check audited `.astro` page files for `<html`, `<head`, or `<body` tags.
- If found → flag as **violation**: must use `Layout.astro`.

---

## Step 7: Build check

Run `npm run build` and capture the output.

- If the build passes → record as ✅ in the report.
- If the build fails → record the error output as an ❌ violation. Do not mark work complete until the build is clean.

---

## Step 8: Report

Output a structured report:

```
## /review-ds audit — [date]
Scope: FILE-SCOPED | DIFF-SCOPED
Files audited: [list]

### ❌ Violations (must fix before merging)
[list — one per line]

### ⚠️ Warnings (review before merging)
[list — one per line]

### ✅ Passed checks
[list of checks with no issues]

### Build
[PASSED / FAILED — include error output if failed]

### Summary
[X violations, Y warnings. Build: passed/failed. Safe to ship / Needs fixes.]
```

If there are zero violations, zero warnings, and the build passes:
1. Output: `✅ All checks passed. Design system compliant. Build clean.`
2. Create/update `.claude/review-ds-clean.txt` with: `Audited: [date] | Commit: [git rev-parse --short HEAD]`
   This marks the codebase as fully audited — future runs may use diff-scoped mode.

---

## Step 9: Sync discrepancies to system.json

After every audit — whether violations were found, fixed, or decisions made — update the `discrepancies` array in `src/system/system.json`.

**Schema for each entry:**
```json
{
  "id": "kebab-case-slug",
  "status": "resolved" | "open" | "decision",
  "title": "Short description of the issue or decision",
  "body": "What was wrong (or decided), and why. Plain text — no HTML.",
  "date": "YYYY-MM-DD",
  "resolvedIn": "abc1234"
}
```
`resolvedIn` is only present for `"resolved"` entries (omit for `open` and `decision`).

**Rules:**
- **Skip** any entry whose `id` already exists in the array — never duplicate.
- **Fixed in this session** → add with `"status": "resolved"`, `"resolvedIn": $(git rev-parse --short HEAD)`.
- **Found but not fixable** (needs design decision or content) → add with `"status": "open"`, no `resolvedIn`.
- **Intentional deviation** logged during audit → add with `"status": "decision"`, no `resolvedIn`.
- After adding entries, patch-bump `"version"` (0.5.2 → 0.5.3), set `"lastUpdated"` to today's date (YYYY-MM-DD), and update `"release"` to match:
  ```json
  "release": {
    "version": "<new version>",
    "lastUpdated": "<YYYY-MM-DD>",
    "notes": "<one-line summary of what changed in this audit>"
  }
  ```
  Keep the top-level `"version"` and `"lastUpdated"` fields in sync with `"release"` — they are the canonical values the DS page reads.

**Do not** run a full rebuild just for this step — the build from Step 7 already covers it.
