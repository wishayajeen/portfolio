# AI Collaboration Failure Modes

AI agents move fast. That speed comes with a cost: architectural awareness degrades across long sessions, local optimizations override system-level constraints, and wrong assumptions get compensated rather than corrected. This document captures recurring failure patterns discovered while building this portfolio and design system — so future work (human or AI) can detect them earlier and recover faster.

This is not a bug log. It is a taxonomy.

---

## Failure Mode: Architectural Blindness

### Description
The AI completes a task correctly in isolation but violates an established architectural constraint it wasn't actively tracking. The change is locally correct, systemically wrong.

### Example
Updating the hero CTA and nav button text/destinations. The request was clear: change text, change destination. The AI swapped `<button>` to `<a>` — technically valid HTML for a link — without recognizing that this project has a global `a {}` rule in `tokens.css` that applies underline box-shadows, overrides color, and hijacks hover state. The button looked and behaved correctly as a `<button>`. After the swap, three separate visual regressions appeared.

### Why it happens
- The AI had the task in focus but not the full style inheritance graph
- `tokens.css` global `a {}` rule was not surfaced as a constraint at decision time
- The architectural rule (preserve element type unless explicitly required to change it) was not yet written down

### Detection Signals
- A "simple" change requires multiple follow-up CSS fixes
- Visual regressions appear in elements the task didn't directly modify
- The fix touches more files than the original change

### Prevention
- Write architectural invariants explicitly in `CLAUDE.md` before they are needed
- Global CSS rules (`a {}`, `button {}`, `*`) should be documented as constraints, not just as styles
- Any task touching element type should trigger a style-inheritance audit

### Recovery
Revert the structural change entirely. Return to the original element type. Apply the behavior change (new text, new handler) without touching the element. Do not patch symptoms.

---

## Failure Mode: Cascading Compensation

### Description
After introducing a wrong root change, the AI applies a series of targeted fixes to each visible symptom. Each fix is locally reasonable. Together they accumulate technical debt, increase surface area for future regressions, and obscure the original mistake.

### Example
After the `<button>` → `<a>` swap: first fix was `text-decoration: none; display: inline-block`. Second fix was `color: var(--fg-accent)` on `:hover` to prevent yellow. Third fix was `line-height: 1` to reduce inherited body line-height. Fourth fix was `line-height: 1.32` after `1` over-corrected height. Four patches for one wrong assumption.

### Why it happens
- Each symptom is visible and fixable in isolation
- The AI treats symptoms as the problem rather than as signals
- No explicit rule to stop and reassess when multiple fixes appear
- Sunk-cost pressure: the original change is already in place, reverting feels like regression

### Detection Signals
- More than one CSS fix after a single structural change
- Fixes that reference and override global rules
- A comment like `/* override global a:hover yellow */` in product CSS

### Prevention
- Hard rule: if two or more CSS overrides are needed after a single change, stop and reassess the original assumption
- Treat compensation patches as a diagnostic signal, not a solution
- Document in `CLAUDE.md`: "If multiple CSS fixes become necessary after a small change: STOP and reassess the original assumption"

### Recovery
Remove all compensation patches. Revert to the last known-good state. Reapply only the original behavior change (text, handler, destination) without changing structure.

---

## Failure Mode: Semantic Element Drift

### Description
HTML elements carry semantic meaning and inherit browser-default behavior. Changing element type to accomplish a functional task (navigation, linking) without auditing semantic and style consequences.

### Example
`<button onClick={() => scrollTo('footer')}>` becoming `<a href="/design-system">`. Functionally equivalent from a user perspective. Semantically and stylistically different: different keyboard behavior, different browser defaults, different CSS inheritance, different right-click behavior.

### Why it happens
- `<a>` is the "correct" HTML for navigation to a URL, so the swap feels semantically justified
- The distinction between "element that navigates" and "element that is a link" is subtle
- Style side-effects of `<a>` vs `<button>` are only visible after deployment

### Detection Signals
- Element type changes in a diff where the task description only mentioned text or destination changes
- New `text-decoration`, `display`, `line-height`, or `color` overrides appearing alongside the element swap

