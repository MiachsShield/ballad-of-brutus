# Brief — Overworld escalation layer: build integration
Date: 2026-09-19
Lane: Claude (design/spec) → Astra (implementation)

The headless prototype at `work/claude/overworld-2026-09-18/` (`adventurers.js`
+ `sim.js`) is merged to main and fully soak-tested (see `DONE.md` and
`ESCALATION.md` in that folder). It has never touched `builds/` on purpose —
that splice was always meant to be a deliberate, separate edit by whoever
owns the build file. This brief is that edit, scoped as five acceptance-
testable items per the batching rule (one system, one PR, branch from
current main).

Nothing here requires inventing new design — the mechanics (ledger, stance,
heat/flashpoints, gossip, rivalry) already exist and are tested in the
module. Your job is wiring, not design. If a clean 1:1 mapping to an
existing build concept isn't obvious for any item below, flag it back to me
rather than guessing at new mechanics — that's a design call, not yours to
make solo.

**Explicitly out of scope for this batch:** authored presentation for the
four "drastic action" moments (an ambush cutscene, a devotion scene, a
visible warning broadcast, a demand dialogue). This batch only proves the
wiring is live — real presentation is a follow-up brief once this lands and
Muse has played against it.

## Item 1 — Load the module
Include `adventurers.js` in the build as `window.OW` (it already dual-
exports for browser/node — no changes needed). Initialize one
`OW.newState()` instance when the overworld loads. No save/load integration
yet — a fresh state per session is fine for this batch.
**Acceptance:** `window.OW` is inspectable in devtools after the overworld
loads; zero new console errors.

## Item 2 — Wire real dungeon encounters
When the player meets a DRPG-style NPC party event in the dungeon and picks
a response, map it to the closest of `OW`'s four verbs (`aid`, `ignore`,
`exploit`, `obstruct`) and call `OW.encounter(state, partyId, verb)`. Use
the returned `note` as the event's flavor line. If the existing event system
doesn't have a clean 4-way mapping, tell me what it does have before
inventing one.
**Acceptance:** a scripted playtest triggers all four verbs at least once;
the log shows the real `OW` note each time, not placeholder text.

## Item 3 — Show stance on re-meeting
When a previously-met party is encountered again, call
`OW.describeStance(state, partyId)` (or `OW.Ledger.salient()` directly if
you want the pieces separately) and surface it in whatever text slot the
existing DRPG event already uses for dialogue. No new UI.
**Acceptance:** replay a seeded 2-wave scenario in-build; the shown stance
line matches what `node sim.js` prints for that same seed.

## Item 4 — Advance the world between visits
Call `OW.advanceWave(state)` once per overworld turn/day (whatever the
existing turn-advance hook is), instead of leaving the roster static between
dungeon visits. No new UI — this just makes heat/gossip/rivalry real instead
of sim-only.
**Acceptance:** a debug command (or the existing dev console) can print
`state.heat` and any `state.roster[id].flashpoint`, and both change across
turns the way the harness predicts for the same inputs.

## Item 5 — Dev-console hooks for the four resolvers
Expose `OW.vendettaStrike` / `devotionAct` / `exposeWarning` /
`attachmentDemand` as callable from whatever debug/dev console already
exists, with `ctx` typed in by hand. No authored UI — that's the follow-up
brief.
**Acceptance:** from the dev console, priming a party (via repeated
encounters) then calling the matching resolver visibly changes ledger/roster
state (inspectable the same way as item 4).

## Batching
Five items, one system (the overworld/escalation layer), branch from
current main, one PR — per Robert's 2026-09-17 rule. This does not touch
region map / takeover-settlement (C1/C2) or the card systems; it's fully
independent and can run alongside whatever else is queued.

## Verification
Same constraint as your other work: verify with your runtime harness (no
WebGL in your environment) and say exactly what you covered; Muse does the
visual playtest on the delivered build before anything merges.
