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
Wren 45%  Remy 46%  Nikandros 41%
Aline 12%  Ines 12%  Mabel 10%  Hask 14%
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
survive%: t4–t5 (Aline, Nikandros, Hask) ~100%, broke/greedy Mabel 58%,
          reckless t2 (Ember, Ivo) ~80%
```

Known gaps: Nikandros/Aline/Hask sign on visit 1 and never leave, so the
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
blue chips (Nikandros/Aline/Hask) ever free after visit 1: 18%
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

## Nations and names (2026-10-01)

Robert: no anachronistic names (the fame/epithet "celebrity" layer stays); names
and looks follow each nation's phenotype basis from his world bible; and a mixed
nation is **a third thing, not one culture in the other's clothes** ("Li Trice is
not Chinese in French clothing"), an *ideal* meld "regardless of reality". In the five
mixed nations every name group is a meld group (a check enforces it).

**`NATIONS.md`** (Tier B proposal) organizes looks, names, dress, places and manner for
all seven nations as ideal melds, with no real-world justification required.
`names.js` holds the matching data: the basis table, house names for the named cast,
and a pool of **150+ given names per nation** for newcomers (`names-data.js`, grouped
by source with a `meld` group in the five mixed nations). **`NAMES.md`** is the browsable
list (1,122 names; regenerate with `node build-names-doc.js`). Highlights:

| Nation | Basis | The ideal meld |
|---|---|---|
| Marium | Roman | Rome as it dreamed itself; the cognomen is the celebrity byname |
| Themelios | Grecian | Hellas as it dreamed itself; meaning-compound names |
| Reyjar | Norse-Spanish | the sunlit north: Norse stems in Iberian music, -ez patronymics, courtyard long-halls |
| Li Trice | French-Chinese | the city of lanterns and lattice: Chinese syllables with French endings, house-first or given-first |
| Ayusti | Japanese-Brazilian | the lantern coast: Japanese stems with a Brazilian lilt (and back), doubled house names |
| Beloufi | Americana-Irish | the porch and the hearth: clan names as first names, ogham trees, tall-tale bynames |
| Edinius | English-Lithuanian | the amber north: English stems in Lithuanian dress, English iron on Lithuanian roots |

Cast now (code ids unchanged: 'pell', 'morrow', 'tibby', 'odile', 'mud', 'pim'):

| Character | Home | Note |
|---|---|---|
| Ember, Wren | Edinius | build cast, names kept |
| Dagny Halvardez, Hask | Reyjar | Dagny was Holm; Hask has dropped his family name |
| Sister Aline Laque | Li Trice | was Odile Varr, then Odile Lin |
| Remy Jonque | Li Trice | was Pell Marrow, Piers Daw, Perrin Dao |
| Ines Kawario, Ivo Kawario | Ayusti | were Castellane, then Sakai |
| Nikandros | Themelios | was Morrow, then Osmund |
| Mabel Quill | Beloufi | |

Home regions are my placeholders. Each authored character (not Ember or Wren, whose
art the build defines) has a one-line `look` in `cast.js`: an ART SUGGESTION for
Robert to veto. Guilds: Muddy Boots -> The Merry Rabble, Saint Pim's Rescue Brigade
-> The Brethren of Saint Piran. `node check-names.js` (26 checks) lints names, checks
every newcomer matches their home region, keeps pools free of canon and cast names, and
fails if `names.js`, `NATIONS.md` or `NAMES.md` drift apart. Pool size has no effect on
the sim: a 300-season soak is byte-identical before and after.

Bug found along the way: the sim keys newcomer ids by wave and the market never
advanced it, so newcomers overwrote live people with the same id (~1.25 per
season). Fixed in `market.js` (`s.wave = s.visit`).
