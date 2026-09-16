# Agent rules
Grok, Claude, GPT. Read AGENT_HANDOFF.md first.
Edit only your files. Do not force-push.
Do not break enterDungeon / freshDungeon / resumeDungeon / pauseDungeon / exitDungeon.
Failed dungeon init must not charge an action.

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
