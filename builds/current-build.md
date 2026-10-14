# Current build (2026-10-13, dungeon ranks, checkpoints, trip home, XP rebalance, status screen)

**The playable build is the file whose name starts with `CURRENT-`.** There is
exactly one.

- File: `builds/CURRENT-brutus-astra-e1-standalone.html`
- Size: 10,442,145 bytes
- SHA-256: `635e794954b66670743728a35c9ed954897cc7ad6585588cfe171871aab01247`
- New in this build (Robert, 2026-10-13):
  - Every dungeon has a rank 1-5 on its card. Rank sets floors (3-5), traps and pits,
    how many monsters and which kinds, monster and warden toughness, chests and pay.
    Rank 2 is the old dungeon.
  - Checkpoints: spawn, each floor's arrival room, rest areas, waypoints. Leave and come
    back: same dungeon, same map, chests and kills; you start at the last checkpoint.
    Contract progress counts across entries.
  - Warden down and its chest looted: the dungeon closes and the party is carried back to town.
  - XP rebalanced (Robert: avoid over-grinding, keep level gain reasonable): at most one
    level per expedition, weaker "punching up" bonus, outgrown dungeons pay little, depth
    is not paid twice, repeat conquests pay less. See DONE.md for before/after.
  - Companions earn XP by the same rule as Brutus against their own level (no flat
    12 per kill), stop at their growth ceiling, and show XP bars on their guild card,
    in the sidebar and on their profile. XP is always a whole number.
  - Status screen: click Brutus or a companion for level, XP bar, dungeon stats, gear,
    abilities and standing. Others still open their public profile. Brutus's screen shows
    his whole deck; during an expedition (View world) used cards are greyed.
  - Card faces with no art hide cleanly (no broken-image icons). Hidden chambers count once each.
- Everything from the previous entry (one deck choice, straight route down, 2D fist,
  boss loot, lockout, angry dungeons, no elements, guild contracts, upkeep paused) is unchanged.
- Card faces load from `art/card-faces/` next to the file, so open the build from a full
  checkout of the repo.
- Tests: all suites PASS on this file. Headless Chrome: rank cards, checkpoint save and
  resume, auto-return after the boss chest, training room; zero page errors.
- Details: `work/claude/dungeon-ranks/DONE.md`.

---

# Current build (2026-10-12, one deck choice, straight route down)

**The playable build is the file whose name starts with `CURRENT-`.** There is
exactly one.

