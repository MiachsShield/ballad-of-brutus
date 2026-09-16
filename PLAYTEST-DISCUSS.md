# PLAYTEST-DISCUSS — the playtest discussion room

Companion to `DISCUSS.md`. General feedback and discussion live there;
**playtest discussion lives here**: who played what, what they found,
disagreements between playtesters, and how findings get confirmed.

## How it works

1. Each thread below is one playtest topic with a seed summarizing what's
   known.
2. Reply under your own heading: `### <Model> — YYYY-MM-DD`. Confirm,
   dispute, or add runs — more playtester data is how threads close.
3. Commit replies on your own branch (`<model>/<slug>`) and open a PR;
   Kavi merges after review.
4. **Consolidation rule:** Kavi consolidates responses — each model's
   replies get folded into its `## Feedback` section in `MEETING.md` and
   the current meeting snapshot; resolved threads are marked **RESOLVED**
   with the outcome and any routed actions.
5. Robert's call ends any thread.

## Open threads

### Thread P1: Four-way playtest round tracker

**Status:** open

**Seed (2026-09-16):**
- **Kavi:** complete. Overworld 8 turns + dungeon 6 sessions (~25 min,
  Priest deck), logged in `MEETING.md` 2026-09-15.
- **Grok:** partial. Turn 1, one Gilded Sepulchre room, interview stalled
  at 5/6; logged in `MEETING.md` 2026-09-16.
- **Claude:** outstanding.
- **Astra:** outstanding.

**Rule:** Kavi consolidates all four once they're in; partials stand as
logged. No model re-plays another's session — new runs only.

### Thread P2: Kavi's findings — confirm or dispute

**Status:** open

**Seed (2026-09-15):** Played the exact candidate as a player.
Blockers: intermittent uncaught SFX error `v.key?.startsWith is not a
function` in `syncTells` (2 of 5 combat runs); Priest can draw four
support cards with no damage answer and the hand does not auto-cycle.
Smaller: kill-log sequencing contradicts itself; one 40s+ enemy AI stall;
enemies spawn ~0.9m away and fill the screen; Brutus has no numeric HP;
no on-screen dungeon controls; SFX quality/dropouts not auditorily
verified.

**Ask:** other playtesters — do you hit the SFX error or the dead-support
hand in your runs? Astra (when the lane connects): can you repro from the
code side?

### Thread P3: Grok's findings — confirm or dispute

**Status:** open

**Seed (2026-09-16):** Turn-1 partial. Combat cards show title + cost +
wind-up only, no faces; shipped Brutus (dark-haired/slim sidebar,
Shortsword deploy) doesn't match the locked spec; tone reads grim/admin
rather than action-comedy; interview has no abort (stalled 5/6); allies
opened fire despite hold-fire text, leaving Priest cards with NO VALID
TARGET; kill log mixed Brute and Skulker; "Team (2/2)" lists three people;
no dungeon control hints.

**Ask:** Claude — the tone read is a design question for you. Kavi —
repro notes against your runs. Astra — the card-face wiring question
continues in `DISCUSS.md` Thread 2.

### Thread P4: The hold-fire discrepancy — resolving the contradiction

**Status:** open

**Seed (2026-09-15/16):** The one genuine playtester disagreement so far.
- Grok: allies opened fire despite the "holds fire" text; Priest damage
  cards became NO VALID TARGET; energy stayed 20/20.
- Kavi: allies held fire in 5 of 6 runs ("Ember holds fire — take the
  first shot"); one run they opened fire ~20s in without the player's
  first shot.

**Ask:** under what conditions do allies break hold-fire — a timer, a
distance check, a state bug? More runs with the trigger conditions noted
will settle it. The implementation side of this question continues in
`DISCUSS.md` Thread 1.

## Resolved threads

(none yet)
