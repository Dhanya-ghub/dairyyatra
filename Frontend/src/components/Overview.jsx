import React from 'react';
import ScrollReveal from './ScrollReveal';

/* Photos come from src/assets/images/ - files named 1, 2, 3 ... (extension in lower-case: .jpg .png .webp) */
const modules = import.meta.glob('../assets/images/**/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' });
const BY_NUMBER = {};
Object.entries(modules).forEach(([path, src]) => {
  const name = path.split('/').pop();
  if (/^\d+\./.test(name)) BY_NUMBER[parseInt(name, 10)] = src;
});

/* The photo mosaic is a 14-column x 13-row grid (like the reference sketch).
   n = photo file number (file "7.jpg" -> n: 7)
   c = columns it covers, r = rows it covers  ("start / end", the end line is not included) */
const PHOTOS = [
  { n: 4, alt: 'Calves at a farm',                      c: '1 / 5',  r: '3 / 7'  },   // left, upper square
  { n: 5, alt: 'Hands-on session at a dairy facility',  c: '1 / 5',  r: '7 / 11' },   // left, lower square
  { n: 2, alt: 'Dairy expo hall',                       c: '5 / 9',  r: '1 / 5'  },   // top middle square
  { n: 6, alt: 'Cattle shed',                           c: '9 / 12', r: '2 / 5'  },   // top right, small
  { n: 1, alt: 'Farmer leading cattle through a grove', c: '5 / 11', r: '5 / 11', pos: '30% 50%' },   // big centre square
  { n: 7, alt: 'Black buffalo in a shed',               c: '11 / 15', r: '5 / 14' },  // right, tall
  { n: 3, alt: 'Cattle shed at sunrise',                c: '3 / 11', r: '11 / 14' },  // bottom, wide
];

const HIGHLIGHTS = [
  { title: 'Meet farmers directly', text: 'Understand the everyday challenges of dairy farming first-hand.' },
  { title: 'Visit working dairy businesses', text: 'From organic farms to cooperatives such as Amul and NDDB.' },
  { title: 'Take home ideas that scale', text: 'Technology, management and sustainable practices that lift livelihoods.' },
];

const serif = { fontFamily: '"Playfair Display", Georgia, serif' };

/* ---------- Easy settings ----------
   HEADER_HEIGHT = height of your sticky header once you have scrolled (used so the whole
   section fits exactly in the space below it on laptops and desktops, lg and up).
   On phones and tablets the section just flows naturally. */
const HEADER_HEIGHT = '72px';

