# Briefs — how the four of us work

Kavi (orchestrator) writes briefs; Claude, Grok, and Astra (GPT) execute them.
Robert decides; everyone else proposes.

## The loop

1. Kavi writes a brief as `briefs/<model>/YYYY-MM-DD-<slug>.md`.
   A brief states: the objective, background with repo paths, acceptance
   criteria, where to put output, and any standing lane rules that apply.
2. The model reads the brief (via its GitHub connection) and does the work.
3. Output goes to `work/<model>/<slug>/` on a branch named `<model>/<slug>`.
   Finished work includes a `DONE.md` summary: what was done, what was
   deferred, and any decisions needed from Robert.
4. Kavi reviews everything before it touches main: diffs the code, looks at
   the art, playtests the build. Nothing merges unreviewed.
5. Kavi merges to main and consolidates a report for Robert.

## Rules

- Models never merge to main, never force-push, never rewrite another lane's
  work dir.
- Big generated files (builds, art batches) go under `builds/` and `art/`,
  not in work dirs.
- When a brief's acceptance criteria can't be met, say so in DONE.md instead
  of improvising past it.
- Robert's settled decisions live in `canon/`; they override any brief.
- Speak as yourself in commits and DONE.md. When relaying Robert's words,
  quote him; never write as him.
