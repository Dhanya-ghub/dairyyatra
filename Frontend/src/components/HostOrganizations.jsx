import React from 'react';
import ScrollReveal from './ScrollReveal';

// Partner official logo asset imports
import akshayakalpaLogo from '../assets/logos/akshayakalpa.webp';
import amulLogo from '../assets/logos/amul.svg';
import baifLogo from '../assets/logos/baif.png';
import banasLogo from '../assets/logos/banas.png';
import coeLogo from '../assets/logos/coe_baramati.png';
import gokulLogo from '../assets/logos/gokul.png';
import govindLogo from '../assets/logos/govind.svg';
import nrccLogo from '../assets/logos/nrcc.png';
import prabhatLogo from '../assets/logos/prabhat.png';

// Keep the number of partners a multiple of 3 so the 3-column layout has no empty spots
const PARTNERS = [
  { id: 'amul', name: 'Amul Dairy (GCMMF)', logo: amulLogo },
  { id: 'akshayakalpa', name: 'Akshayakalpa Organic Milk', logo: akshayakalpaLogo },
  { id: 'banas', name: 'Banas Dairy', logo: banasLogo },
  { id: 'baif', name: 'BAIF Development Research Foundation', logo: baifLogo },
  { id: 'gokul', name: 'Gokul Dairy', logo: gokulLogo },
  { id: 'govind', name: 'Govind Milk', logo: govindLogo },
  { id: 'coe', name: 'Centre of Excellence for Dairy, Baramati', logo: coeLogo },
  { id: 'prabhat', name: 'Prabhat Dairy', logo: prabhatLogo },
  { id: 'nrcc', name: 'ICAR - NRCC Camel Dairy', logo: nrccLogo },
];

/* ---------- Easy settings ----------
   HEADER_HEIGHT = height of your sticky header once you have scrolled. On laptops and desktops
   (lg and up) the whole section is sized to fit exactly in the space below it. */
const HEADER_HEIGHT = '72px';

export default function HostOrganizations() {
  const rows = Math.max(1, Math.ceil(PARTNERS.length / 3));

  return (
    <section
      id="hosts"
      className="dy-ho relative flex min-h-screen items-center bg-white py-12 font-sans text-[#172738] border-b border-slate-100 sm:py-16"
      style={{ '--hh': HEADER_HEIGHT, '--rows': rows }}
    >
      <style>{`
        .dy-ho { scroll-margin-top: var(--hh); }

        /* Laptops and desktops: the whole section fits in one screen.
           The logo rows share whatever height is left, and the logos scale with the row. */
        @media (min-width: 1024px) {
          .dy-ho {
            --pad: clamp(16px, 4vh, 56px);
            --sh: calc(100vh - var(--hh));
            --gy: clamp(8px, 2.6vh, 40px);                                   /* space between logo rows */
            --row: clamp(64px, calc((var(--sh) - 2 * var(--pad) - (var(--rows) - 1) * var(--gy)) / var(--rows)), 128px);
            min-height: var(--sh);
            padding-top: var(--pad);
            padding-bottom: var(--pad);
          }
          @supports (height: 100svh) {
            .dy-ho { --sh: calc(100svh - var(--hh)); }
          }

          .dy-ho-title { font-size: clamp(26px, min(2.9vw, 5.2vh), 40px); }
          .dy-ho-sub   { font-size: clamp(13px, 2.2vh, 16px); }
          .dy-ho-grid  { row-gap: var(--gy); }
          .dy-ho-cell  { height: var(--row); }
          .dy-ho-logo  { max-height: calc(var(--row) * .62); }
        }
      `}</style>

      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-12">

          {/* Title */}
          <div className="lg:col-span-4">
            <ScrollReveal animation="fade-up" duration={700}>
              <h2 className="dy-ho-title text-3xl font-normal leading-tight tracking-tight text-[#172738] sm:text-4xl">
                Our <span className="font-extrabold text-[#142538]">Host Organizations</span>
              </h2>
              <p className="dy-ho-sub mt-3 text-sm font-medium text-slate-500 sm:text-base">
                A glimpse of our diverse partnerships.
              </p>
            </ScrollReveal>
          </div>

          {/* Logos: full colour, no grid lines */}
          <div className="lg:col-span-8">
            <ScrollReveal animation="fade" delay={150} duration={800}>
              <div className="dy-ho-grid grid grid-cols-3 items-center justify-items-center gap-x-4 gap-y-6 sm:gap-x-8 sm:gap-y-10">
                {PARTNERS.map((item) => (
                  <div
                    key={item.id}
                    title={item.name}
                    className="dy-ho-cell flex h-24 w-full items-center justify-center sm:h-32"
                  >
                    <img
                      src={item.logo}
                      alt={item.name}
                      className="dy-ho-logo max-h-14 max-w-[90%] object-contain transition-transform duration-300 hover:scale-105 sm:max-h-20"
                      loading="lazy"
                      draggable="false"
                    />
                  </div>
                ))}
              </div>
            </ScrollReveal>
          </div>

        </div>
      </div>
    </section>
  );
}