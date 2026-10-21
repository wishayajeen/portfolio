# Experiment 001 — AI-Ready Design System

**Status:** Active  
**Owner:** Jeen (wishayajeen) + Claude  
**Goal:** Measure whether documentation structure affects how reliably AI agents discover and apply existing design system rules on real implementation tasks.  
**Talk context:** XConf Brazil 2026 (Nov 5, 2026) — content freeze target: Oct 26, 2026.

---

## The question

Does the structure of design system documentation affect how reliably an AI agent discovers and applies existing rules when implementing a real task?

---

## Test task

**Hero CTA component change.**

The hero section (`src/components/home/Hero.astro`) currently contains:

```astro
<Button variant="secondary" label="Explore dashboard →" onclick="window.location.href='/design-system/dashboard'" />
```

`Button.astro` renders as `<button>` when no `href` is passed, and as `<a href="...">` when `href` is passed. The `.hero-cta-secondary` class it applies already contains overrides for the global `a {}` cascade.

**Task prompt given to the agent (identical across all conditions and runs):**

> "The hero CTA should link to /design-system/dashboard. Make it work like a proper link so users can right-click, open in a new tab, and it shows up in tab navigation."

**What the task actually tests:**
The task tests whether the agent discovers and uses the existing component API (`Button.astro href` prop) rather than introducing a raw `<a>` element or a different approach. The correct implementation is a single prop change on the existing component. Agents who don't know `Button.astro` exists, or don't read its API, are more likely to reach for a raw element or write new CSS.

**Note on task design:** Because `Button.astro` handles the link rendering and cascade internally, an agent that discovers the component API faces minimal cascade risk — the component already manages it. This makes the primary test about component discovery and system knowledge, not cascade awareness in isolation. If the dry run reveals this makes the task too trivial to distinguish between conditions, the task prompt or baseline state will be revisited before freezing the protocol.

**Pass / fail criteria:**

| Criterion | Pass | Fail |
|---|---|---|
| Functional correctness | Link navigates to `/design-system/dashboard` with native link semantics | `onclick` approach retained; no real link behavior |
| Implementation approach | Uses `Button.astro` with `href` prop | Introduces raw `<a>` element or new CSS |
| Cleanup | Removes orphaned `onclick` prop | Leaves `onclick` alongside `href` |
| Visual correctness | No regressions in button appearance | Cascade styles bleed or layout breaks |
| Reasoning shown | Agent explains component API discovery | Agent acts without referencing existing components |

---

## Conditions

### Condition A — Existing repo (current guardrails baseline)

The agent works in the repository as it currently exists. `CLAUDE.md` is present and unmodified — it documents architectural constraints and element-type rules. The agent has normal repository access.

**Condition A is a guardrails baseline** — it measures how accurately the agent implements the task using the repository as it currently stands, without any additional documentation structure. It is not a zero-context baseline.

**Context given:** Normal repository session. No extra files, no additional instructions beyond the task prompt.

---

### Condition B — Consolidated document

The agent has the same repository access as Condition A, including `CLAUDE.md`. Additionally, it receives a single consolidated document covering the full design system knowledge: token usage, component contracts, architectural rules, and failure modes. The agent is instructed to consult this document.

The consolidated document contains knowledge equivalent to Condition C's modular architecture. The variable is organization, not content.

**Context given:** Normal repository session + consolidated design system document. Agent instructed to consult the provided document.

**What this tests:** Does a single organized document improve accuracy compared to navigating a distributed repository?

---

### Condition C — Modular architecture (DESIGN.md routing)

The agent has the same repository access as Condition A, including `CLAUDE.md`. Additionally, it is instructed to read `DESIGN.md` first, which routes to the knowledge architecture in `src/system/design-system/` (foundations, component CRDs, governance).

The underlying design knowledge available is equivalent to Condition B. The variable is whether a modular, navigable structure improves how the agent discovers and applies relevant rules.

**Context given:** Normal repository session. Agent instructed to read `DESIGN.md` first before starting the task.

**What this tests:** Does a routed, modular documentation structure produce different outcomes than a consolidated document or the existing repository baseline?

---

## Controls

To isolate the variable (context structure), hold everything else constant:

| Control | Value |
|---|---|
| Task prompt | Identical across all conditions and runs |
| Agent | Claude (same model, same session type) |
| Codebase | Same repo state (pinned commit) |
| Runs per condition | 3 |
| Evaluator | Jeen (human review of output against pass/fail criteria) |
| Environment | Isolated worktree per run (no cross-contamination) |

---

## Execution plan

### Before runs
- [ ] Pin a commit hash as the base state for all runs (freeze before any further documentation migrations)
- [ ] Write the Condition B consolidated document (full system knowledge, equivalent to Condition C)
- [ ] Conduct dry run to validate task prompt and evaluation process
- [ ] Freeze the protocol after the dry run — no changes during live runs
- [ ] Verify Hero.astro is still in baseline state

### Run protocol (per condition, per run)
1. Create an isolated worktree from the pinned commit
2. Open a fresh Claude session with no prior context
3. Deliver the task prompt (identical each time), plus any condition-specific context
4. Record: agent output, element type chosen, cascade handling, reasoning shown
5. Evaluate against pass/fail criteria
6. Discard worktree

### After runs
- Document results in `experiment-001-results.md` (to be created)
- Identify which condition produced the most accurate, most consistent outputs
- Write findings for XConf talk

---

## Hypothesis

Documentation structure may improve how reliably agents discover and apply existing system rules. Each condition adds a different type of structure above the existing baseline, so observable differences in implementation correctness (functional, semantic, visual, cleanup) are attributable to structure rather than content.

**Open questions the experiment may help answer:**
- Does Condition A (existing repo + CLAUDE.md) already produce reliable outcomes, making additional structure unnecessary?
- Does consolidation (B) help or create noise for an agent that can read files directly?
- Does modular navigation (C) produce different outcomes from consolidation when underlying knowledge is equivalent?
- Does the task design (trivially solvable by reading Button.astro) create a ceiling effect across all conditions?

The experiment is exploratory at 3 runs per condition. Results will be reported honestly, including null results and ceiling effects.

---

## Results

_(To be filled after runs — target Oct 26, 2026)_

| Run | Condition | Element type | Cascade handled | Visual regression | Pass/fail |
|---|---|---|---|---|---|
| 1 | A | — | — | — | — |
| 2 | A | — | — | — | — |
| 3 | A | — | — | — | — |
| 4 | B | — | — | — | — |
| 5 | B | — | — | — | — |
| 6 | B | — | — | — | — |
| 7 | C | — | — | — | — |
| 8 | C | — | — | — | — |
| 9 | C | — | — | — | — |
