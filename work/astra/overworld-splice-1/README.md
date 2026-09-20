# Astra S1 — overworld splice

Branch: `astra/overworld-splice-1`
Base: `main` at `41799b4b6d1aac8af8de60db58928c37fc776827`

This folder is the durable home for the S1 playable-build reconstruction.

## S1 scope

- Embed Claude's `window.OW` overworld module in a copy of the accepted build.
- Create and persist OW state through New Run and save/load.
- Advance the overworld simulation once at the selected turn boundary.
- Route the existing meeting surface through the player's chosen verb.
- Add a harness proving lifecycle behavior, gossip, rivalry, heat, and flashpoints.
- Preserve the earlier character-to-character, Sims-esque relationship logic as the meaning layer behind those events.

## Acceptance boundary

Runtime and DOM checks cover the exact delivered HTML. Visual dungeon/WebGL review remains a Muse/Kavi gate.

See `CHARACTER-SIM-LAYER.md` for the relationship-layer bridge, and `CHANGELOG.md` and `DONE.md` for implementation status and verification results.
