/**
 * DALL-E 3 Asset Generator for "The Young Investor" game
 * Generates Overcooked 2 style game assets
 *
 * Usage: npx tsx scripts/generate-assets.ts [--only backgrounds|characters|ui] [--start N]
 */

import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import * as https from 'https';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets', 'images');

// Style constants for consistency across all prompts
const STYLE_BASE = `Overcooked 2 game art style: vibrant colorful 2D cartoon, thick black outlines, cel-shaded, warm lighting, highly polished game art. Top-down 3/4 isometric perspective. Clean vector-like illustration, no photorealism. Suitable for a children's educational investment game set in Israel.`;

const STYLE_BG = `${STYLE_BASE} Wide panoramic scene, 1792x1024 resolution ratio. No text, no UI elements, no characters.`;

const STYLE_CHAR = `${STYLE_BASE} Single character on a plain solid-color background (#00FF00 green screen). Full body visible, facing camera at 3/4 angle. Chibi proportions (large head, small body). Clear thick outlines for easy game sprite extraction.`;

interface AssetJob {
  category: 'backgrounds' | 'characters' | 'ui' | 'objects';
  filename: string;
  prompt: string;
  size: '1792x1024' | '1024x1024' | '1024x1792';
}

const ASSET_JOBS: AssetJob[] = [
  // ============== BACKGROUNDS ==============
  {
    category: 'backgrounds',
    filename: 'street_day.png',
    size: '1792x1024',
    prompt: `${STYLE_BG} A cheerful Israeli city street during daytime. Wide road with sidewalks on both sides, colorful apartment buildings with balconies (typical Israeli architecture - white/beige buildings with solar water heaters on roofs), small shops with awnings, palm trees and Mediterranean plants, bright blue sky with fluffy clouds. Warm Middle Eastern sunlight. The street extends into the distance with slight perspective.`,
  },
  {
    category: 'backgrounds',
    filename: 'living_room.png',
    size: '1792x1024',
    prompt: `${STYLE_BG} A cozy Israeli family living room interior, top-down 3/4 view. Comfortable sofa, coffee table with snacks, bookshelf, family photos on walls, a menorah on a shelf, warm lighting from ceiling lamp, tiled floor (typical Israeli style), window showing sunny sky outside, TV on a stand, colorful rug. Warm homey atmosphere.`,
  },
  {
    category: 'backgrounds',
    filename: 'bedroom.png',
    size: '1792x1024',
    prompt: `${STYLE_BG} A teenager's bedroom in Israel, top-down 3/4 view. Single bed with colorful bedspread, desk with computer monitor and keyboard, posters on walls (space/science themes), bookshelf with schoolbooks, window with curtains showing sunny day, backpack on floor, tiled floor, ceiling fan. Cozy and lived-in feel.`,
  },
  {
    category: 'backgrounds',
    filename: 'school_classroom.png',
    size: '1792x1024',
    prompt: `${STYLE_BG} An Israeli school classroom interior, top-down 3/4 view. Rows of desks and chairs, large whiteboard/chalkboard at front with math formulas, teacher's desk, windows showing playground outside, educational posters on walls about economics and math, ceiling fans, tiled floor, backpacks hanging on chairs. Bright and educational atmosphere.`,
  },
  {
    category: 'backgrounds',
    filename: 'bank_interior.png',
    size: '1792x1024',
    prompt: `${STYLE_BG} A friendly cartoon bank interior, top-down 3/4 view. Service counter with glass partition, waiting area with chairs, ATM machine, potted plants, marble-like floor, professional but welcoming decor, stock market display screen on wall showing graphs, safe/vault door visible in back, ceiling lights. Clean and modern Israeli bank branch.`,
  },
  {
    category: 'backgrounds',
    filename: 'library.png',
    size: '1792x1024',
    prompt: `${STYLE_BG} A cozy library interior, top-down 3/4 view. Tall wooden bookshelves filled with colorful books, reading tables with desk lamps, comfortable armchairs, newspaper rack with financial newspapers, large windows with sunlight streaming in, globe on a table, carpet area, potted plants. Warm scholarly atmosphere.`,
  },
  {
    category: 'backgrounds',
    filename: 'hotel_lobby.png',
    size: '1792x1024',
    prompt: `${STYLE_BG} A fancy hotel lobby interior, top-down 3/4 view. Grand reception desk, elegant chandelier, marble floor with ornate patterns, comfortable lounge chairs, elevator doors, potted palm trees, luggage cart, bell hop station, golden accents. Upscale but cartoon-friendly style.`,
  },
  {
    category: 'backgrounds',
    filename: 'hotel_room.png',
    size: '1792x1024',
    prompt: `${STYLE_BG} A hotel corridor with numbered doors on both sides, top-down 3/4 view. Carpeted hallway, wall sconces, one door slightly ajar with warm light coming from inside, room number plates on doors, a small table with flower vase, elegant wallpaper. Long perspective corridor.`,
  },
  {
    category: 'backgrounds',
    filename: 'guru_room.png',
    size: '1792x1024',
    prompt: `${STYLE_BG} A luxurious penthouse study/office, top-down 3/4 view. Large mahogany desk with financial newspapers, leather chair, floor-to-ceiling windows with city skyline view, bookshelves with business books, stock ticker display, globe, chess set, expensive rug, awards/certificates on wall. Warren Buffett-inspired successful investor's room.`,
  },
  {
    category: 'backgrounds',
    filename: 'computer_shop.png',
    size: '1792x1024',
    prompt: `${STYLE_BG} A small electronics/computer shop interior, top-down 3/4 view. Display shelves with laptops and monitors, counter with cash register, cables and accessories on wall hooks, promotional posters, bright fluorescent lighting, tiled floor, shopping bags, price tags visible. Israeli small shop vibe.`,
  },
  {
    category: 'backgrounds',
    filename: 'synagogue.png',
    size: '1792x1024',
    prompt: `${STYLE_BG} A festive synagogue interior decorated for a Bar Mitzvah celebration, top-down 3/4 view. Colorful streamers and balloons, tables with food platters and cake, Torah ark (aron kodesh) in the background, stained glass windows, confetti on floor, gift table, festive lighting. Joyful celebration atmosphere.`,
  },
  {
    category: 'backgrounds',
    filename: 'trading_floor.png',
    size: '1792x1024',
    prompt: `${STYLE_BG} A cartoon stock trading room/office, top-down 3/4 view. Multiple monitors showing colorful stock charts and graphs (green up arrows, red down arrows), desk with keyboard and mouse, ticker tape display, financial newspaper on desk, whiteboard with stock analysis, modern office chair, coffee mug. Exciting financial atmosphere.`,
  },
  {
    category: 'backgrounds',
    filename: 'space_bg.png',
    size: '1792x1024',
    prompt: `${STYLE_BG} Deep space background for an asteroids mini-game. Dark blue-purple space with colorful nebulae, twinkling stars of various sizes, distant galaxies, a few colorful planets visible. Dreamy and vibrant cartoon space scene, not realistic. Game-ready background.`,
  },

  // ============== CHARACTERS ==============
  {
    category: 'characters',
    filename: 'player_idle.png',
    size: '1024x1024',
    prompt: `${STYLE_CHAR} A 13-year-old Israeli boy, the main character of an investment game. Short dark brown hair, friendly smile, wearing a blue t-shirt with a small Star of David necklace, jeans, and sneakers. Chibi proportions with large expressive eyes. Standing in a neutral idle pose, hands at sides. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_dad.png',
    size: '1024x1024',
    prompt: `${STYLE_CHAR} A friendly Israeli father in his 40s. Short dark hair with slight gray at temples, warm smile, wearing a casual button-up shirt (light blue) and khaki pants. Chibi proportions, large head. Standing pose. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_mom.png',
    size: '1024x1024',
    prompt: `${STYLE_CHAR} A warm Israeli mother in her 40s. Dark curly hair, kind smile, wearing a colorful blouse and comfortable pants. Chibi proportions, large head. Standing pose with one hand slightly raised as if talking. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_teacher.png',
    size: '1024x1024',
    prompt: `${STYLE_CHAR} A friendly Israeli male teacher/professor. Glasses, neat dark hair, wearing a formal white button-up shirt with rolled sleeves and dark pants. Holding a pointer or book. Chibi proportions, scholarly appearance. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_banker.png',
    size: '1024x1024',
    prompt: `${STYLE_CHAR} A professional bank teller. Woman in her 30s, neat hair in a bun, wearing a formal navy blazer and white blouse, name tag. Friendly professional smile. Chibi proportions. Standing behind implied counter. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_librarian.png',
    size: '1024x1024',
    prompt: `${STYLE_CHAR} A wise elderly librarian. Older woman with gray hair, reading glasses on chain, wearing a cardigan sweater over a blouse, holding a book. Chibi proportions, kind grandmotherly face. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_shopkeeper.png',
    size: '1024x1024',
    prompt: `${STYLE_CHAR} A tech-savvy computer shop owner. Middle-aged man with a beard, wearing a polo shirt with a shop logo, holding a tablet. Enthusiastic expression. Chibi proportions. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_guru.png',
    size: '1024x1024',
    prompt: `${STYLE_CHAR} A wise elderly investment guru character inspired by Warren Buffett. Elderly man with white hair, round glasses, wearing a nice dark suit with tie, holding a financial newspaper. Warm grandfatherly smile, wise expression. Chibi proportions. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_receptionist.png',
    size: '1024x1024',
    prompt: `${STYLE_CHAR} A hotel receptionist. Young woman with neat hair, wearing a formal hotel uniform (burgundy blazer), standing at attention with professional smile. Chibi proportions. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_grandpa.png',
    size: '1024x1024',
    prompt: `${STYLE_CHAR} A loving Israeli grandfather. Elderly man with white hair and mustache, wearing a kippah (yarmulke), plaid shirt, and comfortable pants. Warm smile, slightly hunched posture. Chibi proportions. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_grandma.png',
    size: '1024x1024',
    prompt: `${STYLE_CHAR} A loving Israeli grandmother. Elderly woman with white hair in a bun, wearing a floral dress and apron, holding a plate of cookies. Warm grandmotherly smile. Chibi proportions. On solid bright green (#00FF00) background.`,
  },

  // ============== UI ELEMENTS ==============
  {
    category: 'ui',
    filename: 'stock_icons.png',
    size: '1024x1024',
    prompt: `${STYLE_BASE} Four company logo icons arranged in a 2x2 grid on white background, each in its own quadrant with clear separation. Top-left: "Solar" - a bright orange sun with solar panel rays. Top-right: "Koogle" - a colorful search magnifying glass (Google-parody). Bottom-left: "Sesla" - a sleek electric car silhouette (Tesla-parody). Bottom-right: "Lemon" - a bitten lemon fruit (Apple-parody). Each icon is clean, simple, iconic, with thick outlines. Game UI icon style.`,
  },
  {
    category: 'ui',
    filename: 'coin.png',
    size: '1024x1024',
    prompt: `${STYLE_BASE} A single golden coin with the Israeli Shekel symbol (₪) on it, front-facing. Shiny metallic gold with slight cartoon shadow. Thick black outline. Simple clean design suitable for a game currency icon. On transparent/white background. Large and centered.`,
  },

  // ============== OBJECTS ==============
  {
    category: 'objects',
    filename: 'asteroid_large.png',
    size: '1024x1024',
    prompt: `${STYLE_BASE} A single large cartoon asteroid/space rock. Gray-brown rocky texture with craters, slight glow around edges, thick outlines. Floating in space feeling. Simple clean game sprite style. On solid black background. Centered, filling most of the frame.`,
  },
  {
    category: 'objects',
    filename: 'spaceship.png',
    size: '1024x1024',
    prompt: `${STYLE_BASE} A small cute cartoon spaceship, top-down view. Triangular/arrow shape pointing upward, blue and white colors (Israeli flag colors), small engine flames at the bottom, cockpit window visible. Thick outlines, clean game sprite. On solid bright green (#00FF00) background. Centered.`,
  },
  {
    category: 'objects',
    filename: 'newspaper.png',
    size: '1024x1024',
    prompt: `${STYLE_BASE} A cartoon financial newspaper front page. Folded newspaper with visible headline area, stock chart graphs visible, columns of text (illegible squiggles), "Financial Times" style masthead area. Paper-colored with slight fold shadows. Thick outlines. On white background.`,
  },
];

