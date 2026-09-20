# Card art prompts — every face still pending

Written 2026-09-19 by Claude, for Grok. Covers every card in the current
Priest and Warrior lists (`work/claude/card-balance-2026-09-16/BALANCE.md`,
Robert's 2026-09-17 pass) that has **no art yet**, plus a short recolor list
for the ones that already have art but need the G4 re-light pass. I'm not
drawing anything — this is the prompt for each one, grounded in what the
card actually does, so a redraw doesn't require guessing at the effect.

Binding on everything below: `art/visual-guide/README.md` (character/tone),
`docs/card-guidelines/README.md` §9 (category light) and
`docs/card-guidelines/readability.md` (the overlay symbol/gem system —
faces stay free of the symbol, name, frame and gems; that's UI, not art).

## Rules that apply to every prompt below

- **Class figure, not Brutus** (Robert, 2026-09-17). Priest cards show a
  Priest-class figure; Warrior cards show a Warrior-class figure. Brutus's
  own locked spec doesn't govern these faces.
- **One readable verb.** A viewer should name the move in under a second —
  strike, guard, heal, curse, buff, finisher. If a prompt below describes
  two things happening, the art should still commit to one as the read.
- **Leave the top ~25% of the frame clear** of critical detail — no faces,
  weapon points, or the focal flash up there. The category symbol and card
  name sit over that band in the UI layer.
- **No baked text, icons, frames, gems, or banners in the art itself.**
  Full-bleed crop, aggressive framing around the action.
- **Tone is action-comedy inside the guide's palette** — Bravely charm and
  punch timing, not Souls grit, not carnival sparks. Faces stay young,
  expressive, and legible, never grim.
- **Category is carried by the effect light**, not a color wash over skin
  or cloth. Tint the light and the impact; keep figures in the base
  ink/soot-violet/bone-cloth palette. Quick reference:

| Category | Light core | Deep/shadow | Shape language |
|---|---|---|---|
| Offense | Ember Oxblood `#E0553A` | `#7A1E22` | hard, directional, sparks outward from impact |
| Defense | Tempered Steel `#7FA8D6` | `#243B5A` | planes/braced edges; light held *between* attacker and defender |
| Heal | Verdigris `#8FD1A0` | `#24503A` | soft rising motes, rounded, gathering *into* a body |
| Buff | Old Brass `#F0C46A` | `#7A5A22` | warm radiating halo *around* an ally; banners, rank, uplift |
| Debuff | Nightshade `#B585E6` | `#3A2152` | curse sits *on the enemy*: clinging, choking, drifting |
| Finisher | Incandescent `#FFF4DC` white-hot | `#5A1216` + black crush | true white, maximum contrast, widest/frame-breaking motion |

- **Cost should read as size.** A 1-cost Light card is a small, contained
  gesture; a 10+-cost Heavy/finisher is a broad, committed motion with
  visible windup. Don't draw a 1-cost card as big as a finisher.
- **Test every face in greyscale** before calling it done — offense and
  heal especially must not collapse into the same read once color is gone.

**Re-checked 2026-09-20** against the actual `APPROVED_CARDS` data in the
live build (`builds/brutus-1_0_a0mk-kavi-balanced2.html`), not just
BALANCE.md's summary table. Every quoted effect below is the card's real,
exact text — nothing is a guess anymore. That surfaced two kinds of
problems, both fixed:

1. **Several of my first-pass prompts described the wrong mechanic** —
   not vague, just factually off (Binding Psalm and Paralytic Rite had
   their effects swapped, Thunderclap and Umbral Reaper were drawn as
   single-target when they're not, a few "buff" cards were drawn as
   single-ally when they hit the whole party, etc.). Every one of those is
   corrected below against the real text.
2. **Two cards have a live number that disagrees with `BALANCE.md`'s
   09-17 pass** — Excommunication and Killing Shout. BALANCE.md is the
   newer, Robert-reviewed design target; the shipped build hasn't caught
   up to it yet. I've kept BALANCE.md's numbers (that's where the card is
   headed) and flagged it inline both places so nobody draws to a number
   that's about to change again.

Numbers and effect text below are the exact `APPROVED_CARDS` fields unless
marked otherwise. Nothing here is an inferred guess anymore — where the
data has no room to guess, I say so; where a mechanic is genuinely open to
more than one plausible visual (rare, now), I flag it explicitly instead
of quietly picking one.

---

## Already drawn — recolor only, no new prompt needed (G4)

These 11 have art on `main` today. They keep their existing composition;
only the effect light and, for Last Rite, the crop change.

| File | Card | Target category | Note |
|---|---|---|---|
| `priest_candle_prayer.jpg` | Candle Prayer | **Heal** (verdigris) | small ember spark accent where it hurts (hybrid, ~70/30) |
| `priest_quick_strike.jpg` | Quick Strike | **Offense** (ember oxblood) | |
| `priest_smite_priest.jpg` | Smite | **Offense** (ember oxblood) | |
| `priest_blazewhirl.jpg` | BlazeWhirl | **Offense** (ember oxblood) | gear signature, Fire weapon |
| `priest_cleave.jpg` | Cleave | **Offense** (ember oxblood) | |
| `priest_dust_in_the_eyes.jpg` | Dust in the Eyes | **Debuff** (nightshade) | pull the ambient toward cold ink, not just the curse light |
| `priest_radiant_glare.jpg` | Radiant Glare | **Debuff** (nightshade) | same |
| `priest_bulwark_slam.jpg` | Bulwark Slam | **Defense** (tempered steel) | signature scale — this is Brutus's Resolute stance on a Priest body; keep the braced, shell-like light |
| `priest_last_rite.jpg` | Last Rite | **Heal** (verdigris) | re-crop full-bleed — current file has a baked frame, remove it |
| `priest_sanctuary_step.jpg` | Sanctuary Step | **Defense** (tempered steel) | lower priority — re-light last |
| `priest_steady_hands.jpg` | Steady Hands | **Buff** (old brass) per current BALANCE.md — **flag:** TASKS.md's G4 note called this pool-only/deprioritized, but the 09-17 balance pass put it back in the Priest default deck at 1 copy as a buff card. Recolor toward buff (brass), not defense; if Kavi says otherwise, hold. |

---

## Priest — pending art (27)

### Default deck, not yet drawn (15)

**Excommunication** — Heavy, cost 10, dmg 26. Finisher.
Effect: "Deal 26 damage (36 to Demon or Undead). The target is Deafened
(-2 attack) for 2 turns." **Flag:** the shipped build currently has this
as "Deal 26 damage. Deafen for 2 turns." with no Demon/Undead bonus at
all — BALANCE.md's 09-17 pass (quoted above) is the newer, Robert-
reviewed number; the live build hasn't caught up yet. Same situation as
Killing Shout in the Warrior section below.
Prompt: the Priest's arm thrown fully forward, a rite gesture mid-shout,
white-hot incandescent light blasting straight through the target rather
than around them — this is the moment the room goes quiet. Widest pose in
the Priest set; deep black crush at the edges of the frame, red undertone
in the shadow per the finisher grade.

**Heavy Blow** — Heavy, cost 7, dmg 18. General.
Effect: "Deal 18 damage. Costs 1 less if the target is Staggered."
Prompt: a wide overhead or hook swing at the top of its arc, body torqued
fully into it, ember-oxblood light sparking outward from where the blow is
about to land. Plain, big, no ornament — this is the generic heavy hit
every class shares, not a class-flavored showpiece.

**Rigor** — Light, cost 3, dmg 7. Offense.
Effect: "Deal 7 damage. If the target is at full HP, deal 12 instead." —
an opening strike that rewards throwing it before the target is already
hurt.
Prompt: a short, tight punch or staff-jab thrown at a target that's still
squared up and unhurt, minimal windup, small hard ember spark right at the
point of contact. Contained gesture — this is a 1–3 cost card, not a
showpiece; the "opening strike" framing (an unmarked, still-fresh unseen
opponent) is the only cue that separates it from a plain jab.

**Anthem of the Unbroken** — Heavy, cost 10. Defense, showpiece.
Effect: "For 2 turns, any ally who would fall stays at 1 HP instead. All
allies gain +6 Guard." (Not a revive — a ward that keeps allies standing.)
Prompt: the Priest plants a staff or raises both arms, a tempered-steel
dome or shell of light expanding outward to enclose the whole party — the
light is held *between* the party and an unseen threat, braced rather than
struck. Broad motion, showpiece scale, but no fallen ally being lifted —
nobody is down in this image, the ward is preventative.

**Rite of the Held Wound** — Support, cost 4. Defense.
Effect: "An ally takes no damage for 1 turn, then takes half the prevented
total." Not a clean prevention like Anthem — the wound is held off, not
erased; part of it comes due next turn. That delayed-payback is the whole
point of the name, and I undersold it in the first pass.
Prompt: the Priest's hand pressed flat over an unseen ally's chest or
shoulder (ally mostly out of frame or just a hand/shoulder edge), a thin
tempered-steel seam of light closing over the point of contact — but let
the seam visibly strain or flicker at one edge, like it's holding
something back rather than sealing it clean. Quiet, small-scale — Support
tier, not a showpiece, but the strain is the detail that keeps it honest
about what the card does.

**Warding Word** — Support, cost 2. Defense.
Effect: "Give an ally +6 Guard."
Prompt: the Priest speaks a short word, one hand raised — a thin steel-blue
plane of light snaps into place in front of one unseen ally. Fast, small,
contained, single target only; this is the cheapest single-target defense
card in the deck.

**Warding Chant** — Support, cost 2. Defense.
Effect: "All allies gain +4 Guard."
Prompt: same gesture family as Warding Word but wider — the Priest's chant
radiates outward as overlapping steel-blue plates or shards settling onto
several unseen figures at the frame's edges, rather than one point of
light. Group-facing, still Support-scale, not a showpiece.

**Mending Light** — Support, cost 3. Heal. Mercy Strike.
Effect: "Heal an ally for 10."
Prompt: a small cluster of verdigris motes drifting from the Priest's
open palm toward an unseen ally, gathering and sinking into them rather
than exploding outward. Gentle, rounded, inward motion — the heal
signature shape.

**Field Mending** — Support, cost 2. Heal. Mercy Strike (hits every enemy
in the room when it turns to damage).
Effect: "Heal all allies for 4."
Prompt: the same rising-motes heal language as Mending Light, but the
motes fan out from the Priest in a low wide arc toward several unseen
allies instead of one. Smaller individual effect than Mending Light, so
keep the motes fewer/thinner per figure — group care, not a big group
heal.

**Weak Cure** — Light, cost 1. Heal, general. Mercy Strike.
Effect: "Heal 6."
Prompt: the cheapest heal in the game — a single small verdigris mote or
two cupped in the Priest's palm, barely a glow. Minimal, almost casual
gesture; this card should look the smallest and quietest in the whole
Priest set.

**Benediction** — Support, cost 4. Buff.
Effect: "All allies gain +2 attack and +4 Guard." Whole party, not one
ally — my first pass drew this as a single-recipient blessing, which
undersells it.
Prompt: the Priest with arms raised rather than a hand on one shoulder, a
warm old-brass halo blooming outward in a ring wide enough to visibly
touch several unseen allies at the frame's edges, not just one figure.
Warm, dignified, not flashy — a moment before the fight, not during it.

**Alms-Taker's Ear** — Support, cost 2. Buff.
Effect: "Draw 2 cards. If you healed this turn, draw 3 instead." This is a
card-draw/tempo effect, not a perception buff — the "Ear" is flavor for
picking up on an opportunity, not the mechanic itself.
Prompt: the Priest tilted slightly, one hand cupped near their own ear as
if catching something said just out of frame, with a second small brass
glint appearing at their other hand like a new option has just become
available to them — that second glint is the "draw a card" beat, and it's
the one concrete thing this prompt needs to keep, since "listening" alone
doesn't read as card draw. Small, quiet, almost intimate gesture; lowest-
cost buff in the deck, so the smallest motion in the buff row.

**Sun-Blind** — Heavy, cost 7, dmg 6. Debuff, premium blind.
Effect: "Deal 6 damage and Blind all enemies for 2 turns." — every enemy
in the room, not one target.
Prompt: the Priest's staff or raised hand throwing a hard flare of
nightshade-tinted light outward in a wide radius, reaching multiple
unseen enemy silhouettes at the frame's edges — but the light itself
should read as harsh and overexposed rather than luminous, because it's a
blind, not a heal. Wide Heavy-tier motion; the curse clings to those
silhouettes as a violet afterimage.

**Paralytic Rite** — Support, cost 5. Debuff.
Effect: "Stun an enemy for 1 turn. Costs 1 less for each Blessing you have
played this combat." A full stun — the target is frozen and can't act at
all. **First pass had this swapped with Binding Psalm below — Paralytic
Rite is the stun, Binding Psalm is the root. They need to look different
from each other.**
Prompt: an unseen enemy caught rigid mid-motion, violet light locking
around their whole torso and raised weapon-arm like they've been frozen
in a single frame of time — the emphasis is "cannot act at all," not just
"cannot move." A faint crystalline or glass-like quality to the violet
light sells "frozen" specifically, distinct from Binding Psalm's rooted
legs below.

**Binding Psalm** — Support, cost 3. Debuff.
Effect: "Root an enemy for 2 turns (it cannot move or reposition)." The
target can still act (attack, cast) — it just can't move from where it's
standing. **Corrected from the first pass, which wrote this as a
silence — that's actually Vow of Silence's job (Priest class pool,
below).**
Prompt: thin nightshade tendrils creeping up from the floor and locking
around an unseen enemy's legs and feet, anchoring them in place — the
curse sits at ground level, on the legs specifically, not the mouth or
weapon-hand. Contained, one point of effect; the enemy's upper body and
weapon should still read as free and dangerous, since only their footing
is bound.

### Gear signatures, not yet drawn (4)

**Blessing** — Buff. Holy accessory signature.
Effect: "Target ally gains +3 attack this turn." One ally, one turn —
smaller and shorter than Benediction's whole-party buff.
Prompt: an ornate holy accessory (amulet, prayer beads, a small icon)
worn by the Priest glows with a brass halo that arcs to exactly one
unseen ally — same warm radiating-halo language as Benediction, but
single-target and visibly smaller, with the source object (the accessory
itself) clearly the origin of the light, since this card only exists
because that gear is equipped.

**Radiant Cleave** — Offense. Holy weapon signature.
Effect: "Deal 14 damage. Deals double to Undead." A plain strike that
happens to be especially effective against the undead — not necessarily
a "wide" or multi-target hit.
Prompt: a single two-handed swing (mace, blessed blade, or staff-blade)
at the moment of impact, carrying both ember-oxblood impact sparks and a
thin gold-white holy edge along the weapon — the only Priest offense card
that should show its weapon glowing, since the "holy" element is what the
gear grants. One clean hit, not a sweep.

**Surge** — Offense. Lightning accessory signature.
Effect: "Deal 5 damage and gain 2 energy." Both an attack on the enemy
and a small energy return to the Priest — the first pass only showed the
outgoing bolt.
Prompt: the Priest's hand or an accessory (ring, bracer) arcing with a
sharp branching bolt toward an unseen target, and a second, smaller spark
of the same white-hot crackle looping back to flicker at the Priest's own
hand or the accessory itself — that return spark is what sells "gains
energy," not just "deals damage."

**Vanish Step** — Defense. Shadow accessory signature.
Effect: "Gain Evasive (dodge the next attack). Draw a card." This is a
defensive buff on the Priest, not a teleport or repositioning move — the
first pass implied travel, which overstates it.
Prompt: the Priest standing their ground but doubled by a faint, offset
soot-violet afterimage trailing just behind their real position — like
they're already half a step out of sync with where an attack would
expect them, without actually having gone anywhere. A tempered-steel
rim-light on the real figure keeps this readable as defense, not an
offense/debuff shadow effect.

### Class pool, not yet drawn (8)

**Absolution** — Heal. Cleanse + heal.
Effect: "Remove all debuffs from allies and Heal all allies 8."
Prompt: the Priest with both arms spread, verdigris motes rising from
several unseen allies at once as thin violet curse-threads visibly snap
and dissolve off them — the only Priest heal card that should also show a
curse breaking, since cleansing is half the effect.

**Choir of Iron** — Defense. Group guard + attack.
Effect: "All allies gain +12 Guard and +3 attack for 2 turns." Bigger
version of Warding Chant, and it also raises attack, not just Guard —
worth showing both, even though Defense is still the dominant read.
Prompt: several tempered-steel plates or shard-shapes locking into place
around unseen allies at once, angular and armor-like rather than the
softer plane-light of Warding Word/Chant — "iron" should read as harder
geometry. Let a thin ember thread run along the edge of each plate (a
small offense accent, ~20%) to carry the attack half of the buff without
losing the defense-dominant read.

**Confessor's Leverage** — Debuff. Forced-taunt/confusion.
Effect: "Force an enemy to attack its nearest ally (Taunt, 1 turn)." This
turns an enemy against its own side for a turn — not a resolve-weakening
curse on them alone. My first pass had this as generic psychological
pressure; the actual mechanic is specific and stranger than that.
Prompt: the Priest's raised hand trailing a thin nightshade thread that
loops from their fingers to an unseen enemy's temple or eyes, and that
enemy's stance/weapon is already turning away from Brutus's side toward
another unseen figure beside it — the curse should visibly redirect the
enemy's aim, not just mark them.

**Consecrated Ground** — Support, cost 4. Heal. Area heal-over-time rune.
Effect: "Create a zone: allies inside heal 3 at the start of each of
your turns for 3 turns."
Prompt: the Priest's staff planted, a verdigris sigil or ring spreading
across the floor beneath unseen allies' feet, motes rising up from the
ground itself rather than from the Priest's hands — the only Priest heal
that should show the ground as the light's source.

**Hymn of Vigor** — Buff. Energy song.
Effect: "You gain 8 energy. Companions gain 20 energy."
Prompt: the Priest mid-song or mid-chant, a brass halo pulsing outward in
a ring that visibly touches multiple unseen allies at once — motion
should read as rhythmic/musical (a ring expanding in a beat) rather than
a single static glow.

**Sacrament of Nerve** — Support, cost 2. Buff.
Effect: "An ally becomes Immune to Fear and Stun for 2 turns. Draw a
card." Two components — the resolve-buff and a card draw the first pass
left out entirely.
Prompt: the Priest's hand pressed to an unseen ally's brow or chest, a
brass light that hardens at the edges into a faint crystalline lattice
rather than a soft halo, with a small second brass glint at the Priest's
own hand (the same card-draw cue used for Alms-Taker's Ear) — this is a
buff about resolve/steadiness, so the main light should read rigid, not
warm and loose like Benediction, while the second glint keeps the draw
legible.

**Second Breath** — Heal. Conditional bigger heal at low HP.
Effect: "Heal 8. If you are below 25% HP, Heal 14 instead."
Prompt: the Priest catching a staggering, badly hurt unseen ally by the
shoulder, verdigris light flooding in hard and fast rather than gently
rising — this should read more urgent than Weak Cure/Mending Light,
closer to a desperate save than a routine heal.

**Vow of Silence** — Support, cost 3. Debuff.
Effect: "Silence an enemy caster for 2 turns (no abilities)."
Prompt: a thin violet thread winding from the Priest's raised hand
directly over an unseen enemy's mouth/throat, cutting off mid-cast — a
faint broken magic glyph or aborted spell-light fizzling at the enemy's
hand sells "this stops a caster" specifically, distinct from Binding
Psalm's more general bind.

---

## Warrior — pending art (35)

### Default deck, not yet drawn (25)

**Killing Shout** — Heavy, cost 11, dmg 30. Finisher.
Effect: "Deal 30 damage. Costs 2 less if any enemy died this turn."
**Flag:** the shipped build currently has this at cost 9/dmg 22 — the
same situation as Excommunication above. BALANCE.md's 09-17 pass (cost
11/dmg 30, quoted here) is the newer, Robert-reviewed number; the live
build hasn't caught up yet. This card is also the Warrior's new class
finisher — Umbral Reaper (gear signature, below) held that role before
it became gear-only.
Prompt: the Warrior mid-roar, weapon raised at the top of its swing,
white-hot incandescent light bursting from the point of impact with deep
black crush at the frame's edges — widest, loudest pose in the Warrior
set, a battle-cry finisher rather than a stealthy one.

**Last Man** — Heavy, cost 8, dmg 20. Offense.
Effect: "Deal 20 damage. Deals +10 if you are the only conscious ally."
The bonus is specifically about being the last one standing, not just a
generic desperate swing. **First pass had no exact quote — corrected.**
Prompt: the Warrior alone in frame with visibly more open space around
them than any other Warrior card (no ally silhouette anywhere at the
edges), throwing everything into one committed downward or diagonal
swing, ember sparks flying hard off the point of impact. The emptiness
around the figure is what should sell "only conscious ally," not just
the ferocity of the swing.

**Great Cleave** — Heavy, cost 7, dmg 16. Offense.
Effect: "Deal 16 damage to the target and 8 to adjacent enemies." One
clear primary target plus a weaker splash, not an equal hit to everyone
in range.
Prompt: a full horizontal sweep at the widest point of its arc, weapon
trailing a hard ember-oxblood motion-streak — one unseen figure squarely
in the weapon's path taking the brunt, with a thinner, dimmer spark
reaching one or two more silhouettes at the frame's edge for the lesser
splash. Wider than any other Warrior swing except the finisher, but still
reads as "one real target, others catch the edge."

**Breaker Chain** — Medium, cost 6, dmg 15. Offense.
Effect: "Deal 15 damage. If this kills, refund 3 energy." A single
decisive hit, not a multi-strike combo — "Chain" names the weapon (a
chain-linked weapon: flail, kusarigama, meteor hammer), not the number of
times it hits. **Corrected from the first pass, which drew this as a
layered combo of two or three strikes.**
Prompt: a single clean strike from a chain-linked weapon at the moment of
impact, the chain trailing in a taut arc behind the striking head rather
than multiple overlapping motion-streaks — one hard ember burst at the
point of contact. A small secondary spark curling back toward the
Warrior's hand can hint at the kill-refund, but the primary read must
stay a single hit.

**Executioner's Tempo** — Medium, cost 5, dmg 13. Offense.
Effect: "Deal 13 damage. Execute targets below 20% HP." This rewards
timing the strike against an already-weakened target — an execute, not
just a stylish finishing-move family. **Corrected from the first pass,
which described this as generic "technique over rage" with no condition.**
Prompt: a controlled, precise overhead or diagonal cut aimed at an unseen
enemy who's visibly already staggering or hunched (barely standing, not
fresh) — deliberate, unhurried confidence rather than a wild swing. The
target's own weakened posture is the cue that separates this from Last
Man's recklessness or Skullcracker's blunt-force read.

**Ground Slam** — Medium, cost 5, dmg 12. Offense.
Effect: "Deal 12 damage to all adjacent enemies and Stagger them."
Prompt: the Warrior's weapon or fist driven straight down into the floor,
a hard ember shockwave ring radiating outward along the ground plane to
reach several unseen adjacent silhouettes at once — the only Warrior
offense card whose force travels along the floor rather than through a
swing arc.

**Skullcracker** — Medium, cost 5, dmg 14. Offense.
Effect: "Deal 14 damage. Stun for 1 turn if the target is Staggered." The
stun is conditional on the target already being Staggered — this card
lands the follow-up, it doesn't create the opening itself. **Corrected
from the first pass, which described a plain unconditional overhead hit.**
Prompt: a blunt weapon (mace, pommel, gauntlet) at the top of a short,
brutal overhead arc against an unseen enemy who's visibly already
off-balance or reeling, sparks concentrated tight and hard at a single
point of impact — a precise, punishing hit that finishes what something
else started, not a sweep.

**Riposte Cut** — Medium, cost 4, dmg 11. Offense.
Effect: "Deal 11 damage. If you dodged this turn, deal 16 instead." The
bonus triggers off the Warrior's own dodge, not a parry or block.
**Corrected from the first pass, which described a parry/counter.**
Prompt: the Warrior mid-pivot, body already twisted clear of an unseen
blow's path, the follow-up cut whipping in from that same evasive
turn — one continuous motion of sidestep-then-cut, which should read as
the card's signature "answer" beat.

**Throw the Axe** — Medium, cost 4, dmg 12. Offense.
Effect: "Deal 12 damage at range."
Prompt: the Warrior mid-throw, arm fully extended past release, the axe
already in flight trailing a short ember motion-streak toward an unseen
target — the only Warrior offense card in this batch that isn't melee, so
the weapon should be clearly airborne, not still in hand.

**Line Breaker** — Medium, cost 4, dmg 11. Offense.
Effect: "Deal 11 damage and Shove through the target's tile." A single
target the Warrior physically displaces past, not a charge through a row
of enemies. **Corrected from the first pass, which drew this as punching
through multiple enemies in a line.**
Prompt: the Warrior mid-charge driving straight through one unseen
enemy's position, shoulder or weapon leading, body already past where
that enemy stood — the motion should read as "shoved clean through one
body," low and fast with a hard ember streak trailing behind, not a wide
sweep catching several silhouettes.

**Crushing Helm** — Light, cost 3, dmg 8. Offense.
Effect: "Deal 8 damage. If the target is Staggered, Stun it for 1 turn."
Same conditional-stun family as Skullcracker (both need a Staggered
target to lock the enemy up) — this is the cheaper, closer-range version.
**Corrected from the first pass, which described a plain unconditional
headbutt.**
Prompt: a tight close-range headbutt against an unseen enemy who's
already visibly unsteady, foreheads/helm nearly touching, a small hard
spark right at the point of contact — small, brutal, contained; Light
tier, so keep the motion compact.

**Sprinting Cut** — Light, cost 3, dmg 8. Offense.
Effect: "Deal 8 damage. +4 damage if Brutus had to lunge to reach the
target."
Prompt: the Warrior mid-lunge, body stretched low and forward, blade
already connecting at full extension — the pose should read "just closed
the distance," legs still in the lunge, not a standing strike.

**Reckless Charge** — Light, cost 2, dmg 9. Offense.
Effect: "Deal 9 damage. Take 3 damage." A real risk/reward hit — the
Warrior pays a small cost of their own, not just a sloppy-looking swing.
**Corrected from the first pass, which described this as merely
"unpolished" with no self-damage.**
Prompt: a headlong shoulder-first charge landing on an unseen enemy, but
with the Warrior's own stance or footing visibly thrown off by the
impact — a slight stumble or off-balance recoil on landing, the cost of
going in that hard. Should read as more reckless than Line Breaker's
controlled charge because it costs the Warrior something too.

**Guard Break** — Light, cost 2, dmg 6. Offense.
Effect: "Deal 6 damage. Destroy 8 Guard, and break an active Resolute
brace."
Prompt: a short, hard hammer-fist or pommel strike aimed directly at an
unseen enemy's raised guard/shield, with the guard visibly cracking or
shattering at the point of impact — this card is specifically about
breaking a brace, so show something breaking, not just a hit landing.

**Shoulder Check** — Light, cost 1, dmg 5. Offense.
Effect: "Deal 5 damage and Shove the target (reposition)." A displacement
hit — the payoff is moving the enemy, not "creating an opening" in the
abstract. **Tightened from the first pass's vaguer framing.**
Prompt: a short, blunt shoulder-first shove that visibly knocks an unseen
enemy back out of their position — the cheapest offense card in the deck,
so the smallest, plainest motion: no weapon flourish, just a clean
body-check that clearly displaces its target.

**No Retreat** — Support, cost 3. Defense.
Effect: "You and adjacent allies gain +10 Guard. You cannot move for 1
turn." A group brace with a real cost to the Warrior, not a solo stubborn
stance. **Corrected from the first pass, which showed only the Warrior
bracing alone with no self-cost.**
Prompt: the Warrior planted in a wide, low stance, feet visibly locked or
rooted to the ground (the cost — can't move), a tempered-steel light
pressing inward from the front and wide enough to also wrap one or two
unseen adjacent allies at the frame's edges. The rootedness of the stance
is as important a visual cue as the shared shield.

**Iron Jaw** — Support, cost 2. Defense.
Effect: "Gain 8 Guard. If you took damage last turn, gain 12 instead." A
reactive brace that hardens more after being hit, not a fixed "absorb the
next attack" ward. **Corrected from the first pass, which described a
static pre-emptive brace.**
Prompt: the Warrior's jaw set, shoulders raised, a thin steel-blue plane
of light forming tight against the front of the body — a faint
bruise-dark mark or scuff at the edge of the light hints this brace comes
up harder because they just took a hit, smaller and closer to the body
than No Retreat's wider group stance.

**Challenge** — Support, cost 2. Defense.
Effect: "Taunt an enemy for 2 turns (it must attack you)." One enemy
specifically locked onto the Warrior, not a general aggro pull.
Prompt: the Warrior with weapon raised and arms spread wide, chest
forward, staring down one unseen enemy in particular — the steel-blue
light should ring the Warrior's own silhouette like a beacon rather than
shielding them, since the point of this card is being seen and targeted,
not protected.

**Rally Banner** — Support, cost 2. Buff.
Effect: "Place a banner: allies within 2 tiles gain +2 attack. Lasts 3
turns."
Prompt: the Warrior driving a banner or standard into the ground, a
warm old-brass light radiating outward from the banner itself in a wide
ring toward unseen allies — the banner, not the Warrior, should be the
light's visible source.

**Battle Breath** — Support, cost 2. Buff.
Effect: "Gain 4 energy. Your next 2 attacks deal +3 damage." Two
components — an energy gain and a buff that specifically primes the next
two strikes, not a vague self-hype effect. **Corrected from the first
pass, which described only a generic self/ally battle-cry.**
Prompt: the Warrior mid-exhale or mid-shout, a brass light gathering
tight around their own chest and raised weapon, with two small distinct
brass motes or sparks (not one) sitting at the weapon's edge — the pair
of motes is the concrete cue for "next two attacks," distinct from a
single glow that would just read as generic hype.

**War Cry** — Light, cost 1. Buff.
Effect: "All allies gain +2 attack this turn. You gain 4 energy." A
party-wide shout plus a personal energy gain, not a self-only buff.
**Corrected from the first pass, which drew this as purely personal.**
Prompt: a short, sharp shout, mouth open, one fist or weapon raised — the
brass flare should reach outward past the Warrior to touch one or two
unseen allies at the frame's edges, plus a smaller second spark at the
Warrior's own chest for the energy gain. Cheapest buff in the deck, so
keep every element of the light small and quick, not a full halo.

**Sweeping Leg** — Light, cost 2, dmg 5. Debuff.
Effect: "Deal 5 damage to all adjacent enemies and Slow them." A group
sweep, not a single-target leg strike. **Corrected from the first pass,
which drew this as hitting one enemy's ankle.**
Prompt: a low sweeping kick or weapon-sweep at ankle height, connecting
with two or three unseen enemy silhouettes at once rather than one, thin
nightshade tendrils curling up each leg where it connects — the curse
sits low, at the point of the sweep, spread across everyone it catches.

**Feint High** — Light, cost 2, dmg 5. Debuff.
Effect: "Deal 5 damage. The target's next attack misses." The debuff
lands on the enemy's next swing, not a "weakness exposed for follow-up
damage" effect. **Corrected from the first pass, which implied a
follow-up-damage setup instead.**
Prompt: the Warrior's weapon raised high and clearly telegraphed while
the real strike lands low and to the side, and the unseen enemy is left
visibly off-balance or mis-stepping from the misdirection — a faint
violet unsteadiness in their stance sells "their next swing goes wide,"
not a curse thread promising more damage later.

**Pommel Tap** — Light, cost 1, dmg 4. Debuff.
Effect: "Deal 4 damage and Stagger the target (next attack costs +2)."
Prompt: a short, sharp pommel-strike to an unseen enemy's temple or
collarbone, a thin violet ripple radiating out from the point of contact
like a struck bell — cheapest debuff in the deck, smallest and quickest
gesture.

**Kick the Knee** — Light, cost 1, dmg 3. Debuff.
Effect: "Deal 3 damage and Cripple the target (-2 move, 2 turns)."
Prompt: a direct kick into an unseen enemy's knee/leg joint, a thin
nightshade crack of light at the point of impact suggesting the joint
buckling — the cheapest, smallest debuff card, so the plainest possible
version of "hurt one specific joint."

### Gear signatures, not yet drawn (6)

**Frostbite Slash** — Medium, cost 6, dmg 13. Debuff. Frost weapon
signature.
Effect: "Deal 13 damage and Chill the target."
Prompt: a bladed weapon mid-swing trailing a pale blue-white frost mist
instead of the usual ember spark — the only Warrior card where the impact
light should read cold rather than hot; nightshade purple can bleed into
the frost mist at the edges to keep it legible as a debuff, not a defense
card.

**Rime Shell** — Support, cost 3. Defense. Frost accessory signature.
Effect: "Gain 10 Guard and Chill adjacent enemies (Slow, 2 turns)." Not
just a personal shell — the frost also reaches out to nearby unseen
enemies. **Corrected from the first pass, which showed only a self-facing
ice layer with no outward effect.**
Prompt: a visible piece of frost-rimed gear (pauldron, gauntlet, or
bracer) with a thin tempered-steel-blue ice layer crystallizing over the
Warrior's own guard stance, and a faint cold mist spilling outward from
that same source to visibly touch one or two unseen adjacent enemies —
the shell protects the Warrior and reaches past them at once.

**Thunderclap** — Medium, cost 6, dmg 10. Debuff. Lightning weapon
signature.
Effect: "Deal 10 damage to ALL enemies and Deafen them (-2 attack, 1
turn)." A room-wide burst, not a single weapon-strike. **Major correction
from the first pass, which drew this as one hard hit on one target.**
Prompt: a weapon strike whose branching white-hot crackle doesn't stop at
one point of contact — the lightning visibly forks outward to reach
several unseen enemy silhouettes across the frame, distinct from a plain
single hit by both the visible branching and the spread. Distinct from
Priest's Surge by being a discharged weapon-strike rather than a
channeled bolt returning to the caster.

**Toxic Cloud** — Support, cost 4. Debuff. Poison accessory signature.
Effect: "Create a poison cloud (3 tiles): enemies inside take 4 at the
start of their turn, 3 turns." A ground zone anyone can be caught in, not
a cloud clinging to one target. **Corrected from the first pass, which
drew this wrapped around a single enemy's feet.**
Prompt: a vial or gear piece releasing a low-hanging sickly violet-green
cloud that settles as a defined patch of ground covering a few tiles,
with one or two unseen enemy silhouettes standing inside it rather than
the cloud clinging to just one body — this is the one Warrior debuff that
should show no impact spark at all, just poisoned ground anyone can walk
into.

**Umbral Reaper** — Heavy, cost 12, dmg 32. Finisher. Shadow weapon
signature.
Effect: "Deal 32 damage. Heal for half the damage dealt." — plus a
back-attack bonus that BALANCE.md's own design notes confirm is intended
("32 for 12, plus its back-attack bonus") but that isn't yet spelled out
in the card's shipped text. Treat the positional bonus as real, reviewed
design intent, not a guess — but the base 32-damage-plus-lifesteal is
what's actually confirmed in the data; the back-attack condition itself
hasn't shipped as text yet. This card, not Killing Shout, used to be the
Warrior's class finisher before it became gear-only; Killing Shout has
since taken over that slot in the default deck, but Umbral Reaper still
carries the biggest, most finisher-scale hit in the class.
Prompt: a scythe-like or curved dark blade caught mid-swing from behind
an unseen enemy's shoulder, trailing torn soot-violet shadow rather than
a clean motion-streak, with a thin incandescent white edge along the
blade and a faint verdigris-tinted thread of the drained hit curling back
toward the Warrior (the lifesteal — the one part of this effect that's
fully confirmed in the text) — the same white-hot-inside-darkness
treatment as Killing Shout, but colder and from behind.

**Venom Strike** — Light, cost 3, dmg 6. Debuff. Poison weapon signature.
Effect: "Deal 6 damage and Poison the target (3/turn, 3 turns)."
Prompt: a single precise stab or puncture, with a thin sickly-violet
tendril spreading from the point of the wound rather than a spark — more
surgical and quiet than Toxic Cloud's ambient gas, this is poison
delivered directly through the weapon.

### Class pool, not yet drawn (4)

**Dual Hew** — Medium, cost 5, dmg 8 (twice). Offense.
Effect: "Deal 8 damage twice." Two separate hits from the same swing, not
one bigger hit.
Prompt: two blades or weapons crossing in an X at the moment of double
impact, two overlapping ember-spark points rather than one — the
silhouette should read "two strikes, not one" at a glance, distinct from
every single-weapon offense card in the set.

**Frenzy Step** — Light, cost 2. Buff.
Effect: "Gain 3 energy. Your next attack this turn deals +4 damage." A
power-up for the very next hit, not a haste/speed effect. **Major
correction from the first pass, which drew this as a speed-lines/movement
buff.**
Prompt: the Warrior planted and coiled rather than mid-stride, a brass
spark gathering and sitting at the striking hand or weapon's edge like a
loaded blow waiting to land, with a second smaller energy glint at their
own chest — the light should read as "primed," not "already moving."

**Shield Tear** — Medium, cost 4, dmg 10. Offense.
Effect: "Deal 10 damage. Permanently reduce the target's Guard generation
by 2 this combat."
Prompt: a hooking or dragging strike that visibly catches and drags at an
unseen enemy's shield or guard-arm, ember sparks trailing along the drag
rather than a single point of impact — the motion should read as tearing
something away, not just hitting through it.

**Warlord's Due** — Support, cost 3. Buff.
Effect: "Gain 5 energy. Your allies gain +1 attack this turn." A modest
party buff plus a personal energy gain — smaller in scale than Rally
Banner or War Cry, more about the Warrior asserting presence than a big
group cry. **Tightened from the first pass's vaguer "tribute" framing.**
Prompt: the Warrior standing tall with weapon planted point-down like a
staff of office, a wide but low-key brass light spreading along the
ground toward unseen allies, with a small second spark at their own chest
for the energy gain — commanding presence rather than a shout or banner.

---

## For whoever picks this up next

- Suggested order: Priest default-deck cards first (highest play
  frequency), matching TASKS.md's existing G1-continued priority, then
  Priest gear signatures, then Priest pool; same pattern for Warrior.
  Two corrections to TASKS.md's Priest list while you're in there: **Rite
  of the Held Wound** and **Alms-Taker's Ear** are in the current default
  deck too (added in the 09-17 balance pass, after that list was written)
  — worth folding into the same batch rather than leaving for later.
- Every prompt above is my read of the card's effect, not new design —
  if a name/number/effect changes in a future balance pass, the prompt
  should be re-checked against this doc before it's assumed stale.
- Once a face is drawn, it goes through the same colour audit as
  everything else (category read at thumbnail, greyscale pass, one-second
  test) before it's called done.
