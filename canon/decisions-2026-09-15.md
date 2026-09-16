# Robert's decisions — 2026-09-15 (evening round)

Answers to the consolidated open questions from the twelve-rulings design
update (`work/claude/twelve-rulings/design-update.md`, "Summary for Robert").
Binding per repo precedence: `canon/` > build > design docs.

## 1. Win condition — regions are real; the overworld gets a map
**Robert:** "Overworld should display a map. Regions to be expanded upon there."
Resolves design-update #9: "region" means the region system, not the cosmetic
People filter and not merely the guild charter. The region system is to be
built out — the overworld displays a map, and regions are expanded upon there.
Win = every region visibly under Brutus. Design (Claude) then implementation
(Astra).

## 2. Second Wind is a card
**Robert:** "Card."
Resolves design-update #11: Second Wind becomes a hand-card that displays only
while stunned, per the original ruling. The current F-keybind stun-break does
not satisfy the intent — it is to be replaced by the card implementation.

## 3. The dominant guild decides — five factors
**Robert:** "The dominant guild should decide based on affection, hostility,
their prerogative, how strong you are and if they want you as an ally."
Resolves the takeover/settlement decision mechanism (design-update #6, #7):
when Brutus seeks takeover or settlement, the dominant guild decides the
outcome from (a) affection, (b) hostility, (c) their prerogative,
(d) how strong Brutus is, (e) whether they want him as an ally. This is the
design spec for the five-state affection response and the settlement track —
Claude to formalize, Astra to implement.

## 4. 0 HP is dead
**Robert:** "0 hp is dead — better find new allies."
**SUPERSEDES** `canon/decisions-2026-09-14.md` ruling #1 (companion 0-HP banked
for playtest / loss-aversion hypothesis). Companion 0 HP now means permadeath,
same as the standing rule that HP reaching 0 is real death. The loss-aversion
playtest question is closed: players are expected to recruit replacements.
Astra: the downed/banked presentation (`.member.downed` greyed state) is to be
replaced by death handling; no revive path is to be built.
