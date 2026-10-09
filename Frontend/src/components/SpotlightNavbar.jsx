import React, { useEffect, useRef, useState } from 'react';
import { animate } from 'framer-motion';
import { cn } from '../lib/utils';

export function SpotlightNavbar({
  items = [
    { id: 'overview', label: 'Overview', href: '#overview' },
    { id: 'interactive-map', label: 'Route Experience', href: '#interactive-map' },
    { id: 'itinerary', label: '15-Day Itinerary', href: '#itinerary' },
    { id: 'hosts', label: 'Host Partners', href: '#hosts' },
  ],
  activeId,
  isScrolled = false,
  className,
  onItemClick,
  defaultActiveIndex = 0,
}) {
  const navRef = useRef(null);
  
  // Find current index based on activeId prop if provided, else internal activeIndex
  const derivedActiveIndex = items.findIndex((item) => item.id === activeId);
  const [internalActiveIndex, setInternalActiveIndex] = useState(
    derivedActiveIndex >= 0 ? derivedActiveIndex : defaultActiveIndex
  );

  const activeIndex = derivedActiveIndex >= 0 ? derivedActiveIndex : internalActiveIndex;

  const [hoverX, setHoverX] = useState(null);

  // Refs for the light positions for imperative spring animation
  const spotlightX = useRef(0);
  const ambienceX = useRef(0);

  // Mouse move and leave listeners for mouse-following spotlight
  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;

    const handleMouseMove = (e) => {
      const rect = nav.getBoundingClientRect();
      const x = e.clientX - rect.left;
      setHoverX(x);
      spotlightX.current = x;
      nav.style.setProperty('--spotlight-x', `${x}px`);
    };

    const handleMouseLeave = () => {
      setHoverX(null);
      // When mouse leaves, spring the spotlight back to the active item
      const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);
      if (activeItem) {
        const navRect = nav.getBoundingClientRect();
        const itemRect = activeItem.getBoundingClientRect();
        const targetX = itemRect.left - navRect.left + itemRect.width / 2;

        animate(spotlightX.current, targetX, {
          type: 'spring',
          stiffness: 220,
          damping: 22,
          onUpdate: (v) => {
            spotlightX.current = v;
            nav.style.setProperty('--spotlight-x', `${v}px`);
          },
        });
      }
    };

    nav.addEventListener('mousemove', handleMouseMove);
    nav.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      nav.removeEventListener('mousemove', handleMouseMove);
      nav.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [activeIndex]);

  // Animate the ambience glow to the active item position
  useEffect(() => {
    if (!navRef.current) return;
    const nav = navRef.current;
    const activeItem = nav.querySelector(`[data-index="${activeIndex}"]`);

    if (activeItem) {
      const navRect = nav.getBoundingClientRect();
      const itemRect = activeItem.getBoundingClientRect();
      const targetX = itemRect.left - navRect.left + itemRect.width / 2;

      // If initial position is 0, initialize directly to avoid jumping from far left
      if (ambienceX.current === 0) {
        ambienceX.current = targetX;
        spotlightX.current = targetX;
        nav.style.setProperty('--ambience-x', `${targetX}px`);
        nav.style.setProperty('--spotlight-x', `${targetX}px`);
      }

      animate(ambienceX.current, targetX, {
        type: 'spring',
        stiffness: 220,
        damping: 24,
        onUpdate: (v) => {
          ambienceX.current = v;
          nav.style.setProperty('--ambience-x', `${v}px`);
        },
      });
    }
  }, [activeIndex]);

  const handleItemClick = (e, item, index) => {
    // If it's an in-page anchor, handle smooth scroll
    if (item.href && item.href.startsWith('#')) {
      const targetElement = document.querySelector(item.href);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({ behavior: 'smooth' });
      }
    }
    setInternalActiveIndex(index);
    onItemClick?.(item, index);
  };

  // Dynamic theme colors for the spotlight effects
  const spotlightColor = isScrolled
    ? 'rgba(51, 104, 160, 0.14)'
    : 'rgba(255, 255, 255, 0.18)';
  
  const ambienceColor = isScrolled
    ? 'rgba(51, 104, 160, 0.95)'
    : 'rgba(102, 163, 191, 0.95)';

  const ambienceGlowColor = isScrolled
    ? 'rgba(51, 104, 160, 0.4)'
    : 'rgba(200, 223, 219, 0.5)';

  return (
    <div className={cn('relative flex items-center justify-center', className)}>
      <nav
        ref={navRef}
        style={{
          '--spotlight-color': spotlightColor,
          '--ambience-color': ambienceColor,
          '--ambience-glow': ambienceGlowColor,
        }}
        className={cn(
          'relative h-10 sm:h-11 rounded-full transition-all duration-300 overflow-hidden flex items-center',
          isScrolled
            ? 'bg-[#E5E1D5]/80 backdrop-blur-md border border-[#C8DFDB] shadow-[0_4px_16px_rgba(23,39,56,0.06)]'
            : 'bg-[#142538]/65 backdrop-blur-md border border-white/20 shadow-[0_4px_24px_rgba(0,0,0,0.25)]'
        )}
      >
        {/* Navigation Item Links */}
        <ul className="relative flex items-center h-full px-1.5 sm:px-2 gap-0.5 sm:gap-1 z-[10] list-none m-0 p-0">
          {items.map((item, idx) => {
            const isActive = activeIndex === idx;
            const Icon = item.icon;

            return (
              <li key={item.id || idx} className="relative h-full flex items-center justify-center">
                <a
                  href={item.href}
                  data-index={idx}
                  onClick={(e) => handleItemClick(e, item, idx)}
                  className={cn(
                    'relative px-3 sm:px-4 py-1.5 text-xs sm:text-sm font-medium transition-all duration-200 rounded-full flex items-center gap-1.5 whitespace-nowrap select-none',
                    'focus-visible:outline-none focus-visible:ring-2',
                    isScrolled
                      ? 'focus-visible:ring-[#3368A0]/40'
                      : 'focus-visible:ring-white/40',
                    // Active vs Inactive state styling
                    isActive
                      ? isScrolled
                        ? 'text-[#3368A0] font-bold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)]'
                        : 'text-white font-bold drop-shadow-[0_1px_6px_rgba(255,255,255,0.4)]'
                      : isScrolled
                        ? 'text-[#172738]/75 hover:text-[#172738]'
                        : 'text-white/75 hover:text-white'
                  )}
                >
                  {Icon && (
                    <Icon
                      className={cn(
                        'w-3.5 h-3.5 sm:w-4 sm:h-4 transition-colors duration-200',
                        isActive
                          ? isScrolled
                            ? 'text-[#3368A0]'
                            : 'text-[#C8DFDB]'
                          : isScrolled
                            ? 'text-[#66A3BF]'
                            : 'text-[#C8DFDB]/70'
                      )}
                    />
                  )}
                  <span>{item.label}</span>
                </a>
              </li>
            );
          })}
        </ul>

        {/* LIGHTING LAYERS */}

        {/* 1. The Dynamic Moving Spotlight (Follows mouse cursor or glides back) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1] transition-opacity duration-300"
          style={{
            opacity: hoverX !== null ? 1 : 0.35,
            background: `
              radial-gradient(
                130px circle at var(--spotlight-x, 50%) 100%, 
                var(--spotlight-color) 0%, 
                transparent 70%
              )
            `,
          }}
        />

        {/* 2. Top Rim Subtle Highlight */}
        <div
          className="pointer-events-none absolute top-0 left-0 w-full h-[1px] z-[2] opacity-60"
          style={{
            background: `
              radial-gradient(
                180px circle at var(--spotlight-x, 50%) 0%, 
                var(--spotlight-color) 0%, 
                transparent 100%
              )
            `,
          }}
        />

        {/* 3. The Active State Bottom Ambience Glow (Glides to active item) */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-[2.5px] z-[2]"
          style={{
            background: `
              radial-gradient(
                70px circle at var(--ambience-x, 50%) 0%, 
                var(--ambience-color) 0%, 
                transparent 100%
              )
            `,
            boxShadow: `0 0 10px var(--ambience-glow)`,
          }}
        />

        {/* 4. Soft Active Pill Halo */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 w-full h-full z-[1]"
          style={{
            background: `
              radial-gradient(
                90px circle at var(--ambience-x, 50%) 80%, 
                var(--spotlight-color) 0%, 
                transparent 75%
              )
            `,
          }}
        />
      </nav>
    </div>
  );
}

export default SpotlightNavbar;
