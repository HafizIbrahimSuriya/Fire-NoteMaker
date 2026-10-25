"""
Round the corners of your screenshots so they look good on any theme.

Usage:   python docs/round-corners.py            (processes every .png in docs/)
         python docs/round-corners.py 24         (custom radius in pixels)

Needs:   pip install pillow
Original files are saved as <name>.original.png before they are replaced.
"""
import shutil
import sys
from pathlib import Path

from PIL import Image, ImageDraw

RADIUS = int(sys.argv[1]) if len(sys.argv) > 1 else 20
SKIP = ("header-", "footer", "features", "banner", ".original")
folder = Path(__file__).parent

for path in sorted(folder.glob("*.png")):
    if any(s in path.name for s in SKIP):
        continue
    img = Image.open(path).convert("RGBA")
    scale = 4  # draw big, shrink = smooth edges
    mask = Image.new("L", (img.width * scale, img.height * scale), 0)
    ImageDraw.Draw(mask).rounded_rectangle(
        (0, 0, img.width * scale - 1, img.height * scale - 1),
        radius=RADIUS * scale, fill=255)
    mask = mask.resize(img.size, Image.LANCZOS)
    shutil.copy(path, path.with_suffix(".original.png"))
    img.putalpha(mask)
    img.save(path)
    print("rounded:", path.name)
