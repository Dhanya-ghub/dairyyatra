import React from 'react';
import { Download, Mail, MapPin, Heart, Instagram, Phone } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const linkCls =
  'inline-block transform text-[#F2EFE7]/80 transition-all duration-200 hover:translate-x-1 hover:text-[#66A3BF]';
const headCls = 'mb-3 font-sans text-lg font-bold text-[#C8DFDB]';

/* Compact footer.
   Left: brand with Navigation right beside it.   Right (far right): Connect | Apply. */
export default function Footer({ onOpenApply }) {
  return (
    <footer className="overflow-hidden border-t border-[#C8DFDB]/20 bg-[#142538] pb-20 pt-8 text-white sm:pb-5">
      <div className="w-full" style={{ paddingLeft: 'max(16px, 2%)', paddingRight: 'max(16px, 2%)' }}>
        <div className="mb-5 flex flex-col gap-8 border-b border-white/10 pb-6 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          {/* ---------- Left: brand + navigation ---------- */}
          <div className="flex flex-col gap-8 sm:flex-row sm:gap-12 xl:gap-16">
            <ScrollReveal animation="fade-right" duration={700}>
              <div className="max-w-[26rem]">
                <p className="mb-2 text-sm font-semibold leading-relaxed text-[#C8DFDB]">
                  An initiative to inspire the next generation of dairy entrepreneurs.
                </p>
                <p className="mb-2 text-sm leading-relaxed text-[#F2EFE7]/80">
                  India's premier 15-day experiential learning journey brings together 40 fellows to discover innovations across
                  the dairy value chain - from milk production and processing to breeding, technology, and farmer livelihoods.
                </p>
                <p className="text-xs leading-relaxed text-[#F2EFE7]/60">
                  Spanning seven states, Dairy Yatra 2027 connects entrepreneurs with real-world practices, emerging
                  opportunities, and sustainable models shaping the future of India's dairy sector.
                </p>
              </div>
            </ScrollReveal>

            <ScrollReveal animation="fade-up" delay={150} duration={700}>
              <div>
                <h4 className={headCls}>Explore</h4>
                <ul className="space-y-2 text-sm">
                  <li><a href="/#overview" className={linkCls}>About Dairy Yatra</a></li>
                  <li><a href="/#interactive-map" className={linkCls}>The Route</a></li>
                  <li><a href="/#alumni" className={linkCls}>Alumni</a></li>
                  <li><a href="/programme" className={linkCls}>Programme Timeline</a></li>
                  <li><a href="/programme/fee" className={linkCls}>Programme Fee</a></li>
                </ul>
              </div>
            </ScrollReveal>
          </div>

          {/* ---------- Right: Connect | Apply ---------- */}
          <div className="flex flex-col gap-8 sm:flex-row sm:gap-12 xl:gap-16">
            {/* Connect */}
            <ScrollReveal animation="fade-left" delay={250} duration={700}>
              <div className="max-w-[24rem]">
                <h4 className={headCls}>Connect</h4>
                <p className="mb-3 text-sm leading-relaxed text-[#F2EFE7]/80">
                  For enquiries
                </p>
                <div className="space-y-2">
                  <a
                    href="mailto:dairyyatra@kct.ac.in"
                    className="flex items-center gap-2 text-sm text-white transition-colors hover:text-[#66A3BF]"
                  >
                    <Mail className="h-4 w-4 shrink-0 text-[#66A3BF]" /> dairyyatra@kct.ac.in
                  </a>
                  <a
                    href="tel:+919789100200"
                    className="flex items-center gap-2 text-sm text-white transition-colors hover:text-[#66A3BF]"
                  >
                    <Phone className="h-4 w-4 shrink-0 text-[#66A3BF]" /> 9789100200
                  </a>
                  <span className="flex items-start gap-2 text-sm text-[#F2EFE7]/80">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#66A3BF]" />
                    Kumaraguru Institutions, Coimbatore, 641049
                  </span>
                  <a
                    href="https://www.instagram.com/dairy.yatra?mdxt=MTZjOHp5c2NyYng0cQ=="
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Follow Dairy Yatra on Instagram (opens in a new tab)"
                    className="flex items-center gap-2 text-sm text-[#F2EFE7]/80 transition-colors hover:text-white"
                  >
                    <Instagram className="h-4 w-4 shrink-0 text-[#66A3BF]" /> Follow us on Instagram
                  </a>
                </div>
              </div>
            </ScrollReveal>

            {/* Apply */}
            <ScrollReveal animation="fade-left" delay={350} duration={700}>
              <div>
                <h4 className={headCls}>Be a Part of Dairy Yatra 2027</h4>
                <div className="flex flex-col items-start gap-3">
                  <button
                    onClick={onOpenApply}
                    className="cursor-pointer whitespace-nowrap rounded-xl bg-[#3368A0] px-5 py-2.5 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:bg-[#234974] active:scale-95"
                  >
                    Expression of Interest
                  </button>
                  <a
                    href="/Dairy_Yatra_2027_Brochure.pdf"
                    download="Dairy_Yatra_2027_Brochure.pdf"
                    className="flex items-center gap-1.5 whitespace-nowrap rounded-xl border border-[#C8DFDB]/25 bg-white/10 px-4 py-2.5 text-xs font-bold text-[#C8DFDB] transition-all duration-300 hover:scale-105 hover:bg-white/20"
                  >
                    <Download className="h-3.5 w-3.5" /> PDF Brochure
                  </a>
                </div>
              </div>
            </ScrollReveal>
          </div>
        </div>

        {/* Bottom line. Not wrapped in ScrollReveal: it sits at the very bottom of the page, where the
            reveal animation never triggers, so it is always shown. */}
        <div className="flex flex-col items-center justify-between gap-2 text-xs text-[#F2EFE7]/60 sm:flex-row sm:pr-16">
          <p>© 2026 Kumaraguru Institutions. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="h-3.5 w-3.5 animate-pulse fill-current text-rose-500" aria-label="love" /> by Kumaraguru Institutions
          </p>
        </div>
      </div>
    </footer>
  );
}