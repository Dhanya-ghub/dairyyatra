import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'Images');
const OUT_DIR = path.join(ROOT, 'src', 'assets', 'hero');

/* Which photo goes in which hero slot, left to right (1 to 13).
   Use the file name without its extension. Reorder freely.
   Phones show only slots 5 to 9, so put the best photos there. */
const SLOTS = [
  '1', 'g',   // column 1  (desktop only)
  '2', 'a',   // column 2  (tablet and up)
  '7',        // column 3
  '5',        // column 4
  'b',        // column 5  (centre)
  '4',        // column 6
  'f',        // column 7
  'h', '3',   // column 8  (tablet and up)
  'j', 'c',   // column 9  (desktop only)
];

const EXTS = ['.jpg', '.jpeg', '.jfif', '.png', '.webp', '.avif', '.tif', '.tiff', '.gif'];

function findSource(name) {
  return fs.readdirSync(SRC_DIR).find((f) => {
    const ext = path.extname(f);
    return EXTS.includes(ext.toLowerCase()) && path.basename(f, ext).toLowerCase() === name.toLowerCase();
  });
}

if (!fs.existsSync(SRC_DIR)) {
  console.error(`Cannot find the Images folder at: ${SRC_DIR}`);
  process.exit(1);
}

fs.mkdirSync(OUT_DIR, { recursive: true });

// Remove old numbered hero photos so nothing stale is left behind
for (const f of fs.readdirSync(OUT_DIR)) {
  if (/^\d+\.(jpe?g|png|webp)$/i.test(f)) fs.unlinkSync(path.join(OUT_DIR, f));
}

let done = 0;
for (let i = 0; i < SLOTS.length; i++) {
  const slot = i + 1;
  const file = findSource(SLOTS[i]);

  if (!file) {
    console.warn(`  slot ${String(slot).padStart(2)}: no image named "${SLOTS[i]}" in Images, left blank`);
    continue;
  }

  const out = path.join(OUT_DIR, `${slot}.jpg`);
  try {
    await sharp(path.join(SRC_DIR, file))
      .rotate()
      .resize(640, 800, { fit: 'cover', position: sharp.strategy.attention })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(out);

    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log(`  slot ${String(slot).padStart(2)}: ${file}  ->  ${slot}.jpg  (${kb} KB)`);
    done++;
  } catch (err) {
    console.warn(`  slot ${String(slot).padStart(2)}: could not process ${file}: ${err.message}`);
  }
}

console.log(`\nDone: ${done} of ${SLOTS.length} hero photos written to src/assets/hero/`);