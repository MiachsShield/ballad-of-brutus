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

---

## Rolled-in playtest fixes (Robert, 2026-10-13)

From Muse's 2026-10-12 playtest of the CURRENT build. Robert: roll these
into the dungeon work rather than a standalone fix brief. Take them with
your next dungeon implementation batch.

### 1. Card-face CSS fix (certain, browser-verified 2026-10-13)

**Fix (two parts):** in the portrait-cards CSS rule `#handRow .card .face`,
change `display:block !important` to `display:block` (keep the sizing
`!important`s), AND append `#handRow .card .face[hidden]{display:none}`.

**Root cause (corrected 2026-10-13 — supersedes the earlier one-liner):**
the build hides missing faces via the `hidden` attribute (faces unhide on
load via `onload="this.hidden=false"`), per the K8 contract that missing
faces hide cleanly. The browser's built-in `[hidden]{display:none}` rule
loses to ANY author `display` declaration — dropping `!important` alone was
tested in Chromium and changes nothing; the face still computes to
`display:block`. The appended `[hidden]` rule (higher specificity, same
stylesheet) is what actually restores the hide. The art path
(`art/card-faces/<lowercase-class>/<card-id>.jpg`) is correct; the art
exists in the repo. No design judgment.

**Note:** this portrait-cards CSS currently lives only in the built
`CURRENT-*.html` artifact, not in `work/` sources — carry the whole
override (with this fix) into the build sources, or the next rebuild from
sources drops it entirely.

### 2. Hidden-chamber counter (unconfirmed — please check)

Playtest: the dungeon header's chamber counter stayed `0/1` across four
dungeon entries; the hidden chamber was never found. The build source
comments that secret rooms "are not wired to anything yet" (code-comment
match only; wiring not proven). Please confirm whether the counter tracks
that unwired system, and wire or remove it accordingly.
