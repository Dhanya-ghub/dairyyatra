import React, { useEffect, useRef, useState } from 'react';
import DairyYatraStats from './DairyyatraStats';
// Host and supporter logos shown at the top of the landing page (same files as the "Behind the Journey" section)
import kiLogo from '../assets/kilg.png';
import edfLogo from '../assets/logos/edf.png';

const logo = '/logo.png'; // served from public/, like the other brand logos

/* ------------------------------------------------------------ Photos ----
   The hero uses ONLY the 18 photos named below (web-sized copies in src/assets/hero-panels).
   They run in 3 panels, and no photo appears in two panels.
   To swap a photo, replace its file in that folder or change its name here. */
const PHOTO_FILES = import.meta.glob('../assets/hero-panels/*.jpg', { eager: true, import: 'default' });
const pick = (names) =>
  names.map((name) => ({ name, src: PHOTO_FILES[`../assets/hero-panels/${name}.jpg`] })).filter((p) => p.src);

const PANELS = [
  { photos: pick(['LAV4116', 'LAV4839', 'LAV6783', 'LAV7431', 'LAV5280', 'LAV4121']), seconds: 86, reverse: false },
  { photos: pick(['LAV7492', 'LAV5920', 'LAV7660', 'LAV7190', 'LAV4145', 'LAV4837']), seconds: 108, reverse: true },
  { photos: pick(['LAV3945', 'LAV6913', 'LAV6764', 'LAV4922', 'LAV5300', 'LAV7380']), seconds: 96, reverse: false },
];
// shot upright, so they keep a taller frame (and say which part of the photo to keep)
const PORTRAIT = { LAV4837: 'aspect-[4/5]', LAV6764: 'aspect-square object-top' };

/* Each panel repeats its photos 4 times and slides by exactly one set (a quarter of the strip),
   so the loop has no jump. It runs between the 2nd and 3rd copy, so the panel is always full. */
const COPIES = 4;

/* No borders: each photo's top edge fades into the photo above it, and the middle panel's sides
   fade into the panels beside it. Sizes are in cqw (% of the panel width) so they scale together. */
const STYLES = `
@keyframes hx-scroll { from { transform: translate3d(0,-25%,0); } to { transform: translate3d(0,-50%,0); } }
.hx-panel { container-type: inline-size; }
.hx-strip { display: flex; flex-direction: column; animation: hx-scroll linear infinite; will-change: transform; }
.hx-tile {
  margin-top: -18cqw;
  -webkit-mask-image: linear-gradient(to bottom, transparent 0, rgba(0,0,0,.35) 6cqw, #000 18cqw);
          mask-image: linear-gradient(to bottom, transparent 0, rgba(0,0,0,.35) 6cqw, #000 18cqw);
}
.hx-mid {
  -webkit-mask-image: linear-gradient(to right, transparent 0, #000 8vw, #000 calc(100% - 8vw), transparent 100%);
          mask-image: linear-gradient(to right, transparent 0, #000 8vw, #000 calc(100% - 8vw), transparent 100%);
}
@media (prefers-reduced-motion: reduce) { .hx-strip { animation: none; transform: translate3d(0,-25%,0); } }
`;

