import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Train, Bus, Plane } from 'lucide-react';
import { FULL_ITINERARY } from '../data/yatraData';
import ScrollReveal from './ScrollReveal';
import * as ItineraryModule from './Itinerary';
import { MAP_W, MAP_H, OUTLINE_D, BORDERS_D, ROUTE_STATES_D, project } from './indiaMapData';
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

/* Your journey texts, card photos and timeline labels live in Itinerary.jsx (MASTERS_JOURNEY_DATA).
   Add the word `export` in front of  "const MASTERS_JOURNEY_DATA"  in that file so they can be used here. */
const MASTERS = ItineraryModule.MASTERS_JOURNEY_DATA || {};

/* ------------------------------------------------------------ Map stops ---- */
const STOPS = [
  { name: 'Coimbatore', lon: 76.9558, lat: 11.0168 },
  { name: 'Tiptur', lon: 76.4774, lat: 13.2569 },
  { name: 'Kolhapur', lon: 74.2433, lat: 16.705 },
  { name: 'Baramati', lon: 74.5815, lat: 18.1514 },
  { name: 'Phaltan', lon: 74.4333, lat: 17.9833 },
  { name: 'Shrirampur', lon: 74.6563, lat: 19.6153 },
  { name: 'Anand', lon: 72.9289, lat: 22.5645 },
  { name: 'Bikaner', lon: 73.3119, lat: 28.0229 },
  { name: 'Jaipur', lon: 75.7873, lat: 26.9124 },
];
const POINTS = STOPS.map((s) => project(s.lon, s.lat));
const ROUTE = [...POINTS, POINTS[0]]; // the last leg returns to Coimbatore
const ROUTE_D = 'M' + ROUTE.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join(' L');
const CUM = ROUTE.reduce((acc, p, i) => {
  acc.push(i === 0 ? 0 : acc[i - 1] + Math.hypot(p[0] - ROUTE[i - 1][0], p[1] - ROUTE[i - 1][1]));
  return acc;
}, []);
const TOTAL_LEN = CUM[CUM.length - 1];

/* Day 1..15 -> marker on the map, and how far along the route */
const DAY_STOP = [0, 1, 1, 2, 2, 3, 4, 5, 6, 6, 6, 7, 7, 8, 0];
const DAY_LEG = [0, 1, 1, 2, 2, 3, 4, 5, 6, 6, 6, 7, 7, 8, 9];

/* One place that decides the mode of transport from the text in yatraData (case-insensitive).
   Flight / air  -> plane,  Train / rail -> train,  everything else (bus, coach, road, local transit, cab) -> bus */
const getTransportKind = (t = '') => {
  const s = String(t).toLowerCase();
  if (/flight|air|plane/.test(s)) return 'flight';
  if (/train|rail/.test(s)) return 'train';
  return 'bus';
};

const TRANSPORT_STYLE = {
  flight: { Icon: Plane, text: 'text-sky-400', color: '#0284C7', ring: '#38BDF8', ping: 'bg-sky-400/40' },
  train: { Icon: Train, text: 'text-emerald-400', color: '#059669', ring: '#34D399', ping: 'bg-emerald-400/40' },
  bus: { Icon: Bus, text: 'text-amber-400', color: '#D97706', ring: '#FBBF24', ping: 'bg-amber-400/40' },
};

/* Big icon for the moving marker on the timeline */
const getTransportMarker = (t = '') => TRANSPORT_STYLE[getTransportKind(t)];

