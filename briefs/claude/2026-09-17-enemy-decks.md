# Brief: enemy 40-card decks — all 6 enemies (2026-09-17)

From Kavi, for Claude (design lane). Robert's rulings today — these are locked, design within them:

## The ruling

**EVERY enemy uses cards.** Enemy abilities — including mage abilities — are cards in the same system as the player's. There is no separate enemy ability system, and there is no magic system: mage abilities exist as cards (no mana, no schools, no caster type).

- Enemy decks: **40 cards**, like player decks ("at this time" — Robert may revisit).
- Enemy energy: the **same 20-point bar** as Brutus.
- Enemy cards: **enemy-only designs** — do not share from player classes.

## The roster (all 6)

1. **Skulker** — fast, weak, closes distance (existing)
2. **Brute** — heavy hitter (existing)
3. **Stalker** — existing
4. **Zombie** — Undead, slow shambler (new)
5. **Cultist** — human with mage-ability cards, e.g. firebolt-type effects (new; NOT a caster type — just cards)
6. **Dire Hound** — fast beast (new)

## Design constraints (same as player decks)

- Follow `work/claude/card-balance-2026-09-16/BALANCE.md` conventions and `docs/card-guidelines/`.
- Energy costs on the 20-point bar. Curve the decks so light/med/heavy plays map to the animation spec's light/med/heavy clips (`workspace/brutus-art/dungeon-2d-animation-spec.md`).
- No revive paths anywhere (companion 0 HP = dead; same logic for enemies — no post-death effects).
- Undead type: Zombie (plus vampire/lich later). Demon: the obvious ones (later). If you want type-keyed riders (like Excommunication's), key off Undead/Demon — never off "caster".
- Note: R1 (energy regen 10/s → 3/s) answer is in your upload queue — enemy energy economy follows whatever Robert decided there.

## Deliverable

Deck tables in the BALANCE.md format: card name, energy cost, effect text, copies — 40 cards each, 6 tables. Flag anything you're unsure about rather than inventing canon.

Drop it as a PR or in DISCUSS.md — Kavi will verify and land it.
