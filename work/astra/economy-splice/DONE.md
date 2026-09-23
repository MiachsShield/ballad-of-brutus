# E1 — economy splice into the established overworld (2026-09-23)

Brief: `briefs/astra/2026-09-23-economy-splice.md`. Worked by Claude in Astra's
lane. Branch `astra/economy-splice`, cut from the PR #34 head (`a8df78f`,
which is `656c08c` plus the S1 browser review and Talk-placement fix).
**Stacks on #34 — merge #34 first.**

## The main finding: the economy was never missing

The `astra/economy-pr34-grounded` study added **no economy code**. Its
`source.cjs` composes the exact PR #34 world; its only adapter hid the dungeon
controls (which is where the dead "Take contract" came from). Guild payroll,
missed-payroll departures, debt auctions of people and gear, poaching, the
free-agent market and class-demand shifts are the accepted build's own world
tick, and S1 already runs them with dungeons live. So item 1 is "keep the
real tick, fork nothing", and E1's code is the player-facing fixes (items 3–5)
as one adapter, `economy-integration.js`, appended to S1's world part.

## Items

1. **Economy in the real world** — verified in the browser on the E1 build:
   14 turns → 84 departures, up to 6 live debt sales (people and gear), missed
   payrolls, telegraphed poaching. No parallel fork, no second economy. The
   gold rules are untouched: no invariant, no new sinks or sources.
2. **Dungeons keep working / no dead controls** — Take contract → Descend →
   dungeon → Talk (Exploit) → return, all from the E1 build. Crawled **266
   clickable world controls across all six screens**, each from the same
   saved state: none did nothing. (The crawler's only two hits were nav tabs
   clicked while already on that tab.) New run, End turn, Save and Descend
   were checked in their own flows.
3. **One Chronicle card per departure** — the desertion order (card, then
   flavour line) and the quit order (flavour, then card) both fold into one
   departure card, with the more specific line as its body. Also drops the
   double full stop from guild names ending in "." ("Bright Harbor Co..").
   Same 14-turn run: unfixed S1 had 59 doubled exits and 4 double-dot
   titles; E1 has 0 and 0.
4. **Auction integrity** — one identity = one live lot across all live sales;
   the earlier listing stands, sold lots stay as history, emptied sales go.
   A guild's sales sit together, and the purse shows once at the top of the
   card. Unfixed S1 showed a duplicate lot in the same run; E1 has none.
   Bought a lot through the UI: roster 2 → 3, purse down by the price, the
   Chronicle records it.
5. **"Book with Ember (143k g)"** — relabelled "Stage Ember with Calsha ·
   91k g", with a tooltip: joint appearance, not a signing; the fee goes to
   their guild; both gain fame; they stay with their guild; costs 1 action.
   Disabled with the reason when it can't work (no actions, hostile guild,
   slandered name, short purse). The one silent failure (slandered names)
   now logs why. The fee shown is exactly what the game charges.

Save → full reload: turn, gold, agents, Chronicle, auctions and OW bridge all
identical. Existing save key only.

## Flagged, not changed

- **The booking fee is the real price.** 91k–394k g per appearance
  (marketability × 4,200) is the game's own value. If that feels wrong,
  it's a balance call for Robert.
- **An auction purchase still writes four Chronicle cards** ("joins Brutus",
  "signs on… bench", "comes out ahead", "watched you take"). Same class of
  problem as item 3, but item 3 was scoped to departures and the batch is at
  five items. Good first item for E2.
- The departure rate is unchanged (84 in 14 turns). The design doc's pacing
  rule (one prominent opportunity at a time) is the later pressure-model
  batch.

## Verify

```bash
node work/astra/economy-splice/build-e1.cjs
node work/astra/overworld-splice-1/integration.test.cjs builds/brutus-astra-e1-standalone.html
node work/astra/economy-splice/economy-integration.test.cjs
```

HTTP launcher: `builds/brutus-astra-e1.html` (serve the repo root, as in the
S1 runbook). Standalone from committed sources: **10,349,575 bytes, SHA-256
`72b1781487164f7ef94ad7c0be269337134f7906bade26ddb4393efe774be742`**.

Browser checks ran in headless Chromium with software WebGL; harness hooks
were injected at fetch time only, never committed. Muse still owes the
eyes-on playtest before merge.
