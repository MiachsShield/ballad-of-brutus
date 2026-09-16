# Card-face audit material — the 97-face audit + the 4 critical faces

## What this is

The audit Claude ran over Grok's generated card faces (delivered 2026-09-12
~20:08 PDT), landed here because PR #2 (`claude/redo-design-briefs`) was
blocked: the brief `briefs/claude/2026-09-15-card-redo-design-briefs.md`
pointed at audit material that lived only in Kavi's local workspace and at
card data that, for two of the four cards, does not exist in the build at
all. This directory unblocks that brief. Grok's redo work reads the failing
faces in `faces/` plus the per-card notes in `cards/`; Claude's written
design briefs go to `work/claude/redo-design-briefs/` per the brief.

## The audit

- **Scope:** 97 downloaded faces audited against Robert's readability
  standard — a card's effect must be visually clear and readable from the
  art itself, and stronger abilities must visually read as more expensive
  ("effect readable from art; stronger = visibly more expensive").
- **When:** delivered 2026-09-12 ~20:08 PDT.
- **Verdicts:** 68 keep, 26 flagged for redo. (A later reconciliation with
  the 146-face pass records 97 keep / 20 soft / 29 firm across 146 faces.)
- **Critical failures (4):** Blinding Halo, Stigmata, Bear Hug Break (from
  the 97-face audit), plus Called Shot (elevated to critical in the 146-face
  audit).

The full audit records live in Kavi's local workspace, not this repo:
`files/brutus-playtest-debrief-2026-09-12.md` (97-face verdicts, including
the critical / firm / soft lists), `briefs/redo-queue-146.md` (146-face
audit), and the balance sheets
`files/brutus-card-review-sheets/brutus-class-cards-balance.md` and
`brutus-class-cards-balance-part2.md` (Claude's cost/effect designs —
reversible audit assumptions, NOT build data). This directory carries only
what the redo briefs need: the verdicts, the four failing faces, and the
per-card citable record.

## The four criticals

| Card | Class | Readability failure (quoted from the audit) |
|---|---|---|
| Blinding Halo | Priest | "garbled text baked in" — garbled text baked into the art. |
| Stigmata | Priest | "no effect shown" — the face shows nothing of its effect. |
| Bear Hug Break | Warrior | "literal bear; term means breaking a grapple" — drew a literal bear; the card is a grappling break. |
| Called Shot | Ranger | "CRITICAL/ship-blocking: baseball pitcher, wrong-universe modern sport imagery" — critical archetype break; name/effect likely fine, art is the problem. |

Full per-card records — name, class, energy cost, rules text, each with its
citable source or marked absent where no source has it — are in `cards/`.
Heads-up for brief writers: Blinding Halo and Stigmata exist in the shipped
build only as one-line overworld flavor traits (no combat cost, no rules
text). Bear Hug Break and Called Shot do not exist in the build at all.
Called Shot's only numbers are Claude's audit-design row (cost 3, 6+cripple),
which is design, not canon. Do not invent card data.

## Where the full 243-face set lives (local to Kavi's machine, not in this repo)

- Organized per-class downloads (146): knight 39, mage 33, ranger 38,
  rogue 36 —
  `~/workspace/goals/brutus-project-ai-coordination/files/brutus-card-downloads/`
- Priest (38) + Warrior (36) raw downloads —
  `~/workspace/browser_downloads/sess-1824177442`, `sess-3270307743`,
  `sess-2619048527`, `sess-2709509253`; mapped to card names in
  `files/brutus-card-review-sheets/make_sheets.py` and `make_sheets2.py`
  (the four faces in `faces/` are copied from these)
- Review contact sheets —
  `files/brutus-card-review-sheets/sheet-01.png` … `sheet-08.png`,
  `sheet-knight.png`, `sheet-mage.png`, `sheet-ranger.png`, `sheet-rogue.png`
- Face inventory — `files/brutus-card-art-inventory.md`

Only the four critical faces are copied into this repo. The rest stay local
by design — this directory is the audit record, not an art dump.
