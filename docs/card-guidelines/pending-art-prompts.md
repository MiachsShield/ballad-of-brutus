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

Numbers below (tier/cost/dmg/category) are from BALANCE.md's 09-17 pass.
Effect text in quotes is the card's actual current wording; effect text
without quotes is my read of the name/numbers where BALANCE.md doesn't spell
it out verbatim — flag me if a redraw needs the exact wording before you
start, rather than guessing differently than I did.

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
(-2 attack) for 2 turns."
Prompt: the Priest's arm thrown fully forward, a rite gesture mid-shout,
white-hot incandescent light blasting straight through the target rather
than around them — this is the moment the room goes quiet. Widest pose in
the Priest set; deep black crush at the edges of the frame, red undertone
in the shadow per the finisher grade.

**Heavy Blow** — Heavy, cost 7, dmg 18. General.
Effect: a hard, committed physical strike — no magic, just weight.
Prompt: a wide overhead or hook swing at the top of its arc, body torqued
fully into it, ember-oxblood light sparking outward from where the blow is
about to land. Reads as a big, plain hit — no ornament, just force.

**Rigor** — Light, cost 3, dmg 7. Offense.
Effect: a quick, disciplined jab-like strike.
Prompt: a short, tight punch or staff-jab, minimal windup, small hard
ember spark right at the point of contact. Contained gesture — this is a
1–3 cost card, not a showpiece.

**Anthem of the Unbroken** — Heavy, cost 10. Defense, showpiece.
Effect: "For 2 turns, any ally who would fall stays at 1 HP instead. All
allies gain +6 Guard." (Not a revive — a ward that keeps allies standing.)
Prompt: the Priest plants a staff or raises both arms, a tempered-steel
dome or shell of light expanding outward to enclose the whole party — the
light is held *between* the party and an unseen threat, braced rather than
struck. Broad motion, showpiece scale, but no fallen ally being lifted —
nobody is down in this image, the ward is preventative.

**Rite of the Held Wound** — Support, cost 4. Defense.
Effect: staunches a wound before it becomes fatal — a single-target
preventative ward, same family as Anthem but small and personal.
Prompt: the Priest's hand pressed flat over an unseen ally's chest or
shoulder (ally mostly out of frame or just a hand/shoulder edge), a thin
tempered-steel seam of light closing over the point of contact like a
wound sealing shut. Quiet, small-scale — Support tier, not a showpiece.

**Warding Word** — Support, cost 2. Defense.
Effect: a quick single-target guard.
Prompt: the Priest speaks a short word, one hand raised — a thin steel-blue
plane of light snaps into place in front of an unseen ally. Fast, small,
contained; this is the cheapest defense card in the deck.

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
Effect: a blessing that empowers an ally going into a fight.
Prompt: the Priest's hand resting on an unseen ally's shoulder or head, a
warm old-brass halo blooming outward and upward from the point of contact
like a rising rank-marker. Warm, dignified, not flashy — a moment before
the fight, not during it.

**Alms-Taker's Ear** — Support, cost 2. Buff.
Effect: a listening/perception boon — read it as sharpened awareness or a
small combat edge granted through attentiveness, not raw power.
Prompt: the Priest tilted slightly, one hand cupped near an unseen ally's
ear or the Priest's own, a thin brass thread of light connecting the two
— an image of attention and awareness rather than force. Small, quiet,
almost intimate gesture; lowest-cost buff in the deck, so the smallest
motion in the buff row.

**Sun-Blind** — Heavy, cost 7, dmg 6. Debuff, premium blind.
Effect: blinds the whole room.
Prompt: the Priest's staff or raised hand throwing a hard flare of
nightshade-tinted light outward in a wide radius — but the light itself
should read as harsh and overexposed rather than luminous, because it's a
blind, not a heal. Wide Heavy-tier motion; the curse clings to the
silhouettes of unseen enemies at the frame's edge as a violet afterimage.

**Paralytic Rite** — Support, cost 5. Debuff.
Effect: roots/paralyzes.
Prompt: thin nightshade tendrils or a violet lattice creeping up and
locking around an unseen enemy's limbs from the Priest's outstretched
hand — the curse sits on the target, clinging and immobilizing, not
striking. Still Support-tier scale despite the cost — this locks someone
down, it doesn't hit them.

