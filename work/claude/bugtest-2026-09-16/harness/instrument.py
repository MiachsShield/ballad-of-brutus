"""Make a TEST COPY of the build with one hook: window.__T(src) evaluates code
inside the dungeon closure (brutus, allies, enemies, hand, CARDS, playSlot...).
The shipped build is never modified.
usage: python3 instrument.py ../../../../builds/brutus-1_0_a0mk-kavi-fixed.html
writes inst.html (instrumented) and build.html (untouched copy) next to this file."""
import sys, shutil, os
src = sys.argv[1]; here = os.path.dirname(os.path.abspath(__file__))
s = open(src, encoding='utf-8').read()
anchor = "if(window.parent===window)start(); requestAnimationFrame(frame);\n})();\n<\\/script>"
assert s.count(anchor) == 1, "anchor not found once — dungeon script tail changed"
open(os.path.join(here, 'inst.html'), 'w', encoding='utf-8').write(s.replace(anchor, "window.__T=function(src){return eval(src);};\n" + anchor))
shutil.copy(src, os.path.join(here, 'build.html'))
print('ok: inst.html + build.html')
