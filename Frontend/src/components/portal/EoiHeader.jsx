import React from 'react';
import { ArrowLeft } from 'lucide-react';

const LOGO_URL = '/logo.png'; // same logo as the landing page (public/ folder)

export default function EoiHeader({ currentStep, totalSteps = 2, onClose, isDraftSaved, showProgress = true }) {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <header
      className={`sticky top-0 z-40 bg-[#12223D] text-white print:hidden ${
        showProgress ? '' : 'border-b border-white/10'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

        {/* Brand. White disc because the logo is dark; no ring, no shadow. */}
        <div className="flex min-w-0 items-center gap-3">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white p-[5px]">
            <img src={LOGO_URL} alt="" className="h-full w-full object-contain" draggable="false" />
          </span>

          <div className="min-w-0">
            <div className="truncate text-[15px] font-semibold leading-tight sm:text-[16px]">Dairy Yatra 2027</div>
            <div className="truncate text-[12px] leading-tight text-[#E3C98F]">Expression of Interest</div>
          </div>
        </div>

        {/* Status and exit. Plain text — the stepper below already carries the visual weight. */}
        <div className="flex shrink-0 items-center gap-5 text-[13px]">
          {showProgress && (
            <span className="hidden text-white/55 md:inline">
              Step {currentStep} of {totalSteps}
            </span>
          )}

          {showProgress && isDraftSaved && <span className="hidden text-white/55 lg:inline">Draft saved</span>}

          <button
            onClick={onClose}
            className="group flex cursor-pointer items-center gap-1.5 text-white/80 transition-colors hover:text-white"
          >
            <ArrowLeft className="h-4 w-4 transition-transform duration-200 group-hover:-translate-x-0.5" />
            <span className="hidden sm:inline">Back to Dairy Yatra</span>
            <span className="sm:hidden">Exit</span>
          </button>
        </div>
      </div>

      {/* One solid gold line. Doubles as the header's bottom border. */}
      {showProgress && (
        <div className="h-[2px] w-full bg-[#27395A]">
          <div
            className="h-full bg-[#E3C98F] transition-[width] duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </header>
  );
}