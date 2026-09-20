# S1 implementation status

Playable candidate integration is implemented on `astra/overworld-splice-1`; not yet visually accepted or merged.

World turn/save/load/New Run bindings and safe-room four-verb encounters now compose into the accepted game. Original build and Claude's source module remain unchanged.

Automated integration checks and the 700-wave deterministic harness pass. Tests use engine/DOM doubles plus exact generated script compilation, not a complete browser playthrough. Browser preview was blocked; visual/WebGL checks and failed-start refund regression remain required.

See `RUNBOOK.md` for run commands, exact artifact hashes, known limitations and the next action. The previous adapter-only stopping point is superseded.
