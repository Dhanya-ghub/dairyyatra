export const PROGRAM_STATS = {
  durationDays: 15,
  statesCount: 5,
  entrepreneursCount: 40,
  distanceKm: '6,000+',
  hostInstitutions: '15+',
  learningHours: '150+'
};

// Route stops aligned with the provided India Map graphic & prompt text
export const ROUTE_STOPS = [
  {
    id: 'coimbatore-start',
    day: 'Day 1',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    title: 'Journey Begins',
    institution: 'Yatra Flagoff Base',
    modeToNext: 'Train',
    transportIcon: 'train',
    mapX: 34.5, // relative percentage position on uploaded map graphic
    mapY: 82.5,
    heroImage: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1200&q=80',
    description: 'Set learning goals and expectations for the experiential journey across India. Orientation and boarding the Special Yatra Train.',
    learnings: [
      'Orientation and cohort bonding among 40 selected entrepreneurs',
      'Establishing learning frameworks for milk supply chains and rural systems',
      'Briefing on logistical safety, physical wellness, and daily journal compilation'
    ]
  },
  {
    id: 'tiptur',
    day: 'Days 2 - 3',
    city: 'Tiptur',
    state: 'Karnataka',
    title: 'Organic Dairying & Breed Research',
    institution: 'Akshayakalpa Farm & BAIF Development Research Foundation',
    modeToNext: 'Train',
    transportIcon: 'train',
    mapX: 30.5,
    mapY: 76.5,
    heroImage: 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=1200&q=80',
    description: 'Explore organic dairy farming, chemical-free production, direct farm-to-consumer models at Akshayakalpa, and innovative breed & fodder development at BAIF.',
    learnings: [
      'Understand ethical animal husbandry & organic supply chain management',
      'Examine integrated dairy and vegetable production models',
      'Explore BAIF model of livestock genetic improvement & watershed management'
    ]
  },
  {
    id: 'kolhapur',
    day: 'Days 4 - 5',
    city: 'Kolhapur',
    state: 'Maharashtra',
    title: 'Total Mixed Ration (TMR) & Buffalo Dairying',
    institution: 'TMR Plant of Gokul Dairy',
    modeToNext: 'Train',
    transportIcon: 'train',
    mapX: 25.5,
    mapY: 65.5,
    heroImage: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=1200&q=80',
    description: 'Witness technological innovation in dairy feed management at Gokul Dairy TMR Plant, buffalo farming dynamics, and local milk culture.',
    learnings: [
      'Gain insights into Total Mixed Ration (TMR) precision cattle nutrition',
      'Study buffalo farming economics and high-fat milk processing',
      'Cultural immersion into Maharashtra pastoral dairy traditions'
    ]
  },
  {
    id: 'baramati',
    day: 'Day 6',
    city: 'Baramati',
    state: 'Maharashtra',
    title: 'Centre of Excellence in Dairy',
    institution: 'Centre of Excellence in Dairy, Baramati',
    modeToNext: 'Train',
    transportIcon: 'train',
    mapX: 27.5,
    mapY: 60.5,
    heroImage: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1200&q=80',
    description: 'Examine cutting-edge research, automated milking systems, integrated dairy production models, and farmer training infrastructure.',
    learnings: [
      'Latest scientific advancements in herd health and precision farming',
      'Hands-on observation of automated parlor machinery and climate control sheds',
      'Institutional frameworks for training smallholder farmers at scale'
    ]
  },
  {
    id: 'phaltan',
    day: 'Day 7',
    city: 'Phaltan',
    state: 'Maharashtra',
    title: 'Farmer Empowerment & Hydroponics',
    institution: 'Govind Dairy',
    modeToNext: 'Train',
    transportIcon: 'train',
    mapX: 28.5,
    mapY: 57.5,
    heroImage: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=1200&q=80',
    description: 'Gain insights into holistic farmer empowerment initiatives including hydroponic fodder cultivation, loose housing barn design, and village milk collection.',
    learnings: [
      'Hydroponic green fodder production for drought resilience',
      'Loose housing cattle management improving cow comfort and milk yield',
      'Community trust models in rural milk collection centers'
    ]
  },
  {
    id: 'shrirampur',
    day: 'Day 8',
    city: 'Shrirampur',
    state: 'Maharashtra',
    title: 'Value Chain Integration',
    institution: 'Prabhat Dairy',
    modeToNext: 'Train',
    transportIcon: 'train',
    mapX: 29.5,
    mapY: 54.5,
    heroImage: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1200&q=80',
    description: 'Understand value chain integration, commercial breeding farms, market-oriented enterprise structures, and value-added dairy product lines.',
    learnings: [
      'Scale economics in skimmed milk powder (SMP) and cheese manufacturing',
      'Integration of small-holder procurement networks into commercial supply chains',
      'Breeding farm protocols for high-yield dairy genetics'
    ]
  },
  {
    id: 'anand',
    day: 'Days 9 - 11',
    city: 'Anand',
    state: 'Gujarat',
    title: 'Milk Capital & Bio-Economy',
    institution: 'National Dairy Development Board (NDDB) & Mrida',
    modeToNext: 'Train',
    transportIcon: 'train',
    mapX: 22.5,
    mapY: 46.5,
    heroImage: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1200&q=80',
    description: 'Visit the epicenter of India’s White Revolution. Explore NDDB policy, extension mechanisms, small-scale processing efficiency, and Mrida bio-gas manure value chain.',
    learnings: [
      'Cooperative movement legacy and national dairy policy frameworks',
      'Small-scale processing unit efficiency for localized micro-entrepreneurs',
      'Dung-to-wealth bio-gas and organic fertilizer circular models at Mrida'
    ]
  },
  {
    id: 'bikaner',
    day: 'Days 12 - 13',
    city: 'Bikaner',
    state: 'Rajasthan',
    title: 'Alternative Dairying & Arid Farming',
    institution: 'ICAR-NRC on Camel & Saras Dairy',
    modeToNext: 'Train',
    transportIcon: 'train',
    mapX: 20.5,
    mapY: 29.5,
    heroImage: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1200&q=80',
    description: 'Explore camel and donkey dairy innovations, therapeutic milk processing at ICAR-NRCC, and drought-resilient dairy farming under desert conditions at Saras Dairy.',
    learnings: [
      'Commercial potential and health benefits of Camel & Donkey milk products',
      'Cold chain resilience and water scarcity management in desert dairying',
      'Integration of sheep and wool production systems with pastoral cattle'
    ]
  },
  {
    id: 'jaipur',
    day: 'Day 14',
    city: 'Jaipur',
    state: 'Rajasthan',
    title: 'Synthesize & Valedictory Session',
    institution: 'Jaipur Regional Synthesis Hub',
    modeToNext: 'Flight',
    transportIcon: 'flight',
    mapX: 27.5,
    mapY: 34.5,
    heroImage: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1200&q=80',
    description: 'Synthesize key learnings, reflect on regional diversity, and host the formal Valedictory Program in traditional national attire.',
    learnings: [
      'Cross-state comparison of dairy business models and productivity metrics',
      'Business proposal ideation and peer pitch session',
      'Valedictory celebration & compilation of Yatra Coffee Table Book'
    ]
  },
  {
    id: 'coimbatore-return',
    day: 'Day 15',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    title: 'Return Journey & Knowledge Application',
    institution: 'Yatra Conclusion',
    modeToNext: 'Done',
    transportIcon: 'check_circle',
    mapX: 34.5,
    mapY: 82.5,
    heroImage: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1200&q=80',
    description: 'Return flight to Coimbatore. Consolidate experiences, action plans for venture execution, and ongoing alumni network launch.',
    learnings: [
      'Drafting post-Yatra venture execution roadmap',
      'Forming long-term partnerships among 40 entrepreneur alumni',
      'Final submission of travel journals, sketches, and photographic documentation'
    ]
  }
];

