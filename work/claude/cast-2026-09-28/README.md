# Labor-market playtest cast — 10 adventurer sheets

Robert's rulings, 2026-09-28. Data only: nothing is wired into `sim.js`,
the dungeon, or `builds/`. Attaches as `window.OW_CAST`.

```
node check-cast.js   # 111 checks: classes, sim traits, desires, ties, regions
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
10 adventurers, 7 rival guilds (one per region), one season ≈ 10 town visits, news at the
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
Wren 45%  Piers 46%  Osmund 41%
Odile 12%  Ines 12%  Mabel 10%  Hask 14%
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
7 rival guilds, one per region (cap 2 members each) recruit by fame bar, gain renown from
members' delves, lose it to deaths, decay, and can collapse. Death comes
from choosing floors past your tier; guild members are protected.
Unnamed free agents vanish after 6 unguilded visits.

```
node market-season.js          # one season as the player sees it (top 3 stories a visit)
node market-season.js --full   # the same season, every headline
node market-season.js --soak   # 300 seeds, volatility metrics
```

Soak (300 seeds):

```
per season: headlines 43.7 (named 40.0) | named deaths 1.1 | joins 11.5
  | desire shifts 4.3 | big hauls 15.9 | walkouts 3.5 | guild collapses 1.0
named free agents available per visit: 3.4
quiet visits: 0.5%
survive%: t4–t5 (Odile, Osmund, Hask) ~100%, broke/greedy Mabel 58%,
          reckless t2 (Ember, Ivo) ~80%
```

Known gaps: Osmund/Odile/Hask sign on visit 1 and never leave, so the
blue chips are never courtable; newcomers rarely make news; Brutus and
player choices are not in the loop yet.

## Not done, deliberately

- No encounter UI or build splice.
- No retune of slice-1 mortality; the market slice has its own.

## Guild roster (2026-09-28)

One per region, 3 good / 3 evil / 1 between; 4 alliances, 5 feuds, all
mutual. Data in `market.js` GUILDS (leaning, holds/loses traits, poaching
method, allies, feuds). Soak with 7 guilds: named deaths 1.0, joins 11.0, walkouts
2.3, collapses 2.0, named free agents per visit 3.1, quiet visits 0.9%.

## King of the hill (2026-09-28)

`koth.js`, run inside `market.visit()`. An MVP is anyone guilded with fame
>= 60. Each visit, non-allied rivals whose fame bar they clear may move on
them (feuds try harder): gold, bigger stage, or friends pull against the
holder's hold score (renown + holds/loses traits + personality needs:
proud wants top billing, kind wants to be needed, pragmatic wants a rising
guild, friends in the guild anchor). The Black Candle sabotages instead
(holder loses renown, cautious MVPs get shaken). An evil rival that fails
twice may try the knife: lands only if the holder's renown < 50. A
miserable MVP nobody wins walks out as a free agent (Brutus's window).
One visit of settling-in grace after any move. NPC guilds only.

Soak (300 seeds):

```
poaches 0.5 | MVP walkouts (open windows) 1.1 | sabotage 4.8 | knives 1.4
avg MVP tenure: Iron Oath 4.5 | Lantern 2.4 | Black Candle 2.2
                Gilt Hand 1.7 | Hollow Crown 1.6
blue chips (Osmund/Odile/Hask) ever free after visit 1: 18%
named deaths 1.1 | named free agents per visit 3.2
```

Hask stays with whoever serves his grudge (~99% held) — by design of his
sheet, flagged in case it should be looser.

## Cliques (2026-09-28)

`cliques.js`, run inside `market.visit()` after king of the hill. Fit is
judged by the clique, not the charter: the guild's taste for your traits
(holds/loses) + traits and dominant desire shared with the people actually
in it + friends inside. Misfits build strain each visit; fitting in bleeds
it off. Ladder: frozen out (smaller cuts, less fame) → restless (shaken,
easier to poach, may walk to where their people are; evil guilds rarely
let a misfit go) → scapegoated for bad weeks → left behind on a floor
(evil guilds and the Iron Oath; good guilds never) → murdered (evil only).
A tight clique (fit > 0.4) adds hold against poachers.

Soak (300 seeds): frozen out 3.4 | misfit walkouts 0.5 | scapegoated 0.6
| left behind 0.1 | murdered 0.1 per season; named deaths 1.3 total.

Robert, 2026-09-28: good vs evil (and region) means difficult, not
incompatible. Fit now also rewards usefulness (out-performing the clique),
wanting what they want, and time served. `node acceptance.js`: a member
whose traits an evil guild dislikes ends up accepted in ~20% of stints.
Soak after the change: frozen out 2.5 | misfit walkouts 0.3 | scapegoated
0.3 | left behind 0.1 | murdered <0.1 per season; named deaths 1.2.

## Names (2026-10-01)

Robert: no anachronistic names (the fame/epithet "celebrity" layer stays).
`names.js` holds the rules and a 45-name period pool for newcomers; duplicates
are told apart by home region, then seniority ("Marta of Beloufi"), never a
numeral. Picks hash the market seed + id, so naming never touches the sim's
random stream. Renamed: Pell Marrow -> Piers Daw, Morrow -> Osmund, Tibby
Quill -> Mabel Quill (epithets: The Early Leaver, The Gravedigger, Chaplain
and Keeper of the Book); guilds Muddy Boots -> The Merry Rabble, Saint Pim's
Rescue Brigade -> The Brethren of Saint Piran. Code ids are unchanged ('pell',
'morrow', 'tibby', 'mud', 'pim'). Ember and Wren keep their names (existing
build cast). `node check-names.js` lints cast, guild and newcomer names.

Bug found while doing this: the sim keys newcomer ids by wave and the market
never advanced it, so newcomers overwrote live people with the same id
(~1.25 per season). Fixed in `market.js` (`s.wave = s.visit`); soak numbers
moved by noise only.
