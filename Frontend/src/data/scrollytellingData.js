export const JOURNEY_CHAPTERS = [
  {
    id: 'ch-1',
    chapterNum: '01',
    chapterTitle: 'THE BEGINNING',
    dayRange: 'Day 1',
    state: 'Tamil Nadu',
    shortLocation: 'Coimbatore',
    stopsCount: 1,
    startDay: 1,
    endDay: 1
  },
  {
    id: 'ch-2',
    chapterNum: '02',
    chapterTitle: 'A DIFFERENT WAY OF FARMING',
    dayRange: 'Days 2–3',
    state: 'Karnataka',
    shortLocation: 'Karnataka',
    stopsCount: 1,
    startDay: 2,
    endDay: 3
  },
  {
    id: 'ch-3',
    chapterNum: '03',
    chapterTitle: 'THE FARMER ECOSYSTEM',
    dayRange: 'Days 4–8',
    state: 'Maharashtra',
    shortLocation: 'Maharashtra',
    stopsCount: 3,
    startDay: 4,
    endDay: 8
  },
  {
    id: 'ch-4',
    chapterNum: '04',
    chapterTitle: 'UNDERSTANDING THE SYSTEM',
    dayRange: 'Days 9–11',
    state: 'Gujarat',
    shortLocation: 'Gujarat',
    stopsCount: 1,
    startDay: 9,
    endDay: 11
  },
  {
    id: 'ch-5',
    chapterNum: '05',
    chapterTitle: 'ADAPTING TO THE LAND',
    dayRange: 'Days 12–14',
    state: 'Rajasthan',
    shortLocation: 'Rajasthan',
    stopsCount: 2,
    startDay: 12,
    endDay: 14
  },
  {
    id: 'ch-6',
    chapterNum: '06',
    chapterTitle: 'THE JOURNEY HOME',
    dayRange: 'Day 15',
    state: 'Tamil Nadu',
    shortLocation: 'Coimbatore',
    stopsCount: 1,
    startDay: 15,
    endDay: 15
  }
];

