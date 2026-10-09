import React from 'react';
import { CheckCircle2, Printer, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

const Row = ({ label, value }) => (
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 py-3 border-b border-[#C8DFDB]/60 last:border-0">
    <dt className="text-xs font-bold uppercase tracking-wider text-[#3368A0]">{label}</dt>
    <dd className="sm:col-span-2 text-sm text-[#172738] whitespace-pre-wrap break-words">{value || '—'}</dd>
  </div>
);

export default function EoiSuccess({ submissionRecord, onClose }) {
  if (!submissionRecord) return null;
  const { refId, formattedDate, data = {} } = submissionRecord;

  return (
    <div className="min-h-screen bg-[#F2EFE7] text-[#172738] font-sans pb-20">
      <div className="bg-[#142538] text-white py-12 px-4 border-b-4 border-[#3368A0] print:hidden">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-white/10 text-[#C8DFDB] border-2 border-[#C8DFDB] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold">Expression of Interest Received</h1>
          <p className="text-sm sm:text-base text-white/85 leading-relaxed">
            Thank you, <strong>{data.fullName}</strong>. Your Expression of Interest for Dairy Yatra 2027 has been submitted.
          </p>
          <div className="inline-flex flex-col sm:flex-row items-center gap-3 bg-[#101d2c] px-6 py-3 rounded-2xl border border-white/15 text-xs">
            <span className="font-mono font-bold text-base text-[#C8DFDB]">Reference: {refId}</span>
            {formattedDate && (
              <>
                <span className="hidden sm:inline text-white/40">•</span>
                <span className="text-white/80">Submitted: {formattedDate}</span>
              </>
            )}
          </div>
          <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
            <button
              onClick={() => window.print()}
              className="flex items-center gap-2 bg-white/10 hover:bg-white/20 px-5 py-3 rounded-2xl font-bold text-sm border border-white/25 cursor-pointer"
            >
              <Printer className="w-4 h-4 text-[#C8DFDB]" /> Print / Save as PDF
            </button>
            <button
              onClick={onClose}
              className="flex items-center gap-2 px-5 py-3 rounded-2xl font-bold text-sm text-white/90 hover:bg-white/10 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Dairy Yatra
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 mt-10 space-y-6">
        <div className="bg-white p-6 rounded-2xl border border-[#C8DFDB] shadow-sm flex items-start gap-4 print:hidden">
          <div className="w-10 h-10 rounded-xl bg-[#3368A0]/10 text-[#3368A0] flex items-center justify-center flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div className="text-sm text-[#4E657D] leading-relaxed">
            <h4 className="font-bold text-[#172738] mb-1">What happens next</h4>
            <p>
              Your Expression of Interest is under review. The selected cohort will be announced on{' '}
              <strong>15 November 2026</strong>
              {data.email ? <> via <strong>{data.email}</strong> and</> : ' via'} WhatsApp (
              <strong>{data.whatsapp}</strong>). Only selected applicants will receive access to the next stage.
            </p>
          </div>
        </div>

        <div className="bg-[#E5E1D5]/60 p-6 rounded-2xl border border-dashed border-[#C8DFDB] flex items-start gap-4 print:hidden">
          <div className="w-10 h-10 rounded-xl bg-white text-[#4E657D] flex items-center justify-center flex-shrink-0">
            <Lock className="w-5 h-5" />
          </div>
          <div className="text-sm text-[#4E657D] leading-relaxed">
            <h4 className="font-bold text-[#172738] mb-1">Step 03 · Payment (Locked)</h4>
            <p>
              This step opens only if you are selected. Selected applicants will be notified on{' '}
              <strong>15 November 2026</strong>, and payment must be completed by{' '}
              <strong>25 November 2026</strong>.
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-[#C8DFDB] shadow-sm p-6 sm:p-8">
          <h3 className="font-serif text-xl font-bold mb-2">Submitted Expression of Interest</h3>
          <dl>
            <Row label="Name" value={data.fullName} />
            <Row label="Date of birth" value={data.dob ? `${data.dob}${data.age != null ? ` (${data.age} years)` : ''}` : ''} />
            <Row label="Gender" value={data.gender} />
            <Row label="WhatsApp" value={data.whatsapp} />
            <Row label="Secondary number" value={data.secondaryNo} />
            <Row label="Email" value={data.email} />
            <Row label="Scholarship requested" value={data.wantsScholarship} />
            {data.wantsScholarship === 'Yes' && <Row label="Scholarship reason" value={data.scholarshipReason} />}
            <Row label="Address" value={[data.address, data.city, data.state].filter(Boolean).join(', ')} />
            <Row label="Occupation" value={data.occupation} />
            <Row label="Organization" value={data.organization} />
            <Row label="Dairy experience" value={data.priorExperience} />
            <Row label="Motivation" value={data.motivation} />
            <Row label="Learning expectations" value={data.learningExpectations} />
          </dl>
        </div>
      </div>
    </div>
  );
}