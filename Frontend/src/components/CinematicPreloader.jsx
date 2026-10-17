import React, { useState, useEffect, useRef, useCallback } from 'react';

/* Intro videos (files in public/videos/), one for each screen shape:
   landscape (1280 x 720) for laptops / desktops / phones held sideways, portrait (478 x 850) for upright phones.

   window = the frame where the logo is complete, with the animals and the grass cut out (see-through).
   At the clip's swapAt time the video is replaced by that still (it looks identical), so the real website shows through
   the animals, and then the logo zooms in until the website fills the screen.
   origin = the middle of the see-through area, as a fraction of the frame (where the zoom heads to).
   swapAt = seconds: the logo is complete, just before the video's own field footage starts to show.
   fit = 'cover' fills the screen (may trim the edges); 'contain' shows the whole frame inside the screen and
         fills the space around it with the video's paper colour: `paperTop` above it, `paperBottom` below it
         (matched to the top and bottom edges of the video), `paper` at the sides. `ratio` = frame width / height. */
const CLIPS = {
  landscape: {
    video: '/videos/loading vid lan.mp4', window: '/videos/intro-window-lan.webp',
    origin: [0.4801, 0.5083], swapAt: 6.4, fit: 'cover', paper: '#F2EFE7',
  },
  portrait: {
    // the phone clip is a little wider than most phone screens, so it is shown whole (nothing cut off at the sides)
    video: '/videos/loading vid potr.mp4', window: '/videos/intro-window-potr.webp',
    origin: [0.4748, 0.5082], swapAt: 6.6, fit: 'contain', ratio: 478 / 850,
    paper: '#E9E4D1', paperTop: '#EAE4D1', paperBottom: '#DCD9C7',
  },
};

const SHOW_MS = 700; // the video fades away, so the (blurred) website appears inside the animals...
const ZOOM_MS = 1900; // ...while, at the same time, the logo zooms in and the website comes into focus
const ZOOM_TO = 18; // how far it zooms (the see-through animals fill the screen well before this)

/* While the intro runs the website is blurred; it sharpens as the zoom happens */
const BLUR_CSS = `
  html.dy-intro #root > div > header, html.dy-intro #root > div > main {
    transition: filter ${ZOOM_MS}ms cubic-bezier(0.33, 0, 0.2, 1);
  }
  html.dy-intro-blur #root > div > header, html.dy-intro-blur #root > div > main {
    filter: blur(18px) saturate(1.15) brightness(1.06);
  }
`;
const SAFETY_MS = 9500; // always reveal the page after this long, even if the video stalls or cannot play

/* Is the screen upright (taller than wide)? Updates on rotate / resize. */
function usePortrait() {
  const get = () => typeof window !== 'undefined' && window.innerHeight > window.innerWidth;
  const [portrait, setPortrait] = useState(get);
  useEffect(() => {
    const on = () => setPortrait(get());
    window.addEventListener('resize', on);
    window.addEventListener('orientationchange', on);
    return () => {
      window.removeEventListener('resize', on);
      window.removeEventListener('orientationchange', on);
    };
  }, []);
  return portrait;
}

/* Where a point of the frame (fx, fy) lands on screen when the frame is shown with object-fit: cover / contain */
function framePoint(frameW, frameH, fx, fy, fit) {
  const W = window.innerWidth;
  const H = window.innerHeight;
  const k = fit === 'contain' ? Math.min(W / frameW, H / frameH) : Math.max(W / frameW, H / frameH);
  return [(W - frameW * k) / 2 + fx * frameW * k, (H - frameH * k) / 2 + fy * frameH * k];
}

