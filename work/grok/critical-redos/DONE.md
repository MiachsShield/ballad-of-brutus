# DONE — grok/critical-redos (partial)

**Agent:** Grok  
**Date:** 2026-09-15  
**Brief:** `briefs/grok/2026-09-15-critical-redo-faces.md`  
**Intended branch:** `grok/critical-redos`  
**Repo write status:** Branch `grok/critical-redos` created and files landed via a fine-grained PAT (Grok connector remains read-only / 403). Revoke that PAT after this push — it was pasted into chat.

## What was done this session

Read MEETING.md, AGENTS.md, TASKS.md, visual guide, canon rulings, and the current merged build.

Claude's per-face briefs (`work/claude/redo-design-briefs/`) have not landed on main. Worked from the failure notes in the Grok brief + visual guide. Did not invent new mechanics.

Generated four candidate faces (no baked text):

| File | Card | Class / cost (inferred, not canon-locked) | One-second read | Pass? |
|---|---|---|---|---|
| `faces/blinding-halo.jpg` | Blinding Halo | Priest · uncommon · ~3 energy · blind | Light burst makes the incoming swing miss | Yes — no text in the art |
| `faces/stigmata.jpg` | Stigmata | Priest · uncommon · def · wounds that don't slow | Glowing palm/side wounds, still stepping forward | Yes for effect; motion could be stronger |
| `faces/bear-hug-break.jpg` | Bear Hug Break | Warrior/pugilist · grappling break | Human clinch, no bear | **No** — still reads as "trapped in a hug," not the break. Needs another pass with the grip peeling open. |
| `faces/called-shot.jpg` | Called Shot | Ranger · precise shot | Arrow through the visor slit | Yes — specific target is obvious |

Source in the merged build (traits, not the 73 combat cards):

- Blinding halo — Priest adept trait, tag `blind`, "Light that makes swings guess"
- Stigmata — Priest adept trait, tag `def`, "Wounds that don't seem to slow them"
- Bear Hug Break / Called Shot — **not present** in `builds/brutus-1_0_a0mk-kavi-merged.html` under those names. They belong to the 243-face audit set that is not in this repo.

## Deferred

- Redo Bear Hug Break until the break itself is the first read.
- Re-check all four at in-game card size after they exist in a build.
- Wait for Claude's written briefs; if they contradict these reads, redo to match.
- Playtest of the 10.3 MB HTML in a real browser is not possible from this sandbox. Notes from reading the file are in MEETING feedback.

## Decisions needed from Robert / Kavi

1. Grant the GitHub connector **Contents: Read and write** (and PRs if you want a draft PR).
2. Confirm class + energy cost for Bear Hug Break and Called Shot. They are not in the 73-card Priest/Warrior list.
3. Should Grok keep producing faces before Claude's four design briefs land? Kavi said no; Robert said lanes are not walls. This pass treated the brief's failure list as enough to start.

## Cross-lane work

Looked up card text in the implementation build because the art set is not in-repo. Noted in this file.
