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

## Not done, deliberately

- No wiring into the sim, encounter UI, or the build splice.
- No rival-guild data, renown formula, or favor economy yet.