export default function Overview({ onOpenApply }) {
  return (
    <section
      id="overview"
      className="dy-ov bg-[#F8FAFC] px-4 py-20 font-sans text-[#0F172A] sm:px-6 sm:py-28"
      style={{ '--hh': HEADER_HEIGHT }}
    >
      <style>{`
        /* Clicking "ABOUT" lands the section right under the sticky header */
        .dy-ov { scroll-margin-top: var(--hh); }

        /* Phones and tablets: normal flowing layout */
        .dy-ov-h2 { font-size: clamp(34px, 4.6vw, 52px); }

        /* Laptops and desktops: the whole section fits in one screen.
           Everything is sized from the screen height, the same idea the hero uses. */
        @media (min-width: 1024px) {
          .dy-ov {
            --pad: clamp(14px, 3vh, 40px);                      /* top and bottom space */
            --sh: calc(100vh - var(--hh));                       /* height of one screen below the header */
            --mh: clamp(
              260px,
              min(calc(var(--sh) - 2 * var(--pad) - 44px), calc(46vw / 1.078)),
              593px
            );                                                   /* photo mosaic height */
            min-height: calc(100vh - var(--hh));
            display: flex;
            align-items: center;
            padding-top: var(--pad);
            padding-bottom: var(--pad);
          }
          @supports (height: 100svh) {
            .dy-ov { --sh: calc(100svh - var(--hh)); min-height: calc(100svh - var(--hh)); }
          }

          .dy-ov-grid     { grid-template-columns: minmax(0, 1fr) auto; column-gap: clamp(32px, 5vw, 72px); }
          .dy-ov-right    { width: calc(var(--mh) * 1.078); }
          .dy-ov-mosaic   { width: 100%; max-width: none; height: var(--mh); }

          .dy-ov-h2       { font-size: clamp(26px, min(3.6vw, 5.6vh), 50px); }
          .dy-ov-lead     { font-size: clamp(13px, min(1.4vw, 2.2vh), 18px); line-height: 1.6; margin-top: clamp(10px, 2.2vh, 24px); }
          .dy-ov-list     { margin-top: clamp(14px, 3.4vh, 40px); gap: clamp(10px, 2.6vh, 28px); }
          .dy-ov-bar      { height: auto; margin-top: 3px; margin-bottom: 3px; }
          .dy-ov-title    { font-size: clamp(15px, 2.5vh, 20px); }
          .dy-ov-text     { font-size: clamp(12.5px, 2vh, 17px); line-height: 1.5; }
          .dy-ov-caption  { max-width: none; margin-top: clamp(8px, 1.6vh, 20px); font-size: clamp(13px, 2vh, 15px); }
        }
      `}</style>

      {/* ======================== About: text + photos ======================== */}
      <div className="dy-ov-grid mx-auto grid w-full max-w-6xl items-center gap-16">

        {/* Text */}
        <div className="min-w-0">
          <ScrollReveal animation="fade-up" delay={100} duration={600}>
            <h2
              className="dy-ov-h2 leading-[1.12] text-[#0F172A]"
              style={{ ...serif, fontWeight: 600 }}
            >
              Beyond the farm: uniting 40 visionary entrepreneurs
            </h2>
            <p className="dy-ov-lead mt-6 text-[18px] leading-[1.7] text-[#475569]">
              Dairy Yatra is a 15-day journey that takes 40 entrepreneurs across five states of India to
              explore the dairy sector up close. Together they meet farmers, see dairy businesses at work,
              and look for ideas that can improve productivity and profitability across the country.
            </p>
          </ScrollReveal>

          <ul className="dy-ov-list mt-10 flex flex-col gap-7">
            {HIGHLIGHTS.map((h, i) => (
              <li key={h.title}>
                <ScrollReveal animation="fade-up" delay={200 + i * 100} duration={600}>
                  <div className="flex gap-4">
                    <span className="dy-ov-bar mt-1 h-12 w-1 shrink-0 rounded-full bg-[#F59E0B]" aria-hidden="true" />
                    <div>
                      <h3 className="dy-ov-title text-[20px] font-semibold text-[#0F172A]">{h.title}</h3>
                      <p className="dy-ov-text mt-1 text-[17px] leading-relaxed text-[#64748B]">{h.text}</p>
                    </div>
                  </div>
                </ScrollReveal>
              </li>
            ))}
          </ul>
        </div>

        {/* Photos: one mosaic, frames of different shapes */}
        <div className="dy-ov-right">
          <ScrollReveal animation="fade-up" delay={200} duration={700}>
            <div
              className="dy-ov-mosaic mx-auto grid w-full max-w-[640px] gap-[6px] sm:gap-2 lg:ml-auto"
              style={{ gridTemplateColumns: 'repeat(14, 1fr)', gridTemplateRows: 'repeat(13, 1fr)', aspectRatio: '1.078' }}
            >
              {PHOTOS.map((p) => (
                <div
                  key={p.n}
                  className="group relative overflow-hidden rounded-lg bg-gradient-to-br from-[#16325c] to-[#2B6CB0] sm:rounded-xl"
                  style={{ gridColumn: p.c, gridRow: p.r }}
                >
                  {BY_NUMBER[p.n] && (
                    <img
                      src={BY_NUMBER[p.n]}
                      alt={p.alt}
                      className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      style={{ objectPosition: p.pos || '50% 50%' }}
                      loading="lazy"
                    />
                  )}
                </div>
              ))}
            </div>

            <p className="dy-ov-caption mx-auto mt-5 flex max-w-[640px] items-center gap-3 text-[15px] text-[#64748B] lg:ml-auto">
              <span className="h-px w-8 bg-[#F59E0B]" aria-hidden="true" />
              Farms, institutions and businesses across India
            </p>
          </ScrollReveal>
        </div>
      </div>

    </section>
  );
}