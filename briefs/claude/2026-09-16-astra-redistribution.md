# Brief — Astra workload redistribution: design specs
Date: 2026-09-16
Lane: Claude

Robert's call: the Astra implementation lane is not proceeding, so its
workload is redistributed. You take the **design-spec** share. Kavi takes
code fixes in the build; Grok takes art. Astra gets nothing new.

Finish your two open items first (the 4 redo briefs for PR #2, your
playtest), then do these in order. Each deliverable goes in
`work/claude/<slug>/` on your branch with a PR; Kavi implements from it.

## C1 — Region map + region-based win condition
Deliverable: `work/claude/region-map-design.md`
Must define, grounded in `canon/world-bible-v3.md`:
- The region list.
- How the map displays in the overworld (layout, per-region visual state).
- What "visibly under Brutus" means mechanically — per-region control
  states and how they change.
- How guild absorption interacts with region control (a region vs a
  guild charter, per Robert's ruling).
- What the player sees and does per turn regarding regions.
Acceptance: Kavi can implement it with zero guessing. Only Robert can
veto; flag anything that needs his call instead of inventing it.

## C2 — Takeover/settlement five-factor resolution
Deliverable: `work/claude/takeover-settlement-procedure.md`
Robert's ruling: the dominant guild decides from (1) affection,
(2) hostility, (3) the guild's prerogative, (4) Brutus's strength, and
(5) whether they want him as an ally.
Must define: the exact procedure — how the five factors combine
(thresholds, weights, or staged checks — your call, but pick one), the
outputs (welcome Brutus as new boss / reluctant / don't care / desert /
refuse), and settlement terms when it goes that way (concessions, labor,
escalation until hostility runs out). Turn flow included.
Acceptance: implementable as written, no invented numbers left vague.

## C3 — Second Wind card mechanics
Deliverable: `work/claude/second-wind-card.md`
Robert's ruling: Second Wind is a card that appears only while stunned
and does not occupy deck space otherwise (replaces the F-keybind).
Must define: trigger conditions, cost, effect, how it appears/vanishes,
what happens after use. It must work inside the existing 20-energy,
four-card-hand combat frame.

## C4 — Hold-fire intent (one line)
Reply in `PLAYTEST-DISCUSS.md` Thread P4: is the design intent "allies
hold fire until the player's first card is played"? If not, state the
real rule in one sentence. Kavi implements exactly what you write.

## C5 — Design review of Kavi's build fixes
When Kavi delivers the fixed build, review the changed behaviors
(second wind card, permadeath, XP, interview abort, hold-fire, kill-log
order) for design fidelity against your docs and Robert's rulings.
Report mismatches; do not re-implement.

Card balance ownership is unchanged: you own it, Grok is out of card
math, Robert keeps veto.
