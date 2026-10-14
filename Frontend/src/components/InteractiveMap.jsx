import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FULL_ITINERARY } from '../data/yatraData';
import * as ItineraryModule from './Itinerary';
import { MAP_W, MAP_H, OUTLINE_D, BORDERS_D, ROUTE_STATE_SHAPES } from './indiaMapData';
import day1Image from '../../dairy_yatra_15_day_images/day1.jpeg';
import day2Image from '../../dairy_yatra_15_day_images/day2.jpeg';
import day3Image from '../../dairy_yatra_15_day_images/day3.jpeg';
import day4Image from '../../dairy_yatra_15_day_images/day4.jpeg';
import day5Image from '../../dairy_yatra_15_day_images/day5.jpeg';
import day6Image from '../../dairy_yatra_15_day_images/day6.jpeg';
import day7Image from '../../dairy_yatra_15_day_images/day7.jpeg';
import day8Image from '../../dairy_yatra_15_day_images/day8.jpeg';
import day9Image from '../../dairy_yatra_15_day_images/day9.jpeg';
import day10Image from '../../dairy_yatra_15_day_images/day10.jpeg';
import day11Image from '../../dairy_yatra_15_day_images/day11.jpeg';
import day12Image from '../../dairy_yatra_15_day_images/day12.jpeg';
import day13Image from '../../dairy_yatra_15_day_images/day13.jpeg';
import day14Image from '../../dairy_yatra_15_day_images/day14.jpeg';
import day15Image from '../../dairy_yatra_15_day_images/day15.jpeg';

const DAY_IMAGES = [
  day1Image,
  day2Image,
  day3Image,
  day4Image,
  day5Image,
  day6Image,
  day7Image,
  day8Image,
  day9Image,
  day10Image,
  day11Image,
  day12Image,
  day13Image,
  day14Image,
  day15Image,
];

/* ------------------------------------------------------------ Media ----
   Each day's full-screen background comes from DAY_MEDIA.
   Right now every day uses its photo. To switch a day to a video later, import the
   clip and replace that day's entry. Nothing else in this file needs to change:

     import day1Video from '../../Bg videos/day1.mp4';
     DAY_MEDIA[0] = { type: 'video', src: day1Video, poster: day1Image };

   (poster = the still shown while the video loads) */
const DAY_MEDIA = DAY_IMAGES.map((src) => ({ type: 'image', src }));

/* Your journey texts, card photos and timeline labels live in Itinerary.jsx (MASTERS_JOURNEY_DATA).
   Add the word `export` in front of  "const MASTERS_JOURNEY_DATA"  in that file so they can be used here. */
const MASTERS = ItineraryModule.MASTERS_JOURNEY_DATA || {};

/* ------------------------------------------------------------ Route: states, not places ----
   The journey is shown state by state. Codes match ROUTE_STATE_SHAPES in indiaMapData.js:
   TN Tamil Nadu, KA Karnataka, MH Maharashtra, GJ Gujarat, RJ Rajasthan, HR Haryana, PB Punjab, TG Telangana */
const ROUTE_ORDER = ['TN', 'KA', 'MH', 'GJ', 'RJ', 'HR', 'PB', 'TG'];

/* Which state each day (Day 1 ... Day 15) is in, as a position in ROUTE_ORDER above
   (0 = Tamil Nadu, 1 = Karnataka, 2 = Maharashtra, 3 = Gujarat, 4 = Rajasthan, 5 = Haryana, 6 = Punjab, 7 = Telangana).
   👉 Check this against the final itinerary and change the numbers if a day is in a different state. */
const DAY_STATE = [0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 6, 6, 7, 7, 0];

const STATES = ROUTE_ORDER.map((code) => ROUTE_STATE_SHAPES[code]);
const POINTS = STATES.map((st) => st.center);
const ROUTE = [...POINTS, POINTS[0]]; // the last leg returns to Tamil Nadu
const ROUTE_D = 'M' + ROUTE.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
const CUM = ROUTE.reduce((acc, pt, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + Math.hypot(pt[0] - ROUTE[i - 1][0], pt[1] - ROUTE[i - 1][1]));
  return acc;
}, []);
const TOTAL_LEN = CUM[CUM.length - 1];

/* How far along the route each day is (the last day completes the loop back home) */
const DAY_LEG = DAY_STATE.map((st, d) => (d === DAY_STATE.length - 1 && st === 0 ? ROUTE_ORDER.length : st));

