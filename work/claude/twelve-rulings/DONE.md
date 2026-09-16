# DONE — twelve-rulings design update

## What I did

- Read `canon/decisions-2026-09-14.md` (the 12 rulings), `briefs/claude/2026-09-15-twelve-rulings-design-update.md`,
  `briefs/claude/README.md`, `briefs/README.md`, `MEETING.md`, `KANBAN.md`,
  `TASKS.md`, `AGENTS.md`, `AGENT_HANDOFF.md`, `STATUS.md`,
  `docs/baseline-playtest-2026-09-12.md`, and `docs/consolidated-passes-2026-09-12.pdf`.
- Downloaded `builds/brutus-1_0_a0mk-kavi-merged.html` and verified its
  SHA-256 against the hash recorded in `builds/current-build.md` (match —
  this is genuinely the file the repo says it is).
- Grepped the build directly for every mechanic named in the 12 rulings
  (crime ledger, tribute, hostility, takeover/absorb, Second Wind, energy
  scaling, victory condition, downed-companion CSS state) rather than
  inferring from docs, since I don't have "Brutus world bible v3" in
  reach (see below).
- Wrote `design-update.md`: each of the 12 rulings mapped to what's
  already implemented (verified in the actual build), what needs an
  implementation change, and what's a genuine contradiction or ambiguity
  that needs Robert's call before anyone builds on top of it.

## What I deferred

- I did **not** propose specific mechanical thresholds, numeric tuning,
  or new system architecture for the rulings that need real
  implementation work (#2, #6, #7/#8, #12) — that's Astra's lane, and the
  brief's acceptance criteria ask for doc/system-change mapping, not a
  spec. `design-update.md` scopes each gap precisely enough that a
  follow-up implementation brief can be written directly from it.
- I did **not** silently reconcile the two rulings that contradict the
  current build's own framing (#9's "region" vs. guild-charter, #11's
  Second Wind as a stunned-only card vs. its current always-available
  keybind design). Both are flagged for Robert in the summary section.

## Decisions needed from Robert

1. **#9 — win condition:** does "every region visibly under Brutus" mean
   every guild charter absorbed (already true in the shipped build), or
   does it require the separate, currently-cosmetic "region" grouping to
   become a real ownership unit?
2. **#11 — Second Wind:** the ruling describes a hand-card that displays
   only while stunned. The shipped build has no such card — Second Wind
   is a fixed keybind action gated by cooldown, not stun state, and never
   competes for a card slot. Is the ruling asking for Second Wind to move
   into the card/hand system, or does the current design already satisfy
   what the ruling was protecting against?
3. **#7 vs #8 — settlement vs. tribute:** the shipped build has one
   system (a lump-sum tribute payment buying N turns of peace). The
   rulings describe two different things — an escalating
   concession/labor ladder (#7) and a per-turn action cost with a
   success/failure/refusal ladder (#8). Are these meant to be the same
   system, or two separate player-facing choices?

## Cross-lane note

Per the standing instruction ("lanes are defaults, not walls"), I also
added my feedback to `MEETING.md` under "Feedback — Claude" in this same
branch/PR, since it draws directly on the same build-verification work
done here.
