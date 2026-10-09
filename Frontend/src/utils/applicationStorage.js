import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { INITIAL_APPLICATION_STATE, HOST_ORGANIZATIONS } from '../data/portalConstants';

const STORAGE_KEY = 'dairy_yatra_application_draft_v2';
const SUBMISSION_KEY = 'dairy_yatra_submitted_applications';

export function loadDraftApplication() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...INITIAL_APPLICATION_STATE };
    const parsed = JSON.parse(raw);
    return { ...INITIAL_APPLICATION_STATE, ...parsed };
  } catch (err) {
    console.error('Error loading draft application:', err);
    return { ...INITIAL_APPLICATION_STATE };
  }
}

export function saveDraftApplication(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Error saving draft application:', err);
  }
}

export function clearDraftApplication() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing draft:', err);
  }
}

export function calculateAge(dobString) {
  if (!dobString) return '';
  const birthDate = new Date(dobString);
  if (isNaN(birthDate.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  return age >= 0 ? age : 0;
}

export function getMaxDobFor18Years() {
  const today = new Date();
  const maxDate = new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
  return maxDate.toISOString().split('T')[0];
}

export function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).filter(Boolean).length;
}

// Comprehensive Step Validation Function
export function validateStep(stepNumber, formData) {
  const errors = {};

  if (stepNumber === 1) {
    // Step 01: About You
    if (!formData.fullName || formData.fullName.trim().length < 3) {
      errors.fullName = 'Please enter your full name (minimum 3 characters)';
    }

    if (!formData.dob) {
      errors.dob = 'Date of birth is required';
    } else {
      const calculatedAge = calculateAge(formData.dob);
      if (calculatedAge < 18) {
        errors.dob = 'Applicants must be at least 18 years old to participate in Dairy Yatra';
      }
    }

    if (!formData.gender) {
      errors.gender = 'Please select your gender';
    }

    const indianMobileRegex = /^(?:(?:\+|0{0,2})91[\s-]?)?[6-9]\d{9}$/;
    const cleanMobile = (formData.mobile || '').replace(/[\s-]/g, '');
    if (!cleanMobile) {
      errors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(cleanMobile.replace(/^(\+91|91|0)/, ''))) {
      errors.mobile = 'Please enter a valid 10-digit mobile number';
    }

    if (!formData.sameAsMobile) {
      const cleanWhatsapp = (formData.whatsapp || '').replace(/[\s-]/g, '');
      if (cleanWhatsapp && !/^\d{10}$/.test(cleanWhatsapp.replace(/^(\+91|91|0)/, ''))) {
        errors.whatsapp = 'Please enter a valid 10-digit WhatsApp number';
      }
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!formData.email) {
      errors.email = 'Email address is required';
    } else if (!emailRegex.test(formData.email.trim())) {
      errors.email = 'Please enter a valid email address';
    }

    if (!formData.city || formData.city.trim().length < 2) {
      errors.city = 'Please enter your current city';
    }

    if (!formData.state) {
      errors.state = 'Please select your state / union territory';
    }

    if (!formData.address || formData.address.trim().length < 8) {
      errors.address = 'Please enter your residential or postal address';
    }
  }

  if (stepNumber === 2) {
    // Step 02: Background
    if (!formData.primaryRole) {
      errors.primaryRole = 'Please select your primary role or persona';
    }
    if (!formData.highestQualification) {
      errors.highestQualification = 'Please select your highest qualification';
    }
    if (!formData.degree || formData.degree.trim().length < 2) {
      errors.degree = 'Please specify your degree or course of study';
    }
    if (!formData.institution || formData.institution.trim().length < 3) {
      errors.institution = 'Please enter your institution / university name';
    }
    if (!formData.graduationYear) {
      errors.graduationYear = 'Please specify graduation year';
    } else {
      const year = parseInt(formData.graduationYear, 10);
      if (isNaN(year) || year < 1960 || year > 2032) {
        errors.graduationYear = 'Please enter a valid 4-digit graduation year';
      }
    }
  }

  if (stepNumber === 3) {
    // Step 03: Dairy Connection
    if (!formData.currentInvolvement) {
      errors.currentInvolvement = 'Please select your current connection with dairy';
    }
    if (!formData.involvementNarrative || formData.involvementNarrative.trim().length < 30) {
      errors.involvementNarrative = 'Please provide a brief description of your involvement (minimum 30 characters)';
    }
  }

  if (stepNumber === 4) {
    // Step 04: Experience
    if (!formData.priorImmersion) {
      errors.priorImmersion = 'Please specify if you have attended prior immersions/yatras';
    } else if (formData.priorImmersion === 'Yes' && (!formData.priorImmersionDetails || formData.priorImmersionDetails.trim().length < 15)) {
      errors.priorImmersionDetails = 'Please briefly share details about your past immersion experience';
    }
    if (!formData.priorDairyYatraEdition) {
      errors.priorDairyYatraEdition = 'Please select whether you previously joined Dairy Yatra';
    }
  }

  if (stepNumber === 5) {
    // Step 05: Entrepreneurship
    if (!formData.startupStatus) {
      errors.startupStatus = 'Please select your current business or startup status';
    } else if (formData.startupStatus !== 'no') {
      if (!formData.startupName || formData.startupName.trim().length < 2) {
        errors.startupName = 'Please enter your business / startup / idea name';
      }
      if (!formData.problemSolved || formData.problemSolved.trim().length < 20) {
        errors.problemSolved = 'Please explain what problem your venture solves (minimum 20 characters)';
      }
      if (!formData.businessModel || formData.businessModel.trim().length < 20) {
        errors.businessModel = 'Please describe your business model & target market (minimum 20 characters)';
      }
    }
  }

  if (stepNumber === 6) {
    // Step 06: Why Dairy Yatra
    const whyWords = countWords(formData.whyDairyYatra);
    if (!formData.whyDairyYatra || formData.whyDairyYatra.trim().length < 50) {
      errors.whyDairyYatra = 'Please write why you want to participate in Dairy Yatra (minimum 50 characters, recommended 150-200 words)';
    } else if (whyWords < 15) {
      errors.whyDairyYatra = `Your response is currently ${whyWords} words. Please elaborate to at least 15-20 words (recommended 150-200 words).`;
    }

    if (!formData.learningGoals || formData.learningGoals.trim().length < 30) {
      errors.learningGoals = 'Please outline your specific learning objectives (minimum 30 characters)';
    }

    if (!formData.selectedOrganizations || formData.selectedOrganizations.length === 0) {
      errors.selectedOrganizations = 'Please select at least 1 host organization / visit';
    }
  }

  if (stepNumber === 7) {
    // Step 07: Journey Readiness
    if (!formData.comfort15Days) {
      errors.comfort15Days = 'Please confirm comfort with 15-day travel';
    }
    if (!formData.comfortTrain) {
      errors.comfortTrain = 'Please confirm comfort with long-distance train journeys';
    }
    if (!formData.comfortRural) {
      errors.comfortRural = 'Please confirm comfort with rural & farm ground locations';
    }
    if (!formData.comfortFlexibleSchedule) {
      errors.comfortFlexibleSchedule = 'Please confirm comfort adapting to dynamic field schedules';
    }
  }

  if (stepNumber === 8) {
    // Step 08: Essentials & Declaration
    if (!formData.dietaryPreference) {
      errors.dietaryPreference = 'Please select your dietary requirement';
    } else if (formData.dietaryPreference === 'Other' && (!formData.dietaryDetails || formData.dietaryDetails.trim().length < 3)) {
      errors.dietaryDetails = 'Please specify your dietary requirements';
    }

    if (!formData.foodAllergies) {
      errors.foodAllergies = 'Please indicate if you have food allergies or intolerances';
    } else if (formData.foodAllergies === 'Yes' && (!formData.allergyDetails || formData.allergyDetails.trim().length < 3)) {
      errors.allergyDetails = 'Please detail your allergies or dietary intolerances';
    }

    if (!formData.oneKeyGoal || formData.oneKeyGoal.trim().length < 20) {
      errors.oneKeyGoal = 'Please state the single most important outcome you seek (minimum 20 characters)';
    }

    if (!formData.declarationAccurate) {
      errors.declarationAccurate = 'You must confirm the accuracy of information provided';
    }

    if (!formData.declarationImmersive) {
      errors.declarationImmersive = 'You must acknowledge the 15-day experiential program terms';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
}

export function generateApplicationRefId() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let rand = '';
  for (let i = 0; i < 5; i++) {
    rand += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `DY-${rand}`;
}

export function saveCompletedSubmission(formData) {
  const refId = generateApplicationRefId();
  const submissionRecord = {
    refId,
    timestamp: new Date().toISOString(),
    formattedDate: new Date().toLocaleString('en-IN', {
      dateStyle: 'full',
      timeStyle: 'medium'
    }),
    data: { ...formData }
  };

  try {
    const existingRaw = localStorage.getItem(SUBMISSION_KEY);
    const existing = existingRaw ? JSON.parse(existingRaw) : [];
    existing.unshift(submissionRecord);
    localStorage.setItem(SUBMISSION_KEY, JSON.stringify(existing.slice(0, 20)));
  } catch (err) {
    console.error('Error saving submission record:', err);
  }

  return submissionRecord;
}

// Generate Comprehensive Multi-Page PDF Document
export function downloadApplicationPdf(submissionRecord) {
  const { refId, formattedDate, data } = submissionRecord;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  // Color Palette Constants
  const PRIMARY_BLUE = [51, 104, 160]; // #3368A0
  const SECONDARY_BLUE = [102, 163, 191]; // #66A3BF
  const MIST_AQUA = [200, 223, 219]; // #C8DFDB
  const DARK_NAVY = [20, 37, 56]; // #142538
  const TEXT_DARK = [23, 39, 56]; // #172738
  const SOFT_BG = [242, 239, 231]; // #F2EFE7
  const BORDER_COLOR = [200, 223, 219]; // #C8DFDB

  // Header Banner
  doc.setFillColor(...DARK_NAVY);
  doc.rect(0, 0, 210, 36, 'F');

  // Decorative Accent line under header
  doc.setFillColor(...PRIMARY_BLUE);
  doc.rect(0, 35, 210, 1.5, 'F');

  // Title & Subtitle
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.text('DAIRY YATRA', 14, 16);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MIST_AQUA);
  doc.text('BEYOND THE FARM • EXPERIENTIAL DAIRY IMMERSION IN INDIA', 14, 22);

  doc.setFontSize(8);
  doc.setTextColor(220, 230, 240);
  doc.text('OFFICIAL CANDIDATE APPLICATION DOSSIER', 14, 28);

  // Reference & Date Box on right
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`Ref ID: ${refId}`, 196, 16, { align: 'right' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...MIST_AQUA);
  doc.text(`Submitted: ${formattedDate}`, 196, 22, { align: 'right' });

  // Map Host IDs to Names
  const hostNames = (data.selectedOrganizations || []).map(id => {
    const found = HOST_ORGANIZATIONS.find(h => h.id === id);
    return found ? `${found.name} (${found.location})` : id;
  });

  // Compile Detailed Application Sections for Table
  const tableBody = [
    // Section 1
    [{ content: '01. PERSONAL INFORMATION', colSpan: 2, styles: { fillColor: PRIMARY_BLUE, textColor: [255, 255, 255], fontStyle: 'bold' } }],
    ['Full Name', data.fullName || '—'],
    ['Date of Birth / Age', `${data.dob || '—'} (Age: ${data.age || '—'} yrs)`],
    ['Gender', data.gender || '—'],
    ['Primary Contact (Mobile)', data.mobile || '—'],
    ['WhatsApp Number', data.sameAsMobile ? `${data.mobile} (Same as Mobile)` : (data.whatsapp || '—')],
    ['Email Address', data.email || '—'],
    ['Location / State', `${data.city || '—'}, ${data.state || '—'}`],
    ['Current Residential Address', data.address || '—'],

    // Section 2
    [{ content: '02. ACADEMIC & PROFESSIONAL BACKGROUND', colSpan: 2, styles: { fillColor: PRIMARY_BLUE, textColor: [255, 255, 255], fontStyle: 'bold' } }],
    ['Primary Role / Persona', data.primaryRole ? data.primaryRole.toUpperCase() : '—'],
    ['Highest Qualification', data.highestQualification || '—'],
    ['Degree & Specialization', `${data.degree || '—'} ${data.specialization ? `(${data.specialization})` : ''}`],
    ['Institution / University', data.institution || '—'],
    ['Year of Graduation', data.graduationYear || '—'],

    // Section 3
    [{ content: '03. DAIRY ECOSYSTEM CONNECTION', colSpan: 2, styles: { fillColor: PRIMARY_BLUE, textColor: [255, 255, 255], fontStyle: 'bold' } }],
    ['Current Dairy Involvement', data.currentInvolvement || '—'],
    ['Involvement Narrative', data.involvementNarrative || '—'],

    // Section 4
    [{ content: '04. PREVIOUS IMMERSIONS & EDITIONS', colSpan: 2, styles: { fillColor: PRIMARY_BLUE, textColor: [255, 255, 255], fontStyle: 'bold' } }],
    ['Prior Rural Immersion Experience', data.priorImmersion || '—'],
    ['Past Immersion Details', data.priorImmersion === 'Yes' ? (data.priorImmersionDetails || '—') : 'N/A'],
    ['Prior Dairy Yatra Edition Participation', data.priorDairyYatraEdition || '—'],

    // Section 5
    [{ content: '05. ENTREPRENEURSHIP & VENTURE DETAILS', colSpan: 2, styles: { fillColor: PRIMARY_BLUE, textColor: [255, 255, 255], fontStyle: 'bold' } }],
    ['Venture Status', data.startupStatus || '—'],
    ['Startup / Venture Name', data.startupStatus !== 'no' ? (data.startupName || '—') : 'N/A'],
    ['Problem Solved', data.startupStatus !== 'no' ? (data.problemSolved || '—') : 'N/A'],
    ['Business Model & Scope', data.startupStatus !== 'no' ? (data.businessModel || '—') : 'N/A'],
    ['Website / Portfolio', data.portfolioUrl || 'None provided'],

    // Section 6
    [{ content: '06. WHY DAIRY YATRA & LEARNING OBJECTIVES', colSpan: 2, styles: { fillColor: PRIMARY_BLUE, textColor: [255, 255, 255], fontStyle: 'bold' } }],
    ['Motivation Statement (Why Dairy Yatra)', data.whyDairyYatra || '—'],
    ['Learning Expectations', data.learningGoals || '—'],
    ['Selected Host Organizations', hostNames.join('\n• ') ? `• ${hostNames.join('\n• ')}` : 'None'],
    ['Specific Visit Interests', data.visitLearningInterest || '—'],

    // Section 7
    [{ content: '07. IMMERSION READINESS & TRAVEL COMFORT', colSpan: 2, styles: { fillColor: PRIMARY_BLUE, textColor: [255, 255, 255], fontStyle: 'bold' } }],
    ['15-Day Continuous Travel', data.comfort15Days || '—'],
    ['Long-Distance Train Journeys', data.comfortTrain || '—'],
    ['Rural / Ground Farm Visits', data.comfortRural || '—'],
    ['Flexible & Dynamic Schedules', data.comfortFlexibleSchedule || '—'],

    // Section 8
    [{ content: '08. TRAVEL ESSENTIALS & DECLARATIONS', colSpan: 2, styles: { fillColor: PRIMARY_BLUE, textColor: [255, 255, 255], fontStyle: 'bold' } }],
    ['Dietary Preference', `${data.dietaryPreference || '—'} ${data.dietaryDetails ? `(${data.dietaryDetails})` : ''}`],
    ['Food Allergies / Intolerances', `${data.foodAllergies || '—'} ${data.allergyDetails ? `(${data.allergyDetails})` : ''}`],
    ['Key Outcome Goal', data.oneKeyGoal || '—'],
    ['Accuracy Declaration', data.declarationAccurate ? 'Confirmed (Truthful & accurate to best of knowledge)' : 'Not Confirmed'],
    ['Program Terms Declaration', data.declarationImmersive ? 'Confirmed (Understands 15-day immersive conditions)' : 'Not Confirmed']
  ];

  autoTable(doc, {
    startY: 42,
    body: tableBody,
    theme: 'grid',
    styles: {
      fontSize: 8.5,
      cellPadding: 3.2,
      lineColor: BORDER_COLOR,
      lineWidth: 0.2,
      textColor: TEXT_DARK,
      valign: 'middle'
    },
    columnStyles: {
      0: { cellWidth: 62, fontStyle: 'bold', fillColor: SOFT_BG },
      1: { cellWidth: 120 }
    },
    margin: { left: 14, right: 14, bottom: 20 },
    didDrawPage: function (dataHook) {
      // Footer on every page
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(7.5);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(130, 130, 130);
      doc.text(
        `DAIRY YATRA Application Dossier | Reference: ${refId} | Page ${dataHook.pageNumber} of ${pageCount}`,
        14,
        290
      );
      doc.text(
        `Confidential & Proprietary • Dairy Yatra Selection Committee`,
        196,
        290,
        { align: 'right' }
      );
    }
  });

  // Save the generated PDF
  const safeName = (data.fullName || 'Candidate').replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Dairy_Yatra_Application_${refId}_${safeName}.pdf`);
}
