# Dungeon ranks, checkpoints, trip home — 2026-10-13 (Claude)

Robert, 2026-10-13: "Dungeon complexity should scale with difficulty, mechanisms, monsters, and
rewards. Ensure that the dungeons have checkpoints to return and to resume from re entry akin to
most dungeons in games. After beating the boss and getting loot, automatic teleportation to town
as the dungeon closes." His answers to two questions: difficulty is a **rank per dungeon**;
re-entry keeps **map, chests and kills**.

Also in this batch, rolled in by Robert via Muse (TASKS.md row, dungeon brief): the card-face CSS
fix and the hidden-chamber counter check.

## 1. Rank 1-5 (`ranks-world.js`, `rank-dungeon.js`)
Every dungeon that opens rolls a rank, 1-5 at even odds, shown on its card as
"Rank 3 ●●●○○ · 4 floors · <one line>". Rank 2 is the old dungeon, number for number; dungeons from
older saves have no rank and play as rank 2.

| Rank | Floors | Rooms occupied | 2nd monster | Monster HP / dmg | Warden HP | Trapped passages | Trap pits / drop pits per floor | Trap dmg | Chest odds | Monster mix | Pay |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | 3 | 55% | 20% +15%/floor | ×0.80 / ×0.85 | ×0.80 | 25% | 1 / 1 | ×0.80 | 45% | mostly Skulker, Grazer | ×0.7 |
| 2 | 3 | 70% | 35% +15%/floor | ×1 / ×1 | ×1 | 40% | 1 / 1 | ×1 | 45% | even | ×1 |
| 3 | 4 | 75% | 45% +15%/floor | ×1.15 / ×1.10 | ×1.25 | 50% | 2 / 1 | ×1.15 | 55% | Brute, Stalker lean | ×1.35 |
| 4 | 4 | 80% | 55% +15%/floor | ×1.30 / ×1.20 | ×1.50 | 60% | 2 / 1 | ×1.30 | 60% | Brute, Stalker heavy | ×1.7 |
| 5 | 5 | 85% | 65% +15%/floor | ×1.50 / ×1.35 | ×1.80 | 70% | 2 / 2 | ×1.45 | 65% | Brute, Stalker, some Skulker; no Grazer | ×2.2 |

Rewards: pay scales by the table. Loot level already rises 16 per floor reached, so rank 3-4 drops
reach level 60 and rank 5 reaches 76 (rank 1-2: 44). Boss loot follows the same level.
Measured (150 generated dungeons per rank): monsters 10 / 15 / 23 / 26 / 37, trapped passages
6 / 9 / 15 / 19 / 27, chests 1.5 / 1.4 / 2.2 / 2.5 / 3.2. Rank 2's 15 matches the old measured 14.7.

## 2. Checkpoints and re-entry (`checkpoint-dungeon.js`, world half in `ranks-world.js`)
- Checkpoints: the spawn room, each floor's arrival room, every rest area, every waypoint.
  Touching one makes it the resume point ("Checkpoint: B2F rest area. If you leave, you come back here.").
- The Waypoints button now lists every checkpoint reached (titled "Checkpoints"), with the
  resume point marked; fast travel works as before.
- Leaving and coming back: the dungeon is rebuilt from a stored seed, so it is the same dungeon.
  The map (visited rooms), opened chests, spent and spotted traps, killed monsters and found
  hidden chambers carry over; the party starts at the last checkpoint. A killed warden stays
  dead, so its chest can still be looted on a later entry.
- The dungeon card says "Checkpoint saved: B1F rest area. You resume there.", and so does the
  expedition report.
- Contract progress counts across entries (3 kills, leave, 2 more = 5/5). The HUD shows the
  running total and the rank.
- The saved state is dropped when the dungeon closes (contract fulfilled or expired), when it is
  conquered, or when Brutus falls. A dungeon that failed to open keeps it.
- Each entry costs an action, as before.
- Every entry also turns Brutus to face the way on (toward the stairs, or the boss on the last
  floor). Muse's report: "Spawn facing a wall".
- Messages unchanged: the state rides on the existing contract (`contract.delve`) and expedition
  result (`result.delveState`).

## 3. Boss done → home (`checkpoint-dungeon.js`)
Warden down and its chest looted: "The dungeon shudders and begins to close. The party is carried
back to town…", and 3.5 s later the expedition ends by itself. The report adds "The dungeon closed
behind the party and carried them back to town." The existing lockout (2-5 turns) follows.

## 4. Rolled-in fixes
- Card faces (`card-face-fix-dungeon.js`): `display:block !important` dropped to plain
  `display:block` in `#handRow .card .face`, at load; sizing `!important`s untouched. A face with no
  art now hides cleanly (checked: inline `display:none` now computes to `none`; no broken-image icons).
