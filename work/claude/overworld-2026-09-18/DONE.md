# DONE — claude/overworld-adventurers (escalation slice)

**Agent:** Claude
**Date:** 2026-09-19
**Branch:** `claude/overworld-stance`
**Rulings implemented:** Robert, 2026-09-18 (party records, verbs, sim, cull,
assassination); creative director's escalation brief, 2026-09-19 (this
session).

## Task

Three sessions landed on this branch/PR line:

1. Slice 1 (2026-09-18): party records, the sentiment ledger, four
   encounter verbs, the off-screen survival sim, wave + cull, assassination.
2. Slice 2 (stance-read, 2026-09-18/19): `stance()`, `Ledger.salient()`,
   `TAG_TEXT`, `describeStance()` — sentiment the player can actually see,
   read off the ledger rather than a hidden meter.
3. Slice 3 (this session): the escalation layer the creative director asked
   for — "sentiment... should intensify to a point of drastic action,"
   NPC-to-NPC drama that doesn't need Brutus present, and a soak-tested
   report of what the sim actually does, not asserted numbers.

## What landed

1. `adventurers.js` — now also has:
   - **Heat** (`HEAT`, `updateHeat`): per-axis counters (`hostile`, `loyal`,
     `wary`, `fond`) that track whether a party's `stance()` reading is
     *sustained*, not just momentary. Crossing a threshold marks the party
     `flashpoint: { type, axis, primedAtWave }` — priming only, never an
     auto-resolve, per the same rule the knife already follows.
   - **Four resolvers**, same shape as `assassinate(state, id, ctx)`:
     `vendettaStrike` (hostile → ambush attempt), `devotionAct` (loyal →
     pledge or, with `ctx.danger`, self-sacrifice), `exposeWarning` (wary →
     force-gossips a warning to everyone unmet), `attachmentDemand` (fond →
     a demand that either feeds the relationship or sours it toward
     hostile).
   - **`gossip`/`runGossipPass`** — reputation propagation: a party who has
     met Brutus passes a diminished, secondhand `feeling()` to one who
     hasn't, once per listener, at a capped per-wave chance.
   - **`rivalry`/`runRivalryPass`** — two parties chasing the same stated
     goal clash with each other, independent of Brutus; real attrition
     (hp/supplies loss, occasional deaths) with no encounter involved.
   - **`advanceWave`** — the new orchestration function: `runWave` + rivalry
     pass + gossip pass + `updateHeat`, in that order. `runWave` itself is
     untouched; every existing exported function's observable behaviour is
     identical to before this session (verified below).
   - Four new `TAG_TEXT` entries for the new ledger tags this layer writes.
2. `sim.js` — now also has:
   - `runCampaign(seed, waves, opts)` — multi-wave harness. Meets a
     *fraction* of the living roster each wave (known parties first, so
     sustained behaviour is possible; the rest stay unmet — the gossip
     target pool), assigns each party a verb once and never changes it (the
     only way heat can build), resolves flashpoints as they prime, tallies
     everything.
   - `node sim.js --campaign` — one readable seed-7, 8-wave campaign trace.
   - `node sim.js --escalate` — 300 seeds x 7 waves, aggregate report:
     flashpoints by type, survivors who ever escalate and on which wave,
     gossip-tainted first meetings, rivalry clashes and their share of
     total mortality.
   - `verbose()`, `soak()`, and the seed-7 walkthrough are untouched —
     confirmed byte-identical output below.