**Binding Psalm** — Support, cost 3. Debuff.
Effect: a silencing/binding chant, cheaper and smaller than Paralytic
Rite.
Prompt: same clinging-curse language as Paralytic Rite but smaller in
scale — a single violet thread winding from the Priest's raised hand to
close over an unseen enemy's mouth or weapon hand. Contained, one point of
effect, not a full-body bind.

### Gear signatures, not yet drawn (4)

**Blessing** — Buff. Holy accessory signature.
Effect: an equipped-accessory version of a blessing/empower effect.
Prompt: an ornate holy accessory (amulet, prayer beads, a small icon)
worn by the Priest glows with a brass halo that arcs outward toward an
unseen ally — same warm radiating-halo language as Benediction, but with
the source object (the accessory itself) visible and clearly the origin
of the light, since this card only exists because that gear is equipped.

**Radiant Cleave** — Offense. Holy weapon signature.
Effect: a holy-infused wide melee strike.
Prompt: a wide two-handed swing (mace, blessed blade, or staff-blade)
mid-arc, the strike itself carrying both ember-oxblood impact sparks and
a thin gold-white holy edge along the weapon — the only Priest offense
card that should show its weapon glowing, since the "holy" element is
what the gear grants.

**Surge** — Offense. Lightning accessory signature.
Effect: a lightning burst channeled through worn gear.
Prompt: the Priest's hand or an accessory (ring, bracer) arcing with a
sharp branching bolt toward an unseen target — ember-oxblood is still the
category light, but let a thin white-hot crackle ride along the bolt's
edge to read as lightning specifically, distinct from a plain strike.

**Vanish Step** — Defense. Shadow accessory signature.
Effect: a shadow-step evasion.
Prompt: the Priest caught mid-step with their trailing edge dissolving
into soot-violet smoke or shadow fragments — a tempered-steel rim-light
outlines the solid, arriving half of the figure while the departing half
breaks apart, reading as "was about to be hit, isn't there anymore."

### Class pool, not yet drawn (8)

**Absolution** — Heal. Cleanse + heal.
Effect: "Remove all debuffs from allies and Heal all allies 8."
Prompt: the Priest with both arms spread, verdigris motes rising from
several unseen allies at once as thin violet curse-threads visibly snap
and dissolve off them — the only Priest heal card that should also show a
curse breaking, since cleansing is half the effect.

**Choir of Iron** — Defense. Group guard aura.
Effect: a hardened group-guard effect, harder-edged than Warding Chant.
Prompt: several tempered-steel plates or shard-shapes locking into place
around unseen allies at once, angular and armor-like rather than the
softer plane-light of Warding Word/Chant — "iron" should read as harder
geometry, not just more of the same light.

**Confessor's Leverage** — Debuff. Pressure/guilt effect on an enemy.
Effect: read as psychological pressure that weakens an enemy's resolve
rather than a physical curse.
Prompt: the Priest pointing or speaking directly at an unseen enemy, a
thin nightshade thread connecting the Priest's raised hand to the
enemy's chest — less "clinging curse," more "singled out and exposed,"
so keep the curse light narrow and directional rather than enveloping.

**Consecrated Ground** — Heal. Area heal-over-time rune.
Effect: a ground-based healing zone.
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

**Sacrament of Nerve** — Buff. Steels resolve / resists control.
Effect: read as a buff that hardens an ally against fear, stun, or
control effects.
Prompt: the Priest's hand pressed to an unseen ally's brow or chest, a
brass light that hardens at the edges into a faint crystalline lattice
rather than a soft halo — this is a buff about resolve/steadiness, so the
brass light should read rigid, not warm and loose like Benediction.

**Second Breath** — Heal. Conditional bigger heal at low HP.
Effect: "Heal 8. If you are below 25% HP, Heal 14 instead."
Prompt: the Priest catching a staggering, badly hurt unseen ally by the
shoulder, verdigris light flooding in hard and fast rather than gently
rising — this should read more urgent than Weak Cure/Mending Light,
closer to a desperate save than a routine heal.

