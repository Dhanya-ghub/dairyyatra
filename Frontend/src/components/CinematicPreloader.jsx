import React, { useState, useEffect, useRef, useCallback } from 'react';
import loadingVidAsset from '../../Bg videos/loading video.mp4';

/**
 * CinematicPreloader Component
 *
 * Full-screen cinematic video preloader overlay playing "loading vid" at 1.25x speed.
 * Intercepts the zoom expansion around 6.5s - 7.0s and smoothly cross-dissolves
 * to reveal the live website landing page.
 *
 * No skip button and no browser video controls: the intro always ends by itself
 * (at ~6.5s, when the video ends, or after the 8.5s safety timeout).
 */
export default function CinematicPreloader({ onComplete }) {
  const [isFading, setIsFading] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const videoRef = useRef(null);
  const fadeTriggeredRef = useRef(false);

  // Trigger the cross-dissolve exit transition
  const triggerTransition = useCallback(() => {
    if (fadeTriggeredRef.current) return;
    fadeTriggeredRef.current = true;

    // Start fade & scale transition
    setIsFading(true);

    // After 0.7s (700ms) transition completes, dismiss overlay and restore scrolling
    setTimeout(() => {
      setIsDismissed(true);
      document.body.style.overflow = '';
      if (onComplete) onComplete();
    }, 700);
  }, [onComplete]);

  // Video initialization and timing control
  useEffect(() => {
    // Prevent body scrolling during preloader playback
    document.body.style.overflow = 'hidden';

    const video = videoRef.current;
    if (video) {
      // Strictly set 1.25x playback rate immediately upon initialization
      video.playbackRate = 1.25;

      const enforceSpeed = () => {
        if (video) {
          video.playbackRate = 1.25;
        }
      };

      video.addEventListener('play', enforceSpeed);
      video.addEventListener('playing', enforceSpeed);
      video.addEventListener('loadedmetadata', enforceSpeed);
      video.addEventListener('canplay', enforceSpeed);

      // Attempt playback
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('[Preloader] Autoplay notice:', err.message);
        });
      }

      return () => {
        video.removeEventListener('play', enforceSpeed);
        video.removeEventListener('playing', enforceSpeed);
        video.removeEventListener('loadedmetadata', enforceSpeed);
        video.removeEventListener('canplay', enforceSpeed);
      };
    }
  }, []);

  // Safety fallback timeout: dismiss preloader if video takes > 8.5 seconds or stalls
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      if (!fadeTriggeredRef.current) {
        console.log('[Preloader] Safety timeout reached, triggering smooth reveal');
        triggerTransition();
      }
    }, 8500);

    return () => clearTimeout(safetyTimer);
  }, [triggerTransition]);

  // Handle video time updates to catch the zoom expansion point (~6.5 - 7.0s)
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video || fadeTriggeredRef.current) return;

    // Maintain 1.25x playback speed
    if (video.playbackRate !== 1.25) {
      video.playbackRate = 1.25;
    }

    // Intercept when the zoom expands through the silhouettes (around ~6.5s to 7.0s)
    if (video.currentTime >= 6.5) {
      triggerTransition();
    }
  };

  // If dismissed, unmount overlay completely from DOM
  if (isDismissed) {
    return null;
  }

  return (
    <div
      id="cinematic-preloader"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 999999,
        background: '#F2EFE7',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        pointerEvents: isFading ? 'none' : 'auto',
        opacity: isFading ? 0 : 1,
        transform: isFading ? 'scale(1.08)' : 'scale(1)',
        visibility: isDismissed ? 'hidden' : 'visible',
        transition: 'opacity 0.7s ease-out, transform 0.7s ease-out',
        willChange: 'opacity, transform',
      }}
      aria-label="Loading Dairy Yatra experience"
    >
      {/* Full viewport edge-to-edge video.
          pointer-events: none + the attributes below stop the browser from showing its own
          floating video toolbar (picture-in-picture / resize icons) when you hover. */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
        disableRemotePlayback
        controlsList="nodownload nofullscreen noremoteplayback noplaybackrate"
        tabIndex={-1}
        src={loadingVidAsset || '/loading video.mp4'}
        onTimeUpdate={handleTimeUpdate}
        onEnded={triggerTransition}
        onContextMenu={(e) => e.preventDefault()}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
          pointerEvents: 'none',
        }}
      >
        <source src={loadingVidAsset} type="video/mp4" />
        <source src="/loading video.mp4" type="video/mp4" />
        <source src="/Landing vid.mp4" type="video/mp4" />
        <source src="/loading video.mp4" type="video/mp4" />
        <source src="/videos/loading video.mp4" type="video/mp4" />
      </video>
    </div>
  );
}