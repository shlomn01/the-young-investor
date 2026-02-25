#!/bin/bash
# Generate all game backgrounds using Gemini 2.5 Flash Image API
# Run this when Gemini API quota has reset (daily at midnight Pacific)
#
# Usage: bash scripts/generate-backgrounds.sh
# Requires: GEMINI_API_KEY environment variable

set -e
source ~/.bashrc 2>/dev/null

if [ -z "$GEMINI_API_KEY" ]; then
  echo "ERROR: GEMINI_API_KEY not set"
  exit 1
fi

OUTDIR="public/assets/images/backgrounds"
MODEL="gemini-2.5-flash-image"
API_URL="https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${GEMINI_API_KEY}"

mkdir -p "$OUTDIR"

# Style prefix for consistency
STYLE="Cartoon illustration game background, warm colors, clean dark outlines, Mediterranean Israeli style, cel-shaded, storybook quality, warm lighting, 1920x1080 resolution, horizontal orientation, no characters, no text."

generate_image() {
  local filename="$1"
  local prompt="$2"
  local full_prompt="${STYLE} ${prompt}"

  echo "Generating: ${filename}..."

  local response
  response=$(curl -s "$API_URL" \
    -H 'Content-Type: application/json' \
    -d "{
      \"contents\": [{\"parts\": [{\"text\": \"Generate an image: ${full_prompt}\"}]}],
      \"generationConfig\": {\"responseModalities\": [\"TEXT\", \"IMAGE\"]}
    }" 2>&1)

  # Parse response with Python
  echo "$response" | python3 -c "
import json, sys, base64, os
data = json.load(sys.stdin)
if 'error' in data:
    print(f'  ERROR: {data[\"error\"].get(\"message\",\"\")[:200]}')
    sys.exit(1)
parts = data.get('candidates', [{}])[0].get('content', {}).get('parts', [])
saved = False
for part in parts:
    if 'inlineData' in part:
        img_data = base64.b64decode(part['inlineData']['data'])
        mime = part['inlineData']['mimeType']
        ext = 'png' if 'png' in mime else 'jpg'
        fname = '${OUTDIR}/${filename}.' + ext
        with open(fname, 'wb') as f:
            f.write(img_data)
        print(f'  SAVED: {fname} ({len(img_data)//1024}KB)')
        saved = True
if not saved:
    print('  WARNING: No image in response')
    for part in parts:
        if 'text' in part:
            print(f'  Text: {part[\"text\"][:200]}')
" 2>&1

  local status=$?
  if [ $status -ne 0 ]; then
    echo "  Failed to generate ${filename}. Waiting 60s before retry..."
    sleep 60
    return 1
  fi

  # Rate limiting - wait between requests
  echo "  Waiting 5s for rate limit..."
  sleep 5
  return 0
}

echo "=== Generating Game Backgrounds ==="
echo "Output: ${OUTDIR}"
echo ""

# --- TIER 1: Interior scenes ---
echo "--- TIER 1: Interior Scenes ---"

generate_image "bank_interior" \
  "Interior of an Israeli bank branch. Polished marble floor with subtle checkerboard pattern, large steel vault door with circular handle in the background wall, long wooden counter with brass details and glass partition windows, potted palm plants in corners, warm overhead pendant lighting, professional but inviting atmosphere, cream and warm grey walls."

generate_image "school_interior" \
  "Israeli classroom interior. Large green chalkboard with wooden frame on cream beige wall, wooden teachers desk with apple and books, rows of student desks with chairs, warm sunlight streaming through tall windows, educational posters on walls, cheerful studious atmosphere."

generate_image "library_interior" \
  "Cozy Israeli library interior. Tall dark wood bookshelves filled with colorful book spines, arched window with warm light rays streaming in, reading table with green bankers lamp, scattered open books on table, warm amber lighting, quiet peaceful atmosphere."

generate_image "bar_mitzvah_interior" \
  "Israeli synagogue interior for Bar Mitzvah ceremony. Jerusalem stone walls with warm golden tone, arched ceiling with ornate details, beautiful stained glass windows in jewel tones of blue red green and gold, wooden bimah platform in center, warm golden lighting from chandeliers, festive but respectful sacred atmosphere."

# --- TIER 2: Replace inconsistent art ---
echo ""
echo "--- TIER 2: Replace Existing Art ---"

generate_image "title_screen_new" \
  "Israeli cityscape panorama at golden hour sunset. Tel Aviv Jerusalem inspired skyline with Mediterranean Bauhaus architecture buildings, palm trees, golden sunset reflecting off building windows, warm inviting atmosphere, cinematic wide angle shot, soft warm orange and pink sky gradients. Suitable for game title overlay."

generate_image "guru_room_new" \
  "Luxury study office of a wise elderly investor. Rich mahogany bookshelves filled with leather-bound books, large antique wooden executive desk with brass globe and bankers lamp, Persian rug on dark polished wood floor, framed stock market charts on paneled wall, warm fireplace glow, distinguished sophisticated atmosphere."

generate_image "bedroom" \
  "Israeli teenagers bedroom. Single bed with blue and white bedding, wooden computer desk with monitor and keyboard, bookshelf with books and small trophies, colorful posters on light painted walls, window showing afternoon city view, warm sunlight streaming in, lived-in cozy feel, scattered school supplies."

# --- TIER 3: Additional scenes ---
echo ""
echo "--- TIER 3: Additional Scenes ---"

generate_image "street_evening" \
  "Israeli city street at evening golden hour. Mediterranean style buildings with iron balconies and shuttered windows, warm streetlights beginning to glow, golden sunset sky with orange and purple gradients, palm trees lining the sidewalk, outdoor cafe tables, peaceful serene evening atmosphere."

generate_image "percents_game_bg" \
  "Cosmic space scene for a math quiz game. Deep purple and blue nebula with swirling cosmic dust clouds, distant twinkling stars and small galaxies, ethereal blue and purple glow, mysterious but inviting and playful, dark background suitable for floating game UI elements and text overlays."

generate_image "quiz_stage_bg" \
  "Television game show stage setting. Multiple spotlight beams shining down from above in blue gold and purple, dark audience seating area in background, polished reflective stage floor, colorful stage lights creating dramatic atmosphere, podium area in center, exciting competitive TV quiz show atmosphere."

echo ""
echo "=== Generation Complete ==="
echo ""
ls -lh "$OUTDIR"/*.png "$OUTDIR"/*.jpg 2>/dev/null
echo ""
echo "Total size:"
du -sh "$OUTDIR"
