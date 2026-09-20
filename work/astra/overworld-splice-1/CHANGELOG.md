# S1 change log

## 2026-09-20 — character simulation carried forward

- Added `CHARACTER-SIM-LAYER.md` to preserve the earlier Sims-esque character-to-character design.
- Mapped Notice → Curiosity → Attachment → Memory onto the existing ledger, salient events, stance, gossip, rivalry, heat, flashpoints, and caller-resolved consequences.
- Kept relationship data world-owned and persistent through New Run, save/load, and the world tick.
- Explicitly excluded hidden romance meters, generic relationship spreadsheets, and passive character-bio systems.

## 2026-09-20 — folder recovery

- Created persistent branch `astra/overworld-splice-1` from current `main`.
- Created this work folder before resuming implementation.
- The previous S1 candidate was recorded as locally committed but was not present in the visible repository, so this batch will be rebuilt and verified against the current main baseline.

## Pending

- [ ] Copy the accepted build without modifying the original.
- [ ] Wire `window.OW`, state lifecycle, save/load, wave advancement, and meeting routing.
- [ ] Add and run the S1 harness.
- [ ] Add exact-file build, hash, and handoff details.
