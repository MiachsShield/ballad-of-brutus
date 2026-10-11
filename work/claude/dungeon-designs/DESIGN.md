# Dungeon designs: variety, structure, progression (2026-10-11)

Design only. Brief: `briefs/claude/2026-10-11-dungeon-designs.md` (Robert, 2026-10-11 meeting).
Nothing here changes a build. Anything marked **BUILD** was checked against the source of
`builds/brutus-1_0_a0mk-kavi-balanced2.html` (the pinned baseline, which the CURRENT build
composes) or the S1 layer in `work/astra/overworld-splice-1/`. Anything marked **CANON** is
quoted from `canon/`. Everything else is **proposal**, mine, and needs Robert before it is canon.

Cost tags on proposals say how much work each one is on top of today's generator:
**[data]** a table or constant the generator already reads, **[small]** a few lines in an
existing function, **[new]** logic that does not exist yet. Almost everything is [data] or [small].

## 0. The short version

- Today every contract, whatever its name, generates the same dungeon: three floors, one fixed
  3x3 room plan, enemies drawn uniformly from four kinds regardless of floor. The seven themes
  change the title card and the win check, nothing else (**BUILD**, section 1).
- Proposal: a contract becomes **type + objective + sponsor**. Six dungeon *types* each ask the
  player a different combat question (crowd, brace, pack, screen, pit, trap). Objectives
  (hunt / relic / depth / armor) stay as they are and pair with types.
- Types are **data over the existing generator**: floor count, a nine-character room plan, a few
  hazard knobs, and encounter templates named by enemy. No new dungeon system.
- Escalation is by floor: tier gate, threat budget, rest scarcity, hazard density.
- Rewards differ by type (loot tilt, cache rooms) and the warden finally pays like a boss.
- Nine questions for Robert are at the end, and in `DONE.md`.

## 1. What the dungeon is today (verified)

Facts the design has to respect. Sources are in parentheses so Muse can re-check them.

| Fact | Detail |
|---|---|
| One shape | `FLOOR_COUNT = 3`, a 3x3 grid per floor, and one `FLOOR_PLAN` used on every floor: room, waypoint, room / entrance, rest, stair-out / secret, platform, room. Entrance is cell 3 and stair-out is cell 5 so the inter-floor stair runs straight east. The deepest floor turns cell 5 into the boss room and cell 8 into a waypoint. Because the plan repeats, **every floor has its own secret room** (three per delve; the relic objective needs one). Rooms are 9-12 units in a 16-unit cell. (`buildFloor`, `CELL`, `ROOM_MIN/MAX`) |
| Connectivity | Random spanning tree over grid neighbours, plus 2 loop edges; leftover edges become pits (one trap pit, then one descend pit if not the last floor). 40% of connectors get a trap (spike 14 dmg, dart 9, scaled by difficulty). (`buildFloor`, `buildLevel`) |
| Population | Ordinary rooms (not entrance, rest, waypoint, secret, boss) are 70% occupied, 1 enemy, +1 with chance 35% + 15% per floor. Kind is uniform over Skulker / Brute / Stalker / Grazer (the first room of floor 1 leans Skulker). **Floor is not an input**: a Brute can be in the first room. The Overseer is placed in the boss room on floor 3 only. (`buildFloor`) |
| Measured size | 60 generated dungeons (CURRENT build, Regenerate): always 27 chambers; enemies including the boss min 9, median 15, mean 14.7, p90 19, max 23. Matches what the constants predict. |
| Themes are cosmetic | `DUNGEON_THEMES` carries name, region, objective text, reward, colour. The dungeon receives the contract only to show a HUD line. Seven contracts, one generator. |
| Objectives | hunt: 5 kills. relic: enter a secret chamber at least once. depth: reach floor index 2. armor: break one stance (`brutesBroken`, counted for any braced enemy). Win also requires Brutus not downed. Gold is paid on exit only if won; public boast pays 1.5x. (`applyDungeonResult`) |
| Armor contract is not guaranteed | Nothing forces a Brute into the dungeon. The boss braces too, so it usually resolves, but not by design. |
| Rest is unlimited | `restPressed` has no use limit: full HP, full energy, hand refreshed, no revive. One rest room per floor can be reused forever. |
| Chests only heal | One per floor at 45%, +15% max HP. `treasureFound` is counted but never read. Loot comes only from an exit roll: 15% + 2% per score point, cap 70%, item level 12 + 16 per floor + 7 per Brute broken + 4 per secret. Score = 9 x deepest floor + 3 x kills + 6 x stances broken + 5 x secrets. |
| The warden pays like a skulker | A boss kill increments `kills` by 1 (3 score, 22 XP), same as any enemy. |
| Pits are lethal to enemies | An enemy knocked into a pit goes to 0 HP ("launched into the pit and vanishes") and counts as a kill. Brutus takes 25% max HP and is returned (spike pit) or drops a floor (descend pit). A companion knocked in dies: companion 0 HP is permadeath. (`fallIntoPit`, `PIT_TRAP_DMG_PCT`) |
| Exit and loss | Exit to map works anywhere. XP and the loot roll are kept; contract gold is forfeited; the contract stays open until it expires (4-5 turns). Every delve regenerates the level, so an abandoned run loses its explored map and cleared rooms. Brutus at 0 HP ends the whole run (campaign build). Failed init refunds the action. (`applyDungeonResult`, campaign wrapper, `start`) |
| S1 encounters are unplaced | The "Talk to adventurers" prompt appears in any safe non-connector room, and the world hands out the first living unmet party in roster order until none are left. Nothing in the generator decides where meetings happen. (`dungeon-integration.js` `owSafe`, `world-integration.js` `request`) |
| Guild ambushes | The campaign layer spawns hostile guild waves after 12 s of quiet, capped at 6 faction enemies alive. Independent of this design; section 3.3 leaves room for it. |

