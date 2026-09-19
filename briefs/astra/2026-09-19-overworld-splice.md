# Astra brief — splice the overworld module into the playable build (2026-09-19)

From Muse. Robert's word: **code it in.** This is now your active batch,
ahead of the lane-live queue (`briefs/astra/2026-09-19-lane-live.md` —
Batches 1–3 queue behind this).

## What you're wiring

`work/claude/overworld-2026-09-18/adventurers.js` — the headless overworld
sim (slices 1–3, landed on main via PR #15). It already exposes itself as
`window.OW` in a browser. Read `README.md`, `DONE.md`, and `ESCALATION.md`
in that directory first; they are the spec.

Key contract points:

- **Caller-resolved, never auto-fire.** Flashpoints prime but do nothing
  until the game layer calls a resolver: `vendettaStrike(state, id, ctx)`,
  `devotionAct(state, id, ctx)`, `exposeWarning(state, id, ctx)`,
  `attachmentDemand(state, id, ctx)`. Same `(state, id, ctx)` shape as the
  existing `assassinate`. What a resolution *costs* Brutus is the caller's
  call — the module deliberately leaves that open.
- **Reads for the UI:** `stance(state, partyId)` → loyal / fond / wary /
  hostile / cold / indifferent (not a ladder — display as-is, never as
  progress bars or meters). `describeStance(state, partyId)` → the one-liner
  ("Ysolde — cold: 'You turned us back.'"). `Ledger.salient(from, to)` →
  the one event to show.
- **The tick:** `advanceWave(state, ticks, opts)` = runWave + rivalry pass +
  gossip pass + heat update. `runWave` alone is the old behaviour; use
  `advanceWave` wherever the world should keep spinning.
- **Do not fork the module.** It is Claude's file. Wire callers only. If the
  module needs a change, flag it in your change log instead of editing it.

## Baseline

Work on a copy of `builds/brutus-1_0_a0mk-kavi-balanced2.html`
(SHA-256 `e9ff9c1052b7af3544985d7b38ef681f639f3e82921d43b9386506aa5d0df1f0`).
Never edit the original.

## Batch S1 — module in the build, state lifecycle (first PR, 5 items)

1. Embed `adventurers.js` in the build so `window.OW` is available at runtime.
2. New game creates `OW.newState()`; the OW state is part of the save blob
   and survives save/load intact (heat, ledger, flashpoints, gossip taint).
3. Hook `OW.advanceWave` to expedition return (or the overworld turn
   boundary — pick one, say which, flag the alternative).
4. Overworld meetings route through `OW.encounter(state, partyId, verb)` with
   the verb the player actually chose (aid / ignore / exploit / obstruct —
   map to whatever the build's meeting UI offers; flag gaps).
5. Harness test: multi-turn scripted run proving heat ticks, gossip taints a
   first meeting, rivalry fires, and a flashpoint primes. Report the numbers.

## Batch S2 — what Brutus can SEE (second PR, 3 items)

1. Roster/guild UI shows `describeStance()` for every met party — the stance
   word plus the salient event line. No meters, no numbers, no ladders.
2. Gossip-tainted parties (met never, heard of him) show their secondhand
   impression distinctly from firsthand stances.
3. Unmet, untainted parties show nothing — no spoiler reads.

## Batch S3 — flashpoint resolution prompts (third PR, 4 items)

1. **Vendetta:** when a primed vendetta fires, prompt the defense choice
   (undefended / defended / defended-lethal). Say what each costs Brutus in
   the prompt; log the outcome.
2. **Devotion:** resolve with `ctx.danger` honestly set from real game state
   (is Brutus actually at risk?). A pledge writes its permanent row; a
   sacrifice kills — both get Chronicle entries.
3. **ExposeWarning:** auto-resolves on prime (it is a broadcast, not a
   choice); log who got warned.
4. **AttachmentDemand:** grant/refuse prompt. Granted feeds (they'll be
   back); refused sours toward hostile — show that consequence in the UI.

## Judgment calls you will have to make (flag each in the change log)

- Where exactly the wave tick fires in the turn flow.
- What counts as `ctx.danger` / `ctx.defended` / `ctx.lethal` in real game
  terms.
- What a landed vendetta costs Brutus (the module leaves this open).
- Anything the build's overworld UI cannot currently surface — name the
  missing surface rather than silently dropping the read.

## Verification and handoff

- Batching rule holds: one PR per batch, branch from current main
  (`astra/overworld-splice-1`, …), one merge verified before the next.
- You cannot visually playtest the dungeon (no WebGL) — verify with your
  runtime harness and say what it covered. Muse visual-playtests the exact
  delivered file before anything merges.
- Output per batch: `work/astra/overworld-splice-N/` with the changed build,
  change log, and `DONE.md`. Playtest notes ordered by player impact.
