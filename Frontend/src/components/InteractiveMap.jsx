import React, { useState, useEffect, useRef, useCallback } from 'react';
import { MAP_W, MAP_H, OUTLINE_D, BORDERS_D, ROUTE_STATE_SHAPES } from './indiaMapData';
import day1Image from '../../dairy_yatra_15_day_images/day1.jpeg';
import akshayakalpaImage from '../assets/route/akshayakalpa.jpg';
import gokulImage from '../assets/route/gokul.jpg';
import nddbImage from '../assets/route/nddb.jpg';
import amulImage from '../assets/route/amul.jpg';
import banasImage from '../assets/route/banas.jpg';
import cirbImage from '../assets/route/cirb.jpg';
import pdfaImage from '../assets/route/pdfa.jpg';
import day12Image from '../../dairy_yatra_15_day_images/day12.jpeg';
import farmersImage from '../assets/route/farmers.jpg';

/* ------------------------------------------------------------ Stops ----
   The journey, one stop at a time, in travel order. Scrolling (or swiping) moves to the next stop.
   place  = small line above the heading
   title  = the heading
   text   = the description
   state  = which state on the map (a code from ROUTE_ORDER below)
   media  = the full-screen background. A photo: { type: 'image', src: photo }.
            A video later: { type: 'video', src: clip, poster: photo } (import the clip like the photos above). */
const STOPS = [
  {
    place: 'Coimbatore, Tamil Nadu',
    title: 'Journey Begins',
    text: 'Kumaraguru Institutions sets the stage for Dairy Yathra by igniting the vision and setting the stage for a transformative dairy learning journey.',
    state: 'TN',
    media: { type: 'image', src: day1Image },
  },
  {
    place: 'Tiptur, Karnataka',
    title: 'Akshayakalpa Organic',
    text: 'Akshayakalpa Organic promotes sustainable dairy farming through organic production practices, farmer capacity building, and a focus on milk quality.',
    state: 'KA',
    media: { type: 'image', src: akshayakalpaImage },
  },
  {
    place: 'Kolhapur, Maharashtra',
    title: 'Gokul Dairy',
    text: 'Gokul Dairy, a prominent cooperative dairy federation in Maharashtra, demonstrates the role of scientific cattle nutrition and cooperative management in enhancing dairy productivity.',
    state: 'MH',
    media: { type: 'image', src: gokulImage },
  },
  {
    place: 'Anand, Gujarat',
    title: 'National Dairy Development Board',
    text: "National Dairy Development Board (NDDB), a national institution dedicated to strengthening India's dairy sector, advances cooperative development, institutional capacity, and farmer-centric dairy systems.",
    state: 'GJ',
    media: { type: 'image', src: nddbImage },
  },
  {
    place: 'Anand, Gujarat',
    title: 'Amul Dairy',
    text: 'Amul Dairy, a pioneering dairy cooperative brand, exemplifies the impact of farmer-owned institutions in building an integrated dairy value chain and strengthening rural livelihoods.',
    state: 'GJ',
    media: { type: 'image', src: amulImage },
  },
  {
    place: 'Palanpur, Gujarat',
    title: 'Banas Dairy',
    text: "Banas Dairy, one of India's leading dairy cooperative organisations, showcases large-scale milk procurement, processing, and value creation through a farmer-owned enterprise model.",
    state: 'GJ',
    media: { type: 'image', src: banasImage },
  },
  {
    place: 'Bikaner, Rajasthan',
    title: 'ICAR–National Research Centre on Camel',
    text: 'ICAR–National Research Centre on Camel (NRCC) undertakes specialised research on camel health, production, and utilisation, highlighting opportunities for camel milk and diversified livestock-based livelihoods.',
    state: 'RJ',
    media: { type: 'image', src: day12Image },
  },
  {
    place: 'Hisar, Haryana',
    title: 'ICAR–Central Institute for Research on Buffaloes',
    text: 'ICAR–Central Institute for Research on Buffaloes (CIRB) advances research in buffalo genetics, breeding, and reproductive management to improve productivity and strengthen scientific dairy practices.',
    state: 'HR',
    media: { type: 'image', src: cirbImage },
  },
  {
    place: 'Ludhiana, Punjab',
    title: 'Progressive Dairy Farmers Association',
    text: 'Progressive Dairy Farmers Association (PDFA) provides a platform for progressive dairy farmers, industry stakeholders, and technology providers to exchange knowledge and explore advancements in dairy farming through its cattle show and dairy fair.',
    state: 'PB',
    media: { type: 'image', src: pdfaImage },
  },
  {
    place: 'Coimbatore, Tamil Nadu',
    title: 'Journey Concludes',
    text: 'The journey concludes with practical insights, institutional connections, and actionable ideas to strengthen dairy entrepreneurship, improve farm-level practices, and advance farmer livelihoods.',
    state: 'TN',
    media: { type: 'image', src: farmersImage },
  },
];

