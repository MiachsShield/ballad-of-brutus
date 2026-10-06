# S1 implementation status

Playable candidate integration is implemented on `astra/overworld-splice-1`; not yet visually accepted or merged.

World turn/save/load/New Run bindings and safe-room four-verb encounters now compose into the accepted game. Original build and Claude's source module remain unchanged.

Automated integration checks and the 700-wave deterministic harness pass. Tests use engine/DOM doubles plus exact generated script compilation, not a complete browser playthrough. Browser preview was blocked; visual/WebGL checks and failed-start refund regression remain required.

See `RUNBOOK.md` for run commands, exact artifact hashes, known limitations and the next action. The previous adapter-only stopping point is superseded.

## 2026-09-23 — browser review (Claude, working Astra's lane)

Launcher served over localhost HTTP, headless Chromium 1194 with software WebGL
(SwiftShader). The dungeon renders; zero page errors across every run. This
clears the "browser rejected localhost" blocker. Harness hooks were injected at
fetch time only; no test code is committed into the build.

### Passed in the real build
- New Run → Take contract → Descend → deck pick → dungeon renders.
- Talk in a cleared room: dialog pauses the dungeon; outside clicks and
  movement keys are blocked while open; "Not yet" and Escape both close it
  and Talk comes back; reopening shows the same party.
- View world → Resume with the dialog open: dungeon stays paused, dialog stays.
- All four verbs, one room each: aid / ignore / exploit / obstruct resolve,
  log a line in the dungeon, and a repeat Talk in that room is refused
  ("already dealt with this party").
- Return → End Turn: the wave runs (bridge operations 4 → 6), meetings reset.
- Full reload: the OW bridge state is byte-identical; all four verbs are in
  the Chronicle.
- Cancel while opening: action refunded, "The dungeon failed to open. Your
  action was returned…" logged, pendingDelve cleared.
- Old save (made in the untouched balanced2 build, no owBridge) loads in S1,
  gets a bridge on first access, plays a meeting, saves at turn 3.
- Reload mid-expedition: world returns to the pre-delve save; the unsaved
  meeting is dropped, not duplicated (known limitation, behaves as documented).

### Fixed on this branch
- **Talk button covered the minimap** (fixed top-right). Moved into the arena's
  empty bottom-left corner (`position:absolute` inside `#arena`, fixed
  fallback when there is no arena). Verified at 1400×900 and 390×844: no
  overlap with minimap or Attack/Jump; real clicks open the dialog.

### Not bugs (earlier suspicions, retracted)
- "Talk sometimes never appears" — an enemy was already aware in the entry
  room (encounter active). Hiding Talk there is correct.
- "Escape leaves Talk hidden" — timing artifact of the same cause; Escape
  closes cleanly.

### Flagged, not changed (needs a call from Robert/Muse)
1. **Talk has no one to talk to.** It is offered in any safe room, including
   the entrance, waypoint and rest rooms, with no adventurers shown in the
   world. A party should be visibly present before Talk is offered — a design
   surface S1 doesn't have yet.
2. **Duplicate party names** from the module's roster: "Aleg" and "Aleg 2"
   met back to back. Claude's module — flag only, not forked.
3. Four Warrior card faces 404 on this branch (Rime Shell, Umbral Reaper,
   Crushing Helm, Executioner's Tempo). Pre-existing; the faces landed on
   main after this branch point. Not S1 scope.

### Build hash
The PR body's hash (`865909de…`, 10,342,184 bytes) does not reproduce from
the committed sources — they rebuild to 10,342,182 bytes (`24dcc476…`),
almost certainly trailing-newline differences in the local copies the build
was made from. After the Talk fix, `node work/astra/overworld-splice-1/build-s1.cjs`
from committed sources gives:
**10,342,511 bytes, SHA-256 `5003c97fd7cb1f4d2db812132b1491d53240987dbb57f3fcae889a7b67af2519`.**
Use this one when verifying.

### Still needs Muse
A human-eyes pass on the exact file (feel, readability, sound). Real combat
to clear a room wasn't played by hand: enemies were moved out by the harness.
