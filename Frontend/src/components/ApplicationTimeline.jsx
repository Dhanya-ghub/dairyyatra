import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Megaphone, UserCheck, GraduationCap, Route } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

/* The 9 milestones grouped into 4 phases. Rename a phase or move a milestone by editing this list. */
const phases = [
  {
    name: 'Apply',
    Icon: Megaphone,
    period: 'Oct – Nov 2026',
    milestones: [
      { date: '10 October 2026', dateTime: '2026-10-10', title: 'Announcement' },
      { date: '12 October 2026', dateTime: '2026-10-12', title: 'Expression of Interest (EOI) Opens' },
      { date: '12 November 2026', dateTime: '2026-11-12', title: 'EOI Closes' },
    ],
  },
  {
    name: 'Selection',
    Icon: UserCheck,
    period: 'Nov 2026',
    milestones: [
      { date: '15 November 2026', dateTime: '2026-11-15', title: 'Cohort Selection Announcement' },
      { date: '25 November 2026', dateTime: '2026-11-25', title: 'Payment Completion' },
    ],
  },
  {
    name: 'Prepare',
    Icon: GraduationCap,
    period: 'Dec 2026 – Jan 2027',
    milestones: [
      { date: '19–20 December 2026', dateTime: '2026-12-19', endDateTime: '2026-12-20', title: 'Scientific Dairy Farm Management Workshop' },
      { date: '26 January 2027', dateTime: '2027-01-26', title: 'Dairy Yatra 2027 Launch' },
    ],
  },
  {
    name: 'The Journey',
    Icon: Route,
    period: '1 – 15 Feb 2027',
    milestones: [
      { date: '1 February 2027', dateTime: '2027-02-01', title: 'Journey Begins' },
      { date: '15 February 2027', dateTime: '2027-02-15', title: 'Journey Ends' },
    ],
  },
];

/* Blue and white only: one shade of blue per phase, dark to light */
const BLUES = ['#14284B', '#1E4E8C', '#2B6CB0', '#4A8FCC'];
const NAVY = '#14284B';
const TRACK = '#CFDCEC'; // the grey-blue line
const pad2 = (n) => String(n).padStart(2, '0');

/* Height of the white header once you have scrolled */
const HEADER_HEIGHT = '72px';

/* Today's date as YYYY-MM-DD in the visitor's own time zone */
const todayISO = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;
};

/* Desktop sizes: label row height + gap + circle, so the line runs through the circle centres */
const LABEL_H = 28;
const LABEL_GAP = 14;
const CIRCLE = 68;
const LINE_Y = LABEL_H + LABEL_GAP + CIRCLE / 2;

