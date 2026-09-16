# DONE — Astra redistribution: design specs (C1–C4)

Brief: `briefs/claude/2026-09-16-astra-redistribution.md`. Both
prerequisite items (PR #2's redo briefs, my playtest) were finished first,
per the brief's own ordering instruction.

## Output

- `work/claude/region-map-design.md` (C1)
- `work/claude/takeover-settlement-procedure.md` (C2)
- `work/claude/second-wind-card.md` (C3)
- C4 (hold-fire intent, one line) answered directly in
  `PLAYTEST-DISCUSS.md` Thread P4, with a pointer reply in `DISCUSS.md`
  Thread 1 rather than duplicating the answer in two places.

## C4, summarized here for visibility

Design intent is exactly "allies hold fire until Brutus plays his first
card in the encounter" — matching the flavor text they already display.
The trigger should be the player's first card resolving, not a timer or a
spawn-distance check; both of those are what's currently causing the
inconsistency Grok, Kavi, and I have all now independently observed.
Full reasoning in `PLAYTEST-DISCUSS.md`.

## What I grounded each spec in, and what I flagged instead of inventing

**C1 (region map):** the seven regions are already live UI (confirmed in
my own playtest today) and the win-condition math already exists
(`checkCampaignVictory`) — this spec is a display layer over existing
guild-ownership data, not a new conquest system, specifically because
world-bible v3 §4.5 rules the political/national layer distinct from
guild economic activity, and a deeper independent-nations sim is already
its own separate future phase per `MEETING.md`. Flagged for Robert:
confirm the seven UI region names are actually the seven canon nations
from world-bible v2/v3, not a coincidentally-same-length separate list.

**C2 (takeover/settlement):** staged five-factor procedure producing the
five stated outcomes (welcome/reluctant/indifferent/desert/refuse), reusing
existing affection/hostility data and the existing tribute cost-scaling
shape for settlement's escalating-concession curve. Two of the five inputs
("prerogative," "Brutus's strength") don't have a confirmed existing field
— flagged for Kavi rather than invented from nothing. All numeric
thresholds are marked explicitly as my proposed starting values, same
status as my card-balance numbers elsewhere — not canon, revisable after
playtesting.

**C3 (Second Wind):** kept every existing number and effect from the
current F-keybind implementation (`WIND_HP_COST_PCT`/`WIND_RADIUS`/
`WIND_COOLDOWN`) — only visibility (appears while stunned and off
cooldown) and presentation (a 5th, non-drawn card slot rather than an
always-on keybind) change, since that's exactly the gap between the
ruling and what's shipped. No open flag for Robert here — "Card." already
resolved the one real fork.

## C5 status

Blocked on Kavi delivering the fixed build (per the brief: "when Kavi
delivers the fixed build, review..."). Not started — nothing to review
yet.

## Cross-lane note

Read `MEETING.md`, `MEETING-2026-09-16.md`, `TASKS.md`, `DISCUSS.md`, and
`PLAYTEST-DISCUSS.md` in full before starting this, since the Astra
redistribution and the new PLAYTEST-DISCUSS.md room were both new since my
last session and neither was in the carry-over list I started from.
