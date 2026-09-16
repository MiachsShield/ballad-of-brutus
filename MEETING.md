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

Did both open briefs this session. One's done (`work/claude/twelve-rulings/`);
the other is blocked, and I want to flag *why* here since it changes an
assumption in the status section above.

**The 97-face audit doesn't exist anywhere I can reach.** The status section
says "Claude's audit kept 68 and flagged 26 for redo, 4 of them critical
(Blinding Halo, Stigmata, Bear Hug Break, Called Shot)." I full-text searched
the entire shipped build (`brutus-1_0_a0mk-kavi-merged.html`, SHA-verified) for
all four names: two exist only as one-line overworld flavor entries (no rules
text, no art), and two — Bear Hug Break, Called Shot — don't exist anywhere in
the repo at all. No card-face art exists in this project's history at all;
Grok's own visual pass (`docs/consolidated-passes-2026-09-12.pdf`) lists
"art-only faces for the five current cards" as not-yet-started. There's also
only one branch in this repo (`main`), so the audit didn't land here and go
unmerged — it never landed here. Either it lives in a conversation outside
this repo (matching the pattern where Grok's P0 images "live in the Grok
conversation" per the same PDF), or it's describing cards that don't exist
yet. Full writeup in `work/claude/redo-design-briefs/DONE.md`. Whoever ran
that audit — if it was a prior me, I have no memory of it; sessions here don't
carry over — please get it (and ideally the actual face art) into this repo.
Grok shouldn't be blocked waiting on briefs I can't responsibly write.

**Two of the 12 rulings contradict what's actually shipped, not just what's
undocumented.** Full detail in `work/claude/twelve-rulings/design-update.md`,
but the two worth flagging here directly:
- Second Wind (#11) is described as a hand-card that shows only while
  stunned. The shipped build has no such card — it's a fixed keybind (`F`)
  with a cooldown, unrelated to stun state, and never competes for a card
  slot. I didn't reconcile this myself; it needs Robert's call on whether the
  ruling wants Second Wind rebuilt into the card system or whether the
  existing keybind design already does what the ruling was protecting
  against.
- The win condition (#9, "every region visibly under Brutus") is already
  satisfied today by the *guild-charter* ownership check — but "region" also
  exists in the build as a separate, purely cosmetic filter tag on the People
  screen (the exact thing `docs/baseline-playtest-2026-09-12.md` already
  flagged as overpromising). If Robert means the literal region grouping, this
  ruling is unimplemented, not implemented.

**One system disagreement, not a doc nitpick:** #7 (settlement — escalating
concessions until hostility is exhausted) and #8 (tribute — an action spent
every turn with a success/failure/refusal ladder) read as two different
systems, but the shipped build has exactly one — a lump-sum tribute payment
that buys a fixed number of turns of peace. Before Astra builds anything here,
worth confirming whether Robert wants both as separate player choices or one
system that does both jobs.

On the open questions above: for #3 (acceptance bar for baseline), I'd weight
the takeover-affection system (#6) and the settlement/tribute split (#7/#8)
as higher-risk than they currently read in the status section — they're not
"apply 12 known rulings to existing systems," they're closer to new systems
with no existing implementation to extend. Worth knowing before promising a
build that "has the 12 rulings" when at least three of them are still open
design questions, not implementation tickets.

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

### 2026-09-15 review round (Kavi)
- **PR #1 (Claude, twelve-rulings) — merged.** Verified all 12 rulings
  against the shipped build's SHA-pinned source instead of inferring from
  docs, and flagged the real contradictions honestly (#8 tribute vs. ruling,
  #9 region ambiguity, #11 Second Wind keybind vs. card). This is the
  standard for design work on this repo. Two of the flagged items need
  Robert's call before anyone builds on them — see
  `work/claude/twelve-rulings/design-update.md` summary.
- **PR #2 (Claude, redo-design-briefs) — blocked, and the blocker is mine.**
  The 97-face audit and the 243 faces live in my local workspace and were
  never uploaded, so the brief pointed at material Claude couldn't reach.
  Correct call not to invent the briefs. I'll land the audit plus the four
  current faces and citable rules text under `art/audit/`, then re-open the
  brief against that material.
- **PR #3 (Grok, critical redos, draft) — art verdict after viewing all four
  faces:** blinding-halo **pass** (light into the attacker's eyes, the miss
  reads instantly), stigmata **pass** (glowing wounds, still advancing),
  called-shot **pass** (arrow through the visor slit), bear-hug-break
  **needs another pass** — agrees with Grok's self-assessment, first read is
  the hug, not the break; the escape must be the first thing the eye lands
  on. No baked text in any of the four. Holding the PR as draft until the
  redo lands and Claude's written briefs are in to cross-check.
- **Astra lane:** branch `astra/implementation-queue` exists, one docs
  recheck commit so far, no implementation yet. The 12-rulings design update
  now gives it a scoped spec (takeover affection states is the highest
  priority item).
- **Token hygiene:** the fine-grained PAT pasted into the Grok/GPT chats
  must be revoked at github.com (Settings → Developer settings → Personal
  access tokens) now that the push is done — Grok flagged this itself in its
  DONE.md. Scanned all open PR diffs: no token material in the repo.
- **Audit landed, PR #2 unblocked (2026-09-15):** the 97-face audit material is
  now in-repo under `art/audit/` — README with the 68/26/4 verdicts, the four
  current failing faces (`faces/`), and per-card records (`cards/`) quoting
  exactly what is citable: Blinding Halo and Stigmata exist in the shipped
  build only as one-line overworld flavor traits (no combat cost, no rules
  text); Bear Hug Break and Called Shot do not exist in the build at all;
  Called Shot's only numbers are Claude's audit-design row (cost 3, 6+cripple),
  not canon. PR #2's brief is re-opened against `art/audit/` — Claude can now
  write the four design briefs without inventing card data.
