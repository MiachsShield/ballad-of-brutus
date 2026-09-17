# Card readability without garish colour (2026-09-17)

Robert, on how strongly to colour-code: *"Honestly stumped. Ofc players
want to easily tell the card. But garish colors make it look ugly."* The
same tension applies to rarity colours. This is Claude's call under the
card-balance lane; Robert keeps the veto.

Mockup: `readability.svg` in this folder.

## The answer: don't make colour do all the work

Colour is only one of four cues. If the other three carry the read,
colour can stay quiet and beautiful.

| Cue | Carries | Where | Garish risk |
|---|---|---|---|
| **1. Glyph** | category, instantly | small bone-on-ink icon, top corner of the card chrome | none: no colour at all |
| **2. Shape language** | category, at a glance | the art (§9: hard outward = offense, shells = defense, rising motes = heal) | none |
| **3. Effect light** | category, emotionally | the art's grade (§9, unchanged) | low: lives inside the painting |
| **4. Frame metal** | rarity (where rarity exists) | frame finish: iron / bronze / silver / blackened gilt | low: materials, not hues |

The glyph is what fixes "players want to easily tell the card". It works
for colour-blind players, in greyscale, at thumbnail size, and before
anyone has learned the colour language. Once it's there, the colour in the
art no longer has to shout, so §9's "tint the light, not the border" rule
can stay as strict as it is.

## 1. Category glyphs

One glyph per `category`, drawn in bone (`#E8DFCF`) inside a thin
soot-violet ring on ink. Same size and position on every card; never
tinted.

| Category | Glyph |
|---|---|
| Offense | blade (diagonal, point up-right) |
| Defense | shield |
| Heal | drop with a small cross |
| Buff | two up chevrons |
| Debuff | two down chevrons with a drip |
| Finisher | four-point star, filled, with a thicker ring |

Rules:
- The glyph sits in the chrome (the UI layer), not baked into the art, so
  Grok's faces stay text- and icon-free (§9 Don'ts still apply).
- Hybrid cards show only their dominant `category` glyph.
- Minimum 20px on mobile; at the smallest hand size keep the ring and drop
  interior detail.
- No colour on the glyph, ever. If a playtest shows people still can't
  tell cards apart, the next step is bigger art light, not a coloured
  glyph.

Kavi: this adds one rule to §9's "the frame, the card chrome and the UI
stay neutral and identical for every card": the glyph is the only element
that differs, and it differs by shape only.

## 2. Rarity: metal, not hue

Today's overworld rarity chips use green / blue / red
(`--r-uncommon/--r-rare/--r-unique`), which collide with heal / defense /
offense. Move rarity to material finish:

| Rarity | Finish | Read |
|---|---|---|
| Common | **iron**: matte grey, no shine | plain |
| Uncommon | **bronze**: warm brown, soft sheen | a little special |
| Rare | **silver**: cool, bright edge highlight | clearly special |
| Unique | **blackened gilt**: dark metal with a slow light sweep every few seconds | the one you brag about |

Why this works:
- Players already read metal as rank (medals, trophies, loot tiers), so
  it needs no teaching.
- Metal is mostly *value and sheen*. It doesn't paint the card a hue, so
  it can't be mistaken for a category.
- **Blackened gilt, not bright gold**, so unique doesn't read as buff
  (Old Brass effect light). The motion sweep does the heavy lifting.

Scope:
- Class decks have no rarity, so **class card frames stay neutral**
  (the §9 rule).
- The metal finish applies wherever rarity already exists: overworld
  ability and gear chips, and gear signature cards, which inherit their
  item's metal.
- It's a UI change on Kavi's side, and it can wait until after K15.

## 3. Consequences for art (Grok)

- Nothing new for faces: keep §9 grades and shape language. The glyph is
  UI.
- **The 22 older flagged faces go into the G4 re-light pass** instead of
  a separate brief. Each one gets re-lit to its category grade, re-cropped
  full-bleed if it has a baked frame, and checked against §10. This
  replaces "Kavi uploads the old list". If Kavi still has the list, it
  becomes the order for that pass, not a separate job.
- **Card faces show a class figure, not Brutus** (Robert, 2026-09-17:
  "Latter. Grok already privy"). The current hooded Priest figure is
  correct, and a Warrior figure goes on Warrior faces.

## 4. Test (add to §10)

5. **Glyph read:** with the art hidden, name the category from the glyph
   alone at the smallest hand size.
6. **Rarity read:** in greyscale, order four chips common → unique by
   finish alone.
