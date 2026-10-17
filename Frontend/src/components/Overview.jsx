import React, { useEffect, useRef, useState } from 'react';
import { Factory, FlaskConical, Users, Telescope } from 'lucide-react';

/* Colours: navy + off-white / cream only */
const NAVY = '#14284B';
const NAVY_LIGHT = '#3368A0';
const PAPER = '#F4F2EE';

// Logo in the centre of the Key Takeaways diagram (file lives in public/)
const LOGO_URL = '/logo.png';

/* Left side: About text */
const INTRO = [
  "What will it take to transform India's dairy sector? The answers lie in its farms, people, enterprises, innovations, and communities.",
  "Dairy Yatra is a 15-day immersive learning journey from Tamil Nadu to Rajasthan, bringing together 40 fellows to explore India's diverse dairy ecosystem. Through field visits and interactions with progressive farmers, entrepreneurs, researchers, industry leaders, and institutions, fellows discover the practices, innovations, and business models shaping the future of dairy.",
];

/* Left side: The Yatra Experience */
const HIGHLIGHTS = [
  { title: 'Learn by Seeing', text: 'Experience progressive dairy farms, explore scientific farming practices, and learn directly from those building successful dairy enterprises.' },
  { title: 'Connect with Ideas', text: 'Discover dairy businesses, cooperatives, research institutions, emerging technologies, and innovative business models across the value chain.' },
  { title: 'Aspire to Build', text: 'Turn field experiences into ideas for entrepreneurship, innovation, collaboration, and sustainable dairy livelihoods.' },
];

/* Closing line, under the Learnings diagram */
const CLOSING = 'See the Sector. Meet Its Changemakers. Discover Your Place in the Future of Dairy.';

/* Right side: Learnings from the Yatra. `bold` is set heavy, `rest` light; `text` shows as a tooltip. */
const TAKEAWAYS = [
  { Icon: Factory, bold: 'Industry', rest: 'insights', text: "Understand India's diverse dairy ecosystem and discover emerging opportunities." },
  { Icon: FlaskConical, bold: 'Scientific', rest: 'practices', text: 'Explore scientific dairy farming methods, technologies, and innovative enterprise models.' },
  { Icon: Users, bold: 'Community', rest: 'connections', text: 'Build meaningful networks with farmers, entrepreneurs, industry experts, and fellow fellows.' },
  { Icon: Telescope, bold: 'A vision', rest: 'for the future', text: 'Identify career pathways, entrepreneurial opportunities, and actionable ideas for dairy and rural development.' },
];

/* ---------- Diagram geometry (SVG units; the panel is 100 wide x 90 tall) ----------
   The logo sits on the left; a curved line with four dots wraps around its right side,
   and from each dot a connector runs out to that takeaway's icon and label. */
const VB_W = 100;
const VB_H = 90;
const CX = 23; // centre of the logo
const CY = 45;
const LOGO_W = 44; // logo width, in panel units
const ARC_R = 30; // the curved line
const ARC_SPAN = 74; // the line runs from -74deg to +74deg (0 = pointing right)
const DOT_SPAN = 66; // the four dots are spread over -66deg..+66deg
const BEND_R = 40.5; // where each connector finishes bending outwards
const RUN = 5; // straight run after the bend, before the icon

const rad = (d) => (d * Math.PI) / 180;
const pt = (r, d) => [CX + r * Math.cos(rad(d)), CY + r * Math.sin(rad(d))];

const ITEMS = TAKEAWAYS.map((t, i) => {
  const n = TAKEAWAYS.length;
  const each = (2 * DOT_SPAN) / n;
  const a = -DOT_SPAN + each * (i + 0.5);
  const dot = pt(ARC_R, a);
  const from = pt(ARC_R + 1.9, a); // start just outside the dot
  const bend = pt(BEND_R, a);
  const end = [bend[0] + RUN, bend[1]];
  return {
    ...t,
    a,
    dot,
    end,
    path: `M${from[0]} ${from[1]} Q${bend[0]} ${bend[1]} ${end[0]} ${end[1]}`,
    color: i < 2 ? NAVY_LIGHT : NAVY,
  };
});

