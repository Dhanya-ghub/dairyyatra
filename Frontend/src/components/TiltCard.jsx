import React, { useRef, useState, useCallback, useEffect } from 'react';

/**
 * Transitions.dev — Card hover tilt component
 *
 * Tracks the pointer on the outer .t-tilt element (flat hit area)
 * and feeds --tilt-rx, --tilt-ry, --tilt-gx, --tilt-gy to .t-tilt-card.
 */
export default function TiltCard({
  children,
  className = '',
  cardClassName = '',
  maxTilt = 10,
  ...props
}) {
  const tiltRef = useRef(null);
  const cardRef = useRef(null);
  const [isHover, setIsHover] = useState(false);
  const [isTilting, setIsTilting] = useState(false);
  const tiltTimeoutRef = useRef(null);

  const handlePointerMove = useCallback((e) => {
    const el = tiltRef.current;
    const card = cardRef.current;
    if (!el || !card) return;

    const rect = el.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const width = rect.width;
    const height = rect.height;

    // Offset from center (-0.5 to +0.5)
    const px = (x / width) - 0.5;
    const py = (y / height) - 0.5;

    // Rotation angles
    const rxDeg = -(py * maxTilt * 2);
    const ryDeg = px * maxTilt * 2;
    const gxPct = (x / width) * 100;
    const gyPct = (y / height) * 100;

    card.style.setProperty('--tilt-rx', `${rxDeg.toFixed(2)}deg`);
    card.style.setProperty('--tilt-ry', `${ryDeg.toFixed(2)}deg`);
    card.style.setProperty('--tilt-gx', `${gxPct.toFixed(2)}%`);
    card.style.setProperty('--tilt-gy', `${gyPct.toFixed(2)}%`);

    setIsHover(true);
    setIsTilting(true);

    if (tiltTimeoutRef.current) clearTimeout(tiltTimeoutRef.current);
    tiltTimeoutRef.current = setTimeout(() => {
      setIsTilting(false);
    }, 150);
  }, [maxTilt]);

  const handlePointerEnter = useCallback((e) => {
    setIsHover(true);
    handlePointerMove(e);
  }, [handlePointerMove]);

  const handlePointerLeave = useCallback(() => {
    const card = cardRef.current;
    if (card) {
      card.style.setProperty('--tilt-rx', '0deg');
      card.style.setProperty('--tilt-ry', '0deg');
    }
    setIsHover(false);
    setIsTilting(false);
    if (tiltTimeoutRef.current) clearTimeout(tiltTimeoutRef.current);
  }, []);

  useEffect(() => {
    return () => {
      if (tiltTimeoutRef.current) clearTimeout(tiltTimeoutRef.current);
    };
  }, []);

  return (
    <div
      ref={tiltRef}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
      className={`t-tilt ${isHover ? 'is-hover' : ''} ${className}`}
      {...props}
    >
      <div
        ref={cardRef}
        className={`t-tilt-card ${isTilting ? 'is-tilting' : ''} ${cardClassName}`}
      >
        {children}
        <div className="t-tilt-glare" />
      </div>
    </div>
  );
}
