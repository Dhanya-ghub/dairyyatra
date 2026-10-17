import React, { useState } from 'react';
import { Download, Mail, Phone, Compass, ChevronUp, ChevronDown } from 'lucide-react';

export default function BottomNav({ onOpenApply }) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <aside aria-label="Bottom Quick Actions Bar" className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40 max-w-xl w-[92%] sm:w-auto">
      <div className="bg-brand-dark/95 backdrop-blur-xl text-white rounded-2xl p-2 sm:p-3 border border-white/20 shadow-2xl flex items-center justify-between gap-3">
        
        {/* Quick Action Badges */}
        <div className="flex items-center gap-2 overflow-x-auto">
          <a
            href="/Dairy_Yatra_2027_Brochure.pdf"
            download="Dairy_Yatra_2027_Brochure.pdf"
            className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-brand-gold text-xs font-bold px-3 py-2 rounded-xl border border-white/10 whitespace-nowrap transition-colors"
          >
            <Download className="w-3.5 h-3.5" /> PDF Brochure
          </a>

          <a
            href="#interactive-map"
            className="hidden sm:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl border border-white/10 whitespace-nowrap transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-brand-gold" /> Route Map
          </a>

          <a
            href="mailto:info@dairyyatra.in"
            className="hidden md:flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold px-3 py-2 rounded-xl border border-white/10 whitespace-nowrap transition-colors"
          >
            <Mail className="w-3.5 h-3.5" /> Contact
          </a>
        </div>

        {/* Apply CTA */}
        <button
          onClick={onOpenApply}
          className="bg-brand-gold hover:bg-yellow-400 text-brand-dark px-4 sm:px-6 py-2 rounded-xl font-extrabold text-xs sm:text-sm whitespace-nowrap shadow-lg transition-transform hover:scale-105 active:scale-95"
        >
          Apply Now
        </button>

      </div>
    </aside>
  );
}