/* ------------------------------------------------------------ Styles ---- */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap');
.jx-display { font-family: "Oswald", "Bebas Neue", "Arial Narrow", Impact, sans-serif; }

@keyframes jx-fade { from { opacity: 0; } to { opacity: 1; } }
@keyframes jx-kb   { from { transform: scale(1.08); } to { transform: scale(1); } }
.jx-bg { animation: jx-fade .9s ease backwards, jx-kb 7s ease-out backwards; }

@keyframes jx-rise { from { opacity: 0; transform: translateY(18px); } to { opacity: 1; transform: none; } }
.jx-rise-1, .jx-rise-2, .jx-rise-3, .jx-rise-4 { animation: jx-rise .7s cubic-bezier(.16,1,.3,1) backwards; }
.jx-rise-1 { animation-delay: .05s; }
.jx-rise-2 { animation-delay: .14s; }
.jx-rise-3 { animation-delay: .24s; }
.jx-rise-4 { animation-delay: .32s; }

@keyframes jx-pulse { 0% { transform: scale(1); opacity: .75; } 100% { transform: scale(3.2); opacity: 0; } }
.jx-pulse { transform-box: fill-box; transform-origin: center; animation: jx-pulse 1.8s ease-out infinite; }
.jx-progress { transition: stroke-dasharray .9s cubic-bezier(.4,0,.2,1); }

