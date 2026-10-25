# Current build

**Play:** `builds/CURRENT-brutus.html`, opened from a full checkout (card art loads from `art/`).
**Rebuild:** `node build.cjs`. **Test:** `node tests/run-all.cjs`.

## 2026-10-23 — code consolidated, dead code trimmed

- Size: 10502790 bytes
- SHA-256: `7b4c6fb3c57bc3e7a8dae8930a72e09cbe522125ae3a55da2351b24d4b6453fa`
- No gameplay change. All code moved into `src/` (one build script, `build.cjs`; one test
  runner). Dead code removed from the baseline and two unused leftovers from the patches.
  Superseded builds removed (they remain in git history). Renamed from
  `CURRENT-brutus-astra-e1-standalone.html`.
- Tests: all 14 suites pass. Seeded 12-turn overworld run identical to the previous build;
  training room fight plays; zero page errors.
- Map of the code: `docs/code-map.md`. Everyone who is not a monster: `docs/people.md`.

## Separate: Personality experiment (2026-10-25)

`builds/EXPERIMENT-personality.html` — 10594052 bytes, SHA-256
`83791d37a3b58c2980bcc49e3f9b41ef29b71e9dd777ff3e798bb0a613c757d9`. The full game with one
population: its people and guilds are the personality sim's (see `docs/personality-experiment.md`).
It is **not** the current build and does not change it. Rebuild with `node build-experiment.cjs`.

Earlier entries: `docs/build-history.md`.
