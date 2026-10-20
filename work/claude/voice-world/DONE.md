# Overworld voices (2026-10-19)

Robert: "change overworld info to be coming from characters themselves. 'I CAN'T BELIEVE ' ' WAS KICKED OUT OF ' ' !!'"

- Chronicle dispatch cards now lead with a bystander's own line, in sentence case (caps used sparingly); the original facts sit under it as "The facts: ...".
- Speakers are people from the same guild or region as the subject when possible; their personality (Loyal, Cautious, Proud, Ambitious, Mercenary) picks how they approach you and the aside they close with.
- Speaker: an alive character who is not in the story, picked from the card id (stable between renders). With no bystander the card is unchanged.
- ~20 rules by card kind and wording: kicked out, walked out, death, bounty, robbery, rumours/romance, slander, fights, auctions, sponsors, unpaid, reputation up/down, dungeon opening, revenge, the "people Brutus hasn't dealt with" digest, and a catch-all.
- Display only: no state, save or dispatch-list changes.
- Files: voice-world.js (appended last in the world chain, build-e1.cjs and brutus-astra-e1.html), voice-world.test.cjs.
- Not done: Elsewhere cards and the weekly bulletin were not located or voiced. All lines are placeholders; Robert owns the writing.
- Built from main, so this build does not include the doom-movement branch; merge order will need a rebuild.
