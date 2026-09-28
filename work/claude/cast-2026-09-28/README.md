# Labor-market playtest cast — 10 adventurer sheets

Robert's rulings, 2026-09-28. Data only: nothing is wired into `sim.js`,
the dungeon, or `builds/`. Attaches as `window.OW_CAST`.

```
node check-cast.js   # 97 checks: classes, sim traits, desires, ties
```

## Rulings this sheet is built on

- **Investing, not upkeep.** Favors, gifts, dungeon rescues, funding runs. No wages.
- **Guest run → permanent join.** Guests stay until they decide. Either side can
  ask to make it permanent. Permanent members don't leave easily; dismissal
  costs renown and earns a grudge.
- **Desires:** gold, strong guild, guild with friends. Mix with one dominant,
  partly visible, shifting with their fortunes (`shiftsWhen` is authored
  text, not code yet).
- **Known classes only** (Warrior, Priest, Mage, Archer). Tone exaggerated
  both ways (`tone: comic | grim`). Two pairs: Ember/Wren, Ines/Ivo.
- **Combat numbers are scales** against Brutus (1.0), not absolutes.
- **Ember and Wren** keep their build personality and voice; their sheets
  carry market stats only.

## Playtest spec (labor market)

Scope: courting + guest runs, rival guilds, news. Guild founding is out.
10 adventurers, 4–5 rival guilds, one season ≈ 10 town visits, news at the
start of every turn, culling on. Text/menus, real combat on guest runs.
Brutus starts as a free agent under NPC rules. Courting slots 1–5 by
renown. Success = market feels alive, choices feel quick, no reloading,
players want to court — judged by gut feel.

## Wired into the sim (2026-09-28)

`castState.js` → `seedFromCast(seed)` returns a normal OW state whose roster
is the ten authored adventurers. Name/traits/tier from the sheet, goal still
rolled, `p.sheet` carries the full sheet, ties are permanent `old-ties`
ledger rows both ways. `adventurers.js` and `sim.js` are untouched.

```
node season.js          # one readable season (10 visits = 10 waves)
node season.js --soak   # 300 seeds, survival per adventurer
```

Town refills to 10 with unnamed newcomers after every visit (Robert,
2026-09-28); the named cast is never replaced. Soak (300 seeds, sim
numbers unchanged):

```
avg NAMED alive after visit: 5.9 4.9 4.3 3.7 3.2 2.8 2.5 2.2 1.9 1.8
Ember 0%  Dagny 0%  Ivo 0%     (all three are reckless)
Wren 45%  Pell 46%  Morrow 41%
Odile 12%  Ines 12%  Tibby 10%  Hask 14%
```

**Open:** refill keeps the town full, but the named cast still dies at
slice-1 rates and `reckless` is a death sentence. Robert's target for named
deaths per season: "depends" — mortality stays untouched until he says on
what.

## Labor market slice (2026-09-28)

Robert: "Deaths are not a target. Volatility of the market and people
making choices." Named deaths depend on tier and traits, player choices
to a lesser extent. `market.js` replaces the slice-1 wave mortality for
this playtest (slice-1 code untouched).

Each visit every adventurer makes one choice (delve / lay low / join /
leave / follow a friend) from their dominant desire, fortune and traits.
Outcomes move fortune and fame; desires drift with fortune and loss;
5 rival guilds (cap 2 members each) recruit by fame bar, gain renown from
members' delves, lose it to deaths, decay, and can collapse. Death comes
from choosing floors past your tier; guild members are protected.
Unnamed free agents vanish after 6 unguilded visits.

```
node market-season.js          # one season's news, seed 7
node market-season.js --soak   # 300 seeds, volatility metrics
```

Soak (300 seeds):

```
per season: headlines 43.7 (named 40.0) | named deaths 1.1 | joins 11.5
  | desire shifts 4.3 | big hauls 15.9 | walkouts 3.5 | guild collapses 1.0
named free agents available per visit: 3.4
quiet visits: 0.5%
survive%: t4–t5 (Odile, Morrow, Hask) ~100%, broke/greedy Tibby 58%,
          reckless t2 (Ember, Ivo) ~80%
```

Known gaps: Morrow/Odile/Hask sign on visit 1 and never leave, so the
blue chips are never courtable; newcomers rarely make news; Brutus and
player choices are not in the loop yet.

## Not done, deliberately

- No encounter UI or build splice.
- No retune of slice-1 mortality; the market slice has its own.
