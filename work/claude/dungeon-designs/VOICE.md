# Dungeon voices: characters say it, nobody narrates (2026-10-19)

Design only. Robert, 2026-10-19: *"Continue refining dungeon design. Characters vocalize what is
going on instead of narration."* Nothing here changes a build. **BUILD** = checked against
`builds/CURRENT-brutus-astra-e1-standalone.html` (2026-10-19). Everything else is **proposal** and
needs Robert. Cost tags as in `DESIGN.md`: **[data]** a table, **[small]** a few lines, **[new]** logic
that does not exist.

Robert owns story and writing. So this document designs the *system* and the *rules*, and the
sample lines are **placeholders** in a voice I guessed, to be replaced by his. The system is a data
table precisely so he (or I, on his word) can rewrite every line without touching code.

## 0. The short version

- Today the dungeon is told by a third-person ticker: 91 `logMsg` calls and 24 `flashAlert` calls
  (about 83 distinct lines) feeding a 50-line scrolling div (**BUILD**). In a real-time fight
  nobody reads it, and it reads like a referee, not a world.
- Proposal: every line that matters is **said by someone in the scene**, in their own voice, short
  enough to catch in one glance. "Skulker winds up a heavy" becomes Wren shouting a warning.
- Sort the ~83 lines three ways: **speak it** (what is happening), **make it a UI prompt** (what the
  player can press), **drop or move it** (tutorial and debug text).
