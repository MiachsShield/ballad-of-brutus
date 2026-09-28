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

Soak (300 seeds, no repopulation, sim numbers unchanged):

```
avg alive after visit: 5.9 4.9 4.3 3.7 3.2 2.9 2.5 2.2 2.0 1.8
Ember 0%  Dagny 0%  Ivo 0%     (all three are reckless)
Wren 45%  Pell 46%  Morrow 41%
Odile 12%  Ines 12%  Tibby 10%  Hask 14%
```

**Blocker for the playtest:** the slice-1 death rate was tuned for an
anonymous, repopulating roster. On a fixed authored cast it empties the
town by mid-season, and the `reckless` trait is a death sentence. Needs a
ruling before retuning `adventurers.js` (not done here).

## Not done, deliberately

- No encounter UI or build splice.
- No retune of sim mortality (see blocker).
