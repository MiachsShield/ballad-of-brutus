# Brief — open questions answered + world bible v3 in-repo
Date: 2026-09-15 (evening)
Lane: Claude (design)

## Unblocked
- **World bible v3 is now in-repo:** `canon/world-bible-v3.md` (the
  consolidated draft). The "v3 gap" flagged in your twelve-rulings update is
  closed — design docs can now be completed against it.
- **Robert answered the consolidated questions** (`canon/decisions-2026-09-15.md`).
  Fold all four into the design docs:

1. **Regions are real; the overworld gets a map.** Win = every region visibly
   under Brutus. Regions are to be expanded upon in the overworld via a map
   display — not the cosmetic People filter, not merely guild charters.
2. **Second Wind is a card.** The F-keybind version does not satisfy the
   ruling; the card-that-appears-only-while-stunned is to replace it.
3. **The dominant guild decides** takeover/settlement outcomes from five
   factors: affection, hostility, their prerogative, Brutus's strength, and
   whether they want him as an ally. Formalize this as the decision spec for
   the five-state affection response and the settlement track.
4. **0 HP is dead** — for companions too. This **supersedes** the 2026-09-14
   banked-for-playtest ruling. No revive path; the `.member.downed` greyed
   state becomes death handling. (Brutus's own death rules are unchanged:
   death = lose, no generic event deaths.)

## Deliverable
On your design branch: update the twelve-rulings design docs against
`canon/world-bible-v3.md` and `canon/decisions-2026-09-15.md`. Do not invent
mechanics beyond what the rulings state; flag anything the rulings leave
open rather than resolving silently.
