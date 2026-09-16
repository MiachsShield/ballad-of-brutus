# Handoff

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
- Grok: fast implementation in assigned files
- GPT/Codex: tests, types, glue, second implementation pass

## Frozen (human only)
- README, CI config, secrets, lockfiles unless asked

## Status
- Claude: ...
- Grok: ...
- GPT/Astra: repository access restored; current build verified byte-for-byte
  against the local merged artifact. Astra implementation brief is ready on
  branch `astra/implementation-queue`; no gameplay changes made in this chunk.

## Next
- Astra: execute `briefs/astra/2026-09-15-implementation-queue.md` in order,
  verify the exact delivered HTML, and record tests plus player-impact
  playtest findings in `work/astra/implementation-queue/DONE.md`.


Goal: split 2.7.1 into shell / world / dungeon.
Claude: plan + review
Grok: dungeon + iframe bridge
GPT: tests + file split
