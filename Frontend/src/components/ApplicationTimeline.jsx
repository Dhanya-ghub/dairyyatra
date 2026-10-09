import React from 'react';
import { Clock, CalendarRange, FileText, Upload, MonitorPlay, Rocket, Trophy, CheckCircle2, Award } from 'lucide-react';
import ScrollReveal from './ScrollReveal';

const milestones = [
  { date: '10 October 2026', dateTime: '2026-10-10', title: 'Announcement' },
  { date: '12 October 2026', dateTime: '2026-10-12', title: 'Expression of Interest (EOI) Opens' },
  { date: '12 November 2026', dateTime: '2026-11-12', title: 'EOI Closes' },
  { date: '15 November 2026', dateTime: '2026-11-15', title: 'Cohort Selection Announcement' },
  { date: '25 November 2026', dateTime: '2026-11-25', title: 'Payment Completion' },
  { date: '19–20 December 2026', dateTime: '2026-12-19', title: 'Scientific Dairy Farm Management Workshop' },
  { date: '26 January 2027', dateTime: '2027-01-26', title: 'Dairy Yatra 2027 Launch' },
  { date: '1 February 2027', dateTime: '2027-02-01', title: 'Journey Begins' },
  { date: '15 February 2027', dateTime: '2027-02-15', title: 'Journey Ends' },
];

const milestoneIcons = [CalendarRange, FileText, Upload, MonitorPlay, Rocket, Award, CheckCircle2, Trophy, Trophy];

export default function ApplicationTimeline() {
  return (
    <section
      id="timeline"
      className="application-timeline relative overflow-hidden border-t border-[#C8DFDB] bg-[#F2EFE7] py-16 text-[#172738] sm:py-20"
    >
      <div className="application-timeline__inner relative z-10 mx-auto max-w-[90rem] px-4 sm:px-6 lg:px-8">
        <ScrollReveal animation="fade-down" duration={700}>
          <div className="application-timeline__heading mx-auto mb-10 max-w-3xl text-center sm:mb-14">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#3368A0]/20 bg-[#3368A0]/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-widest text-[#3368A0]">
              <Clock className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Dairy Yatra 2027</span>
            </div>
            <h2 className="font-serif text-3xl font-bold leading-tight tracking-tight text-[#172738] sm:text-4xl lg:text-5xl">
              Application Timeline &amp; Process
            </h2>
          </div>
        </ScrollReveal>

        <ScrollReveal animation="fade-up" duration={800} delay={150}>
          <div className="application-timeline__board rounded-[1.5rem] border border-[#C8DFDB] bg-[#EEF4F0] shadow-[0_20px_40px_rgba(19,43,57,0.08)]">
            <ol aria-label="Dairy Yatra 2027 milestones" className="application-timeline__list">
              {milestones.map((milestone, index) => {
                const Icon = milestoneIcons[index];

                return (
                  <li key={milestone.dateTime} className="application-timeline__item">
                    <span className="application-timeline__number" aria-hidden="true">
                      {index + 1}
                    </span>
                    <div className="application-timeline__card">
                      <div className="application-timeline__item-icon" aria-hidden="true">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="application-timeline__content">
                        <h3>{milestone.title}</h3>
                        <time dateTime={milestone.dateTime}>{milestone.date}</time>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
