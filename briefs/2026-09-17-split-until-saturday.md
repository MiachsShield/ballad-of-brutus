# Split: Thursday 9/17 → Saturday 9/19 (GPT/Astra out)

Robert, 2026-09-16: *"Gpt is out until Saturday. Please split the tasks
until then."* Three working lanes (Claude, Grok, Kavi) plus a short list of
decisions only Robert can make. Order within each day is priority order.
Kavi: please mirror these rows into `TASKS.md`. I left that file to you
rather than overwrite it.

Inputs this plan is built on:
- `work/claude/bugtest-2026-09-16/REPORT.md` — bug test of the fixed build.
- `work/claude/card-balance-2026-09-16/BALANCE.md` — the 40-card decks,
  with per-card wiring notes.
- `docs/card-guidelines/README.md` — card rules and the colour language.

## Robert — decisions (a few taps, any day)

| # | Decision | Blocks |
|---|---|---|
| R1 | **P1** Brutus energy regen 10/s → 3/s: yes or no | Kavi K13 |
| R2 | **P2** companion damage × 0.6: yes or no | Kavi K13 |
| R3 | **P3** default difficulty → Normal for team playtests: yes or no | everyone's playtests |
| R4 | Which enemy kinds are Undead or Demon; is any a caster? | Smite/Radiant Cleave riders, Vow of Silence |
| R5 | Cross-class signatures: (A) shared pool or (B) guaranteed own-class | deckbuilder design |
| R6 | Enraged enemy → 2s exhausted punish window: yes or no | enemy kits |
| R7 | Close PR #5 (agent permissions can't) | repo hygiene |

## Kavi — implementation, review, merge

**Thursday**
- **K11 — card faces actually show.** Fix the `art/card-faces/` path when
  the build runs from `builds/` (REPORT bug 1). Give faces a fixed-height
  slot so name, cost and frames stay visible (bug 2). Acceptance: the 11
  Priest faces visible in the hand at 1400×900 and at phone width, with
  text readable.
- **K4 reopen — log order.** "lands" must print after "uses"; "cancels: X
  is down" must print after "X goes down" (bug 3). Acceptance: 3 fights
  with no out-of-order lines.
- **K12 — balance data.** Merge this PR, then apply wiring notes 1–12 from
  `BALANCE.md`. Acceptance: both decks 40 cards; Priest Bulwark Slam,
  Weak Cure and the new Anthem playable in a dive; Mercy Strike fires at
  ≥70% party HP; no revive path left anywhere.
- Review and merge the open Claude PRs: #2 (redo briefs) and #7
  (playtest).

**Friday**
- **K6 follow-up:** confirm nothing else can bring a companion back from 0
  HP (bug 5 was the only path I found).
- **Hold-fire:** try to reproduce bug 6 (back-to-back fights). Add the D1
  amendment: allies also open fire when an enemy lands a hit on Brutus
  first.
- **K13 — pacing:** apply R1/R2/R3 if Robert says yes. Numbers are in
  `BALANCE.md` §Pacing.
- Playtest the result on **Normal**, then update `builds/current-build.md`.

**Saturday**
- **K14 — enemy spread:** add `jab` and `swipe` and the per-kind kits from
  `BALANCE.md` (exhausted window only if R6 = yes).
- Start the **region map (C1)** if K11–K13 are done; takeover/settlement (C2)
  follows.
- Leave a clean `current-build.md` and TASKS state for GPT's return.

## Grok — art

The colour language is new and binding: `docs/card-guidelines/README.md`
§9. Category lives in the effect light, never in borders. Gold is buff
only now.

**Thursday**
- **G4 — re-light the 9 in-deck faces already on main,** by deck copies:
  Candle Prayer → **heal** (verdigris); Quick Strike, Smite, BlazeWhirl,
  Cleave → **offense** (ember oxblood); Dust in the Eyes, Radiant Glare
  → **debuff** (nightshade, ambient pulled to cold ink); Bulwark Slam →
  **defense** (tempered steel); Last Rite → **heal**, signature scale.
  Re-crop Last Rite full-bleed (no baked frame). Sanctuary Step and Steady
  Hands are pool-only now; re-light them last.
- **G1 continued — the 16 Priest default-deck faces not drawn yet,** in
  this order: Weak Cure, Warding Word, Surge, Rigor, Blessing, Heavy
  Blow, Excommunication (**finisher**), Mending Light, Field Mending,
  Vanish Step, Warding Chant, Benediction, Binding Psalm, Paralytic Rite,
  Sun-Blind, Anthem of the Unbroken (**new effect: a ward that keeps
  allies standing, not a revive**). Categories for every id are in
  `approved-cards-balanced.json`.

**Friday**
- Finish any G1 in-deck faces left over. Then the **Warrior default deck,
  28 faces,** starting with the ×2–3 cards: Reckless Charge, Shoulder
  Check, Guard Break, Pommel Tap, Crushing Helm, Riposte Cut,
  Executioner's Tempo, Iron Jaw, Ground Slam, Throw the Axe, Skullcracker.
  Umbral Reaper is the **finisher** grade.
- The 13 Priest and 7 Warrior pool-only faces wait until both default
  decks have faces.

**Saturday**
- **G2** — Brutus replacement portrait, then deploy screen (unchanged
  order).
- **G3** — Bear Hug Break pass-2 tone reroll, if Kavi's one-second read
  has landed.

## Claude — design, balance, QA

**Thursday**
- **Colour audit** of every face that lands (G4/G1): category read at
  thumbnail, greyscale pass, one-second test. Verdicts go on Grok's PRs.
- Answer Kavi's wiring questions on K12 the same day they're asked.
- **Redo briefs for the 22 remaining non-critical faces** (unassigned on
  the board), written against the new colour language so Grok redraws once.

**Friday**
- **Re-test Kavi's K11/K12 build** with the automated harness
  (`work/claude/bugtest-2026-09-16/harness/`), on Normal. Report dead
  cards, Mercy Strike, the deck counts, and damage share
  (Brutus vs. companions).
- Fold Robert's R1–R6 answers into `BALANCE.md` and the guidelines.

**Saturday**
- **C5 review** of K13/K14 (pacing and enemy kits) against the specs.
- **Handoff note for GPT/Astra:** what changed since Wednesday, what's
  queued (candidate: the monolith source split from KANBAN — Robert's
  call), and where every spec lives.

## If someone finishes early

Pick from the top of another lane: Grok's pool faces, Kavi's region map,
Claude's harness improvements. Note cross-lane work in `DONE.md` as
usual.
