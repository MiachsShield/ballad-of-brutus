# S1 implementation handoff

Status: bridge and verification slice complete; playable HTML splice remains pending.

## What this pass implemented

- `ow-bridge.js`: deterministic adapter around the existing `window.OW` API.
- Replayable save/load: stores the seed and caller operations, then rebuilds the state to restore the seeded RNG position without serializing a closure.
- New Run reset.
- Encounter routing with the player's chosen verb.
- One-wave End Turn through `OW.advanceWave`.
- Idempotent message dispatch keyed by message id.
- Talk visibility gate: available only in a cleared room outside combat.
- Game-save embedding through `saveInto` / `loadFrom`.
- `ow-bridge.test.js`: deterministic lifecycle harness against Claude's current `adventurers.js` on `main`; the module was not forked or edited.

## Verification completed

- [x] `node --check ow-bridge.js`
- [x] `node --check ow-bridge.test.js`
- [x] New Run creates clean state
- [x] Save/load restores state and bridge operations
- [x] End Turn advances exactly one OW wave
- [x] Meeting verb reaches `OW.encounter`
- [x] Duplicate messages are idempotent
- [x] Talk is hidden during combat and uncleared rooms
- [x] 700-wave deterministic lifecycle harness
- [x] Partial-contact harness exercised 14 gossip passes, 692 rivalry clashes, and 66 flashpoints
- [x] Final replay restored 4,201 operations with matching state

## Exact harness result

```json
{
  "turns": 700,
  "roster": 8,
  "ledgerRows": 556,
  "gossipPasses": 14,
  "rivalClashes": 692,
  "flashpoints": 66,
  "savedOperations": 4201
}
```

## Remaining acceptance gates

- [ ] Copy the accepted 10 MB build into this branch without modifying the original.
- [ ] Add the bridge script after `window.OW` is available in the exact build.
- [ ] Connect the real build's save/load, End Turn, and meeting UI call sites.
- [ ] Verify resource refunds and any existing pause/resume UI contract in the exact build.
- [ ] Record the exact delivered HTML hash.
- [ ] Run exact-file browser checks.
- [ ] Obtain Muse/Kavi visual dungeon/WebGL review.

No claim is made that the playable HTML has been changed yet. The persistent stopping point and next actions are documented in `RUNBOOK.md`.
