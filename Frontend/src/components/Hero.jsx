import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

/* ---------- Easy settings ---------- */
const SHOW_HERO_CTA = false;                           // true = show the Expression of Interest button under the subtitle
const HEADER_HEIGHT = '66px';                          // height of your sticky header

/* Stats bar numbers. amber = shown in gold. */
const STATS = [
  { value: 5,    label: 'States', amber: true },
  { value: 15,   label: 'Days', amber: true },
  { value: 15,   label: 'Farms, institutions & businesses', wide: true },
  { value: 40,   label: 'Entrepreneurs', amber: true },
  { value: 150,  label: 'Hours of learning' },
  { value: 6000, suffix: '+', unit: 'km', label: 'Journey across India', amber: true },
];

/* Hero photos live in src/assets/hero/ and are named 1, 2, 3 ... 13
   (lower-case extension: .jpg .jpeg .png .webp). Replace a file to change a photo.
   A missing number simply shows a soft blank card. */
const modules = import.meta.glob('../assets/hero/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });
const BY_NUMBER = {};
Object.entries(modules).forEach(([path, src]) => {
  const name = path.split('/').pop();
  if (/^\d+\./.test(name)) BY_NUMBER[parseInt(name, 10)] = src;
});

const LOGO_SRC = '/logo.png';

const GALLERY = [
  { image: 1, left: 5.5, top: 76, rotate: 0, size: 9.2 },
  { image: 2, left: 15.4, top: 57, rotate: 0, size: 9.2 },
  { image: 3, left: 25.3, top: 39, rotate: 0, size: 9.2 },
  { image: 4, left: 35.2, top: 24, rotate: 0, size: 9 },
  { image: 5, left: 45.1, top: 17, rotate: 0, size: 8.8 },
  { image: 6, left: 54.9, top: 17, rotate: 0, size: 8.8 },
  { image: 7, left: 64.8, top: 24, rotate: 0, size: 9 },
  { image: 8, left: 74.7, top: 39, rotate: 0, size: 9.2 },
  { image: 9, left: 84.6, top: 57, rotate: 0, size: 9.2 },
  { image: 10, left: 94.5, top: 76, rotate: 0, size: 9.2 },
];

/* ---------- Photo card ---------- */
function PhotoCard({ n, delay, style }) {
  const src = BY_NUMBER[n];
  return (
    <div
      className={`dy-card dy-hero-photo relative overflow-hidden rounded-xl transition-transform duration-300 ease-out will-change-transform sm:rounded-2xl ${
        src
          ? 'shadow-[0_8px_20px_rgba(23,39,56,0.18)] hover:z-10 hover:shadow-[0_16px_36px_rgba(23,39,56,0.25)]'
          : 'bg-gradient-to-b from-[#EFEFEF] to-[#F7F7F7]'
      }`}
      style={{ ...style, aspectRatio: '4 / 5', animationDelay: `${delay}ms` }}
    >
      {src && (
        <img
          src={src}
          alt=""
          draggable="false"
          loading="lazy"
          decoding="async"
          className="absolute inset-0 h-full w-full object-cover"
        />
      )}
    </div>
  );
}

/* ---------- Count-up for the stats ---------- */
function useCountUp(target, start, duration = 1400) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return undefined;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVal(target);
      return undefined;
    }
    let raf;
    let t0;
    const step = (t) => {
      if (!t0) t0 = t;
      const p = Math.min((t - t0) / duration, 1);
      setVal(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [target, start, duration]);
  return val;
}

function StatItem({ stat, seen }) {
  const val = useCountUp(stat.value, seen);
  return (
    <div
      className={`dy-stat-item flex flex-col items-center justify-center px-2 text-center md:border-l md:border-white/15 md:first:border-l-0 ${
        stat.wide ? 'md:flex-[1.7]' : 'md:flex-1'
      }`}
    >
      <div
        className="whitespace-nowrap font-bold leading-none"
        style={{
          fontFamily: '"Playfair Display", Georgia, serif',
          fontVariantNumeric: 'lining-nums tabular-nums',
          fontFeatureSettings: '"lnum" 1, "tnum" 1',
          fontSize: 'clamp(24px, 2.65vw, 40px)',
          color: stat.amber ? '#F2A93B' : '#FFFFFF',
          textShadow: stat.amber ? '0 0 14px rgba(242,169,59,0.4)' : 'none',
        }}
      >
        {val}
        {stat.suffix || ''}
        {stat.unit && (
          <span className="ml-1 font-semibold" style={{ fontSize: '0.45em' }}>
            {stat.unit}
          </span>
        )}
      </div>
      <div
        className="mt-1.5 font-semibold leading-tight text-white"
        style={{ fontSize: 'clamp(11px, 0.92vw, 14px)' }}
      >
        {stat.label}
      </div>
    </div>
  );
}

