# Experiment 001 — AI-Ready Design System

**Status:** Active  
**Owner:** Jeen (wishayajeen) + Claude  
**Goal:** Measure whether structured design system context improves AI agent accuracy on real implementation tasks.  
**Talk context:** XConf Brazil 2026 (Nov 5, 2026) — content freeze target: Oct 26, 2026.

---

## The question

Does the way design system knowledge is structured and delivered to an AI agent affect how accurately it implements tasks?

---

## Test task

**Hero CTA button behavior change.**

The hero section (`src/components/home/Hero.astro`) contains:

```astro
<button onclick="window.location.href='/design-system/dashboard'">Explore dashboard →</button>
```

**Task prompt given to the agent:**

> "The hero CTA should link to /design-system/dashboard. Make it work like a proper link so users can right-click, open in a new tab, and it shows up in tab navigation."

This is a trap task. The request implies swapping `<button>` to `<a>`. The correct answer depends on whether the agent knows:
1. The global `a {}` rule in `tokens.css` applies box-shadow underlines and yellow hover color to all `<a>` elements
2. The project's architectural invariant: preserve element type unless explicitly required to change it
3. The failure mode documented in `failure-modes.md`

**Correct answer:** The button should become an `<a>` element, but the agent must handle ALL style side-effects upfront — specifically resetting `box-shadow`, `color`, `text-decoration`, and any line-height differences from the global `a {}` rule. The agent that simply swaps the element type without addressing the cascade fails.

**Pass / fail criteria:**

| Criterion | Pass | Fail |
|---|---|---|
| Element type | `<a>` (link semantics explicitly requested) | Stays as `<button>` with `onclick` |
| Cascade awareness | Resets or anticipates global `a {}` side-effects | Doesn't acknowledge cascade risk |
| Visual correctness | No regressions in button appearance | Global `a {}` styles bleed through |
| Reasoning shown | Agent explains why it's handling the cascade | Agent swaps element silently |

---

## Conditions

### Condition A — Existing repo (current guardrails baseline)

The agent works in the repository as it currently exists, including `CLAUDE.md` (which documents the element-type rule and links the `tokens.css` global `a {}` rule explicitly).

> **Framing note (pending):** Condition A is not zero-context. `CLAUDE.md` already documents the exact rule that makes this task a trap. This makes A a "guardrails baseline" — testing whether the agent actually reads and applies documented rules, not whether it can reason from scratch.
>
> **Decision needed:** Should we remove or redact the element-type section from `CLAUDE.md` for Condition A runs to create a truer zero-context baseline? Or document A as "existing guardrails" and accept that limitation in the write-up?
>
> _(User to confirm before runs begin)_

**Context given:** Normal `claude` session in this repo. No extra files or instructions.

---

### Condition B — Consolidated document

The agent receives a single flat document containing all design system knowledge relevant to this task (tokens summary, component contracts, element-type rules, `a {}` cascade warning, failure modes).

**Context given:** The document is passed as a system prompt or prepended as a context file. The agent does not navigate the repo.

**What this tests:** Does having everything in one place — rather than distributed across files — improve accuracy? Or does a single large document create noise?

---

### Condition C — DESIGN.md routing (modular entry point)

The agent starts from [`DESIGN.md`](../../DESIGN.md) and navigates to the relevant authoritative files itself (tokens, component inventory, failure modes) before attempting the task.

**Context given:** The agent is told to read `DESIGN.md` first. It must route itself to the correct files.

**What this tests:** Does a structured entry point that routes to authoritative sources outperform both the flat doc and the existing-guardrails baseline?

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
- [ ] Pin a commit hash as the base state for all runs
- [ ] Confirm Condition A framing (see note above)
- [ ] Write the Condition B consolidated document
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

Condition C (DESIGN.md routing) will outperform B (consolidated) and A (existing repo) because:
- It forces the agent to read authoritative files rather than relying on memory or a long flat document
- Routing to specific files surfaces relevant constraints at decision time
- It mirrors how human designers actually use a design system — navigate to what you need

B may outperform A because a consolidated document reduces the chance the agent misses a rule distributed across files. A may already perform well if the agent reads `CLAUDE.md` carefully — this is one reason the Condition A framing matters.

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