// Hand-calibrated native pixel coordinates from Journey map
export const CANVAS_CITIES = [
  { name: "Coimbatore", state: "Tamil Nadu",   nx: 525.2, ny: 1420.5, stopIndex: 0, day: "Day 1" },
  { name: "Tiptur",     state: "Karnataka",    nx: 488.1, ny: 1331.9, stopIndex: 1, day: "Days 2 - 3" },
  { name: "Kolhapur",   state: "Maharashtra",  nx: 382.9, ny: 1098.4, stopIndex: 2, day: "Days 4 - 5" },
  { name: "Baramati",   state: "Maharashtra",  nx: 422.2, ny: 1000.5, stopIndex: 3, day: "Day 6" },
  { name: "Phaltan",    state: "Maharashtra",  nx: 417.9, ny: 1011.3, stopIndex: 4, day: "Day 7" },
  { name: "Shrirampur", state: "Maharashtra",  nx: 435.7, ny: 939.5,  stopIndex: 5, day: "Day 8" },
  { name: "Anand",      state: "Gujarat",      nx: 337.3, ny: 792.2,  stopIndex: 6, day: "Days 9 - 11" },
  { name: "Bikaner",    state: "Rajasthan",    nx: 358.2, ny: 487.3,  stopIndex: 7, day: "Days 12 - 13" },
  { name: "Jaipur",     state: "Rajasthan",    nx: 474.4, ny: 551.0,  stopIndex: 8, day: "Day 14" },
];
/* Drop-in replacement for FULL_ITINERARY in ../data/yatraData.js
   Source: Dairy Yatra 2025 brochure (Travel Plan table + route map).
   Transport rule taken from the brochure map:
     - rail route: Coimbatore -> Tiptur -> Kolhapur -> Baramati/Phaltan/Shrirampur -> Anand -> Bikaner
     - flight: Jaipur -> Coimbatore (return)
   Days spent at the same place as the day before are "Local Transit". */
