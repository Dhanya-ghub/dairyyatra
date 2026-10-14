import React, { useEffect, useRef, useState } from 'react';

// Host
import kiLogo from '../assets/kilg.png';
// Supporters (put edf.png and abt.png in src/assets/logos/)
import edfLogo from '../assets/logos/edf.png';
import abtLogo from '../assets/logos/abt.png';
// Partners
import amulLogo from '../assets/logos/amul.svg';
import banasLogo from '../assets/logos/banas.png';
import akshayakalpaLogo from '../assets/logos/akshayakalpa.webp';
import gokulLogo from '../assets/logos/gokul.png';
import nrccLogo from '../assets/logos/nrcc.png';

/* Colours: same navy / cream family as the About section */
const NAVY = '#14284B';
const PAPER = '#FBF9F4';
const GOLD = '#C9A75E'; // the lines beside HOSTED BY / SUPPORTED BY / PARTNERS
const BLUE = '#2B6CB0'; // the tier labels

const HOST = { name: 'Kumaraguru Institutions', logo: kiLogo };

const SUPPORTERS = [
  { name: 'Environmental Defense Fund', logo: edfLogo },
  { name: 'ABT Foods', logo: abtLogo },
];

const PARTNERS = [
  { name: 'Amul', logo: amulLogo },
  { name: 'Banas Dairy', logo: banasLogo },
  { name: 'Akshayakalpa', logo: akshayakalpaLogo },
  { name: 'Gokul Dairy', logo: gokulLogo },
  { name: 'ICAR – NRC on Camel', logo: nrccLogo },
];

/* Height of the header once you have scrolled. On laptops and desktops the section fills one screen below it. */
const HEADER_HEIGHT = '72px';

/* "——  HOSTED BY  ——": the tier name centred, with a line running out on each side */
function Tier({ label, on, delay, className = '', children }) {
  const fade = on ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0';
  return (
    <div className={`w-full ${className}`}>
      <div
        className={`dy-ho-in grid grid-cols-[1fr_auto_1fr] items-center gap-4 sm:gap-5 ${fade}`}
        style={{ transitionDelay: on ? `${delay}ms` : '0ms' }}
      >
        <span className="h-[2px]" style={{ background: `linear-gradient(to right, transparent, ${GOLD})` }} />
        <span className="text-center text-[13px] font-extrabold uppercase tracking-[0.28em] sm:text-[15px]" style={{ color: BLUE }}>
          {label}
        </span>
        <span className="h-[2px]" style={{ background: `linear-gradient(to left, transparent, ${GOLD})` }} />
      </div>

      <div className={`dy-ho-in mt-[var(--lab-gap)] ${fade}`} style={{ transitionDelay: on ? `${delay + 150}ms` : '0ms' }}>
        {children}
      </div>
    </div>
  );
}

/* One logo, in a fixed box so every logo in the top row has the same visual size */
function Logo({ item }) {
  return (
    <div className="dy-ho-logo flex h-[var(--logo-h)] w-[var(--logo-w)] items-center justify-center" title={item.name}>
      <img src={item.logo} alt={item.name} className="max-h-full max-w-full object-contain" draggable="false" />
    </div>
  );
}

export default function HostOrganizations() {
  const ref = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (!('IntersectionObserver' in window)) {
      setOn(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setOn(true);
          io.disconnect();
        }
      },
      { threshold: 0.2 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section
      id="hosts"
      ref={ref}
      className="dy-ho relative overflow-hidden py-14 font-sans sm:py-16"
      style={{ '--hh': HEADER_HEIGHT, backgroundColor: PAPER, color: NAVY }}
    >
      <style>{`
        .dy-ho {
          scroll-margin-top: var(--hh);
          --row-gap: 40px; --lab-gap: 22px;
          --logo-h: 76px; --logo-w: 200px;   /* host + supported-by logos: all the same box */
          --par-h: 64px;                    /* partners: never taller than the logos above */
        }
        /* Laptops and desktops: one full screen, content centred and sized from the screen height
           so it fills the page without big empty bands */
        @media (min-width: 1024px) {
          .dy-ho {
            min-height: 100svh; display: flex; align-items: center;
            padding-top: calc(var(--hh) + clamp(16px, 3vh, 40px));
            padding-bottom: clamp(16px, 3vh, 40px);
            --row-gap: clamp(32px, 7.5vh, 88px);
            --lab-gap: clamp(18px, 4vh, 40px);
            --logo-h: clamp(68px, 13vh, 124px);
            --logo-w: clamp(160px, 18vw, 270px);
            --par-h: clamp(60px, 11vh, 104px);
          }
          .dy-ho-title { font-size: clamp(2.4rem, min(4.4vw, 7.4vh), 4.2rem) !important; }
        }
        .dy-ho-in   { transition: opacity 700ms ease, transform 800ms cubic-bezier(.16,1,.3,1); }
        .dy-ho-logo { transition: transform 300ms ease; }
        .dy-ho-logo:hover { transform: scale(1.05); }
        @media (prefers-reduced-motion: reduce) {
          .dy-ho-in, .dy-ho-logo { transition: none !important; }
        }
      `}</style>

      <div className="relative mx-auto flex w-full max-w-6xl flex-col gap-[var(--row-gap)] px-5 sm:px-8">
        {/* ---------- Section heading ---------- */}
        <h2
          className={`dy-ho-in dy-ho-title text-center text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl lg:text-[clamp(2.2rem,min(3.8vw,6.4vh),3.6rem)] ${on ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
          style={{ fontFamily: '"Playfair Display", Georgia, serif', color: NAVY }}
        >
          Behind the Journey
        </h2>

        {/* ---------- Row 1: Hosted by (left)   |   Supported by (right) ---------- */}
        <div className="grid items-start gap-10 md:grid-cols-[1fr_1.7fr] md:gap-x-12 lg:gap-x-20">
          <Tier label="Hosted by" on={on} delay={100}>
            <div className="flex justify-center">
              <Logo item={HOST} />
            </div>
          </Tier>

          <Tier label="Supported by" on={on} delay={350}>
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 lg:gap-x-16">
              {SUPPORTERS.map((s) => (
                <Logo key={s.name} item={s} />
              ))}
            </div>
          </Tier>
        </div>

        {/* ---------- Row 2: Partners ---------- */}
        <Tier label="Partners" on={on} delay={650}>
          <div className="grid grid-cols-3 items-center justify-items-center gap-x-4 gap-y-6 sm:grid-cols-5 sm:gap-x-6 lg:gap-x-10">
            {PARTNERS.map((p) => (
              <div
                key={p.name}
                className="dy-ho-logo flex h-[var(--par-h)] w-full items-center justify-center"
                title={p.name}
              >
                <img src={p.logo} alt={p.name} className="max-h-full max-w-full object-contain" loading="lazy" draggable="false" />
              </div>
            ))}
          </div>
        </Tier>
      </div>
    </section>
  );
}