import React from 'react';
import ScrollReveal from './ScrollReveal';

/* ------------------------------------------------------------------
   Photos are picked up automatically from  src/assets/images/
   (and from src/assets/images/gallery/ if you use that folder).
   Only files named with just a number are used: 1, 2, 3 ...
   The extension must be lower-case: .jpg .jpeg .png .webp  (NOT .JPG)
   ------------------------------------------------------------------ */
// Lower-case extensions only: Vite does not accept .JPG / .PNG (capitals) as images.
const modules = import.meta.glob('../assets/images/**/*.{jpg,jpeg,png,webp}', {
  eager: true,
  import: 'default',
});
const baseName = (path) => path.split('/').pop();
// photo number -> image, e.g. { 1: '/src/.../1.jpg', 2: ... }
const BY_NUMBER = {};
Object.entries(modules).forEach(([path, src]) => {
  if (/^\d+\./.test(baseName(path))) BY_NUMBER[parseInt(baseName(path), 10)] = src;
});

/* Which photo goes in which frame. Frame i shows photo number SLOT_PHOTO[i] (1 = file "1").
   Change these numbers to swap photos between frames. */
const SLOT_PHOTO = [7, 2, 4, 5, 3, 1, 6];

/* Short descriptions for screen readers, by photo number (update if you swap photos) */
const ALTS = {
  1: 'Cattle at a dairy farm',
  2: 'Dairy expo hall',
  3: 'Cattle shed',
  4: 'Calves at a farm',
  5: 'Hands-on session at a dairy facility',
  6: 'Cattle shed',
  7: 'Black buffalo in a shed',
};

/* Frames. c = grid columns, r = grid rows (desktop, 12 x 6 grid; the middle is left for the text)
   m = columns on phones, ratio = shape on phones */
const SLOTS = [
  { c: '1 / 4',  r: '1 / 5', m: 'span 1', ratio: '3 / 4' },   // tall, left
  { c: '4 / 8',  r: '1 / 3', m: 'span 2', ratio: '16 / 9' },  // wide, top
  { c: '8 / 10', r: '1 / 3', m: 'span 1', ratio: '1 / 1' },   // square, top
  { c: '10 / 13', r: '1 / 5', m: 'span 1', ratio: '3 / 4' },  // tall, right
  { c: '1 / 5',  r: '5 / 7', m: 'span 2', ratio: '16 / 9' },  // wide, bottom left
  { c: '5 / 8',  r: '5 / 7', m: 'span 1', ratio: '4 / 3' },   // bottom middle
  { c: '8 / 13', r: '5 / 7', m: 'span 2', ratio: '21 / 9' },  // panoramic, bottom right
];

const css = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,600&display=swap');
.gl-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }
.gl-text { grid-column: 1 / -1; order: -1; padding: 8px 4px 20px; text-align: center; }
.gl-item { position: relative; overflow: hidden; border-radius: 14px; background: #E2E8F0; aspect-ratio: var(--r); }
.gl-item img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform .7s ease; }
.gl-item:hover img { transform: scale(1.05); }
${SLOTS.map((s, i) => `.gl-s${i} { grid-column: ${s.m}; --r: ${s.ratio}; }`).join('\n')}

@media (min-width: 1024px) {
  .gl-grid { grid-template-columns: repeat(12, 1fr); grid-auto-rows: 88px; gap: 12px; }
  .gl-text { grid-column: 4 / 10; grid-row: 3 / 5; order: 0; padding: 0 12px; display: flex; flex-direction: column; justify-content: center; }
  .gl-item { aspect-ratio: auto; }
${SLOTS.map((s, i) => `  .gl-s${i} { grid-column: ${s.c}; grid-row: ${s.r}; }`).join('\n')}
}
`;

export default function Gallery({ id = 'gallery' }) {
  return (
    <section id={id} className="bg-white px-4 py-16 font-sans text-[#0F172A] sm:px-6 sm:py-24">
      <style>{css}</style>
      <ScrollReveal animation="fade-up" delay={100} duration={700}>
        <div className="gl-grid mx-auto max-w-6xl">

          {/* Centre text */}
          <div className="gl-text">
            <h2
              className="leading-[1.1]"
              style={{ fontFamily: '"Fraunces", Georgia, serif', fontWeight: 600, fontSize: 'clamp(30px, 4vw, 46px)', letterSpacing: '-0.01em' }}
            >
              Learning on the road
            </h2>
            <p className="mx-auto mt-3 max-w-[460px] text-[15px] leading-relaxed text-[#475569]">
              Fifteen days of farm visits, institution tours and conversations with the people behind Indian dairy.
            </p>
          </div>

          {/* Photos */}
          {SLOTS.map((_, i) => {
            const n = SLOT_PHOTO[i];
            const src = BY_NUMBER[n];
            return (
              <div key={i} className={`gl-item gl-s${i}`}>
                {src ? (
                  <img src={src} alt={ALTS[n] || ''} loading="lazy" />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#16325c] to-[#2B6CB0]" />
                )}
              </div>
            );
          })}
        </div>
      </ScrollReveal>
    </section>
  );
}