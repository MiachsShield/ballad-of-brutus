# Status screen — 2026-10-13 (Claude)

Robert: "Clicking on character should give status screen. There. Also make a proper status
screen." ("There" answers where Brutus's XP bar goes.)

## What it does (`status-world.js`)
- Clicking Brutus in the sidebar (now a button like his companions) opens his status screen.
- Clicking a companion anywhere (sidebar, guild card portrait or name, Inspect, People list)
  opens theirs. Everyone else still opens the public profile; a companion's public profile
  is one click away ("Public profile").
- Layout: portrait, name, class line, big level, XP bar with "N to Lv X" (or "Not getting any
  stronger" at the growth ceiling), chips (active/benched, ceiling, loyalty), then panels:
  - Brutus: In the dungeon (HP 100 + gear, Energy 20 + gear, deck, ATK/DEF % from gear, cards
    and effects from gear) and Equipment (six slots, rarity colours, stats, effects, cards).
  - Companions: In the dungeon (HP and Energy from class and level, the dungeon's own formula;
    class attack with damage, weight, energy, wind-up and recovery; what their abilities
    change), Abilities (with descriptions), Equipment, Standing (fame, reputation, affection,
    wage, market value, looks) with Bench/Activate and Public profile.
- Topbar reads "STATUS · The man himself." / "One of yours."; Your guild stays highlighted.

## Deck (`deck-state-dungeon.js` + Brutus's screen)
Robert: "I should see the deck, and used up cards greyed out."
- Brutus's status screen has a Deck panel: one tile per card copy with its illustration
  (`art/card-faces/<class>/<id>.jpg`, same art as the hand; Robert: "With illustrations"),
  name, weight and energy. A card without art shows its text only. Used tiles grey the art too.
- Between expeditions: the chosen deck (40 cards) plus any gear cards.
- During an expedition (press "View world", click Brutus): the live deck. Cards in hand are
  outlined gold ("In hand"); used cards (the discard pile) are greyed ("Used"). The line above
  gives draw pile / hand / used counts. Used cards come back when the draw pile runs out and the
  discard is reshuffled, or at a rest area, exactly as in the dungeon.
- The world reads the dungeon's deck directly through the shell (same page); no new messages.
- Checked live: 9 cards moved to discard → 9 greyed tiles, 4 in hand, 27 in the draw pile.

## Found while building it (for Robert)
Companion gear is not applied in the dungeon: only Brutus's loadout is sent. The screen says
so under the companion's equipment rather than showing numbers that would not hold.

## Playtest (exact file, headless Chrome, zero page errors)
Brutus from sidebar; Ember from sidebar; Wren from guild portrait; Ember from Inspect; Bench
stays on the status screen and updates the chip; Public profile opens the old page; a stranger
from People still opens the public profile. Screenshots checked at 1280 px.

## Tests
No new unit test (DOM screen; browser-checked). All ten suites PASS on the new CURRENT.
