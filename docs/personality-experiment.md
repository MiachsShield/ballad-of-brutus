# Personality experiment

A separate playtest build of the people design in the doc *Brutus Financial System Design*:
D–S ranks, weekly survival costs, eleven one-word personality types in place of alignment,
hungers, stakes (adventurers traded like stocks), crime, schemes, riots and the labor market,
all running whether anyone looks or not. A walkable overworld isn't built yet, so the player
sees the world through a **bulletin**, and goes into the **real dungeon** from an Expeditions tab.

**Play:** `builds/EXPERIMENT-personality.html` (from a full checkout, so card art loads in the
training room). **Rebuild:** `node build-experiment.cjs`. **Test:** `node tests/personality-sim.test.cjs`
(also part of `node tests/run-all.cjs`).

The main build, `builds/CURRENT-brutus.html`, is not changed by any of this.

## Files

| File | What it does |
| --- | --- |
| `src/experiment/world-sim.js` | The whole world, one week per `step(w)`. Plain JSON state, seeded RNG, no UI. Node (`require`) and browser (`window.PXSim`) |
| `src/experiment/overworld.html` | The page that replaces the overworld frame: Bulletin, Expeditions, People, Guilds, Your stakes, World numbers |
| `build-experiment.cjs` | Builds the main file, then swaps its overworld frame for the page above (sim inlined) and labels the header "Personality experiment" |
| `tests/personality-sim.test.cjs` | A year runs stable, Brutus can back someone, bulletins never leak secrets, saves reload identically, seeds repeat; expeditions pay, keep checkpoints, and unclaimed openings go to NPCs |

## What the player does

- **End week.** The region moves: hauls, costs, hungers, crime, schemes, coups, riots, signings.
- **Read the bulletin.** The week's three biggest public stories. Each opens with a line from
  someone who'd care (kin, a lover, a rival, a guildmate), then the plain fact. Schemes still
  in the dark never appear; they show up when exposed.
- **Back someone.** From their profile: pay ten weeks of their living costs up front, take a
  quarter of their hauls for 26 weeks. How they come to feel about Brutus decides the rest:
  devoted backers get gifts unasked; hostile ones stop paying and sell stories about him.
  Others notice who he backed and who he passed over.

- **Go down.** The Expeditions tab lists four or so openings (the main build's dungeons,
  rank 1-5, an objective and a reward). Pick Warrior or Priest, then *Go down*: the real dungeon
  opens with that rank and objective, Brutus alone. Once a week; End week is locked while he is
  underground. Finish the objective and the gold is his and the opening closes; fall short and
  the checkpoint is kept for next week. Openings he doesn't finish, an adventurer of that rank
  claims when they close (if he tried and failed, the story links back to his attempt).
  Everyone reads the result: admirers warm to him, the envious sour, and his loudest critic or
  biggest fan usually has something to say in the bulletin.

That is all. Everything else is the people acting on their own.

Not carried over from the main overworld (it isn't in this build): companions and the party,
recruiting, XP and levels, loot and equipment, guild contracts and guests, conquest and lockouts,
the Chronicle, the campaign. Brutus goes down with the starting loadout every time.

## Rules the page keeps

- Personality is never labelled. Profiles show rank, guild, how they're getting by (a word),
  who they're close to and can't stand, and what they did lately.
- Money and feelings show as words (*scraping by*, *warm*, *resentful*), not numbers, except
  Brutus's own gold and stake payouts.
- "Trace this story" and World numbers are marked playtest-only; they exist so testers can
  check that causes are real. A shipped version would drop them.
- Saves the whole world to this browser each week (about 2.5 MB a year), so a reload plays out
  exactly the same. *New region* (click twice) starts over with a new seed.
- The dungeon frame asks the overworld about NPC parties it meets; the experiment answers
  "none". The training room works unchanged.
- Reloading the page mid-expedition loses that trip (as in the main build).
- Dungeon openings roll on their own random stream, so a seeded world plays out the same until
  the first NPC claims one.

## Numbers from a seeded year (seed 20261025)

Population 240 → 237 · share scraping by or in debt 10–20% · about 1,800 events, of which the
bulletin shows three a week · a stake in a B-rank paid back roughly half its price in the test
run; the payout depends on the person and how they come to feel.
