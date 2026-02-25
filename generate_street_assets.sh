#!/bin/bash
# Generate all street scene assets using Gemini
# Run this when Gemini API quota is available
# Usage: bash generate_street_assets.sh

SKILL_DIR="$HOME/.claude/skills/nano-banana-poster/scripts"
BG_DIR="$(dirname "$0")/public/assets/images/backgrounds"
BLD_DIR="$(dirname "$0")/public/assets/images/buildings"

STYLE="Overcooked 2 game art style, vibrant cartoon, thick outlines, cel-shaded, warm lighting, Israeli Mediterranean setting"

cd "$SKILL_DIR" || { echo "Skill directory not found"; exit 1; }

echo "=== Generating 3 Street Backgrounds (16:9) ==="

echo "[1/11] street_residential.png"
npx ts-node generate_poster.ts --aspect 16:9 \
  "Side-scrolling 2D game background, ${STYLE}. Quiet residential neighborhood street view. Blue sky with fluffy white clouds, warm sun. In the distance: small Mediterranean houses with terracotta roofs, cypress trees, palm trees, garden flowers. Middle ground: lush green grass lawn. Foreground: gray stone sidewalk with brick pattern, dark asphalt road with yellow lane markings and white dashed center line. No buildings in the foreground. Horizontal panoramic view."
cp poster_0.jpg "$BG_DIR/street_residential.png" && echo "  OK"
sleep 5

echo "[2/11] street_commercial.png"
npx ts-node generate_poster.ts --aspect 16:9 \
  "Side-scrolling 2D game background, ${STYLE}. Business district street view. Blue sky with some clouds. In the distance: taller commercial buildings, office towers, shop awnings, Mediterranean architecture with stone facades. Middle ground: neatly trimmed green grass. Foreground: wide gray sidewalk with brick pattern, dark asphalt road with yellow edge lines and white dashed center markings. No buildings in the foreground. Horizontal panoramic view."
cp poster_0.jpg "$BG_DIR/street_commercial.png" && echo "  OK"
sleep 5

echo "[3/11] street_urban.png"
npx ts-node generate_poster.ts --aspect 16:9 \
  "Side-scrolling 2D game background, ${STYLE}. Downtown urban street view. Blue sky with wispy clouds. In the distance: busy city skyline with modern towers, skyscrapers, Tel Aviv style Mediterranean cityscape. Middle ground: green grass strip. Foreground: wide stone sidewalk, dark asphalt road with yellow edge lines and white dashed center lane markings. No buildings in the foreground. Horizontal panoramic view."
cp poster_0.jpg "$BG_DIR/street_urban.png" && echo "  OK"
sleep 5

echo "=== Generating 8 Building Sprites (1:1) ==="

echo "[4/11] building_home.png"
npx ts-node generate_poster.ts --aspect 1:1 \
  "Single cozy Mediterranean home building, front view, ${STYLE}. Beige terracotta Israeli house with red tile roof, wooden front door, flower boxes in windows, small balcony. White background. Game sprite asset, isolated building, no ground, no other objects."
cp poster_0.jpg "$BLD_DIR/building_home.png" && echo "  OK"
sleep 5

echo "[5/11] building_school.png"
npx ts-node generate_poster.ts --aspect 1:1 \
  "Single school building, front view, ${STYLE}. Red brick Israeli school with large windows, double entrance doors, clock above entrance. White background. Game sprite asset, isolated building, no ground, no other objects."
cp poster_0.jpg "$BLD_DIR/building_school.png" && echo "  OK"
sleep 5

echo "[6/11] building_bank.png"
npx ts-node generate_poster.ts --aspect 1:1 \
  "Single bank building, front view, ${STYLE}. Stone marble Israeli bank with classical columns at entrance, grand double doors, professional look. White background. Game sprite asset, isolated building, no ground, no other objects."
cp poster_0.jpg "$BLD_DIR/building_bank.png" && echo "  OK"
sleep 5

echo "[7/11] building_library.png"
npx ts-node generate_poster.ts --aspect 1:1 \
  "Single library building, front view, ${STYLE}. Brown warm stone Israeli library with arched windows, book symbol above entrance, wooden door, cozy scholarly look. White background. Game sprite asset, isolated building, no ground, no other objects."
cp poster_0.jpg "$BLD_DIR/building_library.png" && echo "  OK"
sleep 5

echo "[8/11] building_stock_exchange.png"
npx ts-node generate_poster.ts --aspect 1:1 \
  "Single stock exchange building, front view, ${STYLE}. Modern dark glass and steel building, stock ticker display above entrance, upward arrow symbols, professional financial building. White background. Game sprite asset, isolated building, no ground, no other objects."
cp poster_0.jpg "$BLD_DIR/building_stock_exchange.png" && echo "  OK"
sleep 5

echo "[9/11] building_hotel.png"
npx ts-node generate_poster.ts --aspect 1:1 \
  "Single luxury hotel building, front view, ${STYLE}. Grand purple gold Mediterranean hotel with ornate entrance, awning, stars above door, elegant facade. White background. Game sprite asset, isolated building, no ground, no other objects."
cp poster_0.jpg "$BLD_DIR/building_hotel.png" && echo "  OK"
sleep 5

echo "[10/11] building_synagogue.png"
npx ts-node generate_poster.ts --aspect 1:1 \
  "Single synagogue building, front view, ${STYLE}. Golden sandstone Israeli synagogue with Star of David above entrance, arched doorway, stained glass windows, dome roof, traditional Jewish architecture. White background. Game sprite asset, isolated building, no ground, no other objects."
cp poster_0.jpg "$BLD_DIR/building_synagogue.png" && echo "  OK"
sleep 5

echo "[11/11] building_computer_shop.png"
npx ts-node generate_poster.ts --aspect 1:1 \
  "Single computer shop building, front view, ${STYLE}. Gray modern tech store with neon accents, display windows showing computers and monitors, glass front door. White background. Game sprite asset, isolated building, no ground, no other objects."
cp poster_0.jpg "$BLD_DIR/building_computer_shop.png" && echo "  OK"

echo ""
echo "=== Done! Generated all 11 assets ==="
echo "Backgrounds: $BG_DIR/street_*.png"
echo "Buildings:   $BLD_DIR/building_*.png"
