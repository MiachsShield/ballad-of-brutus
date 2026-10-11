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
