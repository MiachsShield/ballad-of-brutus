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
- GPT/Astra: lane live 2026-09-19 (weekly reset). Reconciled queue in `briefs/astra/2026-09-19-lane-live.md`: Batch 1 = K1/K2/K5/K6/K7 fixes, Batch 2 = enemy card framework + Claude's Issue #13 deck batches, Batch 3 = SFX P2/P3 + remaining queue. Baseline is the 2026-09-18 accepted build; verify combat logic via harness (no WebGL), Muse does visual playtest before merge.

## Next
- Kavi: view pass-2 Bear Hug Break face in the Grok session; land JPEG on PR #3 if it passes the break read.
- Claude: write the four redo briefs now that `art/audit/` exists; deliver playtest.
- Grok: reroll Bear Hug Break tone toward action-comedy if Kavi accepts the pose; wait on binary upload.
- Astra: nothing new until the lane connects.

Goal: split 2.7.1 into shell / world / dungeon.
Claude: plan + review
Grok: dungeon + iframe bridge
GPT: tests + file split
