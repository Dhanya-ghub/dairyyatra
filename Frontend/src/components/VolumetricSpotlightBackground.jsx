import React, { useState, useEffect, useRef } from 'react';

export default function VolumetricSpotlightBackground({ className = '' }) {
  const containerRef = useRef(null);
  const spotlightBeamRef = useRef(null);
  const spotlightCoreRef = useRef(null);
  const emitterRef = useRef(null);
  const radialGlowRef = useRef(null);
  const secondaryBeamRef = useRef(null);
  const polygonGroupRef = useRef(null);

  // Mouse & Physics Roaming State
  const physicsState = useRef({
    currentX: typeof window !== 'undefined' ? window.innerWidth / 2 : 600,
    currentY: typeof window !== 'undefined' ? window.innerHeight * 0.6 : 450,
    currentAngle: 0,
    mouseNudgeX: 0,
    mouseNudgeY: 0,
    targetNudgeX: 0,
    targetNudgeY: 0,
  });

  // Generate ambient dust particles that drift organically
  const [particles] = useState(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      x: 10 + Math.random() * 80,
      y: 5 + Math.random() * 90,
      size: Math.random() * 3.5 + 1.2,
      opacity: Math.random() * 0.75 + 0.25,
      duration: Math.random() * 9 + 7,
      delay: Math.random() * 8,
      driftX: (Math.random() - 0.5) * 100
    }))
  );

  useEffect(() => {
    let animationFrameId;

    // Track user mouse to add subtle interactive influence while roaming continuously
    const handleMouseMove = (e) => {
      const winWidth = window.innerWidth || 1200;
      const winHeight = window.innerHeight || 800;
      physicsState.current.targetNudgeX = (e.clientX - winWidth / 2) * 0.35;
      physicsState.current.targetNudgeY = (e.clientY - winHeight / 2) * 0.25;
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        const winWidth = window.innerWidth || 1200;
        const winHeight = window.innerHeight || 800;
        physicsState.current.targetNudgeX = (e.touches[0].clientX - winWidth / 2) * 0.35;
        physicsState.current.targetNudgeY = (e.touches[0].clientY - winHeight / 2) * 0.25;
      }
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });

    // Continuous 60/120fps Roaming Physics Animation Loop
    const updateSpotlight = (time) => {
      const winWidth = window.innerWidth || 1200;
      const winHeight = window.innerHeight || 800;
      const state = physicsState.current;

      // Smoothly interpolate user mouse nudge
      state.mouseNudgeX += (state.targetNudgeX - state.mouseNudgeX) * 0.04;
      state.mouseNudgeY += (state.targetNudgeY - state.mouseNudgeY) * 0.04;

      // Multi-harmonic Lissajous & Sine Roaming Trajectory (Never stands still)
      // Sweeps smoothly across left, right, center, and varying depths
      const tSec = time * 0.001;
      
      const autoRoamX = 
        Math.sin(tSec * 0.65) * (winWidth * 0.36) + 
        Math.cos(tSec * 1.15) * (winWidth * 0.12) +
        Math.sin(tSec * 0.25) * (winWidth * 0.08);

      const autoRoamY = 
        (winHeight * 0.58) + 
        Math.sin(tSec * 0.85) * (winHeight * 0.20) + 
        Math.cos(tSec * 0.45) * (winHeight * 0.10);

      // Combined Roaming Position
      const targetX = (winWidth / 2) + autoRoamX + state.mouseNudgeX;
      const targetY = autoRoamY + state.mouseNudgeY;

      // Smooth spring interpolation
      state.currentX += (targetX - state.currentX) * 0.06;
      state.currentY += (targetY - state.currentY) * 0.06;

      const originX = winWidth / 2;
      const dx = state.currentX - originX;
      const dy = Math.max(state.currentY, 160);

      // Calculate continuous dynamic beam tilt angle
      let targetAngle = Math.atan2(dx, dy) * (180 / Math.PI);
      targetAngle = Math.max(-42, Math.min(42, targetAngle));

      state.currentAngle += (targetAngle - state.currentAngle) * 0.06;

      // Breathing, pulsing and organic scale modulation
      const pulseScaleX = 1 + Math.sin(tSec * 1.2) * 0.08 + Math.cos(tSec * 0.7) * 0.04;
      const pulseScaleY = 1 + Math.cos(tSec * 0.9) * 0.05;
      const pulseOpacity = 0.85 + Math.sin(tSec * 1.4) * 0.15;
      const emitterOffset = dx * 0.12;

      // 1. Primary Spotlight Beam
      if (spotlightBeamRef.current) {
        spotlightBeamRef.current.style.transform = `translateX(-50%) rotate(${state.currentAngle}deg) scale(${pulseScaleX}, ${pulseScaleY})`;
        spotlightBeamRef.current.style.opacity = pulseOpacity;
      }

      // 2. Secondary Inner Core Beam
      if (spotlightCoreRef.current) {
        spotlightCoreRef.current.style.transform = `translateX(-50%) rotate(${state.currentAngle * 1.08}deg) scale(${pulseScaleX * 1.05}, ${pulseScaleY})`;
      }

      // 3. Counter-sweeping ambient secondary beam for rich volumetric depth
      if (secondaryBeamRef.current) {
        const secondaryAngle = -state.currentAngle * 0.65 + Math.sin(tSec * 0.5) * 8;
        secondaryBeamRef.current.style.transform = `translateX(-50%) rotate(${secondaryAngle}deg) scale(${pulseScaleX * 0.9}, ${pulseScaleY})`;
        secondaryBeamRef.current.style.opacity = 0.4 + Math.sin(tSec * 0.8) * 0.2;
      }

      // 4. Overhead Emitter Lens Flare (Follows horizontal roaming)
      if (emitterRef.current) {
        emitterRef.current.style.transform = `translateX(calc(-50% + ${emitterOffset}px)) scale(${pulseScaleX})`;
      }

      // 5. Ground / Middle Radial Illumination Glow
      if (radialGlowRef.current) {
        radialGlowRef.current.style.transform = `translateX(calc(-50% + ${dx * 0.55}px)) translateY(${Math.min(dy * 0.25, 120)}px) scale(${pulseScaleX})`;
      }

      // 6. Volumetric Light Ray Polygons
      if (polygonGroupRef.current) {
        polygonGroupRef.current.style.transform = `translateX(-50%) rotate(${state.currentAngle * 0.85}deg)`;
      }

      animationFrameId = requestAnimationFrame(updateSpotlight);
    };

    animationFrameId = requestAnimationFrame(updateSpotlight);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('touchmove', handleTouchMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden select-none bg-[#070a12] ${className}`}
      style={{ zIndex: 0 }}
      aria-hidden="true"
    >
      {/* 1. Deep Space Radial Atmosphere */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_100%_75%_at_50%_0%,rgba(56,189,248,0.16),transparent_75%)]" />

      {/* 2. Top Spotlight Emitter Lens Flare */}
      <div
        ref={emitterRef}
        className="absolute -top-16 left-1/2 -translate-x-1/2 will-change-transform pointer-events-none"
      >
        <div className="w-[450px] h-40 bg-cyan-200/50 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-64 h-20 bg-white/85 rounded-full blur-xl" />
        <div className="absolute top-14 left-1/2 -translate-x-1/2 w-32 h-8 bg-cyan-300 rounded-full blur-md shadow-[0_0_60px_rgba(56,189,248,0.95)]" />
      </div>

      {/* 3. Primary Volumetric Conical Light Beam (Roams smoothly across viewport) */}
      <div
        ref={spotlightBeamRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[160vw] max-w-[1500px] h-[130vh] origin-top will-change-transform"
        style={{
          background: `conic-gradient(from 160deg at 50% 0%, transparent 0deg, rgba(255,255,255,0.22) 12deg, rgba(147,197,253,0.13) 20deg, rgba(56,189,248,0.06) 28deg, transparent 40deg)`,
          filter: 'drop-shadow(0 0 60px rgba(56,189,248,0.35))'
        }}
      />

      {/* 4. Secondary Soft Inner Core Conical Beam */}
      <div
        ref={spotlightCoreRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[100vw] max-w-[950px] h-[115vh] origin-top blur-lg will-change-transform opacity-90"
        style={{
          background: `conic-gradient(from 166deg at 50% 0%, transparent 0deg, rgba(255,255,255,0.30) 9deg, rgba(186,230,253,0.16) 15deg, transparent 28deg)`
        }}
      />

      {/* 5. Counter Ambient Sweeping Beam (Creates depth & volumetric cross-illumination) */}
      <div
        ref={secondaryBeamRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[80vw] max-w-[750px] h-[100vh] origin-top blur-2xl will-change-transform pointer-events-none"
        style={{
          background: `conic-gradient(from 168deg at 50% 0%, transparent 0deg, rgba(147,197,253,0.12) 10deg, rgba(56,189,248,0.06) 18deg, transparent 24deg)`
        }}
      />

      {/* 6. Center Radial Illumination Glow */}
      <div
        ref={radialGlowRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[480px] h-[100vh] bg-gradient-to-b from-white/30 via-sky-400/12 to-transparent blur-3xl will-change-transform"
      />

      {/* 7. Volumetric Light Ray Polygon Overlays (Follows Roaming Angle) */}
      <div 
        ref={polygonGroupRef}
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-5xl h-full origin-top will-change-transform"
      >
        <svg
          className="w-full h-full opacity-40 mix-blend-screen"
          viewBox="0 0 1000 900"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="volumetricRayGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
              <stop offset="35%" stopColor="#93c5fd" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points="500,0 260,900 350,900" fill="url(#volumetricRayGrad)" opacity="0.45" />
          <polygon points="500,0 420,900 580,900" fill="url(#volumetricRayGrad)" opacity="0.65" />
          <polygon points="500,0 650,900 740,900" fill="url(#volumetricRayGrad)" opacity="0.45" />
        </svg>
      </div>

      {/* 8. Floating Ambient Dust / Light Specks Drifting Through the Roaming Spotlight */}
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-full bg-cyan-100 shadow-[0_0_8px_rgba(186,230,253,0.9),0_0_16px_rgba(56,189,248,0.6)] animate-ambient-dust"
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

      {/* Scoped CSS Keyframe Animations */}
      <style>{`
        @keyframes ambientDust {
          0% {
            transform: translate(0, 0) scale(0.8);
            opacity: 0;
          }
          25% {
            opacity: var(--tw-opacity, 0.85);
          }
          75% {
            opacity: var(--tw-opacity, 0.85);
          }
          100% {
            transform: translate(var(--drift-x, 35px), -90px) scale(1.35);
            opacity: 0;
          }
        }

        .animate-ambient-dust {
          animation: ambientDust linear infinite;
        }
      `}</style>
    </div>
  );
}
