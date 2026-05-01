"""
python generate_icon.py
Generates icon16.png, icon48.png, icon128.png inside this folder.
Requires: pip install Pillow
"""
from PIL import Image, ImageDraw
import os, math

SIZES  = [16, 48, 128]
DIR    = os.path.dirname(os.path.abspath(__file__))
PURPLE = (124, 58, 237)
BLUE   = (37,  99, 235)

def lerp_rgb(c1, c2, t):
    return tuple(int(c1[i] + (c2[i] - c1[i]) * t) for i in range(3))

def rounded_mask(draw, s, r):
    """Draw a filled white rounded rectangle on an 'L' image draw."""
    draw.rectangle([r, 0, s - r, s], fill=255)
    draw.rectangle([0, r, s, s - r], fill=255)
    draw.ellipse([0,         0,         r * 2, r * 2],         fill=255)
    draw.ellipse([s - r * 2, 0,         s,     r * 2],         fill=255)
    draw.ellipse([0,         s - r * 2, r * 2, s],             fill=255)
    draw.ellipse([s - r * 2, s - r * 2, s,     s],             fill=255)

def make_icon(size):
    SS = 4          # supersampling for smooth edges
    s  = size * SS
    r  = round(s * 0.21)

    # ── gradient background ──
    bg   = Image.new('RGB', (s, s))
    bdraw = ImageDraw.Draw(bg)
    for y in range(s):
        c = lerp_rgb(PURPLE, BLUE, y / (s - 1))
        bdraw.line([(0, y), (s - 1, y)], fill=c)

    # ── rounded corner mask ──
    mask  = Image.new('L', (s, s), 0)
    mdraw = ImageDraw.Draw(mask)
    try:
        mdraw.rounded_rectangle([0, 0, s - 1, s - 1], radius=r, fill=255)
    except AttributeError:          # Pillow < 8.2
        rounded_mask(mdraw, s, r)

    # ── composite ──
    icon = Image.new('RGBA', (s, s), (0, 0, 0, 0))
    icon.paste(bg, mask=mask)

    # ── arrow drawing ──
    d  = ImageDraw.Draw(icon)
    W  = round(s * 0.58)   # total arrow span
    SH = round(s * 0.115)  # shaft half-height
    HH = round(s * 0.20)   # arrowhead half-height (triangle)
    HL = round(s * 0.22)   # arrowhead length
    cx = s // 2

    def right_arrow(ym, alpha=250):
        xl = cx - W // 2
        xs = cx + W // 2 - HL
        xr = cx + W // 2
        d.polygon([
            (xl, ym - SH), (xs, ym - SH), (xs, ym - HH),
            (xr, ym),
            (xs, ym + HH), (xs, ym + SH), (xl, ym + SH),
        ], fill=(255, 255, 255, alpha))

    def left_arrow(ym, alpha=210):
        xr = cx + W // 2
        xs = cx - W // 2 + HL
        xl = cx - W // 2
        d.polygon([
            (xr, ym - SH), (xs, ym - SH), (xs, ym - HH),
            (xl, ym),
            (xs, ym + HH), (xs, ym + SH), (xr, ym + SH),
        ], fill=(255, 255, 255, alpha))

    right_arrow(round(s * 0.355))
    left_arrow( round(s * 0.645))

    return icon.resize((size, size), Image.LANCZOS)

print('Generating icons...')
for size in SIZES:
    icon = make_icon(size)
    path = os.path.join(DIR, f'icon{size}.png')
    icon.save(path, optimize=True)
    print(f'  icon{size}.png  OK')
print('Done.')
