import React from 'react';
import { AlertCircle } from 'lucide-react';

const QUESTIONS = [
  {
    key: 'priorExperience',
    rows: 4,
    label: 'Do you have any prior learning or experience in the dairy sector?',
    hint: 'Describe it briefly, or write "None" if you have no prior experience.',
    placeholder: 'e.g. Family dairy farm for 6 years, diploma in dairy technology, or None',
  },
  {
    key: 'motivation',
    rows: 5,
    label: 'What motivates you to join Dairy Yatra 2027?',
    hint: 'Minimum 30 characters.',
    placeholder: 'Tell us what draws you to this journey...',
  },
  {
    key: 'learningExpectations',
    rows: 4,
    label: 'What are your key learning expectations?',
    hint: 'Minimum 30 characters.',
    placeholder: 'What do you hope to learn and take back from the Yatra?',
  },
];

export default function Step2DairyExperience({ formData, setFormData, errors = {} }) {
  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-[#C8DFDB] pb-5">
        <span className="text-xs uppercase tracking-widest font-bold text-[#3368A0] block mb-1">Step 02 of 02</span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#172738] tracking-tight">Your Dairy Experience</h2>
        <p className="text-sm text-[#4E657D] mt-1.5 leading-relaxed">
          Three short questions. Honest, specific answers help the selection committee most.
        </p>
      </div>

      {QUESTIONS.map((q) => {
        const value = formData[q.key] || '';
        return (
          <div key={q.key}>
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3368A0]">
                {q.label} <span>*</span>
              </label>
              <span className="text-xs text-[#4E657D] whitespace-nowrap">{value.length} chars</span>
            </div>
            <textarea
              rows={q.rows}
              placeholder={q.placeholder}
              value={value}
              onChange={(e) => setFormData({ ...formData, [q.key]: e.target.value })}
              className={`w-full p-4 rounded-2xl border bg-white text-sm font-sans leading-relaxed transition-all focus:outline-none focus:ring-2 ${
                errors[q.key]
                  ? 'border-rose-500 focus:ring-rose-200'
                  : 'border-[#C8DFDB] focus:border-[#3368A0] focus:ring-[#3368A0]/20'
              }`}
            />
            <p className="text-[11px] text-[#4E657D] mt-1.5">{q.hint}</p>
            {errors[q.key] && (
              <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> {errors[q.key]}
              </p>
            )}
          </div>
        );
      })}
    </div>
  );
}