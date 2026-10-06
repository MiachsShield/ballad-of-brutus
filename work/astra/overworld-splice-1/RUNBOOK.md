# S1 runbook and checkpoint — 2026-09-20

Branch: `astra/overworld-splice-1`. Status: playable candidate implemented; visual acceptance pending. Do not merge or start S2 before S1 review.

## Approach and delivered work

Reuse Claude's adventurer simulation without forking it. Compose the accepted build with small world/dungeon adapters. Preserve the original build and its existing character drama, economy and expedition lifecycle. This is the first playable party-interaction slice, not a completed Sims-like character system.

- `world-integration.js`: real save/load and New Run binding, one simulation wave per successful End Turn, encounter routing and persistent outcomes.
- `dungeon-integration.js`: safe-room Talk prompt, paused meeting dialog, aid/ignore/exploit/obstruct, close-without-effect and duplicate protection.
- `compose-s1.js`: shared exact-build transform with unique insertion anchors.
- `build-s1.cjs`: reproducible standalone HTML builder.
- `builds/brutus-astra-s1.html`: HTTP launcher composing the same candidate from repository sources, avoiding another committed 10 MB copy of identical assets.
- `ow-bridge.js`: lazy initialization fix; operation replay restores the seeded simulation.

## Run

From repository root, serve the repository with `python -m http.server 8000`, then open `http://localhost:8000/builds/brutus-astra-s1.html`. The launcher needs HTTP localhost or HTTPS, not file://.

To generate a standalone candidate and verify from repository root:

```bash
node work/astra/overworld-splice-1/build-s1.cjs
node work/astra/overworld-splice-1/integration.test.cjs builds/brutus-astra-s1-standalone.html
node work/astra/overworld-splice-1/ow-bridge.test.js
```

Baseline SHA256: `e9ff9c1052b7af3544985d7b38ef681f639f3e82921d43b9386506aa5d0df1f0`.
Generated candidate (from committed sources, 2026-09-23): 10,342,511 bytes; SHA256 `5003c97fd7cb1f4d2db812132b1491d53240987dbb57f3fcae889a7b67af2519`. (The earlier `865909de…` hash did not reproduce from the committed files.)

## Verification and limits

Passed Node adapter tests: successful/blocked turn gates, four encounter verbs, duplicates, save/load, New Run, exact generated outer/iframe script syntax, and dungeon Talk/pause behavior using a DOM/engine test double. Passed existing deterministic 700-wave simulation test: 556 ledger rows, 14 gossip passes, 692 clashes, 66 flashpoints, 4,201 replayed operations.

These are not browser or full-engine gameplay tests. The available browser rejected localhost preview (`ERR_BLOCKED_BY_CLIENT`); no visual/WebGL acceptance is claimed. Existing failed-start refund logic was preserved but not runtime-tested. Existing saves deliberately do not save during an active expedition; new outcomes become durable at the next permitted world save. Default population is eight parties, with a ten-unit wave per successful world turn. Flashpoints are not automatically resolved; that remains later scope. Replay saves depend on the simulation version and will need migration if its rules change.

## Exact stopping point / resume here

**2026-09-23:** browser/WebGL review done in headless Chromium — every item below passed except a human visual pass; see DONE.md. Next: Muse's eyes-on playtest, then merge S1. Today's E1 economy brief stacks on this branch.


Implementation and automated checks complete. Next: run the launcher in a supported browser, verify New Run → cleared-room Talk → each verb → return → End Turn → reload, plus closing a dialog without choosing, combat gating, pause/resume and failed dungeon initialization refunds. Check existing saves migrate and returning/restarting does not duplicate consequences. Obtain visual dungeon/WebGL review, fix findings in this branch, then merge S1 before S2. Do not rebuild the adapter or repeat broad repository discovery.

Keep this checkpoint updated after each meaningful batch; do not rely on predicting a usage-limit warning.
