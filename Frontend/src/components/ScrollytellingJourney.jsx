import React, { useState, useEffect, useRef, useCallback } from 'react';
import { JOURNEY_STOPS, TIMELINE_NODES, JOURNEY_CHAPTERS } from '../data/scrollytellingData';
import {
  ChevronLeft,
  ChevronRight,
  MapPin,
  Train,
  Plane,
  Bus,
  Thermometer,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Building2,
  Maximize2,
  Compass,
  Calendar,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import DayDetailsModal from './DayDetailsModal';
import cowIcon from '../assets/cow.png';

export default function ScrollytellingJourney({
  onOpenApply,
  onOpenOverview,
  currentStopIndex,
  setCurrentStopIndex
}) {
  const [selectedModalStop, setSelectedModalStop] = useState(null);
  const [direction, setDirection] = useState('next'); // 'next' | 'prev'
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStartX, setTouchStartX] = useState(0);
  const [touchStartY, setTouchStartY] = useState(0);

  const containerRef = useRef(null);
  const lastScrollTime = useRef(0);
  const scrollAccumulator = useRef(0);

  const totalStops = JOURNEY_STOPS.length;
  const currentStop = JOURNEY_STOPS[currentStopIndex];

  // Navigate to stop with animation direction
  const goToStop = useCallback((newIndex) => {
    if (newIndex === currentStopIndex || newIndex < 0 || newIndex >= totalStops) return;

    setDirection(newIndex > currentStopIndex ? 'next' : 'prev');
    setIsTransitioning(true);
    setCurrentStopIndex(newIndex);

    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, [currentStopIndex, totalStops, setCurrentStopIndex]);

  const handleNext = useCallback(() => {
    if (currentStopIndex < totalStops - 1) {
      goToStop(currentStopIndex + 1);
    }
  }, [currentStopIndex, totalStops, goToStop]);

  const handlePrev = useCallback(() => {
    if (currentStopIndex > 0) {
      goToStop(currentStopIndex - 1);
    }
  }, [currentStopIndex, goToStop]);

  // Handle Wheel scroll translating vertical scroll to horizontal chapter steps
  useEffect(() => {
    const handleWheel = (e) => {
      // Don't scroll journey if modal is open
      if (selectedModalStop) return;

      const now = Date.now();
      const delta = Math.abs(e.deltaY) > Math.abs(e.deltaX) ? e.deltaY : e.deltaX;

      scrollAccumulator.current += delta;

      // Throttle rapid wheel events (minimum 450ms between steps, threshold of 50px)
      if (now - lastScrollTime.current > 450 && Math.abs(scrollAccumulator.current) > 40) {
        if (scrollAccumulator.current > 0) {
          handleNext();
        } else {
          handlePrev();
        }
        lastScrollTime.current = now;
        scrollAccumulator.current = 0;
      }
    };

    window.addEventListener('wheel', handleWheel, { passive: true });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [handleNext, handlePrev, selectedModalStop]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (selectedModalStop) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, selectedModalStop]);

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchEnd = (e) => {
    if (selectedModalStop) return;

    const diffX = touchStartX - e.changedTouches[0].clientX;
    const diffY = touchStartY - e.changedTouches[0].clientY;

    if (Math.abs(diffX) > 40 || Math.abs(diffY) > 40) {
      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) handleNext();
        else handlePrev();
      } else {
        if (diffY > 0) handleNext();
        else handlePrev();
      }
    }
  };

  // Calculate percentage of journey traversed
  const progressPercent = Math.round((currentStopIndex / (totalStops - 1)) * 100);

  return (
    <div
      ref={containerRef}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative w-screen h-screen overflow-hidden bg-[#16110f] text-white flex flex-col justify-between select-none"
    >
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 -left-32 w-[600px] h-[600px] bg-brand-forest/20 rounded-full blur-[120px] pointer-events-none transition-all duration-1000" />
      <div className="absolute bottom-1/4 -right-32 w-[600px] h-[600px] bg-brand-terracotta/20 rounded-full blur-[120px] pointer-events-none transition-all duration-1000" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-gold/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Subtle Map Grid Pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '32px 32px'
        }}
      />

      {/* Main Experience Viewport: 3-Column Documentary Grid (Left Story, Center Visual, Right Metadata) */}
      <div className="relative z-20 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-8 lg:px-12 pt-20 sm:pt-24 pb-28 sm:pb-32 flex items-center">
        
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center h-full max-h-[720px]">
          
          {/* ======================================================== */}
          {/* 1. LEFT SIDE — STORY CONTENT (Slides horizontally)       */}
          {/* ======================================================== */}
          <div className="lg:col-span-4 flex flex-col justify-center order-2 lg:order-1 overflow-hidden">
            <div
              key={`story-${currentStop.id}`}
              className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isTransitioning
                  ? direction === 'next'
                    ? '-translate-x-12 opacity-0'
                    : 'translate-x-12 opacity-0'
                  : 'translate-x-0 opacity-100'
              }`}
            >
              {/* Chapter & Day Eyebrow */}
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full border border-brand-gold/30">
                  {currentStop.chapterNum}
                </span>
                <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-brand-cream/70">
                  {currentStop.dayLabel}
                </span>
              </div>

              {/* Grand Location Headline */}
              <div className="mb-2">
                <span className="text-xs uppercase tracking-widest text-brand-terracotta font-bold block mb-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold" /> {currentStop.stateName}
                </span>
                <h1 className="font-serif text-3xl sm:text-4xl xl:text-5xl font-bold tracking-tight text-white leading-[1.1] mb-2">
                  {currentStop.locationName}
                </h1>
                <h2 className="font-serif text-lg sm:text-xl italic text-brand-gold font-normal">
                  {currentStop.headline}
                </h2>
              </div>

              {/* Key Institution Banner */}
              <div className="inline-flex items-center gap-1.5 text-xs text-brand-cream/80 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl mb-4 max-w-full">
                <Building2 className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                <span className="truncate font-medium">{currentStop.institution}</span>
              </div>

              {/* Narrative Story Description */}
              <p className="text-xs sm:text-sm text-brand-cream/85 leading-relaxed font-light mb-6 line-clamp-4 sm:line-clamp-none max-w-md">
                {currentStop.storyText}
              </p>

              {/* Story CTA & Actions */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => setSelectedModalStop(currentStop)}
                  className="group flex items-center gap-2 bg-brand-forest hover:bg-brand-olive text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-xl border border-white/15 hover:scale-105 active:scale-95 transition-all"
                >
                  <span>Explore Day Details</span>
                  <ArrowRight className="w-4 h-4 text-brand-gold group-hover:translate-x-1 transition-transform" />
                </button>

                {currentStopIndex === totalStops - 1 ? (
                  <button
                    onClick={onOpenApply}
                    className="bg-brand-terracotta hover:bg-brand-amber text-white px-5 py-2.5 rounded-2xl text-xs sm:text-sm font-bold shadow-xl hover:scale-105 active:scale-95 transition-all"
                  >
                    Apply for Next Cohort
                  </button>
                ) : (
                  <button
                    onClick={handleNext}
                    className="hidden sm:inline-flex items-center gap-1 text-xs text-brand-cream/70 hover:text-white px-3 py-2 transition-colors"
                  >
                    <span>Next Destination</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* 2. CENTRE OF THE SCREEN — MAIN CINEMATIC VISUAL          */}
          {/* ======================================================== */}
          <div className="lg:col-span-5 flex items-center justify-center order-1 lg:order-2">
            <div className="relative w-full aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/3.2] max-h-[440px] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.7)] border-2 border-white/20 group">
              
              {/* Cinematic Location Photography */}
              <div
                key={`img-${currentStop.id}`}
                className={`w-full h-full relative transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                  isTransitioning ? 'scale-110 opacity-70 blur-sm' : 'scale-100 opacity-100 blur-0'
                }`}
              >
                <img
                  src={currentStop.image}
                  alt={currentStop.locationName}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
                />

                {/* Subtle vignette and gradient for luxury feel */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                <div className="absolute inset-0 ring-1 ring-inset ring-white/20 rounded-3xl pointer-events-none" />
              </div>

              {/* Bottom Image Caption Tag */}
              <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between text-white pointer-events-none">
                <div className="bg-black/60 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 max-w-[85%]">
                  <span className="text-[10px] sm:text-[11px] font-medium text-brand-cream/90 truncate block">
                    {currentStop.imageCaption}
                  </span>
                </div>

                <button
                  onClick={() => setSelectedModalStop(currentStop)}
                  className="pointer-events-auto w-8 h-8 rounded-full bg-black/60 hover:bg-white hover:text-brand-dark text-white backdrop-blur-md flex items-center justify-center border border-white/20 shadow-lg transition-all hover:scale-110"
                  title="Enlarge & inspect full details"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Top Right Travel Mode Badge */}
              <div className="absolute top-4 right-4 bg-brand-dark/80 backdrop-blur-md text-brand-gold px-3 py-1 rounded-full border border-brand-gold/40 text-[11px] font-bold flex items-center gap-1.5 shadow-lg">
                <Train className="w-3 h-3 text-brand-gold" />
                <span>{currentStop.travelMode}</span>
              </div>

            </div>
          </div>

          {/* ======================================================== */}
          {/* 3. RIGHT SIDE — JOURNEY CONTEXT & METADATA               */}
          {/* ======================================================== */}
          <div className="lg:col-span-3 hidden lg:flex flex-col justify-center order-3 pl-4 border-l border-white/10">
            <div
              key={`meta-${currentStop.id}`}
              className={`transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isTransitioning ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'
              }`}
            >
              {/* Counter Indicator: 02 / 15 */}
              <div className="mb-6">
                <div className="flex items-baseline gap-1 font-serif">
                  <span className="text-4xl xl:text-5xl font-extrabold text-brand-gold">
                    {currentStop.dayNumber}
                  </span>
                  <span className="text-xl text-white/40 font-light">/ 15</span>
                </div>
                <span className="text-[11px] uppercase tracking-widest font-extrabold text-brand-cream/60 block">
                  {currentStop.dayFullRange}
                </span>
              </div>

              {/* State & Region */}
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-wider font-bold text-brand-gold/80 block mb-0.5">
                  State & Region
                </span>
                <span className="font-serif text-lg font-bold text-white block">
                  {currentStop.stateName}
                </span>
                <span className="text-xs text-brand-cream/60 block">
                  {currentStop.regionTag}
                </span>
              </div>

              {/* Key Immersion Themes */}
              <div className="mb-6">
                <span className="text-[10px] uppercase tracking-wider font-bold text-brand-gold/80 block mb-2">
                  Learning Immersion Pillars
                </span>
                <div className="space-y-1.5">
                  {currentStop.keyThemes.slice(0, 3).map((theme, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-brand-cream/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
                      <span className="line-clamp-1">{theme}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Distance & Weather Stats */}
              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-white/40 block text-[9px] uppercase font-bold">Traversed</span>
                  <span className="font-bold text-brand-terracotta">{currentStop.distanceKm}</span>
                </div>
                <div>
                  <span className="text-white/40 block text-[9px] uppercase font-bold">Climate</span>
                  <span className="font-bold text-brand-cream/90 flex items-center gap-1">
                    <Thermometer className="w-3 h-3 text-amber-500" /> {currentStop.weather}
                  </span>
                </div>
              </div>

            </div>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 4. BOTTOM — FIXED HORIZONTAL JOURNEY PROGRESS BAR        */}
      {/* Always visible across all devices                        */}
      {/* ======================================================== */}
      <nav
        aria-label="Journey Progress Tracker"
        className="fixed bottom-0 left-0 right-0 z-40 bg-[#120e0d]/95 backdrop-blur-2xl border-t border-white/15 pt-3 pb-3 sm:pb-4 px-4 sm:px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.8)]"
      >
        <div className="max-w-7xl mx-auto">
          
          {/* Top Mini Bar with Navigation Arrows, Status, and Controls */}
          <div className="flex items-center justify-between gap-4 mb-2.5 text-xs text-brand-cream/80">
            
            {/* Left Prev / Next Buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handlePrev}
                disabled={currentStopIndex === 0}
                className={`p-1.5 rounded-xl border flex items-center gap-1 transition-all ${
                  currentStopIndex === 0
                    ? 'opacity-30 border-white/10 cursor-not-allowed'
                    : 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:scale-105 active:scale-95'
                }`}
                aria-label="Previous Destination"
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px] font-bold">Prev</span>
              </button>

              <button
                onClick={handleNext}
                disabled={currentStopIndex === totalStops - 1}
                className={`p-1.5 rounded-xl border flex items-center gap-1 transition-all ${
                  currentStopIndex === totalStops - 1
                    ? 'opacity-30 border-white/10 cursor-not-allowed'
                    : 'bg-brand-gold text-brand-dark border-brand-gold font-bold hover:scale-105 active:scale-95 shadow-md'
                }`}
                aria-label="Next Destination"
              >
                <span className="hidden sm:inline text-[11px] font-bold">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <span className="hidden md:inline-block text-[11px] text-white/50 ml-2">
                Use <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-mono text-white">Scroll</kbd> or <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-[10px] font-mono text-white">← →</kbd> to travel
              </span>
            </div>

            {/* Center Current Location Breadcrumb */}
            <div className="flex items-center gap-2">
              <span className="hidden sm:inline text-brand-gold font-serif font-bold text-sm">
                {currentStop.locationName}
              </span>
              <span className="text-[11px] text-white/50 hidden sm:inline">•</span>
              <span className="text-[11px] text-brand-cream/90 font-medium">
                Stop {currentStopIndex + 1} of {totalStops}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-brand-forest/60 text-brand-gold font-extrabold text-[10px] border border-brand-gold/30">
                {progressPercent}% Complete
              </span>
            </div>

            {/* Right Overview Trigger */}
            <div className="flex items-center gap-2">
              <button
                onClick={onOpenOverview}
                className="text-[11px] text-brand-gold hover:text-white flex items-center gap-1 font-semibold hover:underline"
              >
                <Layers className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">15-Day Itinerary Matrix</span>
              </button>
            </div>

          </div>

          {/* Timeline Visual Track with Major Geographical Hubs */}
          <div className="relative pt-1 pb-1">
            
            {/* Background Inactive Route Line */}
            <div className="relative h-1.5 bg-white/15 rounded-full overflow-hidden">
              {/* Progressive Glowing Filled Route Line */}
              <div
                className="h-full bg-gradient-to-r from-brand-terracotta via-brand-gold to-brand-forest transition-all duration-700 ease-out shadow-[0_0_12px_rgba(224,176,56,0.8)]"
                style={{ width: `${(currentStopIndex / (totalStops - 1)) * 100}%` }}
              />
            </div>

            {/* Geographical Milestone Nodes (Clickable markers across all 6 chapters) */}
            <div className="relative flex items-center justify-between -mt-2.5">
              {TIMELINE_NODES.map((node, idx) => {
                const isActive = node.stopIndex === currentStopIndex;
                const isCompleted = node.stopIndex <= currentStopIndex;

                return (
                  <div
                    key={idx}
                    onClick={() => goToStop(node.stopIndex)}
                    className="group flex flex-col items-center cursor-pointer focus:outline-none"
                    role="button"
                    tabIndex={0}
                    title={`${node.label} (${node.dayText})`}
                  >
                    {/* Node Dot / Cow Active Marker */}
                    <div className="relative flex items-center justify-center">
                      {isActive ? (
                        <div className="relative flex items-center justify-center">
                          {/* Pulsing base ring */}
                          <span className="absolute w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-brand-gold/40 animate-ping pointer-events-none" />
                          
                          {/* Cow Character Badge */}
                          <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white ring-2 ring-brand-gold shadow-xl flex items-center justify-center p-1 z-10 transition-transform duration-300 scale-110 hover:scale-125">
                            <img
                              src={cowIcon}
                              alt="Active Day Cow"
                              className="w-full h-full object-contain filter drop-shadow-xs"
                            />
                          </div>
                        </div>
                      ) : (
                        <div
                          className={`rounded-full transition-all duration-300 shadow-md ${
                            isCompleted
                              ? 'w-3.5 h-3.5 bg-brand-terracotta hover:scale-125'
                              : 'w-2.5 h-2.5 bg-white/40 hover:bg-white group-hover:scale-125'
                          }`}
                        />
                      )}
                    </div>

                    {/* Milestone Label */}
                    <div className="mt-1.5 text-center transition-colors">
                      <span
                        className={`text-[10px] sm:text-[11px] font-bold tracking-tight block ${
                          isActive
                            ? 'text-brand-gold font-extrabold scale-105'
                            : isCompleted
                              ? 'text-white/90'
                              : 'text-white/40 group-hover:text-white/80'
                        }`}
                      >
                        {node.label}
                      </span>
                      <span className="text-[8px] sm:text-[9px] text-white/50 hidden sm:block">
                        {node.dayText}
                      </span>
                    </div>

                  </div>
                );
              })}
            </div>

          </div>

        </div>
      </nav>

      {/* In-Depth Day Details Modal */}
      <DayDetailsModal
        stop={selectedModalStop}
        isOpen={Boolean(selectedModalStop)}
        onClose={() => setSelectedModalStop(null)}
        onOpenApply={onOpenApply}
      />

    </div>
  );
}
