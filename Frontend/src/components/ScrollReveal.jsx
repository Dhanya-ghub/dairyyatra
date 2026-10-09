import React, { useEffect, useRef, useState } from 'react';

/**
 * ScrollReveal component triggers GPU-accelerated entrance transitions
 * when elements enter the viewport during scrolling.
 */
export default function ScrollReveal({
  children,
  animation = 'fade-up', // 'fade-up' | 'fade-down' | 'fade-left' | 'fade-right' | 'zoom-in' | 'zoom-out' | 'fade'
  delay = 0, // delay in ms
  duration = 700, // duration in ms
  threshold = 0.15, // trigger when 15% visible
  className = '',
  style = {},
  once = true,
  as = 'div'
}) {
  const [isVisible, setIsVisible] = useState(false);
  const domRef = useRef(null);

  useEffect(() => {
    const node = domRef.current;
    if (!node) return;

    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (once) {
            observer.unobserve(node);
          }
        } else if (!once) {
          setIsVisible(false);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -40px 0px' // Slightly trigger before bottom edge for snappier feel
      }
    );

    observer.observe(node);

    return () => {
      if (node) observer.unobserve(node);
    };
  }, [threshold, once]);

  // Initial animation transform classes
  const getInitialClass = () => {
    switch (animation) {
      case 'fade-up':
        return 'opacity-0 translate-y-10';
      case 'fade-down':
        return 'opacity-0 -translate-y-10';
      case 'fade-left':
        return 'opacity-0 translate-x-12';
      case 'fade-right':
        return 'opacity-0 -translate-x-12';
      case 'zoom-in':
        return 'opacity-0 scale-90';
      case 'zoom-out':
        return 'opacity-0 scale-105';
      case 'fade':
      default:
        return 'opacity-0';
    }
  };

  // Visible animation transform classes
  const getVisibleClass = () => {
    switch (animation) {
      case 'fade-up':
      case 'fade-down':
        return 'opacity-100 translate-y-0';
      case 'fade-left':
      case 'fade-right':
        return 'opacity-100 translate-x-0';
      case 'zoom-in':
      case 'zoom-out':
        return 'opacity-100 scale-100';
      case 'fade':
      default:
        return 'opacity-100';
    }
  };

  const Component = as;

  return (
    <Component
      ref={domRef}
      style={{
        ...style,
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transitionTimingFunction: 'cubic-bezier(0.16, 1, 0.3, 1)',
        willChange: 'transform, opacity'
      }}
      className={`transition-all ${
        isVisible ? getVisibleClass() : getInitialClass()
      } ${className}`}
    >
      {children}
    </Component>
  );
}
