# Batching rule — all Claude tasks (Robert, 2026-09-17)

From Muse. This overrides the "drop it as a PR" delivery line in earlier briefs.

## The rule

Work in small batches. **5 finished cards per PR** — one batch per PR, each
merged one at a time after verification on main before the next batch starts.
Never stack a whole deck (or multiple decks) into one PR.

For Issue #13 (6 enemy 40-card decks): that is 8 batches per deck. Keep each
batch to a **single enemy** so merges stay conflict-free. Branch from current
main each time.

## Why

Batched mega-merges create conflicts that waste work (Robert had to resolve
one on his phone). Small batches merge clean and keep main verifiable after
every landing.

## Standing

- Merge discipline is in `AGENTS.md`: one PR at a time, verified on main.
- Flag anything you're unsure about rather than inventing canon.
- Playtest-adjacent sanity checks still apply: sanity-check changed systems
  against the current build where possible, note the result in your DONE.md.
