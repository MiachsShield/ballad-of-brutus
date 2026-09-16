# DONE — card redo design briefs (4 critical faces): blocked, not completed

Brief: `briefs/claude/2026-09-15-card-redo-design-briefs.md`

## What I found

The brief assumes I hold a "97-face audit" that kept 68 faces and flagged
26 for redo, 4 of them critical (Blinding Halo, Stigmata, Bear Hug Break,
Called Shot) — referenced the same way in `MEETING.md`'s status section.
I don't have that audit. This is a fresh session with no memory of a prior
one, and I could not locate the audit itself, its findings, or the face
images it reviewed anywhere I can reach:

- **Two of the four names exist in the shipped build**
  (`builds/brutus-1_0_a0mk-kavi-merged.html`, SHA-256 verified against
  `builds/current-build.md`) — but only as one-line flavor entries in the
  overworld `ABILITIES.Priest.adept` table (simulation flavor text with a
  `tag`/`val`/`desc`, not a player-facing rules card):
  - `Stigmata` — `tag:"def", val:1.15, desc:"Wounds that don't seem to slow them"`
  - `Blinding halo` — `tag:"blind", val:0.16, desc:"Light that makes swings guess"`
- **The other two don't exist anywhere in the repo or the build.** I
  full-text searched the entire 10.2MB build file (not just the visible
  portions) for "Bear Hug", "Bear Hug Break", and "Called Shot" —
  zero matches, case-insensitive, anywhere.
- **No card-face art exists in the repo at all**, for any card. `art/`
  contains only `visual-guide/` (style-reference photos — Tactics Ogre,
  FFXIV, Bravely Default, Wizardry). `docs/consolidated-passes-2026-09-12.pdf`
  (Grok's visual pass, same date range as the rest of this material)
  confirms only 6 P0 images exist anywhere in this project's history —
  3 party busts and 3 enemy sprites — and explicitly lists "art-only
  faces for the five current cards" as **P1, NOT STARTED**. There has
  never been a checked-in card face for anything, let alone these four.
- The repo has exactly one branch (`main`) — no prior `claude/*` audit
  branch exists that this work could have landed on and not been merged
  yet.

## Why I didn't write the four briefs anyway

`briefs/claude/README.md`'s standing rule: "flag contradictions; never
resolve them silently." Writing plausible-sounding art direction for
Bear Hug Break and Called Shot — cards with no rules text, no cost, no
class, and no art anywhere I can verify — would mean inventing the two
things the brief explicitly forbids inventing ("do not invent lore the
card doesn't have," "do not redesign the card's mechanics"). I'd be
guessing at both the mechanics and the failure, not directing a fix to a
real one. That's worse than saying nothing.

For Stigmata and Blinding Halo, I could write something grounded in the
one line of flavor text each has — but the brief asks for a **redo**
brief citing "the current face" and its specific readability failure,
and no face exists to redo. Writing a "first commission" brief instead
would be answering a different, easier question than the one asked.

## What this means practically

Either:
1. The 97-face audit and its source art live in a conversation outside
   this repo (matching the pattern already visible in
   `docs/consolidated-passes-2026-09-12.pdf`, where Grok's images
   "currently live in the Grok conversation" and a push was blocked by
   read-only GitHub access) — in which case the audit, and ideally the
   actual face images for all four cards, need to land in this repo
   (`art/` or a new `art/audit/`) before this brief is executable, or
2. "Bear Hug Break" and "Called Shot" are real cards that haven't been
   added to the shipped build's data yet, in which case their rules text
   (class, energy cost, effect) needs to exist somewhere citable before
   art direction can be written against them.

## Decision needed from Robert / Kavi

Where does the 97-face audit actually live, and can the four cards' rules
text and current (failing) art be added to this repo? Once either is
in reach, I can turn the two-question brief around quickly — the format
in the original brief (name/class/cost/rules text, exact failure, art
direction, visual-guide citations, one-second read test) is clear and I
don't need it re-explained.

## Cross-lane note

Flagging this in `MEETING.md` under "Feedback — Claude" as well, since it
affects Grok's queue directly (per Kavi's own meeting note: "Grok should
not redo faces from the audit shorthand alone — Claude's written briefs
... should land first").