/* ------------------------------------------------------------ Route: states, not places ----
   The states in travel order. Codes match ROUTE_STATE_SHAPES in indiaMapData.js.
   After the last state the route returns to Tamil Nadu. */
const ROUTE_ORDER = ['TN', 'KA', 'MH', 'GJ', 'RJ', 'HR', 'PB'];

const STOP_STATE = STOPS.map((st) => ROUTE_ORDER.indexOf(st.state));
const STOP_MEDIA = STOPS.map((st) => st.media);

const STATES = ROUTE_ORDER.map((code) => ROUTE_STATE_SHAPES[code]);
const POINTS = STATES.map((st) => st.center);
const ROUTE = [...POINTS, POINTS[0]]; // the last leg returns to Tamil Nadu
const ROUTE_D = 'M' + ROUTE.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
const CUM = ROUTE.reduce((acc, pt, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + Math.hypot(pt[0] - ROUTE[i - 1][0], pt[1] - ROUTE[i - 1][1]));
  return acc;
}, []);
const TOTAL_LEN = CUM[CUM.length - 1];

/* How far along the route each stop is (the last stop completes the loop back home) */
const STOP_LEG = STOP_STATE.map((st, d) => (d === STOP_STATE.length - 1 && st === 0 ? ROUTE_ORDER.length : st));

/* ------------------------------------------------------------ Styles ---- */
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Oswald:wght@500;600;700&display=swap');
.jx-display { font-family: "Oswald", "Bebas Neue", "Arial Narrow", Impact, sans-serif; }

/* Map box: on phones it fills the height left under the text; on desktop it is sized from the screen height */
.jx-mapbox { height: 100%; max-width: 100%; aspect-ratio: ${MAP_W} / ${MAP_H}; margin: 0 auto; }
@media (min-width: 1024px) {
  .jx-mapbox { height: auto; max-width: 960px; width: min(100%, calc((100svh - 96px) * ${MAP_W / MAP_H})); }
}

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
   Renders an image or a video from a STOP_MEDIA entry. Only an `active` video plays. */
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
  const stateIdx = STOP_STATE[idx] ?? 0;
  const leg = STOP_LEG[idx] ?? 0;
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
              onClick={() => onPick(STOP_STATE.indexOf(i))}
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
   One full-screen page, pinned while you scroll: the stop's photo fills the screen,
   the map and the stop's title + text sit on top of it. Scrolling moves through the stops
   on every screen size (phones included). */
