# S1 change log

## 2026-09-20 — bridge and harness implementation

- Implemented `ow-bridge.js` around the existing Claude overworld module.
- Used operation replay for save/load so the seeded RNG position is reconstructed without serializing the module's RNG closure.
- Added New Run, End Turn, encounter routing, idempotent message handling, Talk gating, and game-save embedding.
- Added `ow-bridge.test.js` and verified a 700-wave partial-contact lifecycle.
- Added `RUNBOOK.md` with the exact verification command and explicit stopping point.

Verified result: 14 gossip passes, 692 rivalry clashes, 66 flashpoints, 4,201 saved operations, and matching post-reload state.

## 2026-09-20 — character simulation carried forward

- Added `CHARACTER-SIM-LAYER.md` to preserve the earlier Sims-esque character-to-character design.
- Mapped Notice → Curiosity → Attachment → Memory onto the existing ledger, salient events, stance, gossip, rivalry, heat, flashpoints, and caller-resolved consequences.
- Kept relationship data world-owned and persistent through New Run, save/load, and the world tick.
- Explicitly excluded hidden romance meters, generic relationship spreadsheets, and passive character-bio systems.

## 2026-09-20 — folder recovery

- Created persistent branch `astra/overworld-splice-1` from current `main`.
- Created this work folder before resuming implementation.
- The previous S1 candidate was recorded as locally committed but was not present in the visible repository, so this batch is being rebuilt and verified against the current main baseline.

## Next bounded batch

- Obtain the exact accepted build in the working checkout.
- Splice the bridge into that copy only.
- Add the real UI/save/end-turn call sites.
- Re-run the harness and exact-file checks.
- Stop and document the build hash and remaining visual gate before beginning S2.
