# Brief E2 — Labor market + social engine: work together or bash heads when resources run short (2026-09-24)

## ADDENDUM 2026-10-06 — Robert's rulings supersede the wage/payroll mechanics (read first)

Robert's Oct 6 rulings change the economic model this brief assumes. Where they conflict with the items below, the rulings win:

- **No constant upkeep costs.** No wages ticking, no maintenance meters, no payroll engine. Money moves ONLY on choices: investments, favors, bribes, war costs, tribute. (Extends his Sept 28 "investing, not upkeep, no wages" ruling.) **Items 1 and 4 are OFF THE TABLE as written** — do not implement rising wages, signing bonuses, counter-offers, or wage inflation, and do not extend the "missed payroll → releaseToMarket" spiral. Brutus has no payroll either.
- **The class ladder** (Robert's social model): the top exploits the bottom; the bottom claws toward the middle; the middle grinds toward the top / famous-adventurer status. The top also tries to BANKRUPT hated rivals — active economic warfare (poaching their earners, draining treasuries through war costs, tribute pressure, sabotage), never passive upkeep drain.
- **Rebuild shortage dynamics on choices, not wages.** When the free-agent pool runs thin, pressure shows up as: bidding in favors and gifts (not wages), poaching wars, kidnapping, assassination, strikes, desertion. Item 3's escalation ladder still stands — its fuel is rivalry and ambition, not payroll math. Item 5's "offering more" means better patronage: gifts, favors, status, protection — never wages.
- **Perpetual motion, not predictable or cyclical** (Robert, verbatim). The market must never stagnate or settle into a repeating loop; churn comes from the actors (desire drift, unforgotten grudges, tops that can't leave hated rivals alone). A run where visits go quiet is a failing run. (Also recorded in DISCUSS.md.)
- **Context:** Robert is currently exploring this same territory with you directly on `claude/cast-2026-09-28` (townsfolk, telephone rumors, regulars/guild-as-filter, jobless as expendable cheap labour, the patron). Coordinate with that work — do not build a parallel system.


From Muse. Robert's thesis, verbatim: **"The overworld is 2 things. Labor
market and social engine. Lets make this fun and interesting as these people
work together or bash heads when resources have shortages."**

This is the next batch after E1. **Do NOT start until E1 merges.** Then:
new branch `claude/e2-labor-market` from main, PR against main, at most 5
completed items per the batching rule. You implement directly in the build —
this batch is code, not a design doc. Muse playtests before anything merges.

## What already exists (extend it — do not build a parallel system)

All in the accepted build (the PR #34 world script, as corrected by E1):

- `agentLifeTick`: free agents delve/level/die/find items on their own —
  this is the labor supply.
- `guildHiringTick`: guilds hire toward 70% of establishment strength,
  `qualityBar()` floor, grudges block rehire.
- `commitGuildAction` + telegraphs: recruit / assassinate / kidnap plays,
  `CHASE_BASE`/`CHASE_FRENZY`, villainous `KIDNAP_CHANCE` 0.10 per slot.
- `WORLD_EVENTS` + `S.event.wants`: class-demand shifts; frenzy targets.
- `envyScore`/`envyTick`: agent-vs-agent rivalry over level, hidden
  ceiling, looks, gear value, market standing.
- `auctionTick`: debt auctions of people AND equipment.
- Missed payroll → `releaseToMarket`: the no-money-no-guild spiral.
- `guildVsGuildTick`: bounties, capture/kill claims, treasury moves.

## The 5 items

1. **Shortage states drive the market.** When the free-agent pool is thin
   in the demanded class (or thin overall), the market declares a visible
   shortage: wages for that class rise, signing bonuses appear, and every
   guild's chase/poach pressure on holders of that class intensifies. This
   is the "resources have shortages" trigger everything else keys off.
   Player-visible — a market board or ticker line, not a hidden number.
2. **Cooperation: delve pacts.** Guilds — and free-agent crews — can form
   temporary pacts to take dungeons or contracts neither could handle
   alone, splitting spoils. The "work together" half of the thesis. Must be
   visible (who is pacted with whom, what they came back with) and must be
   breakable — betrayal is a social-engine event, not a silent flag flip.
3. **Conflict: the escalation ladder over scarce people.** Under shortage,
   competition for a holder of the scarce class escalates visibly: bidding
   war → poaching → kidnapping → assassination, each step telegraphed. The
   telegraph system already exists — use it. A watching player should be
   able to see a shortage turn into a war.
4. **Wages as a real market.** Signing bonuses during shortages;
   counter-offers when a member is being poached; wage inflation that
   actually threatens treasuries — feeding the no-money-no-guild spiral,
   not bypassing it. Brutus's own payroll lives in the same market: his
   people can be poached, and he can counter-offer.
5. **Scarcity strains the social engine.** Crews that delve together build
   solidarity (shared spoils, survival = affection/loyalty); shortages
   trigger the opposite — envy tipping into theft and betrayal, strikes,
   desertion to a rival offering more. Extend the existing
   envy/feud/lover machinery; do not build a parallel one.

## Hard constraints

- Dungeon lane untouched: do not break `enterDungeon` / `freshDungeon` /
  `resumeDungeon` / `pauseDungeon` / `exitDungeon`; a failed dungeon init
  must not charge an action.
- **No dead controls.** Every button rendered must do what it says.
- Pacing (from the affection/scarcity design doc): at most one prominent
  economic opportunity demanding the player's attention at a time.
  Everything else resolves in the background and surfaces only when
  consequential.
- Gold: no fixed-supply invariant; no new global sinks or sources without
  a ruling. Robert's "strictly conserved vs merely difficult to earn"
  decision is still open — default to current behavior.
- Companion 0 HP = permadeath still holds.
- Save/load survives intact on the existing keys; no save-key collisions
  with the accepted build.

## Not in this batch

The earlier review gaps — NPC guild income, unique benefits per guild,
guildless vulnerability (ransack/sleep attacks), vouching/pedigree-gated
access — are queued for a later batch unless Robert reorders. Item 4 above
touches guild income indirectly through wage pressure; that is fine, but
do not expand scope into the E3 items.

## Standing

- Check `MEETING.md` at the start of your session, add feedback under your
  section, re-check for replies before you finish.
- Playtest the delivered build as a player before handoff; put feedback in
  your DONE.md ordered by player impact.
