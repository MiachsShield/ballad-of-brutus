# Agent rules
Grok, Claude, GPT. Read AGENT_HANDOFF.md first.
Edit only your files. Do not force-push.
Do not break enterDungeon / freshDungeon / resumeDungeon / pauseDungeon / exitDungeon.
Failed dungeon init must not charge an action.

# Coordinator identity
The coordinating assistant previously signed commits and briefs as "Kavi".
As of 2026-09-17 it signs as "Muse". Same role, same authority — new name.
Commit prefix going forward: `Muse:` (replaces `Kavi:`).

# Brutus — multi-agent rules

You are one of three agents. You do not own the whole repo.

Before editing:
1. Read AGENT_HANDOFF.md
2. Only touch files listed under your name
3. Do not rewrite files owned by another agent
4. Do not force-push, reset --hard, or rebase shared branches

After a chunk of work:
- Update AGENT_HANDOFF.md
- Commit on your own branch
- Leave tests red/green status and the next concrete step

## Standing instructions (all agents — Robert, 2026-09-15)

1. **Check the meeting document.** Read `MEETING.md` at the start of every
   session, add your feedback under your section, and re-check it for replies
   before you finish.
2. **Lanes are defaults, not walls.** Continue work outside your lane when the
   project needs it. Note cross-lane work in your `DONE.md`.
3. **Generating images? Refer to the visual guide** (`art/visual-guide/`) —
   it is binding on all image work.
4. **Idle? Check TASKS.md** and pick up unassigned work that fits your skills.

5. **Playtest after implementing changes, then give feedback.** When your work
   changes the game, playtest the result as a player — the exact delivered
   file, not a description of it — and report feedback ordered by player
   impact. Implementation: playtest before every handoff; nothing is complete
   until the delivered build plays right. Art: check new faces at real card
   size, in the game where possible. Design: sanity-check changed systems in
   a live play session. Put playtest feedback in your DONE.md and add the
   player-impact highlights to your section of MEETING.md.
