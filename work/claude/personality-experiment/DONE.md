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
- Not done (not asked): wiring any of this into the main overworld.
