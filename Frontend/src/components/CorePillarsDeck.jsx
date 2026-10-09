import React from 'react';
import { motion } from 'framer-motion';
import { 
  Building2, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

// High-resolution pillar documentary photographs
import pillar1Img from '../assets/images/pillar_1_organic.jpg';
import pillar2Img from '../assets/images/pillar_2_nutrition.jpg';
import pillar3Img from '../assets/images/pillar_3_genetics.jpg';
import pillar4Img from '../assets/images/pillar_4_bioeconomy.jpg';
import pillar5Img from '../assets/images/pillar_5_cooperative.jpg';
import pillar6Img from '../assets/images/pillar_6_alternative.jpg';

export const STORY_PILLARS = [
  {
    id: '01',
    anchorId: 'pillar-01',
    shortName: 'Organic Soil & Purity',
    title: 'Organic & Sustainable Dairying',
    scriptSubtitle: 'The Living Soil, Grassroots Purity & The Silent Milking Robot',
    host: 'Akshayakalpa Organic Milk',
    location: 'Tiptur, Karnataka',
    bgTheme: 'bg-[#787D3E]', // Olive Herb
    bgText: 'text-[#F7F3EB]',
    accentColor: '#D83A24',
    image: pillar1Img,
    handwrittenNote: 'Field Dispatch: Tiptur · 100% Traceable',
    poeticStory: [
      "It begins not in the processing vat, but deep within the living soil.",
      "At Akshayakalpa, farming is returned to an unbroken biological conversation: zero chemical fertilizers, zero prophylactic antibiotics, and cows that graze freely on organic clover and maize under the shade of coconut groves.",
      "Here, tradition meets quiet precision—solar-powered robotic milking stalls allow the cattle to be milked on their own schedule, preserving animal dignity while ensuring complete pharmaceutical-grade purity for the consumer."
    ],
    fieldReport: {
      domain: 'Chemical-Free Dairy Ecosystems',
      focus: 'Decentralized Organic Farmsteads & Direct-to-Consumer Integrity',
      learnings: [
        'End-to-end antibiotic-free cold chain protocols from farmgate to doorstep',
        'Decentralized farm architecture delivering 2.2x farmgate price realization',
        'Circular fodder cultivation using native multi-species nitrogen fixers'
      ],
      stats: [
        { val: '1,000+', label: 'Organic Farms' },
        { val: '0.0%', label: 'Antibiotics' },
        { val: '2.2x', label: 'Farmer Return' }
      ]
    }
  },
  {
    id: '02',
    anchorId: 'pillar-02',
    shortName: 'Precision Nutrition',
    title: 'Precision Cattle Nutrition & TMR',
    scriptSubtitle: 'The Daily Ration, Silage Fermentation & The Rumen\'s Secret Balance',
    host: 'Gokul Dairy & TMR Hub',
    location: 'Kolhapur, Maharashtra',
    bgTheme: 'bg-[#D83A24]', // Italian Terracotta Crimson
    bgText: 'text-[#F7F3EB]',
    accentColor: '#F7F3EB',
    image: pillar2Img,
    handwrittenNote: 'Silage Fermentation & Metabolic Health',
    poeticStory: [
      "Every master chef knows that true culinary excellence begins with the exact balance of raw ingredients.",
      "For a high-yielding cow, nutrition is no less of an exact art. In Kolhapur, Gokul Dairy has industrialized Total Mixed Ration (TMR)—blending dry matter, bypass proteins, and fermented corn silage into an uninterrupted, perfectly balanced daily meal.",
      "The result is transformative: consistent butterfat percentages, stable rumen fermentation, and a drastic drop in cattle metabolic illnesses across thousands of village cooperatives."
    ],
    fieldReport: {
      domain: 'High-Yield Rumen Science',
      focus: 'Total Mixed Ration (TMR) Algorithms & Year-Round Green Silage',
      learnings: [
        'Precision nutritional formulation mapped to lactation curves and body condition scores',
        'Large-scale commercial silage bagging protecting green fodder supply through dry spells',
        'Cost-per-liter feed optimization elevating smallholder net household profit by 35%'
      ],
      stats: [
        { val: '+35%', label: 'Feed Efficiency' },
        { val: '2.5x', label: 'Yield Stability' },
        { val: '99%', label: 'Rumen Health' }
      ]
    }
  },
  {
    id: '03',
    anchorId: 'pillar-03',
    shortName: 'Indigenous Lineage',
    title: 'Breed Genetics & Livelihoods',
    scriptSubtitle: 'Preserving the Sacred Lineage: Gir, Kankrej & 5.5 Million Generations',
    host: 'BAIF Development Research Foundation',
    location: 'Urulikanchan, Pune',
    bgTheme: 'bg-[#F7F3EB]', // Vintage Cream Parchment
    bgText: 'text-[#1D1A18]',
    accentColor: '#D83A24',
    image: pillar3Img,
    handwrittenNote: 'Genomic Selection & Female Calf Certainty',
    poeticStory: [
      "Generations of pastoral wisdom meet cutting-edge cryogenic science.",
      "At BAIF, the mission is sacred: preserving India's magnificent indigenous cattle breeds—Gir, Kankrej, Sahiwal, and Murrah buffaloes—while upgrading genomic traits for thermal resilience and disease resistance.",
      "Through sex-sorted semen technology and decentralized artificial insemination centers operated by village youth, BAIF guarantees female calves, turning cattle breeding into a reliable engine of rural dignity and prosperity."
    ],
    fieldReport: {
      domain: 'Indigenous Genomic Selection',
      focus: 'Cryopreserved Germplasm Banks & Decentralized Breeding Services',
      learnings: [
        'Progeny testing and elite bull mother management for genetic advancement',
        'Sexed-semen deployment achieving 90%+ female calf certainty for smallholders',
        'Indigenous heat-tolerant gene pools thriving under extreme climate conditions'
      ],
      stats: [
        { val: '15,000+', label: 'Village Centers' },
        { val: '5.5M+', label: 'Progeny Verified' },
        { val: '12+', label: 'Native Breeds' }
      ]
    }
  },
  {
    id: '04',
    anchorId: 'pillar-04',
    shortName: 'Circular Bio-Economy',
    title: 'Manure Bio-Economy & Gobar Dhan',
    scriptSubtitle: 'Closing the Nutrient Loop: From Bovine Dung to Rural Bio-CNG Grids',
    host: 'NDDB Mrida Ltd.',
    location: 'Anand, Gujarat',
    bgTheme: 'bg-[#858B47]', // Warm Olive Khaki
    bgText: 'text-[#F7F3EB]',
    accentColor: '#D83A24',
    image: pillar4Img,
    handwrittenNote: 'Dung-to-Wealth & PROM Bio-Fertilizers',
    poeticStory: [
      "In the ancient Indian farmstead, nothing was ever wasted.",
      "NDDB Mrida has resurrected this timeless philosophy into a multi-crore circular bio-economy. Every kilogram of bovine manure is collected, digested in anaerobic reactors, and transformed into piped cooking gas for village kitchens and compressed Bio-CNG for commercial transport.",
      "The nutrient-rich liquid digestate is converted into Phosphate Rich Organic Manure (PROM), revitalizing depleted agricultural soil while providing regular monthly bonus income to women dairy farmers."
    ],
    fieldReport: {
      domain: 'Gobar Dhan Waste-to-Wealth',
      focus: 'Anaerobic Digesters, Piped Rural Cooking Gas & PROM Value Chains',
      learnings: [
        'Village bio-gas piping networks replacing expensive LPG cylinders with clean fuel',
        'Commercial monetization of slurry into certified organic fertilizers and PROM',
        'Farm-level carbon credit tracking and supplemental monthly revenue streams'
      ],
      stats: [
        { val: '₹3,500+', label: 'Bonus / Month' },
        { val: '100%', label: 'Clean Fuel Grid' },
        { val: '-40%', label: 'Chemical Fertilizer' }
      ]
    }
  },
  {
    id: '05',
    anchorId: 'pillar-05',
    shortName: 'Cooperative Scaling',
    title: 'Cooperative Value Chains & Scale',
    scriptSubtitle: 'The Collective Table: 18 Million Farmers, Digitized Chilling & National Shelves',
    host: 'Amul, NDDB, Govind & Saras',
    location: 'Gujarat · Maharashtra · Rajasthan',
    bgTheme: 'bg-[#C8321E]', // Deep Tomato Terracotta
    bgText: 'text-[#F7F3EB]',
    accentColor: '#F7F3EB',
    image: pillar5Img,
    handwrittenNote: 'Digitized Village Chilling & Artisanal Derivatives',
    poeticStory: [
      "When people gather around a common table with shared purpose, empires are born.",
      "The Indian dairy cooperative movement stands as the world's most formidable democratic food supply chain. From the automated village collection booth where milk fat is tested in 15 seconds to temperature-controlled bulk milk chillers and mega aseptic packaging plants.",
      "Entrepreneurs will dissect how federations convert raw milk into high-margin derivatives—gourmet cheeses, probiotic yogurts, golden ghee, and whey isolates—while ensuring 80%+ of consumer spend flows back to rural milk producers."
    ],
    fieldReport: {
      domain: 'Cooperative Supply Chain Infrastructure',
      focus: 'Digitized Procurement, Cold Chain Logistics & Value-Added Derivatives',
      learnings: [
        'Automated Digitized Milk Collection Systems (DPCS) ensuring radical transparency',
        'Continuous cold chain logistics maintaining 99.9% milk freshness across 1,000s of kilometers',
        'Product diversification strategies spanning artisan cheeses, ghee, and nutraceutical whey'
      ],
      stats: [
        { val: '18M+', label: 'Farmer Members' },
        { val: '99.9%', label: 'Cold Chain Uptime' },
        { val: '₹60k Cr', label: 'Value Flow' }
      ]
    }
  },
  {
    id: '06',
    anchorId: 'pillar-06',
    shortName: 'Desert Resilience',
    title: 'Alternative Dairying & Arid Innovations',
    scriptSubtitle: 'Wisdom of the Desert Sands: Camel Milk, Therapeutics & 50°C Resilience',
    host: 'ICAR-National Research Centre on Camel',
    location: 'Bikaner, Rajasthan',
    bgTheme: 'bg-[#1D1A18]', // Roasted Dark Espresso
    bgText: 'text-[#F7F3EB]',
    accentColor: '#D83A24',
    image: pillar6Img,
    handwrittenNote: 'Pastoral Bio-Actives & Arid Adaptation',
    poeticStory: [
      "Where others see barren arid sands, indigenous pastoralists see an oasis of resilience.",
      "At ICAR-NRCC in the Thar Desert of Bikaner, camel and donkey milk have broken free from pastoral boundaries into global premium functional foods. Naturally rich in insulin-like peptides, protective immunoglobulins, and zero beta-lactoglobulin allergenicity, camel milk commands a 3x to 5x price premium.",
      "Witness freeze-drying technologies, therapeutic formulations for diabetes and autism, luxury camel milk chocolates, and sustainable desert herd management thriving in 50°C summer heat."
    ],
    fieldReport: {
      domain: 'Arid Functional & Therapeutic Dairy',
      focus: 'Camel Milk Bio-Actives, Freeze-Dried Formulations & Niche Luxury Markets',
      learnings: [
        'Bio-active peptide retention protocols and freeze-drying technology for global export',
        'Pastoralist livelihood integration and climate-proof livestock management in extreme heat',
        'Ultra-premium branding and direct clinical positioning for functional nutrition markets'
      ],
      stats: [
        { val: '3x - 5x', label: 'Market Premium' },
        { val: '52°C', label: 'Heat Tolerance' },
        { val: 'High', label: 'Bioactive Potency' }
      ]
    }
  }
];

export default function CorePillarsDeck({ onOpenApply }) {
  return (
    <div id="core-pillars" className="relative bg-[#1D1A18] text-[#F7F3EB] font-sans antialiased overflow-hidden select-none">
      
      {/* Subtle Tactile Film Grain Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05] bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:12px_12px]" />

      {/* ======================================================== */}
      {/* 1. PROLOGUE SECTION (Vibrant Terracotta Manifesto)       */}
      {/* ======================================================== */}
      <div className="relative bg-[#D83A24] text-[#F7F3EB] pt-24 pb-20 sm:pt-32 sm:pb-28 px-4 sm:px-6 lg:px-8 border-b border-[#B82814] overflow-hidden">
        
        {/* Giant Flowing Script Background Watermark */}
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-15 overflow-hidden">
          <span className="font-script text-[180px] sm:text-[300px] lg:text-[420px] text-white leading-none whitespace-nowrap transform -rotate-6">
            Dairy Yatra
          </span>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 text-center space-y-8">
          
          {/* Top Oval Heritage Stamp */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex flex-col items-center justify-center border border-white/40 rounded-[50%] px-8 py-3 bg-[#D83A24]/60 backdrop-blur-xs shadow-lg"
          >
            <span className="font-typewriter text-[10px] sm:text-xs tracking-[0.3em] uppercase text-white/90">
              estd. 2025 · Dairy Yatra
            </span>
            <span className="font-script text-2xl sm:text-3xl text-white font-bold leading-tight">
              An Indian Story From Soil to Table
            </span>
            <span className="font-typewriter text-[9px] tracking-[0.25em] text-white/80 uppercase">
              15 Days · 5 States · 40 Visionary Seats
            </span>
          </motion.div>

          {/* Emotional Manifesto Heading in Flowing Script & Serif */}
          <div className="space-y-3">
            <span className="font-typewriter text-xs sm:text-sm uppercase tracking-[0.28em] text-white/80 block">
              CORE PILLARS OF LEARNING & INNOVATION
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-[1.1] tracking-tight text-white">
              Every glass of milk has a story.<br />
              <span className="font-script italic font-bold text-4xl sm:text-6xl lg:text-7xl text-[#FFEBD9]">
                Every farm has a legacy.
              </span>
            </h2>
          </div>

          {/* Poetic Narrative Storytelling Manifesto */}
          <div className="space-y-4 max-w-2xl mx-auto text-sm sm:text-base lg:text-lg text-white/90 leading-relaxed font-serif font-light pt-2">
            <p className="font-script text-2xl sm:text-3xl text-[#FFEBD9] leading-snug">
              We all have food memories.
            </p>
            <p>
              The warmth of fresh morning milk in brass tumblers.<br />
              The rich, caramelized aroma of desi ghee simmering in a copper pot.<br />
              The elders gathering around the village chabutra, debating herd genetics and rain cycles.<br />
              Someone saying, <em>"Ek ghoonth aur pi lo"</em>, even when you're already full.
            </p>
            <p className="font-typewriter text-xs sm:text-sm text-white/80 pt-2 uppercase tracking-widest">
              But:
            </p>
            <p className="font-medium text-white text-base sm:text-xl">
              We don't know which practices will become our future until visionary minds step onto the soil.
            </p>
            <p className="font-script text-2xl sm:text-3xl text-[#FFEBD9]">
              Dairy Yatra exists to uncover those breakthroughs today.
            </p>
          </div>

          <div className="pt-4">
            <span className="font-typewriter text-[11px] sm:text-xs uppercase tracking-[0.22em] text-white/75 bg-black/15 px-4 py-1.5 rounded-full border border-white/20">
              6 CORE PILLARS · 6 ENTERPRISE IMMERSIONS · 1 UNBROKEN VALUE CHAIN
            </span>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* 2. THE 6 BESPOKE STORYTELLING SPREADS                    */}
      {/* ======================================================== */}
      <div>
        {STORY_PILLARS.map((pillar, idx) => {
          const isEven = idx % 2 === 1;

          return (
            <div
              key={pillar.id}
              id={pillar.anchorId}
              className={`relative scroll-mt-20 py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8 ${pillar.bgTheme} ${pillar.bgText} border-b border-black/15 overflow-hidden`}
            >
              <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Header Bar with Host Organization */}
                <div className="flex items-center justify-between border-b border-current/20 pb-4 mb-10 sm:mb-16">
                  {/* Host Organization Stamp */}
                  <div className="flex items-center space-x-2 font-typewriter text-xs uppercase tracking-wider bg-black/10 border border-current/20 px-3.5 py-1.5 rounded-md">
                    <Building2 className="w-3.5 h-3.5 text-[#D83A24]" />
                    <span className="font-bold">{pillar.host}</span>
                    <span className="opacity-50">·</span>
                    <span className="opacity-80">{pillar.location}</span>
                  </div>
                </div>

                {/* Main Spread Grid: Documentary Photo + Artisanal Story + Field Report */}
                <div className={`grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start ${isEven ? 'lg:grid-flow-dense' : ''}`}>
                  
                  {/* ======================================================== */}
                  {/* COLUMN 1: VINTAGE DOCUMENTARY PHOTOGRAPHY                */}
                  {/* ======================================================== */}
                  <div className={`lg:col-span-5 ${isEven ? 'lg:col-start-8' : ''}`}>
                    <div className="relative group">
                      
                      {/* Photo Frame with Vintage Paper Border */}
                      <div className="relative bg-[#FAF6EE] p-3 sm:p-4 rounded-xl shadow-[0_20px_50px_rgba(0,0,0,0.35)] border border-black/10 transform rotate-[-1deg] group-hover:rotate-0 transition-transform duration-500">
                        
                        {/* The High-Resolution Image */}
                        <div className="relative aspect-[4/3] sm:aspect-[3/2] lg:aspect-[4/5] rounded-lg overflow-hidden bg-slate-900">
                          <img
                            src={pillar.image}
                            alt={pillar.title}
                            className="w-full h-full object-cover object-center filter brightness-[0.92] contrast-[1.05] group-hover:scale-105 transition-transform duration-1000"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                        </div>

                        {/* Handwritten Scribing Note under Photo (Like vintage photo album) */}
                        <div className="pt-3 flex items-center justify-between">
                          <span className="font-script text-xl sm:text-2xl text-[#1D1A18] font-bold">
                            {pillar.handwrittenNote}
                          </span>
                          <span className="font-typewriter text-[9px] uppercase tracking-widest text-[#787D3E] font-bold">
                            DAIRY YATRA 2025
                          </span>
                        </div>

                      </div>

                      {/* Stamped Oval Seal floating on edge */}
                      <div className="absolute -top-4 -left-4 z-20 bg-[#D83A24] text-white border-2 border-[#FAF6EE] rounded-[50%] w-16 h-16 sm:w-20 sm:h-20 flex flex-col items-center justify-center text-center shadow-xl transform rotate-[-12deg]">
                        <span className="font-typewriter text-[8px] uppercase tracking-tighter leading-none">
                          FIELD
                        </span>
                        <span className="font-script text-base sm:text-lg font-bold leading-tight">
                          {pillar.id}
                        </span>
                        <span className="font-typewriter text-[7px] uppercase tracking-widest">
                          LAB
                        </span>
                      </div>

                    </div>
                  </div>

                  {/* ======================================================== */}
                  {/* COLUMN 2: ARTISANAL STORYTELLING & FIELD REPORT          */}
                  {/* ======================================================== */}
                  <div className={`lg:col-span-7 space-y-8 ${isEven ? 'lg:col-start-1' : ''}`}>
                    
                    {/* Pillar Title & Flowing Subtitle */}
                    <div className="space-y-2">
                      <span className="font-typewriter text-xs uppercase tracking-[0.25em] opacity-75 block">
                        IMMERSION FOCUS
                      </span>
                      <h3 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-[1.08] tracking-tight">
                        {pillar.title}
                      </h3>
                      <p className="font-script text-2xl sm:text-3xl text-[#FFEBD9] font-normal pt-1">
                        {pillar.scriptSubtitle}
                      </p>
                    </div>

                    {/* Poetic Narrative Storytelling Paragraphs */}
                    <div className="space-y-4 font-serif text-base sm:text-lg leading-relaxed font-light opacity-95">
                      {pillar.poeticStory.map((para, pIdx) => (
                        <p key={pIdx}>{para}</p>
                      ))}
                    </div>

                    {/* Field Report Ledger Box (Typewriter / Menu Card Style) */}
                    <div className="bg-black/15 border border-current/25 rounded-2xl p-6 sm:p-8 space-y-6 backdrop-blur-xs">
                      
                      <div className="flex items-center justify-between border-b border-current/20 pb-3">
                        <span className="font-typewriter text-xs uppercase tracking-[0.22em] font-bold">
                          FIELD LAB CURRICULUM REPORT
                        </span>
                        <span className="font-typewriter text-[10px] uppercase opacity-75">
                          {pillar.fieldReport.domain}
                        </span>
                      </div>

                      {/* 3 Bulleted Entrepreneurial Learnings */}
                      <div className="space-y-3">
                        <span className="font-typewriter text-[11px] uppercase tracking-wider opacity-85 block font-bold">
                          Key Entrepreneurial Learnings:
                        </span>
                        {pillar.fieldReport.learnings.map((item, lIdx) => (
                          <div key={lIdx} className="flex items-start space-x-3 text-xs sm:text-sm font-sans leading-relaxed">
                            <CheckCircle2 className="w-4 h-4 text-[#FFEBD9] shrink-0 mt-0.5" />
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>

                      {/* Quantitative Impact Metric Badges (Vintage Menu / Ledger format) */}
                      <div className="grid grid-cols-3 gap-3 pt-4 border-t border-current/20">
                        {pillar.fieldReport.stats.map((stat, sIdx) => (
                          <div key={sIdx} className="text-center p-2.5 bg-black/15 rounded-lg border border-current/15">
                            <span className="font-typewriter text-lg sm:text-2xl font-bold text-[#FFEBD9] block">
                              {stat.val}
                            </span>
                            <span className="font-typewriter text-[9px] uppercase tracking-wider opacity-80 block mt-0.5 leading-tight">
                              {stat.label}
                            </span>
                          </div>
                        ))}
                      </div>

                    </div>

                  </div>

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* ======================================================== */}
      {/* 3. EPILOGUE SPREAD & GRAND INVITATION                    */}
      {/* ======================================================== */}
      <div className="relative bg-[#D83A24] text-[#F7F3EB] py-24 sm:py-32 px-4 sm:px-6 lg:px-8 border-t border-[#B82814] text-center overflow-hidden">
        
        {/* Large Background Calligraphy Script */}
        <div className="absolute inset-0 pointer-events-none select-none flex items-center justify-center opacity-10">
          <span className="font-script text-[180px] sm:text-[320px] text-white whitespace-nowrap">
            Dairy Yatra 2025
          </span>
        </div>

        <div className="max-w-4xl mx-auto relative z-10 space-y-8">
          
          <div className="inline-flex items-center space-x-2 font-typewriter text-xs uppercase tracking-[0.3em] bg-black/20 border border-white/30 px-5 py-2 rounded-full text-[#FFEBD9]">
            <Sparkles className="w-4 h-4 text-[#FFEBD9]" />
            <span>THE 15-DAY FIELD EXPEDITION</span>
          </div>

          <h3 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal leading-tight text-white">
            Because tomorrow's dairy revolution<br />
            <span className="font-script italic font-bold text-4xl sm:text-6xl lg:text-7xl text-[#FFEBD9]">
              begins in the field today.
            </span>
          </h3>

          <p className="font-serif text-base sm:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed font-light">
            Traverse 5 states, inspect groundbreaking technology in action, and join an elite cohort of 40 entrepreneurs redefining the future of Indian agriculture.
          </p>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={onOpenApply}
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-3 bg-white hover:bg-[#FFEBD9] text-[#D83A24] font-typewriter font-bold text-sm tracking-[0.2em] uppercase px-10 py-4.5 rounded-xl transition-all duration-300 shadow-[0_10px_35px_rgba(0,0,0,0.3)] hover:scale-105 cursor-pointer"
            >
              <span>Expression of Interest</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          <div className="pt-4">
            <span className="font-typewriter text-[11px] uppercase tracking-[0.25em] text-white/70">
              TAMIL NADU · KARNATAKA · MAHARASHTRA · GUJARAT · RAJASTHAN
            </span>
          </div>

        </div>

      </div>

    </div>
  );
}
