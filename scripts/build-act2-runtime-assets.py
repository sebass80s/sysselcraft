#!/usr/bin/env python3
"""
Build the approved Act 2 runtime PNG set from the source art already in the repo.

This is intentionally deterministic:
- preserves existing alpha when present
- removes only edge-connected light neutral checkerboard/background pixels from RGB sources
- crops transparent outer margins
- places every stage bottom-centre in the locked common family canvas
- never resizes or redraws source art

Requires Pillow: python3 -m pip install --user Pillow
"""

from collections import deque
from pathlib import Path
import sys

try:
    from PIL import Image
except ImportError:
    print("Missing Pillow. Run: python3 -m pip install --user Pillow", file=sys.stderr)
    raise SystemExit(2)

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "public/assets/village/buildings/act 2"
OUT = SRC / "runtime"

FAMILIES = {
    "cabin": {
        "canvas": (1766, 879),
        "files": [f"cabin-stage-{i}.png" for i in range(1, 5)],
        "out": [f"cabin-stage-{i}.png" for i in range(1, 5)],
    },
    "dock": {
        "canvas": (1774, 887),
        "files": [f"dock-stage-{i}.png" for i in range(1, 5)],
        "out": [f"dock-stage-{i}.png" for i in range(1, 5)],
    },
    "boathouse": {
        "canvas": (1628, 991),
        "files": [f"boat-house-{i}.png" for i in range(1, 5)],
        "out": [f"boat-house-{i}.png" for i in range(1, 5)],
    },
    "motorboat": {
        "canvas": (725, 423),
        "files": [f"motorboat-stage-{i}-transparent.png" for i in range(1, 5)],
        "out": [f"motorboat-stage-{i}.png" for i in range(1, 5)],
    },
}

# Sources known to contain a baked light checkerboard instead of real transparency.
BAKED = {
    "cabin-stage-2.png", "cabin-stage-3.png", "cabin-stage-4.png",
    "dock-stage-1.png", "dock-stage-2.png", "dock-stage-4.png",
    "boat-house-3.png",
}

def neutral_light(rgb):
    r, g, b = rgb
    return min(r, g, b) >= 185 and (max(r, g, b) - min(r, g, b)) <= 18

def remove_edge_background(im):
    rgb = im.convert("RGB")
    w, h = rgb.size
    px = rgb.load()
    seen = bytearray(w * h)
    q = deque()

    def add(x, y):
        idx = y * w + x
        if not seen[idx] and neutral_light(px[x, y]):
            seen[idx] = 1
            q.append((x, y))

    for x in range(w):
        add(x, 0); add(x, h - 1)
    for y in range(h):
        add(0, y); add(w - 1, y)

    while q:
        x, y = q.popleft()
        if x: add(x - 1, y)
        if x + 1 < w: add(x + 1, y)
        if y: add(x, y - 1)
        if y + 1 < h: add(x, y + 1)

    rgba = rgb.convert("RGBA")
    out = rgba.load()
    for y in range(h):
        row = y * w
        for x in range(w):
            if seen[row + x]:
                r, g, b, _ = out[x, y]
                out[x, y] = (r, g, b, 0)
    return rgba

def crop_alpha(im):
    alpha = im.getchannel("A")
    box = alpha.getbbox()
    if box is None:
        raise RuntimeError("asset became fully transparent")
    return im.crop(box)

def build_one(src_name, out_name, canvas_size):
    src = SRC / src_name
    if not src.exists():
        raise FileNotFoundError(src)

    with Image.open(src) as raw:
        if src_name in BAKED:
            im = remove_edge_background(raw)
        else:
            im = raw.convert("RGBA")
        im = crop_alpha(im)

    cw, ch = canvas_size
    if im.width > cw or im.height > ch:
        raise RuntimeError(f"{src_name}: crop {im.size} exceeds locked canvas {canvas_size}")

    x = (cw - im.width) // 2
    y = ch - im.height
    canvas = Image.new("RGBA", canvas_size, (0, 0, 0, 0))
    canvas.alpha_composite(im, (x, y))
    canvas.save(OUT / out_name, "PNG", optimize=False)
    return im.size, (x, y)

def main():
    OUT.mkdir(parents=True, exist_ok=True)
    count = 0
    for family, spec in FAMILIES.items():
        print(f"{family}: canvas {spec['canvas'][0]}x{spec['canvas'][1]}")
        for src_name, out_name in zip(spec["files"], spec["out"]):
            crop, pos = build_one(src_name, out_name, spec["canvas"])
            print(f"  {out_name}: crop {crop[0]}x{crop[1]} @ {pos[0]},{pos[1]}")
            count += 1
    print(f"Built {count} Act 2 runtime PNGs in: {OUT}")

if __name__ == "__main__":
    main()
