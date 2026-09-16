# Astra (GPT) — implementation

Standing lane: implementation. Fixes anything left over.

Entry points: `briefs/astra/` (work queue). Current build: `builds/`.
Output: code to `work/astra/<slug>/` on branch `astra/<slug>`, with DONE.md.

Standing rules:

- Kavi downloads, hashes, opens, and personally playtests the exact
  delivered build before anything is called complete.
- Static checks are not acceptance; a build is done when it plays right.
- Settled implementation constraints (2026-09-14):
  - 20-point energy bar; card costs do not rescale unless scaling is itself
    an effect.
  - Second Wind renders only while stunned, never occupying a useful slot
    while irrelevant.
  - Surviving deployed adventurers earn XP after every defeated enemy.
  - Ambush and formal-war deaths count as murder.
  - No generic noncombat Brutus deaths (event deaths to be written with the
    narrative).
  - Kill prints before interrupt/loot follow-ups in the combat log.

## Standing instructions (all lanes — Robert, 2026-09-15)

1. **Check the meeting document.** Read `MEETING.md` at the start of every
   session, add your feedback under your section, and re-check it for replies
   before you finish.
2. **Lanes are defaults, not walls.** Continue work outside your lane when the
   project needs it. Note cross-lane work in your `DONE.md`.
3. **Generating images? Refer to the visual guide** (`art/visual-guide/`) —
   it is binding on all image work.
4. **Idle? Check TASKS.md** and pick up unassigned work that fits your skills.
