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
- `work/claude/bestiary-2026-09-17/BESTIARY.md` — monster types, punish
  windows, pacing.

## Robert — decisions (answered 2026-09-17)

Recorded in `canon/decisions-2026-09-17.md`.

| # | Question | Robert's answer | Where it landed |
|---|---|---|---|
| R1 | Brutus energy regen 10/s → 3/s | **Yes** | `BESTIARY.md` §4 → K13 |
| R2 | Companion damage × 0.6 | **No** | companions unchanged |
| R3 | Default difficulty → Normal for team playtests | **Yes** | `BESTIARY.md` §4 → K13 |
| R4 | Enemy types | **"Use typical well known monsters from pop culture"** | `BESTIARY.md` §1–2: tags + re-skins → K14 |
| R5 | Cross-class signatures | **General / class / signature** (signature = unique characters, abilities, gear) | guidelines §5; gear cards leave class decks → K15 |
| R6 | Enemy punish windows | **"The stronger the monster, the less predictable and easy to identify windows — like monster hunter"** | `BESTIARY.md` §3 → K14 |
| R7 | Close PR #5 | **Closed** | — |

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
- **K12 — balance data.** Merge PR #10, then apply wiring notes 1–12 from
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
- **K13 — pacing (approved):** Brutus regen 3/s with stun refill unchanged,
  and default difficulty Normal. Spec in `BESTIARY.md` §4. Companion damage
  stays as built.
- **K15 — access tiers:** rebuild the decks from `build.py` (11 gear
  cards leave the class decks, Killing Shout becomes the Warrior finisher).
  Gear cards arrive at 1 copy. Wiring notes 13–17 in `BALANCE.md`.
- Playtest the result on **Normal**, then update `builds/current-build.md`.

**Saturday**
- **K14 — monsters:** add `jab` and `swipe` and the kits from `BALANCE.md`,
  plus `BESTIARY.md`: type tags, re-skin names (Skeleton, Slime, Werewolf,
  Ogre, Lich), and the four-tier window knobs (jitter, delayed release,
  feints, combos, random recovery, enrage behaviour) with their
  guardrails.
- Start the **region map (C1)** if K11–K15 are done; takeover/settlement (C2)
  follows.
- Leave a clean `current-build.md` and TASKS state for GPT's return.

## Grok — art

The colour language is new and binding: `docs/card-guidelines/README.md`
§9. Category lives in the effect light, never in borders. Gold is buff
only now.

**Thursday**
- **G4 — re-light the Priest faces already on main,** by deck copies:
  Candle Prayer → **heal** (verdigris); Quick Strike, Smite, Cleave →
  **offense** (ember oxblood); Dust in the Eyes, Radiant Glare →
  **debuff** (nightshade, ambient pulled to cold ink); Bulwark Slam →
  **defense** (tempered steel); Last Rite → **heal**, showpiece scale;
  Steady Hands → **buff** (old brass; back in the deck as of 2026-09-17).
  Re-crop Last Rite full-bleed (no baked frame). BlazeWhirl (a Fire-weapon
  signature now) → **offense**, after the deck cards. Sanctuary Step is
  still pool-only; re-light it last (**defense**).
- **G1 continued — the Priest default-deck faces not drawn yet,** in this
  order: Weak Cure, Warding Word, Rigor, Heavy Blow, Excommunication
  (**finisher**), Mending Light, Field Mending, Warding Chant,
  Benediction, Binding Psalm, Paralytic Rite, Sun-Blind, Anthem of the
  Unbroken (**a ward that keeps allies standing, not a revive**),
  Alms-Taker's Ear, Rite of the Held Wound. Gear signatures (Surge,
  Blessing, Vanish Step) come after the deck. Categories for every id are
  in `approved-cards-balanced.json` (run `build.py`).

**Friday**
- Finish any G1 in-deck faces left over. Then the **Warrior default deck,
  25 faces,** starting with the ×2–3 cards: Reckless Charge, Shoulder
  Check, Guard Break, Pommel Tap, Crushing Helm, Riposte Cut,
  Executioner's Tempo, Iron Jaw, Ground Slam, Throw the Axe, Skullcracker,
  Kick the Knee, Feint High, No Retreat. Killing Shout is the Warrior's
  **finisher** grade. Umbral Reaper is a gear finisher, drawn after the
  deck.
- **Monster re-skins** (`BESTIARY.md` §2): Skeleton, Slime, Werewolf, Ogre,
  Lich sprites, with the stronger monsters' tells designed to share poses
  (§3).
- Pool-only faces (9 Priest, 4 Warrior) and the remaining gear
  signatures wait until both default decks have faces.

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
- ~~Fold Robert's R1–R6 answers into the specs~~ — done Thursday
  (`BALANCE.md`, guidelines §5/§7/§8, `BESTIARY.md`).

**Friday**
- **Re-test Kavi's K13/K15 build** with the automated harness
  (`work/claude/bugtest-2026-09-16/harness/`), on Normal. Report dead
  cards, Mercy Strike, the deck counts, gear signatures at 1 copy, and
  damage share (Brutus vs. companions).

**Saturday**
- **C5 review** of K13/K14 (pacing and monsters) against the specs.
- **Handoff note for GPT/Astra:** what changed since Wednesday, what's
  queued (candidate: the monolith source split from KANBAN — Robert's
  call), and where every spec lives.

## If someone finishes early

Pick from the top of another lane: Grok's pool faces, Kavi's region map,
Claude's harness improvements. Note cross-lane work in `DONE.md` as
usual.
