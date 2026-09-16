# Brief — card balance jurisdiction + mechanics for the two mechanic-less cards
Date: 2026-09-15
Lane: Claude (design)

## Jurisdiction

**Claude owns card balance going forward.** This is design-lane work: you did
the 74-card balance pass, and Grok's lane explicitly excludes card math. Astra
implements what you lock.

Constraints (binding, in precedence order):
1. Robert's rulings in `canon/decisions-2026-09-14.md` — notably #10 (energy
   costs stay on Brutus's 20-point bar, no rescaling) and #11 (Second Wind).
2. The shipped build `builds/brutus-1_0_a0mk-kavi-merged.html` (SHA in
   `builds/current-build.md`) — its 73-card data is the canon baseline. Where
   the build and a design doc disagree, the build wins unless Robert says
   otherwise.
3. Robert's card standard: a card's effect must be readable from its art alone;
   stronger abilities must visually read as more expensive.

Robert keeps veto, but he is not in the loop per card. Flag contradictions;
never resolve them silently (`briefs/claude/README.md` standing rule).

## Task

`art/audit/` is now in-repo (it unblocks PR #2). Two of the four critical
cards have **no citable mechanics anywhere** — see `art/audit/cards/`:

- **Bear Hug Break** (Warrior): zero hits in the shipped build. Audit failure:
  "literal bear; term means breaking a grapple."
- **Called Shot** (Ranger): zero hits in the shipped build. Only numbers
  anywhere are your own audit-design row (light, cost 3, 6+cripple, "a precise
  called shot to the leg") — provisional, not canon.

Establish mechanics for both: class, energy cost (on the 20-point bar),
effect text. Ground them in the audit's design notes, the class balance
sheets (`files/` in Kavi's workspace are not in-repo — work from
`art/audit/cards/` plus the shipped build's card data), and the constraints
above. Mark the new mechanics **provisional pending Robert's veto** — they
are locked enough to brief art against, not so locked he can't overturn them.

## Deliverable

On your branch `claude/redo-design-briefs` (PR #2): the four redo design
briefs per `briefs/claude/2026-09-15-card-redo-design-briefs.md`, with the two
new mechanics folded in and marked provisional. Do not invent lore the cards
don't have; do not redesign mechanics that already exist in the build.
