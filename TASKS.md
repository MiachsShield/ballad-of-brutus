# TASKS — Ballad of Brutus

Live task board. Kavi updates this file when tasks are assigned or completed.
Each task links to its brief; completed work includes a `DONE.md` in the
model's `work/<model>/<slug>/` directory.

**Idle rule (all models):** when you have no open briefs in your lane, come
here and pick up unassigned work that fits your skills. Lanes are defaults,
not walls — if the project needs work outside your lane and you are the one
available, do it, and note the cross-lane work in your `DONE.md`.

## Claude — world / canon / design

| Status | Task | Brief |
|---|---|---|
| [ ] open | Incorporate the 12 settled rulings into design docs | `briefs/claude/2026-09-15-twelve-rulings-design-update.md` |
| [ ] open | Write redo design briefs for the 4 critical-fail card faces | `briefs/claude/2026-09-15-card-redo-design-briefs.md` |
| [ ] open | Add your feedback to the meeting document | `MEETING.md` → "Feedback — Claude" |

## Grok — card design & art

| Status | Task | Brief |
|---|---|---|
| [ ] open | Redo the 4 critical-fail card faces against the visual guide | `briefs/grok/2026-09-15-critical-redo-faces.md` |
| [ ] open | Add your feedback to the meeting document | `MEETING.md` → "Feedback — Grok" |

## Astra — implementation

| Status | Task | Brief |
|---|---|---|
| [ ] blocked | Apply the 12 rulings + full fix queue to the next build | `briefs/astra/2026-09-15-implementation-queue.md` |
| [ ] open | Add your feedback to the meeting document | `MEETING.md` → "Feedback — Astra" |

Astra's implementation briefs are queued until its ChatGPT lane is connected;
nothing in the implementation lane can execute before then.

## Unassigned

- Final readability audit of Grok's redone faces once they land (Claude).
- Redo briefs + new art for the remaining 22 non-critical flagged faces (Claude → Grok).
- Source-split of the 2.7.1 single-HTML build (per repo KANBAN; Astra when live).
- Personal playtest of `builds/brutus-1_0_a0mk-kavi-merged.html` — Kavi, before
  it is promoted to accepted baseline.


## Playtest assignments (Robert 2026-09-15)

After implementing changes, playtest the result as a player and give feedback
ordered by player impact. Until changes land, playtest the current build
(`builds/brutus-1_0_a0mk-kavi-merged.html`) for baseline familiarity.

| Status | Who | Playtest task |
|---|---|---|
| [ ] open | Claude | Play the current build; sanity-check the systems your design docs touch. Feedback in MEETING.md. Re-playtest after doc-driven build changes land. |
| [ ] open | Grok | Play the current build; view card faces at real card size in-game. Feedback in MEETING.md. Re-check every redo face at card size before handoff. |
| [ ] open | Astra | Playtest the exact delivered build before every handoff — nothing is complete until it plays right. (Blocked until lane connects.) |
| [ ] in progress | Kavi | Playtesting `brutus-1_0_a0mk-kavi-merged.html` now as the player-seat baseline. |

Baseline findings to regress against: `docs/baseline-playtest-2026-09-12.md`.
Full context: `docs/consolidated-passes-2026-09-12.pdf`.

## Completed

- *(none yet — this board starts 2026-09-15)*
