# DONE — grok/critical-redos

**Agent:** Grok  
**Date:** 2026-09-16 (afternoon session)  
**Brief:** `briefs/grok/2026-09-15-critical-redo-faces.md` + `briefs/grok/2026-09-16-astra-redistribution.md`  
**Branch:** `grok/critical-redos`  
**Repo write status:** **Works.** Text write succeeded this session (`WRITE-TEST-2026-09-16-session.md`). Branch already existed; no force-push.

## Protocol this session

Read MEETING.md, AGENTS.md, TASKS.md, briefs/grok/*, art/visual-guide/README.md, art/audit/*, canon/, work/grok/*, work/claude/*. Confirmed Claude's `work/claude/redo-design-briefs/` has **not** landed (only `twelve-rulings/` on main). Audit material is in `art/audit/`.

## Four critical faces — status

| File | Card | Class | Audit failure | Current verdict |
|---|---|---|---|---|
| `faces/blinding-halo.jpg` | Blinding Halo | Priest (trait only in build) | garbled text baked in | **Pass** (PR #3 / Kavi) — light into eyes, miss reads; no text |
| `faces/stigmata.jpg` | Stigmata | Priest (trait only in build) | no effect shown | **Pass** — glowing wounds, still advancing |
| `faces/called-shot.jpg` | Called Shot | Ranger (not in build) | baseball pitcher / wrong-universe | **Pass** — arrow through visor slit |
| `faces/bear-hug-break.jpg` | Bear Hug Break | Warrior (not in build) | literal bear; must be grappling *break* | **Needs pass 2** — pass-1 still reads as hold |

### Bear Hug Break — pass 2 (open)

- Audit original: literal bear + baked text.
- Pass 1 (on this branch): human clinch, no bear, but first read is the *hold*; also used old slim/long-hair Brutus.
- Pass 2 (session 2026-09-16 morning): generated against locked Brutus (shaved buzz, stocky, strong jaw, young) + visual-guide action test. First read = break/punch-out, opponent hands empty, gap between torsos. No text, no bear. JPEG could not be committed through text-only path; lives in prior Grok session as `OXuck.jpg`. Tone still heavier than action-comedy register.
- **Binding constraint from this session brief:** must read as grappling BREAK (grip peeling), not a hold, and never a literal bear.

Claude per-face design briefs still missing. Will match them when they land; until then working from `art/audit/cards/*.md` + visual guide only. No invented costs or rules text.

## Write access

Confirmed working. Binary JPEGs still cannot be cleanly pushed via the text-content tools (double-encoding risk). Kavi: either (a) drop accepted pass-2 JPEG onto `faces/bear-hug-break.jpg`, or (b) grant a binary-safe upload path. Text files and DONE.md land fine.

## Not started this session

- G1 (38 Priest combat faces) — highest priority on redistribution brief, but four criticals + binary path first.
- G2 Brutus replacements (sidebar → deploy → key art).
- Remaining 22 non-critical flagged faces.

## Next concrete step

1. Kavi views pass-2 Bear Hug Break face (session file) and one-second reads it as break vs hold.
2. If pass: land JPEG on this branch; optional lighter tone reroll (G3) for action-comedy register without changing break pose.
3. Claude still owes the four written briefs so future passes lock to design direction, not audit shorthand alone.
4. After Bear Hug Break closes: start G1 Priest faces (`art/card-faces/priest/<id>.jpg`) in batches.

## Cross-lane

Did not touch Astra's blocked implementation rebuild. Did not invent card mechanics for the two cards absent from the build.
