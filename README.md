# Ballad of Brutus

A guild-builder RPG prototype: an overworld of adventurers and rival guilds, and
real-time first-person dungeon delves played with cards.

## Play

Open **`builds/CURRENT-brutus.html`** in a browser, from a full checkout of the repo
(card art loads from `art/card-faces/`). There is exactly one playable build; its
name always starts with `CURRENT-`. What changed in it: `builds/current-build.md`.

## Change the game

```
node build.cjs          # rebuild builds/CURRENT-brutus.html from src/
node tests/run-all.cjs  # run every test suite (build first)
```

Edit files in `src/`, rebuild, run the tests, then play the build.
`docs/code-map.md` says what every source file does and in what order they load.

## Where things are

| Folder | What is in it |
| --- | --- |
| `builds/` | The playable build and its change log |
| `src/` | All game code. `src/baseline/` is the pinned original game; `src/world/` (overworld) and `src/dungeon/` hold the patches layered on top, grouped by system |
| `build.cjs` | The build script and the load order of every patch |
| `tests/` | One test file per system, plus `run-all.cjs` |
| `tools/` | `ow-sim.js` (headless dungeon-party sim), `playtest-harness/` (browser playtests) |
| `docs/` | `code-map.md` (every source file), `people.md` (everyone who is not a monster), card guidelines |
| `canon/` | Robert's binding decisions and the world bible. These override everything else |
| `art/` | Card faces, sprites, the binding visual guide (`art/visual-guide/`) |
| `briefs/`, `work/` | Work orders and each lane's design notes and delivery reports (history; no live code) |
| `MEETING.md`, `TASKS.md`, `DISCUSS.md` | Shared status, task queue and discussion |

## How we work

Robert decides; his settled decisions go in `canon/`. Muse coordinates, playtests and
merges. Claude covers design and implementation (all lanes except art and music since
2026-10-20). Rules for agents: `AGENTS.md`.
