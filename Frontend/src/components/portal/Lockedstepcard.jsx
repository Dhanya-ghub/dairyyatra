import React from 'react';
import { Lock } from 'lucide-react';

export default function LockedStepCard() {
  return (
    <div className="bg-[#EAE6DA]/60 p-6 rounded-2xl border-2 border-dashed border-[#9DB3C4] flex items-start gap-4 print:hidden">
      <div className="w-10 h-10 rounded-xl bg-white text-[#4E657D] flex items-center justify-center flex-shrink-0">
        <Lock className="w-5 h-5" />
      </div>
      <div className="text-sm text-[#4E657D] leading-relaxed">
        <h4 className="font-bold text-[#172738] mb-1">Step 03 · Payment (Locked)</h4>
        <p>
          This step opens only for participants selected in the cohort announcement on{' '}
          <strong>15 November 2026</strong>. Selected participants complete payment by{' '}
          <strong>25 November 2026</strong> to confirm their seat.
        </p>
      </div>
    </div>
  );
}