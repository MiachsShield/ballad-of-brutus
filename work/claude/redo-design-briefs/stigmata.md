# Redo brief — Stigmata

- **Name:** Stigmata
- **Class:** Priest
- **Energy cost / rules text:** Not canon. Shipped build only has the
  overworld flavor trait `tag:"def", val:1.15, desc:"Wounds that don't
  seem to slow them"` — no combat card, no cost. The only numbers anywhere
  are my own audit-design row (design, not canon): support tier, cost 3,
  "Self dmg 5, next heal +50% stronger." Treat as provisional; the
  self-cost-for-bigger-payoff shape is what the art needs to serve, not
  these exact numbers.

## Readability failure (original face, `art/audit/faces/stigmata.jpg`)

"No effect shown." The original is a static portrait — a bleeding priest
holding a staff in a church. It's thematically on-name (literal stigmata
wounds) but it's a portrait, not a transaction: nothing in the frame shows
*paying* a cost to get a *bigger* benefit. A viewer can name "priest,
hurt," not "spends own health to power up a heal."

## Art direction

- **Action:** show cause and effect in one frame. The wound opening/
  glowing is the cost; a healing gesture or outward warm light is the
  payoff. Both need to be visible together, not the wound alone.
- **Crop:** per "C · Ability cards," crop to torso/hands where the wound
  sits, with a clear secondary read (glow, outstretched hand) that reads
  as "healing," not just "hurt."
- **Cost read:** support tier, cost 3 — cheap. Keep the light effect
  modest; restraint matters here as much as showing the wound.
- **Tone:** dark-fantasy wound imagery is fine, but keep it inside the
  project's "pull away from Souls grit / oil-painting mood" note — grim,
  not gratuitous.

## Visual-guide citations

- "Render for recognition: large shape first, action second, costume
  third."
- Card-readability standard: effect must be visually clear from the art
  itself.

## Cross-check against Grok's redo (PR #3, `work/grok/critical-redos/faces/stigmata.jpg`)

Viewed directly: a young figure with glowing red wound-marks on both
palms and the chest, arm extended outward mid-stride — moving forward,
not stopped by the wound. Glowing wounds specifically on the palms is a
good echo of the stigmata concept itself (wounds in the hands), and the
still-advancing posture reads as "paying a cost without being stopped by
it," which is a reasonable visual analogue for cost-now/bigger-payoff-next.
**Agree with Kavi's PASS verdict** on the effect-legibility failure this
brief was scoped to fix.

One open note, not a blocker: the figure reads as a mage/rogue rather
than a Priest — no vestments, no clerical iconography. Priest-class
costume identity wasn't the stated failure here, so I'm flagging it as a
question for the Priest costume reference / visual guide rather than
sending this face back over it.

## Pass test

A viewer reads "this character is spending their own health to power up
something" in under a second — wound plus outward gesture together, not
a static bleeding portrait. **This face passes that test.**
