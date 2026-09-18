# Card balance pass — live Priest & Warrior decks

**Updated 2026-09-17** with Robert's answers (`canon/decisions-2026-09-17.md`):
- Card access is **general / class / signature**, and signature cards are
  restricted to unique characters, abilities or gear.
- Energy regen drops to 3/s.
- Companion damage stays as built.
- Team playtests run on Normal.
- Monsters are pop-culture monsters.
- Stronger monsters get less predictable windows.

The monster half lives in `work/claude/bestiary-2026-09-17/BESTIARY.md`.

Robert, 2026-09-16: *"I trust your sense in balancing the cards for an
exciting dungeon experience."* This pass balances the 73 cards that
actually ship in `APPROVED_CARDS`. The rules behind it are in
`docs/card-guidelines/README.md`.

**Data:** from this folder, run `python3 build.py`. It reads the live rows
out of `builds/brutus-1_0_a0mk-kavi-balanced.html`, applies every decision
and asserts the rules:
- 40 cards per deck, max 3 copies;
- finishers at 1 copy;
- no gear signature in a class deck.

It then writes `approved-cards-balanced.json`: the same 73 ids, plus
`category`, `access`, `grantedBy`, `startup`, `recovery`, `exposure`,
`mercyStrike` and `note`.

## What changed on 2026-09-17 (on top of Kavi's balanced build)

Robert's access ruling moves the **11 gear cards** out of the class decks.
Those are the weapon and accessory cards from `WEAPON_CARDS` /
`ACCESSORY_CARDS`: BlazeWhirl, Radiant Cleave, Surge, Blessing, Vanish
Step, Thunderclap, Frostbite Slash, Venom Strike, Umbral Reaper, Rime
Shell and Toxic Cloud. They're signatures now and come with the
equipment. The freed slots go back to class cards. Umbral Reaper was the
Warrior's only finisher, so **Killing Shout becomes the Warrior class
finisher.**

| Card | Kavi's balanced build | Now | Why |
|---|---|---|---|
| P. Cleave | deck_copies 2 | deck_copies 3 | refill to 40 after gear cards left |
| P. Heavy Blow | deck_copies 1 | deck_copies 2 | refill to 40 after gear cards left |
| P. BlazeWhirl | deck_copies 2 | deck_copies 0 | gear signature (Fire weapon) → leaves the class deck |
| P. Surge | deck_copies 2 | deck_copies 0 | gear signature (Lightning accessory) |
| P. Blessing | deck_copies 2 | deck_copies 0 | gear signature (Holy accessory) |
| P. Vanish Step | deck_copies 1 | deck_copies 0 | gear signature (Shadow accessory) |
| P. Field Mending | text “Heal all allies for 4. Mercy Strike.” | text “Heal all allies for 4. Mercy Strike (hits every enemy in the room).” | text: say the Mercy Strike hits every enemy |
| P. Steady Hands | deck_copies 0; frames none | deck_copies 1; frames 100/180, exposure 1.1 | refill to 40 after gear cards left |
| P. Alms-Taker's Ear | deck_copies 0; frames none | deck_copies 1; frames 100/180, exposure 1.1 | refill to 40 after gear cards left |
| P. Hymn of Vigor | energy 3; text “Brutus gains 8 energy, companions gain 20.” | energy 8; text “You gain 8 energy. Companions gain 20 energy.” | data: the energy field still said 3 while the text says 8 |
| P. Radiant Glare | deck_copies 1 | deck_copies 2 | refill to 40 after gear cards left |
| P. Rite of the Held Wound | deck_copies 0; frames none | deck_copies 1; frames 100/180, exposure 1.1 | refill to 40 after gear cards left |
| P. Sun-Blind | tier Medium | tier Heavy | tier label to match its cost 7 and heavy frames |
| P. Rigor | deck_copies 2 | deck_copies 3 | refill to 40 after gear cards left |
| P. Excommunication | text “Deal 26 damage. Deafen for 2 turns.” | text “Deal 26 damage (36 to Demon or Undead). The target is Deafened (-2 attack) for 2 turns.” | Demon/Undead rider switches on with the bestiary tags |
| W. Kick the Knee | deck_copies 1 | deck_copies 2 | refill to 40 after gear cards left |
| W. No Retreat | deck_copies 1 | deck_copies 2 | refill to 40 after gear cards left |
| W. Killing Shout | cost 9, dmg 22, frames 750/950, exposure 1.6 | cost 11, dmg 30, frames 1000/1150, exposure 1.8 | new Warrior class finisher |
| W. Rime Shell | deck_copies 1 | deck_copies 0 | gear signature (Frost accessory) |
| W. Venom Strike | deck_copies 1 | deck_copies 0 | gear signature (Poison weapon) |
| W. Thunderclap | deck_copies 1 | deck_copies 0 | gear signature (Lightning weapon) |
| W. Umbral Reaper | deck_copies 1 | deck_copies 0 | gear signature (Shadow weapon) |
| W. Line Breaker | deck_copies 0; frames none | deck_copies 1; frames 350/550, exposure 1.3 | refill to 40 after gear cards left |
| W. Feint High | deck_copies 1 | deck_copies 2 | refill to 40 after gear cards left |

