# Bestiary spec: monster types, and punish windows that scale with strength

Implements `canon/decisions-2026-09-17.md`:
- **#4:** "Use typical well known monsters from pop culture."
- **#6:** "The stronger the monster, the less predictable and easy to
  identify windows — like monster hunter."
- **#1 and #3:** the pacing changes, spec'd at the end.

The overworld already speaks this language: the world events include the
*Elder Vampire's brood*, a *goblin warhost*, a *beast tide* and *"the dead
underneath"* at the drowned shrine. The dungeon should be full of the same
creatures.

## 1. Type tags (the pop-culture convention)

Tags go on the enemy kind as `tags: [...]` plus `caster: true`. The
engine already reads both, through `hasType()` and `isCaster()`. A
monster gets the type the average player would guess on sight.

| Tag | Typical monsters |
|---|---|
| **Undead** | skeleton, zombie, ghoul, ghost / wraith, mummy, vampire, lich, death knight |
| **Demon** | imp, hellhound, succubus, gargoyle-fiend, demon lord |
| **Beast** | wolf, werewolf, giant spider, giant rat, bear, basilisk |
| **Brute** | goblin, orc, ogre, troll, minotaur |
| **Ooze** | slime, gelatinous cube |
| **Construct** | golem, animated armour, mimic |
| **caster** (flag, stacks with a tag) | lich, vampire, necromancer, imp, succubus, goblin shaman, witch, cultist |

Cards that care about types: Smite (20 vs Demon/Undead), Radiant Cleave
(double vs Undead), Excommunication (36 vs Demon/Undead) and Vow of
Silence (casters only).

## 2. The current five kinds, re-skinned

AI, stats and roles stay exactly as built; only the name, tags and art
change. Each archetype was picked because its existing behaviour already
matches the pop-culture monster.

| Built kind | Becomes | Tags | Threat tier | Why it fits |
|---|---|---|---|---|
| Skulker (26 HP, fast, "folds to any solid hit") | **Skeleton** | Undead | 1 | brittle, quick, comes in numbers |
| Grazer (30 HP, herbivore, bolts when hurt) | **Slime** | Ooze | 1 | the classic harmless dungeon critter that wanders off |
| Stalker (36 HP, spots you far off, never loses you) | **Werewolf** | Beast | 2 | scent-tracking hunter |
| Brute (52 HP, slow, hits hard, BRACES) | **Ogre** | Brute | 2 | big telegraphs; the brace reads as the ogre planting its club |
| Overseer (220 HP boss, braces, berserk under 40%) | **Lich** | Undead, caster | 4 | dungeon warden; the brace becomes a bone ward, the berserk a desperation spell |

**Next-wave kinds** (these need sprites from Grok before they can ship):
- **Imp** (Demon, caster, tier 1): gives Demon riders and Vow of Silence
  a cheap target.
- **Vampire** (Undead, caster, tier 3): the elite, and a direct tie-in to
  the Elder Vampire incursion event.
- **Goblin** and **Goblin Shaman** (Brute; the Shaman is a caster, tier
  1): the goblin warhost event.

Once Lich or Imp is live, Vow of Silence goes back into the Priest deck
(one copy, in place of Alms-Taker's Ear).

## 3. Punish windows by strength (Monster Hunter model)

A weak monster fights the same way every time: learn it once and it's
yours. A strong one keeps the same tells but mixes their timing, hides
which attack is coming, and closes its windows faster, so reads are
earned. **Every attack still has a diegetic tell** (pose, weapon, sound),
so a fight can be learned. It just stops being memorised.

Kavi adds these per kind as a `threat` tier, read by the enemy attack
picker and state machine:

| Knob | Tier 1 (Skeleton, Slime, Imp) | Tier 2 (Werewolf, Ogre) | Tier 3 (Vampire, elites) | Tier 4 (Lich, bosses) |
|---|---|---|---|---|
| **Windup jitter** (random ± on windup) | 0% | ±10% | ±20% | ±25% |
| **Delayed release** (holds the pose 250–450ms before swinging) | never | 15% | 25% | 30% |
| **Feint** (windup cancels into a *different* attack) | never | never | 15% | 25% |
| **Combo chains** (next attack starts from recovery) | never | 20%, 2 hits | 35%, up to 3 | 45%, up to 4 |
| **Recovery after an attack** (the punish window) | full, fixed | full; −20% after a combo | random 60–100% | random 50–100% |
| **Shared tells** (two attacks start from the same pose) | none; each attack has its own | none | light and heavy share the first 60% of the windup | heavy and resolute share a tell |
| **Enrage** (existing frenzy under 40% HP) | none | frenzy, then a clear 2s exhausted slump (panting, weapon lowered) | frenzy with windups −20%; exhausted 1–2.5s, random, subtle tell | no guaranteed exhausted state; windows come from whiffs, interrupts, and the recovery of its longest committed attack |
| **Opener** | normal | normal | 20% chance to open with its heavy | 30% chance to open with its ace (resolute) |

Guardrails, carried from Robert's earlier direction:
- **Lethality scales with tier.** A tier-1 monster can never take more
  than 35% of Brutus's max HP in one hit, and a tier-2 monster no more than
  50%. Clamp at damage time, before back-attack and collision multipliers
  stack.
- **No invisible heavy.** An attack dealing more than 15 base damage
  keeps at least 350ms of windup after jitter.
- **The tell never lies about *where*.** A feint can change what's coming
  and when, not which side it comes from. That keeps it readable in first
  person.

These pair with the enemy attack spread in
`work/claude/card-balance-2026-09-16/BALANCE.md`, which adds `jab` and
`swipe`. The spread decides *what* a monster throws. This table decides
*how honestly* it throws it.

## 4. Pacing (R1 yes, R2 no, R3 yes)

- **Brutus energy regen → 3/s.** Scale `REGEN_NORMAL` for Brutus only:
  `4 × (maxEnergy/100) × 1.5 = 1.2` per 400ms tick. Leave stun refill
  (`REGEN_STUNNED`, `REGEN_STUNNED_FAST`) unscaled. At 3/s a stun would last
  ~9s under pressure, which is a different game. Stuns stay at today's
  ~0.8s unpressured and ~2.75s pressured, and Second Wind keeps its role.
  Enemy and companion regen are unchanged.
- **Companion damage: unchanged** (Robert: no).
- **Default difficulty → Normal:** `let difficulty = "normal"`. The button
  stays as a dev tool for now.
