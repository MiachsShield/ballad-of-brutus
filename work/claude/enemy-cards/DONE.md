# Enemy cards and 40-card decks (Issue #13, lane-live Batch 2) - 2026-10-20

Cross-lane: Claude doing the Astra and Grok non-art queue (Robert, 2026-10-20: "Grok and astra lanes are dead atm. Please do all lanes outside of art/music assets").

## What shipped
- Every enemy with a deck now plays CARDS: 40-card enemy-only decks, a hand of 3, cost paid from its own energy bar, new card drawn after each play. Deck tables: `DECKS.md`.
- Live decks: Skulker, Brute, Stalker, and the Overseer (dungeon warden). Ready but cannot spawn until sprites exist (art lane): Zombie, Cultist, Dire Hound.
- Grazer keeps the old attack pick (herbivore, no deck).
- Card names show in the log ("Brute readies Plant Feet.", "Skulker's Gutter Jab goes wide.") for medium and heavy plays.
- Riders: drain N (energy off the target), shove N (knockback), brace (the existing Resolute stance as a card).
- An enemy that cannot afford a card waits a beat and regenerates; it can never stun itself with its own plays. Enraged enemies play their hardest card, whatever it costs.
- Rank and conquest damage scaling still applies (the module sits under those wrappers).

## Rules kept
- Enemy-only cards, 40 per deck, max 3 copies, one finisher per deck, no revive effects, no elemental names, no magic system (a Cultist's spells are cards).
- Energy: the brief says the same 20-point bar as Brutus. Enemy pools in the engine are 60-160, so card costs are on Brutus's scale (2/5/9, finisher +2) multiplied by the enemy's bar over 20.

## Playtest (exact delivered build, training room, headless)
- All four deck kinds spawned and fought for 25 s: hands of 3, 40 cards conserved, card names in the log, no page errors.
- Brutus then fought a Brute and a Skulker for 40 s with real damage: both defeated, no errors; the Brute played Plant Feet and stunned itself on the energy cost as the existing Resolute design intends.
- Not covered: feel at normal difficulty over a full dungeon; Muse should check that heavy-card pacing reads fairly.

## Open items for Robert
- Cultist ranged play needs an approach rule (enemies close to melee before striking); not built.
- Deck contents are first drafts; names, numbers and flavour text are placeholders for his review.
- The bestiary re-skin (Skulker to Skeleton etc.) is not applied; decks are keyed to the current kind ids.

Tests: `node work/claude/enemy-cards/enemy-cards.test.cjs` (decks, hand cycling, cost, waiting, enrage, riders, fallback). All suites pass.