/* The milestones of one phase */
function Milestones({ phase, color, current, today }) {
  return (
    <ul className="dy-tl-ms space-y-3">
      {phase.milestones.map((m) => {
        const isCurrent = current?.key === m.dateTime;
        const past = (m.endDateTime || m.dateTime) < today;
        return (
          <li key={m.dateTime} className="flex gap-2.5" aria-current={isCurrent ? 'step' : undefined}>
            <span className="relative mt-[6px] flex h-2 w-2 shrink-0">
              {isCurrent && <span className="absolute inline-flex h-full w-full animate-ping rounded-full" style={{ backgroundColor: color, opacity: 0.5 }} />}
              <span
                className="relative inline-flex h-2 w-2 rounded-full border"
                style={{ borderColor: color, backgroundColor: past || isCurrent ? color : '#FFFFFF' }}
              />
            </span>
            <div className="min-w-0">
              <time dateTime={m.dateTime} className="block text-[11px] font-semibold uppercase tracking-wider" style={{ color }}>
                {m.date}
              </time>
              <div className={`text-[14px] leading-snug ${past ? 'text-[#14284B]/45' : 'text-[#33435C]'}`}>
                {m.title}
                {isCurrent && (
                  <span
                    className="ml-2 inline-block rounded-full px-2 py-[1px] align-middle text-[9px] font-bold uppercase tracking-widest text-white"
                    style={{ backgroundColor: color }}
                  >
                    {current.isToday ? 'Today' : 'Up next'}
                  </span>
                )}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

export default function ApplicationTimeline() {
  const today = todayISO();
  const lineRef = useRef(null);
  const [lineOn, setLineOn] = useState(false);

  // The milestone happening today, or the next one coming up
  const current = useMemo(() => {
    for (let pi = 0; pi < phases.length; pi += 1) {
      const m = phases[pi].milestones.find((x) => (x.endDateTime || x.dateTime) >= today);
      if (m) return { key: m.dateTime, phase: pi, isToday: m.dateTime <= today };
    }
    return null;
  }, [today]);

  // The blue part of the line grows up to the current phase when the timeline comes into view
  useEffect(() => {
    const el = lineRef.current;
    if (!el || !('IntersectionObserver' in window)) {
      setLineOn(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLineOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Measure the footer so this section + the footer exactly fill one screen on laptops and desktops
  const sectionRef = useRef(null);
  useLayoutEffect(() => {
    const footer = document.querySelector('footer');
    const el = sectionRef.current;
    if (!footer || !el) return undefined;
    const update = () => el.style.setProperty('--fh', `${footer.offsetHeight}px`);
    update();
    const ro = 'ResizeObserver' in window ? new ResizeObserver(update) : null;
    if (ro) ro.observe(footer);
    window.addEventListener('resize', update);
    return () => {
      if (ro) ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  const reached = current ? current.phase : phases.length - 1; // index of the phase we're in
  const fill = current ? `calc(${reached * 25}% + ${CIRCLE / 2}px)` : '100%';

  return (
    <section
      id="timeline"
      ref={sectionRef}
      className="dy-tl relative overflow-hidden border-t border-[#D3DFEE] py-16 text-[#14284B] sm:py-20"
      style={{ backgroundColor: '#F2F6FC', '--fh': '0px' }} /* light blue, so it doesn't run into the cream section above */
    >
      <style>{`
        .dy-tl { scroll-margin-top: 0; }
        /* Laptops and desktops: this section + the footer together fill exactly one screen */
        @media (min-width: 1024px) {
          .dy-tl {
            min-height: calc(100svh - var(--fh));
            display: flex; align-items: center;
            padding-top: calc(${HEADER_HEIGHT} + clamp(10px, 2.5vh, 28px));
            padding-bottom: clamp(16px, 3vh, 32px);
          }
          .dy-tl > div { width: 100%; }
        }
        /* Short laptop screens: tighter spacing so the timeline and the footer still share one screen */
        @media (min-width: 1024px) and (max-height: 940px) {
          .dy-tl { padding-top: calc(${HEADER_HEIGHT} + 8px); padding-bottom: 12px; }
          .dy-tl-sub { display: none; }
          .dy-tl-head { margin-bottom: 18px !important; }
          .dy-tl-ms > * + * { margin-top: 6px !important; }
        }
      `}</style>

      <div className="relative z-10 mx-auto max-w-[78rem] px-5 sm:px-8">
        <ScrollReveal animation="fade-down" duration={700}>
          <div className="dy-tl-head mx-auto mb-12 max-w-2xl text-center lg:mb-[clamp(20px,4.5vh,52px)]">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-[#14284B] sm:text-4xl lg:text-[clamp(1.9rem,4.6vh,2.7rem)]">
              Application Timeline &amp; Process
            </h2>
            <p className="dy-tl-sub mt-3 text-base text-[#4E657D] sm:text-lg lg:mt-2 lg:text-[clamp(14px,2vh,18px)]">Four phases, from the first announcement to the final day on the road.</p>
          </div>
        </ScrollReveal>

        {/* ============ Desktop: horizontal timeline ============ */}
        <div ref={lineRef} className="relative hidden lg:block">
          {/* the line */}
          <div className="absolute left-0 right-0 h-[6px] -translate-y-1/2 rounded-full" style={{ top: LINE_Y, backgroundColor: TRACK }} aria-hidden="true" />
          <div
            className="absolute left-0 h-[6px] -translate-y-1/2 rounded-full transition-[width] duration-[1400ms] ease-out"
            style={{ top: LINE_Y, width: lineOn ? fill : '0%', background: `linear-gradient(90deg, ${BLUES[0]}, ${BLUES[Math.min(reached, 3)]})` }}
            aria-hidden="true"
          />
          {/* arrow at the end of the line */}
          <svg className="absolute -right-1 h-4 w-4 -translate-y-1/2" style={{ top: LINE_Y, color: TRACK }} viewBox="0 0 16 16" aria-hidden="true">
            <path d="M4 1 L13 8 L4 15 Z" fill="currentColor" />
          </svg>

          <ol aria-label="Dairy Yatra 2027 timeline" className="relative grid grid-cols-4 gap-6">
            {phases.map((phase, i) => {
              const color = BLUES[i];
              const { Icon } = phase;
              const active = current?.phase === i;
              const done = current ? i < current.phase : true;
              return (
                <li key={phase.name} className="min-w-0">
                  <ScrollReveal animation="fade-up" duration={700} delay={150 * i}>
                    {/* period label, centred over the circle */}
                    <div className="flex justify-center" style={{ width: CIRCLE, height: LABEL_H, marginBottom: LABEL_GAP }}>
                      <span className="whitespace-nowrap text-[17px] font-extrabold tracking-tight" style={{ color }}>
                        {phase.period}
                      </span>
                    </div>

                    {/* circle on the line */}
                    <div
                      className="relative flex items-center justify-center rounded-full border-4 border-white text-white shadow-[0_10px_24px_rgba(20,40,75,0.22)] transition-transform duration-300 hover:scale-105"
                      style={{ width: CIRCLE, height: CIRCLE, backgroundColor: color }}
                    >
                      {active && <span className="absolute -inset-2 animate-ping rounded-full opacity-25" style={{ backgroundColor: color }} aria-hidden="true" />}
                      <Icon className="relative h-7 w-7" strokeWidth={1.8} aria-hidden="true" />
                    </div>

                    {/* stem down from the circle, details to its right */}
                    <div className="relative mt-0 pb-2 pl-6" style={{ marginLeft: CIRCLE / 2 - 1 }}>
                      <span className="absolute bottom-0 left-0 top-0 w-[2px]" style={{ backgroundColor: color }} aria-hidden="true" />
                      <span className="absolute -bottom-1 -left-[4px] h-2.5 w-2.5 rounded-full" style={{ backgroundColor: color }} aria-hidden="true" />
                      <div className="pt-5 lg:pt-[clamp(10px,2vh,20px)]">
                        <div className="mb-0.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color }}>
                          Phase {pad2(i + 1)}
                          {done && <span className="tracking-normal text-[#14284B]/40">· Done</span>}
                        </div>
                        <h3 className="mb-4 text-[22px] font-bold leading-tight lg:mb-[clamp(8px,1.6vh,16px)]" style={{ color: NAVY }}>
                          {phase.name}
                        </h3>
                        <Milestones phase={phase} color={color} current={current} today={today} />
                      </div>
                    </div>
                  </ScrollReveal>
                </li>
              );
            })}
          </ol>
        </div>

        {/* ============ Tablet / phone: vertical timeline ============ */}
        <ol aria-label="Dairy Yatra 2027 timeline" className="relative space-y-10 lg:hidden">
          <span className="absolute bottom-6 left-[27px] top-6 w-[4px] rounded-full" style={{ backgroundColor: TRACK }} aria-hidden="true" />
          {phases.map((phase, i) => {
            const color = BLUES[i];
            const { Icon } = phase;
            const done = current ? i < current.phase : true;
            return (
              <li key={phase.name} className="relative flex gap-5">
                <ScrollReveal animation="fade-up" duration={700} delay={100 * i}>
                  <div className="flex gap-5">
                    <div
                      className="relative z-10 flex h-[58px] w-[58px] shrink-0 items-center justify-center rounded-full border-4 border-white text-white shadow-[0_8px_20px_rgba(20,40,75,0.2)]"
                      style={{ backgroundColor: color }}
                    >
                      <Icon className="h-6 w-6" strokeWidth={1.8} aria-hidden="true" />
                    </div>
                    <div className="min-w-0 pt-1">
                      <div className="text-[15px] font-extrabold" style={{ color }}>
                        {phase.period}
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.22em]" style={{ color }}>
                        Phase {pad2(i + 1)}
                        {done && <span className="tracking-normal text-[#14284B]/40">· Done</span>}
                      </div>
                      <h3 className="mb-3 text-[20px] font-bold leading-tight" style={{ color: NAVY }}>
                        {phase.name}
                      </h3>
                      <Milestones phase={phase} color={color} current={current} today={today} />
                    </div>
                  </div>
                </ScrollReveal>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}