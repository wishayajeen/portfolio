# /review-ds — Design System Audit

Audit changed files in this project against the Jeen Design System rules defined in `CLAUDE.md`.

## Step 1: Identify files to audit

Run `git diff --name-only HEAD` to get all modified files.
If nothing is staged/changed, run `git diff --name-only HEAD~1` to audit the last commit.
Filter to only `.astro`, `.css`, `.ts`, `.tsx`, `.js` files.

List the files being audited before starting.

## Step 2: Hardcoded hex values

Grep each changed file for hex color patterns: `#[0-9A-Fa-f]{3,6}`.

For every match:
- Check if an equivalent token exists in `src/styles/tokens.css`.
- If a token exists → flag as **violation**.
- If no token exists (e.g. a one-off rgba overlay) → flag as **warning**, ask if it should be added to tokens.

Exempt: hex values inside `design-system.astro` that are used purely for documentation display (swatch colors, demo values). Flag everything else.

## Step 3: Unsafe text/background pairings

Look for any element that sets both a text color (`color:`) and a background (`background:`) in the same rule or inline style, or where the context implies a surface.

Cross-check against the unsafe combos from `CLAUDE.md`:

| Pairing | Verdict |
|---|---|
| `--fg-tertiary` / `#9A9A90` on light bg | ❌ FAIL — use `--fg-secondary` |
| `--color-gray-500` / `#6A6A60` on dark bg | ❌ FAIL |
| `--color-gray-700` / `#3A3A35` on dark bg | ❌ FAIL |
| `--color-gray-900` / `#1A1A15` on dark bg | ❌ FAIL |
| Any non-black on yellow bg | ❌ FAIL |

Report format: `[file]:[line] — "[color]" on "[surface]": FAIL (reason)`

## Step 4: Missing token usage — spacing, radii, shadows, fonts

Grep for raw values that have token equivalents:

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

## Step 5: New classes that duplicate existing system classes

Read the component/class inventory in `CLAUDE.md`.

For every new CSS class found in the diff:
- Check if an existing class in `homepage.css` or `design-system.astro` already covers the same purpose.
- If a near-duplicate exists → flag as **duplication risk** with the existing class name.
- If the class is a genuine addition (new component, new section) → mark as **OK — new**.

## Step 6: Standalone page shells

Check if any changed `.astro` page file contains `<html`, `<head`, or `<body` tags.
- If found and the file is NOT `design-system.astro` → flag as **violation**: must use `Layout.astro`.

## Step 7: Report

Output a structured report:

```
## /review-ds audit — [date]
Files audited: [list]

### ❌ Violations (must fix before merging)
[list — one per line]

### ⚠️ Warnings (review before merging)
[list — one per line]

### ✅ Passed checks
[list of checks with no issues]

### Summary
[X violations, Y warnings. Safe to ship / Needs fixes.]
```

If there are zero violations and zero warnings, output:
`✅ All checks passed. Design system compliant.`