## Where the decks stand

| | Fixed build (09-16) | Now |
|---|---|---|
| Deck size | 108, up to 4 copies | **40, max 3 copies** |
| Priest no-damage opening hand | 12.6% | **2.0%** (0.4% with Mercy Strike) |
| Warrior no-damage opening hand | 0.4% | **0.1%** |
| Dead cards in a default deck | Bulwark Slam, Weak Cure ×4, Vow of Silence ×3 | none |
| Revive paths | Anthem of the Unbroken | none |
| Class finishers | none | Excommunication 26 (Priest), Killing Shout 30 (Warrior) |
| Gear cards in class decks | 11 | 0 (they arrive with the gear, 1 copy each) |

## Default decks

### Priest — default deck (40)

| Card | Access | Cat | Tier | Cost | Dmg | Frames ms | Exp | Copies |
|---|---|---|---|---|---|---|---|---|
| Excommunication | class | finisher | Heavy | 10 | 26 | 1000/1150 | 1.8 | 1 |
| Heavy Blow | general | offense | Heavy | 7 | 18 | 650/900 | 1.6 | 2 |
| Smite (Priest) | class | offense | Medium | 5 | 14 | 380/560 | 1.3 | 3 |
| Cleave | general | offense | Medium | 4 | 10 | 350/550 | 1.3 | 3 |
| Rigor | class | offense | Light | 3 | 7 | 180/260 | 1.2 | 3 |
| Quick Strike | general | offense | Light | 1 | 6 | 150/250 | 1.2 | 3 |
| Bulwark Slam | signature | defense | Heavy | 14 | 30 | 900/800 | 1.5 | 1 |
| Anthem of the Unbroken | class | defense | Heavy | 10 | — | 800/900 | 1.6 | 1 |
| Rite of the Held Wound | class | defense | Support | 4 | — | 100/180 | 1.1 | 1 |
| Warding Word | class | defense | Support | 2 | — | 100/180 | 1.1 | 2 |
| Warding Chant | class | defense | Support | 2 | — | 100/180 | 1.1 | 1 |
| Last Rite | class | heal | Heavy | 8 | — | 200/350 | 1.6 | 1 |
| Mending Light ✚ | class | heal | Support | 3 | — | 260/320 | 1.1 | 2 |
| Field Mending ✚ | class | heal | Support | 2 | — | 220/300 | 1.1 | 1 |
| Weak Cure ✚ | general | heal | Light | 1 | — | 150/220 | 1.2 | 2 |
| Candle Prayer | class | heal | Light | 1 | 4 | 150/230 | 1.2 | 3 |
| Benediction | class | buff | Support | 4 | — | 250/300 | 1.1 | 1 |
| Alms-Taker's Ear | class | buff | Support | 2 | — | 100/180 | 1.1 | 1 |
| Steady Hands | class | buff | Support | 1 | — | 100/180 | 1.1 | 1 |
| Sun-Blind | class | debuff | Heavy | 7 | 6 | 700/900 | 1.6 | 1 |
| Paralytic Rite | class | debuff | Support | 5 | — | 300/400 | 1.1 | 1 |
| Radiant Glare | class | debuff | Medium | 4 | 8 | 420/600 | 1.4 | 2 |
| Binding Psalm | class | debuff | Support | 3 | — | 100/180 | 1.1 | 1 |
| Dust in the Eyes | class | debuff | Light | 2 | 3 | 150/250 | 1.2 | 2 |

