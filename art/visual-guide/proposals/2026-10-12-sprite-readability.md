# Proposal: in-play sprite readability (2026-10-12)

**Status: PROPOSAL, not binding.** Drafted by Claude from Robert's direction (2026-10-12):
"We'll keep at 2D sprites. Think SMT / Street Fighter III: 3rd Strike. Bodies must be extremely
readable. The goal is smooth movement, so sprites can't be visually noisy." Becomes part of the
binding guide (`../README.md`) only when Robert approves it.

## Scope

Applies to everything the player reads **during play**: enemy and ally sprites, bosses, the
first-person weapon or fist, and combat effects. Card faces, portraits and key art are viewed
still and large, so they may stay richer; they follow the existing guide.

## Why

Combat is fighting-game-like: the player must react to light, medium and heavy attacks. A windup
the player cannot read in a fraction of a second is a gameplay bug, not a style choice.
Readability is the rule; style serves it.

## Rules

1. **Silhouette first.** Every pose must read as a solid black shape. Light, medium and heavy
   windups of the same character must have clearly different silhouettes.
2. **Few values, big shapes.** Two or three value steps per material plus one accent. One
   consistent light direction. Interior detail only where it explains form.
3. **No texture noise.** No fine stone, scale, chain or filigree texture on bodies. Detail that
   shimmers when the sprite scales, moves or sits in torchlight is cut.
4. **Clean outline.** A dark outline, or a strong value break, around the whole body, so it
   separates from dungeon walls at any distance.
5. **Colour belongs to the character, not the attack.** Each character keeps its palette; danger
   reads from pose and timing. No per-attack colour coding.
6. **Tells exaggerate.** Anticipation poses push further than feels natural. The windup is the
   most important frame a monster has.
7. **One model sheet per character.** Proportions, palette and silhouette are fixed on a sheet
   before any animation frame is made, and every frame is checked against it.

## Frame budget (smooth without 3rd Strike's frame counts)

Spend frames where the player reads; let the engine fill the rest with easing, squash, stretch
and lunge offsets.

| Action | Frames |
|---|---|
| Idle | 2-4 |
| Walk | 4-6 |
| Light attack | windup 2, strike 1, recovery 2 |
| Medium attack | windup 3, strike 1, recovery 2 |
| Heavy attack | windup 4, strike 2, recovery 3 (held pose) |
| Hit, stun | 2 each |
| Down | 1 |

About 30-40 frames per regular enemy; bosses more, mostly in their tells.

## Acceptance checks for any new in-play sprite

- **Silhouette test:** fill the frame solid black. Can you name the pose and its weight?
- **Size test:** view at real in-game size (small, at the far end of a room). Still readable?
- **Value test:** convert to greyscale. Three or four clear value groups, not mush?
- **Noise test:** scale down and back up. Does any area shimmer or turn to static?
- **Sheet test:** overlay against the model sheet. Same proportions and palette?

## Getting there with AI art

AI images drift toward exactly what these rules forbid: busy texture and frame-to-frame drift.
Two workable routes:
1. **Generate key poses, then clean them up by hand:** redraw the silhouette, flatten shading to
   the value steps above, and lock the palette to the model sheet.
2. **3D as reference, 2D as output** (the *Dead Cells* approach): animate a simple rigged model
   (AI auto-rigging now handles standard humanoids), render it with flat toon shading to sprite
   frames, and paint over. Frames stay consistent; the player only ever sees 2D.

## First-person weapon

The guide says Brutus is a fistfighter whose near fist "owns the frame". The in-play viewmodel is
therefore his wrapped fist and forearm, drawn to these rules and animated in 2D only (slide, roll,
scale), never turned edge-on. A placeholder drawn in code ships in the playable build; it is to be
replaced by real art under these rules.

## Known violations today

- The current Brute sprite is heavily textured (stone, gold filigree): it fails rules 2 and 3 and
  the noise test. It is the clearest example of what to avoid.
