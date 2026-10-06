# Character-to-character simulation layer

This S1 reconstruction carries forward the earlier Brutus character work: a Sims-esque world where people are not static roster entries but agents whose chemistry, choices, loyalties, grudges, vulnerabilities, and rivalries create consequences.

## The earlier framework

The character-appeal framework used four stages:

1. **Notice** — a person has a readable visual, social, or behavioral hook.
2. **Curiosity** — another character has a reason to watch, test, want, distrust, or challenge them.
3. **Attachment** — repeated choices create chemistry, loyalty, vulnerability, resentment, or rivalry.
4. **Memory** — important events persist and change later scenes; relationships do not simply reset.

This is not a character-bio system. The test is whether a character wants something, acts on it, and creates an imminent conflict.

## Mapping into the current overworld

| Character-to-character goal | Existing simulation surface |
|---|---|
| A remembered choice changes future behavior | sentiment ledger and salient event |
| Loyalty, affection, distrust, or resentment becomes readable | `stance()` and `describeStance()` |
| A person hears about Brutus indirectly | gossip and gossip taint |
| Two agents pursue incompatible goals | rivalry pass |
| A sustained feeling reaches a breaking point | heat and flashpoint priming |
| The relationship produces an irreversible action | caller-resolved vendetta, devotion, warning, or demand |
| The player understands what happened | Chronicle/event log and scene consequence |

## S1 rule

S1 wires the relationship simulation into the playable world's state lifecycle. It must preserve ledger rows, party records, heat, gossip taint, flashpoints, and RNG position through New Run, save/load, and the world tick.

S1 does not invent a separate romance meter, generic relationship web, or passive personality spreadsheet. Do not display hidden progress bars or turn people into interchangeable stat containers. The player should encounter a person, make a choice, and later recognize the consequence.

## Later presentation work

The S2/S3 presentation layers can surface firsthand stance, salient remembered events, gossip-tainted secondhand impressions, and flashpoint resolution prompts. Those reads should be concise and specific: who did what to whom, what the character now wants, and what conflict is about to result.

The relationship layer is successful when a player can say, "I remember her; she did that because of him," without needing to inspect a database.
