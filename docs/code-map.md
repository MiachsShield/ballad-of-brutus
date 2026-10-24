# Code map

Every source file, what it does, and what it changes. Updated 2026-10-23.

## How the build works

`src/baseline/brutus-baseline.html` is the original game: one HTML file holding two
frames, the **overworld** (`world`) and the **dungeon**. Nothing in it is edited for
features. Each file in `src/world/` and `src/dungeon/` is a patch: it wraps a game
function (keeps the old one, calls it, adds to it) or replaces it. `build.cjs` appends
the patches to their frame in a fixed order and writes `builds/CURRENT-brutus.html`.

Rules for adding code:

- New behaviour goes in a new or existing file under `src/`, never in the baseline.
- Add the file to the right list in `build.cjs`. Put it after every patch that wraps
  the same function (the table's "Changes" column). Later patches wrap earlier ones.
- Add a test in `tests/`, rebuild, run `node tests/run-all.cjs`, then play the build.

## Overworld (`src/world/`)

Load order top to bottom, as in `build.cjs`.

| File | What it does | Changes | Test |
| --- | --- | --- | --- |
| `people/ow-core.js` | Dungeon NPC parties: who they are, what they remember, who survives a wave. Pure state, no UI (`window.OW`) | library | `ow-bridge`, `s1-integration` |
| `people/ow-bridge.js` | Save/load and messages around `OW` | library | `ow-bridge` |
| `people/ow-world.js` | Runs a party wave each End Turn; answers dungeon meetings | `endTurn`, `saveLiving` | `s1-integration` |
| `chronicle/chronicle.js` | One Chronicle card per event; strangers' churn folds into "Elsewhere on the Continent"; auction de-duplication; booking button fixes | `note`, `captureDispatch`, `endTurn`, `auctionTick`, `bidOnLot`, `bookAppearance`, `visit`, `gift`, `startInterview`, `render` | `chronicle` |
| `items/no-elements.js` | Items have no elements | `generateItem`, `derivedLoadout` | `no-elements` |
| `items/old-save-names.js` | Old saves get the renamed (non-elemental) names | `loadLiving` | — |
| `dungeon-board/contracts.js` | Guilds hold rights to their home dungeons; Access, Ally, Ally Access contracts | `spawnDungeon`, `dungeonCard`, `handleLiving`, `confirmDelve`, `applyDungeonResult` | `contracts` |
| `dungeon-board/conquest.js` | Conquered dungeons lock out 2-5 turns; angry dungeons; **upkeep paused** (`UPKEEP_PAUSED`) | `playerUpkeepTick`, `applyDungeonResult`, `dungeonCard`, `handleLiving`, `confirmDelve` | `conquest` |
| `dungeon-board/boss-loot.js` | Boss loot a cut above generic; signature items | `applyDungeonResult` | `boss-loot` |
| `items/deck-choice.js` | Deck chosen once on Deploy | `derivedLoadout`, `render` | `playtest-fixes` |
| `dungeon-board/ranks.js` | Dungeon rank 1-5 on each card | `spawnDungeon`, `dungeonCard`, `applyDungeonResult` | `ranks` |
| `progression/xp.js` | XP rules (one level per expedition max), companion XP bars | `grantExp`, `applyDungeonResult`, `logMsg`, `loadLiving`, `render` | `xp` |
| `people/drives.js` | Everyone's gear / class / person drives move each turn | `endTurn` | `drives` |
| `people/status-screen.js` | Status screen for Brutus and companions | `render`, `handleLiving` | — (browser) |
| `people/market-screen.js` | Market screen for everyone outside the company | `profile`, `render` | — (browser) |
| `people/voices.js` | Chronicle cards open with a character's own line | `dispatchCard` | `voices` |

## Dungeon (`src/dungeon/`)

| File | What it does | Changes | Test |
| --- | --- | --- | --- |
| `people/ow-meetings.js` | Meet NPC parties; Talk button | `start`, `updatePlaceTag` | `s1-integration` |
| `enemies/enemy-cards.js` | Enemies play 40-card decks (hand of 3, energy, riders) | `pickEnemyAttack`, `updateEnemy`, `landHit` | `enemy-cards` |
| `items/no-elements.js` | No element words in the combat log | `logMsg` | `no-elements` |
| `run/ranks.js` | Floors, traps, monsters and toughness by rank | `buildLevel`, `pickEnemyAttack`, `checkTrapTrigger`, `logMsg` | browser |
| `run/contracts.js` | Guild guests join the party | `initParty`, `buildPartyCards`, `formationTarget` | browser |
| `run/conquest.js` | Warden's boss chest; rare monsters in angry dungeons | `buildLevel`, `nearestChest`, `chestPressed`, `onDowned`, `pickEnemyAttack` | `conquest` |
| `visuals/fist-sprite.js` | 2D fist viewmodel (`WEAPON2D_STYLE='sword'` for a sword) | `buildWeaponView`, `poseWeapon` | browser |
| `deck/deck-choice.js` | Use the deck picked on Deploy | `applyEquipmentLoadout`, `start` | `playtest-fixes` |
| `run/straight-route.js` | A straight route down each floor; stair marker on the minimap | `shuffle`, `drawMinimap` | `playtest-fixes` |
| `visuals/card-face-fix.js` | Card faces with no art hide cleanly | CSS only | — |
| `run/checkpoints.js` | Checkpoints; leave and resume the same dungeon | `buildLevel`, `onDowned`, `start`, `updatePlaceTag`, `chestPressed` | browser |
| `deck/deck-state.js` | Reports used cards to the status screen | adds `window.brutusDeckState` | — |
| `enemies/spacing-and-training-reset.js` | Monsters keep personal space; training Reset keeps the deck | `updateEnemy`, `trainReset` | — |
| `movement/doom-turning.js` | Turning ramps up while held (Doom-style) | `updateBrutus` | `doom-turning` |

## Other code

| File | What it does |
| --- | --- |
| `src/compose.js` | Splits the baseline into its frames, inserts the patches, puts it back together |
| `src/text/element-renames.js` | Last build step: renames elemental card and ability names in the whole file |
| `tools/ow-sim.js` | Runs dungeon-party waves in node and prints who survived |
| `tools/playtest-harness/` | Playwright scripts that play the build in a headless browser |

## Inside the baseline

The baseline is about 7,800 lines across the two frames (plus embedded art and libraries). The overworld's main
systems, by function name (search for `function <name>`):

- **Turn:** `endTurn` (the full order is in `docs/people.md`).
- **People:** `makeAgent`, `agentLifeTick`, `envyTick`, `personalAgendaTick`,
  `remember`, `releaseToMarket`, `initLiving` (the named cast), `dramaTick`.
- **Guilds and money:** `guildPhase`, `celebrityTick` (income, payroll),
  `guildUpkeep`, `loyaltyTick`, `guildSurvivalTick`, `auctionTick`,
  `guildVsGuildTick`, `guildHiringTick`.
- **World events:** `fireEventThreat`, `WORLD_EVENTS`.
- **Recruiting:** `startInterview`, `negotiate`, `finalizeJoin`.
- **Campaign:** `campaign`, `declareWar`, `absorbGuild`, `checkCampaignVictory`.

Dead code was removed from the baseline on 2026-10-23 (an `if(false)` block and
the unused `TREND_PERIOD`, `tierIdx`, `rarityOrder`, a shadowed `abilityEffect`,
and the dungeon's unused `healTarget`, `allyProf`, `inCardCombat`). Its pin in
`build.cjs` was updated to match.