function StatsBar() {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.4 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className="dy-stats-bar mx-auto grid w-full grid-cols-3 gap-y-5 rounded-2xl border border-white/5 bg-[#1A1A1A] shadow-[0_10px_30px_rgba(0,0,0,0.25)] md:flex md:items-stretch md:gap-y-0"
      style={{
        maxWidth: 'min(100%, max(70vw, 640px), 1180px)',
        padding: 'clamp(14px, 1.6vw, 24px) clamp(8px, 1vw, 16px)',
      }}
    >
      {STATS.map((s) => (
        <StatItem key={s.label} stat={s} seen={seen} />
      ))}
    </div>
  );
}

/* ---------- Hero (full page) ---------- */
export default function Hero({ onOpenApply }) {
  return (
    <section
      className="dy-hero relative overflow-visible font-sans"
      style={{ '--hh': HEADER_HEIGHT }}
    >
      <style>{`
        .dy-hero {
          height: calc(100svh - var(--hh));
          min-height: 0;
          box-sizing: border-box;
          padding: clamp(8px, 1.6vh, 16px) clamp(16px, 3.4vw, 54px);
          color: #172738;
          background-color: #fbfaf6;
          background-image: radial-gradient(rgba(23,39,56,.11) .8px, transparent .9px);
          background-size: 22px 22px;
        }
        .dy-hero__layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) clamp(154px, 17vw, 190px);
          align-items: stretch;
          gap: clamp(14px, 2.2vw, 30px);
          width: min(100%, 1600px);
          height: 100%;
          margin: 0 auto;
        }
        .dy-hero__main {
          position: relative;
          min-width: 0;
          min-height: 0;
          overflow: visible;
          container-type: inline-size;
        }
        .dy-hero__gallery { position: absolute; inset: 0; }
        .dy-hero-photo {
          position: absolute;
          width: var(--photo-size, 10.5%);
          min-width: 52px;
          max-width: 132px;
          border-radius: 18px;
          transform-origin: 50% 50%;
          transform: translate(-50%, -50%) rotate(var(--photo-rotation));
          transition: transform .25s ease, box-shadow .25s ease;
          z-index: 1;
        }
        .dy-hero-photo:hover { transform: translate(-50%, calc(-50% - 5px)) rotate(0deg) scale(1.06); }
        .dy-hero__tagline {
          max-width: 80ch;
          margin: 8px 12px 0;
          color: #3368A0;
          font: 600 clamp(11px, .95vw, 13px)/1.4 "DM Sans", system-ui, sans-serif;
          letter-spacing: .015em;
          text-align: center;
          transform: translateY(-9px);
        }
        .dy-hero__brand {
          position: absolute;
          z-index: 3;
          top: 37%;
          left: 50%;
          display: flex;
          width: 100%;
          transform: translateX(-50%);
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .dy-hero__logo { width: 250px; height: auto; clip-path: inset(1.5% 0); transform: translateY(-31px); }
        .dy-hero__year {
          margin: 0;
          color: #172738;
          font: 700 clamp(23px, 2.4vw, 30px)/1.1 "Playfair Display", Georgia, serif;
          letter-spacing: .015em;
          transform: translateY(-28px);
        }
        .dy-hero__subtitle {
          max-width: none;
          margin: 8px 0 0;
          color: #172738;
          font: 700 clamp(20px, 2.5vw, 32px)/1.02 "Playfair Display", Georgia, serif;
          letter-spacing: -.035em;
          white-space: nowrap;
          transform: translateY(-9px);
        }
        .dy-hero__stats { align-self: center; display: flex; width: 100%; height: min(100%, 560px); }
        .dy-hero__stats > div { display: flex; width: 100%; }
        .dy-hero__stats .dy-stats-bar {
          display: flex;
          width: 100%;
          flex: 1;
          max-width: none !important;
          flex-direction: column;
          justify-content: space-between;
          gap: 0;
          padding: 12px 10px !important;
          border-color: rgba(255,255,255,.08);
          border-radius: 20px;
          background: #202326;
        }
        .dy-hero__stats .dy-stat-item {
          width: 100%;
          flex: 1;
          border-left: 0;
          border-top: 1px solid rgba(255,255,255,.14);
          padding: 5px 2px;
        }
        .dy-hero__stats .dy-stat-item:first-child { border-top: 0; }
        .dy-hero__stats .dy-stat-item > div:first-child { text-shadow: none !important; }
        .dy-hero__stats .dy-stat-item > div:last-child { max-width: 16ch; }
        @keyframes dyCardIn {
          from { opacity: 0; translate: 0 -12px; }
          to   { opacity: 1; translate: 0 0; }
        }
        .dy-card { animation: dyCardIn 700ms cubic-bezier(.22,.8,.3,1) backwards; }
        @media (max-width: 760px) {
          .dy-hero { min-height: 0; padding: 8px 12px 12px; }
          .dy-hero__layout { display: flex; flex-direction: column; gap: 10px; }
          .dy-hero__main { min-height: 390px; flex: 1 1 auto; }
          .dy-hero-photo { min-width: 0; border-radius: 13px; }
          .dy-hero__brand { top: 40%; width: 100%; }
          .dy-hero__logo { width: clamp(122px, 32vw, 150px); transform: translateY(-24px); }
          .dy-hero__year { font-size: 22px; transform: translateY(-26px); }
          .dy-hero__subtitle { margin-top: 6px; font-size: clamp(15px, 4.5vw, 18px); }
          .dy-hero__tagline { margin: 7px 16px 0; font-size: 10px; }
          .dy-hero__stats { height: auto; flex: 0 0 auto; }
          .dy-hero__stats .dy-stats-bar {
            display: grid;
            min-height: 154px;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            padding: 8px 6px !important;
            border-radius: 16px;
          }
          .dy-hero__stats .dy-stat-item { border: 0; padding: 5px 2px; }
          .dy-hero__stats .dy-stat-item:nth-child(n + 4) { border-top: 1px solid rgba(255,255,255,.14); }
          .dy-hero__stats .dy-stat-item > div:first-child { font-size: clamp(20px, 6vw, 26px) !important; }
          .dy-hero__stats .dy-stat-item > div:last-child { max-width: 16ch; font-size: 10px !important; }
        }
        @media (max-width: 380px) {
          .dy-hero__brand { top: 29%; }
          .dy-hero__subtitle { font-size: 15px; }
          .dy-hero__tagline { font-size: 10px; }
          .dy-hero__stats .dy-stat-item > div:last-child { font-size: 9px !important; }
        }
        @media (max-height: 500px) and (max-width: 760px) {
          .dy-hero { height: calc(100svh - var(--hh)); padding: 8px 12px; }
          .dy-hero__layout { display: grid; grid-template-columns: minmax(0, 1fr) 128px; height: 100%; gap: 8px; }
          .dy-hero__main { height: auto; min-height: 0; }
          .dy-hero-photo { max-width: 118px; }
          .dy-hero__brand { top: 26%; }
          .dy-hero__logo { width: 104px; transform: translateY(-16px); }
          .dy-hero__year { font-size: 16px; transform: translateY(-20px); }
          .dy-hero__subtitle { margin-top: 4px; font-size: 15px; }
          .dy-hero__tagline { margin-top: 5px; font-size: 9px; }
          .dy-hero__stats .dy-stats-bar { display: flex; min-height: 0; padding: 6px 4px !important; }
          .dy-hero__stats .dy-stat-item { padding: 3px 1px; }
          .dy-hero__stats .dy-stat-item > div:first-child { font-size: 21px !important; }
          .dy-hero__stats .dy-stat-item > div:last-child { font-size: 9px !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dy-card { animation: none; transition: none; }
        }
      `}</style>

      <div className="dy-hero__layout">
        <div className="dy-hero__main">
          <div className="dy-hero__gallery" aria-label="Dairy Yatra journey photographs">
            {GALLERY.map((photo, index) => (
              <PhotoCard
                key={photo.image}
                n={photo.image}
                delay={index * 80}
                style={{
                  left: `${photo.left}%`,
                  top: `${photo.top}%`,
                  '--photo-rotation': `${photo.rotate}deg`,
                  '--photo-size': `${photo.size}%`,
                }}
              />
            ))}
          </div>

          <div className="dy-hero__brand">
            <img className="dy-hero__logo" src={LOGO_SRC} alt="Dairy Yatra logo" draggable="false" />
            <p className="dy-hero__year">2027</p>
            <h2 className="dy-hero__subtitle">Experience the journey beyond dairy</h2>
            <p className="dy-hero__tagline">
              Travel across India. Meet the people behind dairy. Discover ideas that can transform the way we farm, produce, and grow.
            </p>
            {SHOW_HERO_CTA && (
              <button
                onClick={onOpenApply}
                className="pointer-events-auto mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#3368A0] px-5 py-2 text-[12px] font-bold uppercase tracking-[0.05em] text-white transition-colors hover:bg-[#24527f]"
              >
                <span>Expression of Interest</span>
                <ChevronRight className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        <div className="dy-hero__stats relative z-10">
          <ScrollReveal animation="fade-up" delay={300} duration={600}>
            <StatsBar />
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}