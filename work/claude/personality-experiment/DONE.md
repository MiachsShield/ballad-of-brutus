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
