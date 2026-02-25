import sharp from 'sharp';
import { readdirSync } from 'fs';
import { join } from 'path';

const buildingsDir = join(import.meta.dirname, '..', 'public', 'assets', 'images', 'buildings');
const files = readdirSync(buildingsDir).filter(f => f.endsWith('.png'));

const THRESHOLD = 230; // pixels with R,G,B all above this become transparent

for (const file of files) {
  const filePath = join(buildingsDir, file);
  const image = sharp(filePath);
  const { width, height, channels } = await image.metadata();

  // Ensure we have an alpha channel
  const raw = await image.ensureAlpha().raw().toBuffer();

  let changed = 0;
  for (let i = 0; i < raw.length; i += 4) {
    const r = raw[i], g = raw[i + 1], b = raw[i + 2];
    if (r > THRESHOLD && g > THRESHOLD && b > THRESHOLD) {
      raw[i + 3] = 0; // set alpha to 0
      changed++;
    }
  }

  await sharp(raw, { raw: { width, height, channels: 4 } })
    .png()
    .toFile(filePath.replace('.png', '_tmp.png'));

  // Replace original
  const { renameSync } = await import('fs');
  renameSync(filePath.replace('.png', '_tmp.png'), filePath);

  console.log(`${file}: removed ${changed} white pixels (${width}x${height})`);
}

console.log('Done! All building backgrounds made transparent.');
