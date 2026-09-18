# Overworld adventurer layer — headless core

Robert's rulings, 2026-09-18. NPC adventurers are met **inside the dungeon**,
as DRPG-style events. You can help them, take advantage of them, or leave
them — and what sticks depends on whether they **survive**. The roster is
culled between waves, and a high level is no immunity: a knife takes anyone.

This is the first slice: the state machine only. **No combat contact, no
dungeon wiring, no UI, and nothing spliced into `builds/`.** It is meant to
answer one question before any of that happens — do grievances actually
accumulate into a roster worth having, or does everyone just die anonymously?

Run it:

```
cd work/claude/overworld-2026-09-18
node sim.js            # one readable run, all four verbs
node sim.js --soak     # 300 seeds, aggregate + invariant checks
```

## The model

**The record.** A party has identity, two traits, a tier, a stated goal, and
live state: `hp`, `supplies`, `depth`, and `capableTo` — the depth they can
actually handle. The gap between `depth` and `capableTo` is the whole sim.

**The ledger.** Not a score. Rows of
`(from, to, tag, respect, warmth, bornAt, decay)`. Asymmetric by construction:
what Brice thinks of Brutus is a different row from what Brutus thinks of
Brice. Two axes, so "I'd trust her at my back and I can't stand her" is
sayable. `decay: null` means the row never fades — a vengeful party's
`robbed-us` is permanent.

**The encounter.** One verb: `aid`, `ignore`, `exploit`, `obstruct`. The verb
decides what happened; the **trait** decides what it meant. Aid a proud party
and they log `pitied-me`. Turn a cautious party back and they log relief; turn
a reckless one back and they log a grudge.

**The after.** `stepParty` runs whether or not Brutus is there. Each tick a
party decides to press on or turn back based on hp, supplies and strain, then
takes a risk roll driven by how far past `capableTo` they are. Nothing is
authored. A party in debt won't go up empty, and that is what kills them.

**The cull.** Death calls `ledger.forget(id)`, dropping every row written by
or about them, and `runWave` deletes them from the roster. The graph stays
bounded because the world is dangerous, not because a purge is scheduled.
Soak run: roster settles around 5–6 after two waves without any cap.

**The knife.** `assassinate(state, id, { defended })` is a **state check, not
a damage check**. Undefended is lethal at any tier; defended always fails.
Symmetric — pass Brutus's id in and it kills him too.

## What the soak says (300 seeds)

```
wave-1 mortality        : 38.4%
met Brutus and lived    : 763
...still carrying a row : 480 (63%)
permanent rows alive    : 72
avg roster after 2 waves: 5.2
```

Roughly six in ten survivors who met Brutus carry something about it. That is
the number the whole design rests on: high enough that the roster means
something, low enough that "they didn't make it back" stays common.

## Not done, deliberately

- Not spliced into `builds/`. The build is a single ~10 MB HTML file, so the
  `<script>` splice should be one deliberate edit by whoever owns that file,
  not a side effect of this PR. The module already attaches as `window.OW`.
- No encounter UI, no card contact, no dungeon-event triggers.
- No sentiment → behaviour feedback yet: nothing reads `feeling()` to decide
  how an NPC acts toward Brutus on a later meeting. That is the obvious next
  slice and it is where the system starts paying out.
- Numbers (risk curve, decay windows, trait table) are first-pass and meant
  to be argued with.
