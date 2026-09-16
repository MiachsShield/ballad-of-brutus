# Takeover / settlement — five-factor resolution procedure

Brief: `briefs/claude/2026-09-16-astra-redistribution.md`, item C2.
Rulings this implements: `canon/decisions-2026-09-15.md` #3 ("The
dominant guild decides based on affection, hostility, their prerogative,
how strong you are and if they want you as an ally") and
`canon/decisions-2026-09-14.md` #6 (five-state affection response: welcome
/ reluctant / indifferent / desert / refuse) and #7 (settlement —
escalating concessions/labor until hostility is exhausted; exceptional
outcomes may earn affiliate treatment).

All numeric thresholds below are **my proposed starting values, not
canon** — same status as the card-balance numbers I've flagged
elsewhere. Pick one, implementable, revisable after playtesting; not a
locked design. I'm using staged checks rather than a weighted formula
because they're easier for Kavi to build exactly as written and easier
for anyone to audit which factor caused which outcome — a blended score
would hide that.

## The five inputs

1. **Affection** — guild-level average of the existing per-member
   `affection` value (already tracked via `partyAffectionTick`, per the
   twelve-rulings audit). 0–100 scale, existing.
2. **Hostility** — existing per-guild hostility value that already drives
   tribute cost. 0–100 scale, existing.
3. **Prerogative** — **new field, not found in the build.** Represents
   the guild's own independence/pride, separate from how they feel about
   Brutus specifically. Propose: a static 0–100 value set at guild
   generation (not moved by Brutus's actions the way affection/hostility
   are) — a high-prerogative guild resists submission even when it likes
   Brutus and isn't particularly hostile; a low-prerogative guild goes
   along more easily. **Flag for Kavi:** if an existing per-guild
   personality/flavor trait already covers this, reuse it instead of
   adding a redundant field — I don't have visibility into whether one
   exists.
4. **Brutus's strength** — needs to bind to whatever the build already
   uses to judge battle odds (party level total, gear tier, an existing
   "warband strength" calc) rather than a new stat. **Flag for Kavi:**
   point me at the right existing field and I'll fold the exact name in;
   I'm deliberately not inventing a new strength number here.
5. **Ally-desire** — whether *this guild* benefits from allying with
   Brutus specifically, separate from generic affection. Propose: true
   when the guild has its own active rivals/hostility directed at it from
   a third party (i.e., they're already under pressure and Brutus's
   strength is useful to them) — reuse whatever inter-guild rivalry/GvG
   hostility data already exists, if any. **Flag for Kavi:** if no
   inter-guild rivalry data exists yet, the simplest fallback is: ally-
   desire = true when this guild's hostility toward Brutus is already
   low-to-moderate (≤ 40) and trending down over the last few turns —
   i.e., they're already leaning cooperative on their own terms, not
   being forced. Pick whichever is actually buildable; both are
   defensible.

## Resolution procedure (runs whenever Brutus formally proposes takeover, or a settlement track's hostility is fully exhausted)

Evaluate in order; stop at the first stage that matches.

**Stage A — Refuse.** Hostility ≥ 70 **and** Prerogative ≥ 60 →
**REFUSE.** The guild fights on / hardens; no settlement opens from this
attempt. (High pride and high hostility together means they will not be
talked down — matches "not fair, but what is" tonally with #3's ruling
that read.)

**Stage B — Desert.** Affection ≤ 20 **and** Ally-desire = false →
**DESERT.** The guild scatters/dissolves rather than serve Brutus or keep
fighting for its own sake — distinct from refusing (which implies
continued resistance); desertion implies they don't care enough about
either side to keep fighting.

**Stage C — Welcome.** Affection ≥ 70 **and** Hostility ≤ 20 →
**WELCOME.** Best outcome — the guild takes Brutus as their new boss
outright. This is the "exceptional outcome earns affiliate treatment"
case from #7.

**Stage D — Reluctant.** Otherwise, if Brutus's Strength clears the
guild's resistance threshold (propose: resistance threshold scales with
the guild's own Hostility — the more hostile, the more strength it takes
to force the issue) **and** Ally-desire = true → **RELUCTANT.** The
guild submits, unhappy about it, but stays intact and functional under
Brutus.

**Stage E — Indifferent (default).** Anything not caught above →
**INDIFFERENT.** The guild goes along administratively — neither warm nor
actively resisting.

## Settlement terms (RELUCTANT and INDIFFERENT outcomes)

Per #7: concessions/labor escalate until hostility is exhausted, and
reducing low hostility gets progressively *more* expensive (a diminishing
-returns curve, not a flat cost) — reuse the existing hostility-scaling
shape already in `tributeQuote` rather than inventing a second curve from
scratch; the direction just needs to invert appropriately so cost per
point rises as hostility approaches zero, instead of tribute's flat
per-turn quote.

**Turn flow:** while a guild sits in RELUCTANT/INDIFFERENT with hostility
still above 0, Brutus may spend an action (same action-economy shape as
existing tribute, per #8) to pay that turn's concession cost:

- **Pay successfully** → hostility drops by the paid amount.
- **Skip a turn** → hostility drifts back up slightly (small regression —
  an incomplete settlement isn't free to leave alone), representing that
  concessions need maintaining, not just a one-time purchase.
- **Once hostility reaches 0**, re-run Stages A–E once more with
  Hostility = 0. If Affection has also climbed to ≥ 70 in the meantime,
  the guild upgrades to WELCOME. If not, it settles permanently at
  RELUCTANT/INDIFFERENT — integrated, but never warm, unless something
  else raises affection later.

This gives the settlement grind an actual payoff worth playing for
(grinding hostility alone caps out at "cold but stable"; building
affection alongside it is what earns the better ending), without adding
a second currency or action type beyond what tribute already uses.

## Outputs, summarized

| Outcome | Meaning | Ongoing state |
|---|---|---|
| Welcome | Best case — guild takes Brutus as boss | Fully integrated, warm |
| Reluctant | Submits under pressure | Integrated, cold; can upgrade via settlement |
| Indifferent | Goes along, no strong feeling | Integrated, neutral; can upgrade via settlement |
| Desert | Scatters rather than serve or fight | Charter vacated (feeds the existing turnover/replacement pool, per #12) |
| Refuse | Hardens, keeps fighting | No settlement opens this attempt; hostility/affection keep evolving until re-attempted |

## Open flags for Robert

- The exact thresholds above (70/60/20/40 etc.) are mine, not his — flag
  if any read wrong on the "not fair, but what is" tone he's set
  elsewhere, since I picked them for mechanical legibility, not narrative
  weight.
- Whether DESERT should ever be re-attemptable (a scattered guild's
  charter reopens per the existing turnover system per #12) or whether
  desertion should be treated as a harder, one-way loss than a guild
  that simply refuses and keeps existing to fight again later. I defaulted
  to "feeds the turnover pool" since that's the only vacancy-handling
  system that already exists, but this is a real narrative-weight
  question, not just a data plumbing one.
