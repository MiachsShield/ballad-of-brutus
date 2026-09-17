# DONE — card redo design briefs (4 critical faces)

Brief: `briefs/claude/2026-09-15-card-redo-design-briefs.md`. This
supersedes the earlier version of this file, which reported the brief as
blocked — that blocker (no audit, no faces, no citable data in-repo) was
resolved when Kavi landed `art/audit/` on 2026-09-15/16. All four briefs
are written below and cited only against material that actually exists in
the repo: `art/audit/cards/*.md`, `art/audit/faces/*.jpg`, and (where no
canon number exists) my own audit-design row, explicitly marked as design,
not canon, per the audit's own brief-writer notes.

## Output

- `work/claude/redo-design-briefs/blinding-halo.md`
- `work/claude/redo-design-briefs/stigmata.md`
- `work/claude/redo-design-briefs/called-shot.md`
- `work/claude/redo-design-briefs/bear-hug-break.md`

## Cross-lane note: I didn't stop at writing the briefs blind

PR #3 (Grok, draft) already contains a first redo attempt at all four
faces, drawn before these briefs existed — Grok's own PR body says so and
asks for the next pass to match them. Writing briefs without looking at
that work would mean re-deriving directions Grok may have already hit, so
I downloaded and viewed all eight images (four originals in
`art/audit/faces/`, four redos in `work/grok/critical-redos/faces/` on
branch `grok/critical-redos`) and cross-checked each brief against what's
actually drawn, not just the original failure.

**Verdicts, mine independently, cross-checked against Kavi's and Grok's own:**

- **Blinding Halo** — redo passes. Light thrown at the target's face,
  target recoiling, no baked text. Agrees with Kavi.
- **Stigmata** — redo passes on the stated failure (the original showed no
  effect; the redo shows a cost-and-consequence gesture — glowing wounds
  on the hands, still advancing). Agrees with Kavi. Flagged a non-blocking
  side note: the figure doesn't read as Priest-class by costume.
- **Called Shot** — redo passes. No more baseball/anatomy-diagram imagery;
  arrow finding the visor gap reads as the "called shot" concept. Agrees
  with Kavi.
- **Bear Hug Break — does not pass.** Bear is gone, but the redo still
  reads as two figures locked together rather than one breaking free —
  same read Kavi and Grok's own self-assessment already flagged. My brief
  gives a concrete next-attempt direction: stage the break as an
  asymmetric silhouette (one figure driving outward, the other's grip
  visibly failing), crop tighter on the separation point itself, and lean
  on the FFXIV impact reference (REF 02) for a foreshortened break that
  reads in under a second. This is the one face still blocking PR #3.

## What I did not do

Did not touch card mechanics or invent lore for any of the four, per the
brief's own rules. Did not silently resolve the "these numbers aren't
canon" problem — every brief states plainly which numbers are mine
(design, reversible) versus what's actually in the shipped build (none,
for all four cards).

## Still outstanding on my lane

- My own playtest of the candidate build (`builds/brutus-1_0_a0mk-kavi-merged.html`)
  — carried over from yesterday, not done yet, picking this up next.
- Robert's answer on cross-class signature access (open question in
  `brutus-realtime-card-mechanics-followup.md`, delivered to him directly,
  not yet answered).
- Robert's three open questions from the twelve-rulings update (PR #1) —
  still open as of this writing.
