"""Generate all game backgrounds using Gemini 2.5 Flash Image API."""
import json, base64, os, sys, time, urllib.request, urllib.error

API_KEY = os.environ.get("GEMINI_API_KEY", "")
MODEL = "gemini-2.5-flash-image"
API_URL = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent?key={API_KEY}"
OUTDIR = "public/assets/images/backgrounds"

STYLE = (
    "Cartoon illustration game background, warm colors, clean dark outlines, "
    "Mediterranean Israeli style, cel-shaded, storybook quality, warm lighting, "
    "1920x1080 resolution, horizontal orientation, no characters, no text."
)

BACKGROUNDS = [
    ("bank_interior", "Interior of an Israeli bank branch. Polished marble floor with subtle checkerboard pattern, large steel vault door with circular handle in the background wall, long wooden counter with brass details and glass partition windows, potted palm plants in corners, warm overhead pendant lighting, professional but inviting atmosphere, cream and warm grey walls."),
    ("school_interior", "Israeli classroom interior. Large green chalkboard with wooden frame on cream beige wall, wooden teachers desk with apple and books, rows of student desks with chairs, warm sunlight streaming through tall windows, educational posters on walls, cheerful studious atmosphere."),
    ("library_interior", "Cozy Israeli library interior. Tall dark wood bookshelves filled with colorful book spines, arched window with warm light rays streaming in, reading table with green bankers lamp, scattered open books on table, warm amber lighting, quiet peaceful atmosphere."),
    ("bar_mitzvah_interior", "Israeli synagogue interior for Bar Mitzvah ceremony. Jerusalem stone walls with warm golden tone, arched ceiling with ornate details, beautiful stained glass windows in jewel tones of blue red green and gold, wooden bimah platform in center, warm golden lighting from chandeliers, festive but respectful sacred atmosphere."),
    ("title_screen_new", "Israeli cityscape panorama at golden hour sunset. Tel Aviv Jerusalem inspired skyline with Mediterranean Bauhaus architecture buildings, palm trees, golden sunset reflecting off building windows, warm inviting atmosphere, cinematic wide angle shot, soft warm orange and pink sky gradients. Suitable for game title overlay."),
    ("guru_room_new", "Luxury study office of a wise elderly investor. Rich mahogany bookshelves filled with leather-bound books, large antique wooden executive desk with brass globe and bankers lamp, Persian rug on dark polished wood floor, framed stock market charts on paneled wall, warm fireplace glow, distinguished sophisticated atmosphere."),
    ("bedroom", "Israeli teenagers bedroom. Single bed with blue and white bedding, wooden computer desk with monitor and keyboard, bookshelf with books and small trophies, colorful posters on light painted walls, window showing afternoon city view, warm sunlight streaming in, lived-in cozy feel, scattered school supplies."),
    ("street_evening", "Israeli city street at evening golden hour. Mediterranean style buildings with iron balconies and shuttered windows, warm streetlights beginning to glow, golden sunset sky with orange and purple gradients, palm trees lining the sidewalk, outdoor cafe tables, peaceful serene evening atmosphere."),
    ("percents_game_bg", "Cosmic space scene for a math quiz game. Deep purple and blue nebula with swirling cosmic dust clouds, distant twinkling stars and small galaxies, ethereal blue and purple glow, mysterious but inviting and playful, dark background suitable for floating game UI elements and text overlays."),
    ("quiz_stage_bg", "Television game show stage setting. Multiple spotlight beams shining down from above in blue gold and purple, dark audience seating area in background, polished reflective stage floor, colorful stage lights creating dramatic atmosphere, podium area in center, exciting competitive TV quiz show atmosphere."),
]


def generate_image(filename: str, scene_prompt: str) -> bool:
    full_prompt = f"Generate an image: {STYLE} {scene_prompt}"
    payload = json.dumps({
        "contents": [{"parts": [{"text": full_prompt}]}],
        "generationConfig": {"responseModalities": ["TEXT", "IMAGE"]},
    }).encode()

    req = urllib.request.Request(
        API_URL,
        data=payload,
        headers={"Content-Type": "application/json"},
    )

    try:
        with urllib.request.urlopen(req, timeout=120) as resp:
            data = json.loads(resp.read())
    except urllib.error.HTTPError as e:
        body = e.read().decode()
        print(f"  HTTP {e.code}: {body[:200]}")
        return False
    except Exception as e:
        print(f"  Error: {e}")
        return False

    parts = data.get("candidates", [{}])[0].get("content", {}).get("parts", [])
    for part in parts:
        if "inlineData" in part:
            img_data = base64.b64decode(part["inlineData"]["data"])
            mime = part["inlineData"]["mimeType"]
            ext = "png" if "png" in mime else "jpg"
            fpath = os.path.join(OUTDIR, f"{filename}.{ext}")
            with open(fpath, "wb") as f:
                f.write(img_data)
            print(f"  SAVED: {fpath} ({len(img_data) // 1024}KB)")
            return True

    print("  WARNING: No image in response")
    for part in parts:
        if "text" in part:
            print(f"  Text: {part['text'][:200]}")
    return False


def main():
    if not API_KEY:
        print("ERROR: GEMINI_API_KEY not set")
        sys.exit(1)

    os.makedirs(OUTDIR, exist_ok=True)
    print(f"=== Generating {len(BACKGROUNDS)} Game Backgrounds ===")
    print(f"Output: {OUTDIR}\n")

    success = 0
    for i, (name, prompt) in enumerate(BACKGROUNDS):
        print(f"[{i+1}/{len(BACKGROUNDS)}] {name}...")
        if generate_image(name, prompt):
            success += 1
        else:
            print("  Retrying in 10s...")
            time.sleep(10)
            if generate_image(name, prompt):
                success += 1
            else:
                print(f"  FAILED: {name}")

        # Rate limiting between requests
        if i < len(BACKGROUNDS) - 1:
            time.sleep(3)

    print(f"\n=== Done: {success}/{len(BACKGROUNDS)} generated ===")


if __name__ == "__main__":
    main()
