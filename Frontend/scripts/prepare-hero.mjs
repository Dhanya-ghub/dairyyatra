import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(ROOT, 'Images');
const OUT_DIR = path.join(ROOT, 'src', 'assets', 'hero');

/* Which photo becomes which numbered hero file (1.jpg, 2.jpg, ...).
   A plain name is a file in the Images folder, written without its extension.
   A name with a slash is a path from the Frontend folder, for photos kept elsewhere.
   The PHOTOS list in src/components/Hero.jsx decides which number sits in which tile. */
const SLOTS = [
  '1', 'g',   // 1, 2
  '2', 'a',   // 3, 4
  '7',        // 5
  '5',        // 6
  'b',        // 7
  '4',        // 8
  'f',        // 9
  'h', '3',   // 10, 11
  'j', 'c',   // 12, 13
  'dairy_yatra_15_day_images/day4.jpeg',        // 14  group on a field visit
  'src/assets/images/pillar_1_organic.jpg',     // 15  hills and pasture
  'src/assets/images/pillar_6_alternative.jpg', // 16  camels at sunset
  'dairy_yatra_15_day_images/day5.jpeg',        // 17  cow eating fodder in a stall
  'src/assets/images/pillar_2_nutrition.jpg',   // 18  team at the fodder unit
  'dairy_yatra_15_day_images/day8.jpeg',        // 19  fresh milk
  'src/assets/images/pillar_4_bioeconomy.jpg',  // 20  farm with a biogas plant
];

const EXTS = ['.jpg', '.jpeg', '.jfif', '.png', '.webp', '.avif', '.tif', '.tiff', '.gif'];

// Returns the full path of the source photo, or undefined if it is missing
function findSource(name) {
  if (name.includes('/')) {
    const full = path.join(ROOT, name);
    return fs.existsSync(full) ? full : undefined;
  }
  const file = fs.readdirSync(SRC_DIR).find((f) => {
    const ext = path.extname(f);
    return EXTS.includes(ext.toLowerCase()) && path.basename(f, ext).toLowerCase() === name.toLowerCase();
  });
  return file && path.join(SRC_DIR, file);
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
    console.warn(`  slot ${String(slot).padStart(2)}: no image found for "${SLOTS[i]}", left blank`);
    continue;
  }

  const out = path.join(OUT_DIR, `${slot}.jpg`);
  try {
    await sharp(file)
      .rotate()
      .resize(640, 800, { fit: 'cover', position: sharp.strategy.attention })
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(out);

    const kb = Math.round(fs.statSync(out).size / 1024);
    console.log(`  slot ${String(slot).padStart(2)}: ${path.relative(ROOT, file)}  ->  ${slot}.jpg  (${kb} KB)`);
    done++;
  } catch (err) {
    console.warn(`  slot ${String(slot).padStart(2)}: could not process ${file}: ${err.message}`);
  }
}

console.log(`\nDone: ${done} of ${SLOTS.length} hero photos written to src/assets/hero/`);