# Personality experiment build — done 2026-10-25

Robert: "Make a separate build. Label it personality experiment. We'll use bulletin for this playtest."

- `src/experiment/world-sim.js`: the design-doc world (ranks, costs, types, hungers, stakes,
  crime, schemes, riots, labor market) ported from the Python model to JS.
- `src/experiment/overworld.html`: bulletin-first page replacing the overworld frame.
- `build-experiment.cjs` → `builds/EXPERIMENT-personality.html`. `CURRENT-brutus.html` unchanged
  (SHA `7b4c6fb3…53fa`).
- Tests: `tests/personality-sim.test.cjs`; all 15 suites pass. Headless browser: 34 weeks,
  backed a B-rank, every tab, reload keeps the week, training room opens, phone width fits,
  zero page errors.
- Brief: `briefs/muse/2026-10-25-personality-experiment.md`.
- Connected to the real dungeon (Robert: "Connect please"): Expeditions tab, the main build's
  dungeon openings rank 1-5, deck choice, contract + checkpoint resume, results feed gold, news
  and feelings; unclaimed openings go to NPCs. Headless: deployed, dungeon opened at the card's
  rank with the Priest deck, exited, result applied; End week locked underground; zero errors.
- Not done (not asked): companions, loot, XP in the experiment; wiring any of this into the main overworld.

## 2026-10-25 — one population (Robert: "Build all facets" → "One population")

- The experiment is now the full main game plus `src/experiment/one-population.js`: the game's
  people and guilds are the sim's; the sim owns life/death, rank, money, guild membership,
  feelings, crime, schemes, the labor market; the game keeps class/level/items, recruiting,
  companions, dungeons, contracts, XP, Chronicle, campaign. The standalone bulletin page is removed.
- New in the game: Bulletin screen, the turn's bulletin on World, "What people say about them" +
  Back them on profiles, Your stakes. Expeditions, companion deaths, recruiting, releases, gifts,
  world-event deaths and expired openings all become traced stories.
- Tests: sim suite rewritten for the host API; all suites pass except `enemy-cards`, which fails
  about 1 run in 4 on this branch and on #56 alike (random; untouched here; not fixed, not asked).
- Headless (`tools/playtest-harness/personality-experiment.py`): recruit, gift, release, real
  expedition with the party, stake, game/sim agreement, reload, new run, 52-turn soak: all pass,
  zero page errors; End Turn ~0.5 s headless vs ~0.35 s for the main build; save ~1 MB/year.
