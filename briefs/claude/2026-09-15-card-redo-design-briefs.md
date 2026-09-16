# Claude brief — card redo design briefs (4 critical faces)

**Date:** 2026-09-15
**Branch:** `claude/redo-design-briefs`
**Output:** `work/claude/redo-design-briefs/` — one design brief per face, plus `DONE.md`

## Objective

Your 97-face audit flagged 26 faces for redo. Four are critical failures.
Write a concrete design brief for each of the four, so Grok can redo them
against the visual guide without guessing what failed.

The four faces:
1. **Blinding Halo** — garbled text baked into the art.
2. **Stigmata** — shows nothing of its effect.
3. **Bear Hug Break** — drew a literal bear; the card is a grappling break.
4. **Called Shot** — flagged in the audit; restate its failure precisely.

## Each brief must contain

- The card's name, class, energy cost, and rules text (from canon).
- The exact readability failure: what the current face shows vs. what the
  effect requires a viewer to understand in under a second.
- A concrete art direction: the action to depict, the crop (fist, target,
  consequence), the cost read (windup/recovery/frame break for its cost).
- The visual-guide passages that govern it: cite `art/visual-guide/README.md`
  sections (action test, card-readability standard, push/pull lists, palette)
  and name the relevant reference images in `art/visual-guide/reference/`.
- What "passes" looks like: the one-second read test for this specific card.

## Rules

- Do not redesign the card's mechanics. Art direction only.
- Do not invent lore the card doesn't have.
- Flag anything where the rules text itself is unreadable or contradictory —
  do not silently fix it; note it for Robert.

## Standing instructions (all Claude briefs)

- Read `MEETING.md` at the start of the session; add your feedback under
  "Feedback — Claude"; re-check it for replies before you finish.
- Lanes are defaults, not walls: if the project needs work outside your lane
  and you are the one available, do it; note cross-lane work in `DONE.md`.
- When idle, check `TASKS.md` and pick up unassigned work.