### Prevention
- Rule: element type changes require explicit instruction
- When destination changes from scroll to URL, update the handler — not the element
- Reserve `<a>` for elements that genuinely need link semantics (right-click → open in new tab, keyboard navigation as a link, SEO-visible href)

### Recovery
Swap back to the original element type. The behavior change (new destination) survives — only the structure reverts.

---

## Failure Mode: Source-of-Truth Drift

### Description
The same information exists in multiple places. They fall out of sync. One source gets updated, others don't. Future reads pull from the stale source.

### Example
`CLAUDE.md` contained the full CSS class inventory inline. When `/review-ds` needed to check for duplicate classes, it read from `CLAUDE.md`. But `CLAUDE.md` was edited for rules/workflow — not for class tracking. The inventory drifted. Created `class-inventory.md` as a dedicated file to decouple the concerns.

### Why it happens
- Convenient to put related information in one file
- Updates to one source don't trigger updates to mirrors
- No single owner for cross-cutting facts
- AI sessions don't have memory across runs — each session reads whatever files it finds

### Detection Signals
- The same fact appears in two or more files
- A `/review-ds` audit finds a discrepancy between what `system.json` says and what's on disk
- Step 1b of `/review-ds` (structural drift check) flags a mismatch

### Prevention
- One fact, one file. Cross-reference with pointers, not copies
- `CLAUDE.md` = rules and workflow only; `system.json` = machine-readable state; `class-inventory.md` = CSS class index; `tokens.css` = token values
- Step 1b in `/review-ds` runs on every audit to detect structural drift early

### Recovery
Identify the authoritative source for each fact. Update the authoritative source. Remove or redirect the stale copy. Add a pointer if needed.

---

## Failure Mode: Local Optimization Failure

### Description
The AI solves the immediate task correctly but in doing so degrades system-level properties: consistency, token compliance, style inheritance, component contracts.

### Example
Adding inline `style="..."` attributes to elements for quick layout adjustments. Each one is faster than creating a class. Together they create a pattern of bypassing the token system, making the design system unauditable, and introducing hardcoded values that drift from tokens over time.

### Why it happens
- Inline styles are fast and require no class invention
- The task frame is narrow: "make this element look right"
- System-level concerns (token compliance, auditability, reuse) are not part of the immediate reward signal

### Detection Signals
- `style="..."` attributes appearing in `.astro` or `.jsx` component files outside of documented exceptions
- `/review-ds` Step 2 flagging hardcoded hex values
- New CSS that duplicates an existing class without referencing it

### Prevention
- Inline styles are only acceptable for dynamic values (computed at runtime) or documented one-offs with a comment explaining why
- Check `class-inventory.md` before adding any new class
- `/review-ds` Step 2 and 5 catch token and duplication violations

### Recovery
Extract inline styles to the appropriate CSS file using semantic tokens. Add the new class to `class-inventory.md`. If a token is missing, add it to `tokens.css` first.

---

## Failure Mode: Context Collapse

### Description
During long sessions or across session boundaries, the AI loses awareness of earlier architectural decisions, existing components, or established patterns. It re-solves problems that were already solved, invents patterns that already exist, or makes changes inconsistent with earlier work in the same session.

### Example
Near the end of a long session, adding a new component with styles that duplicate an existing class from `homepage.css` — because the class inventory wasn't actively in context when the new code was written.

### Why it happens
- Context windows have limits; early decisions fall out of the active window
- Each session starts cold with no memory of prior sessions
- Codebases are larger than any single context read
- The AI optimizes for the task at hand without scanning for prior art

### Detection Signals
- A new class that does the same thing as an existing class
- A component that reimplements behavior already in the system
- Inconsistent token usage in one file vs another for the same visual purpose

### Prevention
- `/review-ds` Step 5 explicitly checks for class duplication against `class-inventory.md`
- `CLAUDE.md` keeps invariants in a short, always-read file
- `system.json` is the machine-readable registry — check it before adding components
- Keep `CLAUDE.md` concise so it fits in context on every session start

### Recovery
Identify the existing solution. Replace the new implementation with the existing one. If the existing one needed extension, add a modifier variant — not a parallel class.

---

## Failure Mode: Speculative Inventory

### Description
The AI creates files, routes, components, or registry entries that don't exist yet, or assumes they do. System state is written to reflect a future that hasn't been built.

