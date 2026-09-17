# DONE — grok/priest-faces (wave 1, in progress)

**Agent:** Grok  
**Date:** 2026-09-16  
**Brief:** `briefs/grok/2026-09-16-astra-redistribution.md` → **G1**  
**Branch:** `grok/priest-faces`

## Task

Deliver JPEG faces for all 38 shipped Priest combat cards at
`art/card-faces/priest/<id>.jpg`. No baked text. Effect must read in one
second. Stronger cards must look more expensive. Kavi wires; Grok draws.

## What landed this session

1. Pulled live card data from `builds/brutus-1_0_a0mk-kavi-merged.html`
   (all 38 ids found; costs/effects are build-canon, not invented).
2. Wrote `CATALOG.md` — every id, tier, cost, effect, and the intended
   one-second read.
3. Produced **wave 1: 11 faces** spanning Light → Heavy so Kavi can start
   the wiring path (K8) before all 38 exist.
4. Could not commit JPEGs through the GitHub file tools (UTF-8 text only).
   Faces are in this Grok session + local zip `priest-faces-wave1.zip`.

## Wave 1 files (canonical names)

| File | Cost | One-second read | Self-check |
|---|---|---|---|
| `priest_candle_prayer.jpg` | 1 | Candle + small heal on an arm | Pass — cheap dual effect |
| `priest_quick_strike.jpg` | 1 | Short glowing jab | Pass — cheap |
| `priest_steady_hands.jpg` | 1 | Palms doubling a modest heal | Pass — support, quiet |
| `priest_dust_in_the_eyes.jpg` | 2 | Dust/glare into a recoiling face | Pass |
| `priest_cleave.jpg` | 4 | Single radiant slash | Pass — medium |
| `priest_radiant_glare.jpg` | 4 | Wide glare, several foes flinch | Pass |
| `priest_sanctuary_step.jpg` | 3 | Yank ally onto a gold circle | Pass |
| `priest_blazewhirl.jpg` | 5 | Ring of fire hitting all around | Pass — bigger than glare |
| `priest_smite_priest.jpg` | 5 | Heavy sun-strike on undead | Pass — mitre is extra costume, not required |
| `priest_last_rite.jpg` | 8 | Catch a falling ally; life held | Pass — heavy |
| `priest_bulwark_slam.jpg` | 14 | Giant ward-slam + guard bloom | Pass — reads most expensive |

## Not done

27 remaining ids listed in `CATALOG.md` with planned reads. G2 (Brutus
replacements) and G3 (Bear Hug tone) not started. G3 still waits on Kavi's
read of `OXuck.jpg`.

## Costume note

Wave 1 priests wear bone-cloth + soot-violet stole + brass sun-disc so the
class reads as Priest (Claude's Stigmata side-note). They are *not* the
locked Brutus portrait — that is G2. Hair is dark on these studies; if
Robert wants every Priest face to be shaved-buzz Brutus, say so before
wave 2.

## Tone note

Still a notch more ink-and-grit than Bravely punch-timing. Same flag as
Bear Hug pass 2. I can reroll lighter once Kavi picks a wave-1 keeper as
the costume lock.
