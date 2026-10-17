import React, { useState } from 'react';
import { Download, Volume2, VolumeX, Menu, X, ChevronRight, Compass, Calendar, Layers } from 'lucide-react';
import { JOURNEY_CHAPTERS } from '../data/scrollytellingData';

export default function JourneyHeader({
  currentStopIndex,
  currentStop,
  onOpenApply,
  onOpenOverview,
  onSelectChapter,
  isAudioActive,
  onToggleAudio
}) {
  const [isChapterMenuOpen, setIsChapterMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-[#1a1412]/90 via-[#1a1412]/60 to-transparent py-3 sm:py-4 transition-all duration-300 text-white select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
        
        {/* Brand Logo */}
        <div className="flex items-center gap-3 group cursor-pointer" onClick={() => onSelectChapter(0)}>
          <img
            src="/logo.jpeg"
            alt="Dairy Yatra Logo"
            className="h-9 sm:h-11 w-auto object-contain rounded-xl bg-white p-1 shadow-lg group-hover:scale-105 transition-transform"
          />
          <div className="flex flex-col">
            <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight leading-none text-white">
              Dairy Yatra
            </span>
            <span className="text-[9px] sm:text-[10px] uppercase tracking-widest font-sans font-bold text-brand-gold">
              Beyond the Farm
            </span>
          </div>
        </div>

        {/* Center Chapter Dropdown / Indicator */}
        <div className="relative hidden md:block">
          <button
            onClick={() => setIsChapterMenuOpen(!isChapterMenuOpen)}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-xs font-semibold text-brand-cream transition-all shadow-md"
          >
            <span className="w-2 h-2 rounded-full bg-brand-gold animate-pulse" />
            <span className="text-brand-gold font-bold">{currentStop.chapterNum}</span>
            <span className="text-white/60">·</span>
            <span className="tracking-wide uppercase font-medium">{currentStop.chapterTheme}</span>
            <span className="text-[10px] bg-white/15 px-2 py-0.5 rounded-full text-white/90 ml-1">
              {currentStop.dayLabel}
            </span>
          </button>

          {/* Chapter Quick Jump Menu */}
          {isChapterMenuOpen && (
            <div className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-80 bg-brand-dark/95 backdrop-blur-2xl rounded-2xl p-2 border border-white/20 shadow-2xl space-y-1 animate-fadeIn">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-brand-gold border-b border-white/10">
                Jump to Chapter
              </div>
              {JOURNEY_CHAPTERS.map((ch, idx) => {
                const isCurrent = currentStop.chapterId === ch.id;
                return (
                  <button
                    key={ch.id}
                    onClick={() => {
                      onSelectChapter(idx);
                      setIsChapterMenuOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-xl text-xs transition-all flex items-center justify-between ${
                      isCurrent
                        ? 'bg-brand-gold text-brand-dark font-bold'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <div>
                      <span className="text-[10px] opacity-80 block">{ch.dayRange} · {ch.state}</span>
                      <span className="font-serif text-sm">{ch.chapterTitle}</span>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Ambient Train Soundscape Toggle */}
          <button
            onClick={onToggleAudio}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold backdrop-blur-md border transition-all ${
              isAudioActive
                ? 'bg-brand-gold text-brand-dark border-brand-gold shadow-[0_0_12px_rgba(224,176,56,0.5)] font-bold'
                : 'bg-white/10 text-white/80 border-white/20 hover:bg-white/20'
            }`}
            title="Toggle Cinematic Travel Soundscape"
          >
            {isAudioActive ? <Volume2 className="w-4 h-4 animate-pulse" /> : <VolumeX className="w-4 h-4" />}
            <span className="hidden sm:inline text-[11px]">{isAudioActive ? 'Sound On' : 'Ambient Audio'}</span>
          </button>

          {/* Full Itinerary Matrix Modal Trigger */}
          <button
            onClick={onOpenOverview}
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md border border-white/20 transition-all"
            title="View Complete 15-Day Itinerary Table & Host Directory"
          >
            <Layers className="w-3.5 h-3.5 text-brand-gold" />
            <span className="hidden md:inline">Full Schedule</span>
          </button>

          {/* Brochure PDF */}
          <a
            href="/Dairy_Yatra_2027_Brochure.pdf"
            download="Dairy_Yatra_2027_Brochure.pdf"
            className="hidden lg:flex items-center gap-1 bg-white/10 hover:bg-white/20 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold backdrop-blur-md border border-white/20 transition-all"
          >
            <Download className="w-3.5 h-3.5" /> PDF
          </a>

          {/* Apply CTA */}
          <button
            onClick={onOpenApply}
            className="bg-brand-terracotta hover:bg-brand-amber text-white px-4 sm:px-5 py-1.5 rounded-xl font-bold text-xs sm:text-sm shadow-xl transition-all hover:scale-105 active:scale-95"
          >
            Apply Now
          </button>

          {/* Mobile Drawer button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-1.5 rounded-xl bg-white/10 text-white"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-brand-dark text-white px-6 py-6 border-t border-white/10 space-y-4 shadow-2xl animate-fadeIn">
          <div className="text-xs uppercase font-bold text-brand-gold tracking-widest pb-1 border-b border-white/10">
            Journey Chapters
          </div>
          <div className="grid grid-cols-1 gap-2">
            {JOURNEY_CHAPTERS.map((ch, idx) => (
              <button
                key={ch.id}
                onClick={() => {
                  onSelectChapter(idx);
                  setIsMobileMenuOpen(false);
                }}
                className={`text-left p-2.5 rounded-xl text-xs flex items-center justify-between ${
                  currentStop.chapterId === ch.id
                    ? 'bg-brand-gold text-brand-dark font-bold'
                    : 'bg-white/5 text-white/80'
                }`}
              >
                <div>
                  <span className="block text-[10px] opacity-70">CHAPTER {ch.chapterNum} · {ch.dayRange}</span>
                  <span className="font-serif text-sm">{ch.chapterTitle}</span>
                </div>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </button>
            ))}
          </div>

          <div className="pt-2 border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenOverview();
              }}
              className="w-full bg-white/10 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-white/20"
            >
              <Layers className="w-4 h-4 text-brand-gold" /> View 15-Day Matrix & Hosts
            </button>
            <a
              href="/Dairy_Yatra_2027_Brochure.pdf"
              download="Dairy_Yatra_2027_Brochure.pdf"
              className="w-full bg-white/5 text-white/80 font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 border border-white/10"
            >
              <Download className="w-4 h-4" /> Download Official Brochure
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