- Hidden-chamber counter: it was wired (the relic HUD reads `secretsFound`), and Muse's 0/1 was
  because no hidden chamber was reached. It did have the farming bug (each walk-in counted).
  Now each chamber counts once, across entries too: entering, leaving and re-entering stays 1/1.

## 5. XP rebalance (`xp-world.js`)
Robert, 2026-10-13: "Xp to be adjusted on already established systems to avoid over-grinding.
Let's keep lv gain reasonable." The old rule paid Brutus kills 22, floor 45, stance 30, chamber 25,
and tripled it whenever a "foe level" (8 + 14 per floor + 6 per stance) beat his level. That
foe level reached 48-160 on a full clear, so the x3 applied almost always.

New rule (kills, stances, chambers keep their base values):
1. Monster level comes from the dungeon: 10 + 8 x rank + 4 x deepest floor.
2. Above Brutus's level: x1.5 (was x3). 10+ levels below him: x0.5. 20+ below: x0.2.
3. Floor XP only for floors new in that dungeon (resuming deep does not pay depth again).
4. A dungeon already conquered pays less each time: x1, x0.75, then x0.5.
5. At most one level per expedition, for Brutus and companions; extra XP carries over up to half
   the next level.

One full clear in a single expedition (modelled with measured monster counts; `xp.test.cjs`):

| Brutus | Rank 1 | Rank 2 | Rank 3 | Rank 4 | Rank 5 |
|---|---|---|---|---|---|
| Lv22 old → new | +1.43 → +0.73 | +2.02 → +1.04 | +3.01 → +1.50 | +3.39 → +1.50 | +4.81 → +1.50 |
| Lv30 old → new | +0.82 → +0.27 | +1.16 → +0.59 | +1.76 → +0.91 | +2.01 → +1.04 | +2.90 → +1.50 |
| Lv40 old → new | +0.40 → +0.07 | +0.57 → +0.19 | +0.88 → +0.44 | +1.01 → +0.51 | +1.48 → +0.76 |

The expedition report and log show "Brutus +N XP" and why it was reduced.

Companions (Robert, 2026-10-13: "Companions should have proper xp bars and not set, flat amounts"):
- They earn by the same rule as Brutus, with the level gap measured against their own level,
  instead of a flat 12 per kill. A Lv16 companion gets x1.5 where a Lv50 one gets x0.5.
- One level per expedition, like Brutus. They stop at their growth ceiling (the world's existing
  cap): no XP past it, and the bar reads "not getting any stronger".
- XP bar ("XP 201 / 635") on their guild card, under their name in the sidebar, and on their profile.
- The report lists everyone: "Brutus +168 XP · Ember +168 XP · Wren +168 XP."
- The old flat-XP code still runs inside the baseline; its result and its level-up lines are undone.

Whole numbers: every grant is rounded, carry-over is rounded, and old saves are rounded on load.
Untouched: guest levelling, the world's own levelling.
Live check: one kill at rank 2 paid +33 XP (22 x1.5); the warden run paid +168 (warden 22 + one
new floor 90, x1.5) with no level-up.

## Playtest (exact file, headless Chrome, zero page errors)
- Cards show rank 1-5; rank 5 opened with 37 monsters on 5 floors, rank 1 with 12 on 3.
- Rank 2 hunt dungeon: reached the B1F rest area, killed one monster, exited. Report and card
  showed "Checkpoint saved at the B1F rest area". Re-entered: started in the B1F rest area facing
  the doorway, 13 of 14 monsters, HUD "1/5 defeated", Checkpoints list "B1F entrance / B1F rest
  area · resume point".
- Warden killed, chest looted: auto-return after 3.5 s, report line present, card "Locked out".
- Same seed rebuilds the identical layout and monster ids. Training room unaffected.
- Not exercised: a full hand-played run to a rank 5 warden; page reload between entries (the state
  lives in the saved world, so it should survive).

## Tests
`node work/claude/dungeon-ranks/ranks.test.cjs` and `xp.test.cjs` PASS, plus S1, ow-bridge, E1, contracts, conquest,
boss loot, no elements, playtest fixes, all PASS on the new CURRENT.
Also fixed a flaky assertion in my `contracts.test.cjs` (the dungeon holder is drawn weighted; the
test now pins it), about 1 run in 10 failed before.

## Open (for Robert)
- Rank odds are even. Should ranks lean on Brutus's level, or stay random?
- Rank 5 is large (37 monsters, 5 floors). Muse found the old 3-floor dungeon hard to navigate.
