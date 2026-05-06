---
title: "Dogfooding My Design System: When the System Starts Keeping Itself Honest"
description: "I didn't plan it, but my portfolio became a test lab for my own design system — and that changed how I think about documentation, automation, and honesty."
date: 2026-05-06
tag: "Workflow"
readTime: "6 min"
---

Alright, I didn't plan this… but my portfolio accidentally turned into a test lab for my own design system 😅

I've been trying to build what I call an "agentic" design system — not just components, but something that can **describe itself, track its own issues, and eventually be queried**.

And somewhere along the way, I realized:

> I'm not just building a system… I'm *dogfooding* it.

---

## It started simple (and a bit naive)

At first, it was just:
- tokens
- components
- a design system page

Pretty standard stuff.

Then I added something called `system.json`.

It's just a structured file that describes the system itself:
- what components exist
- what tokens exist
- what pages exist
- what issues exist

Kind of like:

> a system keeping notes about itself… in a way machines can read

And that changed everything.

Instead of:
> "I know what's in my system"

It became:
> "My system should know what's in my system"

---

## Then things got messy (very familiar messy)

If you've worked on a design system, you'll probably recognize this:

- the docs say one thing, UI does another
- components exist but aren't documented
- tokens drift from actual usage
- the same thing shows up in multiple places

In my case, I even had:
- Buttons documented under *Foundations*
- Links explained twice
- Inputs floating around with no clear home

Classic design system drift.

👉 The kind that usually lives across Figma files, Notion docs, and people's heads… and never stays in sync.

---

## So I tried something different

Instead of just fixing issues and moving on…

I started logging them.

![Design system discrepancy tracking showing decision, resolved, and open issues rendered on the site](../../assets/diary/discrepancies-list.png)

Inside `system.json`.

Each issue has structure:
- status: open / resolved / decision
- area: tokens / component / a11y / architecture
- severity: critical / moderate / low

Then I wired my design system page to read from it.

So now:
- if something is broken → it shows up on the site
- if something is fixed → it shows up on the site
- if I make a decision → it shows up on the site

No more:

> "I think I fixed this last week?"

The system literally tells me what's going on.

---

## And then I added a review loop

I created a small command called `/review-ds`.

It's basically a **design system linter for my codebase** — it checks:

- hardcoded colors instead of tokens
- unsafe color usage
- duplicated components
- missing system usage

And here's the key part:

> The result of that review feeds back into `system.json`

So the loop becomes:
```markdown
build → review → log → render → repeat
```

Which means:
- the system gets stricter over time
- I stop relying on memory
- everything becomes visible

---

## The mindset shift

At some point, something clicked.

I stopped thinking:

> "I need to keep this clean"

And started thinking:

> "The system should keep itself honest"

That's a very different mindset.

---

## Even the structure wasn't safe

I split my design system into:
- Foundations (tokens, principles)
- Components (actual UI)

Sounds obvious.

But I still ended up with components leaking into Foundations.

So I had to enforce a rule:

> Foundations = rules
> Components = implementation

And clean everything again.

That was a good reminder:

Even the structure of a system needs… a system.

---

## The part that made it "click"

Right now I have a layer (`system.json`) that sits between:

- the code (components, CSS, pages)
- and the UI (design system site)

```markdown
Code → system.json → UI
```

That means:
- the UI doesn't guess
- the system doesn't rely on memory
- everything is explicit

And more importantly:

> it becomes something both humans **and machines** can understand

---

## What this changed for me

A few things became very obvious:

### 1. Documentation always drifts

Unless it's connected to real data.

### 2. Design systems shouldn't live in people's heads

They should **store and expose their own state**.

### 3. Automation isn't about speed

It's about **honesty**.

---

## Where this is going

Right now I have:
- a system that tracks its own discrepancies
- a structure that separates rules from implementation
- a JSON layer that describes everything

Next step:
- a dashboard to see system health
- "Ask Pocky" to query the system directly

---

## Final thought

This started as a portfolio.

Now it feels more like:

> a system that's slowly learning how to explain itself

…and I'm just trying to keep up 😄

---

## If you're building a design system

Try this:

Next time you fix something, don't just fix it.

👉 **Log it.**

Even if it's just:
- what broke
- why
- and what you decided

That alone changes how your system evolves.
