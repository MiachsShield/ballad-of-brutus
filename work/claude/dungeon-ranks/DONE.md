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
`node work/claude/dungeon-ranks/ranks.test.cjs` PASS, plus S1, ow-bridge, E1, contracts, conquest,
boss loot, no elements, playtest fixes, all PASS on the new CURRENT.
Also fixed a flaky assertion in my `contracts.test.cjs` (the dungeon holder is drawn weighted; the
test now pins it), about 1 run in 10 failed before.

## Open (for Robert)
- Rank odds are even. Should ranks lean on Brutus's level, or stay random?
- Rank 5 is large (37 monsters, 5 floors). Muse found the old 3-floor dungeon hard to navigate.
- Depth XP is paid per entry, and you can now resume deep. Small XP farm; left as is for playtest.