/* ------------------------------------------------------------ Map ---- */
function RouteMap({ idx, onPick }) {
  const stop = DAY_STOP[idx] ?? 0;
  const leg = DAY_LEG[idx] ?? 0;
  const frac = CUM[leg] / TOTAL_LEN;
  const [cx, cy] = POINTS[stop];
  const label = `${STOPS[stop].name} (Day ${idx + 1})`;
  const lw = label.length * 6.1 + 18;
  const left = cx + 14 + lw > MAP_W - 4;

  return (
    <svg
      viewBox={`0 0 ${MAP_W} ${MAP_H}`}
      className="h-full w-full overflow-visible"
      role="img"
      aria-label="Map of the Dairy Yatra route across India"
    >
      <style>{`
        @keyframes jx-pulse { 0% { transform: scale(1); opacity: .75; } 100% { transform: scale(3.2); opacity: 0; } }
        .jx-pulse { transform-box: fill-box; transform-origin: center; animation: jx-pulse 1.8s ease-out infinite; }
        .jx-progress { transition: stroke-dasharray .9s cubic-bezier(.4,0,.2,1); }
      `}</style>

      {/* Background shadow: a solid copy of the country sits underneath and casts the shadow */}
      <path
        d={OUTLINE_D}
        fill="#F4EFE6"
        stroke="none"
        style={{ filter: 'drop-shadow(0 14px 18px rgba(23,39,56,0.32)) drop-shadow(0 3px 5px rgba(23,39,56,0.18))' }}
      />

      <path d={BORDERS_D} fill="rgba(23,39,56,0.05)" stroke="rgba(23,39,56,0.3)" strokeWidth="0.6" strokeLinejoin="round" />
      <path d={ROUTE_STATES_D} fill="rgba(245,158,11,0.17)" stroke="none" />
      <path d={OUTLINE_D} fill="none" stroke="rgba(23,39,56,0.75)" strokeWidth="1.3" strokeLinejoin="round" />

      <path d={ROUTE_D} fill="none" stroke="rgba(23,39,56,0.45)" strokeWidth="1.4" strokeDasharray="3 5" strokeLinecap="round" />
      <path
        className="jx-progress"
        d={ROUTE_D}
        pathLength="1"
        fill="none"
        stroke="#E8920B"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray={`${frac} 1.01`}
        style={{ filter: 'drop-shadow(0 0 3px rgba(232,146,11,0.55))' }}
      />

      {POINTS.map(([x, y], i) => {
        const visited = i <= leg;
        return (
          <g key={STOPS[i].name} style={{ cursor: 'pointer' }} onClick={() => onPick(DAY_STOP.indexOf(i))}>
            <circle cx={x} cy={y} r="11" fill="transparent" />
            <circle cx={x} cy={y} r="4" fill={visited ? '#E8920B' : '#F4EFE6'} stroke={visited ? '#fff' : 'rgba(23,39,56,0.65)'} strokeWidth="1.4" />
          </g>
        );
      })}

      <circle className="jx-pulse" cx={cx} cy={cy} r="6" fill="#F59E0B" />
      <circle cx={cx} cy={cy} r="6.5" fill="#F59E0B" stroke="#fff" strokeWidth="1.6" style={{ filter: 'drop-shadow(0 0 6px rgba(245,158,11,0.9))' }} />
      <g transform={`translate(${left ? cx - 14 - lw : cx + 14} ${cy - 12})`} style={{ transition: 'transform .5s ease' }}>
        <rect width={lw} height="24" rx="7" fill="#172738" stroke="rgba(245,158,11,0.9)" strokeWidth="1" />
        <text x={lw / 2} y="16" textAnchor="middle" fontSize="11.5" fontWeight="600" fill="#FFF3D6" style={{ fontFamily: '"DM Sans", system-ui, sans-serif' }}>
          {label}
        </text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------ Section ---- */
export default function InteractiveMap({ id = 'interactive-map', altId = 'itinerary' }) {
  const total = FULL_ITINERARY.length;
  const [idx, setIdx] = useState(0);
  const [dir, setDir] = useState('next');
  const [fading, setFading] = useState(false);

  const idxRef = useRef(0);
  const trackRef = useRef(null);
  const timelineRef = useRef(null);
  const auto = useRef(false);
  const touchX = useRef(null);

  const item = FULL_ITINERARY[idx] || FULL_ITINERARY[0];
  const m = MASTERS[item.day];
  const pct = Math.round(((idx + 1) / total) * 100);

  const goTo = useCallback((t) => {
    if (t === idxRef.current) return;
    setDir(t > idxRef.current ? 'next' : 'prev');
    setFading(true);
    idxRef.current = t;
    setIdx(t);
    setTimeout(() => setFading(false), 300);
  }, []);

  // Scrolling the page (on large screens) moves the journey forward while the section stays pinned
  useEffect(() => {
    const onScroll = () => {
      if (!trackRef.current || auto.current || window.innerWidth < 1024) return;
      const rect = trackRef.current.getBoundingClientRect();
      const dist = rect.height - window.innerHeight;
      if (dist <= 0) return;
      const progress = -rect.top;
      if (progress >= 0 && progress <= dist) {
        goTo(Math.min(Math.floor((progress / dist) * total), total - 1));
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
        setTimeout(() => { auto.current = false; }, 700);
      }
    },
    [goTo, total]
  );

  // keep the active day visible in the timeline
  useEffect(() => {
    const node = timelineRef.current?.children[idx];
    if (node) node.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, [idx]);

  return (
    <section
      id={id}
      className="relative bg-[#F4EFE6] px-4 py-16 font-sans text-[#172738] sm:px-6 md:py-24"
      style={{ overflowX: 'clip' }}
    >
      <span id={altId} className="absolute top-0" aria-hidden="true" />
      <div className="pointer-events-none absolute right-0 top-0 h-[550px] w-[550px] max-w-full rounded-full bg-[#f2b134]/15 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 left-0 h-[550px] w-[550px] max-w-full rounded-full bg-[#C8DFDB]/40 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <ScrollReveal animation="fade-down" duration={700}>
          <div className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="mb-4 font-serif text-3xl font-bold tracking-tight text-[#172738] sm:text-4xl md:text-5xl">
              Traversing 5 States Across India
            </h2>
            <p className="text-base text-[#4E657D] sm:text-lg">
              Explore the 15-day corridor step by step, from Tamil Nadu through Karnataka, Maharashtra, Gujarat and Rajasthan.
              Scroll, tap a stop on the map, or pick a day on the timeline.
            </p>
          </div>
        </ScrollReveal>

        {/* The track gives the page room to scroll while the journey stays pinned (large screens) */}
        <div ref={trackRef} className="relative lg:h-[var(--track-h)]" style={{ '--track-h': `${Math.max(total * 12, 140)}vh` }}>
          <div className="lg:sticky lg:top-24">
            <div className="grid gap-5 lg:grid-cols-12 lg:items-center">

              {/* Map: sits on the page with a soft shadow underneath.
                  Height is capped to the viewport so it never runs off the bottom at any zoom level. */}
              <div className="relative flex items-center justify-center lg:col-span-7">
                <div className="mx-auto max-w-[780px]" style={{ aspectRatio: `${MAP_W} / ${MAP_H}`, width: `min(100%, calc((100vh - 130px) * ${MAP_W / MAP_H}))` }}>
                  <RouteMap idx={idx} onPick={(i) => scrollToDay(Math.max(i, 0))} />
                </div>
              </div>

              {/* Journey panel */}
              <div className="relative flex flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#142538] p-5 shadow-[0_24px_50px_rgba(23,39,56,0.28)] sm:p-8 lg:col-span-5" onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }} onTouchEnd={(e) => { if (touchX.current === null) return; const dx = e.changedTouches[0].clientX - touchX.current; touchX.current = null; if (Math.abs(dx) > 60) scrollToDay(idx + (dx < 0 ? 1 : -1)); }}>
                <div className="pointer-events-none absolute right-0 top-0 h-[360px] w-[360px] rounded-full bg-[#66A3BF]/15 blur-[90px]" />

                <div className="relative z-10 grid items-center gap-6 md:grid-cols-1 xl:grid-cols-[190px_1fr] md:gap-8">
                  {/* Single day photo (no overlapping cards, no extra text) */}
                  <div className="flex items-center justify-center">
                    {DAY_IMAGES[item.day - 1] && (
                      <img
                        key={`img-${item.day}`}
                        src={DAY_IMAGES[item.day - 1]}
                        alt={m.title || item.institution}
                        loading="lazy"
                        className={`aspect-[4/5] w-[170px] rounded-2xl object-cover shadow-[0_14px_30px_rgba(0,0,0,0.45)] ring-1 ring-white/20 transition-all duration-500 sm:w-[190px] ${
                          fading ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                        }`}
                      />
                    )}
                  </div>

                  {/* Text: day, title and description only */}
                  <div className="overflow-hidden text-center md:text-left">
                    <div
                      key={`txt-${item.day}`}
                      className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                        fading ? (dir === 'next' ? '-translate-x-6 opacity-0' : 'translate-x-6 opacity-0') : 'translate-x-0 opacity-100'
                      }`}
                    >
                      <div className="mb-2 text-[12px] font-bold text-[#C8DFDB]">
                        Day {item.day}
                      </div>

                      <h3 className="mb-2 font-sans text-xl font-bold tracking-tight text-white sm:text-2xl">
                        {m?.title || item.institution}
                      </h3>
                      <p className="text-[13px] font-light leading-relaxed text-[#F2EFE7]/85 sm:text-sm">
                        {m?.headlineCopy || item.objective}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Controls + timeline */}
                <div className="relative z-10 mt-6 border-t border-white/15 pt-5">
                  <div className="mb-3 flex items-center justify-end text-xs text-white/60">
                    <span className="text-[11px] font-bold uppercase tracking-widest text-[#C8DFDB]">{pct}% Journey Traversed</span>
                  </div>

                  <div className="relative pb-2 pt-4">
                    <div className="relative h-1 overflow-hidden rounded-full bg-white/20">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-[#66A3BF] via-[#C8DFDB] to-[#3368A0] shadow-[0_0_10px_rgba(102,163,191,0.8)] transition-all duration-500"
                        style={{ width: `${(idx / Math.max(total - 1, 1)) * 100}%` }}
                      />
                    </div>

                    <div ref={timelineRef} className="no-scrollbar relative -mt-4 flex items-center justify-between overflow-x-auto py-2">
                      {FULL_ITINERARY.map((d, i) => {
                        const active = i === idx;
                        const done = i <= idx;
                        const node = MASTERS[d.day] || {};
                        const { Icon, color, ring, ping } = getTransportMarker(d.transport);
                        return (
                          <button
                            key={d.day}
                            type="button"
                            onClick={() => scrollToDay(i)}
                            title={`Day ${d.day}: ${node.title || d.institution}`}
                            className="group flex shrink-0 cursor-pointer flex-col items-center px-2 py-1 transition-all focus:outline-none sm:px-3"
                          >
                            <div className="relative flex items-center justify-center">
                              {active ? (
                                <div className="relative flex items-center justify-center">
                                  <span className={`pointer-events-none absolute h-9 w-9 animate-ping rounded-full sm:h-10 sm:w-10 ${ping}`} />
                                  {/* Marker follows the day's mode of transport: train, flight or bus */}
                                  <div
                                    className="z-10 flex h-8 w-8 scale-110 items-center justify-center rounded-full bg-white shadow-xl ring-2 sm:h-9 sm:w-9"
                                    style={{ '--tw-ring-color': ring }}
                                  >
                                    <Icon className="h-4 w-4 sm:h-[18px] sm:w-[18px]" style={{ color }} strokeWidth={2.2} />
                                  </div>
                                </div>
                              ) : (
                                <div className={`rounded-full transition-all duration-300 ${done ? 'h-3 w-3 bg-[#66A3BF] hover:scale-125' : 'h-2.5 w-2.5 bg-white/40 hover:bg-white group-hover:scale-125'}`} />
                              )}
                            </div>
                            <div className="mt-2 text-center">
                              <span className={`block text-[11px] font-bold transition-colors sm:text-xs ${active ? 'font-extrabold text-white underline decoration-[#66A3BF] decoration-2 underline-offset-4' : done ? 'text-white/80' : 'text-white/40 group-hover:text-white/70'}`}>
                                {node.timelineLabel || `Day ${d.day}`}
                              </span>
                              <span className={`block text-[9px] transition-colors sm:text-[10px] ${active ? 'font-medium text-[#C8DFDB]' : 'hidden text-white/30 md:block'}`}>
                                {node.subLabel || d.location}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}