export const JOURNEY_STOPS = [
  {
    id: 'stop-1',
    chapterId: 'ch-1',
    chapterIndex: 0,
    chapterNum: 'CHAPTER 01',
    chapterTheme: 'THE BEGINNING',
    dayNumber: '01',
    dayLabel: 'DAY 01',
    dayFullRange: 'Day 1 of 15',
    locationName: 'COIMBATORE',
    stateName: 'Tamil Nadu',
    regionTag: 'Western Ghats Foothills',
    headline: 'The Gathering of 40 Visionaries',
    institution: 'Yatra Flagoff Base · Special Train Departure',
    quote: '"Every transformational movement begins with a single step into the unknown."',
    storyText: 'In the agricultural heartland of Tamil Nadu, 40 selected entrepreneurs, researchers, and agritech founders assemble for orientation. Setting learning frameworks for India’s milk economy, our cohort boards the Special Dairy Yatra Train to begin a 6,000-kilometer immersion.',
    extendedDescription: 'The inaugural day centers on cohort alignment, orientation on rural research methodologies, and safety briefings. Participants are equipped with field sketchpads to begin documenting India’s dairy future.',
    image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?auto=format&fit=crop&w=1600&q=85',
    imageCaption: 'Coimbatore Flag-off Base & Western Ghats Foothills',
    travelMode: 'Special Yatra Train',
    distanceKm: '0 KM',
    weather: '26°C Pleasant',
    keyThemes: [
      'Cohort Onboarding & Orientation',
      'Rural Supply Chain Frameworks',
      'Experiential Journaling Briefing',
      'Inter-Disciplinary Founder Bonding'
    ],
    immersionHighlights: [
      'Special Dairy Yatra Train flag-off ceremony',
      'Cohort goal-setting and field methodology session',
      'Distribution of official field documentation kit & sketchbooks'
    ]
  },
  {
    id: 'stop-2',
    chapterId: 'ch-2',
    chapterIndex: 1,
    chapterNum: 'CHAPTER 02',
    chapterTheme: 'A DIFFERENT WAY OF FARMING',
    dayNumber: '02',
    dayLabel: 'DAYS 02–03',
    dayFullRange: 'Days 2–3 of 15',
    locationName: 'KARNATAKA',
    stateName: 'Tiptur & Bengaluru',
    regionTag: 'Deccan Agro-Climatic Zone',
    headline: 'A Different Way of Farming',
    institution: 'Akshayakalpa Organic Farm & BAIF Institute',
    quote: '"True sustainability is not a marketing tag; it is the biology of healthy soil feeding healthy herds."',
    storyText: 'Stepping into Akshayakalpa, yatris witness chemical-free organic milk production, automated robotic milking systems, and ethical loose-housing pasture stewardship. At BAIF, we investigate genetic breed improvement and fodder security empowering smallholders.',
    extendedDescription: 'Akshayakalpa pioneers direct-to-consumer organic dairy with zero antibiotics and synthetic hormones. Yatris explore farm microbiology, decentralized chilling tech, and BAIF’s artificial insemination outreach models.',
    image: 'https://images.unsplash.com/photo-1546445317-29f4545f9d52?auto=format&fit=crop&w=1600&q=85',
    imageCaption: 'Akshayakalpa Pasture & Ethical Dairy Facility, Tiptur',
    travelMode: 'Farm Walk & Local Transit',
    distanceKm: '480 KM',
    weather: '24°C Sunny',
    keyThemes: [
      'Chemical-Free Organic Production',
      'Robotic Parlor Automation',
      'BAIF Breed Genetics (BISLD)',
      'Integrated Agro-Forestry Systems'
    ],
    immersionHighlights: [
      'Interactive inspection of automatic milking units & soil health labs',
      'BAIF livestock genetics & watershed development seminar',
      'Direct farm-to-consumer cold chain economics masterclass'
    ]
  },
  {
    id: 'stop-3',
    chapterId: 'ch-3',
    chapterIndex: 2,
    chapterNum: 'CHAPTER 03',
    chapterTheme: 'THE FARMER ECOSYSTEM',
    dayNumber: '04',
    dayLabel: 'DAYS 04–05',
    dayFullRange: 'Days 4–5 of 15',
    locationName: 'KOLHAPUR',
    stateName: 'Maharashtra',
    regionTag: 'Southern Maharashtra Milk Belt',
    headline: 'Precision Nutrition & Buffalo Economics',
    institution: 'Gokul Dairy TMR Plant (Kolhapur Union)',
    quote: '"Feed precision is the highest leverage point in dairy productivity and cow longevity."',
    storyText: 'At Gokul Dairy’s high-tech facility, we dissect Total Mixed Ration (TMR) technology—scientifically homogenizing roughage, concentrates, and minerals into optimized feed pellets. We also examine indigenous buffalo dairying economics and high-fat processing.',
    extendedDescription: 'Kolhapur is the heartland of Maharashtra’s cooperative vitality. Yatris inspect high-capacity TMR automated blending towers and visit cooperative village milk collection centers.',
    image: 'https://images.unsplash.com/photo-1527153857715-3908f2bae5e8?auto=format&fit=crop&w=1600&q=85',
    imageCaption: 'High-Tech Feed Milling & Gokul Dairy Operations, Kolhapur',
    travelMode: 'Express Train & Plant Tour',
    distanceKm: '1,120 KM',
    weather: '23°C Crisp',
    keyThemes: [
      'Total Mixed Ration (TMR) Science',
      'Buffalo Dairy Fat Optimization',
      'Cooperative Union Logistics',
      'Pastoral Cultural Immersion'
    ],
    immersionHighlights: [
      'Walkthrough of Gokul TMR automated mixing & distribution plant',
      'Buffalo herd genetics and high-fat milk economics breakdown',
      'Field dialogues with multigenerational dairy farmers in Shirol'
    ]
  },
  {
    id: 'stop-4',
    chapterId: 'ch-3',
    chapterIndex: 2,
    chapterNum: 'CHAPTER 03',
    chapterTheme: 'THE FARMER ECOSYSTEM',
    dayNumber: '06',
    dayLabel: 'DAYS 06–07',
    dayFullRange: 'Days 6–7 of 15',
    locationName: 'BARAMATI & PHALTAN',
    stateName: 'Maharashtra',
    regionTag: 'Western Ghats Rainshadow',
    headline: 'Hydroponics & Loose Housing Innovation',
    institution: 'Centre of Excellence in Dairy & Govind Dairy',
    quote: '"Designing cattle shelters for comfort and dignity directly elevates reproductive efficiency."',
    storyText: 'Exploring Baramati’s Centre of Excellence reveals precision climate sheds and automated health-tracking IoT sensors. In Phaltan, Govind Dairy illustrates farmer empowerment models, loose-housing barn architecture, and year-round hydroponic green fodder.',
    extendedDescription: 'Understanding drought resilience in rainshadow belts. Yatris study low-water hydroponic fodder trays generating 10x biomass per liter of water compared to open cultivation.',
    image: 'https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=1600&q=85',
    imageCaption: 'Centre of Excellence Dairy Campus & Hydroponic Sheds',
    travelMode: 'AC Coach Transit',
    distanceKm: '1,580 KM',
    weather: '25°C Dry',
    keyThemes: [
      'Hydroponic Green Fodder Tech',
      'Loose Housing Animal Welfare',
      'Automated Milking Parlors',
      'Village-Level Trust Networks'
    ],
    immersionHighlights: [
      'Hands-on hydroponic tray setup & yield calculations',
      'Live demonstration of rotary milking parlor & cow pedometers',
      'Govind Dairy micro-procurement transparency systems review'
    ]
  },
  {
    id: 'stop-5',
    chapterId: 'ch-3',
    chapterIndex: 2,
    chapterNum: 'CHAPTER 03',
    chapterTheme: 'THE FARMER ECOSYSTEM',
    dayNumber: '08',
    dayLabel: 'DAY 08',
    dayFullRange: 'Day 8 of 15',
    locationName: 'SHRIRAMPUR',
    stateName: 'Maharashtra',
    regionTag: 'Ahmednagar District',
    headline: 'Commercial Scale & Value Addition',
    institution: 'Prabhat Dairy Commercial Hub',
    quote: '"Scalability requires bridging smallholder reliability with stringent international product standards."',
    storyText: 'Understanding commercial market-oriented dairy enterprises. Prabhat Dairy showcases large-scale Skimmed Milk Powder (SMP) processing, industrial cheese manufacturing, and breeding farms connected to thousands of rural collection points.',
    extendedDescription: 'A masterclass in industrial processing economics, by-product monetization, cold chain logistics, and contract dairy farming structures for fast-growing FMCG consumer brands.',
    image: 'https://images.unsplash.com/photo-1574943320219-553eb213f72d?auto=format&fit=crop&w=1600&q=85',
    imageCaption: 'Industrial Dairy Processing & Cheese Manufacturing Facility',
    travelMode: 'Express Coach',
    distanceKm: '1,980 KM',
    weather: '27°C Sunny',
    keyThemes: [
      'Skimmed Milk Powder (SMP) Plants',
      'Value-Added Cheese Lines',
      'FMCG Dairy Product Distribution',
      'Breeding Farm Genetics Protocols'
    ],
    immersionHighlights: [
      'Walkthrough of vacuum evaporation & spray drying SMP towers',
      'Value-added dairy product development and packaging lines',
      'FMCG market entry strategies and export compliance discussion'
    ]
  },
  {
    id: 'stop-6',
    chapterId: 'ch-4',
    chapterIndex: 3,
    chapterNum: 'CHAPTER 04',
    chapterTheme: 'UNDERSTANDING THE SYSTEM',
    dayNumber: '09',
    dayLabel: 'DAYS 09–11',
    dayFullRange: 'Days 9–11 of 15',
    locationName: 'GUJARAT',
    stateName: 'Anand & Kheda',
    regionTag: 'The Milk Capital of India',
    headline: 'Understanding the System',
    institution: 'NDDB (National Dairy Development Board) & Mrida',
    quote: '"Operation Flood proved that when farmers own the value chain, national prosperity follows."',
    storyText: 'Entering the historic cradle of India’s White Revolution in Anand. We explore NDDB national policy frameworks, micro-scale processing unit efficiency, and Mrida’s circular manure bio-economy turning cattle dung into bio-gas, electricity, and organic fertilizers.',
    extendedDescription: 'Anand represents the institutional backbone of Indian dairying. Yatris discover how Dr. Kurien’s cooperative model scaled to 18+ million farmers and how NDDB’s Mrida initiative creates second-stream farm revenue.',
    image: 'https://images.unsplash.com/photo-1560493676-04071c5f467b?auto=format&fit=crop&w=1600&q=85',
    imageCaption: 'National Dairy Development Board Campus & Anand Heritage',
    travelMode: 'Inter-State Train Immersion',
    distanceKm: '2,850 KM',
    weather: '22°C Clear',
    keyThemes: [
      'The Amul & NDDB Cooperative Model',
      'Manure-to-Wealth (Mrida Bio-Gas)',
      'National Milk Grid & Policy',
      'Smallholder Processing Efficiency'
    ],
    immersionHighlights: [
      'Exclusive policy briefing with NDDB leadership',
      'Field inspection of village-scale bio-CNG bottling facilities',
      'White Revolution heritage archive and cooperative museum tour'
    ]
  },
  {
    id: 'stop-7',
    chapterId: 'ch-5',
    chapterIndex: 4,
    chapterNum: 'CHAPTER 05',
    chapterTheme: 'ADAPTING TO THE LAND',
    dayNumber: '12',
    dayLabel: 'DAYS 12–13',
    dayFullRange: 'Days 12–13 of 15',
    locationName: 'BIKANER',
    stateName: 'Rajasthan',
    regionTag: 'Thar Desert Arid Zone',
    headline: 'Adapting to the Land',
    institution: 'ICAR-NRC on Camel & Saras Dairy',
    quote: '"In the desert, every drop of milk is an evolutionary marvel of climate resilience."',
    storyText: 'Deep in the Thar Desert, yatris examine alternative dairy species. At ICAR-NRCC Bikaner, we unlock the commercial and medicinal value of camel and donkey milk. Saras Dairy demonstrates cold chain mastery and livestock water resilience in extreme temperatures.',
    extendedDescription: 'Exploring alternative dairy science: camel milk is naturally low in lactose and rich in immunoglobulins. Yatris study desert pastoralist livelihoods, sheep-goat-camel mixed systems, and freeze-drying technology.',
    image: 'https://images.unsplash.com/photo-1509099836639-18ba1795216d?auto=format&fit=crop&w=1600&q=85',
    imageCaption: 'ICAR National Research Centre on Camel & Thar Pastoralists',
    travelMode: 'Desert Express Train',
    distanceKm: '4,100 KM',
    weather: '16°C Desert Chill',
    keyThemes: [
      'Camel & Donkey Milk Therapeutics',
      'Extreme Climate Cold Chains',
      'Pastoralist Pastoral Economics',
      'Arid Zone Fodder Conservation'
    ],
    immersionHighlights: [
      'Tasting and processing demonstration of therapeutic camel milk',
      'Visit to ICAR camel breeding research yards and genetics labs',
      'Saras Dairy desert milk chilling & insulated bulk transport tour'
    ]
  },
  {
    id: 'stop-8',
    chapterId: 'ch-5',
    chapterIndex: 4,
    chapterNum: 'CHAPTER 05',
    chapterTheme: 'ADAPTING TO THE LAND',
    dayNumber: '14',
    dayLabel: 'DAY 14',
    dayFullRange: 'Day 14 of 15',
    locationName: 'JAIPUR',
    stateName: 'Rajasthan',
    regionTag: 'The Pink City',
    headline: 'The Grand Synthesis & Valedictory Session',
    institution: 'Jaipur Regional Synthesis Hub',
    quote: '"We entered as 40 individuals; we return as the vanguard of India’s dairy renaissance."',
    storyText: 'Gathering in royal Jaipur dressed in traditional national attire, the 40 yatris pitch cross-state collaborative ventures, synthesize insights from 5 states, and celebrate the compilation of the official Yatra Coffee Table Book.',
    extendedDescription: 'A celebratory, high-energy capstone evening. Venture ideas spanning agritech IoT, bio-fertilizers, camel milk freeze-drying, and TMR cooperatives are presented to mentors and industry dignitaries.',
    image: 'https://images.unsplash.com/photo-1477587458883-47145ed94245?auto=format&fit=crop&w=1600&q=85',
    imageCaption: 'Valedictory Synthesis Evening & National Attire Celebration, Jaipur',
    travelMode: 'Royal Heritage Transit',
    distanceKm: '4,850 KM',
    weather: '18°C Evening Breeze',
    keyThemes: [
      'Venture Idea Pitch Session',
      'Cross-State Policy Comparison',
      'Coffee Table Book Archival',
      'Valedictory Gala in National Attire'
    ],
    immersionHighlights: [
      'Formal venture pitch & peer-review round with dairy executives',
      'Valedictory dinner and certificate presentation',
      'Final submission of travel memoirs, photographs, and field sketches'
    ]
  },
  {
    id: 'stop-9',
    chapterId: 'ch-6',
    chapterIndex: 5,
    chapterNum: 'CHAPTER 06',
    chapterTheme: 'THE JOURNEY HOME',
    dayNumber: '15',
    dayLabel: 'DAY 15',
    dayFullRange: 'Day 15 of 15',
    locationName: 'COIMBATORE',
    stateName: 'Tamil Nadu',
    regionTag: 'Full Circle · 6,000+ KM Traversed',
    headline: '15 DAYS · 5 STATES · ONE JOURNEY',
    institution: 'National Knowledge Consolidation & Alumni Launch',
    quote: '"The journey ends. The learning continues."',
    storyText: 'Return flight to Coimbatore. Traversing 5 states, 15+ world-class institutions, and 150+ hours of field immersion, our 40 founders return home united. The physical travel ends, but the collective work to transform India’s rural economy begins today.',
    extendedDescription: 'The culmination of Dairy Yatra. The 40 alumni form lifelong collaborative syndicates, accessing incubation support, seed funding networks, and annual alumni reunions.',
    image: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=1600&q=85',
    imageCaption: 'Sunrise over Indian Farmland · The Dawn of New Ventures',
    travelMode: 'Flight Return to Coimbatore',
    distanceKm: '6,000+ KM',
    weather: '26°C Welcoming',
    keyThemes: [
      '15 Days · 5 States · 40 Founders',
      'Lifelong Collaborative Syndicate',
      'National Published Coffee Table Book',
      'Ongoing Incubation & Venture Execution'
    ],
    immersionHighlights: [
      'Arrival back at Coimbatore origin base',
      'Signing of the national Dairy Yatra Charter',
      'Official launch of the Dairy Yatra Founder Alumni Network'
    ]
  }
];

export const TIMELINE_NODES = [
  { stopIndex: 0, label: 'Coimbatore', dayText: 'Day 1', stateText: 'Tamil Nadu' },
  { stopIndex: 1, label: 'Karnataka', dayText: 'Days 2–3', stateText: 'Tiptur & BAIF' },
  { stopIndex: 2, label: 'Maharashtra', dayText: 'Days 4–8', stateText: 'Gokul, Baramati & Prabhat' },
  { stopIndex: 5, label: 'Gujarat', dayText: 'Days 9–11', stateText: 'NDDB Anand & Mrida' },
  { stopIndex: 6, label: 'Rajasthan', dayText: 'Days 12–14', stateText: 'Bikaner & Jaipur' },
  { stopIndex: 8, label: 'Coimbatore', dayText: 'Day 15', stateText: 'Return & Finale' }
];