export default function CinematicPreloader({ onComplete }) {
  const portrait = usePortrait();
  const clip = portrait ? CLIPS.portrait : CLIPS.landscape;

  // 'video' -> 'zoom' (video fades, logo zooms, website comes into focus) -> 'done'
  const [stage, setStage] = useState('video');
  const [fading, setFading] = useState(false); // fallback exit (video failed / stalled)
  const [origin, setOrigin] = useState('50% 50%');
  const videoRef = useRef(null);
  const stageRef = useRef('video');

  const finish = useCallback(() => {
    if (stageRef.current === 'done') return;
    stageRef.current = 'done';
    setStage('done');
    document.body.style.overflow = '';
    document.documentElement.classList.remove('dy-intro', 'dy-intro-blur');
    if (onComplete) onComplete();
  }, [onComplete]);

  // Swap the video for the see-through still, then zoom in
  const reveal = useCallback(() => {
    if (stageRef.current !== 'video') return;
    const v = videoRef.current;
    if (v && v.videoWidth) {
      const [x, y] = framePoint(v.videoWidth, v.videoHeight, clip.origin[0], clip.origin[1], clip.fit);
      setOrigin(`${x}px ${y}px`);
    }
    if (v) v.pause();
    // Everything at once: the video fades out, the logo zooms in, the website comes into focus
    stageRef.current = 'zoom';
    setStage('zoom');
    document.documentElement.classList.remove('dy-intro-blur');
    setTimeout(finish, ZOOM_MS);
  }, [clip, finish]);

  // Fallback: if the video never gets going, just fade the intro away
  const bail = useCallback(() => {
    if (stageRef.current !== 'video') return;
    document.documentElement.classList.remove('dy-intro-blur');
    setFading(true);
    setTimeout(finish, 700);
  }, [finish]);

  // Lock page scrolling and blur the website while the intro plays (and always undo both)
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    document.documentElement.classList.add('dy-intro', 'dy-intro-blur');
    return () => {
      document.body.style.overflow = '';
      document.documentElement.classList.remove('dy-intro', 'dy-intro-blur');
    };
  }, []);

  // Start playback, and watch the clock closely so the swap happens on the right frame
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return undefined;
    const p = v.play();
    if (p && p.catch) p.catch((err) => console.warn('[Preloader] Autoplay notice:', err.message));
    let raf;
    const tick = () => {
      if (v.currentTime >= clip.swapAt) reveal();
      else raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [clip, reveal]);

  // Safety: reveal the page even if the video never loads
  useEffect(() => {
    const t = setTimeout(() => {
      if (stageRef.current === 'video') bail();
    }, SAFETY_MS);
    return () => clearTimeout(t);
  }, [bail]);

  if (stage === 'done') return null;

  const showStill = stage === 'zoom';
  const zooming = stage === 'zoom';
  // cover: video and still fill the screen. contain: they are exactly the size of the frame, centred and as
  // large as fits; the paper-coloured bands around them are painted on the zooming layer itself (only where
  // there is no frame), so the page shows through the see-through animals and nowhere else.
  const contain = clip.fit === 'contain';
  const media = contain
    ? {
        position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, margin: 'auto',
        width: `min(100vw, calc(100dvh * ${clip.ratio}))`, height: 'auto', aspectRatio: String(clip.ratio),
        display: 'block', pointerEvents: 'none',
      }
    : { position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', pointerEvents: 'none' };
  const fw = `min(100vw, calc(100dvh * ${clip.ratio}))`; // frame width on screen
  const bandV = `max(0px, calc((100dvh - ${fw} / ${clip.ratio}) / 2))`; // height of the bands above / below
  const bandH = `max(0px, calc((100vw - ${fw}) / 2))`; // width of the bands left / right (wide screens)
  const bands = contain
    ? [
        `linear-gradient(${clip.paperTop}, ${clip.paperTop}) top / 100% ${bandV} no-repeat`,
        `linear-gradient(${clip.paperBottom}, ${clip.paperBottom}) bottom / 100% ${bandV} no-repeat`,
        `linear-gradient(${clip.paper}, ${clip.paper}) left / ${bandH} 100% no-repeat`,
        `linear-gradient(${clip.paper}, ${clip.paper}) right / ${bandH} 100% no-repeat`,
      ].join(', ')
    : 'none';

  return (
    <div
      id="cinematic-preloader"
      aria-label="Loading Dairy Yatra experience"
      style={{
        position: 'fixed',
        inset: 0, // fills the screen exactly on every phone, including the browser bars
        zIndex: 999999,
        overflow: 'hidden',
        // until the swap the intro covers the page; after it, the page shows through the logo
        background: showStill ? 'transparent' : clip.paper, // also hides the page behind the still's holes until the swap
        pointerEvents: showStill ? 'none' : 'auto',
        opacity: fading ? 0 : 1,
        transition: 'opacity 0.7s ease-out',
      }}
    >
      <style>{BLUR_CSS}</style>

      {/* Everything that zooms: the paper bands (contain clips), the see-through still and, on top, the video.
          At the swap the video fades out (revealing the identical still, with the page inside the animals)
          while the whole layer zooms in, blurs a little and fades away. */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: bands,
          transformOrigin: origin,
          transform: zooming ? `scale(${ZOOM_TO})` : 'scale(1)',
          filter: zooming ? 'blur(6px)' : 'blur(0px)',
          opacity: zooming ? 0 : 1,
          transition: zooming
            ? `transform ${ZOOM_MS}ms cubic-bezier(0.65, 0, 0.35, 1), filter ${ZOOM_MS}ms ease-in, opacity ${ZOOM_MS * 0.5}ms ease-in ${ZOOM_MS * 0.4}ms`
            : 'none',
          willChange: 'transform, opacity, filter',
        }}
      >
        <img key={clip.window} src={encodeURI(clip.window)} alt="" aria-hidden="true" draggable="false" style={media} />

        <video
          ref={videoRef}
          key={clip.video}
          src={encodeURI(clip.video)}
          muted
          playsInline
          autoPlay
          preload="auto"
          disablePictureInPicture
          disableRemotePlayback
          controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
          tabIndex={-1}
          onContextMenu={(e) => e.preventDefault()}
          onEnded={reveal}
          onError={bail}
          style={{ ...media, opacity: showStill ? 0 : 1, transition: `opacity ${SHOW_MS}ms ease-in-out` }}
        />
      </div>
    </div>
  );
}
