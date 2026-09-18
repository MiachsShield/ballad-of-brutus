# Current build

- File: `builds/brutus-1_0_a0mk-kavi-balanced2.html`
- Size: 10,275,101 bytes
- SHA-256: `e9ff9c1052b7af3544985d7b38ef681f639f3e82921d43b9386506aa5d0df1f0`
- Bugfix 2026-09-17 (Muse), verified by exact-file playtest 2026-09-18:
  1. Card faces launched from `builds/`: `setCardFace` no longer resets a
     working `../art/...` fallback URL to the broken `art/...` path, and the
     one-shot fallback flag resets when the card URL changes — faces stay
     rendered across re-renders and deck switches. Missing art still hides
     cleanly (title-only).
  2. Combat-log chronology: consequence lines (wall hits, body slams,
     energy-out stuns, knockback kills, ward impacts) are queued per hit and
     flushed after the cause "lands" line — cause, then effect. Applied to
     ordinary hits, armor breaks, stance absorbs, ward absorbs, and Second
     Wind. "Punishes the stun" now only prints when the target was already
     stunned before the hit. Kill lines still follow the killing blow's detail.
- Acceptance: **PLAYTESTED 2026-09-18** — exact file via local
  Chrome/SwiftShader, loaded from `builds/`: Priest faces render at
  naturalWidth 784 and survive 6+ re-renders plus a discipline switch;
  106 combat-log lines across 6 sessions with zero cause/effect inversions
  (e.g. "Brute's heavy lands for 6 — sent flying." then "Ember slams into
  Wren!"); zero page errors across 7 sessions. Umbral Reaper 32/32 and
  Anthem proactive-ward behavior regression-checked.
- Supersedes: `builds/brutus-1_0_a0mk-kavi-balanced.html` (kept for reference).

# Current build

- File: `builds/brutus-1_0_a0mk-kavi-balanced.html`
- Size: 10,273,862 bytes
- SHA-256: `00cddcaccc49474d7dab1d2ca53fe5dab46621bc6b32e05762e0e51398d8fafd`
- Fix patch 2026-09-17 (Muse): Umbral Reaper text 24→32 to match its real
  dmg (BALANCE.md: cost 10→12, dmg 24→32); removed Anthem of the Unbroken's
  three unreachable fallen-companion legacy branches (downed-ally targeting
  pool, 'No fallen companion' gate, downed-target validation) — the card is
  target 'self', a proactive party-wide ward. build.py decision record
  updated to match.
- Contents: Kavi's balance pass over the fixed baseline —
  40-card Priest/Warrior decks (BALANCE.md tables; deploy preview synced,
  0-copy pool cards filtered from listing), Sprinting Cut lunge detection
  fix (+4 when Brutus lunges), Excommunication text (26 dmg, Deafen 2 turns;
  Demon/Undead rider pending R4), Guard Break text (brace-breaking),
  Sprinting Cut text (lunge bonus). Anthem/Last Rite confirmed as
  prevent-death wards (no revive path; complies with 2026-09-15 ruling).
- Acceptance: **PLAYTESTED 2026-09-17** — Kavi's browser playtest of this
  exact file: 3 genuine fights with full chronology (Brutus uses → lands
  for N → goes down → cancels), 40-card decks verified in-game
  (Deck 36 after 4-card hand), card faces render (naturalWidth 784),
  hold-fire → open-fire transition with no back-to-back re-hold,
  phone + desktop HUD. Zero page errors.
- Supersedes: `builds/brutus-1_0_a0mk-kavi-fixed.html` (10,267,745 bytes;
  SHA-256 5450cdfa8a6bcbd58d0dc05ea1449274cbb382f775faf9462abf651bd097a739;
  kept as pre-balance baseline).
- Note: monolith single-file build; the source split is on the KANBAN
  ("no more inline 10MB").