## 2. Principles used (assumptions to confirm)

1. **Types ask different combat questions**, not "bigger numbers". A type is good if a player
   can describe in one sentence what it tests.
2. **Data over the generator.** Each type is a row of parameters and encounter templates.
   Every item below says whether it needs code.
3. **Name enemies, not cards.** Mixes use the six roster enemies; the 40-card decks
   (issue #13) come after this and slot in without changing the tables.
4. **Threat is spent in points**, so mixes survive a tier change when the decks land
   (section 3.4).
5. **The dungeon is real-time and first-person.** Crowds should be readable and clearable by a
   confident player; being flanked or surrounded should be dangerous; narrow sightlines are a
   feature, and every enemy needs a diegetic tell (bestiary spec). These are design lenses I am
   applying from the playtests and the training-room work, not canon.
6. **Constraints kept:** the five message names (`enterDungeon`, `freshDungeon`, `resumeDungeon`,
   `pauseDungeon`, `exitDungeon`) are untouched; failed init charges nothing; companion 0 HP is
   permadeath with no revive path (**CANON** 2026-09-15 #4); no new currency; canon overrides this
   document.

## 3. The six answers

### 3.1 Dungeon types (4-6 asked; six proposed)

Roster names below are the six from the enemy-deck brief: Skulker, Brute, Stalker, Zombie,
Cultist, Dire Hound. The warden is the existing Overseer, which is not one of the six
(question 4 below).

| Type | The question it asks | Floors | Plan | Signature twist | Signature enemies |
|---|---|---|---|---|---|
| **Barrow** | Can you clear a crowd without being caught in recovery? | 3 | Ring | Rabble rooms: groups of 3, all low tier. Knockback into the next body is the skill. | Skulker, Zombie |
| **Gatehouse** | Can you break a brace? | 2 | Lean, no loops | A Brute guarded every room. Short and dense; the armor objective lives here. | Brute, Skulker |
| **Warren** | Can you fight with nowhere to stand still? | 3 | Open | Wide aggro and a single rest room. Hunters track from far and arrive in pairs. | Dire Hound, Stalker |
| **Court** | Can you reach the thing behind the screen? | 3 | Ring, long rooms | Rank placement: Zombies hold the front, Cultists the far end, so you push or pull through the screen. | Zombie, Cultist |
| **Sinkhole** | Can you use the floor? | 3 | Pit-heavy | Two spike pits and two descend pits per floor. Knockback kills enemies; a descend pit is a shortcut that skips a stair room. | Stalker, Brute |
| **Vault** | Can you stay quiet and find it? | 3 | Standard (secrets) | Dense traps, few awake guards, and a cache in the hidden chamber. | Brute, Cultist |

**Plans.** A plan is nine characters, cells 0-8 left to right, top to bottom. R room, W waypoint,
Z rest, S secret, P platform, E entrance, X stair-out. E and X stay at cells 3 and 5. The last
floor still turns X into the warden room and cell 8 into a waypoint before it (existing rule).
A type then switches Z or S to R on floors where it has no rest room or secret chamber.

| Plan | Code | Used by |
|---|---|---|
| Standard (today) | `RWREZXSPR` | Vault |
| Ring | `RRREZXRWR` | Barrow, Court |
| Lean | `RWREZXRRR` | Gatehouse |
| Open | `RRREZXSWR` | Warren |
| Pit | `RRREZXRPR` | Sinkhole |

**Type parameters** [data unless noted]. Floors count from 1.

| Type | Floors | Loops | Trap pits / descend pits per floor | Connector traps | Chest chance / floor | Secret chamber on floors | Room size | Rest rooms on floors |
|---|---|---|---|---|---|---|---|---|
| Barrow | 3 | 2 | 1 / 1 | 30% | 45% | none | 9-12 | 1, 2 |
| Gatehouse | 2 [small] | 0 [small] | 1 / 0 | 40% | 45% | none | 9-12 | 1 |
| Warren | 3 | 3 [small] | 1 / 1 | 25% | 35% | 2 | 10.5-12 | 2 |
| Court | 3 | 2 | 1 / 1 | 30% | 45% | none | 9 wide, 12 deep | 1, 2 |
| Sinkhole | 3 | 2 | 2 / 2, none descending on the last floor [small] | 30% | 45% | none | 9-12 | 1, 2 |
| Vault | 3 | 2 | 1 / 1 | 70% | 85% | 2, 3 | 9-12 | 1, 2 |

No type has a rest room on its last floor: the only stop before the warden is the waypoint.
Today's 2 loops and 40% connector-trap rate are the baseline. Room sizes stay at or below 12
because `CELL` is 16 and a larger room leaves the connecting corridor too short; Court gets its
long rooms by fixing the deep axis at 12.

Floor counts stay at 2 or 3. `FLOOR_COUNT` is a constant; making it per-dungeon touches the
boss placement, the descend pit rule, the "Three floors" log line and `floorName`. Depth
contracts mean "reach the third floor" (index 2), so they only run in 3-floor types.
Four floors would also touch world scoring and is deferred.

### 3.2 Room variety

Existing rooms keep their jobs. What each does to the run:

| Room | Status | What it does to the run |
|---|---|---|
| Combat room | BUILD | The unit of pressure. Populated from encounter templates (3.4). |
| Quiet room | BUILD (an empty roll today) | Becomes deliberate: no enemies, a breath. Where encounters can live. |
| Rest | BUILD, **change** | Full party refresh. Proposal: **single use**, marked spent. Today it resets the whole run for free, so attrition has no teeth. [small] |
| Waypoint | BUILD | Fast travel to visited waypoints and the entrance. Saves backtracking, not health. Rule kept: a waypoint always precedes the warden. |
| Platform | BUILD | Raised vantage. Useful in Sinkhole (overlooks pits). |
| Secret | BUILD | Relic objective. Proposal: holds the **cache** (below). |
| Warden room | BUILD | Last floor only. Warded chamber, the point of no return. |
| Pits and traps | BUILD | Spike 14 / dart 9; pits as in section 1. |
| Chest | BUILD, **change** | Today +15% HP. Proposal: Vault chests and secret caches also grant a guaranteed item roll at floor level +4. [small] |
| **Ambush room** | proposal [small] | An ordinary combat room whose enemies start aware and enter from two doors, so flanking is the test. At most one per floor, never floor 1. Used in Warren and Barrow. |
| **Encounter room** | proposal [small] | A quiet room that may hold an adventurer party for the S1 "Talk" prompt. 0-2 per dungeon, never a connector or rest room. S1's `owSafe` gate becomes "this room is an encounter room". Stops the first rooms using up the roster. |

No new event system. The S1 adventurer encounter (Talk / aid / ignore / exploit / obstruct) *is*
the dungeon's event; it only needs placing. A shrine-style choice room is deferred.

### 3.3 Progression within a delve

**Per floor, every type:**

| Dimension | Floor 1 | Floor 2 | Last floor |
|---|---|---|---|
| Tier gate | Mostly Tier 1; at most one Tier 2 unit per room | Up to two Tier 2 units per room | No cap |
| Threat budget | Low (2-8 points) | Mid (6-10) | High (6-10 across fewer rooms), plus the warden |
| Rest | One in every type except Warren | One in every type except Gatehouse (whose floor 2 is last) | None in any type; only the waypoint before the warden |
| Hazards | Fewer connector traps | Base | Base; Sinkhole keeps both pit kinds |
| Special rooms | No ambush rooms | One ambush room allowed | One ambush room allowed |

Per-type budgets are in 3.4. Today's expectation is about 20 threat points per delve (13.7
non-boss enemies measured, 1.5 points each by the generator's kind weights), and the types stay
between 16 and 22 so difficulty is reshaped, not inflated. Barrow has about 46% more bodies at
low tier; Sinkhole and Vault have fewer, because hazards carry the pressure.

**Concurrency guardrail to test, not to assume:** at most three enemies in an attacking posture
against Brutus at once; a fourth waits. It protects "scary but not fatal" in the crowd types. It
is an enemy AI change [new]. Test it in the training room first (it spawns up to eight).

**How a run ends early, and what each costs:**

| End | Today (BUILD) | Proposal |
|---|---|---|
| Objective met, exit | Gold, fame +10, rep +3, XP, loot roll | Unchanged. Add an "objective met" banner so the player knows the rest is optional risk. [small] |
| Withdraw (Exit to map) | XP and loot kept, no gold, contract stays open until it expires, **map and cleared rooms are lost because the next delve regenerates** | Keep free of any extra penalty. The lost map, the spent action and the forfeited gold already make retreat cost real, and a tax on withdrawing punishes careful play. |
| Companion down | Permadeath, others continue | Unchanged (CANON). |
| Brutus down | Run over, no rescue | Unchanged (CANON: 0 HP is dead). Because this is final, the point of no return needs a clear signal: a warning on crossing into the warden room. [small] |
| Failed init | Action refunded | Unchanged, hard constraint. |

Single-use rest turns the descent into a resource decision: spend the rest now, or keep it for
the warden.

**Ambush layer.** Guild ambush waves (12 s of quiet, 6 faction enemies max) are independent.
They should keep working in every type; Barrow and Warren, which already field many bodies,
are the ones to watch for stacking.

### 3.4 Enemy composition

**Tiers.** Skulker 1, Brute 2, Stalker 2 come from the bestiary spec. **Zombie 1, Cultist 2,
Dire Hound 2 are my proposals** (the bestiary has no rows for them). Warden 4. A threat point
(TP) is the tier number. The enemy-deck batch confirms or overrides; mixes below are written in
templates so a tier change only retunes budgets.

**Templates** (rank: front/back only matters for Court):

| Template | Contents | TP | Note |
|---|---|---|---|
| Rattle | Skulker x2 | 2 | quick, brittle |
| Rabble | Skulker x3 | 3 | crowd |
| Shamble | Zombie x2 | 2 | slow, durable |
| Procession | Zombie x3, Skulker x1 | 4 | crowd with a fast flank |
| Gatekeeper | Brute | 2 | the brace lesson, alone |
| Squad | Brute, Skulker x2 | 4 | brace plus pressure |
| Hunter | Stalker | 2 | notices from far, never loses you |
| Hound pair | Dire Hound x2 | 4 | fast pack |
| Pack | Dire Hound x2, Stalker | 6 | last floors only |
| Screen | Zombie x2 (front), Cultist (back) | 4 | push or pull through |
| Choir | Zombie x2 (front), Cultist x2 (back) | 6 | last floors only |
| Guard post | Brute, Cultist | 4 | brace plus ranged |

**Mix by type and floor** (templates by occupied room; "rooms" means occupied combat rooms):

| Type | Floor 1 | Floor 2 | Last floor | Total |
|---|---|---|---|---|
| Barrow | Rattle, Shamble, Rattle = 6 | Rabble, Shamble, Rattle = 7 | Procession, Rabble = 7 | 20 TP, 20 enemies |
| Gatehouse | Squad, Rattle, Gatekeeper = 8 | Squad, Gatekeeper, Squad = 10 | (floor 2 is last) | 18 TP, 13 enemies |
| Warren | Hunter, Rattle = 4 | Hound pair, Hunter = 6 | Pack, Hound pair = 10 | 20 TP, 11 enemies |
| Court | Shamble, Screen = 6 | Screen, Screen = 8 | Choir, Shamble = 8 | 22 TP, 17 enemies |
| Sinkhole | Rattle, Rattle = 4 | Hunter, Gatekeeper, Rattle = 6 | Squad, Hunter = 6 | 16 TP, 12 enemies |
| Vault | Rattle = 2 | Guard post, Rattle = 6 | Guard post, Squad = 8 | 16 TP, 11 enemies |

Checks: each floor-1 room has at most one Tier 2 unit; floor-2 Hound pair has two (allowed);
the last-floor Pack has three (no cap). Every enemy of the six appears in at least one type
(Hound only in Warren, Zombie in Barrow and Court, Cultist in Court and Vault). Rattle is the
common filler. Grazer is not one of the six and is left out; see question 4.

**Warden.** The existing Overseer on the last floor of every type, at the end of the last floor's
plan. Type-specific wardens are future enemy design (question 6). Each type's escort is simply
its last-floor templates.

**Contract guarantees.** The armor objective needs at least one Brute before the warden. That
is automatic in Gatehouse (floor 1), Sinkhole and Vault (floors 2-3), and would be enforced as a
placement rule if the objective were ever paired with a type that has none (Barrow, Warren,
Court). Hunt needs five kills, and every type has at least 11 enemies. Relic needs a secret
chamber, present in Vault and Warren only.

### 3.5 Contract tie-in

A contract becomes `{ type, objective, sponsor region, payout }`. The seven authored contracts
map as follows, so every type is used and objective stays independent of type:

| Contract | Objective | Type | Why |
|---|---|---|---|
| The Hollow Crown (Marium) | hunt | Barrow | something wearing a crown under the old mint: a crowd of the loyal dead |
| The Sunken Tribunal (Themelios) | hunt | Court | an abandoned court whose inhabitants object to visitors |
| The Ashen Stair (Reyjar) | armor | Gatehouse | a monster blocking a fortress road |
| The Thorn Cathedral (Beloufi) | depth | Sinkhole | the foundations have split |
| The Violet Fault (Ayusti) | relic | Warren | a glowing fissure; the chamber is hidden inside a beast nest |
| The Gilded Sepulchre (Li Trice) | relic | Vault | a buried salon nobody can find the stairs to |
| The Quiet House (Edinius) | depth | Vault | nobody admits building it: an eerie, trapped, sparsely guarded descent |

Objective and type pair freely wherever the objective is feasible: armor needs Brutes (Gatehouse,
Sinkhole, Vault), relic needs a secret room (Vault, Warren), depth needs three floors (all but
Gatehouse), hunt works anywhere. New contracts are a type plus an objective plus a name.

**Told up front** (contract card): name, sponsor region, objective, payout, floor count, and the
type's one-line warning, for example "Barrow: crowds, low tier" or "Warren: hunters, one rest."
**Discovered inside:** exact placements, which rooms are ambush rooms, trap positions (spotted at
a range of about 4 as today), the location of the rest room and the secret chamber, and the
warden's room. A party member with the Tracking ability (existing, "reads trails; intel bonus")
could reveal one of those on arrival. [small, optional]

### 3.6 Rewards

What the player extracts today: gold on win (contract), fame and reputation, XP, an exit loot
roll, and a +15% heal from a chest. Proposal: keep gold authored per contract, and make the rest
differ by type and by depth.

| Reward | Change |
|---|---|
| Gold | Unchanged; authored per contract (26k-45k), public boast 1.5x. Types do not alter it, to keep scope small. |
| Warden kill | New result field `wardenSlain`: +12 score, +60 XP, and one guaranteed loot roll at the last floor's level. Today the boss pays like a skulker. Additive field; the world must read it. [small] |
| Loot tilt by type | Bias item **element** toward two per type (60% from the pair, otherwise uniform). Barrow Shadow and Holy. Gatehouse Fire. Warren Poison and Lightning. Court Shadow and Frost. Sinkhole Lightning and Frost. Vault no bias, but rarity one step higher from the cache. Needs `generateItem` to accept hints. [small] |
| Caches | A cache in each secret chamber (Vault, Warren relic) and Vault chests: a guaranteed item roll at depth level +4. Other types keep supplies. [small] |
| Chests in score | Add 4 score per chest (the counter exists, unread). [small] |
| Depth | Unchanged weights; loot level already rises 16 per floor. The tier gate and rest scarcity are the real depth scaling. |
| Companions | XP per kill unchanged; companion death unchanged. |

## 4. How it sits on the generator

One table, `DUNGEON_TYPES`, read where `buildLevel` and `buildFloor` run today. Illustrative
shape, not code to paste:

```
barrow: { floors: 3, plan: "RRREZXRWR", loops: 2, pits: { trap: 1, descend: 1 },
          connectorTraps: 0.30, chest: 0.45, secrets: 0, room: [9, 12], restFloors: [0, 1],
          encounters: { 0: ["rattle","shamble","rattle"], 1: ["rabble","shamble","rattle"],
                        2: ["procession","rabble"] },
          lootTilt: { elements: ["Shadow","Holy"] } }
```

- The contract carries `type`; `enterDungeon`'s existing `contract` field already reaches
  `freshDungeon`, so no new message is needed.
- `buildFloor` replaces its uniform enemy draw with the type's templates for that floor.
- Result messages gain at most one additive field (`wardenSlain`).
- Untouched: the five message names, failed-init refund, permadeath, the world's win checks
  for the four objectives.

## 5. Suggested slicing (informational, 5 items per batch)

- **D1, data only:** `DUNGEON_TYPES` table and contract `type`; floor-gated templates replace
  the uniform draw; guaranteed Brute for armor; single-use rest; per-type plan and trap knobs.
- **D2:** encounter-room placement and the S1 gate; ambush room; cache and chest rewards;
  `wardenSlain`; loot tilt.
- **D3:** Court rank placement; Sinkhole second pit pair; 2-floor Gatehouse; per-type
  contract-card warning; warden-room warning.

## 6. Test plan with the training room

The training room (`CURRENT` build) spawns up to eight enemies, can switch recovery off, and
shows frame data for the last hit each way. Use it before building:

1. Spawn Rabble, Procession and Pack and check the concurrency guardrail: is a fourth attacker
   needed to make a crowd frightening, or is three already too many?
2. Spawn Screen and Choir: can a player break a Zombie front to reach a Cultist, and does the
   Cultist's ranged pressure make standing still a mistake?
3. Spawn Squad and Gatekeeper: is a Brute's brace a fair lesson alone, and a fair threat with
   two Skulkers?
4. The bestiary lethality clamp (Tier 1 hits at most 35% of Brutus's max HP, Tier 2 at most 50%)
   is per hit. A crowd is where it can fail, so measure total damage Brutus can take in one
   exchange from Rabble, Procession and Hound pair.
5. Count pit kills for knockback in Sinkhole; check that an enemy shoving an ally into a pit is
   rare enough to accept (question 5).

## 7. Questions for Robert

1. **Types and mapping.** Are six types (Barrow, Gatehouse, Warren, Court, Sinkhole, Vault) and
   the contract mapping in 3.5 right? The flavour mapping is mine.
2. **Single-use rest.** Today a rest room can be reused without limit. Making it single-use is
   the biggest pacing change here. Yes or no?
3. **Tiers for the three new enemies.** I used Zombie 1, Cultist 2, Dire Hound 2, warden 4.
   Also: the bestiary flags casters, while the enemy-deck brief says the Cultist is "not a caster
   type". I used no caster flag. Which stands?
4. **Names.** The bestiary re-skins the built kinds (Skeleton, Slime, Werewolf, Ogre, Lich); the
   enemy-deck brief lists the six as Skulker, Brute, Stalker, Zombie, Cultist, Dire Hound. I used
   the six. Which names ship? And Grazer (the harmless wanderer, Slime in the bestiary) is not in
   the six: keep it as an ambient critter or cut it?
5. **Allies and pits.** An enemy knockback that pushes a companion into a pit kills them for good.
   That is consistent with "0 HP is dead", but it is a cheap death. Accept, or spare allies
   (damage and return, as Brutus gets)?
6. **Warden.** One Overseer for every type, or a distinct warden per type (new enemy design)?
7. **Withdrawing.** I propose no extra penalty beyond the lost map, spent action and forfeited
   gold. Agree? Should fleeing mid-fight ever cost something?
8. **Floor count.** Keep dungeons at 2 or 3 floors for now (more touches world scoring)?
9. **Reward changes.** Approve the warden bonus (`wardenSlain`, additive result field), caches
   in secret chambers and Vault chests, and element tilt by type?
