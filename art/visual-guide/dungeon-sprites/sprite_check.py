#!/usr/bin/env python3
"""Check a dungeon sprite file against the Brutus dungeon-sprite guide before handing it over.

Usage:
  python3 sprite_check.py art/sprites/skulker.png            # 8 x 3 sheet, 2048 x 768, #FF00FF key
  python3 sprite_check.py --fp art/sprites/fist/idle.png     # first-person frame, 1024 x 1024 RGBA

Exit code 0 = pass, 1 = at least one FAIL. WARN lines are judgement calls for a human/Muse.
Needs Pillow (pip install pillow).
"""
import sys
from PIL import Image

KEY = (255, 0, 255)
CELL, COLS, ROWS = 256, 8, 3
BASELINE = CELL - 8          # feet line inside each cell
STANDING_COLS = range(0, 4)  # idle + attacks stand on the baseline
STATE = ['idle', 'attack light', 'attack medium', 'attack heavy', 'hurt light', 'hurt medium', 'hurt heavy', 'defeated']
ROW = ['front', 'side', 'back']


def is_key(p):
    return p[0] == 255 and p[1] == 0 and p[2] == 255


def near_key(p):
    # magenta-ish but not the exact key: anti-aliasing spill ("pink fringe")
    r, g, b = p[:3]
    return not is_key(p) and r > 120 and b > 120 and g < 0.6 * min(r, b)


def check_sheet(path):
    fails, warns = [], []
    im = Image.open(path)
    if im.size != (CELL * COLS, CELL * ROWS):
        fails.append(f'size is {im.size}, must be (2048, 768)')
        return fails, warns
    rgb = im.convert('RGB')
    px = rgb.load()
    corners = [px[0, 0], px[2047, 0], px[0, 767], px[2047, 767]]
    if not all(is_key(c) for c in corners):
        fails.append(f'background corners are {corners}, must be exact #FF00FF')
    heights = {}
    for r in range(ROWS):
        for c in range(COLS):
            x0, y0 = c * CELL, r * CELL
            xs, ys, fringe, edge = [], [], 0, 0
            for y in range(y0, y0 + CELL):
                for x in range(x0, x0 + CELL):
                    p = px[x, y]
                    if is_key(p):
                        continue
                    if near_key(p):
                        fringe += 1
                    xs.append(x); ys.append(y)
                    if x - x0 < 2 or x0 + CELL - 1 - x < 2 or y - y0 < 2 or y0 + CELL - 1 - y < 2:
                        edge += 1
            name = f'{ROW[r]} / {STATE[c]}'
            if not xs:
                fails.append(f'{name}: empty cell')
                continue
            if edge > 6:
                fails.append(f'{name}: figure touches the cell border ({edge} px) - it bleeds into the next cell')
            if fringe > 40:
                fails.append(f'{name}: {fringe} pink-fringe pixels (anti-aliased into the key). Re-key with a hard edge')
            elif fringe > 0:
                warns.append(f'{name}: {fringe} pink-fringe pixels')
            bottom = max(ys) - y0
            if c in STANDING_COLS and abs(bottom - BASELINE) > 8:
                warns.append(f'{name}: feet at y={bottom}, baseline is {BASELINE} (+/-8)')
            heights[(r, c)] = max(ys) - min(ys)
    # poses that are the same drawing twice (a model repeating itself instead of posing)
    masks = {}
    for r in range(ROWS):
        for c in range(COLS):
            cell = rgb.crop((c * CELL, r * CELL, c * CELL + CELL, r * CELL + CELL)).resize((48, 48))
            d = cell.tobytes()
            masks[(r, c)] = [0 if (d[i] == 255 and d[i + 1] == 0 and d[i + 2] == 255) else 1 for i in range(0, len(d), 3)]
    for r in range(ROWS):
        for c in range(COLS - 1):
            for c2 in range(c + 1, COLS):
                a_, b_ = masks[(r, c)], masks[(r, c2)]
                inter = sum(1 for x, y in zip(a_, b_) if x and y)
                union = sum(1 for x, y in zip(a_, b_) if x or y)
                if union and inter / union > 0.92:
                    warns.append(f'{ROW[r]} / {STATE[c2]}: same silhouette as {STATE[c]} - the pose needs to read differently')
    idle = [heights.get((r, 0)) for r in range(ROWS) if heights.get((r, 0))]
    if idle and max(idle) > 1.12 * min(idle):
        fails.append(f'idle height differs between rows {idle} - scale drifted (keep within 12%)')
    if idle and max(idle) < 0.7 * (CELL - 26):
        warns.append(f'idle figure only {max(idle)} px tall; fill about {CELL - 26} px (the game scales it)')
    return fails, warns


def check_fp(path):
    fails, warns = [], []
    im = Image.open(path)
    if im.size != (1024, 1024):
        fails.append(f'size is {im.size}, must be (1024, 1024)')
    if im.mode != 'RGBA':
        fails.append(f'mode is {im.mode}, must be RGBA (transparent background)')
        return fails, warns
    px = im.load()
    W, H = im.size
    halo = semi = 0
    for y in range(0, H, 2):
        for x in range(0, W, 2):
            r, g, b, a = px[x, y]
            if 0 < a < 255:
                semi += 1
            if a > 0 and r > 230 and g > 230 and b > 230:
                # bright pixel next to transparency = matte halo
                for dx, dy in ((2, 0), (-2, 0), (0, 2), (0, -2)):
                    xx, yy = x + dx, y + dy
                    if 0 <= xx < W and 0 <= yy < H and px[xx, yy][3] == 0:
                        halo += 1
                        break
    if halo > 30:
        fails.append(f'{halo} light halo pixels on the cut-out edge (white matte left behind)')
    bbox = im.getbbox()
    if bbox and (bbox[2] < W - 4 and bbox[3] < H - 4):
        warns.append('the arm does not reach the frame edge; it should enter from the bottom edge')
    return fails, warns


def summarise(msgs):
    """Group per-cell messages by problem so a 24-cell sheet prints a few lines, not 48."""
    groups = {}
    for m in msgs:
        cell, _, what = m.partition(': ')
        key = what.split(' (')[0].split(' - ')[0] if what else m
        if key.startswith('feet at'):
            key = 'feet off the baseline'
        key = ''.join(ch for ch in key if not ch.isdigit()).strip()
        groups.setdefault(key, []).append((cell if what else '', m))
    out = []
    for k, items in groups.items():
        if len(items) == 1:
            out.append(items[0][1])
            continue
        cells = [c for c, _ in items if c]
        out.append(f'{k} [{len(cells)} cell{"s" if len(cells) != 1 else ""}: {", ".join(cells[:4])}{" ..." if len(cells) > 4 else ""}]' if cells else k)
    return out


def main():
    args = sys.argv[1:]
    fp = '--fp' in args
    files = [a for a in args if a != '--fp']
    if not files:
        print(__doc__)
        return 2
    bad = False
    for f in files:
        fails, warns = (check_fp if fp else check_sheet)(f)
        print(f'== {f}: {"FAIL" if fails else "PASS"}')
        for m in summarise(fails):
            print('  FAIL', m)
        for m in summarise(warns):
            print('  WARN', m)
        bad = bad or bool(fails)
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
