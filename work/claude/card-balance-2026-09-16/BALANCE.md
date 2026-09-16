# Card balance pass — live Priest & Warrior decks (2026-09-16)

Robert: *"I trust your sense in balancing the cards for an exciting dungeon
experience."* This pass balances the 73 cards that actually ship in
`APPROVED_CARDS`, the data the dungeon plays, not the earlier 220-card
design sheets. The rules behind it are in `docs/card-guidelines/README.md`.

**Data:** from this folder, run `python3 build.py`. It reads the live rows
straight out of `builds/brutus-1_0_a0mk-kavi-fixed.html`, applies every
decision below, asserts the deck rules (40 cards, max 3 copies,
signatures at 1) and writes `approved-cards-balanced.json`: the same 73
ids and existing fields, plus `category`, `startup`, `recovery`,
`exposure`, `signature`, `mercyStrike` and `note`. The JSON is generated
rather than hand-committed, so the numbers can't drift from the script.

## What changes, in one screen

| | Before (live) | After |
|---|---|---|
| Deck size | 108 per class, up to 4 copies | **40, max 3 copies** (Robert's rule) |
| Priest: chance a 4-card hand has no damage answer | **12.6%** | **2.0%**, and **0.4%** while Mercy Strike is live |
| Warrior: same | 0.4% | 0.1% |
| Priest cards that can never be played in a fight | Bulwark Slam, Weak Cure ×4, Vow of Silence ×3 | 0 in either default deck |
| Cards that contradict canon | Anthem of the Unbroken (revive) | 0 |
| Frames | one pair per tier, so every Heavy felt identical | per card; signatures slowest (1000/1150, exposure 1.8) |
| Signatures | none recognisable (Priest's biggest hit: 18) | Priest: **Excommunication 26**, plus Bulwark Slam, Last Rite, Anthem · Warrior: **Umbral Reaper 32** |
| Numbers touched | — | 14 rows. Everything else keeps its cost and damage. |

Strong cards stay strong. BlazeWhirl (12 to every enemy for 5), Reckless
Charge (9 for 2) and Candle Prayer (4 damage + 4 heal for 1) are untouched
on purpose. They're the cards players will fall in love with.

## Default decks

### Priest — default deck (40)

| Card | Cat | Tier | Cost | Dmg | Frames ms | Exp | Copies |
|---|---|---|---|---|---|---|---|
| Excommunication ★ | finisher | Heavy | 10 | 26 | 1000/1150 | 1.8 | 1 |
| Heavy Blow | offense | Heavy | 7 | 18 | 650/900 | 1.6 | 1 |
| BlazeWhirl | offense | Medium | 5 | 12 | 420/620 | 1.4 | 2 |
| Smite (Priest) | offense | Medium | 5 | 14 | 380/560 | 1.3 | 3 |
| Cleave | offense | Medium | 4 | 10 | 350/550 | 1.3 | 2 |
| Rigor | offense | Light | 3 | 7 | 180/260 | 1.2 | 2 |
| Surge | offense | Light | 2 | 5 | 150/250 | 1.2 | 2 |
| Quick Strike | offense | Light | 1 | 6 | 150/250 | 1.2 | 3 |
| Bulwark Slam ★ | defense | Heavy | 14 | 30 | 900/800 | 1.5 | 1 |
| Anthem of the Unbroken ★ | defense | Heavy | 10 | — | 800/900 | 1.6 | 1 |
| Vanish Step | defense | Light | 2 | — | 150/250 | 1.2 | 1 |
| Warding Word | defense | Support | 2 | — | 100/180 | 1.1 | 2 |
| Warding Chant | defense | Support | 2 | — | 100/180 | 1.1 | 1 |
| Last Rite ★ | heal | Heavy | 8 | — | 200/350 | 1.6 | 1 |
| Mending Light ✚ | heal | Support | 3 | — | 260/320 | 1.1 | 2 |
| Field Mending ✚ | heal | Support | 2 | — | 220/300 | 1.1 | 1 |
| Weak Cure ✚ | heal | Light | 1 | — | 150/220 | 1.2 | 2 |
| Candle Prayer | heal | Light | 1 | 4 | 150/230 | 1.2 | 3 |
| Benediction | buff | Support | 4 | — | 250/300 | 1.1 | 1 |
| Blessing | buff | Light | 2 | — | 150/250 | 1.2 | 2 |
| Sun-Blind | debuff | Heavy | 7 | 6 | 700/900 | 1.6 | 1 |
| Paralytic Rite | debuff | Support | 5 | — | 300/400 | 1.1 | 1 |
| Radiant Glare | debuff | Medium | 4 | 8 | 420/600 | 1.4 | 1 |
| Binding Psalm | debuff | Support | 3 | — | 100/180 | 1.1 | 1 |
| Dust in the Eyes | debuff | Light | 2 | 3 | 150/250 | 1.2 | 2 |

**Priest pool (not in default deck, 13):** Absolution (heal), Alms-Taker's Ear (buff), Choir of Iron (defense), Confessor's Leverage (debuff), Consecrated Ground (heal), Hymn of Vigor (buff), Radiant Cleave (offense), Rite of the Held Wound (defense), Sacrament of Nerve (buff), Sanctuary Step (defense) _(needs a floor click mid-fight; stays out of the default deck until placement works from the keyboard)_, Second Breath (heal), Steady Hands (buff), Vow of Silence (debuff) _(no enemy in the dungeon is a caster yet, so it can never find a target)_

### Warrior — default deck (40)

| Card | Cat | Tier | Cost | Dmg | Frames ms | Exp | Copies |
|---|---|---|---|---|---|---|---|
| Umbral Reaper ★ | finisher | Heavy | 12 | 32 | 1000/1150 | 1.8 | 1 |
| Killing Shout | offense | Heavy | 9 | 22 | 750/950 | 1.6 | 1 |
| Last Man | offense | Heavy | 8 | 20 | 650/900 | 1.6 | 1 |
| Great Cleave | offense | Heavy | 7 | 16 | 700/950 | 1.6 | 1 |
| Breaker Chain | offense | Medium | 6 | 15 | 400/600 | 1.3 | 1 |
| Executioner's Tempo | offense | Medium | 5 | 13 | 350/550 | 1.3 | 2 |
| Ground Slam | offense | Medium | 5 | 12 | 420/620 | 1.4 | 2 |
| Skullcracker | offense | Medium | 5 | 14 | 350/550 | 1.3 | 2 |
| Riposte Cut | offense | Medium | 4 | 11 | 350/550 | 1.3 | 2 |
| Throw the Axe | offense | Medium | 4 | 12 | 400/500 | 1.3 | 2 |
| Crushing Helm | offense | Light | 3 | 8 | 150/250 | 1.2 | 2 |
| Sprinting Cut | offense | Light | 3 | 8 | 150/250 | 1.2 | 1 |
| Reckless Charge | offense | Light | 2 | 9 | 200/280 | 1.2 | 3 |
| Guard Break | offense | Light | 2 | 6 | 150/250 | 1.2 | 2 |
| Shoulder Check | offense | Light | 1 | 5 | 150/250 | 1.2 | 2 |
| No Retreat | defense | Support | 3 | — | 100/180 | 1.1 | 1 |
| Rime Shell | defense | Support | 3 | — | 100/180 | 1.1 | 1 |
| Iron Jaw | defense | Support | 2 | — | 100/180 | 1.1 | 2 |
| Challenge | defense | Support | 2 | — | 100/180 | 1.1 | 1 |
| Rally Banner | buff | Support | 2 | — | 100/180 | 1.1 | 1 |
| Battle Breath | buff | Support | 2 | — | 100/180 | 1.1 | 1 |
| War Cry | buff | Light | 1 | — | 150/250 | 1.2 | 1 |
| Thunderclap | debuff | Medium | 6 | 10 | 450/650 | 1.4 | 1 |
| Venom Strike | debuff | Light | 3 | 6 | 150/250 | 1.2 | 1 |
| Sweeping Leg | debuff | Light | 2 | 5 | 150/250 | 1.2 | 1 |
| Feint High | debuff | Light | 2 | 5 | 150/250 | 1.2 | 1 |
| Pommel Tap | debuff | Light | 1 | 4 | 150/250 | 1.2 | 2 |
| Kick the Knee | debuff | Light | 1 | 3 | 150/250 | 1.2 | 1 |

**Warrior pool (not in default deck, 7):** Dual Hew (offense), Frenzy Step (buff), Frostbite Slash (debuff), Line Breaker (offense), Shield Tear (offense) _(reduces enemy Guard generation; enemies don't generate Guard yet)_, Toxic Cloud (debuff), Warlord's Due (buff)

## Every changed row

| Class | Card | Change | Why |
|---|---|---|---|
| Priest | Weak Cure | text → “Heal 6. Mercy Strike.” | Was out-of-combat only: 4 dead copies in a combat deck. Now playable in combat, and turns into damage when nobody needs healing. |
| Priest | Bulwark Slam | text → “Resolute: the windup shrugs off 2 hits. Deal 30 damage and gain 10 Guard.” | Required 4+ living allies; dives carry 2, so it could never be played. Now the Priest copy of Brutus's own Bulwark Slam. |
| Priest | Field Mending | text → “Heal all allies for 4. Mercy Strike (hits every enemy in the room).” | Mercy Strike added (see guidelines §6). |
| Priest | Warding Chant | text → “All allies gain +4 Guard.” | 'Repeatable' meant it never left the hand: 3 Guard to everyone every ~0.3s. Removed; +1 Guard to compensate. |
| Priest | Mending Light | text → “Heal an ally for 10. Mercy Strike.” | Mercy Strike added (see guidelines §6). |
| Priest | Hymn of Vigor | cost 3→2; energy 3→8; text → “You gain 8 energy. Companions gain 20 energy.” | +3 energy is 0.3s of regen for Brutus and 3% of a companion's bar. Scaled to each bar. |
| Priest | Absolution | cost 6→5; text → “Remove all debuffs from allies and Heal all allies 8. Mercy Strike.” | Cost 6 for cleanse + 6 was the worst rate in the pool. |
| Priest | Anthem of the Unbroken | text → “For 2 turns, any ally who would fall stays at 1 HP instead. All allies gain +6 Guard.” | Revived a fallen ally — contradicts Robert's 2026-09-15 ruling (0 HP is dead, no revive path) and Kavi's K6. Same fantasy, delivered before the fall. |
| Priest | Sun-Blind | tier Medium→Heavy; cost 5→7 | Blinding the whole room for 8s at cost 5 made Radiant Glare pointless. Priced as the premium blind. |
| Priest | Second Breath | text → “Heal 8. If you are below 25% HP, Heal 14 instead. Mercy Strike.” | Mercy Strike added (see guidelines §6). |
| Priest | Excommunication | cost 8→10; dmg 16→26; text → “Deal 26 damage (36 to Demon or Undead). The target is Deafened (-2 attack) for 2 turns.” | Was cost 8 / 16 dmg with a no-heal rider that does nothing (no enemy heals). Priest had no real finisher; this is it. |
| Warrior | Guard Break | text → “Deal 6 damage. Destroy 8 Guard, and break an active Resolute brace.” | Enemies never have Guard, so the rider did nothing. Brutes BRACE — this is now the Warrior's cheap answer to it. |
| Warrior | Sprinting Cut | text → “Deal 8 damage. +4 damage if Brutus had to lunge to reach the target.” | 'May be played after moving' is always true in real time. Rewarded the lunge instead. |
| Warrior | Umbral Reaper | cost 10→12; dmg 24→32 | 24 for 10 was barely above Killing Shout (22 for 9). The signature should be recognisably the biggest swing in the deck. |

★ signature · ✚ Mercy Strike

## Wiring notes for Kavi

1. **Per-card frames and exposure.** `compileBalancedRow` overwrites these
   from the tier. Change to `startup: row.startup ?? frames[0]`,
   `recovery: row.recovery ?? frames[1]`, `exposure: row.exposure ?? (tier
   heavy ? 1.6 : 1.2)`.
2. **Pool cards.** `deck_copies: 0` already works; the `buildDeck` loop runs
   zero times. The UI line "108 cards + equipment" should read the real
   total.
3. **Priest Bulwark Slam.** Delete the `allies ≥ 4` check in `cardPlayable`.
   Set `resolute: true, armorHits: 2` (already in the row).
   `commitBalanced` needs the same Resolute setup the base commit path does
   at line ~1250 (`brutus.resolute.active = true; hitsLeft = armorHits`), or
   the armor never arms.
4. **Weak Cure.** Delete the `inCombat` block.
5. **Mercy Strike** (`row.mercyStrike`). Before resolving the heal: if
   `friendly().every(c => c.hp/c.maxHp >= 0.7)`, deal `floor(heal × 0.75)`
   to the current enemy target instead. Field Mending and Absolution hit
   every enemy in `combatEnemies()`. Log line: "Mercy Strike — Weak Cure
   burns for 4."
6. **Anthem of the Unbroken.** Replace the revive case: for 2 beats, any
   ally reaching 0 HP is set to 1 HP instead (the same mechanism as
   `lastRiteUntil`, applied to all allies), plus +6 Guard. Target becomes
   self, not "fallen ally".
7. **Warding Chant.** `repeatable: false`; guard 3 → 4.
8. **Excommunication.** 26 damage, 36 vs Demon/Undead; apply `deafUntil` for
   2 beats (the same status Thunderclap uses). Drop `noHealUntil`.
9. **Guard Break.** After `removeGuard`, if `t.resolute?.active`, break it
   the way a `control` hit does.
10. **Sprinting Cut.** +4 damage when `brutus.lunging` was true at commit.
11. **Umbral Reaper, Sun-Blind, Absolution, Hymn of Vigor.** Numbers or
    energy only; Hymn restores 8 to Brutus and 20 to each companion.
12. **Deck-choice labels.** The two deck buttons should show 40.

## Pacing — needs Robert's yes before anyone builds it

These aren't card rows, but they decide whether the cards above feel like
anything. Evidence is in `work/claude/bugtest-2026-09-16/REPORT.md` (E1–E3).

**P1 — Brutus energy regen: 10/s → 3/s.** `REGEN_NORMAL` isn't scaled to
Brutus's 20-point bar, though drains already are. At 10/s a cost-12
signature is paid back in 1.2s, so cost means nothing. At 3/s:
lights stay near-free, a Medium is a ~1.5s decision, a Heavy is ~3s, and
a signature is a 4s commitment. That's what makes a finisher feel like a
finisher. Implementation: `regen × (maxEnergy / 100) × 1.5` for Brutus only;
stun refill rates scaled the same way. Every cost in this pass is priced
for 3/s and still works at 10/s. At 10/s only the frames constrain play.

**P2 — companions deal ~65% of the damage at Normal; Brutus deals 28%.**
Proposal: companion ranged damage × 0.6 (Firebolt 17→10, Arrow 9→5,
etc.), so Brutus is at least half the fight. The companions still matter:
they interrupt, finish runners, and pull aggro. Robert wants confident
players to "blaze through mobs", which should come from Brutus's hand,
not from standing behind Ember.

**P3 — playtest on Normal.** The default `difficulty = "playtest"` gives
enemies 35% HP (Skulker 9, Brute 18). Every playtest to date, including
mine, ran on it. That alone explains "fights resolve themselves". Flip
the default to Normal for team playtests, and make the button dev-only
before ship, since Robert passed on player-facing difficulty tiers.

## Enemy card spread (Robert asked for a spread of strength and windup/recovery)

Today five kinds share four attacks (`quick`, `heavy`, `resolute`,
`frenzy`), and no enemy has a mid-weight. Proposed `ENEMY_ATTACKS`
additions and kits:

| Attack | Tier | Windup | Recovery | Dmg | Notes |
|---|---|---|---|---|---|
| jab (new) | light | 400 | 300 | 5 | the poke that punishes a greedy windup |
| quick | light | 550 | 350 | 8 | unchanged |
| swipe (new) | medium | 850 | 420 | 14 | the bread-and-butter hit that was missing |
| heavy | heavy | 1500 | 450 | 22 | unchanged; the big readable tell |
| resolute | heavy | 1300 | 500 | 26 | unchanged; armored |
| frenzy | medium | 420 | 250 | 24 | unchanged; enrage only |

| Kind | HP | Kit (weights) | Identity |
|---|---|---|---|
| Skulker | 26 | jab ×2, quick ×2, heavy ×1 | fast and brittle; death by a thousand pokes, one lunge to respect |
| Stalker | 36 | quick ×2, swipe ×2, heavy ×1 | steady and relentless; the mid-weight fighter |
| Brute | 52 | swipe ×2, heavy ×2, resolute ×1 | slow, big telegraphs, braces; the reason Guard Break and control exist |
| Grazer | 30 | jab ×1 | herbivore; bolts when hurt |
| Overseer | 220 | quick, swipe, heavy, resolute; 30% chance to open with resolute | boss: sometimes leads with its ace (Robert's KH-style surprise) |

Optional, needs **[Robert]**: after a frenzy burst, 2s "exhausted" (slower,
+25% damage taken), the Rathalos-out-of-fire punish window.

## Open for Robert

- **P1–P3 above:** yes or no.
- **Enemy tags:** which kinds are Undead or Demon, and is any enemy a
  caster? Until then Smite's and Radiant Cleave's bonuses are upside only,
  and Vow of Silence stays in the pool.
- **Cross-class signature access:** reading (A) a shared pool, or (B) a
  guaranteed own-class signature. Still unanswered from the earlier
  follow-up.
