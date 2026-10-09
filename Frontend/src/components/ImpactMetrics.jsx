import React from 'react';
import { PROGRAM_STATS } from '../data/yatraData';
import ScrollReveal from './ScrollReveal';
import ScrollAnimatedCounter from './ScrollAnimatedCounter';

/**
 * Dedicated high-end editorial Impact Metrics stats band
 * Positioned directly beneath the Hero section as a solid, full-width transition banner.
 */
export default function ImpactMetrics() {
  const metrics = [
    {
      value: PROGRAM_STATS.durationDays,
      label: 'DAYS ON THE JOURNEY',
      highlight: true
    },
    {
      value: PROGRAM_STATS.statesCount,
      label: 'STATES TO EXPLORE',
      highlight: false
    },
    {
      value: PROGRAM_STATS.entrepreneursCount,
      label: 'MINDS & IDEAS',
      highlight: true
    },
    {
      value: PROGRAM_STATS.hostInstitutions,
      label: 'PLACES TO DISCOVER',
      highlight: false
    },
    {
      value: PROGRAM_STATS.distanceKm,
      label: 'KM OF EXPLORATION',
      highlight: true
    },
    {
      value: PROGRAM_STATS.learningHours,
      label: 'HOURS OF LEARNING',
      highlight: false
    }
  ];

  return (
    <section
      id="impact-metrics"
      className="relative z-20 w-full bg-[#0D1B2A] text-white border-t border-b border-[#C8DFDB]/20 select-none"
      style={{
        paddingTop: 'clamp(48px, 6vw, 72px)',
        paddingBottom: 'clamp(48px, 6vw, 72px)'
      }}
    >
      {/* Subtle Ambient Radial Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[200px] bg-[#3368A0]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <ScrollReveal animation="fade-up" duration={700} threshold={0.15}>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-0">
            {metrics.map((item, index) => {
              // Responsive border calculations
              const isLastColLg = index === 5;
              const isLastColMd = (index + 1) % 3 === 0;
              const isLastColSm = (index + 1) % 2 === 0;
              const isBottomRowMd = index >= 3;
              const isBottomRowSm = index >= 4;

              const borderClasses = [
                'border-white/10',
                // Desktop: border-r on all except last column
                !isLastColLg ? 'lg:border-r' : 'lg:border-r-0',
                // Tablet: border-r on cols 1,2 and 4,5; border-b on top row (cols 1,2,3)
                !isLastColMd ? 'md:max-lg:border-r' : 'md:max-lg:border-r-0',
                !isBottomRowMd ? 'md:max-lg:border-b' : 'md:max-lg:border-b-0',
                // Mobile: border-r on cols 1,3,5; border-b on rows 1,2 (cols 1,2,3,4)
                !isLastColSm ? 'max-md:border-r' : 'max-md:border-r-0',
                !isBottomRowSm ? 'max-md:border-b' : 'max-md:border-b-0'
              ].join(' ');

              return (
                <div
                  key={index}
                  className={`group relative flex flex-col items-center justify-center text-center py-6 sm:py-8 px-3 sm:px-4 transition-colors duration-300 hover:bg-white/[0.02] ${borderClasses}`}
                >
                  {/* Big Number Display */}
                  <div className="transform group-hover:-translate-y-1 transition-transform duration-300 ease-out flex items-center justify-center">
                    <span
                      className={`font-serif text-3xl sm:text-4xl lg:text-[44px] font-semibold leading-none tracking-tight transition-all duration-300 ${
                        item.highlight
                          ? 'text-[#F2B134] group-hover:drop-shadow-[0_0_14px_rgba(242,177,52,0.45)]'
                          : 'text-[#FAF8F5] group-hover:text-[#F2B134] group-hover:drop-shadow-[0_0_14px_rgba(242,177,52,0.45)]'
                      }`}
                      style={{ fontFamily: '"Playfair Display", "Cinzel", "Cormorant Garamond", Georgia, serif' }}
                    >
                      <ScrollAnimatedCounter value={item.value} duration={1800} />
                    </span>
                  </div>

                  {/* Caption Label */}
                  <span className="mt-2.5 sm:mt-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#8EA0AC] group-hover:text-[#C8DFDB] transition-colors duration-300 block">
                    {item.label}
                  </span>
                </div>
              );
            })}
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
