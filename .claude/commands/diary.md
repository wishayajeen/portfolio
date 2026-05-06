# /diary — Publish a New Diary Entry

Publish a new diary entry to the site using the existing content collection, frontmatter schema, and post-work steps (system.json sync, build, commit).

---

## Overview

A diary entry is a Markdown file in `src/content/diary/` that the site picks up automatically through Astro's content collection. The homepage (`PlaygroundSection.astro`) and the article page (`[slug].astro`) both read from this collection dynamically — no manual page or list update is needed.

The only two things that need explicit post-work are:
1. **`system.json`** — `stats.diaryEntryCount` must be kept in sync; bump version and update release notes.
2. **Build verification** — confirm the new entry compiles cleanly before committing.

---

## Step 1: Parse the input

The user will provide the diary content inline in the chat (raw text, Markdown, or a mix). Extract:

- **Title** — the H1 or first heading in the content, or the user's explicit title.
- **Description** — a single sentence summarising the entry (derive from the intro if not stated). Max ~160 characters.
- **Tag** — classify the entry as one of: `Tutorial`, `Design System`, `Process`, `Reflection`, `Case Study`. Pick the closest fit from the content tone.
- **Read time** — estimate based on word count: 200 words/min. Round to nearest minute. Format: `"N min"`.
- **Date** — always today's date in `YYYY-MM-DD` format (read from `$currentDate` or run `date +%F`).
- **Slug** — lowercase, hyphenated, derived from the title. Strip punctuation, collapse spaces to hyphens. Example: `"Dogfooding My Design System"` → `dogfooding-my-design-system`.

---

## Step 2: Check for slug collision

Before writing anything, check whether a file already exists at `src/content/diary/<slug>.md`.

- If it exists → stop and tell the user: "A diary entry with slug `<slug>` already exists. Adjust the title or confirm you want to overwrite."
- If it does not exist → proceed.

---

## Step 3: Write the Markdown file

Create `src/content/diary/<slug>.md` using **exactly** this frontmatter schema — no extra fields, no missing fields:

```markdown
---
title: "<title>"
description: "<description>"
date: YYYY-MM-DD
tag: "<tag>"
readTime: "<N min>"
---

<body content>
```

**Rules for the body:**
- Preserve the user's original wording, structure, and voice exactly. Do not rewrite, paraphrase, or "improve" the content.
- Keep all Markdown formatting: headings (`##`, `###`), bullet lists, blockquotes (`>`), inline code, fenced code blocks.
- Do not add a title heading inside the body — the title comes from frontmatter and is rendered by `[slug].astro`.
- Do not add a separator between frontmatter and the first paragraph — just one blank line.

---

## Step 4: Update `system.json`

Open `src/system/system.json` and make these changes:

1. **`stats.diaryEntryCount`** — increment by 1.
2. **`version`** — patch bump (e.g. `0.6.4` → `0.6.5`).
3. **`lastUpdated`** — set to today's date `YYYY-MM-DD`.
4. **`release.version`** — match the new version.
5. **`release.lastUpdated`** — match today's date.
6. **`release.notes`** — one-line summary, e.g.: `"Added diary entry: '<title>'. Bumped diaryEntryCount to N."`

Keep the top-level `version` and `lastUpdated` in sync with `release` — they are the canonical values the DS page reads.

Also update `content.collections[0]` if it has a `lastSynced` field — set it to today's date.

---

## Step 5: Build check

Run:
```bash
npm run build
```

- If it passes → proceed to commit.
- If it fails → show the error output. Do not commit. Fix the issue (usually a frontmatter type mismatch) and re-run.

The new entry's route should appear in the build output:
```
├─ /diary/<slug>/index.html
```
Confirm it is present. If it is missing even though the build passed, check for a frontmatter parse error.

---

## Step 6: Commit

Stage only the new diary file and `system.json`:
```bash
git add src/content/diary/<slug>.md src/system/system.json
```

Commit message format:
```
content: add diary entry — <title>

<one-line description of what the entry is about>
Bumps diaryEntryCount to <N> in system.json (v<version>).
```

---

## Step 7: Report

Output a short summary:

```
## Diary entry published
- **File**: src/content/diary/<slug>.md
- **Route**: /diary/<slug>/
- **Tag**: <tag>
- **Read time**: <N min>
- **system.json**: diaryEntryCount → N, version → X.Y.Z
- **Build**: PASSED — 7 pages built (or however many)
- **Commit**: <short SHA>

Entry is committed. Run `/deploy` or `vercel --prod` when ready to ship.
```

Do not automatically push or deploy — leave that to the user.
