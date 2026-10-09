import React from 'react';
import { Download, Mail, MapPin, Heart, Instagram, Phone } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import kiLogo from '../assets/kilg.png';

export default function Footer({ onOpenApply }) {
  return (
    <footer className="bg-[#142538] text-white pt-16 pb-24 border-t border-[#C8DFDB]/20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12 pb-12 border-b border-white/10">

          {/* Brand & Manifesto */}
          <div className="md:col-span-5">
            <ScrollReveal animation="fade-right" duration={700}>
              <div className="flex items-center gap-3 mb-4">
                <img src="/logo.jpeg" alt="Dairy Yatra Logo" className="h-10 w-auto rounded-lg bg-white p-1" />
                <span className="font-serif text-2xl font-bold text-white">
                  DAIRY YATRA 2027
                </span>
              </div>
              <p className="text-sm text-[#F2EFE7]/80 leading-relaxed mb-4 max-w-md">
                India's premier 15-day experiential travel program bringing together 40 entrepreneurs to explore milk production, processing, breeding, technology, and farmer livelihoods across 5 states.
              </p>
              <p className="text-xs text-[#F2EFE7]/60 mb-5">
                Planned as an annual landmark event driving sustainable progress in India's dairy sector.
              </p>

              {/* Host Organisation Section */}
              <div className="pt-4 border-t border-white/10">
                <span className="text-[11px] uppercase tracking-wider font-semibold text-[#66A3BF] block mb-2.5">
                  Host Organisation
                </span>
                <div className="inline-flex items-center p-2.5 sm:p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow">
                  <img
                    src={kiLogo}
                    alt="Kumaraguru Institutions"
                    className="h-10 sm:h-12 w-auto object-contain"
                  />
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-3">
            <ScrollReveal animation="fade-up" delay={150} duration={700}>
              <h4 className="font-serif text-lg font-bold text-[#C8DFDB] mb-4">
                Navigation
              </h4>
              <ul className="space-y-2.5 text-sm text-[#F2EFE7]/80">
                <li><a href="#overview" className="hover:text-[#66A3BF] transition-colors hover:translate-x-1 inline-block transform duration-200">Program Overview</a></li>
                <li><a href="#interactive-map" className="hover:text-[#66A3BF] transition-colors hover:translate-x-1 inline-block transform duration-200">Interactive Route Simulator</a></li>
                <li><a href="#itinerary" className="hover:text-[#66A3BF] transition-colors hover:translate-x-1 inline-block transform duration-200">15-Day Itinerary Table</a></li>
                <li><a href="#hosts" className="hover:text-[#66A3BF] transition-colors hover:translate-x-1 inline-block transform duration-200">Programme Partners</a></li>
              </ul>
            </ScrollReveal>
          </div>

          {/* Contact & Downloads */}
          <div className="md:col-span-4">
            <ScrollReveal animation="fade-left" delay={250} duration={700}>
              <h4 className="font-serif text-lg font-bold text-[#C8DFDB] mb-4">
                Connect & Apply
              </h4>
              <p className="text-sm text-[#F2EFE7]/80 mb-4">
                For cohort inquiries, parent communications, or press details:
              </p>
              <div className="space-y-3 mb-6">
                <div className="flex flex-wrap items-center gap-3">
                  <a href="mailto:info@dairyyatra.in" className="flex items-center gap-2 text-sm text-white hover:text-[#66A3BF] transition-colors">
                    <Mail className="w-4 h-4 text-[#66A3BF]" /> info@dairyyatra.in / apply@dairyyatra.in
                  </a>
                  <a
                    href="https://www.instagram.com/dairy.yatra?mdxt=MTZjOHp5c2NyYng0cQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Dairy Yatra on Instagram (opens in a new tab)"
                    className="text-[#66A3BF] transition-colors hover:text-white"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                </div>
                <span className="flex items-center gap-2 text-sm text-white/80">
                  <Phone className="w-4 h-4 text-[#66A3BF]" /> Phone:
                </span>
                <span className="flex items-center gap-2 text-xs text-[#F2EFE7]/70">
                  <MapPin className="w-4 h-4 text-[#66A3BF]" /> Headquarters: Coimbatore
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={onOpenApply}
                  className="bg-[#3368A0] hover:bg-[#234974] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
                >
                  Expression of Interest
                </button>
                <a
                  href="/Dairy_Yatra_2025_Brochure.pdf"
                  download="Dairy_Yatra_2025_Brochure.pdf"
                  className="bg-white/10 hover:bg-white/20 text-[#C8DFDB] px-4 py-2 rounded-xl text-xs font-bold border border-[#C8DFDB]/25 flex items-center gap-1.5 hover:scale-105 transition-all duration-300"
                >
                  <Download className="w-3.5 h-3.5" /> PDF Brochure
                </a>
              </div>
            </ScrollReveal>
          </div>

        </div>

        {/* Bottom copyright */}
        <ScrollReveal animation="fade" delay={350} duration={600}>
          <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-[#F2EFE7]/60 gap-4">
            <p>© 2026 Kumaraguru Institution</p>
            <p className="flex items-center gap-1">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-current animate-pulse" /> for Rural Dairy Innovation across India.
            </p>
          </div>
        </ScrollReveal>

      </div>
    </footer>
  );
}
