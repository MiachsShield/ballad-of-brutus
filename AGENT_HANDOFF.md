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
- Claude: Training room built 2026-10-08 on `claude/training-room` as `builds/brutus-1_0_a0mk-kavi-balanced2-training.html` (balanced2 + a header button; practice arena with spawn/clear/reset, recovery and enemy-attack toggles, last-hit frame-data readout; no action cost, nothing returned to the world). Exact-file headless playtest passed: training open/leave, real expedition after training, zero page errors. Not merged; `current-build.md` unchanged. Brutus-death path in training not exercised live.
- Claude (2026-10-11, cross-lane, Robert's go): training room composed into the baseline and the playable build; E1 standalone renamed `CURRENT-brutus-astra-e1-standalone.html` (the `CURRENT-` prefix marks the one playable build; see `builds/current-build.md`). Baseline pin updated in 4 files; S1/ow-bridge/E1 suites pass; real expedition + training room browser-tested. Branch `claude/current-build-training`.
- Claude (2026-10-11): dungeon designs (design only) on `claude/dungeon-designs`: `work/claude/dungeon-designs/DESIGN.md` + `DONE.md`; PR open, nine questions for Robert. Next: six enemy 40-card decks (issue #13).
- Claude (2026-10-11): guild contracts (Access / Ally / Ally Access) composed into CURRENT via `work/claude/guild-contracts/`; baseline untouched. Branch `claude/guild-contracts`.
- Claude (2026-10-11): conquered dungeons inert for X turns (placeholder 3) and upkeep paused, `work/claude/conquest/`, composed into CURRENT. Branch `claude/conquest-upkeep`, stacked on `claude/guild-contracts`.
- Claude (2026-10-11): boss loot (MMO conventions, always a cut above generic at that level), `work/claude/conquest/boss-loot-world.js`, composed into CURRENT. Branch `claude/boss-loot`.
- Claude (2026-10-11): lockout 2-5, boss drops 1-5, angry dungeons with a rare monster, no elements (`work/claude/no-elements/`), on `claude/boss-loot` (PR #43).
- Claude (2026-10-12): 2D fist sprite in first person (`work/claude/sprite-weapon/`) and a sprite-readability proposal (`art/visual-guide/proposals/`). Branch `claude/sprite-weapon`, stacked on `claude/boss-loot`.
- Claude (2026-10-12): Muse playtest fixes: one deck choice on Deploy, straight entrance→rest→stair route on every floor, stairway marked on minimap (`work/claude/playtest-fixes/`). All suites green. Next: Muse replays "find the boss". Branch `claude/playtest-fixes`.
- Claude (2026-10-13): dungeon rank 1-5 (floors, traps, monsters, chests, pay), checkpoints with resume on re-entry, auto-return after the boss chest, card-face CSS fix, hidden chambers count once (`work/claude/dungeon-ranks/`). All suites green. Next: Muse plays a rank 1 and a rank 4 dungeon to the warden. Branch `claude/dungeon-ranks`. Same branch, same day: XP rebalance (`dungeon-ranks/xp-world.js`), companion XP + bars, status screen (`work/claude/status-screen/`). Then status screen v2 and character drives (`work/claude/character-drives/`, cross-lane: world sim).
- Claude (2026-10-13): Muse prep: no elemental names, monster standoff, training Reset keeps deck (`work/claude/playtest-fixes/MUSE-PREP-DONE.md`); new Muse brief. All suites green. Next: Muse playtest. Branch `claude/muse-prep`.
- Grok: 2026-09-16 session on `grok/session-2026-09-16`. Read docs. Bear Hug Break pass-2 generated (break reads first; JPEG not committable through text connector). Discussion replies in DISCUSS.md + PLAYTEST-DISCUSS.md. PR #3 stays draft. PR #5 must not merge.
- GPT/Astra: S1 playable overworld splice candidate implemented on `astra/overworld-splice-1` (2026-09-20). World lifecycle and four-verb dungeon encounters wired; deterministic and integration checks pass. Browser/visual acceptance pending. Resume from `work/astra/overworld-splice-1/RUNBOOK.md`.
- Claude (2026-10-19): dungeon voices, design only: characters vocalize events instead of third-person narration (`work/claude/dungeon-designs/VOICE.md`); seven questions for Robert, sample lines are placeholders. Branch `claude/dungeon-voices`.

## Next
- Kavi: view pass-2 Bear Hug Break face in the Grok session; land JPEG on PR #3 if it passes the break read.
- Claude: write the four redo briefs now that `art/audit/` exists; deliver playtest.
- Grok: reroll Bear Hug Break tone toward action-comedy if Kavi accepts the pose; wait on binary upload.
- Astra: browser-test S1 candidate and existing expedition/refund contracts, obtain visual review, then merge S1 before S2.

Goal: split 2.7.1 into shell / world / dungeon.
Claude: plan + review
Grok: dungeon + iframe bridge
GPT: tests + file split