// Download image from URL to file
function downloadImage(url: string, filepath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(filepath);
    https.get(url, (response) => {
      response.pipe(file);
      file.on('finish', () => {
        file.close();
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filepath, () => {}); // cleanup
      reject(err);
    });
  });
}

// Delay helper
function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateAsset(job: AssetJob, index: number, total: number): Promise<boolean> {
  const outDir = path.join(ASSETS_DIR, job.category);
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, job.filename);

  // Skip if already exists
  if (fs.existsSync(outPath)) {
    const stats = fs.statSync(outPath);
    if (stats.size > 10000) { // > 10KB means it's a real image, not a placeholder
      console.log(`[${index + 1}/${total}] SKIP (exists): ${job.category}/${job.filename}`);
      return true;
    }
  }

  console.log(`[${index + 1}/${total}] Generating: ${job.category}/${job.filename}...`);

  try {
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt: job.prompt,
      n: 1,
      size: job.size,
      quality: 'hd',
      response_format: 'url',
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) {
      console.error(`  ERROR: No URL returned for ${job.filename}`);
      return false;
    }

    // Also save the revised prompt for reference
    const revisedPrompt = response.data[0]?.revised_prompt;
    if (revisedPrompt) {
      const metaPath = path.join(outDir, job.filename.replace('.png', '.meta.json'));
      fs.writeFileSync(metaPath, JSON.stringify({
        originalPrompt: job.prompt,
        revisedPrompt,
        generatedAt: new Date().toISOString(),
        size: job.size,
      }, null, 2));
    }

    await downloadImage(imageUrl, outPath);
    console.log(`  SUCCESS: ${job.category}/${job.filename}`);
    return true;
  } catch (err: any) {
    if (err?.status === 429) {
      console.error(`  RATE LIMITED - waiting 60s before retry...`);
      await sleep(60000);
      // Retry once
      try {
        const response = await openai.images.generate({
          model: 'dall-e-3',
          prompt: job.prompt,
          n: 1,
          size: job.size,
          quality: 'hd',
          response_format: 'url',
        });
        const imageUrl = response.data[0]?.url;
        if (imageUrl) {
          await downloadImage(imageUrl, outPath);
          console.log(`  SUCCESS (retry): ${job.category}/${job.filename}`);
          return true;
        }
      } catch (retryErr: any) {
        console.error(`  FAILED after retry: ${retryErr?.message || retryErr}`);
        return false;
      }
    }
    console.error(`  ERROR: ${err?.message || err}`);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);

  // Parse --only flag
  let filterCategory: string | null = null;
  const onlyIdx = args.indexOf('--only');
  if (onlyIdx !== -1 && args[onlyIdx + 1]) {
    filterCategory = args[onlyIdx + 1];
  }

  // Parse --start flag (1-indexed)
  let startIdx = 0;
  const startFlagIdx = args.indexOf('--start');
  if (startFlagIdx !== -1 && args[startFlagIdx + 1]) {
    startIdx = parseInt(args[startFlagIdx + 1], 10) - 1;
  }

  let jobs = ASSET_JOBS;
  if (filterCategory) {
    jobs = jobs.filter(j => j.category === filterCategory);
  }

  if (startIdx > 0) {
    jobs = jobs.slice(startIdx);
  }

  console.log(`\n========================================`);
  console.log(`  The Young Investor - Asset Generator`);
  console.log(`  ${jobs.length} assets to generate`);
  console.log(`  DALL-E 3 HD quality`);
  console.log(`========================================\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < jobs.length; i++) {
    const ok = await generateAsset(jobs[i], i, jobs.length);
    if (ok) success++;
    else failed++;

    // Rate limit: ~15 seconds between requests to stay safe (DALL-E 3 allows ~5/min)
    if (i < jobs.length - 1) {
      console.log(`  Waiting 15s before next request...`);
      await sleep(15000);
    }
  }

  console.log(`\n========================================`);
  console.log(`  Done! ${success} succeeded, ${failed} failed`);
  console.log(`========================================\n`);
}

main().catch(console.error);
