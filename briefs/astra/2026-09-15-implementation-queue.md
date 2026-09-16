# Astra brief — implementation queue (12 rulings + fix list)

**Date:** 2026-09-15
**Branch:** `astra/implementation-queue`
**Output:** `work/astra/implementation-queue/` — a rebuilt, playable HTML build
plus a change log and `DONE.md`

**Status: QUEUED — blocked until Astra's ChatGPT lane is connected.**
This brief is the standing work order for the moment the lane opens. Do not
start it in a degraded environment; the acceptance bar requires a full
rebuild and verification.

## Objective

Produce the next playable build of the Ballad of Brutus, starting from the
current merged build, with everything below implemented and verified.

## 1. Robert's 12 rulings (binding — `canon/decisions-2026-09-14.md`)

Implement all twelve. No new mechanics beyond the rulings; where a ruling is
ambiguous, implement the most literal reading and flag the ambiguity in the
change log rather than resolving it silently.

## 2. Fix queue (in priority order)

1. **Kill chronology:** a kill must print before any interrupt/loot follow-ups
   that reference it. Newer instruction supersedes the old implementation.
2. **Off-screen damage direction indicator:** verify it exists and works; fix
   if absent or broken.
3. **Companion 0-HP outcome handling** (per the banked-for-playtest ruling).
4. **Companion XP integration** (survivors earn XP after every defeated enemy).
5. **Investigate the 17 unexplained roster exits.**
6. **SFX P2:** dungeon ambience and interactions.
7. **SFX P3:** overworld UI.
8. **Canonical-source sanity check:** recovered-source matching does not prove
   every approved change survived — verify each approved change is present in
   the delivered build.

## 3. Acceptance

- The delivered file is a single playable HTML build, downloaded and hashed.
- Every ruling and fix above is verified present in the delivered file.
- Kavi personally playtests the exact delivered build before it is declared
  complete. Nothing here is done until that playtest passes.

## Standing instructions (all Astra briefs)

- Read `MEETING.md` at the start of the session; add your feedback under
  "Feedback — Astra"; re-check it for replies before you finish.
- Lanes are defaults, not walls: if the project needs work outside your lane
  and you are the one available, do it; note cross-lane work in `DONE.md`.
- When idle, check `TASKS.md` and pick up unassigned work.
