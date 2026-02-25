/**
 * Gemini Asset Generator for "The Young Investor" game
 * Generates Overcooked 2 style game assets using Google Gemini
 *
 * Usage: npx tsx scripts/generate-assets-gemini.ts [--only backgrounds|characters|ui|objects] [--start N] [--single N]
 */

import { GoogleGenAI, createUserContent } from '@google/genai';
import mime from 'mime';
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env from project root
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Also try the nano-banana-poster .env as fallback
if (!process.env.GEMINI_API_KEY) {
  dotenv.config({ path: 'C:\\Users\\shlom\\.claude\\skills\\nano-banana-poster\\scripts\\.env' });
}

if (!process.env.GEMINI_API_KEY) {
  console.error('ERROR: GEMINI_API_KEY not found. Set it in .env');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const ASSETS_DIR = path.join(__dirname, '..', 'public', 'assets', 'images');

// Style constants
const STYLE_BASE = `Overcooked 2 game art style: vibrant colorful 2D cartoon, thick black outlines, cel-shaded, warm lighting, highly polished game art. Top-down 3/4 isometric perspective. Clean vector-like illustration, no photorealism. Suitable for a children's educational investment game set in Israel.`;

const STYLE_BG = `${STYLE_BASE} Wide panoramic scene. No text, no UI elements, no characters visible.`;

const STYLE_CHAR = `${STYLE_BASE} Single character on a plain solid bright green (#00FF00) background for easy extraction. Full body visible, facing camera at 3/4 angle. Chibi proportions (large head, small body). Clear thick outlines.`;

interface AssetJob {
  category: 'backgrounds' | 'characters' | 'ui' | 'objects';
  filename: string;
  prompt: string;
  aspectRatio: string;
}

const ASSET_JOBS: AssetJob[] = [
  // ============== BACKGROUNDS ==============
  {
    category: 'backgrounds',
    filename: 'street_day.png',
    aspectRatio: '16:9',
    prompt: `${STYLE_BG} A cheerful Israeli city street during daytime. Wide road with sidewalks on both sides, colorful apartment buildings with balconies (typical Israeli architecture - white/beige buildings with solar water heaters on roofs), small shops with awnings, palm trees and Mediterranean plants, bright blue sky with fluffy clouds. Warm Middle Eastern sunlight. The street extends into the distance with slight perspective.`,
  },
  {
    category: 'backgrounds',
    filename: 'living_room.png',
    aspectRatio: '16:9',
    prompt: `${STYLE_BG} A cozy Israeli family living room interior, top-down 3/4 view. Comfortable sofa, coffee table with snacks, bookshelf, family photos on walls, a menorah on a shelf, warm lighting from ceiling lamp, tiled floor (typical Israeli style), window showing sunny sky outside, TV on a stand, colorful rug. Warm homey atmosphere.`,
  },
  {
    category: 'backgrounds',
    filename: 'bedroom.png',
    aspectRatio: '16:9',
    prompt: `${STYLE_BG} A teenager's bedroom in Israel, top-down 3/4 view. Single bed with colorful bedspread, desk with computer monitor and keyboard, posters on walls (space/science themes), bookshelf with schoolbooks, window with curtains showing sunny day, backpack on floor, tiled floor, ceiling fan. Cozy and lived-in feel.`,
  },
  {
    category: 'backgrounds',
    filename: 'school_classroom.png',
    aspectRatio: '16:9',
    prompt: `${STYLE_BG} An Israeli school classroom interior, top-down 3/4 view. Rows of desks and chairs, large whiteboard at front, teacher's desk, windows showing playground outside, educational posters on walls, ceiling fans, tiled floor, backpacks hanging on chairs. Bright and educational atmosphere.`,
  },
  {
    category: 'backgrounds',
    filename: 'bank_interior.png',
    aspectRatio: '16:9',
    prompt: `${STYLE_BG} A friendly cartoon bank interior, top-down 3/4 view. Service counter with glass partition, waiting area with chairs, ATM machine, potted plants, marble-like floor, professional but welcoming decor, stock market display screen on wall showing graphs, safe/vault door visible in back, ceiling lights. Clean and modern.`,
  },
  {
    category: 'backgrounds',
    filename: 'library.png',
    aspectRatio: '16:9',
    prompt: `${STYLE_BG} A cozy library interior, top-down 3/4 view. Tall wooden bookshelves filled with colorful books, reading tables with desk lamps, comfortable armchairs, newspaper rack, large windows with sunlight streaming in, globe on a table, carpet area, potted plants. Warm scholarly atmosphere.`,
  },
  {
    category: 'backgrounds',
    filename: 'hotel_lobby.png',
    aspectRatio: '16:9',
    prompt: `${STYLE_BG} A fancy hotel lobby interior, top-down 3/4 view. Grand reception desk, elegant chandelier, marble floor with ornate patterns, comfortable lounge chairs, elevator doors, potted palm trees, luggage cart, golden accents. Upscale but cartoon-friendly style.`,
  },
  {
    category: 'backgrounds',
    filename: 'hotel_room.png',
    aspectRatio: '16:9',
    prompt: `${STYLE_BG} A hotel corridor with numbered doors on both sides, top-down 3/4 view. Carpeted hallway, wall sconces, one door slightly ajar with warm light, room number plates on doors, small table with flower vase, elegant wallpaper. Long perspective corridor.`,
  },
  {
    category: 'backgrounds',
    filename: 'guru_room.png',
    aspectRatio: '16:9',
    prompt: `${STYLE_BG} A luxurious penthouse study/office, top-down 3/4 view. Large mahogany desk with financial newspapers, leather chair, floor-to-ceiling windows with city skyline view, bookshelves with business books, globe, chess set, expensive rug, awards on wall. Successful investor's room.`,
  },
  {
    category: 'backgrounds',
    filename: 'computer_shop.png',
    aspectRatio: '16:9',
    prompt: `${STYLE_BG} A small electronics/computer shop interior, top-down 3/4 view. Display shelves with laptops and monitors, counter with cash register, cables and accessories on wall hooks, promotional posters, bright fluorescent lighting, tiled floor. Israeli small shop vibe.`,
  },
  {
    category: 'backgrounds',
    filename: 'synagogue.png',
    aspectRatio: '16:9',
    prompt: `${STYLE_BG} A festive synagogue interior decorated for a Bar Mitzvah celebration, top-down 3/4 view. Colorful streamers and balloons, tables with food and cake, Torah ark in the background, stained glass windows, confetti on floor, gift table, festive lighting. Joyful celebration atmosphere.`,
  },
  {
    category: 'backgrounds',
    filename: 'trading_floor.png',
    aspectRatio: '16:9',
    prompt: `${STYLE_BG} A cartoon stock trading room/office, top-down 3/4 view. Multiple monitors showing colorful stock charts and graphs (green up arrows, red down arrows), desk with keyboard and mouse, ticker tape display, whiteboard with stock analysis, modern office chair, coffee mug. Exciting financial atmosphere.`,
  },
  {
    category: 'backgrounds',
    filename: 'space_bg.png',
    aspectRatio: '16:9',
    prompt: `${STYLE_BG} Deep space background for an asteroids mini-game. Dark blue-purple space with colorful nebulae, twinkling stars of various sizes, distant galaxies, a few colorful planets visible. Dreamy and vibrant cartoon space scene, not realistic. Game-ready background.`,
  },

  // ============== CHARACTERS ==============
  {
    category: 'characters',
    filename: 'player_idle.png',
    aspectRatio: '1:1',
    prompt: `${STYLE_CHAR} A 13-year-old Israeli boy, the main character of an investment game. Short dark brown hair, friendly smile, wearing a blue t-shirt with a small Star of David necklace, jeans, and sneakers. Chibi proportions with large expressive eyes. Standing in a neutral idle pose, hands at sides. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_dad.png',
    aspectRatio: '1:1',
    prompt: `${STYLE_CHAR} A friendly Israeli father in his 40s. Short dark hair with slight gray at temples, warm smile, wearing a casual button-up shirt (light blue) and khaki pants. Chibi proportions, large head. Standing pose. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_mom.png',
    aspectRatio: '1:1',
    prompt: `${STYLE_CHAR} A warm Israeli mother in her 40s. Dark curly hair, kind smile, wearing a colorful blouse and comfortable pants. Chibi proportions, large head. Standing pose with one hand slightly raised as if talking. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_teacher.png',
    aspectRatio: '1:1',
    prompt: `${STYLE_CHAR} A friendly Israeli male teacher/professor. Glasses, neat dark hair, wearing a formal white button-up shirt with rolled sleeves and dark pants. Holding a pointer or book. Chibi proportions, scholarly appearance. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_banker.png',
    aspectRatio: '1:1',
    prompt: `${STYLE_CHAR} A professional bank teller. Woman in her 30s, neat hair in a bun, wearing a formal navy blazer and white blouse, name tag. Friendly professional smile. Chibi proportions. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_librarian.png',
    aspectRatio: '1:1',
    prompt: `${STYLE_CHAR} A wise elderly librarian. Older woman with gray hair, reading glasses on chain, wearing a cardigan sweater over a blouse, holding a book. Chibi proportions, kind grandmotherly face. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_shopkeeper.png',
    aspectRatio: '1:1',
    prompt: `${STYLE_CHAR} A tech-savvy computer shop owner. Middle-aged man with a beard, wearing a polo shirt, holding a tablet. Enthusiastic expression. Chibi proportions. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_guru.png',
    aspectRatio: '1:1',
    prompt: `${STYLE_CHAR} A wise elderly investment guru character inspired by Warren Buffett. Elderly man with white hair, round glasses, wearing a nice dark suit with tie, holding a financial newspaper. Warm grandfatherly smile, wise expression. Chibi proportions. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_receptionist.png',
    aspectRatio: '1:1',
    prompt: `${STYLE_CHAR} A hotel receptionist. Young woman with neat hair, wearing a formal hotel uniform (burgundy blazer), standing at attention with professional smile. Chibi proportions. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_grandpa.png',
    aspectRatio: '1:1',
    prompt: `${STYLE_CHAR} A loving Israeli grandfather. Elderly man with white hair and mustache, wearing a kippah (yarmulke), plaid shirt, and comfortable pants. Warm smile, slightly hunched posture. Chibi proportions. On solid bright green (#00FF00) background.`,
  },
  {
    category: 'characters',
    filename: 'npc_grandma.png',
    aspectRatio: '1:1',
    prompt: `${STYLE_CHAR} A loving Israeli grandmother. Elderly woman with white hair in a bun, wearing a floral dress and apron, holding a plate of cookies. Warm grandmotherly smile. Chibi proportions. On solid bright green (#00FF00) background.`,
  },

  // ============== UI ELEMENTS ==============
  {
    category: 'ui',
    filename: 'stock_icons.png',
    aspectRatio: '1:1',
    prompt: `${STYLE_BASE} Four company logo icons arranged in a 2x2 grid on white background, each in its own quadrant with clear separation. Top-left: "Solar" - a bright orange sun with solar panel rays. Top-right: "Koogle" - a colorful search magnifying glass. Bottom-left: "Sesla" - a sleek electric car silhouette. Bottom-right: "Lemon" - a bitten lemon fruit. Each icon is clean, simple, iconic, with thick outlines. Game UI icon style.`,
  },
  {
    category: 'ui',
    filename: 'coin.png',
    aspectRatio: '1:1',
    prompt: `${STYLE_BASE} A single golden coin with the Israeli Shekel symbol on it, front-facing. Shiny metallic gold with slight cartoon shadow. Thick black outline. Simple clean design suitable for a game currency icon. On white background. Large and centered.`,
  },

  // ============== OBJECTS ==============
  {
    category: 'objects',
    filename: 'asteroid_large.png',
    aspectRatio: '1:1',
    prompt: `${STYLE_BASE} A single large cartoon asteroid/space rock. Gray-brown rocky texture with craters, slight glow around edges, thick outlines. Floating in space feeling. Simple clean game sprite style. On solid black background. Centered, filling most of the frame.`,
  },
  {
    category: 'objects',
    filename: 'spaceship.png',
    aspectRatio: '1:1',
    prompt: `${STYLE_BASE} A small cute cartoon spaceship, top-down view. Triangular/arrow shape pointing upward, blue and white colors (Israeli flag colors), small engine flames at the bottom, cockpit window visible. Thick outlines, clean game sprite. On solid bright green (#00FF00) background. Centered.`,
  },
  {
    category: 'objects',
    filename: 'newspaper.png',
    aspectRatio: '1:1',
    prompt: `${STYLE_BASE} A cartoon financial newspaper front page. Folded newspaper with visible headline area, stock chart graphs visible, columns of squiggly text, masthead area at top. Paper-colored with slight fold shadows. Thick outlines. On white background.`,
  },
];

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function generateAsset(job: AssetJob, index: number, total: number): Promise<boolean> {
  const outDir = path.join(ASSETS_DIR, job.category);
  fs.mkdirSync(outDir, { recursive: true });

  const outPath = path.join(outDir, job.filename);

  // Skip if already exists and is a real image (> 10KB)
  if (fs.existsSync(outPath)) {
    const stats = fs.statSync(outPath);
    if (stats.size > 10000) {
      console.log(`[${index + 1}/${total}] SKIP (exists): ${job.category}/${job.filename}`);
      return true;
    }
  }

  console.log(`[${index + 1}/${total}] Generating: ${job.category}/${job.filename}...`);

  try {
    // Use streaming like the working nano-banana-poster script
    const response = await ai.models.generateContentStream({
      model: 'gemini-2.5-flash-image',
      config: {
        responseModalities: ['IMAGE', 'TEXT'],
        imageConfig: {
          aspectRatio: job.aspectRatio,
          imageSize: '1K',
        },
      },
      contents: createUserContent([job.prompt]),
    });

    let gotImage = false;
    for await (const chunk of response) {
      const parts = chunk.candidates?.[0]?.content?.parts;
      if (!parts) continue;

      for (const part of parts) {
        if (part.inlineData) {
          const buffer = Buffer.from(part.inlineData.data || '', 'base64');
          const ext = mime.getExtension(part.inlineData.mimeType || 'image/png') || 'png';

          // Save as the target filename
          const finalPath = outPath.endsWith('.png') && ext !== 'png'
            ? outPath.replace('.png', `.${ext}`)
            : outPath;

          fs.writeFileSync(finalPath, buffer);

          // Save metadata
          const metaPath = outPath.replace('.png', '.meta.json');
          fs.writeFileSync(metaPath, JSON.stringify({
            prompt: job.prompt,
            aspectRatio: job.aspectRatio,
            generatedAt: new Date().toISOString(),
            model: 'gemini-3-pro-image-preview',
            fileSize: buffer.length,
            mimeType: part.inlineData.mimeType,
          }, null, 2));

          console.log(`  SUCCESS: ${job.category}/${job.filename} (${(buffer.length / 1024).toFixed(1)}KB)`);
          gotImage = true;
        } else if (part.text) {
          console.log(`  Text: ${part.text.substring(0, 200)}`);
        }
      }
    }

    if (!gotImage) {
      console.error(`  ERROR: No image data in response for ${job.filename}`);
      return false;
    }
    return true;
  } catch (err: any) {
    const msg = err?.message || String(err);
    if (msg.includes('429') || msg.includes('quota') || msg.includes('RESOURCE_EXHAUSTED')) {
      console.error(`  RATE LIMITED - waiting 60s before retry...`);
      await sleep(60000);
      try {
        const retryResponse = await ai.models.generateContentStream({
          model: 'gemini-3-pro-image-preview',
          config: {
            responseModalities: ['IMAGE', 'TEXT'],
            imageConfig: {
              aspectRatio: job.aspectRatio,
              imageSize: '1K',
            },
          },
          contents: createUserContent([job.prompt]),
        });

        for await (const chunk of retryResponse) {
          const parts = chunk.candidates?.[0]?.content?.parts;
          if (parts) {
            for (const part of parts) {
              if (part.inlineData) {
                const buffer = Buffer.from(part.inlineData.data || '', 'base64');
                fs.writeFileSync(outPath, buffer);
                console.log(`  SUCCESS (retry): ${job.category}/${job.filename}`);
                return true;
              }
            }
          }
        }
      } catch (retryErr: any) {
        console.error(`  FAILED after retry: ${retryErr?.message || retryErr}`);
      }
      return false;
    }
    console.error(`  ERROR: ${msg}`);
    return false;
  }
}

async function main() {
  const args = process.argv.slice(2);

  // Parse flags
  let filterCategory: string | null = null;
  let startIdx = 0;
  let singleIdx = -1;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--only' && args[i + 1]) {
      filterCategory = args[++i];
    } else if (args[i] === '--start' && args[i + 1]) {
      startIdx = parseInt(args[++i], 10) - 1;
    } else if (args[i] === '--single' && args[i + 1]) {
      singleIdx = parseInt(args[++i], 10) - 1;
    }
  }

  let jobs = [...ASSET_JOBS];
  if (filterCategory) {
    jobs = jobs.filter(j => j.category === filterCategory);
  }
  if (singleIdx >= 0) {
    jobs = [jobs[singleIdx]];
  } else if (startIdx > 0) {
    jobs = jobs.slice(startIdx);
  }

  console.log(`\n========================================`);
  console.log(`  The Young Investor - Gemini Asset Gen`);
  console.log(`  ${jobs.length} assets to generate`);
  console.log(`  Model: gemini-2.0-flash-exp`);
  console.log(`========================================\n`);

  let success = 0;
  let failed = 0;

  for (let i = 0; i < jobs.length; i++) {
    const ok = await generateAsset(jobs[i], i, jobs.length);
    if (ok) success++;
    else failed++;

    // Rate limit: wait 20s between requests (free tier is ~10 RPM)
    if (i < jobs.length - 1) {
      const delay = 20;
      console.log(`  Waiting ${delay}s before next request...`);
      await sleep(delay * 1000);
    }
  }

  console.log(`\n========================================`);
  console.log(`  Done! ${success} succeeded, ${failed} failed`);
  console.log(`========================================\n`);
}

main().catch(console.error);
