import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

/* Programme fee and scholarship levels. Change the amounts here and the page updates. */
const TOTAL_FEE = 100000;

const LEVELS = [
  { level: 'Level 1', payable: 90000 },
  { level: 'Level 2', payable: 85000 },
  { level: 'Level 3', payable: 75000 },
  { level: 'Level 4', payable: 60000 },
];

/* Cancellation and refunds (without EMI): % of the total fee paid that is refunded */
const REFUNDS = [
  { period: 'Till 30 November', refund: 100 },
  { period: '1 December – 31 December', refund: 80 },
  { period: '1 January – 15 January', refund: 65 },
  { period: '16 January – 25 January', refund: 45 },
  { period: '26 January – 31 January', refund: 25 },
  { period: 'On or after 1 February', refund: 0 },
];

const NAVY = '#14284B';

// ₹1,00,000 (Indian digit grouping)
const inr = (n) => `₹${n.toLocaleString('en-IN')}`;

/* Cancellation & refund policy.
   Left: a ring showing the refund for the selected period (and what that means on the full fee).
   Right: the periods; hovering or tapping one moves the ring to it. */
function RefundPolicy() {
  const [sel, setSel] = useState(0);
  const r = REFUNDS[sel];
  const R = 74;
  const C = 2 * Math.PI * R;

  return (
    <div className="mt-16 border-t border-slate-200 pt-12 lg:mt-20">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-tight tracking-tight">Cancellation &amp; Refund Policy</h2>
          <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[#2B6CB0]">Payments without EMI</p>
        </div>
        <p className="text-sm text-slate-500">Select a cancellation period to see the refund.</p>
      </div>

      <div className="mt-8 grid overflow-hidden rounded-2xl border border-slate-200 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        {/* Ring */}
        <div className="flex flex-col items-center justify-center gap-6 bg-[#0E1B30] px-6 py-10 text-white sm:flex-row sm:gap-10 lg:flex-col lg:gap-7 lg:py-12">
          <div className="relative h-[176px] w-[176px] shrink-0">
            <svg viewBox="0 0 176 176" className="h-full w-full -rotate-90" aria-hidden="true">
              <circle cx="88" cy="88" r={R} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="12" />
              <circle
                cx="88"
                cy="88"
                r={R}
                fill="none"
                stroke="url(#dyRefund)"
                strokeWidth="12"
                strokeLinecap="round"
                strokeDasharray={C}
                strokeDashoffset={C * (1 - r.refund / 100)}
                style={{ transition: 'stroke-dashoffset 700ms cubic-bezier(0.22, 1, 0.36, 1)', opacity: r.refund ? 1 : 0 }}
              />
              <defs>
                <linearGradient id="dyRefund" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#5B9BE0" />
                  <stop offset="100%" stopColor="#F5A524" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-[2.6rem] font-semibold leading-none tabular-nums">{r.refund}%</span>
              <span className="mt-1.5 text-[12px] uppercase tracking-[0.16em] text-white/60">{r.refund ? 'Refund' : 'No refund'}</span>
            </div>
          </div>

          <div className="text-center sm:text-left lg:text-center" aria-live="polite">
            <p className="text-[13px] text-white/60">Cancelled</p>
            <p className="mt-0.5 text-lg font-semibold">{r.period}</p>
            <p className="mt-3 text-sm text-white/75">
              On the full fee of {inr(TOTAL_FEE)}:{' '}
              <span className="font-semibold text-[#F5A524]">{inr((TOTAL_FEE * r.refund) / 100)}</span> refunded
            </p>
          </div>
        </div>

        {/* Periods */}
        <ul className="divide-y divide-slate-200 bg-white">
          {REFUNDS.map((x, i) => {
            const on = i === sel;
            return (
              <li key={x.period}>
                <button
                  type="button"
                  onClick={() => setSel(i)}
                  onMouseEnter={() => setSel(i)}
                  onFocus={() => setSel(i)}
                  aria-pressed={on}
                  className={`group flex w-full items-center gap-4 px-5 py-4 text-left transition-colors sm:px-7 ${on ? 'bg-[#F2F6FC]' : 'hover:bg-slate-50'}`}
                >
                  <span
                    className={`h-8 w-1 shrink-0 rounded-full transition-colors ${on ? 'bg-[#2B6CB0]' : 'bg-transparent'}`}
                    aria-hidden="true"
                  />
                  <span className="min-w-0 flex-1">
                    <span className={`block text-[15px] font-medium ${on ? 'text-[#14284B]' : 'text-slate-700'}`}>{x.period}</span>
                    <span className="mt-2 block h-1 w-full max-w-[220px] overflow-hidden rounded-full bg-slate-100" aria-hidden="true">
                      <span className="block h-full rounded-full bg-[#2B6CB0]" style={{ width: `${x.refund}%`, opacity: on ? 1 : 0.45 }} />
                    </span>
                  </span>
                  <span className={`text-xl font-semibold tabular-nums ${x.refund ? (on ? 'text-[#14284B]' : 'text-slate-700') : 'text-slate-400'}`}>
                    {x.refund}%
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <p className="mt-4 text-[13px] leading-relaxed text-slate-500">
        The refund percentage is applied to the total fee paid and is determined by the date on which the cancellation is requested.
      </p>
    </div>
  );
}

/* Programme > Programme Fee (/programme/fee) */
export default function ProgrammeFee({ onOpenApply }) {
  return (
    <section
      id="programme-fee"
      className="bg-white pb-20 pt-28 font-sans sm:pt-32 lg:pb-24"
      style={{ color: NAVY, paddingLeft: 'max(16px, 4%)', paddingRight: 'max(16px, 4%)' }}
    >
      <div className="mx-auto w-full max-w-[1280px]">
        {/* Heading row: title on the left, total fee on the right */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[12px] font-bold uppercase tracking-[0.22em] text-[#2B6CB0]">Dairy Yathra · Financial policy</p>
            <h1 className="mt-2 text-[clamp(1.9rem,3.4vw,2.6rem)] font-semibold leading-tight tracking-tight">Programme Fee</h1>
          </div>
          <div className="inline-flex items-center gap-2 self-start rounded-full bg-slate-100 p-1 pr-4 text-sm sm:self-auto">
            <span className="rounded-full bg-white px-3 py-1 font-semibold shadow-sm">Total journey fee</span>
            <span className="font-bold">{inr(TOTAL_FEE)}</span>
          </div>
        </div>

        {/* Fee cards */}
        <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {/* Full fee: the highlighted card */}
          <article className="relative isolate flex flex-col overflow-hidden rounded-xl bg-[#0E1B30] p-5 text-white shadow-[0_24px_60px_-20px_rgba(14,27,48,0.55)] sm:col-span-2 lg:col-span-1">
            <div
              className="pointer-events-none absolute inset-0 -z-10"
              aria-hidden="true"
              style={{
                background:
                  'radial-gradient(120% 70% at 75% 110%, rgba(245,165,36,0.85), transparent 60%), radial-gradient(90% 60% at 20% 95%, rgba(43,108,176,0.75), transparent 65%)',
              }}
            />
            <p className="text-[13px] text-white/70">Full programme fee</p>
            <p className="mt-3 text-[2rem] font-semibold leading-none tracking-tight">{inr(TOTAL_FEE)}</p>
            <p className="mt-4 text-sm leading-relaxed text-white/85">Total journey programme fee, before any scholarship.</p>
            <button
              type="button"
              onClick={onOpenApply}
              className="mt-auto flex w-full items-center justify-center gap-1.5 rounded-lg bg-white/95 px-4 py-2.5 text-sm font-semibold text-[#0E1B30] transition-colors hover:bg-white lg:mt-10"
            >
              Expression of Interest <ChevronRight className="h-4 w-4" />
            </button>
          </article>

          {/* Scholarship levels */}
          {LEVELS.map((l) => (
            <article key={l.level} className="flex flex-col rounded-xl border border-dashed border-slate-300 p-5">
              <p className="text-[13px] text-slate-500">Scholarship {l.level}</p>
              <p className="mt-3 text-[2rem] font-semibold leading-none tracking-tight">{inr(l.payable)}</p>
              <p className="mt-4 text-sm text-slate-600">Programme fee payable</p>
              <p className="mt-auto pt-6 text-[13px] text-slate-500 lg:pt-10">
                Scholarship of <span className="font-semibold text-[#2B6CB0]">{inr(TOTAL_FEE - l.payable)}</span>
              </p>
            </article>
          ))}
        </div>

        {/* Scholarship opportunities: heading left, details right */}
        <div className="mt-16 grid gap-8 border-t border-slate-200 pt-12 lg:mt-20 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-16">
          <div>
            <h2 className="text-[clamp(1.5rem,2.4vw,2rem)] font-semibold leading-tight tracking-tight">Scholarship Opportunities</h2>
            <p className="mt-2 text-[12px] font-bold uppercase tracking-[0.18em] text-[#2B6CB0]">Financial support for deserving Dairy Yatris</p>
          </div>

          <dl className="grid gap-8 sm:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] sm:gap-x-10">
            <dt className="font-semibold">Who can apply?</dt>
            <dd className="leading-relaxed text-slate-600">
              Dairy Yatris seeking financial assistance can apply for scholarship support. We aim to make this learning journey
              accessible to deserving participants.
            </dd>

            <dt className="font-semibold">Financial policy</dt>
            <dd className="leading-relaxed text-slate-600">
              Scholarships are awarded based on financial need, eligibility, and assessment. Applicants may be required to submit
              supporting documents. The final scholarship level and payable amount will be communicated to selected participants
              before payment.
            </dd>

            <dd className="sm:col-start-2">
              <button
                type="button"
                onClick={onOpenApply}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold transition-colors hover:border-[#2B6CB0] hover:text-[#2B6CB0]"
              >
                Apply through the Expression of Interest <ChevronRight className="h-4 w-4" />
              </button>
            </dd>
          </dl>
        </div>

        <RefundPolicy />
      </div>
    </section>
  );
}