- File: `builds/CURRENT-brutus-astra-e1-standalone.html`
- Size: 10,399,013 bytes
- SHA-256: `9968eae9b691d3c3f8b8985ec470140e3d064bb64f84629eb20ac35ea6097b90`
- New in this build (fixes from Muse's 2026-10-12 playtest):
  - The deck is chosen once, on the Deploy screen (Warrior / Priest buttons, last
    pick remembered). The dungeon no longer asks again.
  - Every floor has a straight route: entrance → rest area → stair room (on B3F,
    the boss room). The stairway down shows gold with a ▼ on the minimap once seen.
    The rest of each floor is still random.
- Everything from the previous entry (2D fist, boss loot, lockout 2-5, angry
  dungeons, no elements, guild contracts, upkeep paused) is unchanged.
- Card faces load from `art/card-faces/` next to the file, so open the build from
  a full checkout of the repo; a lone copy of the file shows blank card faces.
- Tests: all suites PASS on this file (S1, ow-bridge, E1, contracts, conquest,
  boss loot, no elements, playtest fixes). Headless Chrome: deploy → dungeon with
  the picked deck and no prompt; minimap stair marker; zero page errors.
- Details: `work/claude/playtest-fixes/DONE.md`.

---

# Current build (2026-10-12, 2D fist sprite)

**The playable build is the file whose name starts with `CURRENT-`.** There is
exactly one.

- File: `builds/CURRENT-brutus-astra-e1-standalone.html`
- Size: 10,393,674 bytes
- SHA-256: `b39fe11cea823f137e10e6ab3645c1c20c5f91564059477d489452487a2083f0`
- New in this build (Robert, 2026-10-12: keep 2D sprites, extremely readable,
  no visual noise): the first-person weapon is now a flat 2D sprite, Brutus's
  wrapped fist and forearm (the binding guide makes him a fistfighter), drawn in
  code as a placeholder: one silhouette, thick outline, flat values. It moves in
  2D only (pull back on windup, drive toward centre on the hit, scaled by weight;
  guard; stun; walk bob), so it never turns edge-on. `WEAPON2D_STYLE='sword'` in
  `work/claude/sprite-weapon/weapon2d-dungeon.js` restores a sword drawn the same way.
- Everything from the previous entry (boss loot, lockout 2-5, angry dungeons, no
  elements, guild contracts, upkeep paused) is unchanged.
- Tests: all six suites PASS on this file. Headless Chrome screenshots of idle,
  a five-frame punch sequence and guard in the training room; zero page errors.
- Related: `art/visual-guide/proposals/2026-10-12-sprite-readability.md`
  (proposal, not binding until Robert approves).

---

# Current build (2026-10-11, boss loot, angry dungeons, no elements)

**The playable build is the file whose name starts with `CURRENT-`.** There is
exactly one.

- File: `builds/CURRENT-brutus-astra-e1-standalone.html`
- Size: 10,389,539 bytes
- SHA-256: `5c19cde9b567e01fe27d21999450fc2f32e893c912d728168ac346f7343b97b7`
- New in this build (Robert, 2026-10-11, playtest):
  - **Boss loot, always a cut above generic at that level:** rolls one rarity tier
    above a generic drop at the same level, never below that level's usual
    rarity, and beats the same slot/level/rarity on every stat. A random **1-5**
    drops per clear, plus one on a dungeon's first clear. Named by the dungeon's
    boss set (e.g. "Thorn Banded Mail"); set bonuses for these come later.
    Signature item per dungeon: 15% per clear, +10% per miss, once.
  - **Lockout:** a conquered dungeon (warden slain, boss chest looted) is locked
    out for a random **2-5** turns.
  - **Angry dungeons:** the third looting of a dungeon (placeholder) breaks the
    lockout at once and a rare monster moves onto the second floor (Gravemaw,
    The Pale Hunter or Old Ratchet: x3-4 HP, x1.35-1.5 damage). While angry,
    conquests don't lock it out. Killing the rare monster calms it.
  - **No elements:** items carry plain names and plainly described effects;
    element set bonuses are off; granted cards unchanged.
  - Upkeep still paused; guild contracts unchanged.
- Source: `work/claude/no-elements/`, `work/claude/conquest/` (conquest,
  boss loot), composed by `build-e1.cjs`. Baseline unchanged.
- Tests (exact file): S1, E1, guild contracts, conquest, boss loot and no-elements
  suites PASS; boss loot and no-elements run against the real loot code. Headless
  Chrome: one dungeon looted three times (lockouts of 5 and 3 turns, then angry),
  rare monster announced on descent, calmed after it died, no element words on
  the equipment screen; zero page errors.
- Not played live: fighting the warden or the rare monster (scripted player
  cannot reach them); returns go through the real exit message.

---

# Previous current build (2026-10-11, conquest + upkeep paused)

**The playable build is the file whose name starts with `CURRENT-`.** There is
exactly one.

- File: `builds/CURRENT-brutus-astra-e1-standalone.html`
- Size: 10,379,119 bytes
- SHA-256: `0eee9e7ffbb3d55a40442b7bcd2e5eae0f0716b78c39a14d2eed714a20ca1f38`
- New in this build (Robert, 2026-10-11, playtest):
  - **Upkeep paused.** Brutus's per-turn roster upkeep is not charged
    (`UPKEEP_PAUSED` in `work/claude/conquest/conquest-world.js`; flip it to resume).
  - **Conquered dungeons.** The warden room now has a boss chest that opens only
    after the warden falls. Return with the warden slain and the chest looted and
    the dungeon stays on the board but is inert for 3 turns (`CQ_INERT_TURNS`,
    placeholder for Robert's "x turns, tbd"): no contract, access or guests. It
    then reopens with a fresh four-turn window and the same rights holder. Inert
    dungeons still count toward the four-dungeon board. Boss chest contents are
    today's chest supplies, pending a decision.
- Source: `work/claude/conquest/`, composed by `build-e1.cjs` after the guild
  contracts. Baseline unchanged.
- Tests (exact file): S1, E1, guild-contracts and new conquest sandbox tests PASS.
  Headless Chrome: three turns with treasury flat and no upkeep rows; a conquered
  return (warden and chest flags sent through the real exit message) shows in the
  report, the card is inert turns 4-7 and reopens on turn 8; zero page errors.
- Not played live: killing the warden and opening the boss chest (the scripted
  player cannot reach floor 3); covered by the sandbox test.

---

# Previous current build (2026-10-11, guild contracts)

**The playable build is the file whose name starts with `CURRENT-`.** There is
exactly one.

- File: `builds/CURRENT-brutus-astra-e1-standalone.html`
- Size: 10,375,035 bytes
- SHA-256: `9332866043981086652a10f35856afdf82cf1eb36eff552e02041358b08f86cf`
- New in this build: **guild contracts** (Robert, 2026-10-11, playtest defaults).
  Every guild except Brutus's holds the rights to the dungeons in its home region,
  so a dungeon card now names its rights holder and is locked unless Brutus holds
  it (absorbed guild) or no guild lives in that region. **Access** buys one
  expedition (25% of the contract reward). **Ally Access** adds up to two of that
  guild's own members as guests, beyond the two-companion limit (40%). **Ally**
  hires guests from the friendliest guild for a dungeon Brutus already holds (20%).
  Guilds deal only on good terms and never during a war. Guests who die are dead,
  and their guild is told; survivors remember it. Rights and guests last one
  expedition; a dungeon that fails to open keeps them.
- Source: `work/claude/guild-contracts/contracts-world.js` and
  `contracts-dungeon.js`, composed by `build-e1.cjs` (and the e1 launcher). The
  pinned baseline is **unchanged** (`eeeeeae0…283cdb`).
- Tests (2026-10-11, exact file): S1 integration suite PASS; E1 economy suite PASS;
  `work/claude/guild-contracts/contracts.test.cjs` PASS (region and affiliation
  rules, refusals, purchase, guest death and survival, refunds). Headless
  Chrome click-through: locked cards on both Dungeons and World tabs; Ally Access
  booked two guild members; they fought in the dungeon as guests beside Ember and
  Wren; a guest death reached the Chronicle and People ("Deceased"); the dungeon
  relocked; training room unchanged; zero page errors.
- Playtest fixes (2026-10-11): the fourth companion slot trailed past the regroup
  distance in corridors, so a second guest spammed "falls back to you"; guests now
  trail at 5 and 6. The expedition report now counts the contract fee in the
  treasury change, names the guild paid, and lists guests and whether they returned.
- Not exercised in play: a guild refusing (covered by the unit test only); the
  e1 launcher page (needs HTTP).
- Everything below about the training room and the other files in `builds/`
  still applies.

---

# Previous current build (2026-10-11, training room)

**The playable build is the file whose name starts with `CURRENT-`.** There is
exactly one. When the current build changes, the prefix moves to the new file
and comes off the old one, so `ls builds/` always answers the question.

- File: `builds/CURRENT-brutus-astra-e1-standalone.html`
- Size: 10,364,264 bytes
- SHA-256: `8851105d2a9516531f8fab87b9ebfa7013855b3318b8b2afaba6809a7846d954`
- What: everything the previous current build had (S1 playable overworld
  splice, E1 economy adapter, vertical hand cards) **plus the training room**
  (PR #37's feature, now composed in): a header "Training room" button opens a
  one-room practice arena with enemy spawn/clear/reset, recovery on/off,
  enemies attack / hold still, and a last-hit frame-data readout. It costs no
  action and sends nothing back to the world.
- Renamed from `builds/brutus-astra-e1-standalone.html` (old SHA-256
  `4afb89a2…c46028`, removed). Rebuilt with
  `node work/astra/economy-splice/build-e1.cjs`, whose default output is now the
  `CURRENT-` name.
- Pinned baseline: `builds/brutus-1_0_a0mk-kavi-balanced2.html`, **edited in
  place again** to include the training room. New SHA-256
  `eeeeeae0fd4cf32428e40c6d045f851311674c1affef800e5f09abe4bb283cdb`
  (10,284,796 bytes; previous `0576e3fb…287b8d`). Pins updated in `build-e1.cjs`,
  `build-s1.cjs`, `brutus-astra-e1.html` and `brutus-astra-s1.html`.
- Also rebuilt against the new baseline: `builds/brutus-astra-s1-standalone.html`
  (10,352,330 bytes; SHA-256 `326d50e6…4147d1`) — S1 without the E1 adapter, not
  current.
- Tests (2026-10-11, exact file): S1 integration suite PASS on the CURRENT
  file; ow-bridge sim PASS; E1 economy suite PASS. Headless Chrome/SwiftShader
  over file://: overworld renders, Training room opens, spawn + card hit records
  frame data (Skullcracker, wind-up 350ms / recovery 550ms, dealt 14, knockback
  1.7), Leave returns to the world; a real expedition started from the
  overworld's own Take contract -> Descend generates three floors, Exit to map
  returns, Training room button reappears; zero page errors.
- Not exercised: Brutus dying inside the training room; the launcher pages
  `brutus-astra-e1.html` / `brutus-astra-s1.html` (pins updated, but they need
  HTTP and were not loaded).
- Known limitation: Ember and Wren act on their own AI in the training room and
  often kill held-still enemies before Brutus's hit lands. An allies on/off
  toggle would fix it; not added, because it was not approved.
- What the other files in `builds/` are:
  - `brutus-1_0_a0mk-kavi-balanced2.html` — the pinned composition baseline the
    standalones are built from. Not for playing.
  - `brutus-1_0_a0mk-kavi-balanced2-training.html` — superseded. It was
    balanced2 + training room from before the vertical-card change; the training
    room is now in the baseline and the CURRENT build. Kept, not deleted.
  - `brutus-astra-s1-standalone.html` — S1 without E1. Reference.
  - `brutus-astra-e1.html`, `brutus-astra-s1.html` — launcher pages (HTTP only).
  - `balanced`, `fixed`, `merged` — older builds, reference only.

---

# Previous current build (2026-10-09, superseded by the entry above)

- File: `builds/brutus-astra-e1-standalone.html`
- Size: 10,355,431 bytes
- SHA-256: `4afb89a251bbf54c0701b3751099e3467819381d3a969a4b54e7df71c2c46028`
- What: S1 playable overworld splice (PR #34) + E1 economy adapter (PR #36),
  composed from main sources via `work/astra/economy-splice/build-e1.cjs`.
  Pinned baseline `brutus-1_0_a0mk-kavi-balanced2.html`
  (SHA-256 `0576e3fb2486affcf94959301b1e451e74c57ffa7937dceb5a6475d419287b8d`)
  verified before composing.
- Also built: `builds/brutus-astra-s1-standalone.html` (10,343,497 bytes;
  SHA-256 `130c2538644164a74f83676e70b7b9fe6b4abfc23c8349c0f3e2faca4d65c962`)
  — S1 without the E1 adapter.
- Change 2026-10-09 (Muse, at Robert's direction): dungeon hand cards are now
  vertical/portrait (172x252, art on top, name/tier/details stacked below)
  like normal playing cards, instead of the old wide landscape tiles.
  CSS override injected into the DUNGEON_HTML frame head of the baseline;
  baseline hash pins updated in both builders and both launchers.
- Tests (2026-10-08): S1 integration suite PASS (world tick/gates, four verbs,
  save/load, New Run, dungeon Talk/pause); ow-bridge sim PASS; E1 economy
  suite PASS.
- Browser smoke test (2026-10-08, exact file, local Chrome/SwiftShader over
  HTTP): overworld renders fully (treasury, companions, seven towns, live
  world event — a fresh event each load), zero page errors across 4 loads.
- How to run: open the standalone file directly in a browser, or serve the
  repo (`python -m http.server`) and open the `brutus-astra-s1.html` /
  `brutus-astra-e1.html` launchers (those need HTTP, not file://).
- Design caveat (Robert, 2026-10-06): the no-upkeep / class-ladder ruling
  supersedes E1's wage/payroll mechanics. The payroll code ships in this build
  because PR #36 is on main — treat it as legacy pending E2 reconciliation,
  not as the direction. See the E2 brief addendum in
  `briefs/claude/2026-09-24-e2-labor-market-social-engine.md`.
- Supersedes: `brutus-1_0_a0mk-kavi-balanced2.html` as the playable current
  (kept as the pinned composition baseline).

# Current build

- File: `builds/brutus-1_0_a0mk-kavi-balanced2.html`
- Size: 10,275,101 bytes
- SHA-256: `e9ff9c1052b7af3544985d7b38ef681f639f3e82921d43b9386506aa5d0df1f0`
- Bugfix 2026-09-17 (Muse), verified by exact-file playtest 2026-09-18:
  1. Card faces launched from `builds/`: `setCardFace` no longer resets a
     working `../art/...` fallback URL to the broken `art/...` path, and the
     one-shot fallback flag resets when the card URL changes — faces stay
     rendered across re-renders and deck switches. Missing art still hides
     cleanly (title-only).
  2. Combat-log chronology: consequence lines (wall hits, body slams,
     energy-out stuns, knockback kills, ward impacts) are queued per hit and
     flushed after the cause "lands" line — cause, then effect. Applied to
     ordinary hits, armor breaks, stance absorbs, ward absorbs, and Second
     Wind. "Punishes the stun" now only prints when the target was already
     stunned before the hit. Kill lines still follow the killing blow's detail.
- Acceptance: **PLAYTESTED 2026-09-18** — exact file via local
  Chrome/SwiftShader, loaded from `builds/`: Priest faces render at
  naturalWidth 784 and survive 6+ re-renders plus a discipline switch;
  106 combat-log lines across 6 sessions with zero cause/effect inversions
  (e.g. "Brute's heavy lands for 6 — sent flying." then "Ember slams into
  Wren!"); zero page errors across 7 sessions. Umbral Reaper 32/32 and
  Anthem proactive-ward behavior regression-checked.
- Supersedes: `builds/brutus-1_0_a0mk-kavi-balanced.html` (kept for reference).

# Current build

- File: `builds/brutus-1_0_a0mk-kavi-balanced.html`
- Size: 10,273,862 bytes
- SHA-256: `00cddcaccc49474d7dab1d2ca53fe5dab46621bc6b32e05762e0e51398d8fafd`
- Fix patch 2026-09-17 (Muse): Umbral Reaper text 24→32 to match its real
  dmg (BALANCE.md: cost 10→12, dmg 24→32); removed Anthem of the Unbroken's
  three unreachable fallen-companion legacy branches (downed-ally targeting
  pool, 'No fallen companion' gate, downed-target validation) — the card is
  target 'self', a proactive party-wide ward. build.py decision record
  updated to match.
- Contents: Kavi's balance pass over the fixed baseline —
  40-card Priest/Warrior decks (BALANCE.md tables; deploy preview synced,
  0-copy pool cards filtered from listing), Sprinting Cut lunge detection
  fix (+4 when Brutus lunges), Excommunication text (26 dmg, Deafen 2 turns;
  Demon/Undead rider pending R4), Guard Break text (brace-breaking),
  Sprinting Cut text (lunge bonus). Anthem/Last Rite confirmed as
  prevent-death wards (no revive path; complies with 2026-09-15 ruling).
- Acceptance: **PLAYTESTED 2026-09-17** — Kavi's browser playtest of this
  exact file: 3 genuine fights with full chronology (Brutus uses → lands
  for N → goes down → cancels), 40-card decks verified in-game
  (Deck 36 after 4-card hand), card faces render (naturalWidth 784),
  hold-fire → open-fire transition with no back-to-back re-hold,
  phone + desktop HUD. Zero page errors.
- Supersedes: `builds/brutus-1_0_a0mk-kavi-fixed.html` (10,267,745 bytes;
  SHA-256 5450cdfa8a6bcbd58d0dc05ea1449274cbb382f775faf9462abf651bd097a739;
  kept as pre-balance baseline).
- Note: monolith single-file build; the source split is on the KANBAN
  ("no more inline 10MB").
