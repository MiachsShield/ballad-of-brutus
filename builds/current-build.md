# Current build

- File: `builds/brutus-1_0_a0mk-kavi-balanced.html`
- Size: 10,274,069 bytes
- SHA-256: `c5cd1f36ed4d12b3061cdec54bccbac17779af8e48eec9a007b455f4f5f84fec`
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
