import React, { useState, useEffect } from 'react';
import CinematicPreloader from './components/CinematicPreloader';
import Header from './components/Header';
import Hero from './components/Hero';
import Overview from './components/Overview';
import AlumniSection from './components/Alumnisection';
import InteractiveMap from './components/InteractiveMap';
import HostOrganizations from './components/HostOrganizations';
import ApplicationTimeline from './components/ApplicationTimeline';  
import ApplicationModal from './components/ApplicationModal';
import Footer from './components/Footer';
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';

export default function App() {
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
    if (window.location.hash !== '#apply') {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    }

    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  return (
    <div className="min-h-screen bg-brand-cream text-brand-textDark font-sans selection:bg-brand-terracotta selection:text-white">
      {/* Cinematic Full-Screen Video Preloader */}
      <CinematicPreloader />

      {/* Top Scroll Indicator */}
      <ScrollProgress />

      {/* Main Sections */}
      <Header onOpenApply={() => setIsApplyModalOpen(true)} />
      <main>
        <Hero onOpenApply={() => setIsApplyModalOpen(true)} />
        <Overview onOpenApply={() => setIsApplyModalOpen(true)} />
        
        <InteractiveMap />
        <AlumniSection />
        <HostOrganizations />
        <ApplicationTimeline onOpenApply={() => setIsApplyModalOpen(true)} />
      </main>
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
