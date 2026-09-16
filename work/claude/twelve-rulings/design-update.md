# Design update — the 12 settled rulings (2026-09-14)

Brief: `briefs/claude/2026-09-15-twelve-rulings-design-update.md`
Binding source: `canon/decisions-2026-09-14.md`

## Sourcing note (read this before the rest)

The brief points at "the Brutus world bible v3 (2026-09-12) in the Brutus
project's knowledge" as the design surface to update. I don't have a
document by that name. What I actually have access to is:

- Four memory docs (`overview.md`, `design-principles.md`,
  `guild-economy.md`, `workflow-and-tools.md`), last touched 2026-09-10
  through 2026-09-12 — pre-dating this repo and the 12 rulings.
- `docs/consolidated-passes-2026-09-12.pdf`, which itself says "Brutus
  world bible v2 ... exists as a chat attachment but has not been verified
  inside the Project file list" as of 2026-09-12.

So a "v3" bible was never uploaded anywhere I can reach, or it lives in a
conversation this session doesn't have. Rather than invent doc sections
that don't exist, I verified every ruling below directly against the
current source of truth instead: `builds/brutus-1_0_a0mk-kavi-merged.html`
(confirmed via `sha256sum` against `builds/current-build.md`'s recorded
hash — match). That build is 10.2MB of inline JS; I downloaded and grepped
it rather than reading it inline. Everything marked **Verified in build**
below is a direct code read, not an inference.

**Flag for Robert:** if "world bible v3" is a real document, it needs to
land in this repo (`canon/` or a new `docs/world-bible.md`) before design
docs can be said to reflect it. Until then, this update targets the build
plus the four memory docs above, and calls out anywhere those two sources
disagree.

---

## 1. Companion 0-HP — banked for playtest

**Ruling:** loss-aversion hypothesis stands; 0-HP companions are banked,
not lost.

**Verified in build:** a `.member.downed` CSS state already exists
(`opacity:.42; filter:grayscale(.8)`) — a downed party member is greyed
out, not removed. I did not find a revive/recovery path in the strings I
checked (`revive` has zero matches in the build).

**Design doc change:** none needed to the *rule itself* — the build
already implements "banked, not lost." What's missing is the playtest
instrumentation the ruling asks for: a way to tell, after a session,
whether losing a companion to 0 HP still stung even though the game kept
them around. Add to the playtest checklist (`docs/` or `TASKS.md`, Kavi's
call): does the player still react to a downed companion, and is there a
visible recovery path back to active duty, or do they just sit greyed out
forever? If there's truly no revive path, "banked" currently means
"permanently benched," which may not be what was intended.

**Flag:** no revive/recovery mechanic found. If one exists under a name I
didn't search, ignore this; if not, that's a real gap against the ruling's
own framing ("banked for playtest" implies they come back).

## 2. Expedition XP — survivors earn XP after every defeated enemy

**Verified in build:** I could not find an XP-gain function tied to enemy
defeats under any of the obvious names (`gainXP`, `xp+=`, `experience`).
The only XP-adjacent hit was unrelated (recruit-protection timing).

**Design doc change:** this ruling looks **not yet implemented**, or
implemented under a naming convention I didn't guess. This is Astra's
implementation lane per `briefs/astra/2026-09-15-implementation-queue.md`,
not a doc change on my end — flagging it here so it's not assumed done
when the design docs get updated to describe it as live.

**Flag:** design docs should describe post-fight XP as the *intended*
behavior, not confirmed-shipped, until Astra's queue confirms it or a
playtest observes it.

## 3. Ambush and formal-war deaths — count as murder

**Verified in build:** `recordCrime(g,'murder')` already fires for named
ambusher kills and generic ambush-wave kills (`killInGvG` path). I did not
find the same call wired to formal-war (`declareWar`) casualties
specifically — `doBattle`/`resolvePlayerBattle` didn't show an obvious
`recordCrime(..., 'murder')` call in the snippets I pulled, though I did
not read the full battle-resolution function line by line.

