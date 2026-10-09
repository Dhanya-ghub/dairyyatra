import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../lib/utils';

export function SharedTooltipAvatars({
  items = [],
  className,
  avatarClassName,
  ...props
}) {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [tooltipPos, setTooltipPos] = useState({ left: 0, top: 0 });
  const [activeName, setActiveName] = useState('');

  const timeoutRef = useRef(null);
  const containerRef = useRef(null);
  const avatarRefs = useRef([]);

  const handleMouseEnter = (index) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    const avatar = avatarRefs.current[index];
    if (avatar) {
      const left = avatar.offsetLeft + avatar.offsetWidth / 2;
      const top = avatar.offsetTop;

      setTooltipPos({ left, top });
      setActiveName(items[index]?.name || '');
      setHoveredIndex(index);
    }
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      setHoveredIndex(null);
    }, 150);
  };

  return (
    <div
      ref={containerRef}
      className={cn('relative flex items-center py-3', className)}
      {...props}
    >
      {/* Floating Shared Tooltip */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            initial={{
              opacity: 0,
              x: '-50%',
              y: '-80%',
              scale: 0.95,
              left: tooltipPos.left,
              top: tooltipPos.top - 8,
            }}
            animate={{
              opacity: 1,
              x: '-50%',
              y: '-100%',
              scale: 1,
              left: tooltipPos.left,
              top: tooltipPos.top - 8,
            }}
            exit={{
              opacity: 0,
              x: '-50%',
              y: '-80%',
              scale: 0.95,
            }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            className="absolute z-50 px-3 py-1 bg-white/95 text-[#142538] backdrop-blur-xl rounded-xl text-xs font-bold whitespace-nowrap shadow-[0_10px_25px_rgba(0,0,0,0.35)] border border-white/40 pointer-events-none"
            role="tooltip"
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={activeName}
                initial={{ opacity: 0, y: 3 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -3 }}
                transition={{ duration: 0.15, ease: 'easeOut' }}
                className="inline-block"
              >
                {activeName || ' '}
              </motion.span>
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Avatar Stack */}
      <div className="flex items-center">
        {items.map((item, index) => (
          <div
            key={item.id || index}
            ref={(el) => {
              avatarRefs.current[index] = el;
            }}
            className={cn(
              'relative -ml-2.5 first:ml-0 transition-all duration-300 ease-out hover:-translate-y-1.5 hover:z-20 cursor-pointer group',
              avatarClassName
            )}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onFocus={() => handleMouseEnter(index)}
            onBlur={handleMouseLeave}
            tabIndex={0}
            role="listitem"
            aria-label={item.name}
          >
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-white p-1.5 border-2 border-[#142538] ring-2 ring-white/20 shadow-md group-hover:ring-[#66A3BF] group-hover:shadow-xl transition-all duration-300 flex items-center justify-center overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-contain filter contrast-105"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SharedTooltipAvatars;
