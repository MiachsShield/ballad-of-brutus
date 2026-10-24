# People-layer cleanup — DONE (Claude, 2026-10-23)

Robert, 2026-10-23: "clean up the code first and ensure proper documentation" before
consolidating generic adventurers and the populace. Scope he picked: people layer only,
no gameplay change.

## Changed
- `PEOPLE.md` (new): the map of every people system, the End Turn order, where each rule lives.
- `work/claude/status-screen/status-world.js`: removed `ST_PERSONA`, an unused table of personality labels (labels were dropped 2026-10-13; personality is read from dialogue).
- `work/claude/voice-world/voice-world.js`: removed unused `vwUp` (all-caps helper); header comment now says sentence case.
- Pointers to `PEOPLE.md` in `README.md`, `work/claude/overworld-2026-09-18/README.md`, `work/astra/overworld-splice-1/CHARACTER-SIM-LAYER.md` (cross-lane, doc only).
- Rebuilt `builds/CURRENT-brutus-astra-e1-standalone.html`.

## Verified (exact file)
- Rebuilding from main reproduces the committed CURRENT byte for byte; the new build differs from it only by the removed lines.
- All 14 suites PASS (S1 integration run against the CURRENT file).
- Headless Chromium, seeded RNG and clock: 12 End Turns on the old and new build give identical results every turn (202 alive, 176 people with drives, OW wave 12, same Chronicle headlines); People screen renders; zero page errors.

## Not touched (needs Robert)
- Dead code in the pinned baseline (`if(false&&…)` trend block, `tierIdx`, `rarityOrder`, duplicate `abilityEffect`): editing it changes the pin in four files.
- NPC guild payroll: superseded as a direction by the 2026-10-06 ruling, but removing it changes the guild economy.
- The consolidation itself.

## Follow-up the same day: whole-codebase consolidation (Robert: "consolidate the files, trim unneeded and dead code, documentation for ease of access")
- Every source file moved to `src/` (grouped by system), tests to `tests/`, tools to `tools/`. One build script (`build.cjs`, holds the load order) and one test runner (`tests/run-all.cjs`). Moving alone produced a byte-identical build.
- Dead code removed from the baseline: the `if(false)` trend block, `TREND_PERIOD`, `tierIdx`, `rarityOrder`, a shadowed `abilityEffect`; dungeon `healTarget`, `allyProf`, `inCardCombat`. Pin updated in `build.cjs`.
- Removed superseded files (in git history): five old builds, the S1 standalone, two launcher pages, the S1/E1 build scripts, `snapshots/brutus-2-7-1.html`. Playable build renamed `builds/CURRENT-brutus.html`.
- Docs: new `README.md`, `docs/code-map.md`, `docs/people.md` (moved from here), `docs/build-history.md`, `work/README.md`; `AGENTS.md` points to the layout.
- Verified: 14/14 suites; seeded 12-turn overworld identical to the old build; training-room fight in headless Chromium; zero page errors.
- Payroll unchanged: a financial-system design goes to Robert first.
