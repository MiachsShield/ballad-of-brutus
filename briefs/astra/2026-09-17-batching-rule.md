# Batching rule + implementation queue — Astra (Robert, 2026-09-17)

From Muse. Your lane reconnects after the weekly limit reset (Saturday
2026-09-19). When you're back, this is how work ships.

## The rule

Work in small batches. **5 finished items per PR** — one batch per PR, each
merged one at a time after verification on main before the next batch starts.
No mega-PRs. Branch from current main each time.

## Why

Batched mega-merges create conflicts that waste work (Robert had to resolve
one on his phone). Small batches merge clean and keep main verifiable after
every landing.

## Queue (when the lane is live)

1. **Enemies-use-cards implementation** (Robert's 2026-09-17 ruling, locked):
   every enemy uses cards — no separate enemy ability system, no magic
   system. Enemy decks are 40 cards ("at this time"), enemy energy is the
   same 20-point bar, enemy cards are enemy-only designs (never shared from
   player classes). Implement against Claude's deck designs as they land
   (Issue #13, in 5-card batches). Enemy card faces wire through the same
   `art/card-faces/<class>/<id>.jpg` path as player faces.
2. Then the standing implementation queue (`briefs/astra/2026-09-15-implementation-queue.md`).

## Standing

- Merge discipline is in `AGENTS.md`: one PR at a time, verified on main.
- Playtest after implementing: the exact delivered file, as a player, before
  every handoff. Nothing is complete until the delivered build plays right.
  Report feedback ordered by player impact in your DONE.md and MEETING.md.
- Edit a copy of the build, never the original.