export default function InteractiveMap({ id = 'interactive-map', altId = 'itinerary' }) {
  const total = STOPS.length;
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState(null); // the stop fading out underneath
  const [inView, setInView] = useState(false);

  const idxRef = useRef(0);
  const trackRef = useRef(null);
  const stageRef = useRef(null);
  const auto = useRef(false);
  const touchX = useRef(null);

  const stop = STOPS[idx] || STOPS[0];

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
      const md = STOP_MEDIA[i];
      if (!md) return;
      const src = md.type === 'video' ? md.poster : md.src;
      if (src) {
        const img = new Image();
        img.src = src;
      }
    });
  }, [idx]);

  // How far the page can scroll while the stage stays pinned
  const scrollDistance = () => {
    const track = trackRef.current;
    if (!track) return 0;
    return track.getBoundingClientRect().height - (stageRef.current?.offsetHeight || window.innerHeight);
  };

  // Scrolling the page moves the journey forward while the section stays pinned (all screen sizes)
  useEffect(() => {
    const onScroll = () => {
      if (!trackRef.current || auto.current) return;
      const dist = scrollDistance();
      if (dist <= 0) return;
      const p = -trackRef.current.getBoundingClientRect().top;
      if (p >= 0 && p <= dist) {
        goTo(Math.min(Math.floor((p / dist) * total), total - 1));
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, [goTo, total]);

  // Jump to a stop (tap on a state, or a sideways swipe): scroll the page to that stop's position
  const scrollToDay = useCallback(
    (t) => {
      if (t < 0 || t >= total) return;
      const track = trackRef.current;
      goTo(t);
      if (!track) return;
      const dist = scrollDistance();
      if (dist > 0) {
        auto.current = true;
        const top =
          (window.scrollY || document.documentElement.scrollTop) +
          track.getBoundingClientRect().top +
          (t / Math.max(total - 1, 1)) * dist +
          10;
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

      {/* The track gives the page room to scroll while the journey stays pinned.
          Phones get a little more scroll per stop, so each stop can be read. */}
      <div
        ref={trackRef}
        className="relative h-[var(--track-m)] lg:h-[var(--track-h)]"
        style={{ '--track-h': `${Math.max(total * 22, 160)}vh`, '--track-m': `${Math.max(total * 30, 220)}vh` }}
      >
        <div
          ref={stageRef}
          className="sticky top-0 isolate h-[100svh] overflow-hidden bg-[#0B1622] text-white"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          {/* 1. Full-screen background for the stop (image now, video later) */}
          <div className="absolute inset-0" style={{ zIndex: 0 }} aria-hidden="true">
            {prev !== null && prev !== idx && (
              <div key={`bg-${prev}`} className="jx-bg absolute inset-0">
                <StopMedia media={STOP_MEDIA[prev]} className="h-full w-full object-cover" />
              </div>
            )}
            <div key={`bg-${idx}`} className="jx-bg absolute inset-0">
              <StopMedia media={STOP_MEDIA[idx]} active={inView} eager className="h-full w-full object-cover" />
            </div>
          </div>

          {/* 2. Shading so the map and text stay readable on any footage */}
          <div className="pointer-events-none absolute inset-0" style={{ zIndex: 1 }} aria-hidden="true">
            <div className="absolute inset-0 bg-[#0B1622]/30" />
            <div className="absolute inset-0 bg-gradient-to-l from-[#0B1622]/85 via-[#0B1622]/35 to-transparent max-lg:hidden" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0B1622]/85 via-[#0B1622]/45 to-[#0B1622]/70 lg:hidden" />
            <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[#0B1622]/60 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#0B1622]/75 to-transparent" />
          </div>

          {/* 3. Phones: text on top, map fills the rest. Desktop: map (left) + text (right).
                 Top padding leaves room for the fixed header. */}
          <div
            className="relative mx-auto grid h-full max-w-[1440px] grid-cols-1 grid-rows-[auto_minmax(0,1fr)] gap-3 px-5 pb-8 pt-[76px] sm:px-8 lg:grid-cols-12 lg:grid-rows-none lg:items-center lg:gap-6 lg:px-12 lg:pb-3 lg:pt-[84px]"
            style={{ zIndex: 3 }}
          >
            {/* Map */}
            <div className="order-2 flex min-h-0 items-center justify-center lg:order-1 lg:col-span-7 lg:-ml-6 lg:h-full">
              <div className="jx-mapbox">
                <RouteMap idx={idx} onPick={(i) => scrollToDay(Math.max(i, 0))} />
              </div>
            </div>

            {/* Content: plain text on the background, no box */}
            <div className="order-1 flex min-w-0 flex-col lg:order-2 lg:col-span-5">
              <div key={`txt-${idx}`}>
                <p className="jx-rise-2 mb-1.5 text-[11.5px] font-bold uppercase tracking-[0.2em] text-[#F5A524] lg:mb-3 lg:text-[14px]">
                  {stop.place}
                </p>
                <h3 className="jx-rise-2 jx-display mb-2 line-clamp-2 text-[1.6rem] font-semibold uppercase leading-[1.02] tracking-tight text-white [text-shadow:0_4px_24px_rgba(0,0,0,0.45)] sm:text-[2.1rem] lg:mb-5 lg:line-clamp-none lg:text-[clamp(2rem,3.4vw,3.6rem)]">
                  {stop.title}
                </h3>

                <p className="jx-rise-3 line-clamp-4 max-w-lg text-[13.5px] font-light leading-relaxed text-white/90 sm:text-[15px] lg:line-clamp-none lg:text-[17px]">
                  {stop.text}
                </p>
              </div>

              {/* Simple gold tracker: as wide as the text, fills up as the journey moves on (no numbers or text) */}
              <div className="mt-4 h-[3px] w-full max-w-lg overflow-hidden rounded-full bg-white/20 lg:mt-8" aria-hidden="true">
                <div
                  className="h-full rounded-full bg-[#F5A524] transition-[width] duration-700 ease-out"
                  style={{ width: `${((idx + 1) / total) * 100}%`, boxShadow: '0 0 10px rgba(245,165,36,0.6)' }}
                />
              </div>
            </div>
          </div>

          {/* Phones: a small hint on the first stop that scrolling moves the journey */}
          {idx === 0 && (
            <div className="pointer-events-none absolute inset-x-0 bottom-4 z-[4] text-center text-[11px] font-bold uppercase tracking-[0.3em] text-white/70 lg:hidden">
              <span className="animate-pulse">Scroll to travel ↓</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}