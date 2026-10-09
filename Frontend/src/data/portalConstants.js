export const PERSONA_OPTIONS = [
  { id: 'student', label: 'Student', desc: 'Undergraduate, postgraduate, or research scholar' },
  { id: 'entrepreneur', label: 'Entrepreneur', desc: 'Building ventures in agriculture, dairy, or allied areas' },
  { id: 'dairy_farmer', label: 'Dairy Farmer', desc: 'Managing dairy farm operations & cattle management' },
  { id: 'rural_entrepreneur', label: 'Rural Entrepreneur', desc: 'Operating micro-enterprises in rural India' },
  { id: 'startup_founder', label: 'Startup Founder', desc: 'Leading early-stage or growth-stage innovations' },
  { id: 'working_professional', label: 'Working Professional', desc: 'In corporate agri-business, FMCG, or supply chains' },
  { id: 'researcher', label: 'Researcher / Academician', desc: 'Conducting studies in animal sciences, nutrition, or economics' },
  { id: 'consultant', label: 'Consultant / Advisor', desc: 'Advising farm projects, cooperatives, or policy' },
  { id: 'other', label: 'Other', desc: 'Passionate individual exploring the dairy ecosystem' }
];

export const QUALIFICATION_OPTIONS = [
  "High School (10+2)",
  "Diploma / Polytechnic",
  "Bachelor's Degree (B.Tech / B.Sc / B.Com / B.A / BBA / BVSc / Other)",
  "Master's Degree (M.Tech / M.Sc / MBA / MVSc / Other)",
  "Doctorate (Ph.D / Post-Doctoral)",
  "Other"
];

export const INVOLVEMENT_OPTIONS = [
  { id: 'direct_farming', label: 'Directly involved in dairy farming' },
  { id: 'family_business', label: 'Family dairy business / ancestral herd' },
  { id: 'dairy_startup', label: 'Dairy startup / milk value-addition venture' },
  { id: 'agri_business', label: 'Agriculture / agri-business operations' },
  { id: 'agri_tech', label: 'Agri-tech / Farm automation & IoT' },
  { id: 'processing', label: 'Food & dairy processing technology' },
  { id: 'animal_husbandry', label: 'Animal husbandry & veterinary care' },
  { id: 'research', label: 'Research & academia in livestock' },
  { id: 'rural_dev', label: 'Rural development & farmer livelihoods' },
  { id: 'no_direct', label: 'No direct involvement (Curious Explorer)' },
  { id: 'other', label: 'Other' }
];

export const STARTUP_STATUS_OPTIONS = [
  { id: 'running', label: 'Yes, currently running a business / startup' },
  { id: 'building', label: 'Yes, currently building an MVP / prototype' },
  { id: 'idea', label: 'I have a concrete business idea' },
  { id: 'no', label: 'No business at present' }
];

export const HOST_ORGANIZATIONS = [
  {
    id: 'akshayakalpa',
    name: 'Akshayakalpa',
    location: 'Tiptur, Karnataka',
    tagline: 'Certified Organic Dairy & Sustainable Rural Ecosystem',
    logo: '/logos/akshayakalpa.webp'
  },
  {
    id: 'baif',
    name: 'BAIF Development Research Foundation',
    location: 'Karnataka / Maharashtra',
    tagline: 'Livestock Breed Improvement, Silage & Watershed Innovations',
    logo: '/logos/baif.png'
  },
  {
    id: 'gokul',
    name: 'Gokul Dairy / TMR Plant',
    location: 'Kolhapur, Maharashtra',
    tagline: 'Total Mixed Ration Feed Plant & Large Buffalo Milk Cooperative',
    logo: '/logos/gokul.png'
  },
  {
    id: 'baramati',
    name: 'Centre of Excellence in Dairy',
    location: 'Baramati, Maharashtra',
    tagline: 'Indo-Dutch Precision Dairy Farming & Automation Technologies',
    logo: '/logos/coe_baramati.png'
  },
  {
    id: 'govind',
    name: 'Govind Dairy',
    location: 'Phaltan, Maharashtra',
    tagline: 'State-of-the-Art Processing, Ghee, Milk Powder & Supply Chain',
    logo: '/logos/govind.svg'
  },
  {
    id: 'prabhat',
    name: 'Prabhat Dairy',
    location: 'Shrirampur, Maharashtra',
    tagline: 'Modern Dairy Infrastructure, Lactalis Quality Standards & Logistics',
    logo: '/logos/prabhat.png'
  },
  {
    id: 'nddb',
    name: 'National Dairy Development Board (NDDB)',
    location: 'Anand, Gujarat',
    tagline: 'Birthplace of White Revolution, Dairy Policy & Research Labs',
    logo: '/logos/nddb.png'
  },
  {
    id: 'mrida',
    name: 'Mrida, NDDB',
    location: 'Anand, Gujarat',
    tagline: 'Dung Management, Biogas Initiatives & Rural Circular Economy',
    logo: '/logos/nddb.png'
  },
  {
    id: 'nrcc',
    name: 'ICAR – National Research Centre on Camel',
    location: 'Bikaner, Rajasthan',
    tagline: 'Camel Milk Nutrition, Desert Ecosystem & Value-Added Products',
    logo: '/logos/nrcc.webp'
  },
  {
    id: 'saras',
    name: 'Saras Dairy',
    location: 'Bikaner, Rajasthan',
    tagline: 'Apex Cooperative of Rajasthan (RCDF) & Arid Dairy Distribution',
    logo: '/logos/banas.png'
  }
];

export const INITIAL_APPLICATION_STATE = {
  // Step 01: About You
  fullName: '',
  dob: '',
  age: '',
  gender: '',
  mobile: '',
  whatsapp: '',
  sameAsMobile: true,
  email: '',
  city: '',
  state: '',
  address: '',

  // Step 02: Your Background
  primaryRole: '',
  highestQualification: '',
  degree: '',
  specialization: '',
  institution: '',
  graduationYear: '',

  // Step 03: Connection with Dairy
  currentInvolvement: '',
  involvementNarrative: '',

  // Step 04: Experience
  priorImmersion: '',
  priorImmersionDetails: '',
  priorDairyYatraEdition: '',

  // Step 05: Entrepreneurship
  startupStatus: '',
  startupName: '',
  problemSolved: '',
  businessModel: '',
  portfolioUrl: '',

  // Step 06: Why Dairy Yatra
  whyDairyYatra: '',
  learningGoals: '',
  selectedOrganizations: [],
  visitLearningInterest: '',

  // Step 07: Journey Readiness
  comfort15Days: '',
  comfortTrain: '',
  comfortRural: '',
  comfortFlexibleSchedule: '',

  // Step 08: Travel Essentials & Final Declaration
  dietaryPreference: '',
  dietaryDetails: '',
  foodAllergies: '',
  allergyDetails: '',
  oneKeyGoal: '',
  declarationAccurate: false,
  declarationImmersive: false
};
