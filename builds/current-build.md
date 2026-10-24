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

Earlier entries: `docs/build-history.md`.
