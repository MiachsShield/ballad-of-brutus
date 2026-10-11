# DONE: guild contracts (2026-10-11)

Robert's request (2026-10-11): contract kinds **Ally** (guests join beyond party limits),
**Access** (temporary access to a dungeon you couldn't enter), **Ally Access** (both). Then:
"every other guild outside Brutus has rights to their own dungeon", following region and
affiliation logic. Playtest defaults; nothing here is final.

## What it does

- **Rights (region logic):** each dungeon's rights holder is a guild whose home is that dungeon's
  region, picked when the dungeon opens, weighted by roster size. If that guild disappears, the
  region's largest guild takes over. If Brutus has absorbed the holder, or no guild lives in the
  region, the dungeon is his.
- **Locked cards:** a dungeon Brutus has no rights to shows its holder and offers Access and Ally
  Access instead of Take contract, on both the Dungeons and World tabs. Taking it anyway is
  blocked in the click handler and again at deploy.
- **Prices** (share of the contract reward, paid to the guild's treasury, no action spent):
  Access 25%, Ally 20%, Ally Access 40%.
- **Guests (affiliation logic):** only living, unjoined members of the signing guild, at most ten
  levels above Brutus, the two strongest. They fight as full companions for one expedition,
  beyond the two-companion limit, tagged "guest".
- **Who deals:** the existing "on good terms" rule (hostility below 1, reputation above -20) and no
  active war. Otherwise the card says why there is no deal.
- **Ally alone:** offered on dungeons Brutus holds, from the friendliest guild that will deal.
- **After the expedition:** rights and guests are used up. A guest at 0 HP is dead (permadeath);
  their guild gets the existing death consequence and the Chronicle names the guild. Survivors
  remember Brutus (+8) and gain affection. A dungeon that fails to open keeps its contract.

## How it is built

- `contracts-world.js` (world) and `contracts-dungeon.js` (dungeon), composed by
  `work/astra/economy-splice/build-e1.cjs` and the e1 launcher. Wrappers only; the hash-pinned
  baseline is untouched.
- Guests travel inside the existing `contract` object of `enterDungeon`; no new message.
- `contracts.test.cjs`: sandbox unit test of the rules, same pattern as the S1 test.

## Verified

See `builds/current-build.md`. Unit test, S1 and E1 suites pass; click-through in headless Chrome
covers locked cards, purchase, guests in the dungeon, guest death in the Chronicle and People,
relock, and the training room.

## Defaults to try and change

Prices, the ten-level reach, two guests, roster-weighted holders, "good terms" as the dealing
rule, and no action cost for signing. The old abstract "guest went down with Brutus" roll
(`resolveGuestExpedition`) still runs separately; it may feel redundant now that guests are real.

## Playtest round (2026-10-11, same day)

Played six and then nine world turns and three delves (two with guests) in the exact build.
Fixed in this feature: guest corridor trailing (log spam) and the expedition report (fee and
guests). Found outside this feature and left for Robert: every dungeon from the opening expires
on turn 6 so turn 7 has none; roster upkeep is still charged each turn despite the no-upkeep
ruling; four allies dogpile every enemy, so Brutus lands few kills.
