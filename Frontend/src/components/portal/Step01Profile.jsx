import React from 'react';
import { AlertCircle } from 'lucide-react';
import { GENDER_OPTIONS, INDIAN_STATES, calculateAge } from './Eoiform';

const inputClass = (hasError) =>
  `w-full px-4 py-3 rounded-xl border bg-white text-sm font-sans transition-all focus:outline-none focus:ring-2 ${
    hasError ? 'border-rose-500 focus:ring-rose-200' : 'border-[#C8DFDB] focus:border-[#3368A0] focus:ring-[#3368A0]/20'
  }`;

function Field({ label, required, optional, error, className = '', children }) {
  return (
    <div className={className}>
      <label className="block text-xs font-bold uppercase tracking-wider text-[#3368A0] mb-1.5">
        {label}{' '}
        {required && <span>*</span>}
        {optional && <span className="text-xs text-[#4E657D] lowercase font-normal">(optional)</span>}
      </label>
      {children}
      {error && (
        <p className="text-xs text-rose-600 flex items-center gap-1 mt-1.5 font-medium">
          <AlertCircle className="w-3.5 h-3.5" /> {error}
        </p>
      )}
    </div>
  );
}

export default function Step1Profile({ formData, setFormData, errors = {} }) {
  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });
  const digits = (key) => (e) =>
    setFormData({ ...formData, [key]: e.target.value.replace(/\D/g, '').slice(0, 10) });

  const age = calculateAge(formData.dob);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="space-y-8 animate-fadeIn">
      <div className="border-b border-[#C8DFDB] pb-5">
        <span className="text-xs uppercase tracking-widest font-bold text-[#3368A0] block mb-1">Step 01 of 02</span>
        <h2 className="font-serif text-3xl sm:text-4xl font-bold text-[#172738] tracking-tight">Your Profile</h2>
        <p className="text-sm text-[#4E657D] mt-1.5 leading-relaxed">
          Please enter your details exactly as they appear on your official documents.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Field label="Name (as per Aadhar)" required error={errors.fullName} className="md:col-span-2">
          <input
            type="text"
            placeholder="Full name as printed on your Aadhar card"
            value={formData.fullName}
            onChange={set('fullName')}
            className={inputClass(errors.fullName)}
          />
        </Field>

        <Field label="Date of Birth" required error={errors.dob}>
          <input
            type="date"
            max={today}
            value={formData.dob}
            onChange={set('dob')}
            className={inputClass(errors.dob)}
          />
        </Field>

        <Field label="Age">
          <div className="px-4 py-3 rounded-xl border border-[#C8DFDB] bg-[#F2EFE7] text-sm text-[#172738] min-h-[46px]">
            {age !== null && age >= 0 ? `${age} years` : 'Calculated from date of birth'}
          </div>
        </Field>

        <Field label="Gender" required error={errors.gender} className="md:col-span-2">
          <div className="flex flex-wrap gap-3">
            {GENDER_OPTIONS.map((g) => {
              const selected = formData.gender === g;
              return (
                <button
                  type="button"
                  key={g}
                  onClick={() => setFormData({ ...formData, gender: g })}
                  className={`px-6 py-2.5 rounded-xl border text-sm font-bold transition-all cursor-pointer ${
                    selected
                      ? 'bg-[#3368A0] text-white border-[#3368A0] shadow-md ring-2 ring-[#3368A0]/20'
                      : 'bg-white text-[#172738] border-[#C8DFDB] hover:border-[#3368A0]/60'
                  }`}
                >
                  {g}
                </button>
              );
            })}
          </div>
        </Field>

        <Field label="Mobile Number (WhatsApp)" required error={errors.whatsapp}>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="10-digit WhatsApp number"
            value={formData.whatsapp}
            onChange={digits('whatsapp')}
            className={inputClass(errors.whatsapp)}
          />
        </Field>

        <Field label="Secondary Number" optional error={errors.secondaryNo}>
          <input
            type="tel"
            inputMode="numeric"
            placeholder="10-digit alternate number"
            value={formData.secondaryNo}
            onChange={digits('secondaryNo')}
            className={inputClass(errors.secondaryNo)}
          />
        </Field>

        <Field label="Email Address" required error={errors.email} className="md:col-span-2">
          <input
            type="email"
            placeholder="you@example.com"
            value={formData.email}
            onChange={set('email')}
            className={inputClass(errors.email)}
          />
        </Field>

        <Field label="Residential Address" required error={errors.address} className="md:col-span-2">
          <textarea
            rows="3"
            placeholder="House / street / area"
            value={formData.address}
            onChange={set('address')}
            className={`${inputClass(errors.address)} leading-relaxed`}
          />
        </Field>

        <Field label="City" required error={errors.city}>
          <input
            type="text"
            placeholder="City"
            value={formData.city}
            onChange={set('city')}
            className={inputClass(errors.city)}
          />
        </Field>

        <Field label="State" required error={errors.state}>
          <select value={formData.state} onChange={set('state')} className={`${inputClass(errors.state)} cursor-pointer`}>
            <option value="">Select state</option>
            {INDIAN_STATES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </Field>

        <Field label="Occupation" required error={errors.occupation}>
          <input
            type="text"
            placeholder="e.g. Student, Dairy farmer, Veterinarian, Founder"
            value={formData.occupation}
            onChange={set('occupation')}
            className={inputClass(errors.occupation)}
          />
        </Field>

        <Field label="Organization Name" optional error={errors.organization}>
          <input
            type="text"
            placeholder="Company, institution or farm name"
            value={formData.organization}
            onChange={set('organization')}
            className={inputClass(errors.organization)}
          />
        </Field>
      </div>
    </div>
  );
}