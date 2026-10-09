import React, { useState } from 'react';
import { X, Sparkles, ArrowRight, ShieldCheck, Zap, Layers } from 'lucide-react';

export default function SpotlightModal({ isOpen = true, onClose = () => {} }) {
  // Generate random particles that float and drift through the volumetric light beam
  const [particles] = useState(() =>
    Array.from({ length: 45 }, (_, i) => ({
      id: i,
      x: 32 + Math.random() * 36, // Centered within the cone of light (32% to 68% width)
      y: 2 + Math.random() * 92,
      size: Math.random() * 3.5 + 1.5,
      opacity: Math.random() * 0.85 + 0.25,
      duration: Math.random() * 7 + 5,
      delay: Math.random() * 6,
      driftX: (Math.random() - 0.5) * 50
    }))
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 select-none overflow-hidden font-sans">
      
      {/* ======================================================== */}
      {/* 1. DEEP DARK NAVY/BLACK BACKGROUND LAYER (#080c14)       */}
      {/* ======================================================== */}
      <div 
        onClick={onClose}
        className="absolute inset-0 bg-[#080c14]/95 backdrop-blur-2xl transition-opacity duration-500"
      />

      {/* Deep Space Radial Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_80%_at_50%_0%,rgba(0,170,255,0.18),transparent_75%)] pointer-events-none" />

      {/* ======================================================== */}
      {/* 2. OVERHEAD VOLUMETRIC SPOTLIGHT BEAM                     */}
      {/* ======================================================== */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden flex justify-center items-start">
        
        {/* Overhead Emitter Bulb / Lens Flare */}
        <div className="absolute -top-16 left-1/2 -translate-x-1/2 w-80 h-32 bg-cyan-200/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-48 h-16 bg-white/90 rounded-full blur-xl" />
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-16 h-8 bg-cyan-300 rounded-full blur-sm shadow-[0_0_50px_#00aaff]" />
        
        {/* Primary High-Intensity Volumetric Conical Light Beam */}
        <div 
          className="absolute top-0 w-[140vw] max-w-[1200px] h-[100vh] origin-top animate-spotlight-breathe"
          style={{
            background: `conic-gradient(from 162deg at 50% 0%, transparent 0deg, rgba(255,255,255,0.22) 12deg, rgba(186,230,253,0.14) 18deg, rgba(0,170,255,0.10) 24deg, transparent 36deg)`,
            filter: 'drop-shadow(0 0 35px rgba(0,170,255,0.25))'
          }}
        />

        {/* Secondary Inner Core Light Beam */}
        <div 
          className="absolute top-0 w-[90vw] max-w-[800px] h-[90vh] origin-top animate-spotlight-subtle"
          style={{
            background: `conic-gradient(from 168deg at 50% 0%, transparent 0deg, rgba(255,255,255,0.35) 8deg, rgba(186,230,253,0.2) 12deg, rgba(0,170,255,0.12) 16deg, transparent 24deg)`
          }}
        />

        {/* Vertical Center Glow Pillar */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[340px] h-[85vh] bg-gradient-to-b from-white/30 via-cyan-400/10 to-transparent blur-2xl pointer-events-none" />

        {/* SVG Volumetric Light Rays Texture */}
        <svg className="absolute top-0 w-full max-w-4xl h-full opacity-40 mix-blend-screen" viewBox="0 0 800 800" preserveAspectRatio="none">
          <defs>
            <linearGradient id="rayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="30%" stopColor="#bae6fd" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#00aaff" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points="400,0 220,800 280,800" fill="url(#rayGrad)" opacity="0.3" />
          <polygon points="400,0 340,800 460,800" fill="url(#rayGrad)" opacity="0.5" />
          <polygon points="400,0 520,800 580,800" fill="url(#rayGrad)" opacity="0.3" />
        </svg>

        {/* Floating Glowing Dust Particles Drifting Through Light Ray */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-cyan-100 shadow-[0_0_8px_rgba(186,230,253,1),0_0_16px_rgba(0,170,255,0.8)] animate-float-dust pointer-events-none"
            style={{
              left: `${p.x}%`,
              top: `${p.y}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              opacity: p.opacity,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
              '--drift-x': `${p.driftX}px`
            }}
          />
        ))}

      </div>

      {/* ======================================================== */}
      {/* 3. CENTERED GLASSMORPHISM MODAL CARD                     */}
      {/* ======================================================== */}
      <div 
        className="relative z-20 w-full max-w-lg bg-[#0b101b]/85 backdrop-blur-3xl rounded-2xl sm:rounded-3xl border border-white/15 shadow-[0_25px_80px_rgba(0,0,0,0.9),0_0_50px_rgba(0,170,255,0.2)] p-6 sm:p-8 md:p-10 flex flex-col justify-between overflow-hidden animate-modal-enter transition-all"
      >
        {/* Specular Highlight along the Top Edge */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-cyan-200/80 to-transparent" />
        
        {/* Inner Ambient Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-72 h-48 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* ======================================================== */}
        {/* 4. HEADER & MINIMALIST CLOSE ('X') BUTTON                */}
        {/* ======================================================== */}
        <div className="flex items-center justify-between mb-6">
          {/* Futuristic Eyebrow Badge */}
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-950/60 border border-cyan-400/30 text-cyan-300 text-[11px] font-extrabold tracking-wider uppercase backdrop-blur-md shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
            <span>Next-Gen Component Suite</span>
          </div>

          {/* Minimalist Close ('X') Button in Top-Right Corner */}
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white border border-white/10 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 group"
            aria-label="Close Modal"
          >
            <X className="w-4 h-4 transition-transform duration-200 group-hover:rotate-90" />
          </button>
        </div>

        {/* ======================================================== */}
        {/* 5. CENTER CONTENT: BOLD FUTURISTIC TITLE & PITCH         */}
        {/* ======================================================== */}
        <div className="text-center py-2 sm:py-4">
          
          {/* Bold Futuristic All-Caps Title */}
          <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white mb-3 tracking-[0.08em] leading-none drop-shadow-[0_4px_25px_rgba(0,170,255,0.4)]">
            <span className="bg-gradient-to-b from-white via-slate-100 to-cyan-300 bg-clip-text text-transparent">
              ANIMMASTER
            </span>
          </h1>

          {/* Subtitle / Pitch */}
          <p className="text-sm sm:text-base text-slate-300/90 leading-relaxed max-w-md mx-auto mb-6 font-normal">
            Supercharge your applications with cinematic volumetric lighting, GPU-accelerated motion systems, and production-grade UI components.
          </p>

          {/* Interactive Feature Pills */}
          <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-200">
              <Zap className="w-3.5 h-3.5 text-cyan-400" /> 120+ Components
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-200">
              <Layers className="w-3.5 h-3.5 text-cyan-400" /> GPU Shaders
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs font-medium text-slate-200">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" /> React & Tailwind
            </span>
          </div>

        </div>

        {/* ======================================================== */}
        {/* 6. VIBRANT ELECTRIC CYAN-BLUE CTA BUTTON (#00aaff-#0088ff)*/}
        {/* ======================================================== */}
        <div className="space-y-3 pt-2">
          <button
            onClick={() => {
              alert('Unlocked! Enjoy the full AnimMaster Component Library.');
              onClose();
            }}
            className="group relative w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-[#00aaff] to-[#0088ff] text-white font-bold text-base tracking-wide shadow-[0_0_30px_rgba(0,170,255,0.5)] hover:shadow-[0_0_45px_rgba(0,170,255,0.8)] transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 overflow-hidden"
          >
            {/* Shimmer Sweep Glint */}
            <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/40 to-transparent pointer-events-none" />
            
            <span className="relative z-10">Unlock All Components</span>
            <ArrowRight className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
          </button>

          {/* Secondary Dismiss Action */}
          <button
            onClick={onClose}
            className="w-full text-center text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors py-1"
          >
            Maybe later
          </button>
        </div>

      </div>

      {/* Scoped CSS Keyframe Animations for Cinematic Volumetric Lighting */}
      <style>{`
        @keyframes spotlightBreathe {
          0%, 100% {
            opacity: 0.85;
            transform: scaleX(1) translateY(0);
          }
          50% {
            opacity: 1;
            transform: scaleX(1.12) translateY(4px);
          }
        }

        @keyframes spotlightSubtle {
          0%, 100% {
            opacity: 0.7;
            transform: scale(1);
          }
          50% {
            opacity: 0.95;
            transform: scale(1.08);
          }
        }

        @keyframes floatDust {
          0% {
            transform: translate(0, 0) scale(0.8);
            opacity: 0;
          }
          20% {
            opacity: var(--tw-opacity, 0.8);
          }
          80% {
            opacity: var(--tw-opacity, 0.8);
          }
          100% {
            transform: translate(var(--drift-x, 20px), -90px) scale(1.3);
            opacity: 0;
          }
        }

        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.95) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }

        .animate-spotlight-breathe {
          animation: spotlightBreathe 5s ease-in-out infinite;
        }

        .animate-spotlight-subtle {
          animation: spotlightSubtle 7s ease-in-out infinite;
        }

        .animate-float-dust {
          animation: floatDust linear infinite;
        }

        .animate-modal-enter {
          animation: modalEnter 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

    </div>
  );
}
