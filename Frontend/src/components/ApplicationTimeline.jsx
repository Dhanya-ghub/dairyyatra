import React, { useState } from 'react';
import { ArrowUpRight, ArrowRight, Calendar, CheckCircle2, Clock, ShieldCheck, X, Users, MapPin, Award, ChevronDown, ChevronUp } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

export default function ApplicationTimeline({ onOpenApply }) {
  const [selectedCohortModal, setSelectedCohortModal] = useState(null);
  const [showRoundsBreakdown, setShowRoundsBreakdown] = useState(false);

  const cohorts = [
    {
      id: 'cohort-03',
      number: 'COHORT 03',
      edition: 'Upcoming Edition III',
      badge: 'UPCOMING',
      period: 'February 2027',
      appStatus: 'ACTIVE',
      admissionStatus: 'Admissions Open',
      isActive: true,
      actionType: 'apply',
      actionText: 'APPLY NOW',
      rounds: [
        { round: 'Round 1', status: 'CLOSED', detail: 'Early priority phase closed' },
        { round: 'Round 2', status: 'CLOSED', detail: 'Standard admissions window closed' },
        { round: 'Current Round', status: 'ACTIVE', detail: 'Final application window open for February 2027' },
      ],
    },
    {
      id: 'cohort-02',
      number: 'COHORT 02',
      edition: 'Edition II',
      badge: null,
      period: 'COMPLETED',
      appStatus: 'CLOSED',
      admissionStatus: 'COHORT COMPLETED',
      isActive: false,
      actionType: 'view',
      actionText: 'VIEW COHORT',
      summary: {
        title: 'Dairy Yatra Edition II (Cohort 02)',
        status: 'Successfully Completed',
        participants: '40 Selected Dairy Entrepreneurs',
        states: 'Tamil Nadu, Karnataka, Maharashtra, Gujarat, Rajasthan',
        highlights: [
          'Advanced exposure to Total Mixed Ration (TMR) and camel milk value chains',
          'Cross-state cooperative frameworks & grassroots farmer producer organizations',
          'Collaborative venture pitches and rural enterprise syndicates formed',
        ],
      },
    },
    {
      id: 'cohort-01',
      number: 'COHORT 01',
      edition: 'Inaugural Journey',
      badge: null,
      period: 'COMPLETED',
      appStatus: 'CLOSED',
      admissionStatus: 'COHORT COMPLETED',
      isActive: false,
      actionType: 'view',
      actionText: 'VIEW COHORT',
      summary: {
        title: 'Dairy Yatra Edition I (Cohort 01)',
        status: 'Successfully Completed',
        participants: '40 Rural & Agri-Tech Founders',
        states: 'Tamil Nadu, Karnataka, Maharashtra, Gujarat, Rajasthan',
        highlights: [
          'First cross-country train immersion traversing 6,000+ km',
          'Field dialogues at Amul Anand, Akshayakalpa, and BAIF genetics centers',
          'Publication of the inaugural Yatra Coffee Table Book & Field Observations',
        ],
      },
    },
  ];

  return (
    <section id="timeline" className="py-20 sm:py-28 bg-[#F2EFE7] text-[#172738] relative border-t border-[#C8DFDB] overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <ScrollReveal animation="fade-down" duration={700}>
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#3368A0]/10 text-[#3368A0] text-xs font-bold uppercase tracking-widest mb-4 border border-[#3368A0]/20">
              <Clock className="w-3.5 h-3.5" />
              <span>Admissions & Rounds</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#172738] tracking-tight mb-4 leading-tight">
              Application Timeline & Process
            </h2>

            <p className="font-sans text-base sm:text-lg text-[#4E657D] leading-relaxed max-w-2xl mx-auto">
              Applications for the next Dairy Yatra cohort open in February. Follow the application rounds below and take the first step towards joining the journey.
            </p>
          </div>
        </ScrollReveal>

        {/* Timeline Table Container */}
        <ScrollReveal animation="fade-up" duration={800} delay={150}>
          <div className="bg-white rounded-2xl sm:rounded-3xl border border-[#C8DFDB] shadow-xl overflow-hidden">
            
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left border-collapse">
                {/* Dark Blue Table Header */}
                <thead>
                  <tr className="bg-[#142538] text-[#F2EFE7] text-xs font-semibold uppercase tracking-wider">
                    <th scope="col" className="py-4 px-6 sm:px-8">Cohort</th>
                    <th scope="col" className="py-4 px-6">Application Period</th>
                    <th scope="col" className="py-4 px-6 text-center">Application Status</th>
                    <th scope="col" className="py-4 px-6">Admission Status</th>
                    <th scope="col" className="py-4 px-6 sm:px-8 text-right">Action</th>
                  </tr>
                </thead>

                {/* Table Body - 3 Distinct Cohorts */}
                <tbody className="divide-y divide-[#C8DFDB]/40 font-sans">
                  {cohorts.map((cohort) => (
                    <tr
                      key={cohort.id}
                      className={`transition-colors duration-200 ${
                        cohort.isActive
                          ? 'bg-[#F2EFE7]/60 hover:bg-[#F2EFE7] relative'
                          : 'bg-white hover:bg-[#F2EFE7]/30 opacity-80 hover:opacity-100'
                      }`}
                    >
                      {/* Cohort Column */}
                      <td className="py-6 px-6 sm:px-8">
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`font-serif text-lg font-bold tracking-tight ${
                              cohort.isActive ? 'text-[#172738]' : 'text-[#4E657D]'
                            }`}
                          >
                            {cohort.number}
                          </span>
                          {cohort.badge && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#3368A0] text-white shadow-xs">
                              {cohort.badge}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Application Period */}
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${cohort.isActive ? 'text-[#3368A0]' : 'text-stone-400'}`} />
                          <span
                            className={`text-sm sm:text-base tracking-wide ${
                              cohort.isActive
                                ? 'font-bold text-[#172738]'
                                : 'font-medium text-[#4E657D] uppercase text-xs'
                            }`}
                          >
                            {cohort.period}
                          </span>
                        </div>
                      </td>

                      {/* Application Status */}
                      <td className="py-6 px-6 text-center">
                        {cohort.isActive ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-sm">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                            {cohort.appStatus}
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-rose-50/80 text-rose-700 border border-rose-200/70">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                            {cohort.appStatus}
                          </span>
                        )}
                      </td>

                      {/* Admission Status */}
                      <td className="py-6 px-6">
                        <div className="flex items-center gap-2">
                          {cohort.isActive ? (
                            <span className="font-bold text-[#172738] flex items-center gap-1.5 text-sm sm:text-base">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                              {cohort.admissionStatus}
                            </span>
                          ) : (
                            <span className="text-xs uppercase tracking-wider font-semibold text-[#4E657D]">
                              {cohort.admissionStatus}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-6 px-6 sm:px-8 text-right">
                        {cohort.actionType === 'apply' ? (
                          <div className="inline-flex flex-col items-end gap-1">
                            <button
                              onClick={onOpenApply}
                              className="group inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-[#3368A0] hover:bg-[#234974] text-white text-xs sm:text-sm font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-300 hover:scale-[1.03] active:scale-95 cursor-pointer"
                            >
                              <span>{cohort.actionText}</span>
                              <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                            </button>
                            <button
                              onClick={() => setShowRoundsBreakdown(!showRoundsBreakdown)}
                              className="text-[11px] text-[#4E657D] hover:text-[#3368A0] font-medium flex items-center gap-1 transition-colors pt-1 cursor-pointer"
                            >
                              <span>View application rounds</span>
                              {showRoundsBreakdown ? (
                                <ChevronUp className="w-3 h-3" />
                              ) : (
                                <ChevronDown className="w-3 h-3" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedCohortModal(cohort)}
                            className="group inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-[#F2EFE7] hover:bg-[#E5E1D5] text-[#172738] border border-[#C8DFDB] text-xs font-semibold tracking-wider transition-all duration-200 cursor-pointer"
                          >
                            <span>{cohort.actionText}</span>
                            <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Expandable Cohort 03 Rounds Breakdown (Desktop & Tablet) */}
            {showRoundsBreakdown && (
              <div className="hidden md:block bg-[#F2EFE7]/80 border-t border-[#C8DFDB] px-8 py-5 transition-all animate-fadeIn">
                <div className="max-w-3xl">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs uppercase font-bold text-[#172738] tracking-wider">
                      Cohort 03 Application Rounds (February 2027 Cycle)
                    </span>
                    <button
                      onClick={() => setShowRoundsBreakdown(false)}
                      className="text-xs text-[#4E657D] hover:text-[#172738] cursor-pointer"
                    >
                      Hide &times;
                    </button>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-white rounded-lg border border-[#C8DFDB] opacity-60">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#4E657D]">Round 1</span>
                        <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">CLOSED</span>
                      </div>
                      <p className="text-[11px] text-[#4E657D]">Early priority phase closed</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-[#C8DFDB] opacity-60">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#4E657D]">Round 2</span>
                        <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded">CLOSED</span>
                      </div>
                      <p className="text-[11px] text-[#4E657D]">Standard admissions closed</p>
                    </div>
                    <div className="p-3 bg-white rounded-lg border border-[#66A3BF] ring-1 ring-[#66A3BF]/30 shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-[#172738]">Current Round</span>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          ACTIVE
                        </span>
                      </div>
                      <p className="text-[11px] text-[#4E657D] font-medium">Final cycle open for Feb 2027</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Mobile Stacked Cards View */}
            <div className="block md:hidden p-4 space-y-4">
              {cohorts.map((cohort) => (
                <div
                  key={cohort.id}
                  className={`p-5 rounded-xl border transition-all ${
                    cohort.isActive
                      ? 'bg-[#F2EFE7] border-[#3368A0] shadow-md ring-1 ring-[#3368A0]/30'
                      : 'bg-white border-[#C8DFDB] opacity-85'
                  }`}
                >
                  {/* Card Top: Cohort & Status */}
                  <div className="flex items-center justify-between gap-2 pb-3 mb-3 border-b border-[#C8DFDB]/60">
                    <div className="flex items-center gap-2">
                      <span className={`font-serif text-lg font-bold ${cohort.isActive ? 'text-[#172738]' : 'text-[#4E657D]'}`}>
                        {cohort.number}
                      </span>
                      {cohort.badge && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#3368A0] text-white">
                          {cohort.badge}
                        </span>
                      )}
                    </div>

                    {cohort.isActive ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        {cohort.appStatus}
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold uppercase tracking-wider bg-rose-50/80 text-rose-700 border border-rose-200/70">
                        <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                        {cohort.appStatus}
                      </span>
                    )}
                  </div>

                  {/* Card Details Grid */}
                  <div className="space-y-2 mb-4 text-xs">
                    <div className="flex items-center justify-between text-[#4E657D]">
                      <span className="text-[#4E657D] font-medium">Application Period:</span>
                      <span className={`font-semibold ${cohort.isActive ? 'text-[#172738] text-sm' : 'text-[#4E657D] uppercase'}`}>
                        {cohort.period}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[#4E657D]">
                      <span className="text-[#4E657D] font-medium">Admission Status:</span>
                      <span className={`font-bold ${cohort.isActive ? 'text-emerald-700' : 'text-[#4E657D] uppercase text-[11px]'}`}>
                        {cohort.admissionStatus}
                      </span>
                    </div>
                  </div>

                  {/* Card Action */}
                  <div>
                    {cohort.actionType === 'apply' ? (
                      <div className="space-y-2">
                        <button
                          onClick={onOpenApply}
                          className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-full bg-[#3368A0] hover:bg-[#234974] text-white text-xs font-bold uppercase tracking-wider shadow-md active:scale-95 transition-all cursor-pointer"
                        >
                          <span>{cohort.actionText}</span>
                          <ArrowUpRight className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowRoundsBreakdown(!showRoundsBreakdown)}
                          className="w-full text-center text-[11px] text-[#4E657D] font-medium py-1"
                        >
                          {showRoundsBreakdown ? 'Hide rounds breakdown' : 'View application rounds breakdown'}
                        </button>
                        {showRoundsBreakdown && (
                          <div className="p-3 bg-white rounded-lg border border-[#C8DFDB] space-y-2 text-[11px]">
                            <div className="flex justify-between text-[#4E657D]">
                              <span>Round 1</span>
                              <span className="font-semibold text-rose-600">CLOSED</span>
                            </div>
                            <div className="flex justify-between text-[#4E657D]">
                              <span>Round 2</span>
                              <span className="font-semibold text-rose-600">CLOSED</span>
                            </div>
                            <div className="flex justify-between text-[#172738] font-medium pt-1 border-t border-[#C8DFDB]">
                              <span>Current Round</span>
                              <span className="font-bold text-emerald-700">ACTIVE</span>
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <button
                        onClick={() => setSelectedCohortModal(cohort)}
                        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-full bg-[#F2EFE7] hover:bg-[#E5E1D5] text-[#172738] border border-[#C8DFDB] text-xs font-semibold tracking-wider transition-all cursor-pointer"
                      >
                        <span>{cohort.actionText}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Bottom Footer Information */}
            <div className="px-6 py-4 bg-[#F2EFE7]/80 border-t border-[#C8DFDB] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#4E657D]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#3368A0] flex-shrink-0" />
                <span>Selected participants receive rolling interview invites upon form verification.</span>
              </div>
              <span className="font-semibold text-[#172738]">
                Cohort Limit: 40 Entrepreneurs
              </span>
            </div>

          </div>
        </ScrollReveal>

      </div>

      {/* View Completed Cohort Details Modal */}
      {selectedCohortModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setSelectedCohortModal(null)}
        >
          <div 
            className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#C8DFDB] relative animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedCohortModal(null)}
              className="absolute top-4 right-4 p-2 rounded-full text-[#4E657D] hover:text-[#172738] hover:bg-[#F2EFE7] transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#C8DFDB]/50 text-[#172738] text-xs font-semibold uppercase tracking-wider mb-4 border border-[#C8DFDB]">
              <Award className="w-3.5 h-3.5 text-[#3368A0]" />
              <span>{selectedCohortModal.summary.status}</span>
            </div>

            <h3 className="font-serif text-2xl font-bold text-[#172738] mb-2">
              {selectedCohortModal.summary.title}
            </h3>

            <div className="space-y-3 py-4 border-y border-[#C8DFDB]/60 my-4 text-xs sm:text-sm">
              <div className="flex items-center gap-2 text-[#172738]">
                <Users className="w-4 h-4 text-[#3368A0] flex-shrink-0" />
                <span className="font-medium">Participants:</span>
                <span className="text-[#4E657D]">{selectedCohortModal.summary.participants}</span>
              </div>
              <div className="flex items-center gap-2 text-[#172738]">
                <MapPin className="w-4 h-4 text-[#66A3BF] flex-shrink-0" />
                <span className="font-medium">Route:</span>
                <span className="text-[#4E657D]">{selectedCohortModal.summary.states}</span>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#4E657D] mb-2">
                Journey Highlights
              </h4>
              <ul className="space-y-2">
                {selectedCohortModal.summary.highlights.map((h, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs sm:text-sm text-[#4E657D]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#3368A0] mt-1.5 flex-shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-[#4E657D]">Archived Cohort Record</span>
              <button
                onClick={() => setSelectedCohortModal(null)}
                className="px-5 py-2 rounded-full bg-[#3368A0] hover:bg-[#234974] text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
