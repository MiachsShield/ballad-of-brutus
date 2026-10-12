# Brief: playtest the CURRENT build (2026-10-12)

From Claude, at Robert's request (2026-10-12: "Is current ready for Muse playtest?" ... "Yes").
Briefs normally go from Muse to the other lanes; this one goes the other way, as a handoff.
Phase reminder (Robert, 2026-10-11): this is a playtest. Nothing needs to be final; play it and
report what it feels like.

## The build

- File: `builds/CURRENT-brutus-astra-e1-standalone.html` on main
- Size: 10393674 bytes · SHA-256: `b39fe11cea823f137e10e6ab3645c1c20c5f91564059477d489452487a2083f0`
- Open the file directly in a browser (no server needed). **Start a New run**: gear from older
  saves keeps old element names.
- Details and test evidence: `builds/current-build.md`. All six suites pass on this exact file.

## What is new since the 2026-10-08 build, and what to try

| # | Feature | Try | Expect |
|---|---|---|---|
| 1 | Training room (PR #37, #39) | Header "Training room" button. Spawn enemies, toggle recovery and enemy attacks, land and take hits | Frame data for the last hit each way; Leave returns to the world; costs no action |
| 2 | Guild contracts (#41) | Dungeons tab | Each card names its rights holder (a guild homed in that region). Locked: Access (25% of reward) or Ally Access (40%, up to 2 guests from that guild) |
| 3 | Guests | Buy Ally Access, delve | Guests fight beside Ember and Wren, tagged "guest". A dead guest stays dead and the guild is told |
| 4 | Conquest and lockout (#42, #43) | Kill the floor-3 warden, open the boss chest beside it, exit | Report shows boss loot; the card reads "Locked out · resets turn N" for 2-5 turns |
| 5 | Boss loot (#43) | Inspect the drops | 1-5 drops (+1 on a first clear), named by dungeon ("Thorn Banded Mail"), better than ordinary loot at that level |
| 6 | Angry dungeon (#43) | Conquer the same dungeon 3 times | Lockout breaks; card says it is angry; a rare monster (Gravemaw, The Pale Hunter or Old Ratchet) prowls floor 2; killing it calms the dungeon |
| 7 | No elements (#43) | Equipment screen, item tooltips, combat log | No Flame/Storm/Rime/Venom/Sun/Shade names, no element set bonuses; effects still fire |
| 8 | Upkeep paused (#42) | End several turns | Treasury does not drop for companion upkeep |
| 9 | 2D fist (#44) | Any fight | First-person view shows Brutus's wrapped fist; punches pull back, drive in, scale by weight |

## Please play these first (never played live)

My scripted player could not reach them, so they are covered by sandbox tests only:
1. Killing the floor-3 warden and opening the boss chest (does the chest stay shut until the
   warden falls? does conquest register?).
2. Fighting a rare monster in an angry dungeon (is it fair? does killing it calm the dungeon?).
3. Brutus dying inside the training room (should log "Brutus is down", and Reset room recovers).
4. Feel of the 2D fist during real fights: readable, too big or small, distracting?

## Known issues (not fixed; Robert has them)

- Secret rooms count again on every re-entry (farmable score, XP, loot level; relic contracts).
- All opening dungeons expire on turn 6, so turn 7 has none; the board refills slowly.
- With guests, four allies swarm every enemy and Brutus lands few hits.
- Every dungeon starts locked, so each expedition begins by buying access.
- Placeholders: lockout 2-5 turns, anger after 3 lootings, contract prices, rare monster has no
  reward, fist is drawn in code.

## Report

Per standing instruction 5: feedback ordered by player impact, in your section of `MEETING.md`,
plus anything blocking in `DISCUSS.md`. Note the exact SHA-256 you played.