@media (prefers-reduced-motion: reduce) {
  .jx-bg { animation: jx-fade .3s ease backwards; }
  .jx-rise-1, .jx-rise-2, .jx-rise-3, .jx-rise-4, .jx-pulse { animation: none; }
}
`;

/* ------------------------------------------------------------ Media tile ----
   Renders an image or a video from a DAY_MEDIA entry. Only an `active` video plays. */
function StopMedia({ media, alt = '', active = false, eager = false, className = '' }) {
  const ref = useRef(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    if (active) {
      const p = v.play();
      if (p && p.catch) p.catch(() => {});
    } else {
      v.pause();
    }
  }, [active, media?.src]);

  if (!media) return null;

  if (media.type === 'video') {
    // The fading-out layer just shows its poster / first frame
    if (!active && media.poster) {
      return <img src={media.poster} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className={className} />;
    }
    return (
      <video
        ref={ref}
        src={media.src}
        poster={media.poster}
        muted
        loop
        playsInline
        autoPlay={active}
        preload={active ? 'auto' : 'metadata'}
        aria-label={alt || undefined}
        className={className}
      />
    );
  }

  return <img src={media.src} alt={alt} loading={eager ? 'eager' : 'lazy'} decoding="async" className={className} />;
}

/* ------------------------------------------------------------ Map ----
   A fixed (non-moving) map of India. Only the route progress and the active marker change.
   It is see-through so the background shows behind it. */
function RouteMap({ idx, onPick }) {
  const stateIdx = DAY_STATE[idx] ?? 0;
  const leg = DAY_LEG[idx] ?? 0;
  const frac = CUM[leg] / TOTAL_LEN;
  const [cx, cy] = POINTS[stateIdx];

  // state name next to the current state (no place, no day)
  const label = STATES[stateIdx].name;
  const fs = 12;
  const lh = 24;
  const lw = label.length * 6.8 + 22;
  const gap = 12;
  const left = cx + gap + lw > MAP_W - 4;

  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      className="h-full w-full"
      style={{ overflow: 'visible' }}
      role="img"
      aria-label={`Map of the Dairy Yatra route across India. Now in ${label}.`}
    >
      <g style={{ pointerEvents: 'auto' }}>
        {/* Country: a translucent glass fill so the background shows through */}
        <path d={OUTLINE_D} fill="rgba(244,239,230,0.10)" stroke="none" style={{ filter: 'drop-shadow(0 10px 22px rgba(0,0,0,0.35))' }} />
        <path d={BORDERS_D} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.32)" strokeWidth="0.6" strokeLinejoin="round" />

        {/* The route states: upcoming = faint gold, visited = gold, current = bright gold */}
        {STATES.map((st, i) => {
          const current = i === stateIdx;
          const visited = i <= leg;
          return (
            <path
              key={ROUTE_ORDER[i]}
              d={st.d}
              fill={current ? 'rgba(245,165,36,0.62)' : visited ? 'rgba(245,165,36,0.34)' : 'rgba(245,165,36,0.12)'}
              stroke={current ? '#F5A524' : 'rgba(245,165,36,0.45)'}
              strokeWidth={current ? 1.6 : 0.8}
              strokeLinejoin="round"
              style={{
                cursor: 'pointer',
                transition: 'fill .6s ease, stroke .6s ease, stroke-width .6s ease',
                filter: current ? 'drop-shadow(0 0 8px rgba(245,165,36,0.6))' : 'none',
              }}
              onClick={() => onPick(DAY_STATE.indexOf(i))}
            >
              <title>{st.name}</title>
            </path>
          );
        })}

        <path d={OUTLINE_D} fill="none" stroke="rgba(255,248,235,0.9)" strokeWidth="1.3" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.55))', pointerEvents: 'none' }} />

        {/* Traversal: dashed full route between the states + the gold part travelled so far */}
        <g style={{ pointerEvents: 'none' }}>
          <path d={ROUTE_D} fill="none" stroke="rgba(255,255,255,0.55)" strokeWidth="1.4" strokeDasharray="3 5" strokeLinecap="round" />
          <path
            className="jx-progress"
            d={ROUTE_D}
            pathLength="1"
            fill="none"
            stroke="#F5A524"
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray={`${frac} 1.01`}
            style={{ filter: 'drop-shadow(0 0 3px rgba(245,165,36,0.75))' }}
          />

          {POINTS.map(([x, y], i) => (
            <circle
              key={ROUTE_ORDER[i]}
              cx={x}
              cy={y}
              r="4"
              fill={i <= leg ? '#F5A524' : 'rgba(255,255,255,0.85)'}
              stroke={i <= leg ? '#fff' : 'rgba(23,39,56,0.8)'}
              strokeWidth="1.4"
            />
          ))}

          {/* Current state */}
          <circle className="jx-pulse" cx={cx} cy={cy} r="6" fill="#F5A524" />
          <circle cx={cx} cy={cy} r="6.5" fill="#F5A524" stroke="#fff" strokeWidth="1.6" style={{ filter: 'drop-shadow(0 0 5px rgba(245,165,36,0.95))' }} />
          <g transform={`translate(${left ? cx - gap - lw : cx + gap} ${cy - lh / 2})`}>
            <rect width={lw} height={lh} rx={7} fill="rgba(11,22,34,0.88)" stroke="rgba(245,165,36,0.9)" strokeWidth={1} />
            <text x={lw / 2} y={lh / 2 + fs * 0.36} textAnchor="middle" fontSize={fs} fontWeight="600" fill="#FFF3D6" style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}>
              {label}
            </text>
          </g>
        </g>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------ Section ----
   One full-screen page: the day's photo fills the screen, the map sits on the left and
   the day's title + text on the right. No heading above it. */
export default function InteractiveMap({ id = 'interactive-map', altId = 'itinerary' }) {
  const total = FULL_ITINERARY.length;
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState(null); // the day fading out underneath
  const [inView, setInView] = useState(false);

  const idxRef = useRef(0);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const auto = useRef(false);
  const touchX = useRef(null);

  const item = FULL_ITINERARY[idx] || FULL_ITINERARY[0];
  const m = MASTERS[item.day];

  const goTo = useCallback((t) => {
    if (t === idxRef.current) return;
    setPrev(idxRef.current);
    idxRef.current = t;
    setIdx(t);
  }, []);

  // Only play the background video while the section is on screen
  useEffect(() => {
    const el = stageRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      setInView(true);
      return undefined;
    }
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.15 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Warm up the next / previous backgrounds so the change is instant
  useEffect(() => {
    [idx - 1, idx + 1].forEach((i) => {
      const md = DAY_MEDIA[i];
      if (!md) return;
      const src = md.type === 'video' ? md.poster : md.src;
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [idx]);

  // Scrolling the page (on large screens) moves the journey forward while the section stays pinned
  useEffect(() => {
    const onScroll = () => {
      if (!trackRef.current || auto.current || window.innerWidth < 1024) return;
      const rect = trackRef.current.getBoundingClientRect();
      const dist = rect.height - window.innerHeight;
      if (dist <= 0) return;
      const p = -rect.top;
      if (p >= 0 && p <= dist) {
        goTo(Math.min(Math.floor((p / dist) * total), total - 1));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [goTo, total]);

  // Jump to a day: on large screens scroll the page to that day's position, otherwise just switch
  const scrollToDay = useCallback(
    (t) => {
      if (t < 0 || t >= total) return;
      const track = trackRef.current;
      if (!track || window.innerWidth < 1024) {
        goTo(t);
        return;
      }
      const rect = track.getBoundingClientRect();
      const dist = rect.height - window.innerHeight;
      goTo(t);
      if (dist > 0) {
        auto.current = true;
        const top = (window.scrollY || document.documentElement.scrollTop) + rect.top + (t / Math.max(total - 1, 1)) * dist + 10;
        window.scrollTo({ top, behavior: 'smooth' });
        setTimeout(() => {
          auto.current = false;
        }, 900);
      }
    },
    [goTo, total]
  );

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 60) {
      if (dx < 0) scrollToDay(idx + 1);
      else scrollToDay(idx - 1);
    }
  };

  return (
    <section id={id} className="relative bg-[#0B1622] font-sans text-white" style={{ overflowX: 'clip' }}>
      <style>{STYLES}</style>
      <span id={altId} className="absolute top-0" aria-hidden="true" />

      {/* The track gives the page room to scroll while the journey stays pinned (large screens) */}
      <div ref={trackRef} className="relative lg:h-[var(--track-h)]" style={{ '--track-h': `${Math.max(total * 22, 160)}vh` }}>
        <div
          ref={stageRef}
          className="relative isolate min-h-[100svh] overflow-hidden bg-[#0B1622] text-white lg:sticky lg:top-0 lg:h-[100svh]"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* 1. Full-screen background for the day (image now, video later) */}
          <div className="absolute inset-0" style={{ zIndex: 0 }} aria-hidden="true">
            {prev !== null && prev !== idx && (
              <div key={`bg-${prev}`} className="jx-bg absolute inset-0">
                <StopMedia media={DAY_MEDIA[prev]} className="h-full w-full object-cover" />
              </div>
            )}
            <div key={`bg-${idx}`} className="jx-bg absolute inset-0">
              <StopMedia media={DAY_MEDIA[idx]} active={inView} eager className="h-full w-full object-cover" />
            </div>
          </div>

          {/* 2. Shading so the map and text stay readable on any footage */}
          <div className="pointer-events-none absolute inset-0" style={{ zIndex: 1 }} aria-hidden="true">
            <div className="absolute inset-0 bg-[#0B1622]/30" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#0B1622]/85 via-[#0B1622]/35 to-transparent" />
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0B1622]/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0B1622]/75 to-transparent" />
          </div>

          {/* 3. Map (left) + content (right). Top padding leaves room for the fixed header. */}
          <div
            className="relative mx-auto grid min-h-[100svh] max-w-[1440px] grid-cols-1 content-center gap-8 px-4 pb-10 pt-24 sm:px-8 lg:h-full lg:min-h-0 lg:grid-cols-12 lg:items-center lg:gap-6 lg:px-12 lg:pb-12 lg:pt-28"
            style={{ zIndex: 3 }}
          >
            {/* Map */}
            <div className="order-2 flex items-center justify-center lg:order-1 lg:col-span-7 lg:h-full">
              <div
                className="mx-auto max-w-[560px] lg:max-w-[760px]"
                style={{ aspectRatio: `${MAP_W} / ${MAP_H}`, width: `min(100%, calc((100svh - 170px) * ${MAP_W / MAP_H}))` }}
              >
                <RouteMap idx={idx} onPick={(i) => scrollToDay(Math.max(i, 0))} />
              </div>
            </div>

            {/* Content: plain text on the background, no box */}
            <div className="order-1 flex min-w-0 flex-col lg:order-2 lg:col-span-5">
              <div key={`txt-${item.day}`}>
                <h3 className="jx-rise-2 jx-display mb-5 line-clamp-3 text-[clamp(2.2rem,4vw,4.1rem)] font-semibold uppercase leading-[0.98] tracking-tight text-white [text-shadow:0_4px_24px_rgba(0,0,0,0.45)]">
                  {m?.title || item.institution}
                </h3>

                <p className="jx-rise-3 line-clamp-5 max-w-lg text-[15px] font-light leading-relaxed text-white/85 lg:text-[17px]">
                  {m?.headlineCopy || item.objective}
                </p>
              </div>

              {/* Simple gold tracker: as wide as the text, fills up as the journey moves on (no numbers or text) */}
              <div className="mt-8 h-[3px] w-full max-w-lg overflow-hidden rounded-full bg-white/20" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-[#F5A524] transition-[width] duration-700 ease-out"
                  style={{ width: `${((idx + 1) / total) * 100}%`, boxShadow: '0 0 10px rgba(245,165,36,0.6)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}