# Playtest fixes — 2026-10-12 (Claude)

From Muse's playtest of the 2026-10-12 CURRENT build. Card faces and the fist art are with
the art agents (Robert, 2026-10-12); this covers the two other issues.

## 1. Deck chosen twice → one choice, on Deploy
- `deck-world.js`: the Deploy screen's deck card now has two buttons, Warrior / Priest. The
  last pick is remembered (`S.deckChoice`, saved with the run; Warrior at first). Only the
  chosen deck's card list is shown, still collapsible.
- The pick goes to the dungeon as `loadout.deck` on Brutus's loadout (the enterDungeon /
  freshDungeon messages are unchanged, they already carry the loadout).
- `deck-dungeon.js`: when a deck arrives, the dungeon picks it and skips "What does Brutus
  bring into the dark?" (log line: "Priest deck in hand."). With no deck (old messages, the
  dungeon opened alone) the prompt still appears. The training room is untouched.

## 2. Boss never found → straight route down on every floor
- What I measured first: on the old layout (900 generated floors), the route from a floor's
  entrance to its stair room was already straight in 70% of floors and 3.6 rooms on
  average, 5 at most. So the layout explains part of it, not all of it.
- `spine-dungeon.js`:
  - The middle row is always joined: entrance → rest area → stair room. The way down is a
    straight walk through the rest area on every floor; on B3F the stair room is the boss
    room. Chests, the hidden chamber, the platform, loops and pits stay random.
    900/900 generated floors follow it. `SPINE_ON=false` turns it off.
  - The stairway down is drawn gold with a ▼ on the minimap once you can see it (same
    rule as any passage: one end visited). Before, nothing on the map said which passage
    led down.
- Not changed: the hidden chamber (still the south-west corner, narrow passage), no text
  hints or arrows to the boss, layout still new on every entry.

## Playtest (exact file, headless Chrome)
- Deploy: both buttons show, Priest pick highlights and swaps the card list; Descend →
  dungeon starts unpaused with the Priest deck and no prompt. Zero page errors.
- Minimap in the stair room: gold stairway with ▼ (screenshot checked).
- Not exercised live: walking a full run to the boss by hand. Next check is Muse replaying
  "find the boss" on this build.

## Tests
`node work/claude/playtest-fixes/playtest-fixes.test.cjs` PASS, plus S1, ow-bridge, E1,
contracts, conquest, boss loot, no elements all PASS on the new CURRENT.
