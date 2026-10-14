export const INITIAL_EOI_STATE = {
  // Step 1 - Profile
  fullName: '',
  dob: '',
  gender: '',
  whatsapp: '',
  secondaryNo: '',
  email: '',
  address: '',
  city: '',
  state: '',
  occupation: '',
  organization: '',
  // Step 2 - Dairy Experience
  wantsScholarship: '',
  scholarshipReason: '',
  priorExperience: '',
  motivation: '',
  learningExpectations: '',
};

export const GENDER_OPTIONS = ['Male', 'Female', 'Other'];

export const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa',
  'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala',
  'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram', 'Nagaland',
  'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana', 'Tripura',
  'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Andaman and Nicobar Islands', 'Chandigarh', 'Dadra and Nagar Haveli and Daman and Diu',
  'Delhi', 'Jammu and Kashmir', 'Ladakh', 'Lakshadweep', 'Puducherry',
];

// Which field keys belong to which step (used to jump to the right step on server errors)
export const STEP_FIELDS = {
  1: ['fullName', 'dob', 'gender', 'whatsapp', 'secondaryNo', 'email', 'address', 'city', 'state', 'occupation', 'organization'],
  2: ['wantsScholarship', 'scholarshipReason', 'priorExperience', 'motivation', 'learningExpectations'],
};

export function calculateAge(dob) {
  if (!dob) return null;
  const birth = new Date(dob);
  if (isNaN(birth.getTime())) return null;
  const today = new Date();
  let age = today.getFullYear() - birth.getFullYear();
  const m = today.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
  return age;
}

const PHONE = /^[6-9]\d{9}$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Mirrors the server rules. The server is still the final authority.
export function validateEoiStep(step, d) {
  const e = {};

  if (step === 1) {
    if (!d.fullName || d.fullName.trim().length < 3) e.fullName = 'Enter your name as per Aadhar';
    const age = calculateAge(d.dob);
    if (age === null || age < 18 || age > 100) e.dob = 'Enter a valid date of birth (18+ only)';
    if (!d.gender) e.gender = 'Select your gender';
    if (!PHONE.test((d.whatsapp || '').trim())) e.whatsapp = 'Enter a valid 10-digit WhatsApp number';
    if (d.secondaryNo && !PHONE.test(d.secondaryNo.trim())) e.secondaryNo = 'Enter a valid 10-digit number or leave it empty';
    const email = (d.email || '').trim();
    if (email && !EMAIL.test(email)) e.email = 'Enter a valid email address or leave it empty';
    if (!d.address || d.address.trim().length < 10) e.address = 'Enter your residential address';
    if (!d.city || !d.city.trim()) e.city = 'City is required';
    if (!d.state) e.state = 'State is required';
    if (!d.occupation || !d.occupation.trim()) e.occupation = 'Occupation is required';
  }

  if (step === 2) {
    if (!['Yes', 'No'].includes(d.wantsScholarship)) e.wantsScholarship = 'Select Yes or No';
    if (d.wantsScholarship === 'Yes' && !d.scholarshipReason?.trim())
      e.scholarshipReason = 'Tell us why you are applying for a scholarship';
    // priorExperience, motivation and learningExpectations are optional: no checks.
  }

  return { isValid: Object.keys(e).length === 0, errors: e };
}

// ---------- Local draft (this device only) ----------
const DRAFT_KEY = 'dairy_yatra_eoi_draft_v2';

export function loadEoiDraft() {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    if (!raw) return { ...INITIAL_EOI_STATE };
    // merge so any missing key falls back to ''
    return { ...INITIAL_EOI_STATE, ...JSON.parse(raw) };
  } catch {
    return { ...INITIAL_EOI_STATE };
  }
}

export function saveEoiDraft(data) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {
    /* storage full or blocked: ignore, the form still works */
  }
}

export function clearEoiDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* ignore */
  }
}