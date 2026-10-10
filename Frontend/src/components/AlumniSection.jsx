import React, { useEffect, useRef, useState } from 'react';
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

/* 👉 Replace the two placeholder entries with alumni details when they're ready to be shown. */
const ALUMNI = [
  { name: 'Shanthra P', role: 'CEO, Pariyur FPO', quote: 'Great learning journey filled with new experiences and memories', photo: 'a1.jpeg' },
  { name: 'Ragotham', role: 'Student, KCT-BS (Agri)', quote: 'I had a great learning experience by visiting and gaining practical exposure to various dairy units and institutions.', photo: 'a2.jpeg' },
  { name: 'Arunkumar Krishnamoorthy', role: 'Senior Executive', quote: 'Across fertile plains and pastoral trails: a journey into the heart of Indias living dairy heritage.', photo: alumnusThreePhoto },
  { name: 'Alumni 04', role: 'Role, Organisation', quote: "Add this alumnus's Yatra experience and testimonial here.", photo: '' },
  { name: 'Alumni 05', role: 'Role, Organisation', quote: "Add this alumnus's Yatra experience and testimonial here.", photo: '' },
];

/* ---------- Easy settings ----------
   HEADER_HEIGHT = height of your sticky header once you have scrolled. On laptops and desktops
   (lg and up) the whole section is sized to fit exactly in the space below it. */
const HEADER_HEIGHT = '72px';

const initials = (name) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');

const pad2 = (num) => String(num).padStart(2, '0');