### Example
`system.json` entries for diary slugs that had no matching `.md` file. The dashboard read from `entries[]` and displayed entries that didn't exist on disk, causing the content count to be wrong.

### Why it happens
- When building a feature, it's natural to scaffold the data model ahead of the implementation
- AI generates registry entries optimistically during a session, then the session ends before the file is created
- No automated check between registry state and disk state

### Detection Signals
- `/review-ds` Step 1b flags slug in `entries[]` with no `.md` file
- A route in `system.json routes[]` whose file doesn't exist on disk
- Dashboard showing a count that doesn't match the actual number of files

### Prevention
- Step 1b in `/review-ds` runs on every audit — routes, components, diary entries all verified against disk
- Entries in `system.json` are only added after the corresponding file exists
- `/diary` skill appends to `entries[]` as part of the publish flow, not ahead of it

### Recovery
Audit `system.json` against disk. Remove or correct stale entries. If the file was supposed to exist, create it. Run `/review-ds` Step 1b to confirm sync.

---

## Failure Mode: Audit Staleness

### Description
An audit or checklist is run, produces a clean result, and is then immediately invalidated by the next change. The clean record creates false confidence.

### Example
`review-ds-clean.txt` is written after a clean audit. The next commit changes `dashboard.astro` and `design-system.css` — both audited files. The clean record is now stale but still present, suggesting the codebase is clean when it isn't.

### Why it happens
- Audits are point-in-time snapshots
- The clean record persists across commits that weren't audited
- Diff-scoped audits only audit changed files — they miss files that were clean but are now affected indirectly

### Detection Signals
- `review-ds-clean.txt` commit SHA is behind `HEAD`
- A file was changed after the last audit without triggering a re-audit
- A visual regression exists in production that `/review-ds` didn't catch

### Prevention
- Diff-scoped audit on every meaningful commit — not just occasionally
- Step 1b (structural drift check) runs on every audit regardless of scope
- The clean record stores the commit SHA so staleness is detectable

### Recovery
Run `/review-ds` against the changed files. If violations are found, fix them before merging. Update `review-ds-clean.txt` only after a passing audit.

---

## Emerging Patterns

Observations from building this project that don't yet have a full taxonomy entry:

- **AI accelerates drift if structure is weak.** The faster an AI moves, the faster inconsistencies accumulate. Strong structure (tokens, inventories, registries) is what keeps speed from becoming liability.
- **Audits must feed back into the system.** An audit that produces a report and nothing else is noise. Audit findings go into `system.json discrepancies[]` so they are visible, tracked, and affect the dashboard.
- **Constraints matter more than prompts.** Telling an AI "use tokens" in a prompt is weaker than having `/review-ds` enforce it after every change. Architectural constraints outlast any single instruction.
- **Systems need invariants.** Rules that are always true — regardless of task, session, or context — are the foundation. `CLAUDE.md` architectural invariants section exists for this reason.
- **AI is better at generation than consistency maintenance.** First-pass output is often good. The problem is the second, third, and fourth pass — where consistency with prior decisions degrades. Automated audits compensate for this.

---

## Project Rules Evolved From These Failures

Concrete rules added to `CLAUDE.md` or workflow because of specific incidents:

- **Never change an HTML element's tag unless explicitly instructed.** Behavior changes (text, handler, destination) do not require structural changes.
- **Never invent tokens or colors.** Every value traces back to `tokens.css`. No new CSS variables outside that file.
- **Preserve semantic structure.** Element semantics carry browser behavior, accessibility contracts, and style inheritance. Changing them without intent breaks things invisibly.
- **Prefer behavior changes over structural rewrites.** When a task can be accomplished by updating a handler, a value, or a class — do that. Reserve structural changes for when they are the only option.
- **If multiple CSS fixes appear after a small change, stop and reassess the root assumption.** Compensation is a diagnostic signal, not a solution.
- **Source-of-truth ownership must be explicit.** One fact, one file. `CLAUDE.md` = rules. `system.json` = state. `tokens.css` = values. `class-inventory.md` = CSS index. Overlap causes drift.
- **Structural integrity is checked on every audit.** `/review-ds` Step 1b verifies routes, components, and diary entries against disk on every run — not just when drift is suspected.
