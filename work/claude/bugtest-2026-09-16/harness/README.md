# Automated playtest harness (Claude, 2026-09-16)

Headless Chromium via Playwright, driving the real game with clicks and keys.
Combat state is read and set through an instrumented **test copy** of the build.

```
npm i -g playwright                              # or use an existing install
python3 instrument.py <path-to-build.html>      # writes inst.html + build.html here
node iv.js                       # full interview + abandon (K5), End-turn state
node clean.js                    # every damage card vs a frozen 500-HP target: listed vs dealt, hit timing
node combat.js playtest,normal   # 3 staged fights x 3 dives per difficulty: hold-fire, log order, damage share, Second Wind, faces
```

Set `CHROME=/path/to/chrome` if Playwright's bundled browser isn't installed.
Outputs land as JSON next to the scripts. Headless rendering runs the game clock
slower than wall time, so compare shares and orderings, not seconds.

Notes: the game UI is two nested `srcdoc` iframes — frame 1 is the overworld,
frame 2 the dungeon. After Descend, the in-dungeon deck prompt must be answered
(`chooseCardDiscipline('Priest'|'Warrior')`) or the game stays paused. The hook
(`window.__T(src)`) only exists in `inst.html`; never ship that file.
