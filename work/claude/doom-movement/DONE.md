# DONE: Doom-style turning (2026-10-19)

Robert: "make it akin to Doom. It shouldn't be frustrating to fight a strafing enemy because of the
controls." Scope approved: movement feel. Not touched: card targeting, the manual-facing rule, enemy
and ally movement, combat numbers.

## What changed
`movement-dungeon.js` wraps `updateBrutus`. Brutus's turn rate was a fixed 145 deg/s, which is Doom's
SLOW turn. Doom has two speeds: a tap for fine aim, and a held turn that ramps to about double. Now a
full-deflection turn held past 0.10 s ramps over 0.15 s from 1x to 1.8x (145 -> 261 deg/s); release
drops straight back to 1x. Keyboard arrows and a fully pushed stick ramp; a half-tilted stick does not.
Stun and down: no ramp. Facing is still manual and persistent, nothing aims for you.

## Checked, not changed
- Wall sliding: already there (`tryMove` falls back to each axis; every sector edge is axis-aligned).
  Live test: a shallow run into the +x wall stopped at x 8.44 and slid the full length of the wall to the
  corner without catching; w+d into the corner ended at (8.37, 8.37); head-on stopped cleanly.
- Start/stop: already instant (no momentum), which is the snappy end of Doom.
- Strafe speed already equals forward speed (6.2); diagonal forward+strafe is 1.41x, as in Doom.

## Verified (exact built file, headless Chromium, training room, real key presses)
- Tap (~60 ms): 7.3 deg. Hold: 164, 242, then 261 deg/s from 0.3 s on. Release: no drift.
- Zero page errors. All suites PASS on the new CURRENT (unit test for the ramp is `doom-movement.test.cjs`).

## What I could not confirm
- The enemy code in this build has no strafing: monsters walk straight at their target (Skulker speed 3.8)
  and Muse prep added a personal-space push-back. What Muse saw as "strafing" is likely that push-back
  plus target switching to Ember or Wren when they are nearer. Not proven. If a Skulker still slips
  out of view after this, that is the next place to look (enemy side, not controls).
- Touch and mouse drag: the on-screen stick has forward/back and turn only, no strafe. Left as is.

## Next
Muse replays a Skulker fight and a full clear (warden to conquest, checkpoint resume, hidden chamber).
Branch `claude/doom-movement`.