/* Little hand-drawn extras around the photos (decoration only) */
function Doodles() {
  const base = { position: 'absolute', pointerEvents: 'none', color: '#3368A0', overflow: 'visible' };
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
  const [active, setActive] = useState(Math.floor(ALUMNI.length / 2));
  const carouselRef = useRef(null);
  const scrollTimerRef = useRef(null);

  const go = (i) => setActive(Math.max(0, Math.min(n - 1, i)));

  useEffect(() => {
    const carousel = carouselRef.current;
    const card = carousel?.querySelector(`[data-al-index="${active}"]`);
    if (!carousel || !card) return undefined;

    const centerCard = () => {
      const carouselCenter = carousel.getBoundingClientRect().left + carousel.clientWidth / 2;
      const cardCenter = card.getBoundingClientRect().left + card.clientWidth / 2;
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      carousel.scrollTo({
        left: carousel.scrollLeft + cardCenter - carouselCenter,
        behavior: reducedMotion ? 'auto' : 'smooth',
      });
    };

    const frame = requestAnimationFrame(centerCard);
    window.addEventListener('resize', centerCard);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', centerCard);
    };
  }, [active]);

  useEffect(() => () => clearTimeout(scrollTimerRef.current), []);

  if (n === 0) return null;

  const current = ALUMNI[active];

  return (
    <section id={id} className="dy-al px-4 py-16 font-sans sm:px-6 sm:py-20" style={{ '--hh': HEADER_HEIGHT }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@1,400;1,500&display=swap');

        .dy-al {
          scroll-margin-top: var(--hh);
          color: #172738;
          background: transparent;
        }
        .dy-al-wrap {
          padding: clamp(22px, 4vw, 48px);
        }

        .dy-al-grid    { display: grid; grid-template-columns: minmax(0, 1fr); row-gap: 22px; max-width: 1100px; margin: 0 auto; }
        .dy-al-left    { display: flex; flex-direction: column; gap: 12px; min-width: 0; }

        .dy-al-title   { order: 1; margin: 0; line-height: .92; font-weight: 400; }
        .dy-al-our     { display: block; color: #3368A0; font-family: 'Playfair Display', Georgia, serif; font-style: italic; font-weight: 400; letter-spacing: -.01em; font-size: clamp(46px, 15vw, 64px); }
        .dy-al-big     { display: block; color: #172738; font-weight: 800; text-transform: uppercase; letter-spacing: -.03em; font-size: clamp(44px, 16vw, 68px); }
        .dy-al-intro   { order: 2; margin: 0; max-width: 30ch; font-size: 15px; line-height: 1.5; color: #475569; }

        .dy-al-cluster { order: 3; position: relative; width: 100%; margin: 4px auto 0; }
        .dy-al-carousel {
          --card-width: clamp(112px, 14vw, 168px);
          width: 100%;
          overflow-x: auto;
          padding: 20px 4px;
          overscroll-behavior-x: contain;
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }
        .dy-al-carousel::-webkit-scrollbar { display: none; }
        .dy-al-track { display: flex; width: max-content; min-width: 100%; align-items: center; justify-content: center; gap: clamp(12px, 2vw, 22px); }
        @media (max-width: 640px) {
          .dy-al-carousel { padding-inline: max(0px, calc((100% - var(--card-width)) / 2)); }
        }

        .dy-al-card {
          position: relative; flex: 0 0 var(--card-width); width: var(--card-width); aspect-ratio: .86; padding: 0; border: 1px solid rgba(51,104,160,.16); border-radius: 18px; background: #fff; cursor: pointer;
          transform: rotate(var(--rot));
          transition: transform .35s cubic-bezier(.22,.8,.3,1), box-shadow .35s ease, opacity .35s ease;
          box-shadow: 0 10px 24px rgba(23,39,56,.16), 0 2px 5px rgba(23,39,56,.08);
          scroll-snap-align: center;
        }
        .dy-al-card::after { content: none; }
        .dy-al-card:hover { transform: translateY(-5px) rotate(var(--rot)); }
        .dy-al-card[data-active="true"] { transform: rotate(0deg) scale(1.07); border-color: #F2A93B; box-shadow: 0 22px 44px rgba(23,39,56,.22), 0 4px 10px rgba(23,39,56,.12); }
        .dy-al-card:focus-visible { outline: 2px solid #000; outline-offset: 4px; }

        .dy-al-frame   { position: absolute; inset: 5px; display: block; overflow: hidden; border-radius: 13px; background: #dbe7ec; }
        .dy-al-frame img { display: block; width: 100%; height: 100%; object-fit: cover; object-position: 50% 18%; user-select: none; }
        .dy-al-initials { display: flex; width: 100%; height: 100%; align-items: center; justify-content: center; background: linear-gradient(135deg, #3368A0, #172738);
                          color: #fff; font-family: 'Playfair Display', Georgia, serif; font-weight: 600; font-size: clamp(22px, 8vw, 44px); }
        .dy-al-tag     { position: absolute; left: 8px; top: 8px; padding: 3px 7px; border-radius: 6px; background: #172738; color: #fff; font-size: 10px; font-weight: 700; letter-spacing: .08em; font-variant-numeric: tabular-nums; }
        .dy-al-cap     { position: absolute; left: 0; right: 0; bottom: 0; padding: 22px 8px 7px; text-align: left; color: #fff; text-transform: uppercase; font-weight: 700; letter-spacing: .06em;
                         font-size: 10px; background: linear-gradient(to top, rgba(20,37,56,.92), transparent); opacity: 0; transition: opacity .25s ease; }
        .dy-al-card:hover .dy-al-cap, .dy-al-card:focus-visible .dy-al-cap, .dy-al-card[data-active="true"] .dy-al-cap { opacity: 1; }

        .dy-al-quote-block { order: 4; width: min(100%, 760px); margin: 0 auto; padding: 8px 0; text-align: center; animation: dyAlIn .6s cubic-bezier(.22,.8,.3,1) both; }
        .dy-al-quote-block::before { content: '“'; display: block; margin-bottom: 8px; color: #F2A93B; font-family: 'Playfair Display', Georgia, serif; font-size: 46px; line-height: .7; }
        .dy-al-who     { display: flex; align-items: center; justify-content: center; gap: 10px; }
        .dy-al-no      { padding: 3px 7px; border-radius: 6px; background: #3368A0; color: #fff; font-size: 11px; font-weight: 700; letter-spacing: .08em; font-variant-numeric: tabular-nums; }
        .dy-al-name    { color: #172738; font-size: 15px; font-weight: 700; }
        .dy-al-role    { margin: 4px 0 0; font-size: 13px; color: #64748B; }
        .dy-al-quote   { margin: 12px 0 0; color: #172738; font-size: clamp(17px, 2vw, 22px); font-weight: 600; line-height: 1.45; letter-spacing: -.005em; }

        .dy-al-foot    { order: 5; display: grid; grid-template-columns: 1fr auto 1fr; align-items: center; gap: 12px 16px; }
        .dy-al-meet    { color: #3368A0; font-size: 11px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase; }
        .dy-al-dots    { display: flex; justify-content: center; gap: 8px; }
        .dy-al-dot     { width: 9px; height: 9px; padding: 0; border: 1px solid #3368A0; border-radius: 50%; background: transparent; cursor: pointer; transition: transform .25s ease, background .25s ease; }
        .dy-al-dot[aria-selected="true"] { border-color: #F2A93B; background: #F2A93B; transform: scale(1.3); }
        .dy-al-nav     { display: flex; gap: 10px; }
        .dy-al-btn     { width: 42px; height: 42px; display: grid; place-items: center; border-radius: 12px; background: #172738; color: #fff; cursor: pointer;
                         transition: background .2s ease, color .2s ease, opacity .2s ease; }
        .dy-al-btn:hover:not(:disabled) { background: #3368A0; color: #fff; }
        .dy-al-btn:disabled { opacity: .35; cursor: default; }

        @keyframes dyAlIn   { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: none; } }
        @media (prefers-reduced-motion: reduce) {
          .dy-al *, .dy-al *::before, .dy-al *::after { transition: none !important; animation: none !important; }
        }

        @media (min-width: 1024px) {
          .dy-al {
            --pad: clamp(18px, 4vh, 48px);
            --sh: calc(100vh - var(--hh));
            min-height: var(--sh);
            display: flex;
            align-items: center;
            padding-top: var(--pad);
            padding-bottom: var(--pad);
          }
          .dy-al-wrap { padding: clamp(28px, 4vw, 52px); }
          @supports (height: 100svh) {
            .dy-al { --sh: calc(100svh - var(--hh)); }
          }

          .dy-al-grid {
            max-width: 1100px;
            row-gap: 18px;
          }

          .dy-al-left    { gap: 14px; }
          .dy-al-title   { flex: none; }
          .dy-al-our     { font-size: clamp(46px, 6.8vw, 88px); }
          .dy-al-big     { font-size: clamp(44px, 7.6vw, 100px); }
          .dy-al-intro   { font-size: 16px; }
          .dy-al-cluster { margin-top: 0; }
          .dy-al-foot    { margin-top: 2px; }
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
            {/* Heading and introduction */}
            <div className="dy-al-left">
              <h2 className="dy-al-title">
                <span className="dy-al-our">Our</span>
                <span className="dy-al-big">Alumni</span>
              </h2>
              <p className="dy-al-intro">Entrepreneurs who travelled the Yatra, and the ideas they took home.</p>
            </div>

            {/* Centered, horizontally scrollable alumni photos */}
            <div className="dy-al-cluster">
              <Doodles />
              <div
                ref={carouselRef}
                className="dy-al-carousel"
                onScroll={() => {
                  clearTimeout(scrollTimerRef.current);
                  scrollTimerRef.current = setTimeout(() => {
                    const carousel = carouselRef.current;
                    if (!carousel) return;
                    const center = carousel.getBoundingClientRect().left + carousel.clientWidth / 2;
                    const cards = [...carousel.querySelectorAll('[data-al-index]')];
                    const nearest = cards.reduce((best, card) => {
                      const index = Number(card.getAttribute('data-al-index'));
                      const distance = Math.abs(card.getBoundingClientRect().left + card.clientWidth / 2 - center);
                      return distance < best.distance ? { index, distance } : best;
                    }, { index: active, distance: Infinity });
                    go(nearest.index);
                  }, 120);
                }}
              >
                <div className="dy-al-track">
                  {ALUMNI.map((alumnus, i) => {
                    const photo = photoUrl(alumnus.photo);
                    return (
                      <button
                        key={alumnus.name}
                        type="button"
                        className="dy-al-card"
                        data-al-index={i}
                        data-active={i === active}
                        aria-pressed={i === active}
                        aria-label={`${alumnus.name}, ${alumnus.role}`}
                        onClick={() => go(i)}
                        style={{ '--rot': `${[-4, 3, -2, 4, -3][i % 5]}deg` }}
                      >
                        <span className="dy-al-frame">
                          {photo ? (
                            <img src={photo} alt={alumnus.name} draggable={false} onError={(e) => { e.currentTarget.style.display = 'none'; }} />
                          ) : (
                            <span className="dy-al-initials">{initials(alumnus.name)}</span>
                          )}
                          <span className="dy-al-tag">{pad2(i + 1)}</span>
                          <span className="dy-al-cap">{alumnus.name}</span>
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div key={active} className="dy-al-quote-block" aria-live="polite">
              <div className="dy-al-who">
                <span className="dy-al-no">{pad2(active + 1)}</span>
                <span className="dy-al-name">{current.name}</span>
              </div>
              <p className="dy-al-role">{current.role}</p>
              <p className="dy-al-quote">&ldquo;{current.quote}&rdquo;</p>
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