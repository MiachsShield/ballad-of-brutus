# Brief: dungeon designs (2026-10-11)

From Muse. Robert's meeting decision 2026-10-11: **start dungeon designs now.**
This jumps ahead of S2/S3 and the lane-live batches in your queue — those wait.

## Objective

Design the dungeon side — variety, structure, progression — so dungeons stop
being one repeated shape. This batch is **design only, no implementation.**

## Background (repo paths)

- Current dungeon: 3D first-person, one contract flow (Take contract →
  deploy → descend → deck choice → rooms → return). Authored contracts exist
  (e.g. Gilded Sepulchre, Hollow Crown). Playtests confirm the loop works;
  the shape doesn't vary.
- Enemy combat design runs separately: six enemies get 40-card enemy-only
  decks on the same 20-point bar — issue #13, brief
  `briefs/claude/2026-09-17-enemy-decks.md`. **Assume those decks exist**
  when composing encounters; name enemies, not cards.
- Your bestiary spec (`work/claude/bestiary-2026-09-17/BESTIARY.md`) with
  threat tiers still stands — build on it, don't redo it.

## Design questions to answer

1. **Dungeon types.** What distinguishes one dungeon from another — theme,
   layout shape, length, signature twist? Name 4–6 types.
2. **Room variety.** Room types beyond combat: treasure, rest, event, trap,
   boss/warden, other? What does each do to the run?
3. **Progression within a delve.** How difficulty and tension escalate floor
   by floor. Where the run can end early (retreat? wipe?) and what that costs.
4. **Enemy composition.** Which of the six enemies appear in which dungeon
   types, in what mixes and counts. Tie mixes to your threat tiers.
5. **Contract tie-in.** How authored contracts map to dungeon types — what
   the player is told up front vs. what they discover inside.
6. **Rewards.** What the player extracts and how it scales with depth,
   danger, and dungeon type.

## Hard constraints

- Don't break enterDungeon / freshDungeon / resumeDungeon / pauseDungeon /
  exitDungeon. A failed dungeon init must not charge an action.
- Companion 0 HP = permadeath. No revive paths anywhere.
- Robert's settled decisions in `canon/` override everything in this brief.
- Flag anything you're unsure about rather than inventing canon.

## Deliverable

- Branch `claude/dungeon-designs` from main.
- Output: `work/claude/dungeon-designs/DESIGN.md` (the six answers above)
  plus `DONE.md` (what was decided, what was deferred, what needs Robert).
- Open a PR against main when done. Design only — no build changes in this
  batch, so no playtest gate; the 5-item batching rule applies to the
  implementation batches that follow, not to this doc.

## Standing

Check `MEETING.md` at the start of your session, add feedback under your
section, re-check for replies before you finish. Note this reordering in
your own words there.
