# Escalation layer — heat, flashpoints, gossip, rivalry

Built on top of the slice in `README.md`. Same rule: pure state machine, no
combat/card/render/dungeon contact. Run it:

```
node sim.js --campaign    # one readable multi-wave campaign, seed 7
node sim.js --escalate    # 300 seeds x 7 waves, aggregate + real numbers
```

## The model

**Heat.** Every wave, `updateHeat` reads each met survivor's `stance()` and
bumps a counter on whichever of the four escalating axes it currently reads
— `hostile`, `loyal`, `wary`, `fond` — while the other three cool by one.
Heat is per-axis, not per-party: a stance is a snapshot, heat is its memory
of whether that snapshot has been *sustained*. Cross a threshold
(`HEAT.hostile = 3`, `loyal = 3`, `wary = 2`, `fond = 1` — see "what the sim
says" for why fond is 1) and the party is marked `flashpoint: { type, axis,
primedAtWave }`. That is *all* the tick loop does. Heat then freezes on that
party until the flashpoint is resolved — no double-priming.

**Flashpoints are caller-resolved, same as the knife.** Nothing auto-fires.
Four resolvers, same shape as `assassinate(state, id, ctx)`:

- `vendettaStrike(state, id, ctx)` — hostile → ambush. `ctx.defended` false:
  it lands, the ledger toward Brutus is spent. `ctx.defended` true and
  `ctx.lethal` true: the attacker dies going for him. Defended and not
  lethal: it fails and the grudge *sharpens* (heat drops by only 1, not to
  0 — next attempt comes faster).
- `devotionAct(state, id, ctx)` — loyal → devotion. `ctx.danger` true: real
  self-sacrifice, they die shielding him. Otherwise: a permanent pledge
  row (`gave-everything`), no death — devotion without real danger present
  is a vow, not a suicide.
- `exposeWarning(state, id, ctx)` — wary → spreads word. No death, no
  request: it force-gossips a warning (factor 0.6, stronger than idle
  gossip's 0.35) to every living party who hasn't met Brutus and hasn't
  already been tainted.
- `attachmentDemand(state, id, ctx)` — fond → clinginess. `ctx.granted`
  true: satisfied for now, heat drops by 1 (they'll be back). False: a
  `demand-refused` row at warmth `-3` — refused affection sours hard enough
  to start feeding the *hostile* axis on its own.

**Gossip.** `gossip(state, fromId, toId, opts)` — a party who has met
Brutus passes a diminished (`factor 0.35` default) copy of their live
`feeling()` to one who hasn't, tagged `heard-of-him`, one impression per
listener (repeats are silently dropped — see below for why). `runGossipPass`
runs it once a wave at `chance 0.4` per listener, picking a random teller.
This is what makes reputation precede him: a party's *first real* stance
toward Brutus can already be non-zero before `encounter()` is ever called on
them.

**Rivalry.** `rivalry(state, aId, bId)` — two parties with the same
`goal.id`, in a `hp`/`supplies` clash that has nothing to do with Brutus.
`runRivalryPass` groups the current roster by goal and pairs same-goal
parties off two at a time at `chance 0.5` a wave. Damage is 15–59 to each
side (tuned up from an initial 10–29 that turned out to never kill — see
below).

**Orchestration.** `advanceWave(state, ticks, opts)` = `runWave` + rivalry
pass + gossip pass + `updateHeat`, in that order (a party rivalry kills this
wave never gets heat-updated; a party that just died in the dungeon never
gets gossiped about). `runWave` itself is untouched — existing callers of
`runWave`/`stepParty`/`encounter`/`assassinate`/`stance` see identical
behaviour; `advanceWave` is new and additive.

## What the sim says (real numbers, 300 seeds x 7 waves unless noted)

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

first-prime wave distribution:
  wave 1: 59   wave 2: 152  wave 3: 272  wave 4: 214
  wave 5: 206  wave 6: 133  wave 7: 210
```

