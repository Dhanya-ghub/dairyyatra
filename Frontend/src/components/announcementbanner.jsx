import React from 'react';
import { ChevronRight } from 'lucide-react';

/* Thin strip across the very top of every page. Clicking anywhere on it opens the
   Expression of Interest form (same action as the header button).

   The height is fixed on purpose (h-9 / sm:h-10) so the pages below can offset for
   it with a known number — if you change the height here, update:
     - Hero.jsx  -> section pt-[100px] sm:pt-[104px]
     - Hero.jsx  -> logo panel top-[48px] lg:top-[56px]
   Long text is truncated rather than wrapped so the strip never grows to two lines. */
export default function AnnouncementBanner({ onOpenApply }) {
  return (
    <button
      type="button"
      onClick={onOpenApply}
      className="group flex h-9 w-full cursor-pointer items-center justify-center gap-2 overflow-hidden bg-[#1B2A4A] px-4 text-white transition-colors duration-200 hover:bg-[#23365C] sm:h-10"
    >
      {/* small pulsing dot, hidden on very small screens to save room */}
      <span
        className="hidden h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-[#E3C98F] sm:block"
        aria-hidden="true"
      />

      <span className="truncate text-[11px] font-semibold tracking-[0.03em] sm:text-[12.5px]">
        <span className="font-bold text-[#E3C98F]">APPLICATION DEADLINE EXTENDED</span>
        <span className="mx-1.5 text-white/40" aria-hidden="true">|</span>
        Submit your Expression of Interest Now!
      </span>

      <span className="flex shrink-0 items-center gap-0.5 text-[11px] font-bold uppercase tracking-wider text-[#E3C98F] underline decoration-[#E3C98F]/40 underline-offset-[3px] transition-colors group-hover:decoration-[#E3C98F] sm:text-[12px]">
        EOI
        <ChevronRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
      </span>
    </button>
  );
}