export const FULL_ITINERARY = [
  { day: 1,  location: 'Coimbatore, Tamil Nadu',  institution: 'Journey Begins', objective: 'Set learning goals and expectations', transport: 'Train' },
  { day: 2,  location: 'Tiptur, Karnataka',       institution: 'Akshayakalpa Farm', objective: 'Understand organic dairy farming and integrated models of dairy and vegetable production', transport: 'Train' },
  { day: 3,  location: 'Tiptur, Karnataka',       institution: 'BAIF Development Research Foundation', objective: 'Explore innovative breed development and fodder development strategies', transport: 'Local Transit' },
  { day: 4,  location: 'Kolhapur, Maharashtra',   institution: 'Travel & Cultural Immersion', objective: 'Reflect on local culture and context in dairy practices', transport: 'Train' },
  { day: 5,  location: 'Kolhapur, Maharashtra',   institution: 'Businesses / Farms (Gokul Dairy TMR Plant)', objective: 'Learn about Total Mixed Ration (TMR) production and its role in balanced feeding, learn buffalo farming', transport: 'Local Transit' },
  { day: 6,  location: 'Baramati, Maharashtra',   institution: 'Centre of Excellence in Dairy', objective: 'Examine integrated models for dairy production and training', transport: 'Train' },
  { day: 7,  location: 'Phaltan, Maharashtra',    institution: 'Govind Dairy', objective: 'Gain insights into farmer empowerment initiatives including TMR, Hydroponics, Loose housing models', transport: 'Train' },
  { day: 8,  location: 'Shrirampur, Maharashtra', institution: 'Prabhat Dairy', objective: 'Understand value chain integration and market-oriented dairy enterprise (TMR, Breeding farms)', transport: 'Train' },
  { day: 9,  location: 'Anand, Gujarat',          institution: 'National Dairy Development Board', objective: "Explore NDDB's farmer support services and extension mechanisms, small scale processing unit efficiency", transport: 'Train' },
  { day: 10, location: 'Anand, Gujarat',          institution: 'Mrida, NDDB', objective: 'Understand manure management and value chain for sustainable dairying', transport: 'Local Transit' },
  { day: 11, location: 'Anand, Gujarat',          institution: 'Travel & Cultural Immersion', objective: 'Observe regional practices and engage in reflective learning', transport: 'Local Transit' },
  { day: 12, location: 'Bikaner, Rajasthan',      institution: 'ICAR - NRCC on Camel', objective: 'Learn about alternative dairy opportunities from camels and donkeys', transport: 'Train' },
  { day: 13, location: 'Bikaner, Rajasthan',      institution: 'Saras Dairy', objective: 'Explore drought-resilient dairy farming practices in arid zones', transport: 'Local Transit' },
  { day: 14, location: 'Jaipur, Rajasthan',       institution: 'Wrap-Up & Cultural Immersion', objective: 'Synthesize key learnings and reflect on regional diversity in dairy', transport: 'Train' },
  { day: 15, location: 'Coimbatore, Tamil Nadu',  institution: 'Return Journey', objective: 'Consolidate experiences and plan for knowledge application', transport: 'Flight' },
];

