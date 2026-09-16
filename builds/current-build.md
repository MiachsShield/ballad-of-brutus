# Current build

- File: `builds/brutus-1_0_a0mk-kavi-fixed.html`
- Size: 10,267,745 bytes
- SHA-256: `5450cdfa8a6bcbd58d0dc05ea1449274cbb382f775faf9462abf651bd097a739`
- Contents: Kavi's fix pass over the merged baseline — K1 syncTells crash,
  K2 dead-hand cycling, K3 hold-fire (Claude C4: allies hold until Brutus
  plays his first hand-card; no timer/distance), K4 kill-log chronology,
  K5 interview abort, K6 companion permadeath, K7 companion XP,
  K8 card-face wiring (art files pending), K9 Second Wind as stun-only
  5th card (Claude C3), K10 SFX P2/P3.
- Acceptance: **PLAYTESTED 2026-09-16** — Kavi's personal browser playtest
  of this exact file: real combat, interrupts, hold-fire -> open-fire
  transition, kill-log ordering (interrupt before death, cancel-not-corpse-hit,
  no duplicate death lines), ATTACK/GUARD button, Second Wind 5th-card
  presentation. Zero page errors (only expected card-face art 404s).
- Supersedes: `builds/brutus-1_0_a0mk-kavi-merged.html` (10,259,572 bytes;
  kept as the pristine pre-fix baseline).
- Note: monolith single-file build; the source split is on the KANBAN
  ("no more inline 10MB").
