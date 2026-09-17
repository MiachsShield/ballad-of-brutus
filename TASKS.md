# TASKS — Ballad of Brutus

Live task board. Kavi updates this file when tasks are assigned or completed.
Each task links to its brief; completed work includes a `DONE.md` in the
model's `work/<model>/<slug>/` directory.

**Idle rule (all models):** when you have no open briefs in your lane, come
here and pick up unassigned work that fits your skills. Lanes are defaults,
not walls — if the project needs work outside your lane and you are the one
available, do it, and note the cross-lane work in your `DONE.md`.

## Claude — world / canon / design

| Status | Task | Brief |
|---|---|---|
| [ ] open | Incorporate the 12 settled rulings into design docs | `briefs/claude/2026-09-15-twelve-rulings-design-update.md` |
| [ ] open | Astra redistribution: region map + win condition design (C1) | `briefs/claude/2026-09-16-astra-redistribution.md` |
| [ ] open | Astra redistribution: takeover/settlement five-factor procedure (C2) | `briefs/claude/2026-09-16-astra-redistribution.md` |
| [ ] open | Astra redistribution: Second Wind card mechanics (C3) | `briefs/claude/2026-09-16-astra-redistribution.md` |
| [ ] open | Astra redistribution: hold-fire intent ruling (C4, one line) | `PLAYTEST-DISCUSS.md` Thread P4 |
| [ ] open | Astra redistribution: design review of Kavi's build fixes (C5) | (when Kavi delivers) |
| [ ] open | Write redo design briefs for the 4 critical-fail card faces | `briefs/claude/2026-09-15-card-redo-design-briefs.md` |
| [ ] open | Add your feedback to the meeting document | `MEETING.md` → "Feedback — Claude" |

## Grok — card design & art

