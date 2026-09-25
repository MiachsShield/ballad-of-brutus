# Claude's overworld design view — 2026-09-24

Status: proposal, not a ruling. Nothing here is implemented; no branch
splices into `builds/`. This is a design digest, written for comparison
against other lanes' takes on the same system, following the review and
brainstorm conversation with Robert on 2026-09-24 (overworld news
readability → labor market / social engine framing).

## Robert's framing, as given

The overworld is two systems:
1. **A labor market** — guilds compete for adventurers, gold is
   existential (no guild → no home, no protection), gear closes level
   gaps, contracts and dungeon access are the prize.
2. **A social engine** — adventurers form bonds, rivalries, parties;
   guilds fight for allies and power; fraternization crosses guild lines.

Both should stay entertaining under scarcity — "as these people work
together or bash heads when resources have shortages" — without ever
making the player dread opening the overworld screen. It should scratch a
different part of the brain than dungeon combat: a market/fantasy-league
feel, not a chore.

## Core thesis

The two systems should read the *same* scarcity signal and answer it in
different registers: the labor market prices it (fees spike, guilds bid,
wages compress), the social engine personalizes it (this specific
rivalry, this specific betrayal, this specific alliance). A shortage is
one followable storyline across several turns, not N independent stat
changes. This is also the answer to the earlier pacing problem: a
shortage gives the player one thing to track, not a feed to skim.

## Proposals

| # | Mechanic | Trigger | Effect | Player-facing signal |
|---|---|---|---|---|
| 1 | Poach vs. infiltrate split | Soliciting an already-signed member (poach) vs. sending someone into a rival guild (infiltrate) | Poach: hostility spike, broadly — other guilds react, not just the victim, since it's a norm violation. Infiltrate: multi-turn scheme with a detection roll scaling on target vigilance; caught = public scandal | Poach reads as an overt act in the news; infiltration builds tension over turns (a CK3-style scheme bar), then resolves as a headline if caught |
| 2 | Free-agent decay clock | Unclaimed too long, scaled by fame/level | Five branching fates: solo gambler's delve (usually dies, sometimes moons into instant fame — the SanDisk case), quiet vanish, kidnap-bait window opens, turns bandit and becomes a recurring threat, or player-extended reprieve via visit/gift | Stagnation becomes a countdown with real branches, not silent deletion. Visiting/gifting is a cheap way to informally protect or "root for" someone Brutus can't yet afford to sign — the scouting itch |
| 3 | Cross-guild fraternization | Similarity-based affinity between members of rival guilds (reuses the existing collab-synergy formula, extended past celebrities) | Leaks info, secrets, assets, weaknesses sideways across guild lines; can cool guild hostility organically as friendships accumulate, or sour and become betrayal/informant material | A specific friendship generates a specific actionable lead, not an abstract diplomacy meter |
| 4 | Guild-exclusive benefits | Membership status | Beyond dungeon access: protected housing (no guild = robbery/kidnap risk while asleep), credentialed contract access civilians/free agents can't touch, a death/ransom safety net, loaned top-tier gear for a job (ties gear-as-equalizer to membership, not just gold), insider training, guild-only markets and introductions | Gives each guild a felt identity beyond a name and a treasury number |
| 5 | Labor-market scarcity | Class shortage, dungeon-access crunch, or gold crunch from missed payroll | Bidding wars play out visibly over 1–2 turns instead of an instant dice roll; collective strikes (whole roster refuses to delve) as a step up from solo desertion; layoff waves dump free agents into the market in bulk during a glut; monopsony from one dominant guild suppressing value growth for everyone else; cartels that quietly agree not to bid against each other, breakable by a defector | Scarcity becomes a followable storyline — the bidding war, the strike, the guild that broke the cartel |
| 6 | Social response to scarcity | Same shortage as #5 | Shared hardship bonds people across guild lines faster than shared success does; two similar adventurers competing for the same scarce contract curdle from affinity into rivalry instead of friendship; scarcity intel (a guild's treasury about to collapse, a guild about to move on the same dungeon) becomes the highest-value secret fraternization (#3) can produce | The labor event and the social event are the same event, told twice — market and drama from one cause |

## Cross-cutting constraints (carried from the readability conversation)

These apply to every proposal above, not just presentation:

- Ignoring the overworld screen must be safe — no penalty for not reading.
- No prominent event lands without a multi-turn tell (a scheme bar, an
  escalating feud, a visible bidding war) — nothing should feel random.
- At most one live "opportunity" prompt at a time; passing costs nothing
  but the chance.
- A turn's news should read in under a minute on a phone screen.
- The existing economy rules (payroll, auctions, poaching mechanics,
  kidnap leverage/trace logic) stay as built. Everything above is new
  surface area or an extension of what exists, not a rewrite of it — the
  one deliberate exception under discussion is cast-member protection
  until Brutus has met them, which is Robert's call, not decided here.

## What's genuinely new vs. what extends existing code

Already implemented and load-bearing for this vision (confirmed in
`builds/brutus-1_0_a0mk-kavi-balanced2.html`'s world script during the
E1 economy-splice work): guild payroll and missed-payroll desertion, debt
auctions of people and gear, poaching with contested offers and declines,
kidnapping with leverage/trace logic, per-person fame/marketability/
affection tracking, guild-arranged celebrity collabs, and tiered magic
gear (rare/enchanted/legendary) that can grant cards.

- **#1 (poach/infiltrate)** and **#2 (decay clock)** both extend the
  existing kidnap leverage/trace logic rather than inventing a new system.
- **#3 (fraternization)** reuses the existing collab-synergy formula,
  applied to rank-and-file members instead of only celebrities.
- **#4 (guild benefits)** and **#5/#6 (scarcity-driven labor and social
  response)** are net-new mechanics — nothing built yet.

## Open questions for Robert

1. Cast-member protection until met (raised separately, still open).
2. Which shortage type to trace end-to-end first — class shortage,
   dungeon-access crunch, or gold crunch — before any of this is scoped
   into an implementation batch.
3. Whether guild-exclusive benefits (#4) should be uniform per guild or
   vary by guild identity (a training-focused guild vs. a market-access
   guild, etc.) — the latter is a bigger content commitment.

No code changes accompany this document. Awaiting direction before
scoping any batch.
