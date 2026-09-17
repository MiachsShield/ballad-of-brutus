# Card Guidelines — The Ballad of Brutus

**Status:** working rules for every combat card, whether player, companion
or enemy. Written 2026-09-16 by Claude. Per `canon/decisions-2026-09-15.md`,
card balance is Claude's call and Robert has veto. Robert's 2026-09-17
answers (`canon/decisions-2026-09-17.md`) are folded in.
`art/visual-guide/README.md` stays binding for the art itself; this file
adds the card-specific rules on top.

Companion files:
- `swatches.svg` — the six category colours.
- `color-grades.png` — the same face re-lit six ways. Sent to Robert in
  chat; Kavi uploads it, since the text connector can't commit images.
- `work/claude/card-balance-2026-09-16/` — the numbers pass these rules
  produced.
- `work/claude/bestiary-2026-09-17/BESTIARY.md` — monster types and
  punish windows.

---

## 1. The card in one line

**One trigger, one effect, one cost, always visible.** If a card needs two
sentences to explain what it does, it's two cards.

A card is fully described by these fields in `APPROVED_CARDS` (the new ones
are marked ◆):

| Field | Meaning |
|---|---|
| `name`, `id`, `class` | `id` is the art filename: `art/card-faces/<class>/<id>.jpg`. Never rename an id once art exists. |
| `tier` | Light / Medium / Heavy / Support. Sets the default frames. |
| `cost` | Energy on Brutus's 20-point bar (ruling #10: no rescaling). |
| `dmg`, `energy` | Listed damage, and energy gained on play. |
| `effect` | Player-facing text. It must describe only what the engine actually does (§7). |
| `deck_copies` | Copies in the default 40-card deck. `0` = not in the default deck (class pool, or a gear signature). |
| ◆ `category` | offense / defense / heal / buff / debuff / finisher. Drives the art colour (§9). |
| ◆ `startup`, `recovery` | Per-card frames in ms. They override the tier default. |
| ◆ `exposure` | Punish multiplier while committed (§3). |
| ◆ `access` | `general` / `class` / `signature`: who may use the card (§5). |
| ◆ `grantedBy` | Signature cards only: the unique character, ability or gear that grants it. |
| ◆ `mercyStrike` | Heal card that turns into damage when nobody needs healing (§6). |

## 2. Speaking real time with turn-based words

Card text keeps the familiar card-game vocabulary. The engine translates
it:

| Card says | Engine means |
|---|---|
| "1 turn" | one beat = **4 seconds** (`CARD_BALANCE.beatMs`) |
| "this turn" | until the next beat ends |
| "1 tile" / "adjacent" | **2.2 m** (`CARD_BALANCE.tile`) |
| "all enemies" | every aware enemy within 16 m on Brutus's floor |
| "draw a card" | goes to the bonus tray (max 4); overflow is discarded |
| "Guard" | a damage shield that absorbs before HP |

## 3. Tiers, frames, cost

