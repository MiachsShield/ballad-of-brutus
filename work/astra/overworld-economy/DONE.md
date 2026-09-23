# PR 34 overworld economy source test — 2026-09-23

This supersedes the independent `astra/overworld-economy-splice` toy run. Branch `astra/economy-pr34-grounded` starts at fetched PR #34 head `656c08c`. `source.cjs` composes that PR's `compose-s1.js` with its `world-integration.js`, `ow-bridge.js`, unchanged Claude `adventurers.js`, and SHA-pinned accepted `brutus-1_0_a0mk-kavi-balanced2.html`. No substitute people, currencies, guilds, events or value curve are introduced.

## Artifact

`brutus-pr34-overworld-economy.html` is the extracted original `WORLD_HTML` with a note and the dungeon button disabled after each render. Both world scripts are the source scripts byte-for-byte except the small display guard that keeps the delve button disabled. It retains the full world UI: turn actions, guild roster, telegraphs, auctions, free agents, treasury, Chronicle, and the original world economy. The file contains no dungeon HTML. It is playable by opening the file directly; no site is published and the accepted build is untouched.

## Actual world engine run

`node work/astra/overworld-economy/build.cjs`

`node work/astra/overworld-economy/verify.cjs`

The harness parses the exact delivered scripts and runs the world's actual `newRun()` and `endTurn()` in a seeded VM. It suppresses DOM rendering only; it does not substitute for guildPhase, celebrityTick, playerUpkeepTick, loyaltyTick, guildSurvivalTick, turnover, auctionTick, guildVsGuildTick, hostileGuildTick, agentLifeTick, guildHiringTick, demand changes, or OW state. No dungeon is launched. It checks 10 seeds × 24 turns = 240 turns, positive treasury, intact Ember and Wren identities, active multi-guild state, turns advancing exactly once, world-only HTML and save/load at seed seven.

Observed across the ten runs: 2,277 exposures to pending guild moves in turn snapshots, 1,118 auction lot exposures in snapshots, 52 demand switches, 55 snapshots with wanted-class free supply at two or less. Of 2,580 original agent identities, 1,108 die and 1,071 surviving originals end with a changed affiliation. Guilds miss payroll in 837 guild-turn observations; Brutus misses none. Seed seven: 117 original deaths, 105 surviving affiliation changes; Brutus's purse goes from 250,000 to 300,543. These are diagnostic counts, not tuned rates. Repeated snapshot exposures are not unique events.

## Player-impact findings

1. The actual guild economy is much more volatile than the toy. A player may struggle to follow named adventurers amid large mortality and turnover; chronology and visible personal stakes need attention before adding more shocks.
2. Guild wage shortfalls coexist with a solvent Brutus. Insolvency already triggers loyalty strain and auctions; use those existing pressure points to make alliances and equipment access matter.
3. Source market value is already a level-led curve modified by feat, looks, ability distinctiveness, class demand, free-agent scarcity and social value. The invented 170g pike curve and fixed-total-gold invariant from the earlier toy do not match this game and should not be integrated.
4. Exact-file rendered browser playtest remains outstanding. This VM harness proves the script and event flow, not visual usability, event readability, or fun. No dungeon/encounter/combat flow was tested.

Next: browse the standalone file as a player and inspect representative auctions, poaching telegraphs and roster exits; then design one source-grounded improvement at a time. Keep changes off the dungeon lane.