**Design doc change:** document that murder-crime recording exists for
ambush kills; **flag for Robert/Astra** whether formal-war casualties are
already tagged as murder in the parts of `resolvePlayerBattle` I didn't
fully trace, since the ruling explicitly says both should count ("Not
fair, but what is").

## 4. Crime — loss of an acquired asset or distress to an active member

**Verified in build:** a crime-ledger system already exists
(`crimeLedger`, `recordCrime`), and `doTheft` distinguishes three crime
flavors: treasury coin, spoils off a returning member, and stolen
"secrets" (which auto-land the thief's next blackmail). `murder` is
tracked the same way.

**Design doc change:** the ruling's definition ("loss of an acquired
asset, or distress to an active member") maps cleanly onto what's already
coded — theft/murder are asset-loss and life-loss respectively. What's
*not* obviously covered is pure **distress without loss** (harassment,
slander, a scare that doesn't cost gold or a life). Document crime as two
buckets going forward: (a) asset-loss crimes — theft, murder, kidnap —
already ledgered; (b) distress-only crimes — harassment/slander with no
material loss — confirm with Astra whether these currently increment the
crime ledger or only the separate hostility ledger. If only the latter,
that's a gap against the ruling as written.

## 5. Brutus's noncombat death — event-only, no generic deaths

**Verified in build:** the only Brutus-death path I found ends the
campaign (`'Game over · Brutus is dead'`), but I didn't locate the trigger
condition itself (searched for a `gameOver` function name that doesn't
exist under that string — the actual trigger is elsewhere in the file).

**Design doc change:** this ruling is squarely Robert's narrative
territory per `briefs/claude/README.md`'s standing rule ("narrative and
canon authorship stay Robert's: propose, don't canonize"). No doc changes
from me beyond recording the constraint: **do not add any noncombat
Brutus-death trigger without an authored event behind it.** This is a
guardrail for Astra's implementation lane, not a design deliverable — I'm
not proposing specific events since the ruling defers those to "narrative
and guild-war writing."

## 6. Takeover conclusion — 5-state affection response

**Verified in build:** `absorbGuild(g)` currently does a single,
unconditional thing: sets `playerHeld=true`, zeroes hostility and tribute
status, and logs one generic line ("The hall and its remaining company
answer to Brutus"). There is no affection check and no branch for
welcome/reluctant/indifferent/desert/refuse.

**Design doc change:** this is the biggest gap of the 12. Document the
target system: on `absorbGuild`, roll or compute an affection outcome from
the guild's current hostility/affection state (the game already tracks
per-member `affection` — see `partyAffectionTick` — so a guild-level
aggregate is a natural extension, not a new primitive) and branch into the
five stated outcomes. I'm not specifying exact thresholds or per-outcome
mechanical effects here — that's implementation, and thresholds are a
balance call I'd rather propose in a follow-up brief than bury in this
one. Flagging it as the **highest-priority unimplemented ruling** for
Astra's queue.

## 7. Settlement — escalating concessions/labor until hostility exhausted

**Verified in build:** what exists today is `payTribute`-style logic:
a single lump-sum gold payment (`tributeQuote`, which scales with hostility
and recorded crimes/lives-lost) buys immunity through a fixed number of
turns (`TRIBUTE_TURNS`). This is a one-shot payment, not an escalating
concession/labor ladder, and there's no "exceptional outcome earns
affiliate treatment" branch.

**Design doc change:** document the distinction the ruling draws: what's
built is **tribute** (ruling 8, below); what's asked for here is a
separate **settlement** track — concessions that escalate in cost as
hostility drops, with a ceiling on how cheap it gets, plus a rare
better-than-neutral outcome. Flag for Robert: is "settlement" meant to
replace the current lump-sum tribute, or sit alongside it as a distinct
player choice? The ruling's wording ("concessions and labor escalate
until hostility is exhausted") describes a different shape than what's
coded, so I'm not resolving which one wins.

## 8. Tribute/appeasement — costs actions every turn

**Verified in build:** current tribute (`payTribute`/`tributeQuote`) is a
one-time gold payment that buys turns of immunity — it does not cost an
action every turn the way the ruling describes ("spend action(s) every
turn; urgent missions may override other urgent work").

**Design doc change:** flag as a **direct contradiction** between the
current implementation and the ruling, not something to silently patch in
a docs pass. Current: pay once, get N turns of peace. Ruling: pay an
action every turn, with success/failure/refusal branching into
appreciation/punishment/severe-punishment. These are different game
loops. Robert's ruling should win per `canon/` precedence, but the
resulting rebuild (recurring action cost, per-turn success/fail roll, an
override rule for urgent missions) is implementation work I'm scoping
here, not doing — routing to Astra's queue with this brief as the spec
source.

## 9. Win progress — every region visibly under Brutus

**Verified in build:** `checkCampaignVictory()` already fires when every
guild in `S.guilds` has `playerHeld=true`, ending the campaign as
"Victory · All guilds absorbed." Mechanically this already satisfies the
ruling **if** "region" and "guild charter" are the same concept in
Robert's head.

**Flag — real ambiguity, not resolving silently:** I also found a
`region` field used purely as a UI filter label ("region buttons just
filter People" — this is the exact issue `docs/baseline-playtest-2026-09-12.md`
flagged as overpromising). So "region" currently means two different
things in the build: a cosmetic filter tag, and (via guild charter
ownership) the actual win-condition unit. Robert's ruling says "region,"
not "guild" — needs a one-line confirmation: does winning require every
*guild* absorbed (already true today) or every *region* (a currently
cosmetic grouping that isn't tied to ownership at all)? If it's the
latter, this ruling is unimplemented, not implemented.

## 10. Energy costs — stay on the 20-point bar, no rescaling

**Verified in build:** confirmed directly — `bulwark` (Bulwark Slam) is
commented in-code as "costs 14 on a 20-point bar (70% — the anti-spam
gate)... NOT the old fixed 52 — that would have made the card permanently
unplayable now that max energy is only 20." The Second Wind constant
`WIND_ENERGY_SET` is similarly commented as "rescaled from 45... a real
bug, not a tuning choice, since energy>maxEnergy breaks the fraction-based
knockback/armor math." Both confirm the 20-point bar is already the
locked convention and past rescale attempts were already caught and fixed.

**Design doc change:** none needed — already matches the ruling. Worth
recording as **precedent**: two in-code comments already treat
scale-mismatches as bugs, not designer intent, which is exactly what this
ruling formalizes. No open flag.

## 11. Second Wind — displays only while stunned

**Verified in build:** Second Wind is **not currently a card at all**. It's
a fixed keybind (`F Second Wind`, listed in the dungeon controls help
text) with an always-available HP-cost/knockback/energy-refill effect
(`WIND_HP_COST_PCT`, `WIND_RADIUS`, `WIND_COOLDOWN`), gated by cooldown,
not by stun state, and not competing for a hand slot at all.

**Flag — direct contradiction with the ruling's own framing:** the ruling
says Second Wind "overrides Claude's cut recommendation and Astra's
exclusion" and describes it as "a card that displays only while stunned —
never occupies a useful slot while irrelevant." That description assumes
Second Wind lives in the 4-card hand system alongside Quick Strike/Cleave/
Heavy Blow/Weak Cure/Bulwark Slam. It doesn't — it's a keybound stun-break
action outside the card/hand system entirely, so "occupying a useful
slot" isn't currently a way it could fail. Either the ruling is about a
different, not-yet-built version of Second Wind (a real hand-card,
stun-gated), or the ruling is already moot because the current
keybind design sidesteps the problem it was meant to solve. **This needs
Robert's call before any doc update**, not a silent reconciliation.

## 12. Player-held territory — no other leaders

**Verified in build:** `playerHeld` is a per-guild boolean already used
throughout (`absorbGuild`, `battleMembers`, `campaignWarPanel`). I did not
find code that actively prevents a new leader/guild from spawning inside
a `playerHeld` charter — the guild-turnover system I read
(`NEW_GUILD_PREFIX`/`NEW_GUILD_CORE`) refills *vacant* charters when a
guild is wiped, but I didn't verify whether it excludes `playerHeld`
charters from that refill pool.

**Design doc change:** document the two halves of this ruling separately,
since they verify differently: "guilds dying outside Brutus's ownership
leave replaceable slots" (the turnover system — verified present) and
"when Brutus owns territory, he permits no other leaders" (an exclusion
rule on that same turnover system — presence not confirmed). Flag for
Astra: confirm the turnover refill logic already skips `playerHeld`
charters; if it doesn't, that's the concrete implementation gap this
ruling closes.

---

## Summary for Robert

Already matches the ruling, no action needed: **#10** (energy/20-point
bar), and **#1**'s core banked-not-lost behavior (though its revive path
is unverified).

Needs a real implementation change, scoped above for Astra's queue:
**#2** (XP), **#6** (takeover affection states — highest priority), **#7**
vs **#8** (settlement/tribute are two different systems and only one,
simpler one exists), **#12** (leader-exclusion on owned territory).

Needs your call before anyone builds anything, because the current code
and the ruling's own wording point two different ways: **#9** (does "region"
mean guild charter or the cosmetic region filter?) and **#11** (is Second
Wind meant to move into the hand-card system, or does the existing keybind
design already satisfy the intent behind the ruling?).

Needs verification I couldn't complete from static reads alone (would
need either more of the minified source traced by hand or a live
playtest): **#3** (are formal-war deaths tagged as murder the same way
ambush deaths are?), **#4** (is distress-without-loss ledgered as crime,
or only as hostility?).

No canon conflicts found against the four memory docs I do have access
to — but I don't have a "world bible v3" to check against, and that gap
should close before anyone treats a future design-doc pass as complete.
