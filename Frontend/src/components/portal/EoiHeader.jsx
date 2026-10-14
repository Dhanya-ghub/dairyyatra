import React from 'react';
import { ArrowLeft } from 'lucide-react';

const LOGO_URL = '/logo.png'; // same logo as the landing page (public/ folder)

export default function EoiHeader({ currentStep, totalSteps = 2, onClose, isDraftSaved, showProgress = true }) {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <header className="sticky top-0 z-40 border-b border-[#E3C98F]/25 bg-gradient-to-b from-[#16294A] to-[#12223D] text-white shadow-[0_10px_30px_rgba(10,20,40,0.35)] print:hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[76px] items-center justify-between gap-4">
          {/* Brand: round logo badge (like the landing page) + title */}
          <div className="flex min-w-0 items-center gap-4">
            <span className="flex h-[54px] w-[54px] shrink-0 items-center justify-center rounded-full bg-[#F7F1E3] p-[7px] shadow-[0_6px_18px_rgba(0,0,0,0.35)] ring-2 ring-[#E3C98F]">
              <img src={LOGO_URL} alt="Dairy Yatra" className="h-full w-full object-contain" draggable="false" />
            </span>

            <span className="hidden h-9 w-px bg-white/15 sm:block" aria-hidden="true" />

            <div className="min-w-0 leading-none">
              <div className="truncate text-[17px] font-bold tracking-[0.04em] sm:text-[20px]">DAIRY YATRA 2027</div>
              <div className="mt-1.5 text-[10.5px] font-semibold uppercase tracking-[0.3em] text-[#E3C98F]">Expression of Interest</div>
            </div>
          </div>

          {/* Right side */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {showProgress && (
              <span className="hidden text-[11px] font-bold uppercase tracking-[0.25em] text-white/60 md:inline">
                Step {currentStep} of {totalSteps}
              </span>
            )}

            {showProgress && isDraftSaved && (
              <div className="hidden items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs text-[#C8DFDB] lg:flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
                Draft saved on this device
              </div>
            )}

            <button
              onClick={onClose}
              className="flex cursor-pointer items-center gap-2 rounded-full border border-white/25 px-4 py-2 text-xs font-bold transition-all hover:border-[#E3C98F]/60 hover:bg-white/10 active:scale-95 sm:text-sm"
            >
              <ArrowLeft className="h-4 w-4 text-[#E3C98F]" />
              <span className="hidden sm:inline">Back to Dairy Yatra</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </div>

      {showProgress && (
        <div className="h-[3px] w-full bg-white/10">
          <div
            className="h-full bg-gradient-to-r from-[#66A3BF] via-[#E3C98F] to-[#3368A0] transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </header>
  );
}