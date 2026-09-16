# Baseline playtest findings — 2026-09-12 (Kavi)

Player-seat playtest of `brutus-1_0_a0mk.html` (the build that the current
merged build is based on, before Astra's 73-card Priest/Warrior merge).
These are the known player-facing issues the next build is measured against.

## Dungeon — 4 fights / 3 expeditions

**Core fun:** interrupting enemy windups. Best beat: interrupting a Stalker's
HEAVY with Cleave for the kill.

**Issues, ordered by player impact:**

1. **First-contact fights can play themselves.** Allies killed a Skulker
   before the player acted — the opening fight needs the player.
2. **Empty wandering.** About 2 minutes between contacts with nothing
   happening; the dungeon feels vacant between fights.
3. **Post-kill log contradicts itself.** Interrupt credited after "goes down";
   "Ember's Firebolt finds nothing" fired at a corpse. Kill chronology must
   print before follow-ups.
4. **No off-screen damage direction.** Taking damage from off-screen with no
   indicator of where it came from.
5. **Dead ATTACK button.** The button does nothing; number keys are the real
   path. Either fix the button or remove it.
6. **Card-slot gap.** Slots sit empty a beat before refilling — feels broken.
7. **SFX cue drops.** Roughly 21% of cues never played.

SFX system was active (44 cues fired). Economy systems did not surface in a
dungeon session.

## Overworld — 10 turns

**Strengths:** six tabs, two actions per turn, an eventful digest (poachings,
assassinations, feud killings, romances), the interview minigame, the auction
house. This is a real game.

**Issues, ordered by player impact:**

1. **Chronicle loses personal events.** Banners vanish forever; the Chronicle
   does not log them.
2. **Actions can go negative and soft-lock the game.** A hard block on
   progress with no recovery.
3. **Roster members vanish without a trace.** Astndra disappeared with no
   explanation (later: 17 unexplained roster exits under investigation).
4. **Upkeep is toothless.** Treasury went 250k → 263k over 6 turns; no
   pressure.
5. **Causality is opaque.** Treasury growth, guild power, and ♥50 are never
   explained to the player.
6. **Stale UI bits** left in several tabs.
7. **Unexplained stat/looks drift** (Ember/Wren) between turns.
8. **Region buttons just filter People** — they promise more than they do.

**Systems observed from the player's side:** value composite, crabs-in-bucket,
and borrowed allies were visible; alliance contagion was never observed;
loyalty was invisible (tag only); the hostility ledger was partially visible.

## Standing note

Re-test every item above against each new build. An issue is closed only when
a player session confirms it is gone — not when the code looks right.
