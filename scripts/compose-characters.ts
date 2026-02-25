/**
 * Compose LPC Revised character spritesheets by layering:
 *   body + head + hair + shirt + pants + shoes
 *
 * Creates walk/idle spritesheets for each game character
 *
 * Usage: npx tsx scripts/compose-characters.ts
 */

import sharp from 'sharp';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LPC_DIR = path.join(
  __dirname, '..', 'temp-assets', 'lpc-revised',
  '[LPC Revised] Character Basics'
);
const OUT_DIR = path.join(__dirname, '..', 'public', 'assets', 'images', 'characters');

interface CharacterDef {
  name: string;
  gender: 'Masculine' | 'Feminine';
  skinTone: string;
  hair: string;      // e.g. "Short 02 - Parted"
  hairColor: string;
  shirt: string;     // e.g. "Shirt 04 - T-shirt"
  shirtColor: string;
  pants: string;     // e.g. "Pants 03 - Pants"
  pantsColor: string;
  shoes: string;     // e.g. "Shoes 01 - Shoes"
  shoesColor: string;
}

const CHARACTERS: CharacterDef[] = [
  // Player - Israeli teen boy with blue t-shirt
  {
    name: 'player',
    gender: 'Masculine',
    skinTone: 'Brown',
    hair: 'Short 04 - Cowlick',
    hairColor: 'Brown',
    shirt: 'Shirt 04 - T-shirt',
    shirtColor: 'Blue',
    pants: 'Pants 03 - Pants',
    pantsColor: 'Navy',
    shoes: 'Shoes 01 - Shoes',
    shoesColor: 'Brown',
  },
  // Dad - casual button-up shirt
  {
    name: 'npc_dad',
    gender: 'Masculine',
    skinTone: 'Brown',
    hair: 'Short 02 - Parted',
    hairColor: 'Brown',
    shirt: 'Shirt 01 - Longsleeve Shirt',
    shirtColor: 'Blue',
    pants: 'Pants 03 - Pants',
    pantsColor: 'Brown',
    shoes: 'Shoes 01 - Shoes',
    shoesColor: 'Brown',
  },
  // Mom - colorful blouse
  {
    name: 'npc_mom',
    gender: 'Feminine',
    skinTone: 'Bronze',
    hair: 'Medium 02 - Curly',
    hairColor: 'Brown',
    shirt: 'Shirt 04 - T-shirt',
    shirtColor: 'Red',
    pants: 'Pants 03 - Pants',
    pantsColor: 'Navy',
    shoes: 'Shoes 01 - Shoes',
    shoesColor: 'Brown',
  },
  // Teacher - formal white shirt
  {
    name: 'npc_teacher',
    gender: 'Masculine',
    skinTone: 'Tan',
    hair: 'Short 02 - Parted',
    hairColor: 'Brown',
    shirt: 'Shirt 01 - Longsleeve Shirt',
    shirtColor: 'White',
    pants: 'Pants 03 - Pants',
    pantsColor: 'Navy',
    shoes: 'Shoes 01 - Shoes',
    shoesColor: 'Brown',
  },
  // Banker - navy blazer
  {
    name: 'npc_banker',
    gender: 'Feminine',
    skinTone: 'Peach',
    hair: 'Medium 04 - Bangs & Bun',
    hairColor: 'Brown',
    shirt: 'Shirt 01 - Longsleeve Shirt',
    shirtColor: 'Navy',
    pants: 'Pants 03 - Pants',
    pantsColor: 'Navy',
    shoes: 'Shoes 01 - Shoes',
    shoesColor: 'Brown',
  },
  // Librarian - elderly, cardigan
  {
    name: 'npc_librarian',
    gender: 'Feminine',
    skinTone: 'Peach',
    hair: 'Medium 07 - Bob, Side Part',
    hairColor: 'Silver',
    shirt: 'Shirt 01 - Longsleeve Shirt',
    shirtColor: 'Green',
    pants: 'Pants 03 - Pants',
    pantsColor: 'Brown',
    shoes: 'Shoes 01 - Shoes',
    shoesColor: 'Brown',
  },
  // Shopkeeper - polo shirt
  {
    name: 'npc_shopkeeper',
    gender: 'Masculine',
    skinTone: 'Tan',
    hair: 'Short 03 - Curly',
    hairColor: 'Brown',
    shirt: 'Shirt 05 - V-neck T-shirt',
    shirtColor: 'Green',
    pants: 'Pants 03 - Pants',
    pantsColor: 'Navy',
    shoes: 'Shoes 01 - Shoes',
    shoesColor: 'Brown',
  },
  // Guru (Warren Buffett) - suit
  {
    name: 'npc_guru',
    gender: 'Masculine',
    skinTone: 'Peach',
    hair: 'Short 06 - Balding',
    hairColor: 'Silver',
    shirt: 'Shirt 01 - Longsleeve Shirt',
    shirtColor: 'White',
    pants: 'Pants 03 - Pants',
    pantsColor: 'Navy',
    shoes: 'Shoes 01 - Shoes',
    shoesColor: 'Brown',
  },
  // Receptionist - hotel uniform
  {
    name: 'npc_receptionist',
    gender: 'Feminine',
    skinTone: 'Brown',
    hair: 'Medium 01 - Page',
    hairColor: 'Brown',
    shirt: 'Shirt 01 - Longsleeve Shirt',
    shirtColor: 'Red',
    pants: 'Pants 03 - Pants',
    pantsColor: 'Navy',
    shoes: 'Shoes 01 - Shoes',
    shoesColor: 'Brown',
  },
  // Grandpa - kippah look (balding)
  {
    name: 'npc_grandpa',
    gender: 'Masculine',
    skinTone: 'Brown',
    hair: 'Short 06 - Balding',
    hairColor: 'Silver',
    shirt: 'Shirt 01 - Longsleeve Shirt',
    shirtColor: 'Red',
    pants: 'Pants 03 - Pants',
    pantsColor: 'Brown',
    shoes: 'Shoes 01 - Shoes',
    shoesColor: 'Brown',
  },
  // Grandma - floral dress (using blouse + pants)
  {
    name: 'npc_grandma',
    gender: 'Feminine',
    skinTone: 'Brown',
    hair: 'Medium 07 - Bob, Side Part',
    hairColor: 'Silver',
    shirt: 'Shirt 01 - Longsleeve Shirt',
    shirtColor: 'Lavender',
    pants: 'Pants 03 - Pants',
    pantsColor: 'Navy',
    shoes: 'Shoes 01 - Shoes',
    shoesColor: 'Brown',
  },
];

