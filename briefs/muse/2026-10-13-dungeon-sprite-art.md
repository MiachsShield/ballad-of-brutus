# Brief: dungeon character art (2026-10-13)

From Claude, at Robert's request (2026-10-13: "List all 3d enemies, including brutus fist. Give
design brief on muse for art direction. Have muse make the art assets.").
**Muse owns this one: art direction and making the assets.** Claude wires delivered files into
the build.

## Robert's direction (binding)

- **2D sprites, not 3D models** (2026-10-12): "We'll keep at 2d sprites. Think SMT / Street
  Fighter 3rd Strike / etc. Bodies must be extremely readable. The goal is smooth movement, so
  sprites can't be visually noisy."
- **Visual guide** `art/visual-guide/README.md` is binding on all image work (standing instruction 3):
  action-comedy register (Bravely charm and punch timing, not Souls grit); colour discipline
  (ink, soot violet, oxblood, old brass, bone cloth; saturation only at the point of action);
  "large shape first, action second, costume third"; the Action test (name the move in under a
  second at small size). Dungeon render target: `dungeon-character-style-reference.jpg`.
- Brutus is a **fistfighter** (locked spec in the guide). His first-person view shows his fist,
  not a weapon (Robert, 2026-10-12: "For now").
- Not binding, but written for this job: `art/visual-guide/proposals/2026-10-12-sprite-readability.md`
  (Claude's proposal: silhouette and frame-budget rules). Use what helps; Robert hasn't approved it.

## What is in the dungeon today

| # | Figure | Where it appears | Now | Needs |
|---|---|---|---|---|
| 1 | **Overseer** (warden) | Boss room on every dungeon's last floor; 2.6 tall, the biggest thing on screen | **3D placeholder** (boxes and cylinders: maul, shield) | Full sprite sheet. Highest priority: the boss is the payoff of every run |
| 2 | **Brutus's first-person combat** | First-person, bottom corners (both fists), every fight | **2D placeholder drawn in code** (flat wrapped fist and forearm) | Full animation frame set (spec below). Muse: reads well in fights, but cartoonish next to the painted monsters |
| 3 | **Other companions and guests**: Warrior, Knight, Rogue, Ranger, Mage, Priest | Anyone in your party who isn't Ember or Wren, and every guest from a contract | **3D placeholder**: two stand-ins (robed staff figure, archer figure) | One sheet per class (6). Readable class at corridor distance; a neutral face, since they stand in for many people |
| 4 | **Guild ambush raiders** | Campaign raids on expeditions | **3D placeholder**: the same stand-ins, tinted | Covered by #3 plus a hostile tint, or one raider sheet per class if Muse thinks it's needed |
| 5 | **Skulker, Brute, Stalker, Grazer** | Ordinary dungeon monsters | **One painted still each** (512 px, Grok). No animation, no turning; the game only tints them and bobs them | Full sprite sheets. The existing paintings are the design starting point; they are also busier than Robert's "not visually noisy" |
| 6 | **Rare monsters**: Gravemaw (a Brute), The Pale Hunter (a Stalker), Old Ratchet (a Skulker) | Floor 2 of an "angry" dungeon | **Reuse #5's art**, unchanged | A variant of each base sheet: same skeleton, a distinct silhouette or palette swap so a player knows it is special |
| — | Ember, Wren | Your two starting companions | **Done**: 8-state × 3-direction sheets | Reference for format and finish |

Starting points saved for you: `art/visual-guide/reference/sprite-baseline/current-enemy-sprites.png`
(the four monster paintings) and `ember-sheet-format.png` (Ember's sheet, the format to match).

## Character notes (what each one has to say at a glance)

Use the game's behaviour, not lore, as the brief: the sprite has to telegraph what the monster does.

| Figure | Plays like | Must read |
|---|---|---|
| Skulker | Fast, brittle, comes at you first; quick stabs | Small, twitchy, low; the dagger is the threat |
| Brute | Slow, hits very hard, **braces** (absorbs two hits) | Huge weight; the brace is the planted pose, unmistakable from the quick swing |
| Stalker | Sees you from far, never loses you; quick and heavy attacks | Lean, hunting posture; reads as "it's coming for you" from across a room |
| Grazer | Harmless until hit, then bolts | Big, calm, animal; the flee pose is clearly different from its idle |
| Overseer | Warden; braces, hits harder than a Brute, berserk under 40% HP | The boss silhouette of the game; a distinct berserk look (the game tints it now) |
| Class figures | Fight from the back line with one ranged move (Mage force bolt, Ranger arrow, Rogue thrown knife, Priest smite, Warrior javelin, Knight shield bash) | Class at a glance from costume shape and the move, not colour alone |

The bestiary proposal (`work/claude/bestiary-2026-09-17/BESTIARY.md`) suggests re-skins (Skulker →
skeleton, Brute → ogre, Overseer → lich…). That was never ratified; ask Robert before changing what
a monster *is*. Re-drawing the current designs cleaner is within this brief.

## Technical spec (so the files drop straight in)

**Monster and class sheets** (same as Ember and Wren):
- One PNG per figure, **8 columns × 3 rows of 256 × 256 cells (2048 × 768)**.
- Columns, in order: idle · attack light · attack medium · attack heavy · hurt light · hurt medium ·
  hurt heavy · defeated. Monsters use "attack heavy" for the brace/RESOLUTE pose; the Overseer's
  berserk can be its own sheet (`overseer-berserk.png`) if a tint isn't enough.
- Rows: facing the camera · side view (facing right; the game mirrors it for left) · back.
- Feet on the bottom-centre of each cell, same scale in every cell; the figure fills the cell height
  at its game height (the Overseer is tallest; small monsters leave headroom).
- Background transparent, or flat magenta `#FF00FF` (the game keys it out).
- Files: `art/sprites/<name>.png`: `overseer.png`, `skulker.png`, `brute.png`, `stalker.png`,
  `grazer.png`, `class-warrior.png` … `class-priest.png`, `rare-gravemaw.png`,
  `rare-pale-hunter.png`, `rare-old-ratchet.png`.

**Brutus's first-person combat** (revised 2026-10-14 — Robert's direction; supersedes the
previous single-fist framing):
- Staging (from action-game research): BOTH fists rest SMALL at the **bottom corners**
  (left fist bottom-left, right fist bottom-right, mirrored), centre screen fully open for the
  enemy. The old large centred single-fist framing is retired; the 7 delivered frames
  (`art/sprites/fist/`) are the right arm's base — re-pose them smaller at the corners.
- Every attack: the active fist darts from its corner toward screen centre (toward the enemy)
  and snaps back; it never lingers extended. Heavy attacks move the CAMERA toward the enemy
  instead of drawing a longer arm.
- Transparent PNGs, 1024 × 1024. Wrapped hands, island leather, bone wraps, per the guide;
  light from upper-left, consistent with the monster sheets.
- Files: `art/sprites/fist/<frame>.png` for both arms (left = mirrored right), and
  `art/sprites/kicks/<frame>.png` for the boot (dark island-leather boot, bone-wrapped ankle,
  same painterly finish).

Full animation sequences (all at 60fps; f = frames; unique-cel counts are the smoothness target):
- JAB (right, light) 19f: startup 8 · active 3 · recovery 8. Hitstop 2f, no flash. ~15 cels. (2026-10-14 — Robert: Brutus starts as a DIAMOND IN THE ROUGH — just OUTSIDE pro range (11f/183ms to contact vs the slowest measured pro jab at 175ms). Opening balance anchor: Brutus vs Freja is a DRAW. These are STARTING values — better cards earn better frame data.) Keys: rest → contact
  (scale ~1.35) → rest. ~10 cels.
- CROSS (left, medium) 18f: startup 5 · active 3 · recovery 10. Hitstop 4f, contact tick only. ~14 cels.
- HAYMAKER (right, heavy) 33f: startup 12 (big windup, camera lunges) · active 4 · recovery 17.
  Hitstop 10f, moderate flash. ~24 cels.
- HEADBUTT 29f: startup 10 (camera pushes IN to ~2.2× zoom on the enemy's face, fists drop to
  frame edges) · active 4 (impact at max zoom, crunchy) · recovery 15 (camera pulls back).
  Hitstop 10f, moderate flash. ~22 cels.
- FRONT KICK (medium) 26f: startup 8 (boot chambers from bottom edge, knee up) · active 4
  (boot snaps to centre, sole to camera) · recovery 14. Hitstop 4f, contact tick only. ~20 cels.
- ROUNDHOUSE KICK (heavy) 33f: startup 12 (boot sweeps in from the right) · active 4 ·
  recovery 17. Hitstop 10f, moderate flash. ~24 cels.
- HURT (Brutus takes damage): light 11f / medium 16f / heavy 20f — red edge flash, fists
  flinch inward (guard pose flashes on medium+), camera knock; heavy knockdown 60–75f.
- GUARD (block): instant guard pose + white flash + 4f shake.

Impact rules (every attack; revised 2026-10-14 — Robert):
- The big white impact flash is reserved for CRITS only — never on ordinary hits. Crit = the
  flash (white 6f) + max 12f hitstop + camera zoom punch-in ~1.15× + gold reward flash;
  damage ×1.5.
- Light/medium attacks are smooth: NO white flash. Light: hitstop 1–2f
  (barely a catch), tiny shake. Medium: small 1–2f contact tick only, hitstop 3–4f, small
  shake. Attacks are standalone and sensible — no chain-speedup mechanic (momentum parked
  2026-10-14: at 10f the chained jab felt like a machine gun).
- Heavy: moderate flash 3–4f at reduced intensity (a step below the crit flash), hitstop
  8–10f, shake 8–12f. Enemy hurt flash red (not white) 3–6f on heavy/crit only.
- Freeze attacker and enemy on hitstop, never the input buffer.
- Drop the last 1–2 eased in-between frames before contact (the strike snaps).
- Damage numbers appear AFTER the freeze, never during it.
- In-between easing: strikes ease-out (fast), windups ease-in (slow anticipation),
  recoveries ease-in-out.

## Readability acceptance (check before handing over)

1. Silhouette test: filled solid black, at 64 px tall, you can still tell which figure it is and
   whether it is idle, attacking or bracing.
2. Action test from the guide: name the pose in under a second at small size.
3. Not noisy: big value groups, an ink outline, detail kept to face, hands and the weapon.
   The current paintings are the opposite extreme; Ember's sheet is closer to the target.
4. Consistent light from upper-left across every cell and every sheet.
5. In the game: Claude drops each delivered sheet into the build and sends screenshots at real
   distance (1.8 m, the closest a monster now gets, and across a room) for your review.

## Order

1. **Skulker end to end first** (one sheet), so format, scale and finish are checked once before
   the rest. Then the Overseer, then Brutus's fist.
2. Brute, Stalker, Grazer.
3. Six class sheets.
4. Rare-monster variants.

## Hand-off

Commit the files under `art/sprites/` on your branch, and post in your section of `MEETING.md`
which ones are ready. Claude wires them in, rebuilds CURRENT and posts screenshots. If a file
format can't go through your connector (binary uploads were a problem for card faces), say so in
`DISCUSS.md` and Robert will route it.
