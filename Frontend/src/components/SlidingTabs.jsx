import React, { useRef, useLayoutEffect, useEffect, useCallback } from 'react';

/**
 * Transitions.dev — Tabs sliding component
 *
 * Wire-up:
 *   On click / activeTab change, flip aria-selected on each tab and
 *   write the active tab's offsetLeft / offsetWidth onto the pill:
 *     pill.style.transform = `translateX(${tab.offsetLeft}px)`;
 *     pill.style.width     = `${tab.offsetWidth}px`;
 *   On first paint and resize, write the same values WITHOUT
 *   a transition (suspend with `transition: none`, force a reflow, restore).
 */
export default function SlidingTabs({
  tabs = [],
  activeId,
  onChange,
  className = '',
  tabClassName = '',
  pillClassName = '',
  dark = false,
  size = 'md', // 'sm' | 'md' | 'lg'
  ...props
}) {
  const containerRef = useRef(null);
  const pillRef = useRef(null);
  const tabRefs = useRef({});
  const isFirstRender = useRef(true);

  const updatePillPosition = useCallback((animate = true) => {
    const container = containerRef.current;
    const pill = pillRef.current;
    const activeTab = tabRefs.current[activeId];

    if (!container || !pill || !activeTab) return;

    const offsetLeft = activeTab.offsetLeft;
    const offsetWidth = activeTab.offsetWidth;

    if (!animate) {
      // Suspend transition, force reflow, write position, restore
      pill.style.transition = 'none';
      pill.style.transform = `translateX(${offsetLeft}px)`;
      pill.style.width = `${offsetWidth}px`;
      // Force reflow
      void pill.offsetHeight;
      pill.style.transition = '';
    } else {
      pill.style.transform = `translateX(${offsetLeft}px)`;
      pill.style.width = `${offsetWidth}px`;
    }
  }, [activeId]);

  useLayoutEffect(() => {
    if (isFirstRender.current) {
      updatePillPosition(false);
      isFirstRender.current = false;
    } else {
      updatePillPosition(true);
    }
  }, [activeId, updatePillPosition]);

  // Window resize & orientation change listener
  useEffect(() => {
    const handleResize = () => {
      updatePillPosition(false);
    };

    window.addEventListener('resize', handleResize);
    
    // Also use ResizeObserver on container if available
    let resizeObserver = null;
    if (window.ResizeObserver && containerRef.current) {
      resizeObserver = new ResizeObserver(() => {
        updatePillPosition(false);
      });
      resizeObserver.observe(containerRef.current);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeObserver) resizeObserver.disconnect();
    };
  }, [updatePillPosition]);

  return (
    <div
      ref={containerRef}
      className={`t-tabs ${dark ? 't-tabs-dark' : ''} ${className}`}
      role="tablist"
      {...props}
    >
      {/* Sliding indicator pill */}
      <span
        ref={pillRef}
        className={`t-tabs-pill ${pillClassName}`}
        aria-hidden="true"
      />

      {/* Tab Buttons */}
      {tabs.map((tab) => {
        const id = typeof tab === 'object' ? tab.id : tab;
        const label = typeof tab === 'object' ? tab.label : tab;
        const icon = typeof tab === 'object' ? tab.icon : null;
        const isSelected = activeId === id;

        return (
          <button
            key={id}
            ref={(el) => (tabRefs.current[id] = el)}
            type="button"
            role="tab"
            aria-selected={isSelected}
            onClick={() => onChange && onChange(id)}
            className={`t-tab ${tabClassName}`}
          >
            {icon && <span className="shrink-0">{icon}</span>}
            <span>{label}</span>
          </button>
        );
      })}
    </div>
  );
}