function resolveLayer(
  gender: string,
  category: string, // 'Body', 'Clothing', 'Hair'
  item: string,     // subfolder name
  color: string,    // color subfolder
  anim: string      // 'Walk', 'Idle', 'Run'
): string | null {
  const bodyType = `${gender}, Thin`;

  let basePath: string;
  if (category === 'Body') {
    basePath = path.join(LPC_DIR, 'Body', bodyType);
  } else if (category === 'Head') {
    const headNum = gender === 'Masculine' ? '02' : '01';
    basePath = path.join(LPC_DIR, 'Body', 'Adult Heads', `Head ${headNum} - ${gender}`);
  } else if (category === 'Hair') {
    basePath = path.join(LPC_DIR, 'Hair', item);
  } else {
    // Clothing items
    basePath = path.join(LPC_DIR, 'Clothing', bodyType, item);
  }

  // Try colored variant first
  const coloredPath = path.join(basePath, color, `${anim}.png`);
  if (fs.existsSync(coloredPath)) return coloredPath;

  // Try base (uncolored) version
  const basePng = path.join(basePath, `${anim}.png`);
  if (fs.existsSync(basePng)) return basePng;

  return null;
}

async function compositeCharacter(char: CharacterDef, anim: string): Promise<boolean> {
  const outPath = path.join(OUT_DIR, `${char.name}_${anim.toLowerCase()}.png`);

  // Skip if exists and valid
  if (fs.existsSync(outPath)) {
    const stats = fs.statSync(outPath);
    if (stats.size > 5000) {
      console.log(`  SKIP (exists): ${char.name}_${anim.toLowerCase()}.png`);
      return true;
    }
  }

  // Resolve all layers
  const layers: string[] = [];

  // 1. Body (base)
  const body = resolveLayer(char.gender, 'Body', '', char.skinTone, anim);
  if (!body) {
    console.error(`  Body not found: ${char.gender}/${char.skinTone}/${anim}`);
    return false;
  }
  layers.push(body);

  // 2. Head
  const head = resolveLayer(char.gender, 'Head', '', char.skinTone, anim);
  if (head) layers.push(head);

  // 3. Shoes (under pants)
  const shoes = resolveLayer(char.gender, 'Clothing', char.shoes, char.shoesColor, anim);
  if (shoes) layers.push(shoes);

  // 4. Pants
  const pants = resolveLayer(char.gender, 'Clothing', char.pants, char.pantsColor, anim);
  if (pants) layers.push(pants);

  // 5. Shirt
  const shirt = resolveLayer(char.gender, 'Clothing', char.shirt, char.shirtColor, anim);
  if (shirt) layers.push(shirt);

  // 6. Hair (on top)
  const hair = resolveLayer(char.gender, 'Hair', char.hair, char.hairColor, anim);
  if (hair) layers.push(hair);

  if (layers.length < 2) {
    console.error(`  Not enough layers for ${char.name} (only ${layers.length})`);
    return false;
  }

  console.log(`  Compositing ${layers.length} layers for ${char.name}_${anim.toLowerCase()}`);

  try {
    // Start with body as base
    let result = sharp(layers[0]);

    // Overlay remaining layers
    const composites = layers.slice(1).map(layerPath => ({
      input: layerPath,
      blend: 'over' as const,
    }));

    const buffer = await result.composite(composites).png().toBuffer();
    fs.writeFileSync(outPath, buffer);

    const meta = await sharp(buffer).metadata();
    console.log(`  SUCCESS: ${char.name}_${anim.toLowerCase()}.png (${meta.width}x${meta.height}, ${(buffer.length / 1024).toFixed(1)}KB)`);
    return true;
  } catch (err: any) {
    console.error(`  ERROR compositing ${char.name}: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log('=== LPC Revised Character Composer ===');
  console.log(`Source: ${LPC_DIR}`);
  console.log(`Output: ${OUT_DIR}\n`);

  fs.mkdirSync(OUT_DIR, { recursive: true });

  // Remove old composites from v1
  const oldFiles = fs.readdirSync(OUT_DIR).filter(f => f.endsWith('_idle.png') || f.endsWith('_run.png') || f.endsWith('_walk.png'));
  for (const f of oldFiles) {
    fs.unlinkSync(path.join(OUT_DIR, f));
  }
  console.log(`Cleaned ${oldFiles.length} old files\n`);

  const animations = ['Walk', 'Idle', 'Run'];
  let success = 0;
  let failed = 0;

  for (const char of CHARACTERS) {
    console.log(`\nBuilding: ${char.name}`);
    for (const anim of animations) {
      const ok = await compositeCharacter(char, anim);
      if (ok) success++;
      else failed++;
    }
  }

  console.log(`\n=== Done! ${success} sheets created, ${failed} failed ===`);
  console.log(`Output: ${OUT_DIR}`);
}

main().catch(console.error);
