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