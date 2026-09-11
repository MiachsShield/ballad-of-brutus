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
- GPT: ...

## Next
- ...


Goal: split 2.7.1 into shell / world / dungeon.
Claude: plan + review
Grok: dungeon + iframe bridge
GPT: tests + file split
