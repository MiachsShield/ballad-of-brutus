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

### 2026-09-24 session (this branch only)

- **GitHub write works.** Confirmed via push_files (WRITE-TEST-2026-09-24.md + SESSION-2026-09-24.md + DONE.md update). No 403.
- **Claude redo-design-briefs** on main under `work/claude/redo-design-briefs/`. Re-read. Critical four closed with Robert PASS 2026-09-17; faces already on main:
  - `art/card-faces/priest/priest_blinding_halo.jpg`
  - `art/card-faces/priest/priest_stigmata.jpg`
  - `art/card-faces/warrior/warrior_bear_hug_break.jpg`
  - `art/card-faces/ranger/ranger_called_shot.jpg`
- **Bear Hug Break** reads as grappling BREAK (grip peeling / horse-kick), not a hold, never a literal bear. No text in art. Visual guide binding observed.
- **No further critical-face work this session.** TASKS.md parks Grok as of 2026-09-23; write is live again — lane can unpark if Muse/Robert want remaining G1/G4 or Brutus face-lock binaries dropped.
- Will not start Astra's blocked implementation rebuild.
- Next concrete step: Muse/Robert close PR #3 if still open; optionally unpark Grok for remaining faces or `briefs/grok/2026-09-18-brutus-face-lock.md`.

### 2026-09-21 session (this branch only)

- **GitHub write works.** Confirmed again via create_or_update_file (WRITE-TEST-2026-09-21.md + SESSION-2026-09-21.md). No 403.
- **Claude redo-design-briefs** still present on main; re-read. Critical four already closed with Robert PASS 2026-09-17; faces on main under `art/card-faces/`.
- **Critical redos:** no further action. Matches briefs + visual guide (no text; Bear Hug Break = grip-peeling BREAK, never hold or literal bear).
- **Main has advanced** (G1/G2/G4 batches merged 2026-09-20, balanced2 build accepted). This branch is historical for the critical set.
- **Next concrete art item:** still `briefs/grok/2026-09-18-brutus-face-lock.md` (lock key art + portrait into `art/visual-guide/` + README LOCKED). Binary constraint remains — text-only connector cannot push JPEGs. Muse drop required for the images; then README text update is trivial.
- Will not start Astra's blocked implementation rebuild. If Muse drops the Brutus binaries, open `grok/brutus-face-lock`; otherwise continue remaining G1/G4 face ids on their lanes.

### 2026-09-18 session (this branch only)

- **GitHub write works.** Confirmed via create_or_update_file on this branch. No 403.
- **Claude redo-design-briefs landed** on main. All four read.
- **Critical redos status:** Robert PASS 2026-09-17 on all four (Blinding Halo, Stigmata, Called Shot, Bear Hug Break pass 8). Faces already on main under `art/card-faces/`. PR #3 still open for close. No further redo needed; matches briefs + visual guide (no text in art; Bear Hug Break = grip-peeling break, never a literal bear or static hold).
- **Next concrete art item:** `briefs/grok/2026-09-18-brutus-face-lock.md` — lock key art + portrait (shaved/close buzz, stocky/brawny, strong jaw, early-mid 20s, action-comedy) into `art/visual-guide/` and reference from README LOCKED section. Branch `grok/brutus-face-lock`. Binary images still require Muse drop if generated in-session.
- Will not start Astra's blocked implementation rebuild. If idle after face-lock text, continue G1 remaining Priest default-deck faces or G4 re-light per Friday split plan.

### 2026-09-17 session (this branch only)

- **Write works.** `push_files` succeeded; no 403. Text file landed.
- **Claude briefs landed** on main under `work/claude/redo-design-briefs/`. Read all four. Agree with the verdicts: Blinding Halo, Stigmata, Called Shot pass; Bear Hug Break still fails the break read (asymmetric silhouette, grip peeling, tighter crop on separation point, FFXIV REF 02 impact).
- **Bear Hug Break pass 8** is the current candidate (stocky buzz-cut Brutus, horse-kick punch, opponent hinged at waist / top half flung, soot-violet/oxblood motion ground, clean matte, no text, no bear). JPEG cannot be overwritten via the text connector; it is in this Grok session. Kavi: drop the binary onto `faces/bear-hug-break.jpg` then one-second read.
- **Three faces ready** once binary is correct; leave PR draft until then.
- **Thursday split plan (TASKS.md):** G4 re-light of the 9 in-deck faces + G1 continued (16 remaining Priest default-deck faces) are next art priority after this critical set. Will not start Astra's blocked implementation rebuild.
- **Visual guide binding:** locked Brutus (early-mid 20s, shaved/close buzz, stocky/brawny, strong jaw, action-comedy). No long-hair slim Brutus.

Earlier notes (2026-09-15/16) stand on main; this section is the live addition for the branch.

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

### Kavi playtest — brutus-1_0_a0mk-kavi-merged.html (2026-09-15)

Played the exact current build as a player. Overworld: 8 turns. Dungeon:
BLOCKED — this environment has no WebGL, so the 3D dungeon could not open
(the game fails gracefully and refunds the action). All combat findings below
are unverified; the dungeon half needs a WebGL-capable rerun.

**Fixed since the 09-12 baseline:** Chronicle now logs personal events
(deaths with causes, war arcs, interview outcomes); actions no longer go
negative; roster deaths are recorded, not silent; upkeep is itemized and
toothed (250k → 153k over 8 turns).

**New issues, by player impact:**
1. Bench/activate swap with a full party is broken-feeling — the "Who should
   step aside?" dialog's buttons did nothing; had to manually bench first.
2. Auction shows no level requirements — bought a helm requiring Lv46 for a
   Lv22 Brutus. Dead inventory, no point-of-sale warning.
3. Confusing labels: "Book with X (144k g)" appearance buttons; "Concede /
   tribute · 5k g" (who pays whom?); "Team (2/2)" listing 3 people.
4. Sim text bug: "Jade Accord pulls the contract away from Jade Accord" —
   a guild poaching from itself.
5. Death-cause attribution inconsistent: Dario's death had a full causal
   chain; Tala's was logged with no cause.
6. Odd economy event: a 191 g auction recruit generated a +25k g
   "sponsorship" the same turn — unexplained by any shown rule.
7. Minor: Ember's epithet differs by tab; "1 victories"; End turn disabled
   during interviews with no way to abandon.

**Delights:** the living-world sim is the standout — a full causal NPC arc
(award → duel challenge → feud murder, reputation 8 → -17) played out across
turns; recruiting Tala turned The Iron Oath hostile → formal challenge → two
war clashes with spoils → guild absorbed. The interview minigame is genuinely
good (6 questions, personality-reactive answers, mood states, 3-round wage
negotiation with real failure stakes, NPCs remembering being turned away).

**New cards:** the 73-card Priest/Warrior merge is present in the deploy
previews (108 cards + equipment per class, Light/Medium/Heavy/Support with
numeric costs) but NOT combat-tested — dungeon blocked.

**Unchanged priority:** the implementation lane is still dark, and the 12
rulings are still build-absent. The dungeon half of this build is unverified
by any player.