- Barks are **redundant with the real tell, never the only channel**. The enemy's own wind-up
  animation and sound stay the diegetic tell (Monster Hunter model, Robert's preference).
- It also fixes Muse's round-4 complaint. "Kept losing the Skulker behind corners while it wound up
  a heavy" is an *awareness* problem; an ally calling a wind-up that is **outside Brutus's view**
  is the one piece of information the player was missing.
- Seven questions for Robert are at the end.

## 1. What narration does today (verified)

| Fact | Detail |
|---|---|
| Voice of the game | Third person, present tense, referee tone: "Skulker notices Brutus.", "X's poison finishes its work.", "ARMOR SHATTERS! X breaks X's stance for N and hurls them back." |
| Two channels | `logMsg` to a scrolling log (cap 50 lines, classes good / warn / res / bad) and `flashAlert`, a one-line banner that shows for 0.95 s ("STANCE BROKEN", "BACK ATTACK", "SKULKER SPOTS YOU"). |
| Mixed purposes | One channel carries four different jobs: combat feedback, enemy and ally state, world beats, and tutorial or debug text. |
| Cause then effect | `deferConsequences` / `flushConsequences` already orders a hit's cause line before its effects. A voice layer must keep that order. |
| Tutorial lines in the log | "Unaware or turned-away enemies take bonus damage and launch further. Brutes BRACE — break the armor…", "Cards are live at all times — no battle trigger.", "Standalone build — no map to return to." These are the game talking to the player. |
| Allies already decide things | Ally states are logged as plain text ("holds fire — take the first shot", "opens fire from behind you", "falls back to you", "backs off — won't take that alone", "scrambles to catch up"). Each is a decision the ally made and is already a line in someone's mouth. |
| Sound already exists | `BrutusSFX` has windup tells (`tell_quick`, `tell_heavy`, `tell_resolute`, `tell_frenzy`), swings, footsteps and enrage cues, all positional with a priority. There are no voice or speech cues. Barks can ride on the same positional and priority system. |
| Muse and the log | Playtest reports and the training room's frame-data readout lean on the log. Removing it outright would blind the playtest loop. |
| Brutus is the camera | First person: Brutus never appears on screen. Allies stand behind him in the backline, mostly off screen. A line has to say *who* is speaking, since you often cannot see them. |

## 2. Rules (proposal)

1. **Someone in the scene says it.** Brutus, Ember, Wren, an enemy, or an NPC adventurer. Never "the
   game". If no one would say it, it is not a bark.
2. **One fact per line, six words or fewer when it is combat-critical.** Matches the cognitive-load
   pillar (one trigger, one effect, one cost, always visible). Calm moments can run to a dozen words.
3. **Say what to do, not what happened.** "Heavy! Guard!" beats "the Skulker winds up a heavy."
   Results are shown by the hit itself (damage numbers, flinch, sound), not described.
4. **Barks are redundant.** Anything a bark tells the player is also in the animation, sound or HUD.
   A player who mutes the text loses flavour, not information. (Exception in section 6, question 2.)
5. **Silence is the default.** At most two barks on screen, one per speaker, minimum gap per speaker
   and per event kind, and a priority order so that a lethal warning cuts off banter.
6. **Barks come from characters who can speak.** A stunned, downed or out-of-range ally is silent.
   Losing Wren means losing Wren's warnings (see question 2).
7. **No tutorial voice.** First-time lessons are said once, in character, the first time they apply
   (Wren names the brace the first time a Brute braces) and never again.
8. **Beasts vocalize, they do not talk.** Skulker, Brute, Stalker, Dire Hound, Zombie: grunts, hisses,
   roars. Words are for Cultists, the warden and NPCs (question 5).
9. **Tone is the game's tone:** high-energy adventure comedy. Brutus is crass and impatient, not
   brooding. Keep the populace rule in mind (no toilet or perverted humour) until Robert says Brutus
   gets a different ceiling (question 6).

## 3. Sorting today's lines

Counts are approximate; the list is from reading the build, not instrumented.

| Class | Examples (**BUILD**) | Becomes | Cost |
|---|---|---|---|
| **A. Warnings and enemy state** (the player needs this mid-fight) | notices you, SPOTS YOU, ENRAGED, plants its feet / braced, breaks and runs, trap spotted | Ally or enemy bark, high priority | [small] each |
| **B. Combat feedback** (what just happened) | armor holds, ARMOR SHATTERS, PERFECT COUNTER, Interrupt, punishes the stun, BACK ATTACK, whiffs, goes wide, finds the gap | Mostly **no line**: the hit shows it. Keep a short bark only for moments worth a reaction (stance broken, perfect counter, back attack on Brutus, near death) | [small] |
| **C. Ally decisions** | holds fire, opens fire from behind you, falls back, backs off, scrambles, answers back | The ally's own line, said as they act | [small] |
| **D. Brutus reactions** | knocked into the pit, hits the wall, Second Wind, chest, lunges, rest | Brutus bark, in voice | [data] |
| **E. World beats** | hidden chamber, platform, warden down, rare prowls, dungeon's temper breaks, "people step out of the dark" | Spoken by whoever is closest; the NPC line is already dialogue | [data] |
| **F. UI and prompts** | "STUNNED — Second Wind?", "JUMP — can't right now", "REST — no rest area here", "trap!" | **Stay as UI.** An input prompt is an interface, not narration | none |
| **G. Tutorial and debug** | Cards are live at all times, Unaware enemies take bonus damage, Difficulty line, Standalone build, Deck runs dry, Checkpoint, Bestiary entry | Move: a first-run hint card, the existing Journal or bestiary UI, or dev-only text. Not a bark | [small] |

Class F matters: "narration" in the sense Robert means is A to E. Prompts stay prompts.

## 4. The three voices on screen

First person means the speaker is usually unseen, so the line needs a **speaker tag**.

- **Lane.** One fixed lane above the card row, two lines tall. Each bark is `NAME: line` in the
  speaker's colour, held 2.2 s, faded out. Enemy barks use a second, smaller lane near the top so
  they never share the player's eye line with ally warnings.
- **Direction.** An off-screen speaker gets a small edge marker toward them (the build has no edge
  markers yet; the Wizardry Variants Daphne control reference uses edge chevrons for turns, so the
  look is familiar). A warning about something behind Brutus points behind him. [new]
- **Roster.** The party panel for the speaking ally pulses. That is free, already on screen, and
  tells you who is alive.
- **Audio.** Phase 1: text plus a short positional blip per character (a pitch per voice, the
  Animal-Crossing trick; cheap and comic). Phase 2, only if Robert wants it: recorded or synthesized
  voice behind the same table. Text is never removed.
- **The log.** Retire the scrolling log from the player HUD (Robert already passed on a scrollable
  combat log). Keep it behind a **Playtest log** toggle, on in the training room, so Muse's reports
  and the frame-data readout keep working.

## 5. Event catalogue (starter set)

Speaker priority: closest able speaker wins, with a role preference. Lines are **placeholders** in
a tone guess. Each event wants 3 to 5 variants and no repeat twice running.

| Event | Source in the build | Speaker | Placeholder line | Priority | Gap |
|---|---|---|---|---|---|
| Enemy notices party | `X notices Y` / `SPOTS YOU` | The enemy (hiss or snarl), Wren if she sees it first | Wren: "Skulker. Ten o'clock." | 6 | 4 s per enemy |
| **Windup outside Brutus's view** | enemy `phase==='windup'` and `facingDot(brutus, enemy)` below the view cone | **Whoever can see it** (Wren, then Ember) | "Behind you! Heavy!" | **9** | 1.5 s |
| Heavy windup in view | same, in view | The enemy tells; no ally bark | (animation and `tell_heavy`) | n/a | n/a |
| Enemy braces | `plants its feet` | The Brute bellows; Wren names it the **first** time | Wren: "It's bracing! Break the armor!" | 7 | once, then silent |
| Stance broken | `ARMOR SHATTERS` / `STANCE BROKEN` | Brutus | "Crack!" | 5 | 2 s |
| Enemy enraged | `ENRAGED` | Enemy roars; Ember warns | Ember: "It's going berserk. Back off." | 8 | once per enemy |
| Enemy breaks and runs | `breaks and runs` | Brutus | "Oh, now you run?" | 3 | 4 s |
| Perfect counter / interrupt | `PERFECT COUNTER`, `Interrupt!` | Brutus | "Too slow!" | 4 | 3 s |
| Back attack on Brutus | `BACK ATTACK` flash | Brutus (pain), Ember (late) | Brutus: "Ow! Behind me?!" | 8 | 3 s |
| Brutus stunned | `X's energy gives out` | Brutus (strain) | "Can't... breathe..." | 6 | 3 s |
| Knocked into a pit | `SPIKE PIT` | Brutus (curse), enemy scream | Brutus: "Not the spikes!" | 6 | n/a |
| Trap spotted / sprung | `spots a trap`, `sets off` | Wren (spot), Brutus (spring) | Wren: "Trap. Floor plate." | 7 | 3 s |
| Ally holds fire | `holds fire — take the first shot` | That ally | Ember: "Holding. Your shot." | 4 | once per fight |
| Ally opens fire / falls back | `opens fire from behind you`, `falls back` | That ally | Wren: "Covering!" | 3 | 6 s |
| Ally backs off | `backs off — won't take that alone` | That ally | Ember: "Not on my own." | 5 | 8 s |
| Brutus low HP | HP under a threshold | Brutus, Ember | Ember: "Stop getting hit!" | 7 | 10 s |
| Chest / rest / floor | `A chest creaks open`, `The party rests`, floor arrival | Brutus, then one ally | Brutus: "Bandages. Lovely." | 2 | n/a |
| Hidden chamber / platform | `A hidden chamber.`, `Open air on all sides` | Ember | "That wall was too clean." | 3 | once per room |
| Warden room | boss room entry | Ember | "That door is warded." | 6 | once |
| Warden down | `The warden is down` | Brutus | "...Is it dead? It's dead." | 5 | once |
| **Companion goes down** | companion 0 HP (permadeath, **CANON**) | **The one who falls**, then Brutus | (authored by hand, never random) | **10** | n/a |

The last row is not a template. A companion's last words are a story beat, and 0 HP is permanent
(**CANON**, 2026-09-15 #4). It should be written per character by Robert, with the player's
reaction line written to match.

## 6. How it sits on the generator and the build

The build does not call a "say" function today. Two ways in, both avoiding a baseline edit:

- **A. Intercept `logMsg` and `flashAlert`.** A patch module (same pattern as `muse-prep-dungeon.js`)
  wraps both, matches each message against about 40 patterns, maps it to an event id, and plays
  the bark instead. Zero baseline edits, works today, but fragile: a reworded message silently
  stops matching. Good for the **playtest phase**, which Robert said does not need to be final. [small]
- **B. Emit events at the source.** Each call site says `say('enemy.brace', {who:e})` and the
  voice layer decides. Clean and testable, but edits the pinned baseline (owned by others), so it
  waits until the pins are rebuilt. [new]

Recommendation: A first, behind the Playtest-log toggle, so Muse can compare "log" and "voice" on
the same build. B once the line set is stable.

**Data shape** [data]:

```
{ event:'enemy.brace', speakers:['wren','ember'], priority:7, gap:4000, once:true,
  lines:['It\'s bracing! Break the armor!','Armor up. Hit it hard.'] }
```

**Context the layer needs** (all read-only): who is alive and able, who is in Brutus's view cone,
distance, enemy phase and kind. Everything is already on the combatants.

**Windup callout** [new]: the one genuinely new rule. Each frame, for each enemy in `windup`,
if Brutus's `facingDot` is under the view-cone threshold and an able ally has line of sight, emit
`enemy.windup.offscreen` once per windup. No change to AI, damage, or tell timing.

## 7. Testing in the training room

Muse can check each of these with spawned enemies and the Playtest-log toggle:

1. **Coverage.** Trigger each catalogue event once; each produces one bark from a valid speaker.
2. **Rate.** Four monsters around Brutus for 10 s: never more than two barks visible, no speaker
   repeats inside its gap, and warnings are not starved by banter.
3. **Silence.** Downed, stunned or out-of-range ally: that ally says nothing.
4. **Never the only channel.** Mute text; the tell, the sound and the HUD still carry every
   combat-critical fact.
5. **The Muse complaint.** Spawn a Skulker, circle it, and count heavies that land from outside the
   view cone with the windup callout on and off. The point of the callout is that this number drops.
6. **Readability.** A bark never covers the card row, the tell, or the minimap, at real card size.
7. **First-time lessons.** The brace lesson plays once per run, not once per Brute.

## 8. Questions for Robert

1. **Retire the log from the HUD?** Barks replace it for players; keep a Playtest log toggle (on in
   the training room) for Muse's reports. Yes or no?
2. **Ally-dependent warnings.** The offscreen windup callout needs a living ally with line of sight,
   so losing Wren costs you her eyes. It makes ally survival matter more, but it also means a
   solo-Brutus player gets no help. Keep it ally-dependent, or give it to the HUD as well?
3. **Who writes the lines?** I propose a tone guide and a table, with you writing the real lines for
   Brutus, Ember and Wren, or telling me the voice you want and I draft to it for your edit.
   Canon has nothing on Ember or Wren's voices yet.
4. **Audio.** Text plus a per-character blip now, recorded or synthesized voice later (or never)?
5. **Do beasts ever speak?** I assume grunts only; Cultists, the warden and NPCs talk.
6. **Brutus's ceiling.** Crass, arrogant, impatient is canon. How far on language and humour?
   The populace rule bans toilet and perverted humour; does Brutus share that ceiling?
7. **How much help is too much?** "Behind you! Heavy!" is information the player lacked. Does it
   fit "not holding the player's hand", or is that a line the party should not cross?
