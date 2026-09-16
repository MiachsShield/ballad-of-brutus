# Grok playtest — 2026-09-15

Build: `builds/brutus-1_0_a0mk-kavi-merged.html`
SHA-256 `84f46127a3a26add85629c97b6229b161c1623e46d0159e1580ca670e71b3ca2`

Played as a player in a local browser. **Not 6–8 overworld turns.** Stuck on Turn 1.

## Played
- Overworld Turn 1, 250k g, Brutus Lv22 / Ember Lv18 / Wren Lv16
- Deployed The Gilded Sepulchre, Priest deck
- One dungeon room (B1F room 0), first-contact Skulker at ~1.0m
- Left the delve mid-run
- Interviewed Nessa Rook through question 5 of 6; dialog stuck
- Tabs: World, People, Your guild. No End turn.

## Art-lane (highest impact first)
1. In-combat cards have **no faces** — title + cost + wind-up only. One-second readability test cannot run. PR #3 faces are not in the live hand.
2. Shipped Brutus is **not** the locked spec. Sidebar is dark-haired/slim. Deploy equipment is a Shortsword.
3. Tone is grim illustration + admin text, not action-comedy.
4. First-contact Skulker fills the frame at 1.0m.

## Play findings
1. Interview has no abort. Nessa went `cold`; Continue stopped at 5/6.
2. Hold-fire text does not save the first shot. Allies opened fire; my Priest damage cards became NO VALID TARGET. Energy stayed 20/20.
3. Kill log mixed Brute and Skulker in the same fight. I saw one Skulker model.
4. Deploy label Team (2/2) lists three people.
5. Delve freezes the world turn, but interviews still spend the last action — can soft-lock both.
6. No on-screen dungeon controls.

## Delights
- Deploy → Priest deck → descend is clean.
- Cards seen: Sanctuary Step 3, BlazeWhirl 5 / 12 dmg, Sacrament of Nerve 2, Radiant Glare 4 / 8 dmg.
- Ember/Wren writing is the closest thing to action-comedy in the build.
- 3D room, torch, minimap, HUNTING tracker work.

## Not played
Turns 2–8, auctions, wars, tribute, market, a fight where I land a Priest card, Second Wind, card-face readability.
