import sharp from 'sharp';
import { readdirSync, renameSync } from 'fs';
import { join } from 'path';

const buildingsDir = join(import.meta.dirname, '..', 'public', 'assets', 'images', 'buildings');
const files = readdirSync(buildingsDir).filter(f => f.endsWith('.png'));

for (const file of files) {
  const filePath = join(buildingsDir, file);
  const image = sharp(filePath);
  const meta = await image.metadata();

  // Step 1: Ensure alpha channel and get raw pixels
  const raw = await image.ensureAlpha().raw().toBuffer();
  const w = meta.width, h = meta.height;

  // Step 2: Flood fill from all edges to find background pixels
  // Use a visited array and BFS from border pixels
  const isBackground = new Uint8Array(w * h); // 0 = not bg, 1 = bg
  const queue = [];
  const THRESHOLD = 220;

  // Seed from all border pixels
  for (let x = 0; x < w; x++) {
    queue.push(x); // top row
    queue.push((h - 1) * w + x); // bottom row
  }
  for (let y = 0; y < h; y++) {
    queue.push(y * w); // left col
    queue.push(y * w + (w - 1)); // right col
  }

  // BFS flood fill
  const visited = new Uint8Array(w * h);
  let qi = 0;
  while (qi < queue.length) {
    const idx = queue[qi++];
    if (idx < 0 || idx >= w * h || visited[idx]) continue;
    visited[idx] = 1;

    const pi = idx * 4;
    const r = raw[pi], g = raw[pi + 1], b = raw[pi + 2], a = raw[pi + 3];

    // Consider it background if: already transparent, or white/near-white
    if (a < 10 || (r > THRESHOLD && g > THRESHOLD && b > THRESHOLD)) {
      isBackground[idx] = 1;
      const x = idx % w, y = Math.floor(idx / w);
      if (x > 0) queue.push(idx - 1);
      if (x < w - 1) queue.push(idx + 1);
      if (y > 0) queue.push(idx - w);
      if (y < h - 1) queue.push(idx + w);
    }
  }

  // Step 3: Set background pixels to transparent
  let bgCount = 0;
  for (let i = 0; i < w * h; i++) {
    if (isBackground[i]) {
      raw[i * 4 + 3] = 0;
      bgCount++;
    }
  }

  // Step 4: Find bounding box of non-transparent pixels
  let minX = w, maxX = 0, minY = h, maxY = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (raw[(y * w + x) * 4 + 3] > 0) {
        minX = Math.min(minX, x);
        maxX = Math.max(maxX, x);
        minY = Math.min(minY, y);
        maxY = Math.max(maxY, y);
      }
    }
  }

  // Add 4px margin
  minX = Math.max(0, minX - 4);
  minY = Math.max(0, minY - 4);
  maxX = Math.min(w - 1, maxX + 4);
  maxY = Math.min(h - 1, maxY + 4);

  const cropW = maxX - minX + 1;
  const cropH = maxY - minY + 1;

  // Step 5: Save with flood-filled transparency, then crop
  const tmpPath = filePath.replace('.png', '_tmp.png');
  await sharp(raw, { raw: { width: w, height: h, channels: 4 } })
    .png()
    .extract({ left: minX, top: minY, width: cropW, height: cropH })
    .toFile(tmpPath);

  renameSync(tmpPath, filePath);
  console.log(`${file}: ${w}x${h} -> ${cropW}x${cropH} (removed ${bgCount} bg pixels)`);
}

console.log('\nDone! All buildings: transparent bg + trimmed padding.');
