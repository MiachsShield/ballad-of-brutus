# Character drives — 2026-10-13 (Claude, cross-lane: world sim)

Robert: "what they are most likely to do that will impact their life trajectory. Joining up with
a certain someone, seeking certain types of gear, wanting to be a certain class." He chose real
drives (they change the sim), not display-only.

## What exists now (`drives-world.js`, runs after every world turn)
Every living character carries up to three drives; personality sets the odds.

| Drive | Rolled | Moves | Completes as |
|---|---|---|---|
| Gear: a slot at a rarity or better ("a Rare weapon") | 80% of people; slot from class (Cautious: armour); rarity from level, +1 tier if Mercenary | Free agents/guild members search on their own (25% a turn, Mercenary 35%; one item in that slot at their level). Companions wait for you; after 6 turns waiting, affection −1 a turn | Free agent: the find becomes their best find, fame +3. Companion: equip it → loyalty +8, affection +6 |
| Class: retrain as another class | Ambitious 25%, Proud 20%, Mercenary 10%, Loyal 8%, Cautious 5%. Target: a neighbouring class, or the class the market event is paying for | From Lv 10: +2-6 a turn (x1.3 Ambitious/Proud); about 20 turns | Class changes; abilities kept; later ability rolls from the new class |
| Person: work beside someone in another company | 55% if a candidate exists: lover, allies, famous names from home (Ambitious/Proud), one of yours (if they like your company) | +3-9 a turn; a companion's loyalty slows it (loyalty 100 ≈ x0.17) | Leaves their guild (or you) and signs where that person is. Wanting one of yours: opinion of you +15, affection +15, a Chronicle note. Recruit the person a companion wants: loyalty +10 |

Fulfilled or dropped drives come back after a few turns (`DRV.retryAfter`).

## Measured (30 world turns, same build, real sim)
- People changing company: 92-104 with drives vs 103 without, so drives do not add churn on top
  of what guilds already do. 20 of ~143 survivors changed class.
- An earlier tuning had 59 class changes in 30 turns, which was too many; slowed to the numbers above.

## Notes
- Overworld S1's design note (`work/astra/overworld-splice-1/CHARACTER-SIM-LAYER.md`) says
  "no generic relationship web" and "no hidden progress bars". Robert asked for both; his call wins,
  flagged here for Astra.
- All values are playtest numbers in `DRV`.

## Tests
`node work/claude/character-drives/drives.test.cjs` PASS (personality odds, companion gear by
equipping, patience, class from Lv 10, free agent signs, companion pulled away and loyalty slowing
it, recruiting resolves it, wanting one of yours, free-agent gear search, exact find odds).
