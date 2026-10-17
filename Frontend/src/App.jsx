import React, { useState, useEffect } from 'react';
import CinematicPreloader from './components/CinematicPreloader';
import Header from './components/Header';
import Hero from './components/Hero';
import Overview from './components/Overview';
import InteractiveMap from './components/InteractiveMap';
import HostOrganizations from './components/HostOrganizations';
import AlumniSection from './components/AlumniSection';
import ProgrammeFee from './components/ProgrammeFee';
import ApplicationTimeline from './components/ApplicationTimeline';
import ApplicationModal from './components/ApplicationModal';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';

export default function App({ page = 'home' }) {
  const isHome = page === 'home';
  // The intro video plays only when the site is first opened on the home page, not when you come back to it
  const [showIntro] = useState(isHome);

  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  // Ensure the page handles #apply hash routing and top scroll on load
  useEffect(() => {
    const handleHash = () => {
      if (window.location.hash === '#apply') {
        setIsApplyModalOpen(true);
      }
    };

    handleHash();
    window.addEventListener('hashchange', handleHash);

    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    const hash = window.location.hash;
    const target = hash && hash !== '#apply' ? document.querySelector(hash) : null;
    if (target) {
      // arrived from another page with a section link (e.g. /#overview): go to that section
      setTimeout(() => target.scrollIntoView({ behavior: 'instant', block: 'start' }), 60);
    } else if (hash !== '#apply') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <div className="min-h-screen bg-brand-cream text-brand-textDark font-sans selection:bg-brand-terracotta selection:text-white">
      {/* Cinematic Full-Screen Video Preloader (home page only) */}
      {showIntro && <CinematicPreloader />}

      {/* Top Scroll Indicator */}
      <ScrollProgress />

      {/* Main Sections */}
      <Header page={page} onOpenApply={() => setIsApplyModalOpen(true)} />
      {isHome ? (
        <main>
          <Hero onOpenApply={() => setIsApplyModalOpen(true)} />
          <Overview onOpenApply={() => setIsApplyModalOpen(true)} />
          <InteractiveMap />
          <HostOrganizations />
          <AlumniSection />
        </main>
      ) : page === 'fee' ? (
        /* Programme > Programme Fee (/programme/fee) */
        <main>
          <ProgrammeFee onOpenApply={() => setIsApplyModalOpen(true)} />
        </main>
      ) : (
        /* Programme > Timeline (/programme) */
        <main>
          <ApplicationTimeline onOpenApply={() => setIsApplyModalOpen(true)} />
        </main>
      )}
      <Footer onOpenApply={() => setIsApplyModalOpen(true)} />

      {/* Floating Back to Top with circular scroll gauge */}
      <BackToTop />

      {/* Application Form Modal */}
      <ApplicationModal
        isOpen={isApplyModalOpen}
        onClose={() => setIsApplyModalOpen(false)}
      />
    </div>
  );
}