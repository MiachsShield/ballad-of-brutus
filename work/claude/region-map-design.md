# Region map + region-based win condition

Brief: `briefs/claude/2026-09-16-astra-redistribution.md`, item C1.
Rulings this implements: `canon/decisions-2026-09-15.md` #1 ("Overworld
should display a map. Regions to be expanded upon there... Win = every
region visibly under Brutus"), `canon/decisions-2026-09-14.md` #9 and
#12, and `canon/world-bible-v3.md` §4 (seven canon nations; the
political/national layer is a **separate system** from guild economic
activity, not a 1:1 mapping of nations onto factions) and §4.new (the
setting is a sealed island — no further geography to invent).

## The region list

Seven regions, already shipped as UI flavor text on the World tab header
("SEVEN REGIONS. LONG MEMORIES.") and confirmed by me directly in a
headless playtest of the candidate build today: **Reyjar, Ayusti,
Themelios, Marium, Li Trice, Edinius, Beloufi.**

**Flag for Robert/Kavi:** I'm treating these seven as the canonical
regions because they're already live in the shipped UI and the count
matches world-bible v3's "seven canon nations." I don't have v2's
original nation list in front of me to confirm the names are the *same*
seven nations and not a separate, coincidentally-seven-item list (a
faction roster, say). If they're different lists, this whole spec still
works mechanically — it just needs the correct seven names swapped in.

## What "visibly under Brutus" means, mechanically

The build already has everything needed to compute this without a new
ownership system — the twelve-rulings audit found `checkCampaignVictory()`
already fires when every guild in `S.guilds` has `playerHeld=true`, and
separately found a `region` field already used as a filter label on
guild/person records. Putting those two together:

- Every guild charter already belongs to exactly one region (the same
  field the People-screen filter already reads).
- **A region's state is UNDER BRUTUS when every guild charter in that
  region has `playerHeld=true`.** Otherwise it's CONTESTED.
- Win condition: **every region is UNDER BRUTUS** — which is the same
  underlying trigger as "every guild is `playerHeld`," just recomputed
  and displayed region-first instead of as a flat guild list. I'm not
  proposing a second, independent conquest system for regions — see "why
  not a deeper system" below.

This directly resolves the ambiguity I flagged in the twelve-rulings
update (#9): "region" and "guild absorption" were two different concepts
in the *shipped build* (one cosmetic, one the real win-trigger); Robert's
2026-09-15 answer ("regions to be expanded upon there," on a displayed
map) tells me which one should become real — the region grouping becomes
the player-facing unit, backed by the guild-ownership data that already
drives the win check today.

## Why not a deeper, independent region-politics system

World-bible v3 §4.5 rules that the political/national layer is
**distinct** from guild economic activity — nations have their own wars,
diplomacy, and factions that aren't the same thing as Brutus's
guild-absorption minigame. That's a real, bigger system (wars between
nations independent of Brutus, faction relationships, etc.), and it's
already named as its own future project phase in `MEETING.md`'s longer-
term goals ("political layer," listed separately from what's being
built now). Building that now would both overshoot this brief and risk
conflicting with whatever Robert eventually specifies for it. This spec
treats the region map as a **read-only progress view over existing guild
data** — accurate, honest, and buildable today — and leaves the fuller
independent-nations simulation to that later phase. Flagging this
explicitly so nobody reads the map as "the political layer" prematurely.

## How the map displays

- A new Map view (its own tab, or a sub-view under World — Kavi/UI's
  call) showing all seven regions as discrete zones. Per the sealed-
  island ruling, this does not need real geography or relative
  positioning to be justified narratively — a stylized abstract layout
  (grid, heraldic arrangement, whatever fits the visual guide) is
  sufficient; do not invent coastlines, distances, or adjacency logic
  beyond what's needed to lay out seven zones legibly.
- Each region renders in one of two visual states: **Contested** (default)
  or **Under Brutus** (all charters absorbed). Per the card-readability
  standard's spirit, this should be a clear, at-a-glance visual
  difference (color/icon), not a text label alone.
- Tapping/hovering a region shows its guild charters and each one's
  `playerHeld` status — the actual granular progress, one level down
  from the region summary.
- When the last charter in a region flips to `playerHeld`, the region
  flips to Under Brutus with a log line ("Region secured: <name>") —
  reusing the existing event-log pattern rather than inventing a new
  notification style.

## What the player sees and does per turn

Nothing new mechanically. The map is a dashboard, not a new action list.
Region state changes purely as a side effect of the existing
absorption/takeover/war/tribute flows (each of which already flips a
guild's `playerHeld` flag independently of this spec). Turn-by-turn, the
player's only new behavior is *checking the map* to see region-level
progress; every action that moves that progress already exists.

## Interaction with guild absorption and the takeover/settlement spec

Per §4.5, regions and guild economy stay distinct systems even though the
win-check reads region state through guild data — the region layer never
becomes a second place to spend an action or a second currency. The
takeover/settlement five-factor procedure (`work/claude/
takeover-settlement-procedure.md`) is unchanged by this spec: it still
resolves per-guild; the region map just displays the aggregate.
`canon/decisions-2026-09-14.md` #12 ("when Brutus owns territory, he
permits no other leaders") stays a per-charter turnover-exclusion rule,
unaffected by region grouping — flagged again here since it's the one
piece of #9-adjacent ruling I could not verify presence of in the build
(see the twelve-rulings update).

## What Kavi needs to confirm before building

- Every guild charter has a non-null `region` value from the seven names
  above. If any charter is missing one, the map can't be exhaustive and
  the win condition needs a decision on how to treat unassigned charters
  (I'd default to "the win condition can't complete until it's assigned,"
  not silently ignoring it — but flagging rather than deciding, since
  it's a data-integrity question, not a design one).
- Whether `checkCampaignVictory()` should be literally left alone (it
  already fires at the right moment) with the map added as a pure
  display layer, or whether Kavi wants the region aggregation to become
  the actual source of truth the check reads from (functionally
  identical outcome, different code path — implementation's call).

## Open flag for Robert

Confirm the seven region names above are in fact the seven canon nations
from world-bible v2/v3 §4.1–4.3 (I could not re-read that section this
session) and not a separate list that happens to also have seven entries.
