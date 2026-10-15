#!/usr/bin/env python3
"""Derive the middle and far detail tiers from a close-tier master sheet.

The close sheet (4096 x 1536, 512 px cells) is the only one an image model draws. This makes:

  middle  2048 x 768   256 px cells   inked cel: flat colour groups, hard 3 px ink contour (drawn inward)
  far     1024 x 384   128 px cells   silhouette read: simplified outline, few flats, one accent,
                                       thick contour

Same pose, same palette, same silhouette in every tier, so the swap in the game does not pop.

Usage:
  python3 sprite_tiers.py art/sprites/brute-close.png art/sprites/brute        # writes brute-middle.png, brute-far.png
  python3 sprite_tiers.py close.png out_prefix --middle-colors 28 --far-colors 7

What it does:
  1. Keys the magenta background (exact #FF00FF and pink spill) and works in RGBA, so no magenta
     can bleed into the figure when it is shrunk.
  2. middle: shrinks 2x, flattens gradients into a limited palette, snaps alpha to a hard edge,
     and re-draws a clean ink contour about 3 px thick along every figure's edge, inside the silhouette.
  3. far: shrinks 4x, then simplifies the silhouette itself (closes pinholes, rounds off frayed
     fur and cloth, drops specks), flattens to a few colours while keeping the most saturated
     one as the accent, and draws a thick ink contour (about 2 px at 128 px, heavier than middle's 3 px at 256), again inside the silhouette.
  4. Writes both sheets on exact #FF00FF with hard edges.

Then run:  python3 sprite_check.py --tiers close.png middle.png far.png

It does not invent detail, and it cannot fix a drawing whose silhouette is weak in the close tier;
fix that at the source. Middle may still want a quick hand touch-up; far should not.
Needs: pip install pillow numpy scipy
"""
import sys
import numpy as np
from PIL import Image
from scipy import ndimage

INK = np.array([11, 9, 16], dtype=np.uint8)
COLS, ROWS = 8, 3


def key_out(rgb):
    r, g, b = [rgb[..., i].astype(int) for i in range(3)]
    exact = (r > 235) & (g < 40) & (b > 235)
    spill = (r > 120) & (b > 120) & (g < 0.6 * np.minimum(r, b))
    return ~(exact | spill)


