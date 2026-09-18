# Card readability: category symbol + rarity gems (2026-09-17)

Robert's direction, 2026-09-17:

> Top symbol on card overlay. Red sword, blue shield etc. Behind name of
> card, over art.
>
> Rarity should be apparent but not by make; there can be extremely
> valuable bronze gear and such. Use embedded gems or something.

Mockup: `readability.svg` in this folder.

This supersedes the metal-finish proposal and amends §9's Don'ts (see §4
below).

## 1. The category symbol

A coloured symbol sits at the **top of the card overlay, behind the card
name, over the art**. It is the card's fastest read: category is named
before the player has looked at the painting.

| Category | Symbol | Colour |
|---|---|---|
| Offense | **sword**, point up | Ember Oxblood `#E0553A` |
| Defense | **shield** | Tempered Steel `#7FA8D6` |
| Heal | **drop with a cross** | Verdigris `#8FD1A0` |
| Buff | **two up chevrons** | Old Brass `#F0C46A` |
| Debuff | **two down chevrons with a drip** | Nightshade `#B585E6` |
| Finisher | **four-point star, solid** | Incandescent `#FFF4DC` |

Placement and treatment:
- Centred at the top of the overlay. The name renders **on top of** the
  symbol, so the symbol shows above, below and to the sides of the text.
- Height about 2× the name's cap height; it is meant to be seen, not
  hidden.
- Every symbol carries a thick ink outline (`#0B0910`) so it holds against
  bright or busy art, and the top of the art carries a soft ink scrim
  (top-down, ~90% to 0% over the name band) so the name stays legible.
- The name stays bone `#F4ECE0` with an ink outline.
- Symbol colour is fixed per category and never tinted by rarity, class or
  element.
- Minimum 28px tall on mobile. At thumbnail size the silhouettes stay
  distinct (see the mockup's bottom row), so colour-blind players read it
  by shape.

**This is the only saturated colour on the card chrome.** Because the
symbol now carries the category, the art's grade (§9) does not have to
shout: keep the effect light disciplined and beautiful. That's the answer
to "players want to easily tell the card, but garish colours look ugly" —
one small loud symbol, a quiet painting.

The symbol lives in the UI layer, not in the art. Grok's faces stay free
of text and icons.

## 2. Rarity: embedded gems

Rarity is **not** the frame's material. Robert: there can be extremely
valuable bronze gear. An iron-framed card can be unique, and a gilded one
common.

Gems are set into the frame, bottom centre:

| Rarity | Gems |
|---|---|
| Common | one **dull stone**, uncut, matte |
| Uncommon | one **cut gem**, polished, small |
| Rare | **two cut gems** |
| Unique | **three gems**, the centre one larger, with a slow shimmer sweep |

- Gems are **opal/moonstone**: pale, iridescent, cool. They shift between
  white, cold blue and pale violet as they catch light, so they never read
  as one of the six category colours.
- Rarity reads by **count, cut and brilliance** at a glance, and by the
  shimmer for unique.
- The socket is the same size on every card; only what's in it changes.
- Gear keeps its own frame material for flavour (iron, bronze, silver,
  gilt as the item deserves) — that's art, not information.

This also frees the overworld rarity chips from green / blue / red
(`--r-uncommon/--r-rare/--r-unique`), which now mean heal / defense /
offense. Chips carry the same gem row.

## 3. What each cue carries

| Cue | Carries | Where |
|---|---|---|
| Coloured symbol | category, instantly | card overlay, behind the name |
| Symbol silhouette | category in greyscale and at thumbnail size | same |
| Shape language in the art | category, at a glance | the painting (§9) |
| Effect light | category, emotionally — kept quiet | the painting (§9) |
| Gems | rarity | frame, bottom centre |

## 4. Amendments to `docs/card-guidelines/README.md`

§9 **Don'ts** currently says "no coloured borders, frames, corner gems or
banners". Amend to:
- No coloured **borders, frames or banners**, and no colour washes over
  figures. Unchanged.
- **The category symbol is the exception**: one coloured symbol in the
  overlay, per §1 above.
- **Gems are the rarity carrier**, per §2 — set in the frame, never
  coloured by category.

§10 **Readability test**, add:
5. **Symbol read:** name the category from the symbol alone at the
   smallest hand size, and again in greyscale.
6. **Rarity read:** order four cards common → unique from the gems alone.

§9 **Heads-up for the UI** is resolved: rarity moves off green/blue/red to
gems.

## 5. For Grok

- No change to the faces themselves: §9 grades and shape language stand,
  and the light stays disciplined now that the symbol does the labelling.
- Card faces show a **class figure, not Brutus** (Robert, 2026-09-17).
- The 22 older flagged faces go into the G4 re-light pass; no separate
  brief.
- Leave the top ~25% of each face free of critical detail (faces, weapon
  points), since the symbol and name sit there.

## 6. For Kavi

- Symbol layer in the card overlay: fixed position and size, one of six
  shapes by `category`, with the ink outline and top scrim.
- Gem row in the frame: 1–3 gems by `rarity`, opal palette, shimmer on
  unique.
- Overworld ability and gear chips use the same gem row instead of the
  rarity colours.
- Not urgent: it comes after K13/K15.
