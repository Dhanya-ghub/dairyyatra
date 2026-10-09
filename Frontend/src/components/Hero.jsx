import React, { useState, useEffect, useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

/* ---------- Easy settings ---------- */
const SHOW_HERO_CTA = false;                           // true = show the Expression of Interest button under the subtitle
const HEADER_HEIGHT = '80px';                          // height of your sticky header
const SIZE_DIVISOR = 5.4;                              // LOWER = bigger photos (6.5 = old size, fits one screen; 5.4 = bigger, hero may scroll a little)
const LOGO_WIDTH = 2.6;                                // logo width in photo-card widths

/* Stats bar numbers. amber = shown in gold. */
const STATS = [
  { value: 5,    label: 'States' },
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

/* Logo: save it as src/assets/logo.png (or .jpg / .jpeg / .webp / .svg).
   If the file is missing the logo slot just shows the text "Dairy Yatra 2027". */
const logoModules = import.meta.glob('../assets/logo.{png,jpg,jpeg,webp,svg}', { eager: true, import: 'default' });
const LOGO_SRC = Object.values(logoModules)[0];

/* Seven staggered columns: 3 photo columns, the LOGO, then 3 photo columns.
   k     = how far down the first card hangs (in card widths)
   cards = photo numbers stacked in that column
   show  = phones show the logo + 1 column each side, tablets 2 each side, desktop 3 each side */
const COLUMNS = [
  { k: 0.9,  cards: [1, 2],   show: 'hidden lg:flex' },
  { k: 0.46, cards: [3, 4],   show: 'hidden md:flex' },
  { k: 1.0,  cards: [5],      show: 'flex' },
  { logo: true },
  { k: 0.81, cards: [6],      show: 'flex' },
  { k: 0.46, cards: [7, 8],   show: 'hidden md:flex' },
  { k: 0.9,  cards: [9, 10],  show: 'hidden lg:flex' },
];

const V_GAP = 'calc(var(--cw) * 0.085)';   // space between cards inside a column

/* ---------- Photo card ---------- */
function PhotoCard({ n, delay }) {
  const src = BY_NUMBER[n];
  return (
    <div
      className={`dy-card relative overflow-hidden rounded-xl transition-transform duration-300 ease-out will-change-transform sm:rounded-2xl ${
        src
          ? 'shadow-[0_6px_18px_rgba(0,0,0,0.14)] hover:z-10 hover:shadow-[0_16px_36px_rgba(0,0,0,0.28)] hover:[transform:perspective(700px)_rotateY(-8deg)_rotateX(4deg)_scale(1.07)]'
          : 'bg-gradient-to-b from-[#EFEFEF] to-[#F7F7F7]'
      }`}
      style={{ aspectRatio: '4 / 5', animationDelay: `${delay}ms` }}
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

/* ---------- Logo card (centre of the page) ---------- */
function LogoCard({ delay }) {
  return (
    <div
      className="dy-card flex items-center justify-center overflow-hidden rounded-2xl bg-[#F6F0E2] shadow-[0_10px_28px_rgba(0,0,0,0.16)]"
      style={{
        width: `calc(var(--cw) * ${LOGO_WIDTH})`,
        aspectRatio: '27 / 20',
        marginTop: 'calc(var(--cw) * 0.3)',
        animationDelay: `${delay}ms`,
      }}
    >
      {LOGO_SRC ? (
        <img
          src={LOGO_SRC}
          alt="Dairy Yatra 2027 - Exploring Dairy Entrepreneurship in India"
          draggable="false"
          className="h-full w-full object-contain"
        />
      ) : (
        <span
          className="px-2 text-center font-bold text-[#1B2A4A]"
          style={{ fontFamily: '"Playfair Display", Georgia, serif', fontSize: 'calc(var(--cw) * 0.28)' }}
        >
          Dairy Yatra 2027
        </span>
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
      className={`flex flex-col items-center justify-center px-2 text-center md:border-l md:border-white/15 md:first:border-l-0 ${
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
      className="mx-auto grid w-full grid-cols-3 gap-y-5 rounded-2xl border border-white/5 bg-[#1A1A1A] shadow-[0_10px_30px_rgba(0,0,0,0.25)] md:flex md:items-stretch md:gap-y-0"
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
      className="dy-hero relative overflow-hidden bg-white font-sans select-none"
      style={{
        '--hh': HEADER_HEIGHT,
        /* One size unit drives the whole layout: as wide as the screen allows
           (--u = total width in card units, logo included), limited by height. */
        '--cw': `clamp(66px, min(calc(88vw / var(--u)), calc((100svh - var(--hh)) / ${SIZE_DIVISOR})), 280px)`,
      }}
    >
      <style>{`
        /* --n = number of columns shown (logo included), --u = their total width in card units */
        .dy-hero { --n: 3; --u: ${2 + LOGO_WIDTH}; }
        @media (min-width: 768px)  { .dy-hero { --n: 5; --u: ${4 + LOGO_WIDTH}; } }
        @media (min-width: 1024px) { .dy-hero { --n: 7; --u: ${6 + LOGO_WIDTH}; } }
        @keyframes dyCardIn {
          from { opacity: 0; transform: translateY(-28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .dy-card { animation: dyCardIn 700ms cubic-bezier(.22,.8,.3,1) backwards; }
        @media (prefers-reduced-motion: reduce) {
          .dy-card { animation: none; transition: none; }
        }
      `}</style>

      {/* Photo columns hanging from the top edge, logo in the middle */}
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 z-0 overflow-hidden"
        style={{ height: 'calc(var(--cw) * 5.2)' }}
      >
        <div
          className="mx-auto flex h-full items-start justify-center"
          style={{
            columnGap: 'max(calc(var(--cw) * 0.085), calc((88% - var(--u) * var(--cw)) / (var(--n) - 1)))',
          }}
        >
          {COLUMNS.map((col, ci) => {
            if (col.logo) {
              return <LogoCard key="logo" delay={ci * 80} />;
            }
            return (
              <div key={ci} className={`${col.show} flex-col`} style={{ width: 'var(--cw)', rowGap: V_GAP }}>
                {/* blank card hanging from the top edge */}
                <div
                  className="dy-card rounded-b-xl bg-gradient-to-b from-[#ECECEC] to-[#F8F8F8] shadow-[0_2px_8px_rgba(0,0,0,0.04)] sm:rounded-b-2xl"
                  style={{ height: `calc(var(--cw) * ${col.k})`, animationDelay: `${ci * 80}ms` }}
                />
                {col.cards.map((n, ri) => (
                  <PhotoCard key={n} n={n} delay={ci * 80 + (ri + 1) * 120} />
                ))}
                {/* faint hairline under each column */}
                <div
                  className="mx-auto w-px"
                  style={{
                    height: 'calc(var(--cw) * 1.3)',
                    background: `linear-gradient(to bottom, ${
                      ci === 1 || ci === 5 ? 'rgba(235,150,80,0.30)' : 'rgba(0,0,0,0.07)'
                    }, rgba(0,0,0,0))`,
                  }}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Text block: starts just below the logo */}
      <div
        className="pointer-events-none relative z-10 flex flex-col items-center px-4 text-center"
        style={{ paddingTop: 'calc(var(--cw) * 2.95)' }}
      >
        <ScrollReveal animation="fade-up" delay={160} duration={600}>
          <h1
            className="font-bold leading-[1.08] tracking-tight"
            style={{
              fontFamily: '"Playfair Display", "Cinzel", "Cormorant Garamond", Georgia, serif',
              fontSize: 'max(24px, calc(var(--cw) * 0.42))',
            }}
          >
            <span className="block text-[#111111]">Experience the journey</span>
            <span className="block text-[#878787]">beyond dairy</span>
          </h1>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" delay={220} duration={600}>
          <p
            className="mx-auto leading-relaxed text-[#1F2937]"
            style={{
              fontSize: 'max(12px, calc(var(--cw) * 0.17))',
              maxWidth: 'min(100%, calc(var(--cw) * 6.2))',
              marginTop: 'calc(var(--cw) * 0.2)',
            }}
          >
            Travel across India. Meet the people behind dairy. Discover ideas that can transform the way we farm, produce, and grow.
          </p>
        </ScrollReveal>

        {SHOW_HERO_CTA && (
          <ScrollReveal animation="fade-up" delay={280} duration={600}>
            <button
              onClick={onOpenApply}
              className="pointer-events-auto mt-4 inline-flex cursor-pointer items-center gap-1.5 rounded-full bg-[#2B6CB0] px-5 py-2 text-[12px] font-bold uppercase tracking-[0.05em] text-white transition-colors hover:bg-[#1E56A0]"
            >
              <span>Expression of Interest</span>
              <ChevronRight className="h-4 w-4" />
            </button>
          </ScrollReveal>
        )}
      </div>

      {/* Stats bar: solid dark card directly under the text */}
      <div
        className="relative z-10 px-4 sm:px-6"
        style={{ marginTop: 'calc(var(--cw) * 0.3)', paddingBottom: 'calc(var(--cw) * 0.3)' }}
      >
        <ScrollReveal animation="fade-up" delay={300} duration={600}>
          <StatsBar />
        </ScrollReveal>
      </div>
    </section>
  );
}