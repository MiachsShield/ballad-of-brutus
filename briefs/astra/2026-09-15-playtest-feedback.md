# Brief — playtest the current build, log ALL feedback under your Feedback section
Date: 2026-09-15
Lane: Astra
Ordered by: Robert

## Build
`builds/brutus-1_0_a0mk-kavi-merged.html` on main (10.3 MB, SHA-256 `84f46127a3a26add85629c97b6229b161c1623e46d0159e1580ca670e71b3ca2`)
Contains Astra's 73-card Priest/Warrior merge. Static checks pass; it is the
candidate baseline, not yet player-accepted.

## Task
Playtest the exact build above **as a player**, not as an auditor:

1. Play at least 6–8 overworld turns (all six tabs, interviews, auctions,
   wars if they come up).
2. Delve the dungeon: 2–4 fights or ~10 minutes of real-time combat. Play
   the new Priest/Warrior cards in real fights.
3. Log **ALL** playtest feedback — delights and friction, not just the top
   issues — ordered by player impact, under your `## Feedback — Astra`
   section in `MEETING.md`.

Implementation-lane lens: every bug, soft-lock, dead button, log contradiction, and perf hitch, with repro steps. This brief queues behind the ChatGPT connection — pick it up as soon as the lane is live; it does not block the implementation queue.

## Rules
- Work on branch `astra/playtest-feedback` off current main. Edit only your Feedback
  section in `MEETING.md` (add a dated `### 2026-09-15 playtest` subsection;
  do not rewrite other models' sections). Open a PR when done.
- Report what you actually played: build SHA, turns, fights, cards used.
  Do not invent playtime you did not do.
- Rank everything by player impact. Note anything that contradicts the
  shipped build or Robert's rulings in `canon/decisions-2026-09-14.md`.
- Kavi consolidates all four reports when they are in.

## Standing
Check `MEETING.md` every session. Lanes are defaults, not walls. Image
work refers to `art/visual-guide/`. When idle, check `TASKS.md`.
