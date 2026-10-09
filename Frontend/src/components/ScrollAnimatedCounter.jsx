import React, { useState, useEffect, useRef } from 'react';

/* ---------- Counter (same logic as before + reduced-motion support) ---------- */
export default function ScrollAnimatedCounter({ value, duration = 2000, className = '', style = {}, respectReducedMotion = false, loop = false, holdMs = 2200 }) {
  const [displayNumber, setDisplayNumber] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const containerRef = useRef(null);

  const strValue = String(value);
  const targetNum = parseInt(strValue.replace(/[^0-9]/g, ''), 10) || 0;
  const hasPlus = strValue.includes('+');
  const hasComma = strValue.includes(',');

  useEffect(() => {
    const node = containerRef.current;
    if (!node) return;
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      setHasStarted(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setHasStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '0px 0px -20px 0px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!hasStarted) return;
    // Off by default so the count-up always plays. Set respectReducedMotion to skip it for users who ask the OS for less motion.
    const reduce = respectReducedMotion && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    if (reduce) {
      setDisplayNumber(targetNum);
      return;
    }
    let id;
    let timer;
    const ease = (t) => 1 - Math.pow(1 - t, 1.8); // gentle ease-out so every small number is seen: 1, 2, 3 ...
    const run = () => {
      let start = null;
      setDisplayNumber(Math.min(1, targetNum));
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        setDisplayNumber(Math.max(Math.min(1, targetNum), Math.round(ease(p) * targetNum)));
        if (p < 1) {
          id = requestAnimationFrame(step);
        } else {
          setDisplayNumber(targetNum);
          // loop: hold the final number for a moment, then count again from 1
          if (loop) timer = setTimeout(run, holdMs);
        }
      };
      id = requestAnimationFrame(step);
    };
    run();
    return () => {
      cancelAnimationFrame(id);
      clearTimeout(timer);
    };
  }, [hasStarted, targetNum, duration, respectReducedMotion, loop, holdMs]);

  const formatted = hasComma ? displayNumber.toLocaleString('en-US') : String(displayNumber);

  return (
    <span
      ref={containerRef}
      className={className}
      style={{ fontVariantNumeric: 'tabular-nums', display: 'inline-flex', alignItems: 'baseline', ...style }}
    >
      {formatted}
      {hasPlus && <span>+</span>}
    </span>
  );
}