import React from 'react';
import { ArrowLeft, BookmarkCheck } from 'lucide-react';

export default function EoiHeader({ currentStep, totalSteps = 2, onClose, isDraftSaved, showProgress = true }) {
  const percent = Math.round((currentStep / totalSteps) * 100);

  return (
    <header className="sticky top-0 z-40 bg-[#142538] text-white border-b border-[#3368A0]/40 shadow-md print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center gap-3.5">
            <div className="w-[48px] h-[48px] min-w-[48px] overflow-hidden rounded-[12px] bg-white/5 border border-white/20">
              <video autoPlay loop muted playsInline className="w-full h-full object-cover block pointer-events-none">
                <source src="/Logo%20vid.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="flex flex-col">
              <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight leading-none">DAIRY YATRA 2027</span>
              <span className="text-[10px] uppercase tracking-widest font-bold text-[#C8DFDB]">
                Expression of Interest
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            {showProgress && isDraftSaved && (
              <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#3368A0]/30 border border-[#C8DFDB]/30 text-xs text-[#C8DFDB]">
                <BookmarkCheck className="w-3.5 h-3.5 text-[#66A3BF]" />
                <span>Draft saved on this device</span>
              </div>
            )}
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border border-white/30 hover:bg-white/15 transition-all active:scale-95 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 text-[#C8DFDB]" />
              <span className="hidden sm:inline">Back to Dairy Yatra</span>
              <span className="sm:hidden">Exit</span>
            </button>
          </div>
        </div>
      </div>

      {showProgress && (
        <div className="w-full bg-[#101d2c] h-1.5 overflow-hidden">
          <div
            className="bg-gradient-to-r from-[#66A3BF] via-[#C8DFDB] to-[#3368A0] h-full transition-all duration-500 ease-out"
            style={{ width: `${percent}%` }}
          />
        </div>
      )}
    </header>
  );
}