3. `ESCALATION.md` — the design of heat/flashpoints/gossip/rivalry, and a
   "what the sim says" section with the real 300-seed numbers and a tuning
   note per finding, including two tunes the sim actually forced (`fond`'s
   threshold, rivalry's damage range — both were structurally "never
   fires" before the fix, not just rare).
4. This file.

## Verified

- Both files pass `node --check`.
- `node sim.js` (no flags) — identical output to the pre-escalation build:
  same seed-7 walkthrough, same four verbs, same knife result.
- `node sim.js --soak` (300 seeds) — **numbers unchanged from the slice-1/2
  README**: 38.4% wave-1 mortality, 763 met-and-lived, 480 (63%) still
  carrying a row, 72 permanent rows, 5.2 avg roster after two waves, all
  invariants hold. This is the regression check: the escalation layer adds
  nothing to `runWave`'s own behaviour, only to the new `advanceWave`.
- `node sim.js --campaign` (seed 7, 8 waves) — real trace: 19 parties ever
  in the roster, 13 deaths, 7 rivalry clashes (0 lethal this seed), 2
  gossip passes, 4 gossip-tainted first meetings, 3 vendetta + 4
  exposeWarning flashpoints primed and resolved, 6 parties ever reached one.
- `node sim.js --escalate` (300 seeds x 7 waves) — real aggregate:
  ```
  parties ever seen           : 5893
  total deaths                : 4047  (rivalry: 121, 2.99% of all deaths)
  rivalry clashes              : 1956
  gossip passes                : 1046
  gossip-tainted first meets   : 935  (15.87% of everyone ever seen)

  flashpoints primed by type (of 5893 parties ever seen):
    vendetta: 220  (3.73%)
    devotion: 427  (7.25%)
    exposeWarning: 1209  (20.52%)
    attachment: 108  (1.83%)
  any flashpoint at all         : 1246  (21.14% of parties ever seen)
  ```
  Re-checked at 1500 seeds x 8 waves for stability: 22.14% ever-escalate,
  2.87% rivalry-attributed deaths, 17.93% gossip-tainted — all within a
  point of the 300-seed numbers. Full write-up and six numbered findings
  (including two genuine "never fires" bugs found and fixed by the sim,
  not asserted) are in `ESCALATION.md`.

## Not done — needs a call before anyone proceeds

- **Nothing is spliced into `builds/`.** Unchanged from slice 1 — still a
  deliberate, separate edit for whoever owns the build file.
- No mixed-verb-policy campaign mode. `runCampaign` gives every party one
  verb forever, which isolates "can heat build at all" but is not what a
  real playthrough looks like; ESCALATION.md finding #1 flags that real,
  inconsistent play will likely escalate *less* than the measured 21%, not
  more, since an off-policy wave cools heat rather than building it.
- Rivalry does not compound across waves (two parties who clashed last
  wave are no more dangerous to each other this wave), and `gossipTaint`
  on a party is not cleared when the ledger row it came from decays — both
  called out in ESCALATION.md as minor, deliberately unresolved gaps.
- `attachment` (fond) is real but structurally the rarest-reachable axis
  under the current four-verb table — see ESCALATION.md finding #2 for
  why, and what verb the table would need to make it more than a 1-wave
  window.

## Next concrete step

Give the campaign harness a mixed-policy mode (verb varies per party by
some player-behaviour model instead of fixed-forever) and re-run
`--escalate` against it. That is the test that tells us whether the 21%
escalation rate reported here is optimistic or pessimistic against real
play, which nothing in this session can answer on its own.

## Playtest note

Same as slice 1: no playable surface here, nothing in the delivered build
changes. The `--campaign`/`--escalate` harness is the stand-in, and its
output is above and in `ESCALATION.md` in full. Once a flashpoint resolver
is wired to an actual dungeon-event trigger, it needs a real play session —
in particular to see whether a primed-but-unresolved flashpoint (the party
is waiting on the caller) reads as tension or as a bug when nothing visibly
changes about them in the meantime.

## Batching

Four files this session (`adventurers.js`, `sim.js`, `ESCALATION.md`,
`DONE.md`), one system, landing on the existing `claude/overworld-stance`
branch rather than opening a new one — per Robert's 2026-09-17 batching
rule and because this is additive to, not a fork of, the stance-read slice
already on that branch.
