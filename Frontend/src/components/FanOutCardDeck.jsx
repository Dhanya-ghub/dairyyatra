import React, { useState, useRef } from 'react';
import { Sparkles, MapPin } from 'lucide-react';

/**
 * FanOutCardDeck Component
 * 
 * Implements an interactive 3-card "Fan-Out / Stack" hover deck animation
 * matching the hand-of-cards UI specification.
 *
 * @param {Object} props
 * @param {Array} props.cards - Array of 3 card objects: [leftCard, centerCard, rightCard]
 * @param {string|number} props.day - Optional day indicator (e.g., 1, "01")
 * @param {string} props.className - Extra CSS classes on wrapper
 * @param {function} props.onCardSelect - Callback when a card is selected
 */
export default function FanOutCardDeck({
  cards = [],
  day,
  className = '',
  onCardSelect
}) {
  const [isFanned, setIsFanned] = useState(false);
  const [activeCardId, setActiveCardId] = useState(null);
  const containerRef = useRef(null);

  // Default fallback cards if not fully provided
  const defaultCards = [
    {
      id: 'left',
      role: 'left',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=600&q=80',
      alt: 'Farm & Rural Immersion',
      badge: 'Farm Immersion',
      title: 'Pasture & Herd'
    },
    {
      id: 'center',
      role: 'center',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=600&q=80',
      alt: 'Primary Cohort & Host',
      badge: day ? `Day ${day < 10 ? `0${day}` : day}` : 'Primary Cohort',
      title: 'Host & Flag-Off'
    },
    {
      id: 'right',
      role: 'right',
      type: 'image',
      src: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=600&q=80',
      alt: 'Processing & Technology',
      badge: 'Processing Tech',
      title: 'Quality & Cold Chain'
    }
  ];

  // Merge provided cards with defaults ensuring 3 cards (left, center, right)
  const resolvedCards = [
    {
      ...defaultCards[0],
      ...(cards[0] || {}),
      role: 'left'
    },
    {
      ...defaultCards[1],
      ...(cards[1] || {}),
      role: 'center',
      badge: (cards[1] && cards[1].badge) || (day ? `Day ${day < 10 ? `0${day}` : day}` : defaultCards[1].badge)
    },
    {
      ...defaultCards[2],
      ...(cards[2] || {}),
      role: 'right'
    }
  ];

  const handleCardClick = (e, card) => {
    e.stopPropagation();
    if (activeCardId === card.id) {
      setActiveCardId(null);
    } else {
      setActiveCardId(card.id);
      if (onCardSelect) onCardSelect(card);
    }
  };

  const handleContainerClick = () => {
    // Mobile tap-to-fan toggle
    setIsFanned((prev) => !prev);
    if (activeCardId) {
      setActiveCardId(null);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setIsFanned((prev) => !prev);
    } else if (e.key === 'Escape') {
      setIsFanned(false);
      setActiveCardId(null);
    }
  };

  return (
    <div
      ref={containerRef}
      role="region"
      aria-label="Interactive 3-Card Fan-out Stack"
      tabIndex={0}
      onMouseEnter={() => setIsFanned(true)}
      onMouseLeave={() => {
        setIsFanned(false);
        setActiveCardId(null);
      }}
      onClick={handleContainerClick}
      onKeyDown={handleKeyDown}
      className={`fan-deck-container outline-none focus-visible:ring-2 focus-visible:ring-[#66A3BF] focus-visible:ring-offset-4 focus-visible:ring-offset-[#142538] rounded-3xl ${
        isFanned ? 'is-fanned' : ''
      } ${className}`}
    >
      {resolvedCards.map((card) => {
        const isActive = activeCardId === card.id;
        const roleClass =
          card.role === 'left'
            ? 'fan-deck-card-left'
            : card.role === 'right'
            ? 'fan-deck-card-right'
            : 'fan-deck-card-center';

        return (
          <div
            key={card.id || card.role}
            onClick={(e) => handleCardClick(e, card)}
            role="button"
            tabIndex={0}
            aria-pressed={isActive}
            aria-label={`${card.title || card.badge || card.alt} card`}
            className={`fan-deck-card ${roleClass} ${isActive ? 'is-active' : ''} group/card cursor-pointer`}
          >
            {/* Media Content */}
            {card.type === 'video' ? (
              <video
                src={card.src}
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-full object-cover pointer-events-none"
              />
            ) : (
              <img
                src={card.src}
                alt={card.alt || card.title || 'Card media'}
                className="w-full h-full object-cover pointer-events-none select-none transition-transform duration-500 ease-out group-hover/card:scale-105"
                loading="lazy"
              />
            )}

            {/* Subtle Gradient Vignette Overlays for Crisp Contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-black/30 pointer-events-none" />

            {/* Floating Top Badge */}
            {card.badge && (
              <div className="absolute top-2.5 left-2.5 bg-black/60 backdrop-blur-md text-[#C8DFDB] px-2.5 py-0.5 rounded-full border border-white/20 text-[10px] sm:text-[11px] font-bold tracking-wider uppercase pointer-events-none shadow-sm flex items-center gap-1">
                {card.role === 'center' && <Sparkles className="w-2.5 h-2.5 text-[#66A3BF]" />}
                {card.badge}
              </div>
            )}

            {/* Floating Bottom Info Pill */}
            {card.title && (
              <div className="absolute bottom-2.5 left-2.5 right-2.5 bg-black/75 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-white/15 text-white pointer-events-none transition-opacity duration-300">
                <span className="text-[11px] font-bold text-[#F2EFE7] block truncate leading-tight">
                  {card.title}
                </span>
                {card.subtitle && (
                  <span className="text-[9px] text-[#C8DFDB]/80 flex items-center gap-0.5 truncate mt-0.5">
                    <MapPin className="w-2.5 h-2.5 text-[#66A3BF] shrink-0" />
                    {card.subtitle}
                  </span>
                )}
              </div>
            )}

            {/* Active Indicator Ring Glow */}
            {isActive && (
              <div className="absolute inset-0 rounded-[18px] border-2 border-[#66A3BF] shadow-[inset_0_0_12px_rgba(102,163,191,0.5)] pointer-events-none" />
            )}
          </div>
        );
      })}
    </div>
  );
}
