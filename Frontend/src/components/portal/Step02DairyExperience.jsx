import React from 'react';
import { AlertCircle } from 'lucide-react';

/* These three questions are optional: no asterisk, and no minimum length. */
const QUESTIONS = [
  {
    key: 'priorExperience',
    rows: 4,
    label: 'Do you have any prior learning or experience in the dairy sector?',
    hint: 'Optional. Describe it briefly if you have any.',
    placeholder: 'e.g. Family dairy farm for 6 years, diploma in dairy technology',
  },
  {
    key: 'motivation',
    rows: 5,
    label: 'What motivates you to join Dairy Yatra 2027?',
    placeholder: 'Tell us what draws you to this journey...',
  },
  {
    key: 'learningExpectations',
    rows: 4,
    label: 'What are your key learning expectations?',
    placeholder: 'What do you hope to learn and take back from the Yatra?',
  },
];

export default function Step2DairyExperience({ formData, setFormData, setErrors, errors = {} }) {
  const setScholarshipChoice = (choice) => {
    setFormData((current) => ({
      ...current,
      wantsScholarship: choice,
      scholarshipReason: choice === 'Yes' ? current.scholarshipReason : '',
    }));
    if (choice === 'No') {
      setErrors((current) => {
        const next = { ...current };
        delete next.scholarshipReason;
        return next;
      });
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-[#C8DFDB] pb-5">
        <h2 className="font-sans text-3xl sm:text-4xl font-bold text-[#172738] tracking-tight">Tell Us Your Story</h2>
        <p className="text-sm text-[#4E657D] mt-1.5 leading-relaxed">
          Share what draws you to dairy.
        </p>
      </div>

      <div>
        <div className="mb-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#3368A0]">
            Do you want scholarship? <span>*</span>
          </label>
        </div>
        <div className="flex flex-wrap gap-3">
          {['Yes', 'No'].map((choice) => (
            <button
              type="button"
              key={choice}
              onClick={() => setScholarshipChoice(choice)}
              className={`px-6 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                formData.wantsScholarship === choice
                  ? 'bg-[#3368A0] text-white border-[#3368A0] shadow-md ring-2 ring-[#3368A0]/20'
                  : 'bg-white text-[#172738] border-[#C8DFDB] hover:border-[#3368A0]/60'
              }`}
            >
              {choice}
            </button>
          ))}
        </div>
        {errors.wantsScholarship && (
          <p className="text-xs text-rose-600 flex items-center gap-1 mt-1.5 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> {errors.wantsScholarship}
          </p>
        )}
      </div>

      {formData.wantsScholarship === 'Yes' && (
        <div>
          <div className="flex items-start justify-between gap-3 mb-1.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-[#3368A0]">
              Why are you applying for a scholarship? <span>*</span>
            </label>
            <span className="text-xs text-[#4E657D] whitespace-nowrap">{(formData.scholarshipReason || '').length} chars</span>
          </div>
          <textarea
            rows={4}
            maxLength={3000}
            placeholder="Tell us why you are applying for a scholarship..."
            value={formData.scholarshipReason || ''}
            onChange={(e) => setFormData({ ...formData, scholarshipReason: e.target.value })}
            className={`w-full p-4 rounded-2xl border bg-white text-sm font-sans leading-relaxed transition-all focus:outline-none focus:ring-2 ${
              errors.scholarshipReason
                ? 'border-rose-500 focus:ring-rose-200'
                : 'border-[#C8DFDB] focus:border-[#3368A0] focus:ring-[#3368A0]/20'
            }`}
          />
          {errors.scholarshipReason && (
            <p className="text-xs text-rose-600 flex items-center gap-1 mt-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" /> {errors.scholarshipReason}
            </p>
          )}
        </div>
      )}

      {QUESTIONS.map((q) => {
        const value = formData[q.key] || '';
        return (
          <div key={q.key}>
            <div className="flex items-start justify-between gap-3 mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#3368A0]">
                {q.label} <span className="normal-case font-semibold tracking-normal text-[#4E657D]">(optional)</span>
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