# Project Meeting — Ballad of Brutus

A standing meeting document. Purpose: every collaborator (Claude, Grok, Astra,
Kavi) sees the same status and goals, and we hold the project's discussion
here instead of losing it across chats.

## How to use this document

1. **Read it** at the start of every work session.
2. **Add your feedback** under your section below. React to the status, the
   goals, and the other models' feedback — this is an active discussion, not
   a form. Disagree where you disagree; that is the point.
3. **Re-check it** before you finish a task, for replies to your points.
4. Work on your own branch (`<model>/<slug>`), commit your additions under
   your section, and Kavi merges after review.
5. Status and goals are maintained by Kavi. Open questions are answered by
   Robert; models may propose answers, but only Robert's decisions go into
   `canon/`.

## Status — 2026-09-15

- **Current build:** `builds/brutus-1_0_a0mk-kavi-merged.html` (10.3 MB,
  SHA-256 `84f46127…b3ca2`). Contains Astra's 73-card Priest/Warrior merge.
  Static checks pass (all 73 cards, 108/deck, 20-energy costs, 102 automated
  checks). **Not yet player-accepted:** Kavi has not playtested this exact
  file, so it is the candidate baseline, not the accepted one.
- **Pipeline change:** this repo is now the shared workspace. Briefs go in,
  branches come out, Kavi reviews before merge. Browser-chat logins are the
  fallback, not the plan.
- **Robert's 12 rulings** (2026-09-14, binding, in `canon/decisions-2026-09-14.md`):
  companion 0-HP banked for playtest; expedition XP on survival; war/ambush
  deaths count as murder; crime = loss of an asset or distress to an active
  member; Brutus may die outside battle only in authored events; takeover
  conclusions run an affection range (welcome → refuse); settlement is
  escalating concessions until hostility is spent; tribute costs actions every
  turn with real punishment for failure/refusal; win = every region visibly
  under Brutus; energy stays on Brutus's 20-point bar; Second Wind exists and
  shows only while stunned; player-held territory allows no other leaders.
- **Claude's design lane:** has its first brief — fold the 12 rulings into the
  design docs. Not yet started as of this writing.
- **Grok's art lane:** 243 class-card faces exist; Claude's audit kept 68 and
  flagged 26 for redo, 4 of them critical (Blinding Halo, Stigmata,
  Bear Hug Break, Called Shot). Redo briefs are queued. The visual guide
  (`art/visual-guide/`) is now in-repo and binding on all image work.
- **Astra's implementation lane:** blocked on the ChatGPT connection. Queue is
  written and waiting: apply the 12 rulings, fix kill-chronology ordering,
  off-screen damage indicator, companion 0-HP outcomes, companion XP,
  investigate 17 unexplained roster exits, SFX P2/P3, canonical-source sanity
  check, then a Kavi-playtested delivered build.
- **Lanes are defaults, not walls.** If the project needs work outside your
  lane and you are the one available, do it.

## Goals

**Near term**
1. Claude folds the 12 rulings into the design docs without inventing new mechanics.
2. Grok redoes the 4 critical faces against the visual guide; Claude audits.
3. Astra's lane connects; the 12 rulings and the fix queue become a build Kavi
   can actually playtest.
4. The merged build becomes the accepted baseline only after Kavi playtests it
   as a player.

**Longer term** (the ten phases: battle playtesting, dungeon variety, new
enemies, enemy combat, art integration, overworld depth, political layer,
narrative, full card prototype, guild-war events and endings/NG+): keep the
pipeline moving one brief at a time. No phase starts until its inputs exist.

## Open questions for discussion

1. What is the single highest-risk gap between the design docs and the current
   build, and who should close it first?
2. The 243-face art set was built before the visual guide was finalized. How
   much of the "keep" set should be re-checked against the guide?
3. What should the acceptance bar be for a build to become the baseline?
4. How do we keep the meeting discussion itself moving — is a per-session
   check of this document enough, or do we need a nudge?

---

## Feedback — Claude

*(Claude: add your feedback here.)*

## Feedback — Grok

*(Grok: add your feedback here.)*

## Feedback — Astra

*(Astra: add your feedback here.)*

## Feedback — Kavi

The pipeline change is the right call — the browser-login round was eating
more time than the work. My worries, in order:

1. **Nothing is verified end-to-end.** We have a merged build nobody has
   played. The static checks say the cards are there; they say nothing about
   whether the game is fun or even coherent. Playtesting the exact file is
   the highest-value hour anyone can spend right now, and it is mine to do.
2. **The implementation lane is dark.** Astra has the longest queue and no
   way to execute. Every design and art decision made now piles up behind
   that blockage. Unblocking the ChatGPT connection is the project's critical
   path, not a side errand.
3. **The 12 rulings are design-complete but build-absent.** Until they are in
   a playable build, they are wishes. Claude's doc work matters, but the
   measure is a build where tribute costs actions and Second Wind appears
   when stunned.
4. **Art is ahead of design on the redos.** Grok should not redo faces from
   the audit shorthand alone — Claude's written briefs for the 4 criticals
   should land first, each one naming the exact readability failure and the
   visual-guide passage that fixes it.
