# Astra brief — proper economy splice into the established overworld (2026-09-23)

From Muse. Robert's word: **proper version — a splice that works with the
already established overworld.** This is your active batch, ahead of the
lane-live queue.

## What "proper" means

The established overworld is PR #34 (`astra/overworld-splice-1`, head
`656c08c`). The economy study on `astra/economy-pr34-grounded` and its
`brutus-economy-full` test file is a **world-only fork with dungeon routes
disabled — it is not the target.** Do not build on the fork. Splice the
working economy mechanics into the real overworld, with dungeons fully
functional.

Claude's affection/scarcity design doc (uploaded 2026-09-23) is the design
reference for direction. This batch is the mechanics splice only — not the
full three-goal pressure model (security/ambition/attachment, pressure
0–100). That comes as a later batch after this lands.

## Base

New branch `astra/economy-splice` from `astra/overworld-splice-1` at
`656c08c`. Open the PR against `main`; state clearly in the PR body that it
stacks on #34 (merge #34 first). At most 5 items in the PR, per the batching
rule.

## Batch E1 — economy mechanics in the real world (5 items)

1. **Port the source-grounded economy into the PR #34 world script.** Guild
   payroll and missed-payroll departures, debt auctions (people AND
   equipment), poaching, the free-agent market, and class-demand shifts —
   wired into the real world tick. No parallel fork, no second economy, no
   invented people/currencies/guilds. The grounded study's VM harness
   (`work/astra/overworld-economy/`) is your spec for what the real tick
   does; reuse its verified behavior, not the toy's.
2. **Dungeons keep working.** Expedition prompt, Take contract, dungeon
   launch, expedition return — all functional exactly as in PR #34. Hard
   rule: **no dead controls.** Every button rendered must do what it says.
   (Muse's playtest found a clickable "Take contract" that silently did
   nothing in the study fork — that must not exist here.)
3. **Chronicle: one card per event.** Each departure currently emits two
   cards saying the same thing ("X leaves Y" + "Word gets around: X walks
   out on Y"). Collapse to a single card.
4. **Auction integrity.** One person = one lot. The same identity must never
   appear twice in one auction section (seen in the study: "Ruemira,
   Apprentice Mage Lv10" at 100g and 106g). Show the player's purse once per
   auction section, not repeated under every lot.
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
- **Pacing (from the design doc):** at most one prominent economic
  opportunity demanding the player's attention at a time. Everything else
  resolves in the background and surfaces only when consequential.
- Companion 0 HP = permadeath still holds. Dungeon lane untouched.
- Save/load survives intact on the existing keys; no save-key collisions
  with the accepted build.
- If the module needs a change, flag it in your change log instead of
  editing Claude's files.

## Acceptance (Muse will playtest in the local browser)

- New run → end turns → payroll failures, departures, auctions, poaching
  occur in the real world UI.
- Take contract launches the dungeon; expedition returns to the world.
- No dead buttons anywhere in the world UI.
- Buy at auction → roster changes, Chronicle records it.
- Save → full reload → state intact.

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
