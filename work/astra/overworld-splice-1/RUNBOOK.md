# S1 runbook and stopping point

## Current batch

Batch: S1 integration seam
Branch: `astra/overworld-splice-1`
Base: current `main` at the time the branch was created

## Completed in this pass

1. Read the active overworld splice brief and Claude's current `adventurers.js` contract.
2. Implemented `ow-bridge.js`.
3. Implemented `ow-bridge.test.js`.
4. Ran syntax checks and the deterministic lifecycle harness.
5. Recorded the exact results in `DONE.md`.

## Verification command

From this folder:

```bash
node --check ow-bridge.js
BOB_OW_MODULE=../../claude/overworld-2026-09-18/adventurers.js node ow-bridge.test.js
```

The test uses the source module already present on the repository's `main` branch; it does not fork or edit Claude's module.

## Explicit stopping point

This pass stops after the bridge and harness are committed. The remaining work is deliberately separate:

- copy the accepted 10 MB build into this branch without modifying the original;
- add the bridge script after `window.OW` is available;
- connect the real build's save/load, End Turn, and meeting UI call sites;
- run exact-file browser checks;
- obtain Muse/Kavi visual dungeon/WebGL review.

No claim is made that the playable HTML has been changed yet. If work stops because of usage, the branch is left at this point and the next agent should begin with the unchecked items above.