export const HOST_ORGANIZATIONS = [
  {
    name: 'Akshayakalpa Organic Farm',
    location: 'Tiptur, Karnataka',
    tag: 'Organic & Farm-to-Consumer',
    logo: '/logos/akshayakalpa.webp',
    image: 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=800&q=80',
    description: 'A pioneer in chemical-free, ethical organic dairy farming and direct consumer delivery. Participants witness sustainable soil-to-milk practices and supply chain technology.'
  },
  {
    name: 'BAIF Development Research Foundation',
    location: 'Tiptur, Karnataka',
    tag: 'Livestock Genetics & Livelihoods',
    logo: '/logos/baif.jpg',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=800&q=80',
    description: 'Leader in rural development through cattle genetic improvement, artificial insemination networks, watershed management, and smallholder empowerment.'
  },
  {
    name: 'TMR Plant of Gokul Dairy',
    location: 'Kolhapur, Maharashtra',
    tag: 'Precision Nutrition & TMR',
    logo: '/logos/gokul.jpg',
    image: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=800&q=80',
    description: 'High-tech processing center utilizing Total Mixed Ration (TMR) technology to optimize cattle feed efficiency and enhance milk yield across Maharashtra.'
  },
  {
    name: 'Centre of Excellence in Dairy',
    location: 'Baramati, Maharashtra',
    tag: 'Scientific Research & Training',
    logo: '/logos/coe_baramati.jpg',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=800&q=80',
    description: 'Premier institutional campus showcasing state-of-the-art parlor automation, herd health management, and modern extension training frameworks.'
  },
  {
    name: 'Govind Dairy',
    location: 'Phaltan, Maharashtra',
    tag: 'Hydroponics & Loose Housing',
    logo: '/logos/govind.svg',
    image: 'https://images.unsplash.com/photo-1595855759920-86582396756a?auto=format&fit=crop&w=800&q=80',
    description: 'Model dairy focusing on farmer welfare through green hydroponic fodder, loose housing cattle barn design, and micro-collection transparency.'
  },
  {
    name: 'Prabhat Dairy',
    location: 'Shrirampur, Maharashtra',
    tag: 'Value Chain & Processing',
    logo: '/logos/prabhat.png',
    image: 'https://images.unsplash.com/photo-1589923188900-85dae523342b?auto=format&fit=crop&w=800&q=80',
    description: 'Market-oriented commercial dairy enterprise specializing in Skimmed Milk Powder (SMP), cheese manufacturing, and smallholder procurement integration.'
  },
  {
    name: 'NDDB & Amul Cooperative',
    location: 'Anand, Gujarat',
    tag: 'Apex Dairy Institution',
    logo: '/logos/amul.svg',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=800&q=80',
    description: 'The standard-bearer of India’s White Revolution. Focus on cooperative governance, small-scale processing innovation, and national milk policy.'
  },
  {
    name: 'ICAR - NRC on Camel',
    location: 'Bikaner, Rajasthan',
    tag: 'Alternative Dairying & Research',
    logo: '/logos/nrcc.webp',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=800&q=80',
    description: 'World-renowned research facility developing camel and donkey milk commercialization, medicinal value chains, and desert livestock breeding.'
  },
  {
    name: 'Banas Dairy (Asia’s Largest Union)',
    location: 'Gujarat',
    tag: 'Mega Cooperative Union',
    logo: '/logos/banas.jpg',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=800&q=80',
    description: 'Asia’s largest milk producer union and cooperative powerhouse, leading high-capacity chilling, cold chain resilience, and diversification.'
  }
];

export const PACKING_ITEMS = [
  { id: 'p1', category: 'Outerwear', item: 'Waterproof jacket x 1', mandatory: true },
  { id: 'p2', category: 'Outerwear', item: 'Sweater / Warm jacket x 1 (10°C weather)', mandatory: true },
  { id: 'p3', category: 'Clothing', item: 'Comfortable T-shirts / Tops', mandatory: false },
  { id: 'p4', category: 'Clothing', item: 'Jeans / Comfortable trousers', mandatory: false },
  { id: 'p5', category: 'Clothing', item: 'Salwar Kameez (for female Yatris)', mandatory: false },
  { id: 'p6', category: 'Attire', item: 'National attire x 1 set (Kurta-Churidar, Sari, etc. for Valedictory)', mandatory: true },
  { id: 'p7', category: 'Footwear', item: 'Comfortable walking shoes & train slippers', mandatory: true },
  { id: 'p8', category: 'Accessories', item: 'Cap, Sunglasses & Warm Shawl x 1', mandatory: false },
  { id: 'p9', category: 'Utensils', item: 'Reusable personal Spoon & Tea/Coffee Mug (Zero Plastic policy)', mandatory: true },
  { id: 'p10', category: 'Hygiene & Health', item: 'Prescribed Personal Medications & Mosquito Repellent', mandatory: true },
  { id: 'p11', category: 'Utilities', item: 'Torch / Flashlight & Power Bank', mandatory: true },
  { id: 'p12', category: 'Documentation', item: 'Journal / Sketchpad (Provided on train) & Personal Pen', mandatory: false }
];
