import React, { useState, useEffect } from 'react';
import { Download, Menu, X, ChevronRight } from 'lucide-react';
import AdminAccess from './admin/Adminaccess';

// Brochure file (public folder). Change it here and it updates everywhere in the header.
const BROCHURE_URL = '/Dairy_Yatra_2025_Brochure.pdf';

// Menu links, in page order. Host Partners (#hosts) is intentionally not in the menu.
const NAV_LINKS = [
  { id: 'overview', label: 'ABOUT', href: '#overview' },
  { id: 'interactive-map', label: 'ROUTE', href: '#interactive-map' },
  { id: 'alumni', label: 'ALUMNI', href: '#alumni' },
  { id: 'timeline', label: 'TIMELINE', href: '#timeline' },
];

// Every section on the page, in order. Used only for the scroll highlight.
// 'hosts' is listed so that no menu item stays highlighted while the partners section is on screen.
const SPY_SECTIONS = ['overview', 'interactive-map', 'alumni', 'hosts', 'timeline'];

export default function Header({ onOpenApply }) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('overview');

  // Section spy for the scroll indicator
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);

      const scrollPos = window.scrollY + 140;

      let current = '';
      for (let i = SPY_SECTIONS.length - 1; i >= 0; i--) {
        const el = document.getElementById(SPY_SECTIONS[i]);
        if (el && el.offsetTop <= scrollPos) {
          current = SPY_SECTIONS[i];
          break;
        }
      }

      if (!current && window.scrollY < 200) {
        current = 'overview';
      }

      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 w-full transition-all duration-300 font-sans ${
        isScrolled
          ? 'bg-white/90 backdrop-blur-md py-3 shadow-[0_1px_12px_rgba(15,23,42,0.08)]'
          : 'bg-white py-3.5'
      }`}
      /* Everything sits against the right edge. Raise the 2% if you want a little more gap. */
      style={{ paddingLeft: 'max(16px, 2%)', paddingRight: 'max(16px, 2%)' }}
    >
      <div className="w-full flex items-center justify-end">

<<<<<<< HEAD
        {/* DESKTOP: NAV LINKS, BROCHURE LINK, MAIN BUTTON, ADMIN LOCK (all on the right) */}
        <div className="hidden lg:flex items-center gap-3 xl:gap-4 justify-end">
          <nav className="flex items-center gap-4 xl:gap-5">
=======
        {/* 2. RIGHT (desktop): NAV LINKS, BROCHURE LINK, MAIN BUTTON */}
        <div className="hidden lg:flex items-center gap-5 xl:gap-7 justify-end">
          <nav className="flex items-center gap-5 xl:gap-8">
>>>>>>> ec1671624ebafb154da7009af5ef6fa31ea4bf71
            {NAV_LINKS.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={link.href}
                  className={`relative text-[13px] xl:text-[14px] font-semibold uppercase tracking-[0.05em] transition-colors duration-200 py-1.5 whitespace-nowrap ${
                    isActive ? 'text-[#2B6CB0]' : 'text-slate-600 hover:text-[#2B6CB0]'
                  }`}
                >
                  <span>{link.label}</span>
                  {isActive && (
                    <span className="absolute -bottom-0.5 left-0 right-0 h-[2px] bg-[#2B6CB0] rounded-full" />
                  )}
                </a>
              );
            })}
          </nav>

          <span className="h-5 w-px bg-slate-300" aria-hidden="true" />

          {/* Brochure: quiet text link, so the main button is the only filled one */}
          <a
            href={BROCHURE_URL}
            download
            className="flex items-center gap-1.5 text-[12px] xl:text-[13px] font-semibold uppercase tracking-[0.05em] text-slate-600 hover:text-[#2B6CB0] transition-colors whitespace-nowrap"
          >
            <Download className="w-4 h-4" />
            <span>Brochure</span>
          </a>

          {/* Primary action */}
          <button
            onClick={onOpenApply}
            className="flex items-center gap-1.5 bg-[#2B6CB0] hover:bg-[#1E56A0] text-white px-5 xl:px-6 py-2 xl:py-2.5 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer whitespace-nowrap"
          >
            <span>Expression of Interest</span>
            <ChevronRight className="w-4 h-4" />
          </button>

          {/* Admin login: lock icon next to the main button */}
          <AdminAccess iconOnly className="flex items-center justify-center w-8 h-8 rounded-full text-slate-500 hover:text-[#2B6CB0] hover:bg-slate-100 transition-colors cursor-pointer" />
        </div>

        {/* Medium screens (sm to lg): nav hidden, show brochure link and main button */}
        <div className="hidden sm:flex lg:hidden items-center gap-3">
          <a
            href={BROCHURE_URL}
            download
            className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-slate-600 hover:text-[#2B6CB0] transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Brochure</span>
          </a>
          <button
            onClick={onOpenApply}
            className="flex items-center gap-1 bg-[#2B6CB0] hover:bg-[#1E56A0] text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-md hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
          >
            <span>Expression of Interest</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
          <AdminAccess iconOnly className="flex items-center justify-center w-8 h-8 rounded-full text-slate-500 hover:text-[#2B6CB0] hover:bg-slate-100 transition-colors cursor-pointer" />
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 rounded-xl text-[#1B2A4A] bg-white border border-[#E2E8F0] hover:bg-slate-50 transition-colors ml-2"
          aria-label="Toggle Navigation Menu"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* MOBILE DRAWER */}
      {mobileMenuOpen && (
        <div className="lg:hidden mt-3 bg-white text-[#1B2A4A] px-6 py-6 rounded-2xl border border-[#E2E8F0] space-y-4 shadow-xl animate-fadeIn font-sans">
          {NAV_LINKS.map((link) => (
            <a
              key={link.id}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className={`block text-xs font-bold tracking-[0.05em] uppercase py-2.5 border-b border-slate-100 transition-colors ${
                activeSection === link.id ? 'text-[#2B6CB0]' : 'text-slate-600 hover:text-[#2B6CB0]'
              }`}
            >
              {link.label}
            </a>
          ))}

          <a
            href={BROCHURE_URL}
            download
            className="flex items-center gap-2 text-xs font-bold tracking-[0.05em] uppercase py-2.5 text-slate-600 hover:text-[#2B6CB0] transition-colors"
          >
            <Download className="w-4 h-4" /> Brochure
          </a>

          <AdminAccess className="flex items-center gap-2 text-xs font-bold tracking-[0.05em] uppercase py-2.5 text-slate-600 hover:text-[#2B6CB0] transition-colors cursor-pointer" />

          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenApply();
            }}
            className="w-full bg-[#2B6CB0] hover:bg-[#1E56A0] text-white font-bold py-3 rounded-full text-xs uppercase tracking-wider shadow-md cursor-pointer"
          >
            Expression of Interest
          </button>
        </div>
      )}
    </header>
  );
}