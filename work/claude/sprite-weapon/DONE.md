# DONE: 2D first-person fist sprite (2026-10-12)

Robert: keep 2D sprites (SMT, Street Fighter III: 3rd Strike); bodies extremely readable; smooth
movement; no visual noise. Approved: switch the dungeon weapon to a 2D sprite, and draft the
readability rules as a visual-guide proposal.

- `weapon2d-dungeon.js` replaces `buildWeaponView` and `poseWeapon`: a camera-attached flat plane
  with a canvas-drawn texture, unlit, always on top. Motion is 2D only.
- Drawn as Brutus's wrapped fist, not a sword: the binding guide locks him as a fistfighter whose
  near fist "owns the frame". One constant switches to a sword drawn to the same rules.
- First drawing failed its own readability test (cropped, read as a block); redrawn with a
  diagonal forearm and raised into frame, verified by screenshots.
- Placeholder art: to be replaced by real art made to the proposal's rules.
- Proposal: `art/visual-guide/proposals/2026-10-12-sprite-readability.md`.
- Open for Robert: approve or edit the proposal; fist or weapon in hand when a weapon is equipped;
  whether boss weapons should change what is drawn in hand.
