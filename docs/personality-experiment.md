# Personality experiment

A separate playtest build of the people design in the doc *Brutus Financial System Design*:
D–S ranks, weekly survival costs, eleven one-word personality types in place of alignment,
hungers, stakes (adventurers traded like stocks), crime, schemes, riots and the labor market,
all running whether anyone looks or not.

Since 2026-10-25 ("Build all facets" → **one population**) it is the whole game: the main
overworld with every system in it (companions, recruiting, interviews, XP, loot, contracts and
guild rights, conquest, the Chronicle, the campaign, the real dungeon), where the game's people
and guilds **are** the sim's people and guilds. Anyone you recruit, fight beside, back or read
about is one person with one set of feelings.

**Play:** `builds/EXPERIMENT-personality.html` (from a full checkout, so card art loads).
**Rebuild:** `node build-experiment.cjs`. **Test:** `node tests/personality-sim.test.cjs` (also in
`node tests/run-all.cjs`); in a browser, `python3 tools/playtest-harness/personality-experiment.py`.

The main build, `builds/CURRENT-brutus.html`, is not changed by any of this.

## Files

| File | What it does |
| --- | --- |
| `src/experiment/world-sim.js` | The region, one week per `step(w)`. Plain JSON state, no UI. Node (`require`) and browser (`window.PXSim`). `fromCast` builds it from a game's people; `kill`, `setGuild`, `setHeld`, `adopt`, `outcome`, `claim`, `news` let the game report what it did |
| `src/experiment/one-population.js` | Overworld patch, loaded after every main-build patch: keeps game and sim one population, adds the Bulletin screen, the World screen's bulletin, "What people say about them" and *Back them* on profiles |
| `build-experiment.cjs` | Main build's patches + the two files above; labels the header PERSONALITY EXPERIMENT |
| `tests/personality-sim.test.cjs` | The sim alone: a stable year, stakes, no secrets in the bulletin, identical reloads and seeds. Built from a cast: ranks from levels, held company, host deaths/moves/recruits, world-event deaths traced to the event, expeditions and claims, compact saves |
| `tools/playtest-harness/personality-experiment.py` | Headless browser: recruit, gift, release, a real expedition with the party, a stake from a profile, game and sim agree on who is alive and where, reload, new run, a 52-turn soak |

## Who owns what

| The sim decides | The game decides |
| --- | --- |
| Life and death, rank, money, guild membership | Class, level, abilities, items, feats |
| Feelings, lovers, feuds (one store: the game's `affection` is a view of the sim's feeling toward Brutus) | Interviews, recruiting, wages, companions, gifts and visits (they move the sim's feelings) |
| Crime, schemes, riots, coups, successions | Dungeons, contracts and guild rights, conquest, XP |
| The labor market: walkouts, signings, poaching, free agents, slums, guilds folding and founding | World events (the culling), assassinations, feud duels, the campaign |
| Arrivals and heirs (each newcomer gets a full game record from `makeAgent`) | The Chronicle |

Each End Turn: the game's turn runs; whatever it changed (a death, a hire, a recruit, a gift, guild
money, Brutus's gold) goes into the sim as news; the sim runs one week; its results go back into
the game. Game systems the sim replaces are switched off in the experiment only: the game's own
arrivals, delve deaths and romance rolls (`agentLifeTick` keeps levelling, feats and finds for
whoever the sim sent down), guild hiring, guild turnover, and payroll quits (`celebrityTick` keeps
fame, sponsor money for Brutus's people, and gifts).

Ranks come from level: at the start the top 2% are S, the next 6% A, 14% B, 28% C, the rest D.
A promotion lifts a level that is below its rank's floor. Brutus's company is *held*: off the market
and out of the economy, still in the social web (they can be robbed, seduced, fallen for).

## What the player sees that is new

- **Bulletin** (sidebar): the turn's three biggest public stories, each with a line from someone
  who'd care, then the fact, then the people (click any name for their profile). *About you*, *Your
  stakes*, earlier turns, and World numbers (playtest only). The World screen opens with the turn's
  bulletin.
- **Profiles** gain *What people say about them*: rank, how they're getting by (a word), who they
  are close to and can't stand, how they see you, what they did lately, and *Back them*.
- **Expeditions** are the game's own. How one went is news: admirers warm to Brutus, the envious
  sour, someone usually says so, and a companion who dies down there is traced to that trip.
  Openings nobody finishes are claimed by an adventurer of that rank when they close; if Brutus tried
  and failed, the claim points back to his attempt.
- **World events** that kill are one story ("The beast tide hits hard…"), each death traced to it.

## Rules kept

- Personality is never labelled; read it from what people do and say.
- Money and feelings show as words, except Brutus's own gold and stake payouts.
- "Trace this story" and World numbers are playtest-only.
- The region saves beside the game's save (`brutus-px-world-v1`, about 1 MB a year after compacting).
  A run saved by the main build loads and gets a region built from its people.

## Numbers (headless, 52 turns)

About 225 people and 12–17 guilds hold steady; 20–28% scraping by or in debt; about 250 deaths a year
(most from the game's world events), about 220 arrivals; End Turn about half a second headless.