**Priest gear signatures (not in the class deck; +1 copy each when the gear is equipped):** BlazeWhirl (Fire weapon, offense), Blessing (Holy accessory, buff), Radiant Cleave (Holy weapon, offense), Surge (Lightning accessory, offense), Vanish Step (Shadow accessory, defense)

**Priest class pool (not in the default deck, 9):** Absolution (heal), Choir of Iron (defense), Confessor's Leverage (debuff), Consecrated Ground (heal), Hymn of Vigor (buff), Sacrament of Nerve (buff), Sanctuary Step (defense) _(needs a floor click mid-fight; stays out of the default deck until placement works from the keyboard)_, Second Breath (heal), Vow of Silence (debuff) _(needs caster enemies such as a lich, vampire, imp or goblin shaman; joins the deck once those monsters ship)_

No-damage opening hand: **2.0%** (0.4% with Mercy Strike live).

### Warrior — default deck (40)

| Card | Access | Cat | Tier | Cost | Dmg | Frames ms | Exp | Copies |
|---|---|---|---|---|---|---|---|---|
| Killing Shout | class | finisher | Heavy | 11 | 30 | 1000/1150 | 1.8 | 1 |
| Last Man | class | offense | Heavy | 8 | 20 | 650/900 | 1.6 | 1 |
| Great Cleave | class | offense | Heavy | 7 | 16 | 700/950 | 1.6 | 1 |
| Breaker Chain | class | offense | Medium | 6 | 15 | 400/600 | 1.3 | 1 |
| Executioner's Tempo | class | offense | Medium | 5 | 13 | 350/550 | 1.3 | 2 |
| Ground Slam | class | offense | Medium | 5 | 12 | 420/620 | 1.4 | 2 |
| Skullcracker | class | offense | Medium | 5 | 14 | 350/550 | 1.3 | 2 |
| Riposte Cut | class | offense | Medium | 4 | 11 | 350/550 | 1.3 | 2 |
| Throw the Axe | class | offense | Medium | 4 | 12 | 400/500 | 1.3 | 2 |
| Line Breaker | class | offense | Medium | 4 | 11 | 350/550 | 1.3 | 1 |
| Crushing Helm | class | offense | Light | 3 | 8 | 150/250 | 1.2 | 2 |
| Sprinting Cut | class | offense | Light | 3 | 8 | 150/250 | 1.2 | 1 |
| Reckless Charge | class | offense | Light | 2 | 9 | 200/280 | 1.2 | 3 |
| Guard Break | class | offense | Light | 2 | 6 | 150/250 | 1.2 | 2 |
| Shoulder Check | class | offense | Light | 1 | 5 | 150/250 | 1.2 | 2 |
| No Retreat | class | defense | Support | 3 | — | 100/180 | 1.1 | 2 |
| Iron Jaw | class | defense | Support | 2 | — | 100/180 | 1.1 | 2 |
| Challenge | class | defense | Support | 2 | — | 100/180 | 1.1 | 1 |
| Rally Banner | class | buff | Support | 2 | — | 100/180 | 1.1 | 1 |
| Battle Breath | class | buff | Support | 2 | — | 100/180 | 1.1 | 1 |
| War Cry | class | buff | Light | 1 | — | 150/250 | 1.2 | 1 |
| Sweeping Leg | class | debuff | Light | 2 | 5 | 150/250 | 1.2 | 1 |
| Feint High | class | debuff | Light | 2 | 5 | 150/250 | 1.2 | 2 |
| Pommel Tap | class | debuff | Light | 1 | 4 | 150/250 | 1.2 | 2 |
| Kick the Knee | class | debuff | Light | 1 | 3 | 150/250 | 1.2 | 2 |