const ARC = (() => {
  const s = pt(ARC_R, -ARC_SPAN);
  const e = pt(ARC_R, ARC_SPAN);
  return { d: `M${s[0]} ${s[1]} A${ARC_R} ${ARC_R} 0 0 1 ${e[0]} ${e[1]}`, s, e };
})();

const pctX = (x) => `${(x / VB_W) * 100}%`;
const pctY = (y) => `${(y / VB_H) * 100}%`;

const serif = {}; // headings use the site's sans-serif (DM Sans)

/* Height of the header once you've scrolled (the section fits in the screen below it) */
const HEADER_HEIGHT = '72px';

export default function Overview() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  // Show the section once any part of it is on screen. The scroll / hashchange check is a backup
  // for fast jumps (menu links, back button), so the content never stays hidden.
  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      setOn(true);
      return undefined;
    }
    let io = null;
    let timer = null;
    const check = () => {
      const r = el.getBoundingClientRect();
      if (r.bottom > 0 && r.top < window.innerHeight) show();
    };
    const later = () => {
      clearTimeout(timer);
      timer = setTimeout(check, 450);
    };
    function show() {
      setOn(true);
      if (io) io.disconnect();
      window.removeEventListener('scroll', check);
      window.removeEventListener('hashchange', later);
      clearTimeout(timer);
    }
    io = new IntersectionObserver(([e]) => e.isIntersecting && show(), { threshold: 0, rootMargin: '0px 0px -8% 0px' });
    io.observe(el);
    window.addEventListener('scroll', check, { passive: true });
    window.addEventListener('hashchange', later);
    check();
    return () => {
      io.disconnect();
      window.removeEventListener('scroll', check);
      window.removeEventListener('hashchange', later);
      clearTimeout(timer);
    };
  }, []);

  const delay = (ms) => ({ transitionDelay: on ? `${ms}ms` : '0ms' });

  return (
    <section
      id="overview"
      ref={ref}
      className="dy-ov relative overflow-hidden py-20 font-sans sm:py-24"
      style={{ '--hh': HEADER_HEIGHT, backgroundColor: PAPER, color: NAVY }}
    >
      <style>{`
        .dy-ov { scroll-margin-top: var(--hh); }
        @media (min-width: 1024px) {
          .dy-ov {
            min-height: 100svh; display: flex; align-items: center;
            padding-top: calc(var(--hh) + clamp(12px, 2.5vh, 32px));
            padding-bottom: clamp(12px, 2.5vh, 32px);
          }
        }
        .dy-in   { transition: opacity 700ms ease, transform 800ms cubic-bezier(.16,1,.3,1); }
        .dy-pop  { transition: opacity 650ms ease, transform 750ms cubic-bezier(.34,1.56,.64,1); }
        .dy-draw { transition: stroke-dashoffset 1300ms cubic-bezier(.65,0,.35,1); }
        .dy-tk   { transition: opacity 600ms ease, transform 700ms cubic-bezier(.16,1,.3,1); }
        .dy-tk:hover .dy-chip { transform: scale(1.08); box-shadow: 0 10px 22px rgba(20,40,75,0.28); }
        .dy-chip { transition: transform 300ms ease, box-shadow 300ms ease; }

        /* Bigger type on the left */
        .dy-h2   { font-size: clamp(2.1rem, 6vw, 3.2rem); }
        .dy-p    { font-size: clamp(1rem, 2.4vw, 1.15rem); }
        .dy-hl-t { font-size: 1.2rem; }
        .dy-hl-p { font-size: 1.02rem; }
        /* Takeaway labels scale with the panel */
        .dy-lab  { font-size: clamp(11px, 3.2vw, 19px); }
        @media (min-width: 1024px) {
          .dy-h2   { font-size: clamp(2.1rem, min(3.2vw, 5.2vh), 3.5rem); }
          .dy-p    { font-size: clamp(.95rem, min(1.2vw, 2.05vh), 1.2rem); line-height: 1.6; }
          .dy-hl-t { font-size: clamp(1rem, min(1.4vw, 2.4vh), 1.35rem); }
          .dy-hl-p { font-size: clamp(.86rem, min(1.08vw, 1.9vh), 1.05rem); }
          .dy-lab  { font-size: clamp(12px, min(1.3vw, 2.3vh), 20px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .dy-in, .dy-pop, .dy-draw, .dy-tk, .dy-chip { transition: none !important; }
        }
      `}</style>

      <div
        className="grid w-full items-center gap-14 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-[clamp(24px,3.5vw,64px)]"
        style={{ paddingLeft: 'max(16px, 2%)', paddingRight: 'max(16px, 2%)' }}
      >
        {/* ============ Left: About (unchanged) ============ */}
        <div className="min-w-0">

          <h2
            className={`dy-in dy-h2 font-semibold leading-[1.1] tracking-[-0.01em] ${on ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
            style={{ ...serif, ...delay(80) }}
          >
            Explore India's Dairy Landscape. Experience Its Possibilities.
          </h2>

          {INTRO.map((text, i) => (
            <p
              key={i}
              className={`dy-in dy-p max-w-[48rem] leading-[1.7] ${i === 0 ? 'mt-6 lg:mt-[clamp(14px,2.6vh,28px)]' : 'mt-3 lg:mt-[clamp(6px,1.2vh,14px)]'} ${on ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
              style={{ ...delay(180 + i * 60), color: '#3E4E68' }}
            >
              {text}
            </p>
          ))}

          <div
            className={`dy-in mt-10 flex items-center gap-3 text-[12px] font-bold uppercase tracking-[0.3em] lg:text-[13px] lg:mt-[clamp(16px,3vh,36px)] ${on ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
            style={{ ...delay(280), color: NAVY_LIGHT }}
          >
            <span className="h-px w-12" style={{ backgroundColor: NAVY_LIGHT }} />
            The Yatra Experience
          </div>

          <ul className="mt-5 flex flex-col gap-6 lg:mt-[clamp(10px,2vh,22px)] lg:gap-[clamp(10px,2.2vh,24px)]">
            {HIGHLIGHTS.map((h, i) => (
              <li
                key={h.title}
                className={`dy-in flex gap-5 ${on ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'}`}
                style={delay(300 + i * 110)}
              >
                <span className="mt-1 w-[5px] shrink-0 rounded-full" style={{ backgroundColor: NAVY }} aria-hidden="true" />
                <div>
                  <h3 className="dy-hl-t font-semibold leading-snug">{h.title}</h3>
                  <p className="dy-hl-p mt-1 leading-relaxed" style={{ color: '#5A6880' }}>
                    {h.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* ============ Right: logo + curved line + connected learnings ============ */}
        <div className="flex min-w-0 flex-col">
          <div
            className="relative mx-auto w-full lg:ml-auto lg:mr-0"
            style={{ aspectRatio: `${VB_W} / ${VB_H}`, maxWidth: `min(100%, calc((100svh - 190px) * ${VB_W / VB_H}))` }}
          >
            <svg className="absolute inset-0 h-full w-full overflow-visible" viewBox={`0 0 ${VB_W} ${VB_H}`} aria-hidden="true">
              <defs>
                <linearGradient id="dyArc" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={NAVY_LIGHT} stopOpacity="0.35" />
                  <stop offset="30%" stopColor={NAVY_LIGHT} />
                  <stop offset="100%" stopColor={NAVY} />
                </linearGradient>
              </defs>

              {/* the curved line around the logo */}
              <path
                d={ARC.d}
                fill="none"
                stroke="url(#dyArc)"
                strokeWidth="0.8"
                strokeLinecap="round"
                pathLength="1"
                strokeDasharray="1"
                className="dy-draw"
                style={{ ...delay(250), strokeDashoffset: on ? 0 : 1 }}
              />
              <circle cx={ARC.s[0]} cy={ARC.s[1]} r="0.9" fill={PAPER} stroke={NAVY_LIGHT} strokeWidth="0.45" />
              <circle cx={ARC.e[0]} cy={ARC.e[1]} r="1.1" fill={NAVY} />

              {/* connectors from each dot out to its takeaway */}
              {ITEMS.map((it, i) => (
                <path
                  key={`c-${i}`}
                  d={it.path}
                  fill="none"
                  stroke={it.color}
                  strokeWidth="0.55"
                  strokeLinecap="round"
                  pathLength="1"
                  strokeDasharray="1"
                  className="dy-draw"
                  style={{ ...delay(800 + i * 170), strokeDashoffset: on ? 0 : 1, transitionDuration: '700ms' }}
                />
              ))}

              {/* the dots on the line */}
              {ITEMS.map((it, i) => (
                <circle
                  key={`d-${i}`}
                  cx={it.dot[0]}
                  cy={it.dot[1]}
                  r="1.4"
                  fill="#FFFFFF"
                  stroke={it.color}
                  strokeWidth="0.6"
                  className="dy-pop"
                  style={{
                    ...delay(650 + i * 170),
                    opacity: on ? 1 : 0,
                    transformBox: 'fill-box',
                    transformOrigin: 'center',
                    transform: on ? 'scale(1)' : 'scale(0)',
                  }}
                />
              ))}
            </svg>

            {/* logo, no circle behind it */}
            <img
              src={LOGO_URL}
              alt="Dairy Yatra"
              className="dy-pop absolute z-10 object-contain"
              style={{
                ...delay(120),
                left: pctX(CX),
                top: pctY(CY),
                width: `${LOGO_W}%`,
                transform: on ? 'translate(-50%,-50%) scale(1)' : 'translate(-50%,-50%) scale(0.75)',
                opacity: on ? 1 : 0,
              }}
            />

            {/* takeaways: icon + heading, at the end of each connector */}
            {ITEMS.map((it, i) => {
              const { Icon } = it;
              return (
                <div
                  key={it.bold}
                  title={it.text}
                  className="dy-tk dy-lab absolute z-10 flex items-center gap-[0.7em]"
                  style={{
                    ...delay(1050 + i * 170),
                    left: pctX(it.end[0]),
                    top: pctY(it.end[1]),
                    transform: on ? 'translateY(-50%)' : 'translate(-10px, -50%)',
                    opacity: on ? 1 : 0,
                  }}
                >
                  <span
                    className="dy-chip flex shrink-0 items-center justify-center rounded-full text-white shadow-[0_8px_18px_rgba(20,40,75,0.2)]"
                    style={{ width: '2.6em', height: '2.6em', backgroundColor: it.color }}
                  >
                    <Icon style={{ width: '1.25em', height: '1.25em' }} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <p className="whitespace-nowrap uppercase leading-[1.15] tracking-[0.03em]" style={{ color: it.color }}>
                    <span className="font-extrabold">{it.bold}</span>
                    {it.rest && (
                      <>
                        <br />
                        <span className="font-normal">{it.rest}</span>
                      </>
                    )}
                  </p>
                </div>
              );
            })}
          </div>

          <p
            className={`dy-in mx-auto mt-4 max-w-[24em] text-center font-semibold leading-snug [text-wrap:balance] ${on ? 'translate-y-0 opacity-100' : 'translate-y-3 opacity-0'}`}
            style={{ ...serif, ...delay(1600), color: NAVY, fontSize: 'clamp(1.05rem, min(1.5vw, 2.6vh), 1.4rem)' }}
          >
            {CLOSING}
          </p>
        </div>
      </div>
    </section>
  );
}