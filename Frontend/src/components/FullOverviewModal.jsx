import React, { useState } from 'react';
import { X, Search, MapPin, Train, Bus, Plane, Building2, Download } from 'lucide-react';
import { FULL_ITINERARY, HOST_ORGANIZATIONS } from '../data/yatraData';
import SlidingTabs from './SlidingTabs';

export default function FullOverviewModal({ isOpen, onClose, onOpenApply, onSelectStopFromItinerary }) {
  const [activeTab, setActiveTab] = useState('schedule'); // 'schedule' | 'hosts'
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedState, setSelectedState] = useState('All');

  if (!isOpen) return null;

  const states = ['All', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Gujarat', 'Rajasthan'];

  const filteredItinerary = FULL_ITINERARY.filter((item) => {
    const matchesState =
      selectedState === 'All' || item.location.toLowerCase().includes(selectedState.toLowerCase());
    const matchesSearch =
      item.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.objective.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesSearch;
  });

  const getTransportIcon = (transportText) => {
    if (transportText.includes('Flight')) return <Plane className="w-4 h-4 text-sky-600" />;
    if (transportText.includes('Train')) return <Train className="w-4 h-4 text-emerald-700" />;
    return <Bus className="w-4 h-4 text-amber-700" />;
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-xl flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white text-[#172738] rounded-3xl overflow-hidden shadow-2xl border border-[#C8DFDB] my-auto flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="bg-[#142538] text-white p-6 sm:p-8 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <img src="/logo.jpeg" alt="Logo" className="h-10 w-auto rounded-lg bg-white p-1" />
            <div>
              <span className="text-xs uppercase tracking-widest text-[#C8DFDB] font-bold block">
                Comprehensive Program Reference
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
                Dairy Yatra • 15-Day Immersion
              </h2>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white hover:text-[#142538] transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation with Transitions.dev Sliding Tabs */}
        <div className="bg-[#F2EFE7] px-6 py-3 border-b border-[#C8DFDB] flex items-center shrink-0 overflow-x-auto no-scrollbar">
          <SlidingTabs
            tabs={[
              { id: 'schedule', label: '15-Day Schedule Matrix' },
              { id: 'hosts', label: `Host Institutions (${HOST_ORGANIZATIONS.length})` }
            ]}
            activeId={activeTab}
            onChange={(id) => setActiveTab(id)}
            className="bg-[#EAE5D9] p-1 border border-[#C8DFDB]"
            tabClassName="px-4 py-1.5 text-xs sm:text-sm font-semibold h-9"
            pillClassName="h-9 shadow-md bg-white text-[#172738]"
          />
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 sm:p-8 overflow-y-auto flex-1 space-y-6">
          
          {/* TAB 1: 15-Day Schedule */}
          {activeTab === 'schedule' && (
            <div className="space-y-6">
              {/* Search & State filter */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E657D]" />
                  <input
                    type="text"
                    placeholder="Search city, host, or keyword..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#F2EFE7] border border-[#C8DFDB] rounded-xl pl-10 pr-4 py-2 text-xs text-[#172738] focus:outline-none focus:ring-2 focus:ring-[#3368A0]"
                  />
                </div>

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
                  {states.map((st) => (
                    <button
                      key={st}
                      onClick={() => setSelectedState(st)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                        selectedState === st
                          ? 'bg-[#3368A0] text-white shadow-sm'
                          : 'bg-[#F2EFE7] text-[#4E657D] hover:text-[#172738] border border-[#C8DFDB]'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Table / List */}
              <div className="divide-y divide-[#C8DFDB]/50 rounded-2xl border border-[#C8DFDB] overflow-hidden bg-[#F2EFE7]/40">
                {filteredItinerary.map((item) => (
                  <div
                    key={item.day}
                    className="p-4 hover:bg-white transition-colors flex flex-col md:flex-row md:items-center justify-between gap-3"
                  >
                    <div className="flex items-start gap-3">
                      <span className="w-12 h-12 rounded-xl bg-[#3368A0] text-white font-bold flex flex-col items-center justify-center shrink-0 shadow-sm text-xs">
                        <span>Day</span>
                        <span className="text-base font-serif leading-none">{item.day}</span>
                      </span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-serif font-bold text-base text-[#172738]">
                            {item.institution}
                          </span>
                          <span className="text-[10px] bg-[#E5E1D5] px-2 py-0.5 rounded-md font-bold text-[#4E657D]">
                            {item.theme}
                          </span>
                        </div>
                        <p className="text-xs text-[#4E657D] mt-0.5 flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#3368A0]" /> {item.location} • {item.date}
                        </p>
                        <p className="text-xs text-[#172738]/80 mt-1 font-sans">
                          {item.objective}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <span className="flex items-center gap-1 text-[11px] font-bold text-[#4E657D] bg-white px-2.5 py-1 rounded-lg border border-[#C8DFDB]">
                        {getTransportIcon(item.transport)} {item.transport}
                      </span>
                      <button
                        onClick={() => {
                          onClose();
                          onSelectStopFromItinerary(item.day);
                        }}
                        className="px-3 py-1 bg-[#3368A0]/10 hover:bg-[#3368A0] hover:text-white text-[#3368A0] rounded-lg text-xs font-bold transition-colors cursor-pointer"
                      >
                        View Map
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Host Organizations */}
          {activeTab === 'hosts' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {HOST_ORGANIZATIONS.map((host) => (
                <div
                  key={host.id}
                  className="p-5 rounded-2xl bg-[#F2EFE7]/50 border border-[#C8DFDB] flex flex-col justify-between space-y-3"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-[#3368A0]" />
                        <h4 className="font-serif text-lg font-bold text-[#172738]">{host.name}</h4>
                      </div>
                      <span className="text-[10px] font-extrabold bg-[#3368A0] text-white px-2.5 py-0.5 rounded-full">
                        {host.days}
                      </span>
                    </div>
                    <p className="text-xs text-[#4E657D] flex items-center gap-1 mt-1 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-[#3368A0]" /> {host.location}
                    </p>
                    <p className="text-xs text-[#172738]/80 mt-2.5 leading-relaxed">
                      {host.description}
                    </p>
                  </div>

                  <div className="pt-2 border-t border-[#C8DFDB]/60 flex flex-wrap items-center gap-1.5">
                    {host.highlights.map((hl, i) => (
                      <span key={i} className="text-[10px] bg-white px-2 py-0.5 rounded-md border border-[#C8DFDB] text-[#4E657D] font-bold">
                        {hl}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-4 sm:p-6 bg-[#F2EFE7] border-t border-[#C8DFDB] flex flex-wrap items-center justify-between gap-4 shrink-0">
          <a
            href="/Dairy_Yatra_2025_Brochure.pdf"
            download="Dairy_Yatra_2025_Brochure.pdf"
            className="flex items-center gap-1.5 text-xs font-bold text-[#3368A0] hover:underline"
          >
            <Download className="w-4 h-4" /> Download Official Brochure PDF
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-bold text-[#4E657D] hover:bg-[#C8DFDB]/40 cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onOpenApply();
              }}
              className="bg-[#3368A0] hover:bg-[#234974] text-white px-5 py-2 rounded-xl text-xs font-bold shadow-md transition-transform hover:scale-105 cursor-pointer"
            >
              Apply for Cohort
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