function PhotoPanel({ photos, seconds, reverse, paused, middle }) {
  if (!photos.length) return <div className="flex-1" />;
  const loop = Array.from({ length: COPIES }, () => photos).flat();
  return (
    // the middle panel is widened so its faded sides lie over the neighbouring panels
    <div className={`hx-panel relative h-full flex-1 overflow-hidden ${middle ? 'hx-mid z-10 -mx-[8vw]' : ''}`}>
      <div
        className="hx-strip"
        style={{
          animationDuration: `${seconds}s`,
          animationDirection: reverse ? 'reverse' : 'normal',
          animationPlayState: paused ? 'paused' : 'running',
        }}
      >
        {loop.map((p, i) => (
          <img
            key={`${p.name}-${i}`}
            src={p.src}
            alt=""
            decoding="async"
            className={`hx-tile block w-full shrink-0 object-cover ${
              PORTRAIT[p.name] || 'aspect-[4/5] sm:aspect-[3/2]'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

/* Shows a logo trimmed to its visible drawing (see-through padding removed),
   so two logos with different amounts of empty space can be shown at the same visible size. */
// Logos of different shapes look the same size when they cover the same area, not when they share a height.
// Each logo's height is scaled by sqrt(LOGO_REF_RATIO / its width-to-height ratio), so wide ones get shorter
// and compact ones taller. The base height comes from the CSS variable --logo-h set by the parent.
const LOGO_REF_RATIO = 4;

function TrimmedLogo({ src, alt, className = '' }) {
  const [crop, setCrop] = useState(null);
  const onLoad = (e) => {
    try {
      const img = e.currentTarget;
      if (!img.naturalWidth || !img.naturalHeight) return;
      const k = Math.min(1, 500 / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.round(img.naturalWidth * k);
      const h = Math.round(img.naturalHeight * k);
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, w, h);
      const { data } = ctx.getImageData(0, 0, w, h);
      let minX = w, minY = h, maxX = -1, maxY = -1;
      for (let y = 0; y < h; y += 1) {
        for (let x = 0; x < w; x += 1) {
          if (data[(y * w + x) * 4 + 3] > 24) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX < 0) return;
      const x0 = minX / w, x1 = (maxX + 1) / w, y0 = minY / h, y1 = (maxY + 1) / h;
      setCrop({ x0, x1, y0, y1, ratio: (img.naturalWidth * (x1 - x0)) / (img.naturalHeight * (y1 - y0)) });
    } catch {
      /* if it can't be measured, the logo is shown as it is */
    }
  };
  return (
    <span
      className={`relative inline-block shrink-0 overflow-hidden ${className}`}
      style={
        crop
          ? { aspectRatio: String(crop.ratio), height: `calc(var(--logo-h) * ${Math.sqrt(LOGO_REF_RATIO / crop.ratio).toFixed(3)})` }
          : { height: 'var(--logo-h)' }
      }
    >
      <img
        src={src}
        alt={alt}
        onLoad={onLoad}
        draggable="false"
        className={crop ? 'absolute max-w-none' : 'block h-full w-auto'}
        style={
          crop
            ? {
                height: `${100 / (crop.y1 - crop.y0)}%`,
                width: 'auto',
                top: `${(-crop.y0 / (crop.y1 - crop.y0)) * 100}%`,
                left: `${(-crop.x0 / (crop.x1 - crop.x0)) * 100}%`,
              }
            : undefined
        }
      />
    </span>
  );
}

export default function Hero() {
  const sectionRef = useRef(null);
  const [phase, setPhase] = useState('intro'); // intro -> logo -> ready
  const [inView, setInView] = useState(true);

  // Show the logo first, then bring in the text
  useEffect(() => {
    const reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduced) {
      setPhase('ready');
      return undefined;
    }
    const timers = [setTimeout(() => setPhase('logo'), 300), setTimeout(() => setPhase('ready'), 1100)];
    return () => timers.forEach(clearTimeout);
  }, []);

  // Pause the panels when the hero is off screen
  useEffect(() => {
    const el = sectionRef.current;
    if (!el || !('IntersectionObserver' in window)) return undefined;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0.05 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // The logo file has uneven empty space around the drawing, so measure where the drawing
  // actually sits and nudge it until it is exactly in the middle of the circle.
  // The logo file has uneven empty space around the drawing. Measure where the drawing actually is,
  // then show only that part, so the logo and "2027" below it sit exactly in the middle of the circle.
  const [crop, setCrop] = useState(null); // { x0, y0, x1, y1 } as fractions of the image, + aspect ratio
  const onLogoLoad = (e) => {
    try {
      const img = e.currentTarget;
      if (!img.naturalWidth || !img.naturalHeight) return;
      const k = Math.min(1, 400 / Math.max(img.naturalWidth, img.naturalHeight)); // measure a small copy
      const w = Math.round(img.naturalWidth * k);
      const h = Math.round(img.naturalHeight * k);
      const c = document.createElement('canvas');
      c.width = w;
      c.height = h;
      const ctx = c.getContext('2d', { willReadFrequently: true });
      ctx.drawImage(img, 0, 0, w, h);
      const { data } = ctx.getImageData(0, 0, w, h);
      let minX = w, minY = h, maxX = -1, maxY = -1;
      for (let y = 0; y < h; y += 1) {
        for (let x = 0; x < w; x += 1) {
          const i = (y * w + x) * 4;
          const light = data[i] > 235 && data[i + 1] > 235 && data[i + 2] > 235; // ignore a white background
          if (data[i + 3] > 24 && !light) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }
      if (maxX < 0) return;
      const x0 = minX / w, x1 = (maxX + 1) / w, y0 = minY / h, y1 = (maxY + 1) / h;
      setCrop({ x0, y0, x1, y1, ratio: (img.naturalWidth * (x1 - x0)) / (img.naturalHeight * (y1 - y0)) });
    } catch {
      /* if the image can't be measured, it is simply shown as it is */
    }
  };

  const showLogo = phase !== 'intro';
  const ready = phase === 'ready';

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-[#1C140C] pt-16 text-[#F7F1E3]"
    >
      <style>{STYLES}</style>

      {/* Kumaraguru Institutions + Environmental Defense Fund, top-left (the menu sits top-right).
          A frosted-glass panel sits behind them: it blurs the moving photos so the logos stay readable.
          --logo-h is the base logo height; each logo is then scaled so both look the same size. */}
      <div
        className="absolute left-[max(16px,2%)] top-3 z-20 transition-all duration-700 lg:top-4"
        style={{ opacity: showLogo ? 1 : 0, transform: showLogo ? 'translateY(0)' : 'translateY(-8px)' }}
      >
        <div className="flex items-center gap-3 rounded-xl border border-white/50 bg-white/60 px-3 py-2 shadow-[0_6px_24px_rgba(0,0,0,0.22)] backdrop-blur-xl backdrop-saturate-150 [--logo-h:26px] sm:gap-4 sm:px-4 sm:[--logo-h:30px] lg:[--logo-h:34px]">
          <TrimmedLogo src={kiLogo} alt="Kumaraguru Institutions" />
          <span className="h-6 w-px bg-slate-500/40 sm:h-7" aria-hidden="true" />
          <TrimmedLogo src={edfLogo} alt="Environmental Defense Fund" />
        </div>
      </div>

      {/* 1. Background: three panels of photos running in a loop, blended into each other */}
      <div className="pointer-events-none absolute inset-0 -z-20 flex" aria-hidden="true">
        {PANELS.map((panel, i) => (
          <PhotoPanel key={i} {...panel} paused={!inView} middle={i === 1} />
        ))}
      </div>

      {/* 2. Warm shading so the logo and text stand out */}
      <div className="pointer-events-none absolute inset-0 -z-10" aria-hidden="true">
        <div className="absolute inset-0 bg-[#1C140C]/45" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_42%_at_26%_56%,rgba(20,13,6,0.78),transparent)] max-lg:hidden" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_30%_42%_at_74%_56%,rgba(20,13,6,0.78),transparent)] max-lg:hidden" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_30%,rgba(20,13,6,0.72)_58%,rgba(20,13,6,0.72)_88%,transparent)] lg:hidden" />
      </div>

      <div className="relative mx-auto grid w-full max-w-[90rem] flex-1 grid-cols-1 content-center items-center gap-8 px-5 py-10 sm:px-8 lg:grid-cols-[1fr_auto_1fr] lg:gap-12 lg:px-12 xl:gap-14">
        {/* Left: headline (same font family as the paragraph on the right) */}
        <div
          className={`order-2 mx-auto w-full max-w-[26rem] text-center transition-all duration-1000 ease-out lg:order-1 lg:ml-auto lg:mr-0 lg:text-right ${
            ready ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <h1 className="text-[clamp(1.6rem,2.1vw,2.25rem)] font-bold leading-[1.22] tracking-[-0.01em] text-[#F7F1E3] [text-shadow:0_4px_30px_rgba(0,0,0,0.6)]">
            A 15-Day <span className="text-[#E3C98F]">Transformative Journey</span> Across India&apos;s Dairy Landscapes.
          </h1>
        </div>

        {/* Centre: the Dairy Yatra logo with 2027 below it, centred inside the circle */}
        <div className="order-1 flex justify-center lg:order-2">
          <div
            className="relative flex aspect-square w-[min(58vw,280px)] items-center justify-center overflow-hidden rounded-full bg-[#F7F1E3] shadow-[0_24px_60px_rgba(0,0,0,0.5)] ring-[8px] ring-[#E3C98F] lg:w-[min(24vw,360px)]"
            style={{
              transform: `scale(${showLogo ? 1 : 0})`,
              transition: 'transform 800ms cubic-bezier(.34,1.56,.64,1)',
            }}
          >
            <div
              className="flex w-full flex-col items-center"
              style={{
                opacity: showLogo ? 1 : 0,
                transform: `scale(${showLogo ? 1 : 0.8})`,
                transition: 'opacity 600ms ease 350ms, transform 700ms cubic-bezier(.34,1.56,.64,1) 350ms',
              }}
            >
              {/* the logo, trimmed to the drawing itself */}
              <div
                className="relative w-[64%] overflow-hidden"
                style={crop ? { aspectRatio: String(crop.ratio) } : undefined}
              >
                <img
                  src={logo}
                  alt="Dairy Yatra 2027"
                  onLoad={onLogoLoad}
                  draggable="false"
                  className={crop ? 'absolute block h-auto max-w-none' : 'block h-auto w-full'}
                  style={
                    crop
                      ? {
                          width: `${100 / (crop.x1 - crop.x0)}%`,
                          left: `${(-crop.x0 / (crop.x1 - crop.x0)) * 100}%`,
                          top: `${(-crop.y0 / (crop.y1 - crop.y0)) * 100}%`,
                        }
                      : undefined
                  }
                />
              </div>

              {/* 2027, below the logo */}
              <div className="mt-[5%] flex items-center gap-[0.6em] text-[clamp(14px,1.55vw,24px)] font-extrabold leading-none tracking-[0.3em] text-[#1C1C1C]">
                <span className="h-[2px] w-[1.6em] rounded-full bg-[#C9A75E]" aria-hidden="true" />
                <span className="-mr-[0.3em]">2027</span>
                <span className="h-[2px] w-[1.6em] rounded-full bg-[#C9A75E]" aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* Right: text */}
        <div
          className={`order-3 mx-auto w-full max-w-[26rem] text-center transition-all delay-150 duration-1000 ease-out lg:ml-0 lg:mr-auto lg:text-left ${
            ready ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <p className="text-[clamp(1.02rem,1.25vw,1.2rem)] leading-[1.65] text-[#F7F1E3]/90 [text-shadow:0_2px_14px_rgba(0,0,0,0.6)]">
            <span className="font-semibold text-[#E3C98F]">Explore, Experience, and Empower</span> through a transformative
            learning immersion into India&apos;s dairy innovations, cooperative models, and the inspiring journeys of pioneering
            farmers and entrepreneurs.
          </p>
        </div>
      </div>

      {/* Stats bar along the bottom of the landing section */}
      <div
        className={`relative z-10 w-full pb-8 transition-all delay-300 duration-1000 ease-out sm:pb-10 ${
          ready ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <DairyYatraStats />
      </div>
    </section>
  );
}