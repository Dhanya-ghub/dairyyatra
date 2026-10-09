import React from 'react';
import { X, MapPin, Train, Compass, CheckCircle2, Building2, Calendar, Thermometer, ArrowRight, Sparkles } from 'lucide-react';

export default function DayDetailsModal({ stop, isOpen, onClose, onOpenApply }) {
  if (!isOpen || !stop) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-white text-[#172738] rounded-3xl overflow-hidden shadow-2xl border border-[#C8DFDB] my-auto flex flex-col max-h-[90vh]">
        
        {/* Header Media Banner */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden shrink-0">
          <img
            src={stop.image}
            alt={stop.locationName}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#142538] via-[#142538]/40 to-transparent" />
          
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-white hover:text-black transition-all shadow-lg cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-6 left-6 right-6 text-white">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-[#3368A0] text-white text-xs font-bold uppercase rounded-md tracking-wider">
                {stop.chapterNum}
              </span>
              <span className="px-3 py-1 bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase rounded-md tracking-wider">
                {stop.dayLabel}
              </span>
              <span className="px-3 py-1 bg-[#66A3BF]/80 backdrop-blur-md text-white text-xs font-bold rounded-md flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-[#C8DFDB]" /> {stop.locationName}, {stop.stateName}
              </span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold tracking-tight mb-1 text-white">
              {stop.headline}
            </h2>
            <p className="text-xs sm:text-sm text-[#F2EFE7]/80 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-[#C8DFDB] shrink-0" /> {stop.institution}
            </p>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 flex-1">
          
          {/* Quote Strip */}
          {stop.quote && (
            <div className="p-4 rounded-2xl bg-[#F2EFE7] border-l-4 border-[#3368A0] italic text-sm text-[#172738] font-serif">
              {stop.quote}
            </div>
          )}

          {/* Context Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F2EFE7] p-4 rounded-2xl border border-[#C8DFDB] text-xs">
            <div>
              <span className="text-[#4E657D] uppercase font-bold tracking-wider block text-[10px]">Travel Mode</span>
              <span className="font-bold text-[#172738] flex items-center gap-1 mt-0.5">
                <Train className="w-3.5 h-3.5 text-[#3368A0]" /> {stop.travelMode}
              </span>
            </div>
            <div>
              <span className="text-[#4E657D] uppercase font-bold tracking-wider block text-[10px]">Distance Traversed</span>
              <span className="font-bold text-[#3368A0] mt-0.5 block">{stop.distanceKm}</span>
            </div>
            <div>
              <span className="text-[#4E657D] uppercase font-bold tracking-wider block text-[10px]">Climate / Weather</span>
              <span className="font-bold text-[#172738] flex items-center gap-1 mt-0.5">
                <Thermometer className="w-3.5 h-3.5 text-[#66A3BF]" /> {stop.weather}
              </span>
            </div>
            <div>
              <span className="text-[#4E657D] uppercase font-bold tracking-wider block text-[10px]">Region Topography</span>
              <span className="font-bold text-[#172738] mt-0.5 block">{stop.regionTag}</span>
            </div>
          </div>

          {/* Story Narrative */}
          <div>
            <h3 className="font-serif text-xl font-bold text-[#172738] mb-2">
              Immersion Briefing & Context
            </h3>
            <p className="text-sm text-[#4E657D] leading-relaxed mb-3">
              {stop.storyText}
            </p>
            <p className="text-sm text-[#4E657D] leading-relaxed">
              {stop.extendedDescription}
            </p>
          </div>

          {/* Key Immersion Objectives */}
          <div>
            <h3 className="font-serif text-xl font-bold text-[#172738] mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#3368A0]" /> Core Learning Focus
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {stop.keyThemes.map((theme, i) => (
                <div key={i} className="flex items-start gap-2.5 p-3 rounded-xl bg-[#F2EFE7] border border-[#C8DFDB]">
                  <CheckCircle2 className="w-4 h-4 text-[#3368A0] shrink-0 mt-0.5" />
                  <span className="text-xs font-semibold text-[#172738]">{theme}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Highlights */}
          <div>
            <h3 className="font-serif text-xl font-bold text-[#172738] mb-3">
              Field Itinerary Highlights
            </h3>
            <ul className="space-y-2">
              {stop.immersionHighlights.map((hl, i) => (
                <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#4E657D]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#3368A0] mt-2 shrink-0" />
                  <span>{hl}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#F2EFE7] border-t border-[#C8DFDB] flex flex-wrap items-center justify-between gap-4 shrink-0">
          <button
            onClick={onClose}
            className="text-xs font-bold text-[#4E657D] hover:text-[#172738] transition-colors px-4 py-2 cursor-pointer"
          >
            ← Return to Timeline
          </button>

          <div className="flex items-center gap-3">
            <a
              href="/Dairy_Yatra_2025_Brochure.pdf"
              download="Dairy_Yatra_2025_Brochure.pdf"
              className="text-xs font-bold text-[#3368A0] hover:underline px-3 py-2"
            >
              Download Brochure PDF
            </a>
            <button
              onClick={() => {
                onClose();
                onOpenApply();
              }}
              className="flex items-center gap-2 bg-[#3368A0] hover:bg-[#234974] text-white px-5 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-transform hover:scale-105 cursor-pointer"
            >
              Expression of Interest <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
