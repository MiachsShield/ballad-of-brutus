#!/usr/bin/env python3
"""Check a dungeon sprite file against the Brutus dungeon-sprite guide before handing it over.

Usage:
  python3 sprite_check.py art/sprites/skulker.png            # 8 x 3 sheet; tier read from width
  python3 sprite_check.py --tiers close.png middle.png far.png  # also checks the three agree
  python3 sprite_check.py --fp art/sprites/fist/idle.png     # first-person frame, 1024 x 1024 RGBA
  python3 sprite_check.py --sil sheet.png out.png            # write the 64 px silhouette contact sheet

Sheet tiers (width -> tier): 4096 close (512 px cells), 2048 middle (256), 1024 far (128).
Background must be exact #FF00FF.

Exit code 0 = pass, 1 = at least one FAIL. WARN lines are judgement calls for a human/Muse.
Needs Pillow, numpy, scipy.

Silhouette read (the part that matters most at distance) is measured on each cell filled solid
and shrunk to 64 px:
  FAIL  figure touches the cell border (it is cropped or bleeds into the next cell)
  FAIL  two poses in a row share one silhouette (IoU > 0.90), e.g. idle = attack light
  FAIL  silhouette is a blob (solidity > 0.93): arms, weapon and body have no gaps between them
  FAIL  silhouette is shredded (more than 3 loose pieces, or ragged-edge ratio > 2.2)
  FAIL  attack barely reaches past idle (side row), defeated is not flat, hurt does not escalate
  WARN  similar poses (IoU > 0.80), ragged edge (ratio > 1.8), tiny loose pieces, feet off baseline
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage
from scipy.spatial import ConvexHull

COLS, ROWS = 8, 3
TIER_BY_WIDTH = {4096: ('close', 512), 2048: ('middle', 256), 1024: ('far', 128)}
STATE = ['idle', 'attack light', 'attack medium', 'attack heavy', 'hurt light', 'hurt medium', 'hurt heavy', 'defeated']
ROW = ['front', 'side', 'back']
STANDING = range(0, 4)
SIL = 64                      # silhouette test size


def key_masks(rgb):
    r, g, b = [rgb[..., i].astype(int) for i in range(3)]
    exact = (r == 255) & (g == 0) & (b == 255)
    near = (r > 120) & (b > 120) & (g < 0.6 * np.minimum(r, b)) & ~exact
    return exact, near


def sil_of(fg_cell):
    """Solid silhouette of a cell, shrunk to SIL x SIL."""
    im = Image.fromarray((fg_cell * 255).astype('uint8')).resize((SIL, SIL), Image.LANCZOS)
    return np.array(im) > 100


def shape_stats(m):
    area = int(m.sum())
    if area < 20:
        return None
    pts = np.argwhere(m)
    try:
        hull = ConvexHull(pts)
        solidity = area / max(1.0, hull.volume)
        hull_perim = hull.area
    except Exception:
        return None
    er = ndimage.binary_erosion(m)
    perim = int((m & ~er).sum())
    labels, n = ndimage.label(m, structure=np.ones((3, 3)))
    sizes = np.bincount(labels.ravel())[1:]
    big = int((sizes >= 0.04 * area).sum())
    tiny = int(((sizes < 0.04 * area) & (sizes >= 3)).sum())
    return {'solidity': solidity, 'rough': perim / max(1.0, hull_perim), 'pieces': big, 'tiny': tiny}


def iou(a, b):
    u = (a | b).sum()
    return (a & b).sum() / u if u else 0.0


def load_sheet(path):
    im = Image.open(path)
    if im.width not in TIER_BY_WIDTH or im.height != im.width * 3 // 8:
        return None, None, None
    name, cell = TIER_BY_WIDTH[im.width]
    return im.convert('RGB'), name, cell


def check_sheet(path):
    fails, warns = [], []
    rgb, tier, CELL = load_sheet(path)
    if rgb is None:
        fails.append(f'size is {Image.open(path).size}; must be 4096 x 1536 (close), 2048 x 768 (middle) or 1024 x 384 (far)')
        return fails, warns, None
    a = np.array(rgb)
    exact, near = key_masks(a)
    corners = [a[0, 0], a[0, -1], a[-1, 0], a[-1, -1]]
    if not all(tuple(c) == (255, 0, 255) for c in corners):
        fails.append(f'background corners are {[tuple(int(v) for v in c) for c in corners]}, must be exact #FF00FF')
    fg = ~exact
    BASELINE = CELL - max(2, round(8 * CELL / 256))
    border = max(2, round(2 * CELL / 256))
    sils, heights = {}, {}
    for r in range(ROWS):
        for c in range(COLS):
            y0, x0 = r * CELL, c * CELL
            cell = fg[y0:y0 + CELL, x0:x0 + CELL]
            name = f'{ROW[r]} / {STATE[c]}'
            if not cell.any():
                fails.append(f'{name}: empty cell')
                continue
            ys, xs = np.nonzero(cell)
            edge = int(cell[:border].sum() + cell[-border:].sum() + cell[:, :border].sum() + cell[:, -border:].sum())
            if edge > 6 * (CELL / 256):
                fails.append(f'{name}: figure touches the cell border ({edge} px): cropped or bleeding into the next cell')
            fr = int((near[y0:y0 + CELL, x0:x0 + CELL] & cell).sum())
            if fr > 40 * (CELL / 256) ** 2:
                fails.append(f'{name}: {fr} pink-fringe pixels (anti-aliased into the key). Re-key with a hard edge')
            elif fr:
                warns.append(f'{name}: {fr} pink-fringe pixels')
            bottom = int(ys.max())
            if c in STANDING and abs(bottom - BASELINE) > 8 * CELL / 256:
                warns.append(f'{name}: feet at y={bottom}, baseline is {BASELINE}')
            heights[(r, c)] = int(ys.max() - ys.min())
            s = sil_of(cell)
            sils[(r, c)] = s
            st = shape_stats(s)
            if st:
                if st['solidity'] > 0.93 and c not in (7,):
                    fails.append(f'{name}: silhouette is a blob (solidity {st["solidity"]:.2f}): open gaps between arms, weapon and body')
                if st['pieces'] > 3:
                    fails.append(f'{name}: silhouette is shredded into {st["pieces"]} pieces')
                if st['rough'] > 2.2:
                    fails.append(f'{name}: ragged edge (ratio {st["rough"]:.1f}): frayed fur/cloth/spikes read as noise; simplify to a few big shapes')
                elif st['rough'] > 1.8:
                    warns.append(f'{name}: edge is busy (ratio {st["rough"]:.1f})')
                if st['tiny'] > 4:
                    warns.append(f'{name}: {st["tiny"]} tiny loose pieces')
    for r in range(ROWS):
        for c in range(COLS - 1):
            for c2 in range(c + 1, COLS):
                if (r, c) in sils and (r, c2) in sils:
                    v = iou(sils[(r, c)], sils[(r, c2)])
                    if v > 0.90:
                        fails.append(f'{ROW[r]} / {STATE[c2]}: same silhouette as {STATE[c]} (IoU {v:.2f}): the pose must read differently')
                    elif v > 0.80:
                        warns.append(f'{ROW[r]} / {STATE[c2]}: very close to {STATE[c]} (IoU {v:.2f})')
    # does each pose read as the move it names? Judged from the silhouette alone.
    def bb(m):
        ys, xs = np.nonzero(m)
        return xs.min(), xs.max() + 1, ys.min(), ys.max() + 1
    for r in range(ROWS):
        if (r, 0) not in sils:
            continue
        i0 = sils[(r, 0)]
        x0a, x0b, y0a, y0b = bb(i0)
        iw, ih = x0b - x0a, y0b - y0a
        for c in (1, 2):                      # attack light / medium: something must reach out
            if (r, c) not in sils:
                continue
            v = iou(i0, sils[(r, c)])
            xa, xb, ya, yb = bb(sils[(r, c)])
            reach = (xb - xa) / iw
            need = 1.10 if c == 1 else 1.25
            if r == 1 and reach < need:
                (fails if reach < 1.0 else warns).append(
                    f'{ROW[r]} / {STATE[c]}: reaches only {reach:.2f}x the idle width (want {need}x): the strike has to extend a limb or weapon out of the body')
            if v > 0.88 and v <= 0.95:
                warns.append(f'{ROW[r]} / {STATE[c]}: only {1 - v:.0%} different from idle; attacks need a clear change of shape')
        if (r, 7) in sils:                    # defeated: flat on the floor
            xa, xb, ya, yb = bb(sils[(r, 7)])
            if (yb - ya) / ih > 0.65:
                fails.append(f'{ROW[r]} / defeated: {(yb - ya) / ih:.0%} of idle height; the body must lie flat (under 50%)')
            elif (yb - ya) / ih > 0.5:
                warns.append(f'{ROW[r]} / defeated: {(yb - ya) / ih:.0%} of idle height; flatter reads better from across a room')
        hs = [1 - iou(i0, sils[(r, c)]) for c in (4, 5, 6) if (r, c) in sils]
        if len(hs) == 3 and not (hs[0] < hs[1] < hs[2]):
            warns.append(f'{ROW[r]} / hurt: light, medium, heavy do not escalate ({hs[0]:.2f}, {hs[1]:.2f}, {hs[2]:.2f} change from idle)')
    # the same moment seen from three sides should be the same height
    idle = [heights.get((r, 0)) for r in range(ROWS) if heights.get((r, 0))]
    if idle and max(idle) > 1.12 * min(idle):
        fails.append(f'idle height differs between rows {idle}: scale drifted (keep within 12%)')
    if idle and max(idle) < 0.7 * (CELL - 26 * CELL / 256):
        warns.append(f'idle figure only {max(idle)} px tall; fill about {round(CELL - 26 * CELL / 256)} px (the game scales it)')
    return fails, warns, sils


def check_tiers(paths):
    fails, warns = [], []
    sets = {}
    for p in paths:
        f, w, sils = check_sheet(p)
        im = Image.open(p)
        tier = TIER_BY_WIDTH.get(im.width, ('?', 0))[0]
        sets[tier] = sils
        print(f'-- {tier}: {p}: {"FAIL" if f else "PASS"}')
    names = [t for t in ('close', 'middle', 'far') if sets.get(t)]
    if len(names) < len(paths):
        fails.append('could not read every tier (sizes must be 4096, 2048, 1024 wide)')
    for i in range(len(names)):
        for j in range(i + 1, len(names)):
            a, b = sets[names[i]], sets[names[j]]
            low = []
            for k in a:
                if k in b:
                    v = iou(a[k], b[k])
                    if v < 0.80:
                        low.append((v, f'{ROW[k[0]]} / {STATE[k[1]]}'))
            for v, nm in sorted(low)[:6]:
                (fails if v < 0.70 else warns).append(f'{names[i]} vs {names[j]}: {nm} silhouette drifts (IoU {v:.2f}): the swap will pop')
    return fails, warns


def write_sil_sheet(src, dst):
    rgb, tier, CELL = load_sheet(src)
    if rgb is None:
        print('bad size')
        return 1
    fg = ~key_masks(np.array(rgb))[0]
    out = Image.new('L', (COLS * (SIL + 8), ROWS * (SIL + 8)), 235)
    for r in range(ROWS):
        for c in range(COLS):
            s = sil_of(fg[r * CELL:(r + 1) * CELL, c * CELL:(c + 1) * CELL])
            out.paste(Image.fromarray(np.where(s, 20, 235).astype('uint8')), (c * (SIL + 8) + 4, r * (SIL + 8) + 4))
    out.save(dst)
    print(f'wrote {dst}')
    return 0


def check_fp(path):
    fails, warns = [], []
    im = Image.open(path)
    if im.size != (1024, 1024):
        fails.append(f'size is {im.size}, must be (1024, 1024)')
    if im.mode != 'RGBA':
        fails.append(f'mode is {im.mode}, must be RGBA (transparent background)')
        return fails, warns
    px = np.array(im)
    al = px[..., 3]
    light = (al > 0) & (px[..., 0] > 230) & (px[..., 1] > 230) & (px[..., 2] > 230)
    clear_n = ndimage.binary_dilation(al == 0, iterations=1)
    halo = int((light & clear_n).sum() // 4)
    if halo > 30:
        fails.append(f'{halo} light halo pixels on the cut-out edge (white matte left behind)')
    bbox = im.getbbox()
    if bbox and (bbox[2] < im.width - 4 and bbox[3] < im.height - 4):
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
        out.append(f'{k} [{len(cells)} cells: {", ".join(cells[:4])}{" ..." if len(cells) > 4 else ""}]' if cells else k)
    return out


def main():
    args = sys.argv[1:]
    if not args:
        print(__doc__)
        return 2
    if args[0] == '--sil' and len(args) == 3:
        return write_sil_sheet(args[1], args[2])
    if args[0] == '--tiers':
        files = args[1:]
        fails, warns = check_tiers(files)
        print(f'== tier consistency: {"FAIL" if fails else "PASS"}')
        for m in fails:
            print('  FAIL', m)
        for m in warns:
            print('  WARN', m)
        return 1 if fails else 0
    fp = '--fp' in args
    files = [a for a in args if a != '--fp']
    bad = False
    for f in files:
        if fp:
            fails, warns = check_fp(f)
        else:
            fails, warns, _ = check_sheet(f)
        print(f'== {f}: {"FAIL" if fails else "PASS"}')
        for m in summarise(fails):
            print('  FAIL', m)
        for m in summarise(warns):
            print('  WARN', m)
        bad = bad or bool(fails)
    return 1 if bad else 0


if __name__ == '__main__':
    sys.exit(main())
