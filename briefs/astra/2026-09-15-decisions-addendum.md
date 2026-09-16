# Brief — implementation addendum: Robert's four 2026-09-15 decisions
Date: 2026-09-15 (evening)
Lane: Astra (implementation)
Queues behind the ChatGPT lane connection, alongside
`briefs/astra/2026-09-15-implementation-queue.md`.

Binding decisions in `canon/decisions-2026-09-15.md`:

1. **Region map in the overworld.** Regions become a real system with a map
   display; win = every region visibly under Brutus. Scope with Claude's
   design formalization before building.
2. **Second Wind becomes a card** that displays only while stunned. Replace
   the F-keybind stun-break implementation.
3. **Takeover/settlement resolution:** the dominant guild decides from
   affection, hostility, their prerogative, Brutus's strength, and ally-desire.
   Build to Claude's formalized spec (five-state affection response).
4. **Companion 0 HP = permadeath.** Supersedes the banked/down revivable
   presentation. Replace `.member.downed` greyed-out handling with death
   handling (roster removal, Chronicle entry, death-cause attribution). No
   revive path.

These join the existing queue; #4 changes the companion 0-HP outcomes item
already queued (banked → dead).
