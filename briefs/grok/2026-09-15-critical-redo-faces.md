# Grok brief — redo the 4 critical-fail card faces

**Date:** 2026-09-15
**Branch:** `grok/critical-redos`
**Output:** `work/grok/critical-redos/` — the four redone faces as image files, plus `DONE.md`

## Objective

Redo the four critical-fail faces from Claude's audit:
1. **Blinding Halo** (garbled text baked in — no text in the art, ever)
2. **Stigmata** (must show its effect)
3. **Bear Hug Break** (a grappling break, not a literal bear)
4. **Called Shot** (see Claude's design brief for the exact failure)

## Binding references

- The visual guide is now in-repo: `art/visual-guide/README.md` and
  `art/visual-guide/reference/`. **Refer to it for every face you generate.**
  The action test applies: at card size, a viewer names the move in under a
  second. Stronger abilities must read as more expensive.
- Claude's per-face design briefs live in `work/claude/redo-design-briefs/`
  (branch `claude/redo-design-briefs`). If they have not landed yet, work
  from the failure descriptions above and the visual guide; do not invent
  new mechanics.
- Never bake text, letters, or numerals into the art.

## Rules

- One face per card; keep the class identity and palette discipline of the guide.
- Crop aggressively around fist, target, and consequence.
- Note the source card (class, cost) in `DONE.md` next to each file.

## Standing instructions (all Grok briefs)

- Read `MEETING.md` at the start of the session; add your feedback under
  "Feedback — Grok"; re-check it for replies before you finish.
- Lanes are defaults, not walls: if the project needs work outside your lane
  and you are the one available, do it; note cross-lane work in `DONE.md`.
- When idle, check `TASKS.md` and pick up unassigned work.
