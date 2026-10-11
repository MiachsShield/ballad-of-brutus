# DONE: dungeon designs (2026-10-11)

Brief: `briefs/claude/2026-10-11-dungeon-designs.md`. Design only; no build, builder or
`current-build.md` changes, so no playtest gate. Output: `DESIGN.md` (the six answers, a data
sketch, a suggested slicing, a test plan, and nine questions).

## What was decided (proposals, not canon)

- A contract becomes **type + objective + sponsor**. Six types: Barrow, Gatehouse, Warren,
  Court, Sinkhole, Vault. The seven authored contracts map onto them (DESIGN 3.5).
- Types are rows of data over the existing generator: floor count (2 or 3), a nine-character
  room plan, loops, pits, trap and chest rates, secret and rest floors, room size, and
  encounter templates named by enemy. Every proposal is tagged [data], [small] or [new];
  nearly all are [data] or [small]. The one [new] item is an optional three-attacker
  concurrency guardrail, to be tested in the training room first.
- Escalation by floor: tier gate, threat budget in points (16-22 per delve, against about 20
  today), no rest on the last floor, hazards.
- Room variety: existing rooms keep their jobs; rest becomes single-use; two placements are
  new (ambush room, encounter room). No new event system: the S1 adventurer encounter is the
  event and only needs placing.
- Retreat stays free of extra penalty; the real cost is already the lost map (every delve
  regenerates), the spent action and forfeited gold. Brutus at 0 HP and companion permadeath
  are unchanged (CANON).
- Rewards: gold stays authored; the warden gets a real payout (`wardenSlain`); caches in
  secret chambers and Vault chests; element tilt by type.

## What I found in the build that you may not know (all verified in source)

- Every contract generates the same dungeon; themes are cosmetic.
- Floor does not gate enemy kind: a Brute can be in the first room. The armor contract does not
  guarantee a Brute.
- Rest rooms have no use limit. Chests only heal 15%. `treasureFound` is counted and never read.
- The warden pays like a skulker (one kill, 22 XP).
- S1's "Talk to adventurers" prompt appears in any safe non-connector room and hands out the
  first living unmet party in roster order, so early rooms use up the roster. Placement belongs
  in the generator.
- Pits kill enemies outright and count as kills; they also kill a knocked-in companion for good.
- Measured: 60 generated dungeons, always 27 chambers, 9-23 enemies (median 15, mean 14.7).

## Deferred

- Type-specific wardens (new enemy design).
- Four-plus floors (touches world scoring, `floorName`, the depth objective).
- A shrine or choice room; any new currency.
- Final tiers for Zombie, Cultist and Dire Hound: provisional until the enemy-deck batch.
- Tuning of every number. The training room is the instrument; DESIGN section 6 lists what to
  check first.
- Implementation. Suggested slicing is in DESIGN section 5 (D1-D3, five items each).

## Needs Robert (also DESIGN section 7)

1. Are the six types and the contract mapping right?
2. Single-use rest: yes or no? (Largest pacing change.)
3. Tiers for Zombie 1, Cultist 2, Dire Hound 2, warden 4; and the caster conflict between the
   bestiary (caster flag) and the enemy-deck brief ("not a caster type").
4. Which names ship: bestiary re-skins or the six-roster names? Keep or cut Grazer?
5. Companion killed by a pit knockback: accept, or spare allies?
6. One Overseer warden, or one per type?
7. Withdraw with no extra penalty: agree?
8. Keep dungeons at 2-3 floors?
9. Approve the reward changes (`wardenSlain`, caches, element tilt)?

## Verification

- Every BUILD claim in DESIGN section 1 was read in `brutus-1_0_a0mk-kavi-balanced2.html` or the
  S1 files; the enemy-count figures were measured by regenerating 60 dungeons in the CURRENT
  build in headless Chrome.
- Arithmetic checked by script: template points, per-floor and total points and enemy counts for
  all six mixes, the tier-gate rule in every room, plan code validity (nine cells, E at 3 and X
  at 5), no rest on any last floor, enemy coverage, and which floors hold a Brute.
- Errors caught and fixed in my own first draft before this PR: plan row garbled; Sinkhole and
  Vault rest rooms on the last floor, against my own rule; room sizes above what a 16-unit cell
  allows; secret rooms specified per dungeon when the plan repeats them per floor; a false claim
  that Sinkhole guarantees a Brute on floor 1.

## Cross-lane

Read-only work in the S1 and E1 files (placement of adventurer encounters). Nothing edited
outside `work/claude/dungeon-designs/` and one line in `AGENT_HANDOFF.md`.

## Next

Enemy 40-card decks (issue #13), per `TASKS.md`. They can use DESIGN 3.4's templates as the
composition context; the roster and tiers there are what the decks should confirm or override.
