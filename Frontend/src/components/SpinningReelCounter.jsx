import React, { useState, useEffect, useRef } from 'react';

/**
 * Transitions.dev Spinning Reel Counter Component
 * 
 * Smoothly spins numeric digits vertically with staggered motion blur
 * upon scrolling into view.
 */
export default function SpinningReelCounter({ 
  value, 
  className = '', 
  staggerMs = 90, 
  durationMs = 1400,
  cycles = 2
}) {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.2,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const strValue = String(value);
  const characters = strValue.split('');

  // Keep track of digit index for staggered transitions
  let digitCount = 0;

  return (
    <span ref={containerRef} className={`t-reel ${className}`} aria-label={strValue}>
      {characters.map((char, charIdx) => {
        const isDigit = /^\d$/.test(char);

        if (!isDigit) {
          return (
            <span key={`static-${charIdx}`} className="t-reel-static">
              {char}
            </span>
          );
        }

        const targetDigit = parseInt(char, 10);
        const currentDigitIndex = digitCount++;

        // Generate reel strip: e.g., 2 full cycles of 0-9 followed by 0..targetDigit
        const stripDigits = [];
        for (let c = 0; c < cycles; c++) {
          for (let d = 0; d <= 9; d++) {
            stripDigits.push(d);
          }
        }
        for (let d = 0; d <= targetDigit; d++) {
          stripDigits.push(d);
        }

        const targetIndex = stripDigits.length - 1;
        const totalItems = stripDigits.length;

        const delay = currentDigitIndex * staggerMs;
        const translateY = isVisible ? (targetIndex / totalItems) * 100 : 0;

        return (
          <span key={`col-${charIdx}`} className="t-reel-col">
            <span
              className="t-reel-strip"
              style={{
                transform: `translateY(-${translateY}%)`,
                transition: isVisible
                  ? `transform ${durationMs}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`
                  : 'none',
              }}
            >
              {stripDigits.map((digit, dIdx) => (
                <span key={`digit-${dIdx}`} className="t-reel-digit">
                  {digit}
                </span>
              ))}
            </span>
          </span>
        );
      })}
    </span>
  );
}