**Warrior gear signatures (not in the class deck; +1 copy each when the gear is equipped):** Frostbite Slash (Frost weapon, debuff), Rime Shell (Frost accessory, defense), Thunderclap (Lightning weapon, debuff), Toxic Cloud (Poison accessory, debuff), Umbral Reaper (Shadow weapon, finisher), Venom Strike (Poison weapon, debuff)

**Warrior class pool (not in the default deck, 4):** Dual Hew (offense), Frenzy Step (buff), Shield Tear (offense) _(reduces enemy Guard generation; enemies don't generate Guard yet)_, Warlord's Due (buff)

No-damage opening hand: **0.1%** (0.1% with Mercy Strike live).

✚ Mercy Strike

## Every row changed against the fixed build (full pass history)

| Class | Card | Change | Why |
|---|---|---|---|
| Priest | Weak Cure | text → “Heal 6. Mercy Strike.” | Was out-of-combat only: 4 dead copies in a combat deck. Now playable in combat, and turns into damage when nobody needs healing. |
| Priest | Bulwark Slam | text → “Resolute: the windup shrugs off 2 hits. Deal 30 damage and gain 10 Guard.” | Required 4+ living allies; dives carry 2, so it could never be played. Now the Priest copy of Brutus's own Bulwark Slam. |
| Priest | Field Mending | text → “Heal all allies for 4. Mercy Strike (hits every enemy in the room).” | Mercy Strike added (guidelines §6). |
| Priest | Warding Chant | text → “All allies gain +4 Guard.” | 'Repeatable' meant it never left the hand: 3 Guard to everyone every ~0.3s. Removed; +1 Guard to compensate. |
| Priest | Mending Light | text → “Heal an ally for 10. Mercy Strike.” | Mercy Strike added (guidelines §6). |
| Priest | Hymn of Vigor | cost 3→2; energy 3→8; text → “You gain 8 energy. Companions gain 20 energy.” | +3 energy is 0.3s of regen for Brutus and 3% of a companion's bar. Scaled to each bar. |
| Priest | Absolution | cost 6→5; text → “Remove all debuffs from allies and Heal all allies 8. Mercy Strike.” | Cost 6 for cleanse + 6 was the worst rate in the pool. |
| Priest | Anthem of the Unbroken | text → “For 2 turns, any ally who would fall stays at 1 HP instead. All allies gain +6 Guard.” | Revived a fallen ally — contradicts Robert's 2026-09-15 ruling (0 HP is dead, no revive path) and Kavi's K6. Same fantasy, delivered before the fall. |
| Priest | Sun-Blind | tier Medium→Heavy; cost 5→7 | Blinding the whole room for 8s at cost 5 made Radiant Glare pointless. Priced as the premium blind. |
| Priest | Second Breath | text → “Heal 8. If you are below 25% HP, Heal 14 instead. Mercy Strike.” | Mercy Strike added (guidelines §6). |
| Priest | Excommunication | cost 8→10; dmg 16→26; text → “Deal 26 damage (36 to Demon or Undead). The target is Deafened (-2 attack) for 2 turns.” | Was cost 8 / 16 dmg with a no-heal rider that does nothing (no enemy heals). Priest had no real finisher; this is it. |
| Warrior | Guard Break | text → “Deal 6 damage. Destroy 8 Guard, and break an active Resolute brace.” | Enemies never have Guard, so the rider did nothing. Brutes BRACE — this is now the Warrior's cheap answer to it. |
| Warrior | Sprinting Cut | text → “Deal 8 damage. +4 damage if Brutus had to lunge to reach the target.” | 'May be played after moving' is always true in real time. Rewarded the lunge instead. |
| Warrior | Killing Shout | cost 9→11; dmg 22→30; text → “Deal 30 damage. Costs 2 less if any enemy died this turn.” | Umbral Reaper is gear (Shadow weapon), so it's a signature and leaves the class deck. The Warrior needs its own class finisher: Killing Shout, already the deck's biggest class hit. |
| Warrior | Umbral Reaper | cost 10→12; dmg 24→32 | Rare gear should out-swing the class finisher (Killing Shout, 30 for 11) without replacing it: 32 for 12, plus its back-attack bonus. Gear signature (Shadow weapon), outside the class deck. |

## Wiring notes for Kavi

Notes 1–12 from 2026-09-16 are built into `kavi-balanced` and still apply.
New for 2026-09-17:

13. **Access fields.** Carry `access` and `grantedBy` through
    `compileBalancedRow`. Nothing reads them in combat yet, but the future
    deckbuilder and the card tooltip will.
14. **Gear signatures at 1 copy.** In `applyEquipmentLoadout`, the granted
    card's `DECK[id]` becomes `1`, not `3` (or `2` for support). It rides on
    top of the 40-card class deck and leaves when the gear does. The
    gear-to-row lookup matches by name across all `APPROVED_CARDS` rows,
    so it still finds these cards at `deck_copies: 0`; confirm in a dive
    with a Fire weapon equipped.
15. **Killing Shout.** Cost 11, 30 damage, frames 1000/1150, exposure 1.8.
    The existing −2 cost after a kill stays.
16. **Hymn of Vigor.** The row's `energy` field said 3 while its text says
    8. Align both to 8 (pool card, so low urgency).
17. **Sun-Blind.** The tier label goes to Heavy to match cost 7 and its
    700/900 frames.
18. **Pacing and enemies.** `BESTIARY.md` §4 (regen 3/s for Brutus, stun
    refill unchanged, default Normal) and §1–3 (tags, re-skins, tier
    windows).

## Enemy attack spread

These attacks decide *what* a monster throws. How honestly it throws them
is set by its tier, in `BESTIARY.md` §3.

| Attack | Tier | Windup | Recovery | Dmg | Notes |
|---|---|---|---|---|---|
| jab (new) | light | 400 | 300 | 5 | the poke that punishes a greedy windup |
| quick | light | 550 | 350 | 8 | unchanged |
| swipe (new) | medium | 850 | 420 | 14 | the bread-and-butter hit that was missing |
| heavy | heavy | 1500 | 450 | 22 | unchanged; the big readable tell |
| resolute | heavy | 1300 | 500 | 26 | unchanged; armored |
| frenzy | medium | 420 | 250 | 24 | unchanged; enrage only |

| Monster (was) | HP | Kit (weights) | Threat tier |
|---|---|---|---|
| Skeleton (Skulker) | 26 | jab ×2, quick ×2, heavy ×1 | 1 |
| Slime (Grazer) | 30 | jab ×1 | 1 |
| Werewolf (Stalker) | 36 | quick ×2, swipe ×2, heavy ×1 | 2 |
| Ogre (Brute) | 52 | swipe ×2, heavy ×2, resolute ×1 | 2 |
| Lich (Overseer) | 220 | quick, swipe, heavy, resolute; 30% ace opener | 4 |

## Pacing (decided)

- **P1 energy regen 3/s: yes** — spec in `BESTIARY.md` §4.
- **P2 companion damage ×0.6: no** — companions stay as built. Brutus's
  share of the fight has to come from his cards, which is what the class
  finishers and the 3/s regen are for.
- **P3 Normal for team playtests: yes.**

Nothing open for Robert in this file.
