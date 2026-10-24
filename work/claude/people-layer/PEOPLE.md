# People layer — where every person lives in the code

Status 2026-10-23. Read this before touching anyone who is not a monster:
adventurers, townsfolk, companions, guild members, the named cast.

**The short version:** there are three separate people systems, and only two of
them are in the playable build. They do not share a roster, a personality list or a
memory store. Robert's direction (2026-10-23) is to consolidate generic adventurers
and the populace into **one kind of person with needs and desires**, where world
events cull the weak and strengthen survivors, and a nobody's deed can set off a
traceable domino chain. That consolidation is not built yet; this file is the map
it starts from.

## The three systems

| System | Where | In the CURRENT build? | Who it holds |
| --- | --- | --- | --- |
| **World sim** (the baseline) | `WORLD_HTML` inside `builds/brutus-1_0_a0mk-kavi-balanced2.html` (pinned, not edited here) | Yes | `S.agents`: everyone in the overworld, held near 240 living. 15 of them are the named cast (Ember, Wren, Yue Vautrin, Orso Flint, …) |
| **OW dungeon parties** | `work/claude/overworld-2026-09-18/adventurers.js` + `work/astra/overworld-splice-1/ow-bridge.js` | Yes | A separate roster of 8 NPC parties Brutus meets inside dungeons (`S.owBridge`). Not in `S.agents` |
| **Cast / labor-market / townsfolk slice** | branch `claude/cast-2026-09-28`, folder `work/claude/cast-2026-09-28/` | **No** (headless node only, never merged) | 10 authored adventurers, 7 rival guilds, cliques, kin ripple, king-of-the-hill MVPs, news bulletin, townsfolk design (Tier B draft) |

### What overlaps (the clutter consolidation removes)

| Concept | World sim | OW parties | Cast slice |
| --- | --- | --- | --- |
| Personality | `a.personality`, one of 5: Ambitious, Loyal, Mercenary, Cautious, Proud (region-biased) | `p.traits`, from 7: proud, pragmatic, vengeful, kind, greedy, cautious, reckless | same 7 traits as OW |
| Memory of others | `a.memory[guildName]` -100..100 (+ `memoryWhy`), `'Brutus'` is a key | sentiment ledger rows (`from`, `to`, `tag`) | same ledger, plus `guild:<id>` rows |
| Ties | `a.links` (`ally` / `rival`), `a.lover`, `a.feuds`, `a.envyOf` | ledger tags | ledger tags incl. kin, mentor, lovers, friends; ripple weights 1 / .75 / .5 / .25 |
| Desires | `a.drives` (gear, class, person) from `character-drives` | party `goal` (relic, rescue, debt, …) | dominant desire: gold, strong guild, guild with friends |
| Names | world name pools + `CAST` | its own 30-name list (not the world-bible nations) | per-nation pools (`names-data.js`, ~150 per nation) |
| Culling | `fireEventThreat` world events, assassination, delving deaths, `agentLifeTick` | `runWave` each turn, then `repopulate(8)` | `market.js` per visit; unnamed free agents vanish after 6 unguilded visits |
| News | `note()` → `S.dispatches` (Chronicle), first-person voice on top | Chronicle line when a met party dies | `bulletin.js`, top 3 per visit |

## World sim: a person's record

Created by `makeAgent()`; the named cast is overwritten onto the first 15 agents by
`initLiving()`. Fields other code relies on:

- **Identity:** `id`, `name`, `gender`, `region`, `cls`, `lvl`, `cap` (hidden level
  ceiling), `attractiveness`, `legendary`, `feat`, `abilities`.
