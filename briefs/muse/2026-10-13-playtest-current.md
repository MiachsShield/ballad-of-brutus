# Brief: playtest the CURRENT build (2026-10-13)

From Claude, at Robert's request (2026-10-13: "is everything ready for next Muse playtest?" … "Yes").
Replaces `briefs/muse/2026-10-12-playtest-current.md`. Phase reminder (Robert, 2026-10-11): this
is a playtest. Nothing needs to be final; play it and report what it feels like.
Art is out of scope (Robert: the art agents have it).

## The build

- File: `builds/CURRENT-brutus-astra-e1-standalone.html` on main (after this PR merges)
- Size: 10482255 bytes · SHA-256: `99855846f9348aafc40dd4abfa018abf77a00002becd1faf1d1f793f19552ec5`
- **Open it from a full checkout of the repo.** Card art loads from `art/card-faces/` next to
  `builds/`; a lone copy of the file plays fine but shows cards without pictures. (The last brief
  said otherwise. That was wrong.)
- **Start a New run.** Old saves load, but the dungeon board, drives and ranks start cleanest fresh.
- Details and test evidence: `builds/current-build.md`.

## What is new since the 2026-10-12 build, and what to try

| # | Feature | Try | Expect |
|---|---|---|---|
| 1 | One deck choice (#46) | Deploy | Warrior/Priest buttons on Deploy; the dungeon does not ask again |
| 2 | Straight route down (#46) | Any floor | Entrance → rest area → stair room is always connected; the stairway shows gold with ▼ on the minimap once seen; you arrive facing the way on |
| 3 | Dungeon rank 1-5 (#47) | Dungeons tab | Each card shows a rank. Higher: more floors (3-5), traps and pits, monsters, tougher warden, better chests and pay. Rank 2 = the old dungeon |
| 4 | Checkpoints (#47) | Touch a rest area or waypoint, Exit to map, take the same contract again | Same dungeon; map, chests and kills kept; you start at the checkpoint; the card says where. Contract progress adds up across entries |
| 5 | Trip home (#47) | Kill the warden, loot its chest | "The dungeon closes…", back in town after ~3 s; the dungeon locks out 2-5 turns |
| 6 | XP (#47) | Any expedition | Report lists "Brutus +N XP · Ember +N XP …". At most one level per expedition; outgrown dungeons pay little; repeats pay less |
| 7 | Status screen (#47) | Click Brutus or a companion in the sidebar | Full-figure frame with gear around it, Fight and Life stats, What happens next, a relationship web. Brutus's shows his deck |
| 8 | Deck mid-expedition (#47) | In a dungeon press View world, click Brutus | Used cards greyed, cards in hand outlined |
| 9 | Market screen (#47) | People → anyone not in your company | Price, whether you can hire them and why not, rumours, public ties. Personality is never shown: read it in the interview |
| 10 | Character drives (#47) | End a few turns, look at companions' What happens next | They want gear, a class, or a person, and act on it. A companion who wants a certain item is grateful if you equip it, and sulks if you don't |
| 11 | No elemental names (this PR) | Cards, abilities | e.g. Rime Shell → Bracing Shell, Venom Strike → Bleeding Strike, Storm-eye → Patient eye |
| 12 | Monsters keep their distance (this PR) | Close fights | Nothing walks into the camera; a Brute or the Overseer stays at arm's length |
| 13 | Training Reset (this PR) | Training room → Reset room | Clears monsters, keeps your deck, no black screen |

## Please play these first

1. **Reach the warden** on a rank 1 or 2 dungeon (never confirmed live last time): does conquest
   register, does the trip home fire, does the boss loot show?
2. **Leave and come back** mid-dungeon: does resuming feel like a checkpoint should?
3. **A rank 4 dungeon**: does it feel harder in a good way, or just longer?
4. **Hire someone** using only the market screen and the interview: can you read their personality
   from the dialogue alone?
5. **Ignore a companion's gear wish** for 7+ turns, then grant it: is the change noticeable?

## Known issues (not fixed)

- At arm's length the Overseer (2.6 tall) still has its head above the frame.
- Companion gear is shown but not applied in the dungeon (only Brutus's is).
- You always start in a corner room on floor 1, not on the straight route.
- Rank odds are even (1-5); rank 5 is big (about 37 monsters on 5 floors).
- Left alone for many turns, companions can quit after scandals (existing life-sim behaviour).
- With guests, four allies swarm every enemy and Brutus lands few hits.
- Every dungeon starts locked by a guild, so most expeditions begin by buying access.
- Placeholders: lockout 2-5 turns, anger after 3 lootings, drive odds, rank numbers, fist drawn in code.

## Report

Per standing instruction 5: feedback ordered by player impact, in your section of `MEETING.md`,
plus anything blocking in `DISCUSS.md`. Note the exact SHA-256 you played.
