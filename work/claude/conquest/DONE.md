# DONE: conquest and paused upkeep (2026-10-11)

Robert: "A conquered dungeon (end boss defeated + boss chest looted) should be inert for x turns.
Tbd. Pause upkeep cost at this time."

- Upkeep: `playerUpkeepTick` is wrapped; while `UPKEEP_PAUSED` is true nothing is charged and no
  missed payroll is recorded (so no loyalty strain). Rival guilds' payroll is untouched.
- Boss chest: one chest in the warden room, unopenable while the warden lives. Opening it sets
  `bossChestLooted`; the warden's death sets `wardenSlain`. Both ride the existing exit result.
- Conquered: both flags on return keep the dungeon on the board, inert through
  turn + `CQ_INERT_TURNS` (3, placeholder). Card, take, boast, access, ally and deploy are all
  blocked while inert. Expiry moves to four turns after it reopens. A refunded expedition never
  conquers.
- Open for Robert: the value of X; what a boss chest should hold; whether inert dungeons should
  count toward the four-dungeon board (they do now); whether conquest should affect rights.
- Tests: `conquest.test.cjs` (sandbox, both sides) plus browser checks in `builds/current-build.md`.

## Boss loot (2026-10-11, Robert: MMO conventions; "always a cut above generic loot in that level")

- `boss-loot-world.js`. On a return with the boss chest looted: one boss drop (plus one extra on
  the first clear of that dungeon), and a chance at the dungeon's named signature item.
- "A cut above", at the generic exit drop's level: rarity = a generic roll raised one tier, never
  below that level's usual generic rarity; positive stats x1.15 (at least +1) over the same slot,
  level and rarity; always elemental, in the dungeon's tier-set element.
- Signature: 15% per clear, +10% per miss (guaranteed by the tenth clear), one tier above that
  clear's boss drop, stats x1.25, drops once per run.
- Lockout: the inert state is labelled as a raid lockout. X is still the placeholder 3.
- Tests: `boss-loot.test.cjs` loads the real loot code from the baseline.
- Open for Robert: X; drop counts; whether signatures should be rarer, tradeable or class-bound;
  whether guests should get a share of boss loot.

## Round 2 (2026-10-11, Robert)

- Lockout X: a random 2-5 turns.
- Boss drops: a random 1-5 per clear, plus the first-clear extra.
- No elements in boss loot; boss gear is named by its dungeon's set (Gilded, Crowned, Thorn,
  Ashen, Drowned, Faultlit, Quiet) in Monster Hunter style. Set bonuses are not built yet.
- Angry dungeons ("unique/rare monsters, dungeon angry at being looted x times"): the third
  looting (placeholder for x) breaks the lockout and spawns a rare monster on floor 2; killing
  it calms the dungeon and resets the count. The rare monster has no special reward yet.
- Open for Robert: x for anger; rare monster rewards; MH-style set bonuses and crafting
  (proposed, not approved); Signature items as unique gear granting a Signature card.
