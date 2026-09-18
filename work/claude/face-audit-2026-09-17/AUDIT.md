# Face audit: the 11 Priest faces on main (2026-09-17)

This checks each face against `docs/card-guidelines/README.md` §9–10: the
colour grade, the one-second read, the thumbnail read and a greyscale
pass. Categories and deck status come from the 2026-09-17 decks
(`work/claude/card-balance-2026-09-16/build.py`).

**Method.**
- **Colour:** I measured the hue of every bright, saturated pixel (the
  effect light) on each face.
- **Thumbnail:** the share of bright pixels at 80×120.
- **Greyscale:** the value spread between the 5th and 95th percentiles
  (0–255).
- **Readability:** I looked at every face at hand size and in greyscale.

## Headline

- **All 11 are graded gold.** Between 61% and 96% of each face's effect
  light sits in the gold band, and there's no measurable green, blue or
  violet on any of them. That's expected, since they predate the colour
  language, but it means today every card reads as "buff".
- **Five faces have baked-in frames:** Smite, Steady Hands, Sanctuary Step
  (parchment borders, edge brightness ~87 against ~30 on full-bleed
  faces), Last Rite (ornate brown frame) and Cleave (thin border). All five
  need a full-bleed re-crop so they sit in the UI frame like the rest.
- **The one-second read is good on 9 of 11.** Composition is not the
  problem; the colour is. Most of these need a re-light, not a redraw.
- **Last Rite is the darkest face in the set.** It has 2.8% bright pixels at
  thumbnail size and a greyscale spread of 93, against 122–210 for the
  others. At hand size it reads as a dark rectangle.
- **None of these show Brutus, and that's correct.** The figure is a
  slim, dark-haired, hooded young priest. Robert ruled on 2026-09-17 that
  class card faces show a class figure, not Brutus ("Latter. Grok already
  privy"; `canon/decisions-2026-09-17-faces.md`).

## Per face

Priority follows default-deck copies.

| Face | Category · deck | Grade now → target | One-second read | Thumbnail / greyscale | Frame | Verdict |
|---|---|---|---|---|---|---|
| **Candle Prayer** | heal · ×3 | gold → **verdigris** | ✓ candle plus a healing hand on a wound | 7.5% / 126, soft | full-bleed | **Re-light.** Make the healing glow on the wound verdigris and brighter. The candle flame can stay warm as the single ember accent (hybrid rule). |
| **Quick Strike** | offense · ×3 | gold → **ember oxblood** | ✓ punch with a spark burst | 10.4% / 151 | full-bleed | **Re-light.** Recolour the impact sparks only. |
| **Smite** | offense · ×3 | gold → **ember oxblood** | ✓ light-blade strike | 23.3% / 161 | **baked parchment border** | **Re-crop + re-light.** Keep a hot core in red-orange; pure white is reserved for finishers. |
| **Cleave** | offense · ×3 | gold → **ember oxblood** | ✓ arc slash | 8.6% / 139 | **thin baked border** | **Re-crop + re-light** the arc. |
| **Dust in the Eyes** | debuff · ×2 | gold → **nightshade** | ✓ light sprayed into a snarling face | 6.4% / 129 | full-bleed | **Re-light.** Violet spray; pull the warm background toward cold ink so the curse owns the violet. |
| **Radiant Glare** | debuff · ×2 | gold → **nightshade** | ✓ blinding flash over a crowd, the strongest face in the set | 12.3% / 210 | full-bleed | **Re-light.** A pale-violet core (around `#E9DAFF`) with a nightshade halo keeps the "blinding" read without using the finisher's white. |
| **Bulwark Slam** | defense (Brutus signature) · ×1 | gold → **tempered steel** | ~ reads as a priest holding a huge tome or shield slab: defense yes, "slam" no | 10.1% / 148 | full-bleed | **Re-light**, and on the next pass consider a pose that shows the braced plant-and-slam. |
| **Last Rite** | heal (showpiece) · ×1 | gold → **verdigris** at showpiece scale | ✓ holding a fallen ally with a small glow | **2.8% / 93, fails thumbnail** | **baked ornate frame** | **Re-crop + re-light, bigger light.** The save needs to be the brightest thing on the card. |
| **Steady Hands** | buff · ×1 | gold → **old brass** (already on target) | ✓ glowing hands | 27.0% / 174 | **baked parchment border** | **Re-crop only.** Its gold is correct for a buff. |
| **BlazeWhirl** | offense (Fire-weapon signature) · gear | gold → **ember oxblood** | ✓ fire spin | 9.1% / 142 | full-bleed | **Re-light.** Lower priority, since it's no longer in the class deck. |
| **Sanctuary Step** | defense · pool | gold → **tempered steel** | ✗ a figure stepping over a glyph circle; neither the move nor the protection reads | 8.4% / 122 | **baked parchment border** | **Redraw candidate, lowest priority** (pool card). Show the ally pulled clear behind a steel ward. |

## For Grok (G4), in order

1. Re-light Candle Prayer, Quick Strike and Dust in the Eyes.
2. Re-crop and re-light Smite and Cleave.
3. Re-light Radiant Glare and Bulwark Slam.
4. Re-crop and re-light Last Rite, with bigger light.
5. Re-crop Steady Hands.
6. Re-light BlazeWhirl.
7. Redraw Sanctuary Step last.

The figure question is settled (class figure), so redraws can go ahead.

**Folded into this pass:** the 22 older flagged faces. Grok re-lights each
to its category grade, re-crops any baked frame, and checks it against
§10. There's no separate brief.

For category and rarity readability without garish colour (a UI glyph,
and metal finishes for rarity), see `docs/card-guidelines/readability.md`.
