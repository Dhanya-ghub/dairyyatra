import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useOutsideClick } from '@/hooks/use-outside-click';
import { X, ExternalLink, MapPin, CheckCircle2, Sparkles } from 'lucide-react';

/**
 * ExpandableBentoGrid Component
 * Displays a clean, neatly aligned grid of white logo tiles that opens
 * a cleanly rendered modal via React Portal (eliminates any parent container clipping / black box artifacts).
 */
export default function ExpandableBentoGrid({ items = [], className = '' }) {
  const [active, setActive] = useState(null);
  const ref = useRef(null);

  useEffect(() => {
    function onKeyDown(event) {
      if (event.key === 'Escape') {
        setActive(null);
      }
    }

    if (active && typeof active === 'object') {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }

    window.addEventListener('keydown', onKeyDown);
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = 'auto';
    };
  }, [active]);

  useOutsideClick(ref, () => setActive(null));

  const handleCardClick = (item) => {
    setActive(item);
  };

  // Render modal to document.body to prevent parent transform clipping / boxed background artifacts
  const modalContent = (
    <AnimatePresence>
      {active && typeof active === 'object' && (
        <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6">
          {/* Full-Screen Ambient Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={() => setActive(null)}
            className="fixed inset-0 bg-[#142538]/20 backdrop-blur-[2px] cursor-pointer"
          />

          {/* Centered Modal Card */}
          <motion.div
            ref={ref}
            initial={{ opacity: 0, scale: 0.92, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 10 }}
            transition={{ type: 'spring', damping: 28, stiffness: 350 }}
            className="w-full max-w-[460px] sm:max-w-[480px] flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden shadow-[0_25px_70px_rgba(20,37,56,0.22)] border border-[#C8DFDB] relative z-10 select-none pointer-events-auto"
          >
            {/* Top Visual Banner with Centered Logo */}
            <div className="w-full h-28 sm:h-32 bg-gradient-to-b from-[#EBF3F8] to-[#F7FAFC] relative flex items-center justify-center p-3 border-b border-[#E2E8F0] overflow-hidden shrink-0">
              {/* Category Pill Tag */}
              {active.tag && (
                <span className="absolute top-2.5 left-3 z-10 bg-white/95 backdrop-blur-md text-[#3368A0] text-[10px] sm:text-[11px] font-bold px-2.5 py-0.5 rounded-full border border-[#C8DFDB] shadow-2xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#66A3BF]" />
                  <span>{active.tag}</span>
                </span>
              )}

              {/* Close Button (X) */}
              <button
                type="button"
                aria-label="Close details"
                onClick={(e) => {
                  e.stopPropagation();
                  setActive(null);
                }}
                className="absolute top-2.5 right-3 z-20 flex items-center justify-center bg-white/95 hover:bg-white text-[#172738] hover:text-[#3368A0] rounded-full h-7 w-7 sm:h-8 sm:w-8 shadow-xs border border-slate-200/80 transition-all hover:scale-105 active:scale-95 cursor-pointer backdrop-blur-sm"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Partner Logo */}
              <div className="relative z-10 w-full h-full flex items-center justify-center p-1.5">
                {active.logo ? (
                  <img
                    src={active.logo}
                    alt={active.title || active.name}
                    className="max-h-14 sm:max-h-16 max-w-[60%] object-contain filter drop-shadow-xs"
                  />
                ) : active.icon ? (
                  <div className="scale-110 text-[#3368A0]">{active.icon}</div>
                ) : (
                  <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center text-[#3368A0] font-bold text-lg">
                    {(active.title || active.name || 'P')[0]}
                  </div>
                )}
              </div>
            </div>

            {/* Modal Body Container */}
            <div className="p-4 sm:p-5 space-y-3 bg-white">
              {/* Header Row: Title, Subtitle, and Visit Button */}
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#172738] leading-tight">
                    {active.fullName || active.title || active.name}
                  </h3>
                  
                  <div className="flex items-center gap-2 mt-1 text-xs text-[#4E657D]">
                    {active.location && (
                      <span className="flex items-center gap-1 font-medium text-[#3368A0]">
                        <MapPin className="w-3 h-3 text-[#66A3BF] shrink-0" />
                        <span>{active.location}</span>
                      </span>
                    )}
                    {active.days && (
                      <span className="text-[10px] font-semibold bg-[#EBF3F8] text-[#234974] px-2 py-0.5 rounded-md border border-[#C8DFDB]/60">
                        {active.days}
                      </span>
                    )}
                  </div>
                </div>

                {/* Visit Link / Action */}
                {active.website && (
                  <a
                    href={active.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 text-xs font-bold rounded-xl bg-[#3368A0] hover:bg-[#234974] text-white flex items-center gap-1.5 shadow-xs hover:shadow-sm transition-all shrink-0 active:scale-95"
                  >
                    <span>Visit</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              {/* Concise Overview Paragraph */}
              {active.description && (
                <p className="text-xs text-[#4E657D] leading-relaxed">
                  {active.description}
                </p>
              )}

              {/* Structured Feature / Immersion Box */}
              <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                {/* Learning Points */}
                {active.learnings && active.learnings.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[10px] font-bold uppercase tracking-wider text-[#3368A0] flex items-center gap-1">
                      <Sparkles className="w-3 h-3 text-[#66A3BF]" />
                      <span>Key Field Immersion Takeaways</span>
                    </div>
                    <div className="space-y-1">
                      {active.learnings.slice(0, 2).map((learning, idx) => (
                        <div
                          key={idx}
                          className="flex items-start gap-2 text-xs text-[#334155] leading-snug"
                        >
                          <span className="w-1.5 h-1.5 rounded-full bg-[#3368A0] shrink-0 mt-1.5" />
                          <span>{learning}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Core Focus Pills */}
                {active.highlights && active.highlights.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {active.highlights.slice(0, 3).map((highlight, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-md bg-[#EBF3F8] text-[#234974] text-[10px] font-medium border border-[#C8DFDB]/60"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>
                )}

                {/* Bottom Verification Line */}
                <div className="pt-1.5 border-t border-[#E2E8F0] flex items-center justify-between text-[10px] font-medium text-[#4E657D]">
                  <span className="inline-flex items-center gap-1 text-[#3368A0] font-semibold">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#3368A0]" />
                    <span>Included in 15-Day Itinerary</span>
                  </span>
                  <span>Direct Institution Access</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return (
    <>
      {/* Portal Modal directly into document.body */}
      {typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null}

      {/* Clean, Neat Logo Grid (Reference Design: White rounded rectangle tiles) */}
      <div className={`grid grid-cols-2 sm:grid-cols-3 gap-3.5 sm:gap-4 md:gap-5 items-stretch max-w-4xl mx-auto ${className}`}>
        {items.map((item) => (
          <div
            key={item.id || item.title}
            onClick={() => handleCardClick(item)}
            className="h-20 sm:h-24 md:h-26 px-5 py-3 sm:px-6 sm:py-4 flex items-center justify-center rounded-2xl cursor-pointer bg-white border border-[#E2E8F0] shadow-xs hover:shadow-md hover:border-[#3368A0]/50 hover:-translate-y-0.5 transition-all duration-300 group select-none relative overflow-hidden active:scale-[0.98]"
          >
            {/* Centered Logo */}
            <div className="w-full h-full flex items-center justify-center relative z-10">
              {item.logo ? (
                <img
                  src={item.logo}
                  alt={item.title || item.name}
                  className="max-h-10 sm:max-h-12 md:max-h-14 max-w-[75%] object-contain filter drop-shadow-2xs group-hover:scale-105 transition-transform duration-300"
                  loading="lazy"
                />
              ) : item.icon ? (
                <div className="scale-110 text-[#3368A0]">{item.icon}</div>
              ) : (
                <div className="font-bold text-[#3368A0] text-lg font-serif">
                  {(item.title || item.name || 'P')[0]}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
