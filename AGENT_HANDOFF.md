# Handoff

## Current goal

Turn 2.7.1 into a safe, testable foundation without sanding off its personality.
Do not add provinces, characters, currencies, lore, or systems until one loop works:

Notice a person → recruit or compete → risk them in a dungeon →
consequences land on the overworld → make a nastier political decision.

GPT: tests + message contract + split vs 2.7.1 baseline.
Claude: extraction plan + review; protect that loop.
Grok: one tense expedition using existing card rules; wire results back to roster.

## Ownership
- Claude: architecture, reviews, hard refactors
- Grok: fast implementation in assigned files / card faces and art
- GPT/Codex: tests, types, glue, second implementation pass

## Frozen (human only)
- README, CI config, secrets, lockfiles unless asked

## Status
- Claude: twelve-rulings design update merged (PR #1); redo-design-briefs still blocked on writing the four briefs against `art/audit/` (PR #2). Overworld adventurer slice 1 (headless sim, `work/claude/overworld-2026-09-18/`) landed 2026-09-18 via Muse (branch push failed on Claude's side; merged d49af87, verified).
- Grok: 2026-09-16 session on `grok/session-2026-09-16`. Read docs. Bear Hug Break pass-2 generated (break reads first; JPEG not committable through text connector). Discussion replies in DISCUSS.md + PLAYTEST-DISCUSS.md. PR #3 stays draft. PR #5 must not merge.
- GPT/Astra: S1 playable overworld splice candidate implemented on `astra/overworld-splice-1` (2026-09-20). World lifecycle and four-verb dungeon encounters wired; deterministic and integration checks pass. Browser/visual acceptance pending. Resume from `work/astra/overworld-splice-1/RUNBOOK.md`.
- Codex 2026-09-23: PR #34 overworld economy test based on fetched head `656c08c`, not the earlier invented toy. Branch `astra/economy-pr34-grounded` contains a standalone world-only HTML and actual-world VM harness under `work/astra/overworld-economy/`. Ten seeded 24-turn runs green; high mortality/turnover and guild payroll failures observed. Browser layout/playtest remains next. See `DONE.md`.

## Next
- Kavi: view pass-2 Bear Hug Break face in the Grok session; land JPEG on PR #3 if it passes the break read.
- Claude: write the four redo briefs now that `art/audit/` exists; deliver playtest.
- Grok: reroll Bear Hug Break tone toward action-comedy if Kavi accepts the pose; wait on binary upload.
- Astra: browser-test S1 candidate and existing expedition/refund contracts, obtain visual review, then merge S1 before S2.

Goal: split 2.7.1 into shell / world / dungeon.
Claude: plan + review
Grok: dungeon + iframe bridge
GPT: tests + file split