Re-run at 1500 seeds x 8 waves to check it wasn't a small-sample fluke:
`everFlashpoint 22.14%`, `clashDeaths 2.87%`, `gossipTainted 17.93%` — all
within a point of the 300x7 numbers above. Stable.

**1. ~21% of every party who ever passes through the roster escalates at
least once over a 7-wave campaign. That is the headline number and it is
in the target band** — reachable but earned, not everyone (79% never do)
and not no one. *Tip: this is with a single consistent verb-policy per
party (the harness's stand-in for "the player always treats this NPC the
same way"). Don't tune the thresholds further without also testing mixed
policies — a real player will be inconsistent, and that inconsistency
mostly *cools* heat (each off-axis wave decrements it), so real play will
likely escalate less than this number, not more.*

**2. The four flashpoint types are badly skewed: exposeWarning is 55% of
all primes (1209 of 1964 raw fires); attachment is under 2%.** This is not
an accident of thresholds, it's structural in the verb table. `stance()`
checks `loyal` and `wary` before `fond`, and every branch of the `aid` verb
grants *some* positive respect alongside its warmth — so a run of `aid`
either lands in `loyal` immediately (default/greedy branches, both axes
cross together) or in `wary` immediately (proud branch: respect jumps
above threshold on the very first hit while warmth stays negative). There
is no verb-trait combination where sustained `aid` reads as `fond` for two
consecutive waves. *Tip: `HEAT.fond` was 2 at first and fired on 0 of 5950
parties across the first 300-seed run — a genuine "never fires," not just
a rare one. Brute-forcing all trait pairs against 6 repeats of each verb
found exactly one path to `fond` at all: `obstruct` on a `cautious` party
lands there for one wave, then tips into `loyal` on the next hit. Lowering
`HEAT.fond` to 1 (fire on the first fond wave, before it can flip) is what
gets attachment off zero, to 1.83%. If a richer verb set is ever added,
this is the axis to build it for — a "flatter"/"favor" verb that raises
warmth without raising respect is the missing piece, not a threshold.*

**3. exposeWarning firing on 1 in 5 parties means gossip's own dampers are
doing real work.** `exposeWarning` force-broadcasts to *every* untainted,
unmet listener at once (not the 0.4-a-wave passive rate), so a roster with
several proud-trait veterans getting `aid`-ed repeatedly could plausibly
carpet-taint every newcomer in one wave. It doesn't, because gossip has two
independent brakes: `to.gossipTaint` (one impression per listener, ever)
and `to.metBrutus` (a met party is not a valid listener at all). Between
those, 15.87% of everyone the campaign ever saw got a secondhand opinion
before their first real encounter — a meaningful minority, not the whole
roster. *Tip: if this stays a static 300-seed target after real players
are in the loop, the two brakes are enough; if actual play produces
long-lived veteran rosters (more than this harness's ~5-6 per wave), watch
this number — a bigger, longer-lived teller pool could push it toward
saturation over many more waves than tested here.*

**4. Rivalry's first cut was pure flavour text: 0 deaths from 1956
clashes at the original 10-29 damage roll.** Diagnostic: ran the pass at
`chance 1` (clash on every eligible pair, every wave) across 300 seeds —
minimum hp observed after any clash, out of ~4000, was 12. Never zero.
Post-wave healing (`min(100, hp+40)`) means most parties enter a clash
close to full hp, and a single 10-29 hit almost never closes that gap.
Widened to 15-59; that alone produced 121 clash deaths (2.99% of all
deaths) at default `chance 0.5`. *Tip: 2.99% is a real but minor
contribution — "drama that has nothing to do with the player" is present
and observable in the log (`verb: 'rivalry'`), but it is not yet a major
mortality driver. If the brief wants rivalry to matter as much as the
dungeon itself, either raise the chance, let unresolved rivalries compound
turn over turn (nothing currently makes two parties who fought last wave
more dangerous to each other this wave), or stop healing combatants to
full between waves before the rivalry pass runs.*

**5. Vendetta is real but the rarest heavy-axis flashpoint (3.73%), and it
is trait-gated more than verb-gated.** Cross-checked against the encounter
table: `exploit`'s "default" and "pragmatic" branches always grant +1/+2
respect per hit, which crosses `stance()`'s `wary` threshold (`resp >= 2`)
before warmth crosses the `hostile` threshold (`warm <= -5`) — so repeated
exploitation of a non-vengeful party tends to read as *wary*, not hostile,
because `wary` is checked first in the branch order. Only the `vengeful`
branch (`warmth -5` in a single hit) or sustained `ignore` (which never
grants respect at all) reliably produces true hostile heat. *Tip: this is
the mirror of finding #2 — "wary is checked before hostile" is doing the
same kind of quiet redirection that "loyal/wary before fond" does. If
vendetta feels too rare in actual play, the fix is not `HEAT.hostile`, it's
that `exploit`'s respect grant competes with its own warmth grant for which
threshold gets crossed first.*

**6. Devotion (7.25%) sits in a healthy middle** between the common,
lesser exposeWarning and the rare, heavy vendetta — `aid`'s default and
greedy branches both cross `loyal`'s two-axis bar cleanly within 2-3 waves
of consistent aid, with no branch-order fight to lose (loyal is the very
first non-indifferent check in `stance()`). No tuning issue found here.

**7. A party can escalate more than once in one campaign.** Raw
flashpoint fires (220+427+1209+108 = 1964) exceed the deduped "ever
escalated" count (1246) by 718 — about a third of everyone who escalates
does it more than once. The clearest chain in the seed-7 trace: a
`demand-refused` (attachment) writes warmth `-3`, which can push a
previously-fond party straight toward cold/hostile and prime a *second*,
heavier flashpoint later in the same campaign. This is not scripted
anywhere — it falls out of `demand-refused` sharing the same warmth axis
`updateHeat` reads. Worth keeping in mind for pacing: refusing a demand is
not a safe "no," it can be the first domino toward a vendetta.

## Fixed after review

- **A resolver-killed party sat in the roster with a stale `flashpoint` and
  `heat` entry for one extra wave.** `advanceWave` cleans up `state.heat` for
  anyone lost in that wave's dungeon runs or rivalry clashes, but
  `vendettaStrike`'s lethal-defended branch and `devotionAct`'s self-sacrifice
  branch run *after* `advanceWave` returns (the campaign harness resolves a
  freshly-primed flashpoint the same tick it's reported), so those deaths
  weren't caught by that cleanup — the corpse kept its flashpoint and heat
  object until the *next* wave's `runWave` finally culled it, one wave later
  than a dungeon death. Not a soundness bug (`updateHeat` and the resolvers
  both already bail on `!p.alive`, so it never double-fired or skewed the
  reported percentages), but real state untidiness. Fixed by clearing
  `p.flashpoint` and `state.heat[partyId]` at the moment either lethal branch
  fires, matching how a dungeon death is cleaned up same-wave. Re-ran
  `--soak` and `--escalate` after the fix: every number above is unchanged,
  as expected — this only touched cleanup timing, not any decision logic.

## Not done, deliberately

- No mixed-verb-policy campaign mode. Every party in `runCampaign` gets one
  verb forever; that is deliberate for isolating "does sustained sentiment
  reach a flashpoint at all," but it is not what an actual playthrough
  looks like, and finding #1's caveat applies: real numbers under mixed
  play are untested here.
- Rivalry does not compound across waves (finding #4) and gossip does not
  currently decay `gossipTaint` itself (only the ledger row it wrote does,
  at `SHORT` — the taint record on the party persists after the row
  expires, which is a minor state/ledger mismatch worth a look if
  `gossipTaint` ever drives visible behaviour beyond the sim harness).
- Numbers above are first-pass-plus-one-tuning-round, same as the original
  README's numbers were "first-pass and meant to be argued with." The
  fond/rivalry tunes in this doc are the two the sim actually forced;
  everything else is reported as observed, untouched.