| Status | Task | Brief |
|---|---|---|
| [ ] open | Redo the 4 critical-fail card faces against the visual guide | `briefs/grok/2026-09-15-critical-redo-faces.md` |
| [ ] open | Astra redistribution: 38 Priest combat faces, exact ids (G1) | `briefs/grok/2026-09-16-astra-redistribution.md` |
| [ ] open | Astra redistribution: Brutus replacement art in order (G2) | `briefs/grok/2026-09-16-astra-redistribution.md` |
| [ ] open | Astra redistribution: Bear Hug Break pass-2 tone reroll (G3) | (after Kavi's one-second read) |
| [ ] open | Add your feedback to the meeting document | `MEETING.md` → "Feedback — Grok" |

## Astra — implementation

| Status | Task | Brief |
|---|---|---|
| [ ] open | Add your feedback to the meeting document | `MEETING.md` → "Feedback — Astra" |

**Redistributed 2026-09-16 (Robert):** the Astra implementation lane is not
proceeding, so its workload moved to the other three. Astra gets nothing new.
- Design specs → Claude (C1–C5, brief `briefs/claude/2026-09-16-astra-redistribution.md`).
- Art → Grok (G1–G3, brief `briefs/grok/2026-09-16-astra-redistribution.md`).
- Code fixes in the build → Kavi (K1–K10, below).

## Kavi — implementation (redistributed from Astra, 2026-09-16)

Working rule: edit a copy of the build, never the original; nothing is done
until Kavi personally playtests the edited build and the acceptance check
passes.

| Status | Task | Acceptance |
|---|---|---|
| [ ] open | K1: fix SFX `syncTells` crash (`v.key?.startsWith is not a function`) | 5 consecutive combats, zero uncaught errors |
| [ ] open | K2: Priest all-support dead hands auto-cycle to a damage answer | Seeded support-only hand cycles to a damage card |
| [x] done (Kavi, 2026-09-16, playtested) | K3: hold-fire — allies hold until the player's first card (after Claude C4) | 3 combats, allies never open fire first |
| [ ] open | K4: kill-log chronology — kill line before interrupt/loot lines | Observed in playtest |
| [ ] open | K5: interview abort — visible abandon control, no End-turn soft-lock | Abandon mid-interview, turn proceeds |
| [ ] open | K6: companion permadeath at 0 HP, no revive path | 0 HP companion dies and leaves the roster |
| [ ] open | K7: companion XP after every defeated enemy (survivors) | XP gain observed after a kill |
| [ ] open | K8: wire Grok's card faces into the live combat hand | One-second readability test runnable in-game |
| [x] done (Kavi, 2026-09-16, playtested) | K9: Second Wind stun-only card replacing the F-keybind (after Claude C3) | Appears only while stunned, no deck footprint otherwise |
| [ ] open | K10: SFX P2 (dungeon ambience/interactions) + P3 (overworld UI), procedural like P0/P1 | Waveform checks as in P0/P1 |
| [ ] queued | Region map + takeover/settlement implementation | After Claude C1/C2 specs land |

## Unassigned

- Final readability audit of Grok's redone faces once they land (Claude).
- Redo briefs + new art for the remaining 22 non-critical flagged faces (Claude → Grok).
- Source-split of the 2.7.1 single-HTML build (per repo KANBAN; Astra when live).
- [x] done — Personal playtest of `builds/brutus-1_0_a0mk-kavi-merged.html` (Kavi, 2026-09-15, overworld + dungeon). Feedback in MEETING.md.


## Playtest assignments (Robert 2026-09-15)

After implementing changes, playtest the result as a player and give feedback
ordered by player impact. Until changes land, playtest the current build
(`builds/brutus-1_0_a0mk-kavi-merged.html`) for baseline familiarity.

| Status | Who | Playtest task |
|---|---|---|
| [ ] open | Claude | Play the current build; sanity-check the systems your design docs touch. Feedback in MEETING.md. Re-playtest after doc-driven build changes land. |
| [x] partial | Grok | Turn-1 playtest logged 2026-09-15 (stuck on Turn 1; not the briefed 6–8 turns). Incorporated into MEETING.md → "Feedback — Grok". **PR #5 must NOT be merged** — its MEETING.md was stubbed by a bad commit; content is already on main. |
| [ ] open | Astra | Playtest the exact delivered build before every handoff — nothing is complete until it plays right. (Blocked until lane connects.) |
| [x] done | Kavi | Played `brutus-1_0_a0mk-kavi-merged.html`: overworld (8 turns) + dungeon (6 sessions, ~25 min, Priest deck). Full feedback in MEETING.md. Two blockers routed to Astra's queue above. |vironment; needs a WebGL-capable rerun before the build is accepted. |

Baseline findings to regress against: `docs/baseline-playtest-2026-09-12.md`.
Full context: `docs/consolidated-passes-2026-09-12.pdf`.

## Completed

- *(none yet — this board starts 2026-09-15)*

## Split plan: Thursday 2026-09-17 → Saturday 2026-09-19 (GPT/Astra out)

Source: `briefs/2026-09-17-split-until-saturday.md`. Robert 2026-09-16: "Gpt is out until Saturday. Please split the tasks until then."

### Robert — decisions (a few taps, any day)

| # | Decision | Blocks |
|---|---|---|
| R1 | **P1** Brutus energy regen 10/s → 3/s: yes or no | Kavi K13 |
| R2 | **P2** companion damage × 0.6: yes or no | Kavi K13 |
| R3 | **P3** default difficulty → Normal for team playtests: yes or no | everyone's playtests |
| R4 | Which enemy kinds are Undead or Demon; is any a caster? | Smite/Radiant Cleave riders, Vow of Silence |
| R5 | Cross-class signatures: (A) shared pool or (B) guaranteed own-class | deckbuilder design |
| R6 | Enraged enemy → 2s exhausted punish window: yes or no | enemy kits |
| R7 | Close PR #5 (agent permissions can't) | repo hygiene |

### Kavi — implementation, review, merge

**Thursday 2026-09-17**
- [x] done — **K11 — card faces actually show.** Fix the `art/card-faces/` path when the build runs from `builds/` (REPORT bug 1). Give faces a fixed-height slot so name, cost and frames stay visible (bug 2). Acceptance: the 11 Priest faces visible in the hand at 1400×900 and at phone width, with text readable.
- [x] done — **K4 reopen — log order.** "lands" must print after "uses"; "cancels: X is down" must print after "X goes down" (bug 3). Acceptance: 3 fights with no out-of-order lines.
- [x] done — **K12 — balance data.** Merge PR #10, then apply wiring notes 1–12 from `BALANCE.md`. Acceptance: both decks 40 cards; Priest Bulwark Slam, Weak Cure and the new Anthem playable in a dive; Mercy Strike fires at ≥70% party HP; no revive path left anywhere.
- [ ] open — Review and merge the open Claude PRs: #2 (redo briefs) and #7 (playtest).

**Friday 2026-09-18**
- [ ] open — **K6 follow-up:** confirm nothing else can bring a companion back from 0 HP (bug 5 was the only path found).
- [ ] open — **Hold-fire:** try to reproduce bug 6 (back-to-back fights). Add the D1 amendment: allies also open fire when an enemy lands a hit on Brutus first.
- [ ] open — **K13 — pacing:** apply R1/R2/R3 if Robert says yes. Numbers are in `BALANCE.md` §Pacing.
- [ ] open — Playtest the result on **Normal**, then update `builds/current-build.md`.

**Saturday 2026-09-19**
- [ ] open — **K14 — enemy spread:** add `jab` and `swipe` and the per-kind kits from `BALANCE.md` (exhausted window only if R6 = yes).
- [ ] open — Start the **region map (C1)** if K11–K13 are done; takeover/settlement (C2) follows.
- [ ] open — Leave a clean `current-build.md` and TASKS state for GPT's return.

### Grok — art

**Thursday 2026-09-17**
- [ ] open — **G4 — re-light the 9 in-deck faces already on main,** by deck copies: Candle Prayer → **heal** (verdigris); Quick Strike, Smite, BlazeWhirl, Cleave → **offense** (ember oxblood); Dust in the Eyes, Radiant Glare → **debuff** (nightshade, ambient pulled to cold ink); Bulwark Slam → **defense** (tempered steel); Last Rite → **heal**, signature scale. Re-crop Last Rite full-bleed (no baked frame). Sanctuary Step and Steady Hands are pool-only now; re-light them last.
- [ ] open — **G1 continued — the 16 Priest default-deck faces not drawn yet,** in this order: Weak Cure, Warding Word, Surge, Rigor, Blessing, Heavy Blow, Excommunication (**finisher**), Mending Light, Field Mending, Vanish Step, Warding Chant, Benediction, Binding Psalm, Paralytic Rite, Sun-Blind, Anthem of the Unbroken (**new effect: a ward that keeps allies standing, not a revive**). Categories for every id are in `approved-cards-balanced.json`.

**Friday 2026-09-18**
- [ ] open — Finish any G1 in-deck faces left over. Then the **Warrior default deck, 28 faces,** starting with the ×2–3 cards: Reckless Charge, Shoulder Check, Guard Break, Pommel Tap, Crushing Helm, Riposte Cut, Executioner's Tempo, Iron Jaw, Ground Slam, Throw the Axe, Skullcracker. Umbral Reaper is the **finisher** grade.
- [ ] open — The 13 Priest and 7 Warrior pool-only faces wait until both default decks have faces.

**Saturday 2026-09-19**
- [ ] open — **G2** — Brutus replacement portrait, then deploy screen (unchanged order).
- [ ] open — **G3** — Bear Hug Break pass-2 tone reroll, if Kavi's one-second read has landed.

### Claude — design, balance, QA

**Thursday 2026-09-17**
- [ ] open — **Colour audit** of every face that lands (G4/G1): category read at thumbnail, greyscale pass, one-second test. Verdicts go on Grok's PRs.
- [ ] open — Answer Kavi's wiring questions on K12 the same day they're asked.
- [ ] open — **Redo briefs for the 22 remaining non-critical faces** (unassigned on the board), written against the new colour language so Grok redraws once.

**Friday 2026-09-18**
- [ ] open — **Re-test Kavi's K11/K12 build** with the automated harness (`work/claude/bugtest-2026-09-16/harness/`), on Normal. Report dead cards, Mercy Strike, the deck counts, and damage share (Brutus vs. companions).
- [ ] open — Fold Robert's R1–R6 answers into `BALANCE.md` and the guidelines.

**Saturday 2026-09-19**
- [ ] open — **C5 review** of K13/K14 (pacing and enemy kits) against the specs.
- [ ] open — **Handoff note for GPT/Astra:** what changed since Wednesday, what's queued (candidate: the monolith source split from KANBAN — Robert's call), and where every spec lives.

### If someone finishes early

Pick from the top of another lane: Grok's pool faces, Kavi's region map, Claude's harness improvements. Note cross-lane work in `DONE.md` as usual.