Power is paid for in three currencies: **energy, windup, and recovery.**
Per the visual guide, a stronger card must visibly cost more of at least
one. Melee workhorses are fast to start and pay in recovery. Finishers
are slow in both directions. Brutus regenerates 3 energy per second
(`canon/decisions-2026-09-17.md` #1), so a Heavy is roughly a 3-second
decision and a finisher a 4-second one.

| Tier | Cost | Startup ms | Recovery ms | Exposure | Listed damage | Role |
|---|---|---|---|---|---|---|
| Light | 1–3 | 150–220 | 220–300 | 1.2 | 3–9 | interrupts, pokes, combo starters |
| Medium | 4–6 | 350–450 | 500–650 | 1.3–1.4 (AoE 1.4) | 10–15 | the bread and butter |
| Heavy | 7–9 | 650–750 | 900–950 | 1.6 | 16–24 | commit swings |
| Support | 1–5 | 100–300 | 180–400 | 1.1 | 0 | guards, buffs, heals, control |
| **Finisher** | 10–14 | **≥ 900** | **≥ 1000** | **1.8** | 26–34 | the card you remember; 1 copy |

Protective showpieces are exempt from the finisher frame rule, because
their power is *when* they land. Last Rite (200/350) has to be fast enough
to save a life. Anthem (800/900) and Bulwark Slam (900/800, Resolute) pay
in windup instead.

- **Exposure** is how much extra punishment Brutus takes if hit while
  committed. It's the fairness knob for big cards in real time. Rock-paper-
  scissors: an ordinary hit interrupts any windup → Resolute shrugs off
  ordinary hits → control breaks Resolute.
- **Listed damage is the floor, not the ceiling.** Low-HP bonus, unaware
  bonus, back attacks and wall collisions multiply it; a 3-damage card can
  land for 9. Balance the printed number and let the flow/punish system
  create the highlights.
- **AoE:** about 80% of single-target damage at the same cost, plus longer
  startup.

## 4. Decks

- **A class deck is exactly 40 cards, max 3 copies per card** (Robert,
  2026-09-16).
- **The class pool can be bigger than the deck.** Pool cards sit at
  `deck_copies: 0` until a deckbuilder lets players swap them in. The
  default deck is a curated ~24–25 uniques, not a near-singleton pile of
  all 38. That keeps workhorses familiar (×2–3) and finishers special
  (×1).
- **Gear signatures ride on top of the 40.** Equipment adds its signature
  card at **1 copy** per granted card. A class default deck never contains
  gear cards itself.
- **No card is dead forever.** Pool cards are there because they're
  situational or waiting on an engine feature, never because something
  strictly better replaced them. Rarity must not be a strict upgrade.
- **Composition targets** (share of the 40):

| Class | Offense + finisher | Heal | Defense | Buff | Debuff |
|---|---|---|---|---|---|
| Priest | ~38% | ~22% | ~15% | ~8% | ~18% |
| Warrior | ~62% | 0% | ~12% | ~8% | ~18% |

- **Dead-hand test:** the chance that a fresh 4-card hand holds no
  damage-capable card must be **under 3%**. It's a hypergeometric check,
  C(non-damage cards, 4) / C(40, 4); `build.py` prints it. Mercy Strike
  cards count as damage only when noted.

## 5. Card access: general, class, signature

Robert (2026-09-17): *"Cards are either general- allowed in all, class
restriction- warrior only, signature- restricted to unique characters,
abilities, or gear."*

| Access | Who can use it | Examples today |
|---|---|---|
| **General** | every deck, any class, any character | Quick Strike, Cleave, Heavy Blow, Weak Cure (Brutus's base kit) |
| **Class** | only that class's decks | Smite, Last Rite, Anthem of the Unbroken (Priest); Skullcracker, Killing Shout (Warrior) |
| **Signature** | only the unique character, ability or gear that grants it | Bulwark Slam (Brutus's Resolute stance); BlazeWhirl, Thunderclap, Frostbite Slash, Venom Strike, Radiant Cleave, Umbral Reaper (weapons); Surge, Blessing, Vanish Step, Rime Shell, Toxic Cloud (accessories) |

Rules that follow from it:

1. **Generics never get signatures** except through a rare ability or
   gear. That's the same door everyone else uses, not a special case.
2. **Signature ≠ strongest.** It says who may hold the card, not how big
   it is. Power comes from the finisher slot (§3), which can be class or
   signature.
3. **Gear signatures don't live in class decks.** They arrive with the
   equipment, 1 copy each, and leave when it's unequipped (the engine
   already strips gear cards on a new loadout).
4. **A unique character's own signature can sit in that character's
   decks.** Bulwark Slam is in Brutus's Priest deck because both decks are
   Brutus's.
5. **Every class needs a class finisher,** so a player without rare gear
   still has a card worth waiting for: Excommunication (Priest), Killing
   Shout (Warrior).

## 6. Mercy Strike (heal → damage)

Robert's rule: a cure should be usable as a damage spell when the allies
don't need it.

- **Trigger:** every living ally, Brutus included, is at **≥ 70% HP**
  when the card resolves.
- **Effect:** instead of healing, deal **75% of the heal amount** (rounded
  down) to Brutus's current target. A heal-all card hits every enemy in
  the room.
- **Why 75%:** a heal card turned attack must stay below a dedicated
  attack of the same cost. The Priest should prefer Smite when it's in
  hand, and still never hold a dead Weak Cure.
- Text: add **"Mercy Strike."** to the effect line. The rule is explained
  once in the tooltip, not on every card.

## 7. The engine-truth checklist

Before a card ships, every clause must be reachable in the current
dungeon. Each of these has already produced a dead card:

- [ ] **Party size.** Dives carry Brutus + 2. No "4+ allies" conditions.
- [ ] **Canon.** 0 HP is dead, no revive (09-15 #4). Prevent the fall
      instead.
- [ ] **Enemy tags.** Use the pop-culture convention in
      `work/claude/bestiary-2026-09-17/BESTIARY.md` (skeleton = Undead,
      imp = Demon, lich = Undead caster…). A card whose only effect needs a
      tag stays out of the default deck until a monster with that tag
      ships.
- [ ] **Enemy Guard.** Enemies don't have Guard, so "destroy Guard" riders
      must also do something against Resolute.
- [ ] **Real-time truths.** "May be played after moving" is always true;
      reward what actually varies (a lunge, a back attack, the opener).
- [ ] **Never leaves the hand.** No `repeatable` cards. Frames plus fast
      regen make them infinite.
- [ ] **Out-of-combat only.** Not in a combat deck.
- [ ] **Energy numbers** compared against the bar they land on: +3 energy
      is 15% of Brutus's bar but 3% of a companion's.
- [ ] **Access.** Gear-granted cards are `signature` with `grantedBy`, and
      never carry class deck copies.

## 8. Enemy cards

Enemies use the same grammar: windup, active, recovery, damage, armor
hits. There's no deck and no copies.

- **Kit of 3–5 attacks per kind, spread across the frame range:** one
  fast poke, one or two mid-weights (most of the damage), one heavy, and
  optionally one control or brace.
- **Monsters are pop-culture monsters,** tagged the way players expect
  (Robert, 2026-09-17). Convention and current re-skins are in
  `BESTIARY.md`.
- **The stronger the monster, the less predictable its windows** (Robert,
  2026-09-17, "like Monster Hunter"). Tier 1 fights the same way every
  time. Higher tiers add windup jitter, delayed releases, feints, combos,
  shared tells and shorter random recovery, and bosses give no guaranteed
  exhausted state. Per-tier numbers are in `BESTIARY.md` §3.
- **Always diegetic, always learnable.** Tells come from body, weapon and
  sound, never ground markers. A feint can change *what* and *when*, never
  *where*.
- **Lethality scales with tier.** A tier-1 monster can't take more than
  35% of Brutus's HP in one hit.

## 9. Colour language — the art's grade, not the border

Robert: blue for defense, red for offense, green for heal, as the colour
scheme of the art, not garish borders. Claude picked buff, debuff and
finisher.

### The rule

Every card shares the project base from the visual guide: **ink** shadows,
**soot violet** atmosphere, **bone cloth** figures. **The category lives
in the effect light:** the magic, the impact flash, the rim light it
throws onto figures and cloth, and a light (~10%) push of that hue into
the deepest shadows. The frame, the card chrome and the UI stay neutral
and identical for every card.

This is the gap today: the first 11 Priest faces all use the same gold
light, so BlazeWhirl (offense), Candle Prayer (heal) and Sanctuary Step
(defense) read as one category.

### The six grades

| Category | Name | Effect-light core | Deep / shadow | Shape language | Examples |
|---|---|---|---|---|---|
| **Offense** | Ember Oxblood | `#E0553A` | `#7A1E22` | hard, directional, sparks outward from the impact | Quick Strike, Cleave, BlazeWhirl, Reckless Charge |
| **Defense** | Tempered Steel | `#7FA8D6` | `#243B5A` | planes, shells, braced edges; light held *between* attacker and defender | Warding Word, Iron Jaw, Bulwark Slam, Anthem |
| **Heal** | Verdigris | `#8FD1A0` | `#24503A` | soft rising motes, rounded, gathering *into* a body | Weak Cure, Mending Light, Candle Prayer, Last Rite |
| **Buff** | Old Brass | `#F0C46A` | `#7A5A22` | warm radiating halo *around* an ally; banners, rank, uplift | Blessing, Benediction, War Cry, Rally Banner |
| **Debuff** | Nightshade | `#B585E6` | `#3A2152` | the curse sits *on the enemy*: clinging, choking, drifting | Dust in the Eyes, Radiant Glare, Pommel Tap, Kick the Knee |
| **Finisher** | Incandescent | `#FFF4DC` (white-hot) | `#5A1216` + black crush | the only grade with true white and maximum contrast; widest motion, frame-breaking | Excommunication, Killing Shout, Umbral Reaper (gear) |

### Making each one work

- **Gold is buff now.** It's the house light of the current faces, so
  keep it for buffs and move every other category off it.
- **Debuff pulls the ambient violet down.** Nightshade shares a hue family
  with the soot-violet base, so on debuff cards the background shifts
  toward cold, desaturated ink, and only the curse light is luminous
  violet. The mockup's debuff tile shows the difference.
- **Finisher vs. offense:** offense is red light. Finisher is white-hot
  light *inside* red darkness, with the darkest blacks and brightest
  whites in the set. It should look like the moment before the room goes
  quiet.
- **Showpieces that aren't attacks** (Bulwark Slam, Last Rite, Anthem)
  keep their category colour and get the showpiece treatment: bigger
  light, broader motion, frame break.
- **Hybrids:** one dominant grade (~70% of the light) plus at most one
  accent. The dominant one is the card's `category`. Example: Candle
  Prayer is verdigris, with a small ember spark where it hurts.
- **Tone:** action-comedy register. Luminous and punchy, never muddy;
  saturation appears at the point of action (visual guide, "colour is
  disciplined").

### Accessibility

Red/green is the classic colour-blind confusion, so **shape and value
carry the category too:** offense is hard and outward and high-contrast;
heal is soft and inward, with mid-values. Test every face in greyscale.
If offense and heal read the same, fix the shapes, not the colours.

### Don'ts

- No coloured borders, frames, corner gems or banners. Faces with baked
  ornamental frames (current Last Rite and Sanctuary Step) should be
  re-cropped full-bleed so every face sits in the same UI frame.
- No full-image colour wash that turns skin and bone cloth the category
  colour. Tint the light, not the people.
- No neon, no rainbow, no text or numerals.

### Heads-up for the UI

Overworld ability rarity already uses uncommon **green**, rare **blue** and
unique **red** (`--r-uncommon/--r-rare/--r-unique`). Once cards teach
"green = heal, blue = defense, red = offense", those rarity chips will
mean something else in the player's head. That's a UI call for Robert and
Kavi, not a card change; flagging it early.

## 10. Readability test (every face)

1. **One second at hand size:** name the move from the art (strike, guard,
   heal, curse, finisher).
2. **Category at thumbnail (~120 px):** name the category from the light
   alone.
3. **Cost read:** a 12-cost card looks bigger than a 2-cost card of the
   same category.
4. **Greyscale pass** (§9, accessibility).
