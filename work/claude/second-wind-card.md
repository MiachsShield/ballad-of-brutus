# Second Wind — card mechanics

Brief: `briefs/claude/2026-09-16-astra-redistribution.md`, item C3.
Rulings this implements: `canon/decisions-2026-09-14.md` #11 ("a card that
displays only while stunned — never occupies a useful slot while
irrelevant... overrides Claude's cut recommendation and Astra's
exclusion") and `canon/decisions-2026-09-15.md` #2 ("Card.").

## What exists today (verified in build, from `work/claude/twelve-rulings/design-update.md` #11)

Second Wind is currently **not a card**. It's a fixed keybind (`F`) with
an always-available effect gated only by a cooldown — `WIND_HP_COST_PCT`
(HP spent), `WIND_RADIUS` (knockback range), `WIND_COOLDOWN`, and an
energy-refill component. It ignores stun state entirely and never
competes for a hand slot, which is exactly the situation ruling #11 says
to replace.

This spec keeps the existing numbers and existing effect (HP cost,
knockback radius, energy refill, cooldown) — only **when it's available**
and **how it's activated** change. I'm not re-tuning values nobody asked
me to re-tune.

## Trigger and visibility

Second Wind is bound to Brutus's stun state, not to the deck/draw system:

- It does **not** live in the 40-card deck pool and is never drawn at
  random. This is deliberate — a card that could occasionally occupy one
  of the 4 hand slots while Brutus isn't stunned would violate "never
  occupies a useful slot while irrelevant" the same way the ruling
  already flags Second Wind's old keybind form as *not* violating (it
  never competed for a slot) but the ruling still wants it *presented as
  a card*. The way to satisfy both at once is to keep it outside the draw
  pool and surface it as a 5th, non-drawn card slot that only exists
  while relevant.
- **Appears** the instant Brutus enters a stunned state, *and* Second
  Wind is off cooldown. If it's on cooldown when the stun starts, it does
  not appear at all — "irrelevant" includes "currently unusable," not
  just "not stunned." (This is the one place I'm extending the ruling's
  literal wording rather than just implementing it, since leaving a
  greyed-out unusable card on screen defeats the stated purpose. Flagging
  this interpretation — if Robert wants a visible-but-disabled state
  instead, that's a one-line change to the visibility check.)
- **Disappears** immediately when: it's used, the stun ends on its own
  (stun duration expires before the player reacts), or Brutus is
  incapacitated/the encounter ends.
- Slot: rendered as a 5th card position, visually distinct from the
  numbered 1–4 hand (per the visual guide's card-readability standard,
  it should look urgent/different — a "break free" register, not another
  ability in the row). Bound to the same key it already uses (`F`) so
  existing muscle memory carries over; the change is that the key now
  only does something when the card is actually present, and the UI now
  shows a card so the action test ("name the move in under a second")
  applies to it too.

## Cost and effect (unchanged from the existing keybind)

- **Cost:** `WIND_HP_COST_PCT` of Brutus's HP. No energy cost — it never
  touches the 20-point bar, consistent with ruling #10 (don't rescale
  unless scaling is itself the effect) and with the fact that the
  existing implementation never charged energy either.
- **Effect:** breaks the stun immediately, knocks back enemies within
  `WIND_RADIUS`, refills energy by whatever amount the existing keybind
  already refills.
- **After use:** stun clears, knockback/energy-refill resolve, the card
  disappears from the hand, and `WIND_COOLDOWN` starts. If Brutus is
  stunned again before cooldown expires, the card correctly does not
  reappear (see visibility rule above) — the player just has to ride out
  that stun normally.

## Interaction with the 4-card hand

Second Wind is additive, not substitutive — it does not bump or replace
any of the 4 regular hand cards, and using it doesn't consume a card draw
or discard cycle. This is what "never occupies a useful slot while
irrelevant" actually buys the player: the 4-card hand keeps behaving
exactly as it does today, stunned or not, and Second Wind is a strictly
separate emergency action layered on top only when needed.

## What needs Kavi's confirmation, not my invention

- Whether "stunned" already has one canonical game-state flag Second
  Wind's visibility can hook into, or whether stun is currently
  represented differently by different effects (a control-tagged hit vs.
  a heavy interrupt) and needs a single shared flag first.
- Whether the existing `WIND_HP_COST_PCT`/`WIND_RADIUS`/`WIND_COOLDOWN`
  constants should be read as-is or whether any of them were tuned
  assuming the old always-available framing (e.g., a longer cooldown
  might have compensated for spam that a stun-gated version can no longer
  do) — I'm not changing them, just flagging that the *reason* they were
  set to their current values may no longer apply once availability is
  gated by stun instead of cooldown alone.

## Open flag for Robert

None — this ruling was unambiguous once "Card." resolved the only real
fork (#2, 2026-09-15). Everything else here is implementation detail
within that instruction.
