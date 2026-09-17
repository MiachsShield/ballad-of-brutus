# DONE — Claude's playtest (candidate build, 2026-09-16)

Carried over from `MEETING-2026-09-16.md`: "Claude: finish the redo design
briefs (PR #2); deliver its playtest." PR #2 is done (see that branch);
this is the playtest.

## Method

Robert isn't at a keyboard to hand me a browser, so I ran the exact
candidate file (`builds/brutus-1_0_a0mk-kavi-merged.html`, SHA-256
`84f46127a3a26add85629c97b6229b161c1623e46d0159e1580ca670e71b3ca2` —
verified against `builds/current-build.md` before touching it) headless,
via Playwright/Chromium (both preinstalled in my environment), and drove
it with real mouse/keyboard events rather than reading source. Two things
worth flagging about the method itself, in the spirit of "verify, don't
assume":

- The game's actual UI lives inside a nested `srcdoc` iframe two levels
  deep (menu UI in frame 2, the live dungeon scene in frame 3) — DOM
  text/click selectors have to target those frames specifically, not the
  top-level document. Worth knowing for anyone else automating this build.
- I could not get sound, so nothing here confirms or denies the SFX
  findings Kavi and Grok already logged — this run is combat/UI/logic
  only.

Contract taken: The Gilded Sepulchre (same one Grok and Kavi both used),
Priest deck, same as their runs, for direct comparability.

## Findings — reproduced from prior playtests (independent confirmation)

1. **The `syncTells` pageerror is real and easy to hit.** My session threw
   the exact error Kavi found — `v.key?.startsWith is not a function` —
   within the first ~15 seconds of first contact, on a completely fresh
   run. Kavi saw it in 2 of 5 combat runs; I hit it in 1 of 1. This raises
   my own confidence that it's a frequent, not rare, failure and should
   stay the top item in Astra's queue.
2. **All-support dead hands, confirmed independently.** A separate fresh
   run dealt me Weak Cure / Weak Cure / Alms-Taker's Ear / Blessing — zero
   damage answer in hand — and the hand did not change across ~15 seconds
   of walking with no enemy in range. Matches Kavi's finding exactly.
3. **Hold-fire text doesn't reliably hold fire.** On the run where I
   engaged a "Grazer" (see below), the log printed "Ember holds fire —
   take the first shot" / "Wren holds fire — take the first shot," then
   without Brutus playing any card, printed "Ember opens fire from behind
   you" / "Wren opens fire from behind you," and the encounter resolved
   itself — Ember took 4 damage, the enemy's cards on my hand flipped to
   NO VALID TARGET, and the fight was just over. I never got a card
   opportunity. This matches Grok's original finding and the one
   inconsistent case in Kavi's own dungeon sessions — worth taking off the
   "mostly fixed" list and treating as still-live, since it happened on
   my very first contact, not a rare outlier.
4. **"Team (2/2)" still lists three people** on the deploy screen (Ember,
   Wren, Brutus) — reproduced exactly as Grok flagged it.
5. **Brutus deploys with a generic Shortsword**, not anything matching the
   locked visual spec's "weapon extends the hand" identity — same as
   Grok's finding, still true in this build.

## New findings

6. **A fourth enemy name exists that isn't in any doc I've seen:
   "Grazer."** The only enemy archetypes documented anywhere I can reach
   are Skulker, Brute, and Stalker (from the SFX tier-tell pass). Grazer
   showed as UNAWARE at 3.0m, then 6.4m a tick later (moving away, not
   toward Brutus), then was gone. If Grazer is a real fourth archetype,
   whoever owns the enemy roster doc should add it; if it's a naming
   accident (a Skulker mislabeled, or leftover test content), that's worth
   knowing too. I don't have enough information to tell which from the
   UI alone.
7. **The in-dungeon deck choice is a second, separate prompt from the
   deploy-screen deck choice** — "What does Brutus bring into the dark?"
   appears after descending even though the deploy screen already asked.
   It does correctly pause the game ("time waits for your choice" — no
   character movement or card-target changes happened while it was open,
   confirmed by identical frame state across two probes), so it isn't a
   soft-lock or a bug, just a redundant second question. Low priority, but
   flagging since nobody else's notes mention it.
8. **Regions are visibly named in the World tab**, unprompted: Reyjar,
   Ayusti, Themelios, Marium, Li Trice, Edinius, Beloufi — seven, matching
   "SEVEN REGIONS. LONG MEMORIES." in the header. This is directly
   relevant to my own open flag from PR #1 (whether ruling #9's "region"
   is the real map or just a cosmetic filter tag) — the region names exist
   as first-class UI now, which is evidence toward the ruling being closer
   to implemented than I could confirm when I only had static source to
   read. I still can't confirm from the UI alone whether guild-charter
   ownership is actually tracked per-region or whether this is a header
   label over the same cosmetic tag I flagged before — that would need
   someone to actually take a region to test.

## What I did not verify

Turns 2+, auctions, wars, tribute, the market, Second Wind, a fight where
Brutus actually lands a hand card (every contact I got resolved before or
without one), and anything audio. This was one contract, two short first-
contact encounters, run headless without sound.

## Bottom line

Independent automated confirmation lines up with Kavi's and Grok's manual
playtests on every item I could reproduce — nothing here contradicts their
reports, and the `syncTells` crash and the hold-fire inconsistency both
look more consistently reproducible than "occasional" from this one
session. One new enemy name (Grazer) and one confirmation on the region
question are worth routing to whoever owns those docs.
