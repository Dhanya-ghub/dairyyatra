import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import alumnusThreePhoto from '../assets/a3.jpeg';

/* Alumni photos: put the image files in  src/assets/alumni/  (a file straight in src/assets/ also works).
   In the list below, just write the file name, e.g.  photo: 'a1.jpeg'
   Leave photo empty ('') and the person's initials are shown instead.
   The photos are shown in black and white automatically, so any colour photo works.
   If a photo does not show, open the browser console (F12): it tells you which files were found. */
const PHOTO_FILES = import.meta.glob(
  ['../assets/alumni/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}', '../assets/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}'],
  { eager: true, import: 'default' }
);

const warned = new Set();

const photoUrl = (file) => {
  if (!file) return '';
  // A full web address, or a path from the public folder ('/alumni/x.jpg'), is used as it is
  if (/^(https?:)?\/\//.test(file) || file.startsWith('/')) return file;
  const key = Object.keys(PHOTO_FILES).find((k) => k.split('/').pop().toLowerCase() === file.toLowerCase());
  if (!key && import.meta.env.DEV && !warned.has(file)) {
    warned.add(file);
    const found = Object.keys(PHOTO_FILES).map((k) => k.split('/').pop());
    console.warn(
      `[Alumni] No image named "${file}" was found.\n` +
        `Images the app can see: ${found.length ? found.join(', ') : '(none)'}\n` +
        'Put the file in src/assets/alumni/ and restart "npm run dev".'
    );
  }
  return key ? PHOTO_FILES[key] : '';
};

/* 👉 EDIT THIS LIST with your real alumni (only add people who are ready to be shown).
   Up to 6 people are shown together; with more, the extra people appear on the next page. */
const ALUMNI = [
  { name: 'Shanthra P', role: 'CEO, Pariyur FPO', quote: 'Great learning journey filled with new experiences and memories', photo: 'a1.jpeg' },
  { name: 'Ragotham', role: 'Student, KCT-BS (Agri)', quote: 'I had a great learning experience by visiting and gaining practical exposure to various dairy units and institutions.', photo: 'a2.jpeg' },
  { name: 'Arunkumar Krishnamoorthy', role: 'Senior Executive', quote: 'Across fertile plains and pastoral trails: a journey into the heart of Indias living dairy heritage.', photo: alumnusThreePhoto },

  // { name: 'Full name', role: 'Role, Organisation', quote: 'One or two sentences.', photo: 'a3.jpeg' },
];

const PER_PAGE = 6;

/* Where the tilted photos sit, for a page of 1 to 6 people.
   Each slot is [left %, top %, tilt in degrees]; w is the photo width as a % of the whole cluster. */
const LAYOUTS = {
  1: { w: 46, slots: [[27, 20, -2]] },
  2: { w: 40, slots: [[6, 4, -4], [52, 44, 3.5]] },
  3: { w: 36, slots: [[4, 2, -4], [54, 12, 3], [27, 52, -2]] },
  4: { w: 33, slots: [[4, 0, -3], [58, 6, 4], [2, 50, -4], [56, 56, 3]] },
  5: { w: 31, slots: [[22, 0, -3], [60, 8, 4], [36, 31, -2], [3, 38, -4], [58, 56, 3]] },
  6: { w: 30, slots: [[22, 0, -3], [58, 9, 4], [40, 32, -2], [3, 38, -4], [69, 49, 4], [28, 64, -3]] },
};

/* ---------- Easy settings ----------
   HEADER_HEIGHT = height of your sticky header once you have scrolled. On laptops and desktops
   (lg and up) the whole section is sized to fit exactly in the space below it. */
const HEADER_HEIGHT = '72px';

const initials = (name) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

const pad2 = (num) => String(num).padStart(2, '0');

/* Little hand-drawn extras around the photos (decoration only) */
function Doodles() {
  const base = { position: 'absolute', pointerEvents: 'none', color: '#111', overflow: 'visible' };
  const common = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.6, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  return (
    <>
      <svg viewBox="0 0 24 24" style={{ ...base, left: '9%', top: '-4%', width: '6%' }} {...common}>
        <path d="M12 2v7M12 15v7M2 12h7M15 12h7M5 5l4 4M15 15l4 4M19 5l-4 4M9 15l-4 4" />
      </svg>
      <svg viewBox="0 0 60 34" style={{ ...base, left: '74%', top: '-3%', width: '14%' }} {...common}>
        <path d="M3 28 L14 4 L22 26 L34 6 L42 28 L56 8" />
        <path d="M6 31 L17 9 L25 29 L37 11 L45 31" />
      </svg>
      <svg viewBox="0 0 50 90" style={{ ...base, left: '90%', top: '34%', width: '9%' }} {...common}>
        <path d="M10 10 C40 0 48 30 24 40 C4 48 8 70 30 62 C44 56 40 80 22 84" />
      </svg>
      <svg viewBox="0 0 24 24" style={{ ...base, left: '1%', top: '82%', width: '6%' }} {...common}>
        <polygon points="12,2 14.9,8.6 22,9.3 16.6,14 18.2,21 12,17.3 5.8,21 7.4,14 2,9.3 9.1,8.6" />
      </svg>
    </>
  );
}

export default function AlumniSection({ id = 'alumni' }) {
  const n = ALUMNI.length;
  const [active, setActive] = useState(0);

  if (n === 0) return null;

  const go = (i) => setActive(Math.max(0, Math.min(n - 1, i)));

  const page = Math.floor(active / PER_PAGE);
  const items = ALUMNI.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const layout = LAYOUTS[items.length];
  const current = ALUMNI[active];

  return (
    <section id={id} className="dy-al px-4 py-16 font-sans sm:px-6 sm:py-20" style={{ '--hh': HEADER_HEIGHT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,500&display=swap');

        /* ---------- Phones and tablets: stacked ---------- */
        .dy-al {
          scroll-margin-top: var(--hh);
          color: #0A0A0A;
          background-color: #fff;
          background-image: radial-gradient(rgba(0,0,0,.16) 1px, transparent 1.3px);
          background-size: 22px 22px;
          --cb: min(88vw, 420px);
          --mh: var(--cb);
        }

        .dy-al-grid    { display: grid; grid-template-columns: minmax(0, 1fr); row-gap: 22px; max-width: 440px; margin: 0 auto; }
        .dy-al-left    { display: contents; }

        .dy-al-title   { order: 1; margin: 0; line-height: .92; font-weight: 400; }
        .dy-al-our     { display: block; font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-weight: 400; letter-spacing: -.01em; font-size: clamp(46px, 15vw, 64px); }
        .dy-al-big     { display: block; font-weight: 800; text-transform: uppercase; letter-spacing: -.03em; font-size: clamp(44px, 16vw, 68px); }
        .dy-al-intro   { order: 2; margin: 0; max-width: 30ch; font-size: 15px; line-height: 1.5; color: #222; }

        .dy-al-cluster { order: 3; position: relative; width: var(--cb); height: var(--cb); margin: 4px auto 0; }
        .dy-al-page    { position: absolute; inset: 0; animation: dyAlPage .5s cubic-bezier(.22,.8,.3,1) both; }

        .dy-al-card {
          position: absolute; aspect-ratio: .86; padding: 0; border: 0; background: #fff; cursor: pointer;
          transform: rotate(var(--rot));
          transition: transform .35s cubic-bezier(.22,.8,.3,1), box-shadow .35s ease;
          box-shadow: 0 10px 24px rgba(0,0,0,.2), 0 2px 5px rgba(0,0,0,.12);
        }
        .dy-al-card::after {   /* paper grain */
          content: ''; position: absolute; inset: 0; pointer-events: none; opacity: .09; mix-blend-mode: multiply;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
        }
        .dy-al-card:hover { transform: translateY(-5px) rotate(var(--rot)); }
        .dy-al-card[data-active="true"] { transform: rotate(0deg) scale(1.07); box-shadow: 0 22px 44px rgba(0,0,0,.3), 0 4px 10px rgba(0,0,0,.16); }
        .dy-al-card:focus-visible { outline: 2px solid #000; outline-offset: 4px; }

        .dy-al-frame   { position: absolute; inset: 6px; display: block; overflow: hidden; background: #d4d4d4; }
        .dy-al-frame img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 50% 18%; filter: grayscale(1) contrast(1.06); user-select: none; }
        .dy-al-initials { display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; background: linear-gradient(135deg, #3a3a3a, #8a8a8a);
                          color: rgba(255,255,255,.7); font-family: 'Playfair Display', Georgia, serif; font-weight: 600; font-size: clamp(22px, calc(var(--cb) * .1), 44px); }
        .dy-al-tag     { position: absolute; left: 0; top: 0; padding: 2px 6px; background: #fff; color: #000; font-size: clamp(8px, calc(var(--cb) * .02), 10px); font-weight: 700; letter-spacing: .08em; font-variant-numeric: tabular-nums; }
        .dy-al-cap     { position: absolute; left: 0; right: 0; bottom: 0; padding: 22px 8px 7px; text-align: left; color: #fff; text-transform: uppercase; font-weight: 700; letter-spacing: .06em;
                         font-size: clamp(9px, calc(var(--cb) * .022), 12px); background: linear-gradient(to top, rgba(0,0,0,.75), transparent); opacity: 0; transition: opacity .25s ease; }
        .dy-al-card:hover .dy-al-cap, .dy-al-card:focus-visible .dy-al-cap, .dy-al-card[data-active="true"] .dy-al-cap { opacity: 1; }

        .dy-al-quote-block { order: 4; padding-top: 14px; border-top: 1px solid #0A0A0A; animation: dyAlIn .6s cubic-bezier(.22,.8,.3,1) both; }
        .dy-al-who     { display: flex; align-items: center; gap: 10px; }
        .dy-al-no      { padding: 2px 6px; background: #0A0A0A; color: #fff; font-size: 11px; font-weight: 700; letter-spacing: .08em; font-variant-numeric: tabular-nums; }
        .dy-al-name    { font-size: 15px; font-weight: 700; }
        .dy-al-role    { margin: 4px 0 0; font-size: 13px; color: #555; }
        .dy-al-quote   { margin: 12px 0 0; font-size: 19px; font-weight: 600; line-height: 1.35; letter-spacing: -.005em; }

        .dy-al-foot    { order: 5; display: grid; grid-template-columns: 1fr auto; align-items: center; gap: 12px 16px; }
        .dy-al-meet    { font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
        .dy-al-dots    { grid-column: 1 / -1; grid-row: 2; display: flex; justify-content: center; gap: 8px; }
        .dy-al-dot     { width: 9px; height: 9px; padding: 0; border: 1px solid #0A0A0A; border-radius: 50%; background: transparent; cursor: pointer; transition: transform .25s ease, background .25s ease; }
        .dy-al-dot[aria-selected="true"] { background: #0A0A0A; transform: scale(1.3); }
        .dy-al-nav     { display: flex; gap: 10px; }
        .dy-al-btn     { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 12px; background: #f1f1f1; color: #0A0A0A; cursor: pointer;
                         transition: background .2s ease, color .2s ease, opacity .2s ease; }
        .dy-al-btn:hover:not(:disabled) { background: #0A0A0A; color: #fff; }
        .dy-al-btn:disabled { opacity: .35; cursor: default; }

        @keyframes dyAlIn   { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @keyframes dyAlPage { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .dy-al *, .dy-al *::before, .dy-al *::after { transition: none !important; animation: none !important; }
        }

        /* ---------- Laptops and desktops: one screen, text on the left, photos on the right ---------- */
        @media (min-width: 1024px) {
          .dy-al {
            --pad: clamp(18px, 4vh, 48px);
            --sh: calc(100vh - var(--hh));
            --foot: 44px;
            --footgap: 14px;
            --mh: clamp(300px, calc(var(--sh) - 2 * var(--pad) - var(--foot) - var(--footgap)), 540px);   /* height of the main area */
            --cb: min(var(--mh), 46vw);                                                                  /* size of the photo cluster */
            min-height: var(--sh);
            display: flex;
            align-items: center;
            padding-top: var(--pad);
            padding-bottom: var(--pad);
          }
          @supports (height: 100svh) {
            .dy-al { --sh: calc(100svh - var(--hh)); }
          }

          /* The phone layout re-orders the pieces; on desktop they follow the natural order */
          .dy-al-title, .dy-al-intro, .dy-al-cluster, .dy-al-quote-block, .dy-al-foot { order: 0; }

          .dy-al-grid {
            max-width: 1100px;
            grid-template-columns: minmax(0, 1fr) var(--cb);
            grid-template-rows: var(--mh) var(--foot);
            column-gap: clamp(28px, 4vw, 64px);
            row-gap: var(--footgap);
          }

          /* The headline stays put; only the quote area below it changes from one alumnus to the next */
          .dy-al-left    { display: flex; flex-direction: column; justify-content: flex-start; padding-top: calc(var(--mh) * .08); min-width: 0; min-height: 0; }
          .dy-al-title   { flex: none; }
          .dy-al-our     { font-size: clamp(46px, min(calc(var(--mh) * .15), 6.8vw), 88px); }
          .dy-al-big     { font-size: clamp(44px, min(calc(var(--mh) * .17), 7.6vw), 100px); }
          .dy-al-intro   { flex: none; margin-top: calc(var(--mh) * .035); font-size: clamp(13px, calc(var(--mh) * .03), 16px); }

          .dy-al-quote-block {
            flex: 0 1 auto;
            min-height: 0;
            overflow: hidden;
            margin-top: calc(var(--mh) * .05);
            padding-bottom: 16px;   /* fade zone: a quote that fits is never faded */
            -webkit-mask-image: linear-gradient(to bottom, #000 calc(100% - 16px), transparent);
            mask-image: linear-gradient(to bottom, #000 calc(100% - 16px), transparent);
          }
          .dy-al-name    { font-size: clamp(13px, calc(var(--mh) * .027), 16px); }
          .dy-al-role    { font-size: clamp(11.5px, calc(var(--mh) * .022), 14px); }
          .dy-al-quote   { font-size: clamp(15px, calc(var(--mh) * .038), 22px); }

          .dy-al-cluster { width: var(--cb); height: var(--cb); margin: 0; align-self: center; justify-self: end; }

          .dy-al-foot    { grid-column: 1 / -1; grid-template-columns: 1fr auto 1fr; }
          .dy-al-dots    { grid-column: auto; grid-row: auto; }
          .dy-al-nav     { justify-self: end; }
        }
      `}</style>

      <div
        className="dy-al-wrap mx-auto w-full max-w-[1100px] outline-none"
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Alumni stories"
        onKeyDown={(e) => {
          if (e.key === 'ArrowRight') go(active + 1);
          if (e.key === 'ArrowLeft') go(active - 1);
        }}
      >
        <ScrollReveal animation="fade-up" delay={100} duration={700}>
          <div className="dy-al-grid">
            {/* LEFT: headline, intro and the selected alumnus's quote */}
            <div className="dy-al-left">
              <h2 className="dy-al-title">
                <span className="dy-al-our">Our</span>
                <span className="dy-al-big">Alumni</span>
              </h2>
              <p className="dy-al-intro">Entrepreneurs who travelled the Yatra, and the ideas they took home.</p>

              <div key={active} className="dy-al-quote-block" aria-live="polite">
                <div className="dy-al-who">
                  <span className="dy-al-no">{pad2(active + 1)}</span>
                  <span className="dy-al-name">{current.name}</span>
                </div>
                <p className="dy-al-role">{current.role}</p>
                <p className="dy-al-quote">&ldquo;{current.quote}&rdquo;</p>
              </div>
            </div>

            {/* RIGHT: tilted photos (click one to read their quote) */}
            <div className="dy-al-cluster">
              <Doodles />
              <div key={page} className="dy-al-page">
                {items.map((a, k) => {
                  const i = page * PER_PAGE + k;
                  const [left, top, rot] = layout.slots[k];
                  const isActive = i === active;
                  const photo = photoUrl(a.photo);
                  return (
                    <button
                      key={i}
                      type="button"
                      className="dy-al-card"
                      data-active={isActive}
                      aria-pressed={isActive}
                      aria-label={`${a.name}, ${a.role}`}
                      onClick={() => go(i)}
                      style={{ left: `${left}%`, top: `${top}%`, width: `${layout.w}%`, '--rot': `${rot}deg`, zIndex: isActive ? 20 : 2 + k }}
                    >
                      <span className="dy-al-frame">
                        {photo ? (
                          <img src={photo} alt="" draggable={false} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                        ) : (
                          <span className="dy-al-initials">{initials(a.name)}</span>
                        )}
                        <span className="dy-al-tag">{pad2(i + 1)}</span>
                        <span className="dy-al-cap">{a.name}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* BOTTOM: label, dots and arrows */}
            <div className="dy-al-foot">
              <span className="dy-al-meet">Meet the alumni</span>
              <div className="dy-al-dots" role="tablist" aria-label="Choose an alumnus">
                {ALUMNI.map((a, i) => (
                  <button
                    key={i}
                    type="button"
                    role="tab"
                    aria-selected={i === active}
                    aria-label={a.name}
                    className="dy-al-dot"
                    onClick={() => go(i)}
                  />
                ))}
              </div>
              <div className="dy-al-nav">
                <button type="button" className="dy-al-btn" aria-label="Previous alumnus" onClick={() => go(active - 1)} disabled={active === 0}>
                  <ChevronLeft className="h-5 w-5" />
                </button>
                <button type="button" className="dy-al-btn" aria-label="Next alumnus" onClick={() => go(active + 1)} disabled={active === n - 1}>
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}