import React, { useEffect, useRef, useState } from 'react';

// Logos with their empty margins already cut off (src/assets/logos/trimmed/), so every logo can be sized the same
import kiLogo from '../assets/logos/trimmed/ki.png';
import edfLogo from '../assets/logos/trimmed/edf.png';
import abtLogo from '../assets/logos/trimmed/abt.png';
import amulLogo from '../assets/logos/trimmed/amul.png';
import banasLogo from '../assets/logos/trimmed/banas.png';
import akshayakalpaLogo from '../assets/logos/trimmed/akshayakalpa.png';
import gokulLogo from '../assets/logos/trimmed/gokul.png';
import nrccLogo from '../assets/logos/trimmed/nrcc.png';
import nddbLogo from '../assets/logos/trimmed/nddb.png';
import pdfaLogo from '../assets/logos/trimmed/pdfa.png';
import icarLogo from '../assets/logos/trimmed/icar.png';

/* Colours: same navy / cream family as the About section */
const NAVY = '#14284B';
const PAPER = '#FBF9F4';
const GOLD = '#C9A75E'; // the lines beside HOSTED BY / SUPPORTED BY / PARTNERS
const BLUE = '#2B6CB0'; // the tier labels

/* url: clicking the logo opens this site in a new tab. Leave it out ('') and the logo is not a link. */
const HOST = { name: 'Kumaraguru Institutions', logo: kiLogo, url: 'https://kumaraguru.in/' };

const SUPPORTERS = [
  { name: 'Environmental Defense Fund', logo: edfLogo, url: 'https://www.edf.org/' },
  { name: 'ABT Foods', logo: abtLogo, url: '' },
];

const PARTNERS = [
  { name: 'NDDB Dairy Services', logo: nddbLogo, url: 'https://www.nddb.coop/node/571' },
  { name: 'Amul', logo: amulLogo, url: 'https://amul.com/' },
  { name: 'Progressive Dairy Farmers Association (PDFA), Punjab', logo: pdfaLogo, url: 'https://pdfapunjab.com/' },
  { name: 'ICAR – Central Institute for Research on Buffaloes, Hisar', logo: icarLogo, url: 'https://cirb.res.in/' },
  { name: 'Banas Dairy', logo: banasLogo, url: 'https://www.banasdairy.coop/' },
  { name: 'Akshayakalpa', logo: akshayakalpaLogo, url: 'https://akshayakalpa.org/' },
  { name: 'Gokul Dairy', logo: gokulLogo, url: 'https://www.gokulmilk.coop/' },
  { name: 'ICAR – National Research Centre on Camel', logo: nrccLogo, url: 'https://nrccamel.icar.gov.in/' },
];

/* Every logo covers about the same area, whatever its shape: a wide logo gets shorter, a round one taller.
   Height = --logo-u x sqrt(LOGO_REF / width-to-height ratio), capped at LOGO_MAX x --logo-u
   so round badges do not tower over the rest. */
const LOGO_REF = 2.2;
const LOGO_MAX = 1.25;

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

/* One logo, sized by its shape (see LOGO_REF), linking to the organisation's website */
function Logo({ item }) {
  const [ratio, setRatio] = useState(null);
  const k = ratio ? Math.min(LOGO_MAX, Math.sqrt(LOGO_REF / ratio)) : 1;
  const img = (
    <img
      src={item.logo}
      alt={item.name}
      onLoad={(e) => setRatio(e.currentTarget.naturalWidth / e.currentTarget.naturalHeight || null)}
      className="block w-auto max-w-full object-contain"
      style={{ height: `calc(var(--logo-u) * ${k.toFixed(3)})` }}
      loading="lazy"
      draggable="false"
    />
  );
  const box = 'dy-ho-logo flex h-[calc(var(--logo-u)*1.25)] w-full items-center justify-center';
  return item.url ? (
    <a href={item.url} target="_blank" rel="noopener noreferrer" title={`${item.name} (opens in a new tab)`} className={`${box} rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2B6CB0]`}>
      {img}
    </a>
  ) : (
    <div className={box} title={item.name}>
      {img}
    </div>
  );
}

export default function HostOrganizations() {
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
          --logo-u: 46px;                   /* base logo size, used by every logo (see LOGO_REF) */
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
            --logo-u: clamp(46px, 7.4vh, 72px);
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
          style={{ color: NAVY }}
        >
          Behind the Journey
        </h2>

        {/* ---------- Row 1: Hosted by (left)   |   Supported by (right) ---------- */}
        <div className="grid items-start gap-10 md:grid-cols-[1fr_1.7fr] md:gap-x-12 lg:gap-x-20">
          <Tier label="Hosted by" on={on} delay={100}>
            <div className="mx-auto max-w-[260px]">
              <Logo item={HOST} />
            </div>
          </Tier>

          <Tier label="Supported by" on={on} delay={350}>
            <div className="mx-auto grid max-w-[560px] grid-cols-2 items-center gap-x-10 gap-y-6 lg:gap-x-16">
              {SUPPORTERS.map((s) => (
                <Logo key={s.name} item={s} />
              ))}
            </div>
          </Tier>
        </div>

        {/* ---------- Row 2: Partners ---------- */}
        <Tier label="Partners" on={on} delay={650}>
          <div className="grid grid-cols-2 items-center gap-x-6 gap-y-8 sm:grid-cols-4 sm:gap-x-8 lg:gap-x-12 lg:gap-y-[clamp(20px,4vh,44px)]">
            {PARTNERS.map((p) => (
              <Logo key={p.name} item={p} />
            ))}
          </div>
        </Tier>
      </div>
    </section>
  );
}