**Vow of Silence** — Debuff. Silences a caster enemy.
Effect: read as a specific answer to spellcasting enemies.
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
Prompt: the Warrior mid-roar, weapon raised at the top of its swing,
white-hot incandescent light bursting from the point of impact with deep
black crush at the frame's edges — widest, loudest pose in the Warrior
set, a battle-cry finisher rather than a stealthy one.

**Last Man** — Heavy, cost 8, dmg 20. Offense.
Effect: a desperate, all-in heavy strike.
Prompt: the Warrior planted wide and low, both hands on the weapon,
throwing everything into one committed downward or diagonal swing — ember
sparks fly hard off the point of impact. Should read as reckless
commitment, not a clean technical hit.

**Great Cleave** — Heavy, cost 7, dmg 16. Offense.
Effect: a wide sweeping strike hitting multiple targets.
Prompt: a full horizontal sweep at the widest point of its arc, weapon
trailing a hard ember-oxblood motion-streak across the frame — the
silhouette should read "this hits everything in front of me," wider than
any other Warrior swing except the finisher.

**Breaker Chain** — Medium, cost 6, dmg 15. Offense.
Effect: a chained series of strikes (flail, chain-weapon, or rapid
combo).
Prompt: two or three overlapping motion-streaks from the same weapon
showing a chained combo rather than a single hit — the impact spark
should look layered/repeated, distinct from a single clean swing.

**Executioner's Tempo** — Medium, cost 5, dmg 13. Offense.
Effect: a rhythmic, precise finishing-style strike (not the class
finisher, but that family of motion).
Prompt: a controlled, precise overhead or diagonal cut, weapon held with
deliberate, unhurried confidence rather than a wild swing — reads as
technique over rage, distinct from Last Man's recklessness.

**Ground Slam** — Medium, cost 5, dmg 12. Offense.
Effect: an AoE ground-pound shockwave.
Prompt: the Warrior's weapon or fist driven straight down into the floor,
a hard ember shockwave ring radiating outward from the point of impact
along the ground plane — the only Warrior offense card whose force
travels along the floor rather than through a swing arc.

**Skullcracker** — Medium, cost 5, dmg 14. Offense.
Effect: a heavy blunt overhead strike.
Prompt: a blunt weapon (mace, pommel, gauntlet) at the top of a short,
brutal overhead arc, sparks concentrated tight and hard at a single point
of impact rather than spread wide — this is a precise, punishing hit, not
a sweep.

**Riposte Cut** — Medium, cost 4, dmg 11. Offense.
Effect: a counter-strike following a parry or block.
Prompt: the Warrior mid-pivot, weapon already deflecting an unseen blow
to one side while the other hand/blade whips into a return cut — two
beats in one frame (deflect, then cut), which should read as the
card's signature "answer" motion.

**Throw the Axe** — Medium, cost 4, dmg 12. Offense.
Effect: a thrown ranged weapon attack.
Prompt: the Warrior mid-throw, arm fully extended past release, the axe
already in flight trailing a short ember motion-streak toward an unseen
target — the only Warrior offense card in this batch that isn't melee, so
the weapon should be clearly airborne, not still in hand.

**Line Breaker** — Medium, cost 4, dmg 11. Offense.
Effect: a charge that punches through a line of enemies.
Prompt: the Warrior mid-charge, shoulder or weapon leading, body
horizontal with forward momentum and a hard ember streak trailing behind
— reads as breaking through something, low and fast rather than a
standing swing.

**Crushing Helm** — Light, cost 3, dmg 8. Offense.
Effect: a headbutt or helm-strike.
Prompt: a tight close-range headbutt, foreheads/helm nearly touching an
unseen enemy, a small hard spark right at the point of contact — small,
brutal, contained; Light tier, so keep the motion compact.

**Sprinting Cut** — Light, cost 3, dmg 8. Offense.
Effect: "Deal 8 damage. +4 damage if Brutus had to lunge to reach the
target."
Prompt: the Warrior mid-lunge, body stretched low and forward, blade
already connecting at full extension — the pose should read "just closed
the distance," legs still in the lunge, not a standing strike.

