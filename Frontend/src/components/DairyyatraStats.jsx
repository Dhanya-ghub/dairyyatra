import React, { useState, useRef, useEffect } from 'react';
import ScrollAnimatedCounter from './ScrollAnimatedCounter';

/* ---------- Font presets: change `fontPreset` prop (or the default) to switch ---------- */
const FONT_PRESETS = {
  bricolage: { // chunky, friendly numbers
    weight: 600,
    num: "'Bricolage Grotesque', system-ui, sans-serif",
    label: "'Figtree', system-ui, sans-serif",
    url: 'family=Bricolage+Grotesque:opsz,wght@12..96,600;12..96,800&family=Figtree:wght@500;600',
  },
  sora: { // clean and techy
    weight: 600,
    num: "'Sora', system-ui, sans-serif",
    label: "'DM Sans', system-ui, sans-serif",
    url: 'family=Sora:wght@600;800&family=DM+Sans:wght@500;600',
  },
  fraunces: { // warm, rural-editorial serif numbers
    weight: 600,
    num: "'Fraunces', Georgia, serif",
    label: "'Outfit', system-ui, sans-serif",
    url: 'family=Fraunces:opsz,wght@9..144,700;9..144,800&family=Outfit:wght@400;500',
  },
  playfair: { // matches the site headline: refined serif numbers, light weight
    weight: 800,
    num: "'Playfair Display', Georgia, serif",
    label: "'DM Sans', system-ui, sans-serif",
    url: 'family=Playfair+Display:wght@700;800&family=DM+Sans:wght@500;600',
  },
};

/* ---------- Data: brochure-verified, ascending ---------- */
const STATS = [
  { value: 5, label: 'States' },
  { value: 15, label: 'Days' },
  { value: 15, label: 'Farms, institutions & businesses' },
  { value: 40, label: 'Fellows' },
  { value: 150, label: 'Hours of learning' },
  { value: '6000+', unit: 'km', label: 'Journey across India' },
];

/* ---------- Section: single horizontal bar ---------- */
export default function DairyYatraStats({ fontPreset = 'playfair' }) {
  const f = FONT_PRESETS[fontPreset] || FONT_PRESETS.playfair;
  const barRef = useRef(null);
  const [popped, setPopped] = useState(null);

  // Touch: the tapped stat stays popped until you tap somewhere else
  useEffect(() => {
    if (popped === null) return;
    const close = (e) => {
      if (barRef.current && !barRef.current.contains(e.target)) setPopped(null);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [popped]);

  return (
    <section
      className="dy-stats"
      aria-label="Dairy Yatra 2025 at a glance"
      style={{ '--dy-num-font': f.num, '--dy-label-font': f.label, '--dy-num-weight': f.weight }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?${f.url}&display=swap');

        .dy-stats { width: 100%; padding: 0 16px; box-sizing: border-box; }
        .dy-stats-bar {
          width: 100%; max-width: 1200px; margin: 0 auto; padding: 24px 20px; box-sizing: border-box;
          display: flex; flex-wrap: nowrap; align-items: stretch;
          border-radius: 16px;
          background: rgba(14, 14, 16, 0.74);
          border: 1px solid rgba(255, 255, 255, 0.16);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
        }
        /* Small screens: keep one row and let it scroll sideways */
        @media (max-width: 899px) {
          .dy-stats-bar { overflow-x: auto; scrollbar-width: none; padding: 28px 16px; }
          .dy-stats-bar::-webkit-scrollbar { display: none; }
        }

        .dy-stat {
          position: relative; z-index: 1;
          flex: 1 0 auto; min-width: 120px; padding: 8px 24px; margin: 0;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          gap: 6px; text-align: center; cursor: pointer;
          background: transparent;            /* always transparent: default, hover, touch */
          outline: none; -webkit-tap-highlight-color: transparent; touch-action: manipulation;
          transition: transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.25s ease;
        }
        .dy-stat + .dy-stat::before {
          content: ''; position: absolute; left: 0; top: 14%; bottom: 14%; width: 1px;
          background: rgba(255, 255, 255, 0.12);
        }

        /* Pop-up: hover (desktop), :active / :focus (touch) */
        .dy-stat:hover, .dy-stat:active, .dy-stat:focus, .dy-stat.is-pop {
          z-index: 10;
          transform: scale(1.15) translateY(-8px);
          filter: drop-shadow(0 12px 20px rgba(0, 0, 0, 0.4));
        }

        .dy-num {
          margin: 0; order: 1; display: flex; align-items: baseline; justify-content: center; gap: 4px;
          font-family: var(--dy-num-font);
          font-weight: var(--dy-num-weight); font-size: clamp(30px, 3.4vw, 42px); line-height: 1; letter-spacing: 0;
          font-variant-numeric: lining-nums tabular-nums; font-feature-settings: 'lnum' 1, 'tnum' 1;
          color: #fff; min-width: 4ch; text-shadow: 0 0 18px rgba(255, 255, 255, 0.35);
        }
        .dy-unit { font-size: 0.45em; font-family: var(--dy-label-font); font-weight: 500; opacity: 0.9; }
        .dy-stat:nth-child(even) .dy-num { color: #FFB52E; text-shadow: 0 0 20px rgba(255, 170, 30, 0.55); }
        .dy-label {
          order: 2;
          font-family: var(--dy-label-font);
          font-weight: 600; font-size: 14.5px; line-height: 1.25; color: rgba(255, 255, 255, 0.95);
        }
      `}</style>

      <dl className="dy-stats-bar" ref={barRef}>
        {STATS.map((s, i) => (
          <div
            key={s.label}
            className={`dy-stat${popped === i ? ' is-pop' : ''}`}
            tabIndex={0}
            onPointerDown={(e) => { if (e.pointerType !== 'mouse') setPopped(i); }}
          >
            <dt className="dy-label">{s.label}</dt>
            <dd className="dy-num">
              <ScrollAnimatedCounter value={s.value} duration={2600} />
              {s.unit && <span className="dy-unit">{s.unit}</span>}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}