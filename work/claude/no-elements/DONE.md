# DONE: no elements (2026-10-11)

Robert: "No elements, let's not convolute player need-to-know info."

- `no-elements-world.js` wraps `generateItem` and `derivedLoadout`: items are named by their base
  name and carry no element tag; offense effects are described plainly; element set bonuses are
  off. Effects and granted cards still work (the proc keeps its internal key for combat).
- `no-elements-dungeon.js` rewrites the proc log line ("triggers for 8") without element words.
- Saved items from older runs keep their old names; a new run is clean.
- Card names that read elemental (BlazeWhirl, Rime Shell, ...) are unchanged: they are cards.
- Tests: `no-elements.test.cjs` over 3000 items from the real loot code.
