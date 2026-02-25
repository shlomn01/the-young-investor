"""Compress all game images to reduce load times.

Requires: pip install Pillow
Usage: python scripts/compress-images.py
"""
import os
import sys
from pathlib import Path

try:
    from PIL import Image
except ImportError:
    print("ERROR: Pillow not installed. Run: pip install Pillow")
    sys.exit(1)

ASSET_DIR = Path("public/assets/images")
MAX_BG_WIDTH = 1920
MAX_PORTRAIT_SIZE = 256
MAX_ICON_SIZE = 128
JPEG_QUALITY = 82
PNG_OPTIMIZE = True

def compress_image(path: Path, max_size: int | None = None) -> tuple[int, int]:
    """Compress a single image. Returns (original_size, new_size)."""
    original_size = path.stat().st_size

    try:
        img = Image.open(path)
    except Exception as e:
        print(f"  SKIP (can't open): {e}")
        return original_size, original_size

    # Resize if needed
    if max_size:
        w, h = img.size
        if w > max_size or h > max_size:
            ratio = min(max_size / w, max_size / h)
            new_w = int(w * ratio)
            new_h = int(h * ratio)
            img = img.resize((new_w, new_h), Image.LANCZOS)

    # Save with compression
    ext = path.suffix.lower()
    if ext in ('.jpg', '.jpeg'):
        if img.mode == 'RGBA':
            img = img.convert('RGB')
        img.save(path, 'JPEG', quality=JPEG_QUALITY, optimize=True)
    elif ext == '.png':
        img.save(path, 'PNG', optimize=PNG_OPTIMIZE)

    new_size = path.stat().st_size
    return original_size, new_size


def main():
    if not ASSET_DIR.exists():
        print(f"ERROR: {ASSET_DIR} not found. Run from project root.")
        sys.exit(1)

    total_original = 0
    total_new = 0
    count = 0

    categories = [
        ("backgrounds", ASSET_DIR / "backgrounds", MAX_BG_WIDTH),
        ("characters/portraits", ASSET_DIR / "characters" / "portraits", MAX_PORTRAIT_SIZE),
        ("icons", ASSET_DIR / "icons", MAX_ICON_SIZE),
        ("buildings", ASSET_DIR / "buildings", 512),
        ("characters (spritesheets)", ASSET_DIR / "characters", None),
        ("objects", ASSET_DIR / "objects", 512),
        ("ui", ASSET_DIR / "ui", None),
    ]

    for name, dir_path, max_size in categories:
        if not dir_path.exists():
            continue

        # Only process files directly in dir (not subdirs for characters)
        if name == "characters (spritesheets)":
            files = [f for f in dir_path.iterdir() if f.is_file() and f.suffix.lower() in ('.png', '.jpg', '.jpeg')]
        else:
            files = list(dir_path.glob("*.png")) + list(dir_path.glob("*.jpg")) + list(dir_path.glob("*.jpeg"))

        if not files:
            continue

        print(f"\n--- {name} ({len(files)} files) ---")
        cat_original = 0
        cat_new = 0

        for f in sorted(files):
            orig, new = compress_image(f, max_size)
            cat_original += orig
            cat_new += new
            count += 1
            saved = orig - new
            pct = (saved / orig * 100) if orig > 0 else 0
            if saved > 0:
                print(f"  {f.name}: {orig // 1024}KB -> {new // 1024}KB (-{pct:.0f}%)")
            else:
                print(f"  {f.name}: {orig // 1024}KB (unchanged)")

        total_original += cat_original
        total_new += cat_new
        saved = cat_original - cat_new
        print(f"  Subtotal: {cat_original // 1024}KB -> {cat_new // 1024}KB (-{saved // 1024}KB)")

    saved = total_original - total_new
    print(f"\n=== TOTAL: {total_original // 1024}KB -> {total_new // 1024}KB (saved {saved // 1024}KB / {saved / total_original * 100:.1f}%) ===")
    print(f"Processed {count} files")


if __name__ == "__main__":
    main()
