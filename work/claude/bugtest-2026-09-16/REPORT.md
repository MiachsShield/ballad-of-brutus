# Bug test — `brutus-1_0_a0mk-kavi-fixed.html` (also C5 design review)

Build: `builds/brutus-1_0_a0mk-kavi-fixed.html`, SHA-256
`5450cdfa8a6bcbd58d0dc05ea1449274cbb382f775faf9462abf651bd097a739` — matches
`builds/current-build.md`.

## How I tested

Headless Chromium (Playwright), real clicks and keys, plus an instrumented
copy of the build with one line added at the end of the dungeon script
(`window.__T = src => eval(src)`) so a test can read and set combat state.
The shipped file was not modified. Six test passes:

1. **World:** 10 consecutive End turns; a full 6-question interview with
   Nessa Rook (Grok's soft-lock case); a second interview abandoned
   mid-way.
2. **Card sweep:** every one of the 73 Priest and Warrior cards forced into
   the hand and played against a live enemy.
3. **Clean damage check:** all 47 damage cards played against a frozen,
   500-HP target to compare listed damage with damage dealt and hit timing.
4. **Encounters:** 18 staged fights (6 dives × 3 fights), half on the
   default Playtest difficulty and half on Normal, both decks. Each fight
   started with 6 seconds of not playing a card, to test hold-fire.
5. **Second Wind:** forced stuns, with and without enemy pressure.
6. **Card faces:** the build opened from `builds/` (as the repo stores it)
   and from the repo root, with the 11 Priest faces on main.

Headless rendering runs the game clock slower than real time, so
durations below are game-clock measurements or shares, not wall seconds.
The harness is in `harness/`.

## Verified working

| Fix | Result |
|---|---|
| K1 `syncTells` crash | **Pass.** Zero page errors across 18 encounters, the 73-card sweep, 10 world turns and both interviews. |
| K2 dead-hand cycling | **Pass.** Logged "No damage answer in hand — cycling for fresh cards." |
| K3 hold-fire | **Pass, 17 of 18.** Allies held for the full 6 seconds and opened fire on Brutus's first card. See bug 6 for the exception and design note D1. |
| K5 interview abort | **Pass.** Six questions completed; Abandon closes the interview; End turn re-enables; the action is spent. |
| K7 companion XP | Code present in `applyDungeonResult`; not exercised end-to-end. |
| K9 Second Wind card | **Pass.** Appears only while stunned. Clicking it clears the stun, costs 15 HP of 100, sets energy to 9 and starts the 25s cooldown. |
| Card resolution | **Pass.** All 47 damage cards dealt their listed damage. Conditional riders fire (Rigor 12 at full HP). Hits land on the tier windup (light 150ms, medium 350ms, heavy 650ms). |
| "Team (2/3)" label | **Fixed.** Now reads "Team (3/3)". |

## Bugs, by player impact

**1. Card faces never load from where the build lives in the repo.**
`cardFaceUrl()` returns `art/card-faces/<class>/<id>.jpg`, relative to the
HTML file. The build sits in `builds/`, so the browser requests
`builds/art/card-faces/...`, which doesn't exist. I checked both layouts:
from `builds/`, all four hand faces loaded at 0 px wide; the same build
copied to the repo root loaded them at full size. Fix: use
`../art/card-faces/`, or ship the build at the repo root. K8 can't pass
the one-second test in-game until this is fixed.

**2. With a face loaded, one hand card grows to about 570 px tall.** A
card without a face is about 100 px. At a 1400×900 window, the card's
name, cost and damage are pushed below the fold, along with the party
bars. Hands that mix face and no-face cards get uneven heights. Mobile is
worse. The face needs a fixed-height slot, with the name, cost and frame
data always visible.

**3. K4 kill-log order is still wrong in normal play.** The same pattern
showed up in every dive on both difficulties:
- The hit prints before the play: "Brutus's Quick Strike lands for 6." →
  "Brutus uses Quick Strike."
- The cancel prints before the kill: "Ember cancels Firebolt: Skulker is
  down." → "Wren's Arrow lands for 9." → "Skulker goes down."
- Brutus's own cancel is affected too: "Brutus cancels Radiant Cleave:
  Brute is down." prints before the arrow that kills the Brute.

**4. Dead cards in the shipped Priest deck.** Each of these can never
work in a dive:
- **Bulwark Slam** requires 4+ living companions, but dives carry 2. The
  game's own message says: "Needs 4 living companions; this dive supports
  2."
- **Weak Cure** is out-of-combat only, and the Priest deck runs 4 copies.
  This is the "Weak Cure — OUT OF COMBAT ONLY" half of Kavi's dead-hand
  report.
- **Vow of Silence** targets casters. No enemy kind is flagged as a
  caster, so it always reports "No valid target".
- **Smite** (20 vs Demon/Undead) and **Radiant Cleave** (double vs
  Undead) never trigger their riders, because no enemy has a type tag.
  Which enemies are Undead or Demon is a bestiary call for Robert.

**5. Anthem of the Unbroken revives a fallen companion mid-dive.** This
contradicts canon (`decisions-2026-09-15.md` #4: "0 hp is dead", no
revive path). `permadead` is never set in the dungeon file, and
`partyDowned` is read at exit, so a companion revived before leaving
survives. K6's permadeath only applies to companions still down when the
dive ends.

**6. Hold-fire may not re-arm on back-to-back fights (1 of 18).** In a
second fight started right after a kill, Wren fired without a card being
played and without printing "holds fire". My harness reset
`encounter.opened` itself, which may not match how the engine starts a
new encounter. Kavi: please try to reproduce this before treating it as
confirmed.

**7. Warding Chant never leaves the hand.** `repeatable:true` skips the
discard, so it can be played again as soon as its 280ms of frames end: +3
Guard to everyone for 2 energy, over and over. With current energy
regen, that's effectively unlimited.

**8. Several card riders do nothing in the current dungeon.** Guard
Break's "destroy 8 Guard" and Shield Tear's "reduce Guard generation":
enemies never have Guard. Sprinting Cut's "may be played after moving"
is always true in real time. Excommunication's "cannot be healed": no
enemy heals.

## Engine findings that change card balance

**E1. Brutus's energy refills in 2 seconds.** `REGEN_NORMAL = 4` per 400ms
applies to every bar. Enemies and companions run 60–160-point bars, but
Brutus's bar is 20. Energy drains already scale by `maxEnergy/100`
(`incomingDrain`); regen doesn't. Brutus gets 10 energy per second, so a
cost-9 card is paid back in under a second. Card cost barely constrains
play, and only the windup and recovery frames do. This is the leftover
half of the 100→20 bar rescale. Proposal is in the balance doc; it needs
Robert's yes.

**E2. Companions deal most of the damage.** Share of logged damage across
the encounters:

| Difficulty | Brutus | Ember + Wren | Walls / collisions |
|---|---|---|---|
| Normal | 28% | 65% | 7% |
| Playtest | 26% | 58% | 16% |

For "a battlefield game that uses cards," the player's cards are the
minority of the fight.

**E3. Every playtest so far ran on the Playtest difficulty.** The default
is `difficulty = "playtest"`: enemies get 35% HP and deal 25% damage. A
Skulker has 9 HP and a Brute has 18. That's why Grok, Kavi and I all saw
fights end before a card mattered. Future playtests should switch to
Normal. The difficulty button is also a player-facing tier, which Robert
passed on for the dungeon, so it should become dev-only before ship.

**E4. The party HUD's "20/20", "99/99" and "86/86" are energy, not HP.**
Nobody has a numeric HP readout. This refines Kavi's finding #7:
companions don't show HP either. Their HP bar only moves.

**E5. Knockback and collision can multiply a card's listed damage.**
Examples: "Dust in the Eyes lands (unaware) for 9" on a 3-damage card, and
"Skulker hits the wall — 11 more". Robert wants that snowball, and it
feels good. But a light card can land 3–4× its printed number, so card
damage has to be balanced as the baseline, not the ceiling.

## C5 — design review against my specs

- **C3 Second Wind: matches.** It appears as a separate 5th card only
  while stunned and off cooldown, isn't drawn, and keeps the existing
  numbers. One note for Robert: an unpressured stun ends on its own after
  about 0.8s of game clock, so the card flashes and vanishes. Under
  pressure the stun lasts about 2.75s and the card matters. That's the
  right moment for it, so no change is proposed.
- **C4 hold-fire: matches** my one-line ruling. **D1 — amendment
  (my lane):** if the enemy lands a hit on Brutus before his first card,
  allies should open fire too. In testing, companions watched Brutus take
  a Stalker hit for 8 and kept holding. "Take the first shot" means the
  opener is Brutus's. Once the enemy has taken it, holding is just
  standing there.
- **C1/C2:** not implemented yet (queued on Kavi's board). Nothing to
  review.
