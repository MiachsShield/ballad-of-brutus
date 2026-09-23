# Brief — lane consolidation: all direction now flows through Claude (2026-09-23)

From Muse. Robert's order: **GitHub has blocked GPT (Astra) and Grok. From
now on, all communication and direction goes to you alone.** You are the
single collaborator lane. (Per the standing rule, lanes are defaults, not
walls — this brief is implementation work, and it is yours.)

The Astra brief `briefs/astra/2026-09-23-economy-splice.md` is **superseded**
— do not let its existence confuse you. The E1 economy splice below is the
active batch, and it is addressed to you.

## Base and branch conventions

- New branch `claude/economy-splice` from `astra/overworld-splice-1` at
  `656c08c` (the established overworld, PR #34's head).
- Open the PR against `main`; state in the PR body that it stacks on #34
  (merge #34 first).
- At most 5 completed items in the PR, per the batching rule.
- You implement directly in the build on your branch — this batch is code,
  not a design doc. Muse playtests before anything merges.

## Batch E1 — economy mechanics in the real world (5 items)

1. **Port the source-grounded economy into the PR #34 world script.** Guild
   payroll and missed-payroll departures, debt auctions (people AND
   equipment), poaching, the free-agent market, and class-demand shifts —
   wired into the real world tick. No parallel fork, no second economy, no
   invented people/currencies/guilds. The grounded study's VM harness
   (`work/astra/overworld-economy/`) documents the verified tick behavior;
   reuse its behavior, not the toy's. Do NOT build on the
   `astra/economy-pr34-grounded` world-only fork (its dungeon routes are
   disabled) — splice into the real overworld.
2. **Dungeons keep working.** Expedition prompt, Take contract, dungeon
   launch, expedition return — all functional exactly as in PR #34. Hard
   rule: **no dead controls.** Every button rendered must do what it says.
   (Muse's playtest found a clickable "Take contract" that silently did
   nothing in the study fork — that must not exist here.)
3. **Chronicle: one card per event.** Each departure currently emits two
   cards saying the same thing. Collapse to a single card.
4. **Auction integrity.** One person = one lot. The same identity must never
   appear twice in one auction section (observed in the study: "Ruemira,
   Apprentice Mage Lv10" listed at 100g and 106g). Show the player's purse
   once per auction section, not repeated under every lot.
5. **Fix the "Book with Ember (143k g)" affordance** on free-agent cards.
   Ember is already in Brutus's company and 143k g is half the treasury —
   the label is baffling. Clarify what booking means (tooltip + correct
   pricing) or remove it if it isn't meaningful.

## Hard constraints

- **Gold is not fixed-supply.** The source test proved the real economy
  creates and removes gold through its own operations. Do NOT implement a
  fixed total gold invariant, and add no new global sinks or sources.
  Robert's "strictly conserved vs merely difficult to earn" decision is
  still open — default to current behavior until he rules.
- **Pacing (from the affection/scarcity design doc):** at most one prominent
  economic opportunity demanding the player's attention at a time.
  Everything else resolves in the background and surfaces only when
  consequential.
- Companion 0 HP = permadeath still holds. Dungeon lane untouched:
  do not break enterDungeon / freshDungeon / resumeDungeon / pauseDungeon /
  exitDungeon, and a failed dungeon init must not charge an action.
- Save/load survives intact on the existing keys; no save-key collisions
  with the accepted build.

## What comes after (do NOT start yet)

Astra's remaining queue is now yours, briefed in order after E1 lands:
S2 (stance + salient reads in roster UI), S3 (flashpoint resolution
prompts), then lane-live Batches 1–3 (crash/soft-lock fixes, enemy card
framework, remaining queue). Grok's art queue is parked — blocked on
GitHub, and its cap was already spent.

## Standing

- Check `MEETING.md` at the start of your session, add feedback under your
  section, re-check for replies before you finish. Note this consolidation
  in your own words there.
- Playtest the delivered build as a player before handoff; put feedback in
  your DONE.md ordered by player impact.
- After a chunk of work: update `AGENT_HANDOFF.md`, commit on your branch,
  leave tests red/green status and the next concrete step.
- Do not force-push, reset --hard, or rebase shared branches.

## Playtest evidence this batch answers

- Auction purchase verified working (78g bid → "Calndra joins Brutus from
  Bright Harbor Co." → guild count 2→3).
- Save round-trip verified (dedicated key, exact restore after reload).
- Dead "Take contract" button found in the study fork (click: no action
  consumed, no feedback; second click hung the control).
- Duplicate auction lot + per-lot purse repetition + double chronicle cards
  all observed in the study build.
- Volatility confirmed: 3 walkouts from one guild in 6 turns — the pacing
  rule is the answer, not more events.
