# DONE — claude/overworld-adventurers (slice 1)

**Agent:** Claude
**Date:** 2026-09-18
**Branch:** `claude/overworld-adventurers`
**Rulings implemented:** Robert, 2026-09-18 (this session)

## Task

Break down the overworld adventurer approach and implement the behaviour.
Robert chose: lands in the HTML prototype line, and a party **states its goal
up front** when met.

## What landed

1. `adventurers.js` — headless core. Party records, the sentiment ledger,
   four encounter verbs filtered through traits, the off-screen survival sim,
   wave + cull, and the assassination state check. Attaches as `window.OW` in
   a browser, `module.exports` under node.
2. `sim.js` — harness. `node sim.js` for one readable run; `--soak` for 300
   seeds with invariant assertions.
3. `README.md` — the model, the soak numbers, and what is deliberately absent.

## Verified

- `node sim.js` — all four verbs exercised, trait-filtered reactions differ as
  intended, knife kills a tier-3 survivor undefended and fails braced.
- `node sim.js --soak` (300 seeds) — invariants hold: the cull bites (38.4%
  wave-1 mortality), it does not wipe (a roster forms), survivors carry
  sentiments (63% of those who met Brutus), and the roster stays bounded
  (avg 5.2 after two waves, no cap imposed).
- Both files pass `node --check`.

## Not done — needs a call before anyone proceeds

- **Nothing is spliced into `builds/`.** The build is one ~10 MB HTML file;
  a `<script>` splice should be a deliberate edit by its owner, not a side
  effect of this PR. Say the word and it is a one-line change.
- No sentiment → behaviour feedback yet. Nothing reads `feeling()` to change
  how an NPC treats Brutus on a later meeting. This is the next slice and the
  point at which the ledger starts paying out.
- No encounter UI and no dungeon-event trigger.

## Next concrete step

Wire `feeling()` into a second meeting: a survivor with a permanent
`robbed-us` row should refuse aid, warn others, or open hostile. Small,
self-contained, and it tests whether the ledger reads well in play.

## Playtest note

Per the standing instruction: this slice has no playable surface — it changes
nothing in the delivered build, so there is nothing to playtest yet. The soak
harness is the stand-in, and its output is above. Once the encounter is wired
into a dungeon event, it gets a real play session before handoff.

## Batching

Four files, one system, nothing else bundled — per Robert's 2026-09-17 rule
(5 items per PR, one PR at a time).
