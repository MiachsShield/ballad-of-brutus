#!/usr/bin/env python3
"""Normalise a generated dungeon sprite sheet so it drops into the game.

Image models never land a clean 8 x 3 grid: figures overflow their cells, sizes drift between
cells, feet float, and anti-aliasing leaves a pink fringe in the magenta key. This tool fixes the
mechanical part. It does NOT fix drawing problems (wrong pose, wrong prop, off-model face).

What it does:
  1. Keys the background (exact #FF00FF and the pink spill around it) with a hard edge.
  2. Finds every separate shape and gives it to the cell its centre sits in, so a sword tip
     poking into the next cell goes back to its owner and slivers from neighbours disappear.
  3. Scales each row so its idle figure stands 230 px (head 18 px from the top, feet on the
     baseline 8 px above the bottom): the same creature is the same height from every side.
     Cells that would still overflow are shrunk on their own and reported.
  4. Puts each figure's feet on the baseline and its body centre on the cell's centre line.
  5. Writes a clean 2048 x 768 sheet on exact #FF00FF (or transparent with --alpha).

Usage:
  python3 sprite_fix.py raw.png art/sprites/brute.png [--alpha] [--no-scale]
  python3 sprite_fix.py poses/ art/sprites/brute.png      # a folder of one-pose images
    The folder holds r1c1.png ... r3c8.png (row 1-3, column 1-8, as in the sheet template),
    each one figure on #FF00FF or on transparency, any size. Missing files become empty cells.
Then run sprite_check.py on the output.
Needs: pip install pillow numpy scipy
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

CELL, COLS, ROWS = 256, 8, 3
BASE = CELL - 8
TOP = 18
KEY = np.array([255, 0, 255], dtype=np.uint8)


def background_mask(rgb):
    r, g, b = [rgb[..., i].astype(int) for i in range(3)]
    exact = (r > 235) & (g < 40) & (b > 235)
    spill = (r > 120) & (b > 120) & (g < 0.6 * np.minimum(r, b))
    return exact | spill


def compose_folder(folder):
    """One pose per file -> a rough sheet (each figure fitted into its cell) for the normal pass."""
    import os
    sheet = Image.new('RGBA', (CELL * COLS, CELL * ROWS), (255, 0, 255, 255))
    for r in range(ROWS):
        for c in range(COLS):
            path = os.path.join(folder, f'r{r + 1}c{c + 1}.png')
            if not os.path.exists(path):
                continue
            pose = Image.open(path).convert('RGBA')
            a = np.array(pose)
            keep = ~background_mask(a[..., :3]) & (a[..., 3] > 127)
            a[..., 3] = np.where(keep, 255, 0)
            a[~keep, :3] = (11, 9, 16)
            pose = Image.fromarray(a, 'RGBA')
            box = pose.getbbox()
            if not box:
                continue
            pose = pose.crop(box)
            k = min((CELL - 12) / pose.width, (CELL - 12) / pose.height)
            pose = pose.resize((max(1, int(pose.width * k)), max(1, int(pose.height * k))), Image.LANCZOS)
            sheet.alpha_composite(pose, (c * CELL + (CELL - pose.width) // 2, r * CELL + CELL - 6 - pose.height))
    return sheet


def main():
    args = [a for a in sys.argv[1:] if not a.startswith('--')]
    alpha_out = '--alpha' in sys.argv
    rescale = '--no-scale' not in sys.argv
    if len(args) != 2:
        print(__doc__)
        return 2
    src, dst = args
    import os
    if os.path.isdir(src):
        im = compose_folder(src)
    else:
        im = Image.open(src).convert('RGBA')
    if im.size != (CELL * COLS, CELL * ROWS):
        print(f'note: input is {im.size}; resizing to 2048 x 768 first')
        im = im.resize((CELL * COLS, CELL * ROWS), Image.LANCZOS)
    arr = np.array(im)
    fg = ~background_mask(arr[..., :3]) & (arr[..., 3] > 127)
    fg = ndimage.binary_opening(fg, iterations=1) | (fg & ndimage.binary_erosion(fg))  # drop 1-px specks
    labels, n = ndimage.label(fg, structure=np.ones((3, 3)))
    # Two figures that touch read as one shape: cut any shape wider or taller than 1.5 cells
    # along the cell lines it crosses, then label again.
    for i, sl in enumerate(ndimage.find_objects(labels), start=1):
        if sl is None:
            continue
        if (sl[1].stop - sl[1].start) > 1.5 * CELL or (sl[0].stop - sl[0].start) > 1.5 * CELL:
            sub = labels[sl] == i
            for x in range((sl[1].start // CELL + 1) * CELL, sl[1].stop, CELL):
                sub[:, max(0, x - sl[1].start - 1):x - sl[1].start + 1] = False
            for y in range((sl[0].start // CELL + 1) * CELL, sl[0].stop, CELL):
                sub[max(0, y - sl[0].start - 1):y - sl[0].start + 1, :] = False
            fg[sl] = np.where(labels[sl] == i, sub, fg[sl])
    labels, n = ndimage.label(fg, structure=np.ones((3, 3)))
    cells = {(r, c): [] for r in range(ROWS) for c in range(COLS)}
    shapes = []
    for i, sl in enumerate(ndimage.find_objects(labels), start=1):
        if sl is None:
            continue
        m = labels[sl] == i
        if m.sum() < 25:
            continue
        cy, cx = ndimage.center_of_mass(m)
        shapes.append((i, sl, int(m.sum()), cy + sl[0].start, cx + sl[1].start))
    # Bodies: the big shapes. Each cell gets at most one body, nearest first (generators place
    # figures off-grid, so "which cell is the centre in" can put two figures in one cell).
    biggest = max((s_[2] for s_ in shapes), default=0)
    bodies = [s_ for s_ in shapes if s_[2] >= 0.12 * biggest]
    # Rows by vertical band; within a row, figures left to right fill columns 1-8 in order.
    # If a row doesn't have exactly 8 bodies, fall back to nearest free cell.
    owner, taken_b = {}, set()
    for r in range(ROWS):
        row = sorted([b for b in bodies if int(b[3] // CELL) == r], key=lambda b: b[4])
        if len(row) == COLS:
            for c, b in enumerate(row):
                owner[(r, c)] = b
                taken_b.add(b[0])
    centre = {(r, c): (r * CELL + CELL / 2, c * CELL + CELL / 2) for r in range(ROWS) for c in range(COLS)}
    pairs = sorted(((abs(b[3] - cy_) / CELL) ** 2 * 4 + ((b[4] - cx_) / CELL) ** 2, b, k)
                   for b in bodies if b[0] not in taken_b for k, (cy_, cx_) in centre.items())
    for _, b, k in pairs:
        if b[0] in taken_b or k in owner:
            continue
        owner[k] = b
        taken_b.add(b[0])
    for k, b in owner.items():
        cells[k].append(b[:3])
    extra = [b for b in bodies if b[0] not in taken_b]
    if extra:
        print(f'  note: {len(extra)} extra figure(s) had no free cell and were dropped')
    # Small pieces (a dropped dagger, a loose strap) join the nearest body's cell.
    for s_ in shapes:
        if s_ in bodies:
            continue
        best = min(owner.items(), key=lambda kv: (kv[1][3] - s_[3]) ** 2 + (kv[1][4] - s_[4]) ** 2, default=None)
        if best and ((best[1][3] - s_[3]) ** 2 + (best[1][4] - s_[4]) ** 2) ** 0.5 < CELL * 0.9:
            cells[best[0]].append(s_[:3])
    # crop each cell's shapes into its own RGBA image
    crops = {}
    for key, parts in cells.items():
        if not parts:
            continue
        ys0 = min(p[1][0].start for p in parts); ys1 = max(p[1][0].stop for p in parts)
        xs0 = min(p[1][1].start for p in parts); xs1 = max(p[1][1].stop for p in parts)
        mask = np.isin(labels[ys0:ys1, xs0:xs1], [p[0] for p in parts])
        rgba = arr[ys0:ys1, xs0:xs1].copy()
        rgba[..., 3] = np.where(mask, 255, 0)
        rgba[~mask, :3] = (11, 9, 16)  # ink under the cut-out so resizing can't bleed magenta back in
        big = max(parts, key=lambda p: p[2])
        bm = labels[big[1]] == big[0]
        bx = ndimage.center_of_mass(bm)[1] + big[1][1].start - xs0  # body centre (largest shape)
        crops[key] = (Image.fromarray(rgba, 'RGBA'), bx)
    idle_h = [crops[(r, 0)][0].height for r in range(ROWS) if (r, 0) in crops]
    scale = (BASE - TOP) / max(idle_h) if (rescale and idle_h) else 1.0
    # Same creature in every view: each row is scaled so its idle stands the same height.
    row_scale = {r: ((BASE - TOP) / crops[(r, 0)][0].height if (rescale and (r, 0) in crops) else scale) for r in range(ROWS)}
    out = Image.new('RGBA', (CELL * COLS, CELL * ROWS), (255, 0, 255, 0 if alpha_out else 255))
    report = []
    for (r, c), (img, bx) in sorted(crops.items()):
        s = row_scale[r]
        w, h = img.width * s, img.height * s
        fit = min(1.0, (CELL - 6) / w, (BASE - 2) / h)
        if fit < 1.0:
            report.append(f'row {r + 1} col {c + 1}: shrunk to {fit:.0%} to fit its cell')
            s *= fit
        nw, nh = max(1, round(img.width * s)), max(1, round(img.height * s))
        sc = img.resize((nw, nh), Image.LANCZOS)
        a = np.array(sc)
        a[..., 3] = np.where(a[..., 3] >= 128, 255, 0)  # hard edge: no partial pixels into the key
        rr, gg, bb = [a[..., i].astype(int) for i in range(3)]
        pink = (rr > 120) & (bb > 120) & (gg < 0.6 * np.minimum(rr, bb)) & (a[..., 3] == 255)
        a[pink, :3] = (11, 9, 16)  # leftover magenta spill on the edge becomes ink outline
        sc = Image.fromarray(a, 'RGBA')
        x = int(round(c * CELL + CELL / 2 - bx * s))
        x = max(c * CELL + 3, min(x, c * CELL + CELL - 3 - nw))
        y = r * CELL + BASE - nh
        out.alpha_composite(sc, (x, y))
    if not alpha_out:
        bg = Image.new('RGBA', out.size, (255, 0, 255, 255))
        bg.alpha_composite(out)
        out = bg.convert('RGB')
    out.save(dst)
    print(f'wrote {dst}  (scale {scale:.2f}, {sum(1 for v in cells.values() if v)} of 24 cells filled)')
    for line in report:
        print('  ' + line)
    empty = [f'row {r + 1} col {c + 1}' for (r, c), v in cells.items() if not v]
    if empty:
        print('  EMPTY: ' + ', '.join(empty))
    return 0


if __name__ == '__main__':
    sys.exit(main())