- **Standing:** `fame`, `reputation`, `affiliation` (guild name, `'Brutus'`, or null),
  `joined` (Brutus's company), `alive`, `known`.
- **Inner life:** `personality`, `affection` (0..100), `loyalty` (default 60),
  `memory` / `memoryWhy`, `lover`, `feuds`, `links`, `envyOf`, `grudges`.
- **Drives:** `drives`, `drivesRetry`, `bestFind`.
- **Named cast only:** `castKey`, `epithet`, `age`, `agenda`, `portrait`, `appearanceId`.
- **History:** `history`, the last 12 Chronicle cards naming this person.

Arrivals: each turn 1 newcomer at 60%, plus up to 3 more when fewer than 240 are
alive (`endTurn`). Named identities are never pruned.

## Turn order (End Turn)

`endTurn` is wrapped six times. Each layer calls the one below, then adds its own
work. Innermost first:

1. **Baseline** `endTurn()` — `guildPhase`, `celebrityTick`, `playerUpkeepTick`
   (paused: `UPKEEP_PAUSED` in `conquest-world.js`), `loyaltyTick`, `collabTick`,
   `speculationTick`, `envyTick`, `crabsInBucketTick`, `personalAgendaTick`,
   `admirerTick`, `brutusAttentionTick`, `peacetimeBuildupTick`, `guildSurvivalTick`,
   `guildTurnoverTick`, `auctionTick`, `guildVsGuildTick`, `hostileGuildTick`,
   `allianceContagionTick`; turn +1; world event every 2–5 turns
   (`fireEventThreat`, the existing culling roll, severity grows with peace length);
   arrivals; `agentLifeTick`; `guildHiringTick`; `partyAffectionTick`;
   `affiliatedAffectionTick`.
2. **Living layer** (same baseline file) — `dramaTick` for the named cast, dungeon
   contract expiry, a new dungeon every other turn.
3. **Campaign layer** (same baseline file) — `campaignWarTick`.
4. **OW** `world-integration.js` — `bridge.endTurn(10)` runs a wave on the dungeon
   parties, `repopulate(8)`, a Chronicle line for each met party that died.
5. **E1** `economy-integration.js` — folds duplicate Chronicle cards and turns
   strangers' churn into one "Elsewhere on the Continent" card.
6. **Drives** `drives-world.js` — `drvTick()` moves every living person's drives.

Order matters: drives run last, after the world, so a person who died this turn has
no drive tick.

## Where each rule lives

| Rule (Robert) | Code |
| --- | --- |
| Free agents vanish without a guild | baseline `agentLifeTick` delving deaths; cast slice `market.js` (6 visits) |
| A high level is no immunity; "no MMA fighter survives a knife" | OW `assassinate`; baseline `doAssassination` |
| Kin ripple 100 / 75 / 50 / 25 | cast slice `ripple.js` only |
| Cliques punish people who don't fit | cast slice `cliques.js` only |
| Personality is never labelled; read it from dialogue | `market-world.js`, `status-world.js` (labels removed 2026-10-13; the last unused label table removed 2026-10-23) |
| Overworld news in first person, sentence case | `voice-world.js` (display only) |
| Bulletin shows the top 3, similar ones grouped | cast slice `bulletin.js` only |
| Drives: gear, class, a person | `character-drives/drives-world.js` |
| Upkeep paused | `conquest/conquest-world.js` `UPKEEP_PAUSED` |

## Known leftovers in the pinned baseline

Not removed, because editing the baseline changes its pinned hash in four files.
Listed so nobody mistakes them for live features:

- `endTurn`: an `if(false && …)` block for the old fixed `TREND_PERIOD` market cycle.
  World events now come from the 2–5 turn threat timer above it.
- `tierIdx()` and `rarityOrder()` are defined and never called.
- `abilityEffect()` is defined twice; the later definition wins.
- Payroll and missed-payroll departures (`guildUpkeep`, `perAgentUpkeep`) still run
  for NPC guilds. Robert's 2026-10-06 ruling (no upkeep, no wages) supersedes them
  as a direction; removing them changes the guild economy, so it waits for an
  explicit go-ahead.

## Where consolidation would start

Proposed 2026-10-23, not approved yet:

- One record: the world sim's `S.agents` entry. "Adventurer" becomes a flag that
  unlocks dungeons and a class.
- One personality vocabulary and one memory store; pick the 7 sim traits and the
  ledger (they already drive ripple, cliques and the cast slice), or the 5
  baseline personalities and `a.memory`. Robert's call.
- One log with a `because` link on every deed, death and world-event casualty, so
  the bulletin can name a chain's root cause.
- The OW dungeon parties become ordinary people who happen to be delving.
- Research on how other games handle this: "How Games Make People Feel Like
  People" (Claude doc, 2026-10-23).

## Tests that cover people

| Suite | Covers |
| --- | --- |
| `work/astra/overworld-splice-1/integration.test.cjs` | world tick, save/load, New Run, meetings |
| `work/astra/overworld-splice-1/ow-bridge.test.js` | OW bridge lifecycle |
| `work/astra/economy-splice/economy-integration.test.cjs` | Chronicle folding, auctions, booking |
| `work/claude/character-drives/drives.test.cjs` | drives |
| `work/claude/voice-world/voice-world.test.cjs` | first-person voices |
