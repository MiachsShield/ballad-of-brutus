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
- The departure rate itself is unchanged; E1.1 below changes what reaches
  the player, not what happens.

## Verify

```bash
node work/astra/economy-splice/build-e1.cjs
node work/astra/overworld-splice-1/integration.test.cjs builds/brutus-astra-e1-standalone.html
node work/astra/economy-splice/economy-integration.test.cjs
```

HTTP launcher: `builds/brutus-astra-e1.html` (serve the repo root, as in the
S1 runbook). Standalone from committed sources (after E1.1): **10,354,445 bytes, SHA-256
`f31382b6073d2d66432f10e8ba65190b76376eba630ea4f33351b138f56f51ca`**.

Browser checks ran in headless Chromium with software WebGL; harness hooks
were injected at fetch time only, never committed. Muse still owes the
eyes-on playtest before merge.

## E1.1 — player playtest and iteration (same day)

Played 12–14 turns on a phone-width screen as a player, reading each screen.

### What the overworld was doing (by player impact)

1. **A firehose of strangers.** The Chronicle took 30–77 new cards *every
   turn*, and 80–95% were about people the player has never met. By turn 6
   the Chronicle screen was ~20 KB of text: deaths, poachings, and
   "reputation shifts from 0 to -18" for nameless guild members.
2. **One event, up to three cards.** Item 3 fixed departures only. Deaths
   still came as "A price was paid" + "X has died", poachings as "X is
   poached" + "Z pulls X away", and every exit and death was followed by a
   separate reputation card (86 in 12 turns).
3. **The named cast is dying off-screen.** In one 12-turn run, 7 of the 13
   illustrated principal cast died (Yue Vautrin, Iara Vesper, Ren Sable,
   Tala Maren, Bram Calder, Dario Venn, Amara Sol) before the player could
   meet any of them. The world population went from 266 to 188.
4. **Brutus is a spectator.** The treasury drifted by -88 g a turn, and
   nothing in the economy touched him unless he went to the Guild market.
5. **Nonsense poaching.** "Jade Accord pulls the contract away from Jade
   Accord" appeared three times in 12 turns. A recruit move lands on someone
   who has already joined the same guild. Nothing moves, but it's reported.
6. **Unbounded Chronicle.** Every departure, death and reputation card was
   kept forever: 485 stored cards by turn 15, all in the save.

### What changed (still E1: item 3 plus the pacing hard constraint)

- **One card per event**, now for deaths, poachings and departures, in
  either order. The killer joins the victim's card. A reputation hit from
  the same event becomes a line on that card ("standing 0 → -18").
- **Same-guild "poaching" is not reported.** Nothing changed hands.
- **Pacing.** At the end of each turn, the Chronicle keeps in full every card
  about someone Brutus has dealt with:
  - his company past and present, and the named cast;
  - anyone he has visited, gifted, interviewed, bought at auction or staged;
  - anyone who remembers him or holds a grudge;
  - anything naming Brutus or "you".

  Everything else becomes one **"Elsewhere on the Continent"** card under
  that turn's headlines, with counts ("5 walked out, 1 died, 7 changed
  guilds…"). It also shows under World developments. Nothing is deleted
  from the world: strangers' cards stay in their own People histories and
  age out under the game's existing 70-card routine cap.

Result over the same 12 turns: **1–6 Chronicle cards per turn (was
30–77)**, nobody with two cards for one event, zero same-guild poachings,
~110 stored cards at turn 13 (was 485 at turn 15).

Regression on the iterated build:
- departures, auction dedupe, booking, and save → reload are identical;
- auction purchase and a full dungeon trip work;
- dead-control crawl: 156 controls, 0 dead;
- the Node suite is extended for deaths, reputation folding, self-poach and
  pacing.

### For Robert

- **Cast mortality (item 3 above) is the biggest open question.** Your
  stance is that a high level is no immunity ("no MMA fighter can survive
  a knife"). But at this rate most of the illustrated cast is dead before
  the player can love or hate them. Possible answers: protect the cast until
  Brutus has met them, slow the kill tick, or leave it as is. I haven't
  touched it.
- **Auction purchases still write four cards** (proposed E2 item 1).