def shrink(rgba_fg, factor):
    """Premultiplied Lanczos shrink of an RGBA array; returns float alpha 0..1 and straight RGB."""
    h, w = rgba_fg.shape[:2]
    a = rgba_fg[..., 3:4].astype(np.float32) / 255.0
    rgb = rgba_fg[..., :3].astype(np.float32) * a
    size = (w // factor, h // factor)
    ch = [np.array(Image.fromarray(np.clip(rgb[..., i], 0, 255).astype(np.uint8)).resize(size, Image.LANCZOS)).astype(np.float32) for i in range(3)]
    al = np.array(Image.fromarray((a[..., 0] * 255).astype(np.uint8)).resize(size, Image.LANCZOS)).astype(np.float32) / 255.0
    out = np.stack(ch, axis=-1) / np.maximum(al[..., None], 1e-3)
    return al, np.clip(out, 0, 255)


def quantize(rgb, mask, n, keep_accent=True):
    """Flatten the figure's colours to n flats. The most saturated cluster survives as the accent."""
    if not mask.any():
        return rgb
    px = rgb[mask].astype(np.uint8)
    img = Image.fromarray(px.reshape(-1, 1, 3))
    q = img.quantize(colors=n, method=Image.MEDIANCUT, dither=Image.NONE)
    pal = np.array(q.getpalette()[:n * 3]).reshape(-1, 3)
    flat = pal[np.array(q).reshape(-1)].astype(np.uint8)
    if keep_accent:
        mx, mn = px.max(1).astype(int), px.min(1).astype(int)
        sat = (mx - mn) / np.maximum(mx, 1)
        hot = (sat > 0.55) & (mx > 120)
        if hot.sum() > 6:
            flat[hot] = px[hot].mean(0).astype(np.uint8)
    out = rgb.copy().astype(np.uint8)
    out[mask] = flat
    return out


def outline(mask, thickness):
    """Ink ring drawn INSIDE the silhouette edge, `thickness` px wide.

    Drawing it inward keeps the silhouette extent identical across tiers (no size pop between
    tiers) and keeps figures off the cell border.
    """
    st = ndimage.generate_binary_structure(2, 2)
    inner = ndimage.binary_erosion(mask, structure=st, iterations=thickness)
    return mask & ~inner


def simplify_silhouette(mask, close_r, open_r):
    st = ndimage.generate_binary_structure(2, 1)
    m = ndimage.binary_closing(mask, structure=st, iterations=close_r)
    m = ndimage.binary_opening(m, structure=st, iterations=open_r)
    lab, n = ndimage.label(m, structure=np.ones((3, 3)))
    if n > 1:
        sizes = np.bincount(lab.ravel())[1:]
        keep = np.nonzero(sizes >= 0.01 * sizes.max())[0] + 1
        m = np.isin(lab, keep)
    return m


def make_tier(close_rgba, factor, ncolors, thick, simplify):
    cell_h = close_rgba.shape[0] // ROWS
    cell_w = close_rgba.shape[1] // COLS
    oc_h, oc_w = cell_h // factor, cell_w // factor
    out = np.zeros((oc_h * ROWS, oc_w * COLS, 4), np.uint8)
    for r in range(ROWS):
        for c in range(COLS):
            cell = close_rgba[r * cell_h:(r + 1) * cell_h, c * cell_w:(c + 1) * cell_w]
            al, rgb = shrink(cell, factor)
            m = al > 0.5
            if simplify:
                m = simplify_silhouette(m, 1, 1)
            flat = quantize(rgb, m, ncolors)
            ring = outline(m, thick)
            tile = np.zeros((oc_h, oc_w, 4), np.uint8)
            tile[m, :3] = flat[m]
            tile[m, 3] = 255
            # keep the figure's own dark linework; the ring guarantees one unbroken contour
            tile[ring, :3] = INK
            tile[ring, 3] = 255
            out[r * oc_h:(r + 1) * oc_h, c * oc_w:(c + 1) * oc_w] = tile
    return out


def to_sheet(rgba):
    bg = np.zeros(rgba.shape[:2] + (3,), np.uint8)
    bg[:] = (255, 0, 255)
    solid = rgba[..., 3] > 0
    bg[solid] = rgba[..., :3][solid]
    return Image.fromarray(bg)


def main():
    argv = sys.argv[1:]
    opts = {'--middle-colors': 28, '--far-colors': 7}
    for k in list(opts):
        if k in argv:
            i = argv.index(k)
            opts[k] = int(argv[i + 1])
            del argv[i:i + 2]
    if len(argv) != 2:
        print(__doc__)
        return 2
    src, prefix = argv
    im = Image.open(src).convert('RGB')
    if im.size != (4096, 1536):
        print(f'error: close sheet must be 4096 x 1536, got {im.size}')
        return 1
    a = np.array(im)
    fg = key_out(a)
    rgba = np.dstack([a, (fg * 255).astype(np.uint8)])
    rgba[~fg, :3] = INK          # no magenta under the cut-out: nothing to bleed when shrinking
    mid = make_tier(rgba, 2, opts['--middle-colors'], 3, simplify=False)
    far = make_tier(rgba, 4, opts['--far-colors'], 2, simplify=True)
    to_sheet(mid).save(f'{prefix}-middle.png')
    to_sheet(far).save(f'{prefix}-far.png')
    print(f'wrote {prefix}-middle.png (2048 x 768) and {prefix}-far.png (1024 x 384)')
    print('next: python3 sprite_check.py --tiers', src, f'{prefix}-middle.png', f'{prefix}-far.png')
    return 0


if __name__ == '__main__':
    sys.exit(main())