**Reckless Charge** — Light, cost 2, dmg 9. Offense.
Effect: a charging tackle, unpolished but effective.
Prompt: a headlong shoulder-first charge, weapon almost an afterthought,
body leaning fully into forward motion — should read as slightly
out-of-control compared to Line Breaker's more purposeful charge; this is
the "reckless" version.

**Guard Break** — Light, cost 2, dmg 6. Offense.
Effect: "Deal 6 damage. Destroy 8 Guard, and break an active Resolute
brace."
Prompt: a short, hard hammer-fist or pommel strike aimed directly at an
unseen enemy's raised guard/shield, with the guard visibly cracking or
shattering at the point of impact — this card is specifically about
breaking a brace, so show something breaking, not just a hit landing.

**Shoulder Check** — Light, cost 1, dmg 5. Offense.
Effect: a shove/check to create an opening.
Prompt: a short, blunt shoulder-first shove into an unseen enemy at close
range — the cheapest offense card in the deck, so the smallest, plainest
motion: no weapon flourish, just body-checking someone off-balance.

**No Retreat** — Support, cost 3. Defense.
Effect: a braced stance that refuses to be pushed back.
Prompt: the Warrior planted in a wide, low stance, feet dug in, a
tempered-steel light pressing inward against the figure from the front
rather than radiating out — the light should look like it's being held
back by the pose, not deflected away.

**Iron Jaw** — Support, cost 2. Defense.
Effect: a braced guard that absorbs the next hit.
Prompt: the Warrior's jaw set, shoulders raised, a thin steel-blue plane
of light forming tight against the front of the body like a second skin
— smaller and closer to the body than No Retreat's wider stance, since
this is the cheaper, more personal brace.

**Challenge** — Support, cost 2. Defense.
Effect: a taunt that draws enemy aggro.
Prompt: the Warrior with weapon raised and arms spread wide, chest
forward, daring an unseen enemy in — the steel-blue light should ring the
Warrior's own silhouette like a beacon rather than shielding them, since
the point of this card is being seen and targeted, not protected.

**Rally Banner** — Support, cost 2. Buff.
Effect: a planted banner that buffs the group.
Prompt: the Warrior driving a banner or standard into the ground, a
warm old-brass light radiating outward from the banner itself in a wide
ring toward unseen allies — the banner, not the Warrior, should be the
light's visible source.

**Battle Breath** — Support, cost 2. Buff.
Effect: a self/ally battle-cry buff, smaller and more personal than Rally
Banner.
Prompt: the Warrior mid-exhale or mid-shout, a brass light gathering
tight around their own chest and raised weapon rather than spreading
outward to a banner — reads as charging themselves up, not the group.

**War Cry** — Light, cost 1. Buff.
Effect: a quick shout that buffs.
Prompt: a short, sharp shout, mouth open, one fist or weapon raised, a
small brass flare right at the point of the shout — the cheapest buff in
the deck, so keep the light small and quick, not a full halo.

**Sweeping Leg** — Light, cost 2, dmg 5. Debuff.
Effect: a leg sweep that knocks down/slows.
Prompt: a low sweeping kick or weapon-sweep at ankle height against an
unseen enemy, with a thin nightshade tendril curling up their leg where
it connects — the curse should sit low, at the point of the sweep, not
enveloping the whole target.

**Feint High** — Light, cost 2, dmg 5. Debuff.
Effect: a high feint that opens a real weakness.
Prompt: the Warrior's weapon raised high and clearly telegraphed while
the real intent — a violet curse-thread — is already snaking in low and
to the side toward an unseen enemy's exposed flank. The visual joke is
the mismatch between where the eye goes (the raised weapon) and where the
curse actually lands.

**Pommel Tap** — Light, cost 1, dmg 4. Debuff.
Effect: a stagger from a pommel strike.
Prompt: a short, sharp pommel-strike to an unseen enemy's temple or
collarbone, a thin violet ripple radiating out from the point of contact
like a struck bell — cheapest debuff in the deck, smallest and quickest
gesture.

