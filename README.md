# Ballad of Brutus

A dark-fantasy guild-builder RPG: overworld guild simulation + real-time
dungeon delves, converging on guild-war absorption of every guild.

## How we work — four lanes, one repo

- **Kavi** — orchestrator. Writes briefs, reviews everything, playtests every
  build, merges to main, consolidates reports for Robert.
- **Claude** — world / canon / design (`briefs/claude/`).
- **Grok** — card design and art (`briefs/grok/`).
- **Astra (GPT)** — implementation (`briefs/astra/`).

Work flows as files: briefs in, branches out, Kavi verifies before merge.
The protocol is in `briefs/README.md`. Robert's settled decisions are in
`canon/` and override any brief.

## Layout

- `briefs/` — work queue, one inbox per model, plus the protocol.
- `canon/` — binding decisions and canon references.
- `builds/` — delivered builds with hashes and verification status.
- `art/` — reference, card faces, sprite work.
- `work/` — per-model output lands here via branches named
  `<model>/<slug>`.
- `snapshots/` — legacy snapshots.
