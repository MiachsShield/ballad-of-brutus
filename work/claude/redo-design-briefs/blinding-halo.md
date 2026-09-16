# Redo brief — Blinding Halo

- **Name:** Blinding Halo
- **Class:** Priest
- **Energy cost / rules text:** Not canon. In the shipped build this exists
  only as an overworld flavor trait: `tag:"blind", val:0.16, desc:"Light
  that makes swings guess"` — no combat card, no cost. The only numbers
  anywhere are my own audit-design row (`brutus-class-cards-balance.md`,
  reversible design, not canon): medium tier, cost 5, "Dmg 6 AoE + blind
  1s, hits multiple." Treat cost/dmg as provisional; only the name and the
  blind concept are load-bearing here.

## Readability failure (original face, `art/audit/faces/blinding-halo.jpg`)

Garbled baked-in text ("BLIDDESMAL SU 2D DIALO") — the ship-blocking part
of the failure. Secondary issue: the composition (priest facing a single
armored knight) doesn't suggest "hits multiple," since only one target is
shown.

## Art direction

- **Action:** a burst of light released directly at an enemy's face/eyes.
  The blind effect has to read on the *target* — recoil, a squinting or
  obscured face, sparks at eye-level — not just a glow held by the caster.
- **Crop:** per the visual guide's "C · Ability cards" rule ("crop
  aggressively around fist, target, and consequence") — caster's
  channeling hand/staff plus the enemy's upper body/head, light impact
  centered at eye-line. Not a symmetrical two-figure standoff.
- **Cost read:** medium tier (cost 5, not a signature) — a brief channel,
  not a world-ending flare. Keep the burst smaller than a heavy-tier
  signature's scale, per "stronger abilities must visually read as more
  expensive."
- **No baked text anywhere** — this is the exact original failure; it
  gets enforced explicitly, not left implicit.
- **AoE legibility (nice-to-have, not blocking):** neither the original
  nor the redo currently shows a second target catching the light. If
  "hits multiple" needs to read from the art at final integration, a
  second silhouette at the light's edge would close this gap.

## Visual-guide citations

- "Push toward: expressive hands and forearms; a readable action at
  thumbnail size."
- "Pull away from: carnival sparks" — the halo must read as a directed
  light weapon, not a decorative sparkle effect.
- Card-readability standard: effect must be visually clear from the art
  itself.

## Cross-check against Grok's redo (PR #3, `work/grok/critical-redos/faces/blinding-halo.jpg`)

Viewed directly: a priest-like figure channels bright light at a dark
armored figure who is recoiling; no baked text anywhere. This matches the
direction above. **Agree with Kavi's PASS verdict.** The one residual note
above (single- vs. multi-target read) is flagged for the eventual
art-integration pass, not a reason to send this back.

## Pass test

At card size, a viewer reads "light burst thrown at an enemy's eyes, they
flinch / can't see" in under a second, with zero legible or illegible text
baked into the image. **This face passes that test.**