**Kick the Knee** — Light, cost 1, dmg 3. Debuff.
Effect: a crippling knee kick.
Prompt: a direct kick into an unseen enemy's knee/leg joint, a thin
nightshade crack of light at the point of impact suggesting the joint
buckling — the cheapest, smallest debuff card, so the plainest possible
version of "hurt one specific joint."

### Gear signatures, not yet drawn (6)

**Frostbite Slash** — Debuff. Frost weapon signature.
Effect: an icy slash that chills/slows.
Prompt: a bladed weapon mid-swing trailing a pale blue-white frost mist
instead of the usual ember spark — the only Warrior card where the impact
light should read cold rather than hot; nightshade purple can bleed into
the frost mist at the edges to keep it legible as a debuff, not a defense
card.

**Rime Shell** — Defense. Frost accessory signature.
Effect: a frost-armor shell.
Prompt: a visible piece of frost-rimed gear (pauldron, gauntlet, or
bracer) with a thin tempered-steel-blue ice layer visibly forming over
the Warrior's guard stance — the frost should look like it's actively
crystallizing over an existing brace, tying the effect to the worn gear.

**Thunderclap** — Debuff. Lightning weapon signature.
Effect: a stunning lightning strike.
Prompt: a weapon strike at the moment of impact with a sharp white-hot
branching crackle radiating outward from the point of contact — distinct
from a plain hit by the visible electric branching, and distinct from
Priest's Surge by being a single hard weapon-strike rather than a
channeled bolt.

**Toxic Cloud** — Debuff. Poison accessory signature.
Effect: a poison cloud DoT.
Prompt: a vial or gear piece releasing a low-hanging sickly violet-green
cloud that clings around an unseen enemy's feet and torso, drifting
rather than striking — this is the one Warrior debuff that should show no
impact spark at all, just the cloud settling on the target.

**Umbral Reaper** — Finisher. Shadow weapon signature.
Effect: "Deal 32 damage" plus a back-attack bonus.
Prompt: a scythe-like or curved dark blade caught mid-swing from behind
an unseen enemy's shoulder, trailing torn soot-violet shadow rather than
a clean motion-streak, with a thin incandescent white edge along the
blade itself — the only Warrior finisher-tier card, so it should carry
the same white-hot-inside-darkness treatment as Killing Shout, but colder
and from behind rather than a shouted frontal blow.

**Venom Strike** — Debuff. Poison weapon signature.
Effect: a venomous stabbing strike.
Prompt: a single precise stab or puncture, with a thin sickly-violet
tendril spreading from the point of the wound rather than a spark — more
surgical and quiet than Toxic Cloud's ambient gas, this is poison
delivered directly through the weapon.

### Class pool, not yet drawn (4)

**Dual Hew** — Offense. Dual-wield double strike.
Effect: two weapons striking together.
Prompt: two blades or weapons crossing in an X at the moment of double
impact, two overlapping ember-spark points rather than one — the
silhouette should read "two strikes, not one" at a glance, distinct from
every single-weapon offense card in the set.

**Frenzy Step** — Buff. Haste/speed buff.
Effect: a self-buff that speeds up movement or attacks.
Prompt: the Warrior mid-stride with a brass motion-blur trailing behind
their legs and weapon-arm, body leaned forward into acceleration — the
brass light should read as speed-lines rather than a halo, distinct from
the other buff cards' auras.

**Shield Tear** — Offense. Reduces enemy guard generation.
Effect: a strike aimed specifically at stripping an enemy's ability to
guard, not just breaking existing Guard (that's Guard Break's job).
Prompt: a hooking or dragging strike that visibly catches and drags at an
unseen enemy's shield or guard-arm, ember sparks trailing along the drag
rather than a single point of impact — the motion should read as tearing
something away, not just hitting through it.

**Warlord's Due** — Buff. A commanding/tribute buff.
Effect: read as a leadership effect — the Warrior asserting authority to
empower allies, distinct from Rally Banner's planted-object buff and
Battle Breath's self-focus.
Prompt: the Warrior standing tall with weapon planted point-down like a
staff of office, a wide but low-key brass light spreading along the
ground toward unseen allies rather than up into the air — commanding
presence rather than a shout or banner.

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
