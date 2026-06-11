"""Genera miniaturas ligeras para tarjetas de producto."""
from pathlib import Path

from PIL import Image

SRC = Path(__file__).resolve().parents[1] / "assets" / "images" / "products"
THUMBS = SRC / "thumbs"
CARD_WIDTH = 520
CARD_QUALITY = 76
HERO_WIDTH = 900
HERO_QUALITY = 82

THUMBS.mkdir(exist_ok=True)

for path in sorted(SRC.glob("*.jpg")):
    if path.name == "logo.jpg":
        out = THUMBS / path.name
        img = Image.open(path).convert("RGB")
        img.save(out, "JPEG", quality=85, optimize=True)
        print(f"logo -> {out.name} ({out.stat().st_size // 1024} KB)")
        continue

    img = Image.open(path).convert("RGB")
    w, h = img.size

    thumb = img.copy()
    if w > CARD_WIDTH:
        thumb = thumb.resize((CARD_WIDTH, int(h * CARD_WIDTH / w)), Image.Resampling.LANCZOS)
    thumb_path = THUMBS / path.name
    thumb.save(thumb_path, "JPEG", quality=CARD_QUALITY, optimize=True, progressive=True)

    if path.stat().st_size > 90_000:
        hero = img.copy()
        if w > HERO_WIDTH:
            hero = hero.resize((HERO_WIDTH, int(h * HERO_WIDTH / w)), Image.Resampling.LANCZOS)
        hero.save(path, "JPEG", quality=HERO_QUALITY, optimize=True, progressive=True)

    print(
        f"{path.name}: {path.stat().st_size // 1024} KB | thumb {thumb_path.stat().st_size // 1024} KB"
    )
