# Muse prep — 2026-10-13 (Claude)

Robert: fix the non-art leftovers from Muse's 2026-10-12 verdict and rewrite the brief;
card names chosen by me ("Automatically choose appropriate names").

## 1. Elemental names (`work/claude/no-elements/rename-names.js`, `rename-save-world.js`)
- 10 cards, 27 abilities and 1 gear card renamed where the name read as an old element (fire,
  lightning, frost, poison, holy/sun, shadow); 13 descriptions/effect texts reworded (Chill → Slow,
  Poison → Bleed, "fire tornado" → "spinning sweep of the censer", …). Full list in the file.
- Cards: BlazeWhirl → Whirling Censer, Radiant Cleave → Consecrated Cleave, Radiant Glare →
  Blinding Glare, Sun-Blind → Dazzle, Rime Shell → Bracing Shell, Toxic Cloud → Choking Dust,
  Frostbite Slash → Hamstring Slash, Venom Strike → Bleeding Strike, Thunderclap → Earsplitter,
  Umbral Reaper → Reaping Blow. Gear card: Cinder Ward → Brace Ward.
- Abilities (Muse's examples): Storm-eye → Patient eye, Storm of shafts → Volley of shafts; also
  Firebolt → Force bolt (the Mage's attack too), Chain lightning → Ricochet bolt, Shadow-quiver →
  Hidden quiver, and so on.
- How: applied to the composed build as text, replacing every quoted occurrence, so the game logic
  that keys on a name changes with it (behaviour identical). Card ids, and so card art, unchanged.
  Checked: no new name collides with an existing one. The build script and launcher both apply it.
- Old saves: abilities, unique holders and gear cards stored under old names are renamed on load.
- Left as is: the unused element code inside the baseline (`ELEMENT_ADJ`, set-bonus code). #43
  already switches it off at runtime; removing it needs a baseline edit.

## 2. Monsters in the camera (`muse-prep-dungeon.js`)
Monsters keep personal space from Brutus: skulker 1.7, grazer 1.6, stalker 1.75, brute 1.8,
Overseer 1.8 (they stop advancing at 1.8 on their own; higher would jitter). Inside that they are
eased back along the floor, respecting walls. Brutus's melee reach (2.2) and the monsters' attack
reach (2.4-2.6 with tolerance) are untouched.
Measured in the training room, four monsters around Brutus for 8 s: closest approach before
0.21 (Overseer), 0.47 (Brute), 0.52 (Skulker), 1.01 (Stalker); after 1.8 / 1.8 / 1.7 / 1.75.
Still true: at 1.8 the Overseer (2.6 tall) has its head above the frame.

## 3. Training room Reset
It already cleared spawned monsters (checked: 2 spawned → 0 after Reset, figures too). What went
wrong was that Reset asked for the deck again and left the view black until you picked. Reset
now keeps the deck you were using.

## Tests
All 11 suites PASS on the new CURRENT. Headless Chrome: dungeon flow (checkpoint, resume, boss,
trip home, lockout), deck choice, status and market screens, personality scan, training room;
zero page errors.
