import React, { useState } from 'react';
import { PACKING_ITEMS } from '../data/yatraData';
import { CheckSquare, Square, ShieldAlert, Utensils, Thermometer, PhoneCall, BookOpen, Sparkles } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function PreparationGuide() {
  const [checkedItems, setCheckedItems] = useState({ p1: true, p2: true, p7: true, p9: true });

  const toggleItem = (id) => {
    setCheckedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const packedCount = Object.values(checkedItems).filter(Boolean).length;
  const totalCount = PACKING_ITEMS.length;
  const progressPercent = Math.round((packedCount / totalCount) * 100);

  const advisoryCards = [
    {
      icon: Thermometer,
      iconBg: 'bg-[#3368A0]/10 text-[#3368A0]',
      title: 'Weather & Climate',
      desc: 'Expect varied conditions across 5 states. While winter is pleasant, North Indian regions like Bikaner & Jaipur can drop to 10°C. Pack layers accordingly.'
    },
    {
      icon: Utensils,
      iconBg: 'bg-[#66A3BF]/15 text-[#3368A0]',
      title: 'Utensils & Food',
      desc: 'Basic hygienic vegetarian meals provided on train. Strict Zero Plastic Policy: Bring your own reusable spoon and tea/coffee mug!'
    },
    {
      icon: BookOpen,
      iconBg: 'bg-[#C8DFDB] text-[#142538]',
      title: 'Documentation & Book',
      desc: '"Writing is lighter than memory." Yatris’ daily notes, sketches, and photos will be compiled into a large-format published Coffee Table Book.'
    }
  ];

  return (
    <section id="preparation" className="py-20 bg-white text-[#172738] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <ScrollReveal animation="fade-down" duration={700}>
          <div className="max-w-3xl mb-16">
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-[2px] bg-[#3368A0]" />
              <span className="text-xs uppercase font-bold text-[#3368A0] tracking-widest">
                Traveler Guidelines
              </span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#172738] mb-4">
              Preparation for the Journey
            </h2>
            <p className="text-base text-[#4E657D] leading-relaxed">
              Dairy Yatra passes through diverse physical and cultural landscapes. Mental and physical readiness will ensure you maximize your 15-day learning adventure.
            </p>
          </div>
        </ScrollReveal>

        {/* Advisory Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {advisoryCards.map((card, idx) => {
            const Icon = card.icon;
            return (
              <ScrollReveal
                key={idx}
                animation="fade-up"
                delay={idx * 150}
                duration={650}
                className="h-full"
              >
                <div className="bg-[#F2EFE7] rounded-3xl p-6 border border-[#C8DFDB] hover:border-[#3368A0] hover:shadow-lg transition-all duration-300 h-full transform hover:-translate-y-1.5 shadow-sm">
                  <div className={`w-10 h-10 rounded-xl ${card.iconBg} flex items-center justify-center mb-4 transition-transform duration-300 group-hover:scale-110 shadow-xs`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#172738] mb-2">{card.title}</h3>
                  <p className="text-xs sm:text-sm text-[#4E657D] leading-relaxed">
                    {card.desc}
                  </p>
                </div>
              </ScrollReveal>
            );
          })}
        </div>

        {/* Interactive Packing Checklist */}
        <ScrollReveal animation="fade-up" delay={200} duration={800}>
          <div className="bg-[#142538] text-white rounded-3xl p-6 sm:p-10 shadow-2xl border border-white/10">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 pb-6 border-b border-white/15">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C8DFDB] font-bold block mb-1">
                  Interactive Traveler Tool
                </span>
                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                  Essential Packing Checklist
                </h3>
              </div>

              {/* Live Progress Bar */}
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-[220px] border border-white/10">
                <div className="flex items-center justify-between text-xs font-bold mb-2">
                  <span className="text-[#C8DFDB]">Packing Readiness</span>
                  <span>{progressPercent}% ({packedCount}/{totalCount})</span>
                </div>
                <div className="w-full h-2.5 bg-white/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#66A3BF] via-[#C8DFDB] to-[#3368A0] transition-all duration-500 rounded-full shadow-[0_0_8px_rgba(102,163,191,0.6)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Checklist Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {PACKING_ITEMS.map((item) => {
                const isChecked = Boolean(checkedItems[item.id]);
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleItem(item.id)}
                    className={`p-4 rounded-2xl border transition-all duration-300 cursor-pointer flex items-start gap-3 transform hover:scale-[1.02] active:scale-[0.98] ${
                      isChecked
                        ? 'bg-[#3368A0]/30 border-[#66A3BF] text-white shadow-md'
                        : 'bg-white/5 border-white/10 text-white/70 hover:bg-white/10 hover:border-white/20'
                    }`}
                  >
                    <button className="mt-0.5 text-[#66A3BF] shrink-0 transition-transform duration-200 hover:scale-110" aria-label={isChecked ? `Uncheck ${item.item}` : `Check ${item.item}`}>
                      {isChecked ? (
                        <CheckSquare className="w-5 h-5 fill-[#66A3BF] text-[#142538]" />
                      ) : (
                        <Square className="w-5 h-5 text-white/40" />
                      )}
                    </button>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-extrabold text-[#C8DFDB] block">
                        {item.category} {item.mandatory && '• Mandatory'}
                      </span>
                      <span className={`text-sm font-medium transition-all duration-200 ${isChecked ? 'line-through opacity-80 text-[#F2EFE7]/90' : ''}`}>
                        {item.item}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </ScrollReveal>

      </div>
    </section>
  );
}
