import React, { useState, useRef, useEffect, useCallback } from 'react';
import { FULL_ITINERARY } from '../data/yatraData';
import {
  Search,
  MapPin,
  Train,
  Bus,
  Plane,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  LayoutList,
  Compass,
  Building2
} from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import SlidingTabs from './SlidingTabs';

/* Unsplash helper: img(id) = card size, img(id, 800) = large size */
const img = (id, w = 600) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=${w === 800 ? 85 : 80}`;

const P = {
  temple: '1582510003544-4d00b7f74220',
  pasture: '1500595046743-cd271d694d30',
  train: '1474487548417-781cb71495f3',
  farm: '1546445317-29f4545f9d52',
  milking: '1527153857715-3908f2bae5e8',
  soil: '1595855759920-86582396756a',
  cattle: '1574943320219-553eb213f72d',
  lab: '1589923188900-85dae523342b',
  village: '1540555700478-4be289fbecef',
  plant: '1560493676-04071c5f467b',
  memorial: '1588880331179-bc9b93a8cb5e',
  biogas: '1592982537447-7440770cbfc9',
  camel: '1509099836639-18ba1795216d',
  desert: '1508873696983-2df5293cb32f',
  gala: '1477587458883-47145ed94245',
  pitch: '1518495973542-4542c06a5843'
};

// Journey texts, photos and timeline labels (used by Itinerary and InteractiveMap)
export const MASTERS_JOURNEY_DATA = {
  1: {
    title: 'Orientation & Flag-Off',
    subtitle: 'Coimbatore, Tamil Nadu',
    headlineCopy: (
      <>
        Kick off your <strong>Dairy Yatra journey</strong> with <strong>Day 1</strong> of goal-setting, <strong>Western Ghats orientation</strong>, Special Train boarding, and <strong>40-founder cohort bonding</strong>.
      </>
    ),
    institution: 'Yatra Flagoff Base · Special Train Departure',
    image: img(P.temple, 800),
    timelineLabel: 'Day 1',
    subLabel: 'Coimbatore',
    stateCode: 'CBE',
    cards: [
      { id: 'cbe-farm', src: img(P.pasture), badge: 'Western Ghats', title: 'Pasture Ecosystem', subtitle: 'Nilgiris Foothills' },
      { id: 'cbe-main', src: img(P.temple), badge: 'Day 01 Flag-Off', title: 'Journey Flagoff Base', subtitle: 'Coimbatore, TN' },
      { id: 'cbe-tech', src: img(P.train), badge: 'Special Train', title: 'Special Yatra Express', subtitle: '40-Founder Departure' }
    ]
  },
  2: {
    title: 'Organic Dairy Farming',
    subtitle: 'Tiptur, Karnataka',
    headlineCopy: (
      <>
        Discover <strong>chemical-free organic milk production</strong> at Akshayakalpa with <strong>robotic milking parlors</strong>, soil-to-table traceability, and ethical <strong>loose-housing pasture management</strong>.
      </>
    ),
    institution: 'Akshayakalpa Organic Farm',
    image: img(P.farm, 800),
    timelineLabel: 'Day 2',
    subLabel: 'Akshayakalpa',
    stateCode: 'KAR',
    cards: [
      { id: 'aksh-farm', src: img(P.farm), badge: 'Organic Farm', title: 'Loose Housing Pasture', subtitle: 'Tiptur, Karnataka' },
      { id: 'aksh-main', src: img(P.milking), badge: 'Day 02 Akshayakalpa', title: 'Robotic Milking Hub', subtitle: 'Automated Extraction' },
      { id: 'aksh-tech', src: img(P.soil), badge: 'Direct-to-Consumer', title: 'Soil-to-Table Tech', subtitle: 'Batch Traceability' }
    ]
  },
  3: {
    title: 'Breed Genetics & Livelihoods',
    subtitle: 'Tiptur, Karnataka',
    headlineCopy: (
      <>
        Explore <strong>BAIF Development Research Foundation</strong> models combining <strong>livestock genetic improvement</strong>, artificial insemination networks, and <strong>smallholder livelihood security</strong>.
      </>
    ),
    institution: 'BAIF Development Research Foundation',
    image: img(P.pasture, 800),
    timelineLabel: 'Day 3',
    subLabel: 'BAIF Institute',
    stateCode: 'KAR',
    cards: [
      { id: 'baif-farm', src: img(P.pasture), badge: 'Indigenous Breeds', title: 'Gir & Kankrej Germplasm', subtitle: 'Genetic Upgrading' },
      { id: 'baif-main', src: img(P.cattle), badge: 'Day 03 BAIF Base', title: 'Development Research', subtitle: 'Tiptur Campus' },
      { id: 'baif-tech', src: img(P.lab), badge: 'AI Genetics', title: 'Cryogenic Insemination', subtitle: 'Livelihood Scale' }
    ]
  },
  4: {
    title: 'Regional Dairy Immersion',
    subtitle: 'Kolhapur, Maharashtra',
    headlineCopy: (
      <>
        Immerse in <strong>Maharashtra’s pastoral dairy heritage</strong>, reflecting on local culture, <strong>village collection trust models</strong>, and indigenous buffalo economics.
      </>
    ),
    institution: 'Travel & Cultural Immersion',
    image: img(P.village, 800),
    timelineLabel: 'Day 4',
    subLabel: 'Kolhapur',
    stateCode: 'MH',
    cards: [
      { id: 'kol-farm', src: img(P.village), badge: 'Village Societies', title: 'Pastoral Trust Networks', subtitle: 'Kolhapur District' },
      { id: 'kol-main', src: img(P.farm), badge: 'Day 04 Heritage', title: 'Cultural Immersion Base', subtitle: 'Panchganga Basin' },
      { id: 'kol-tech', src: img(P.milking), badge: 'Buffalo Economics', title: 'High-Fat Milk Logistics', subtitle: 'Maharashtra Hub' }
    ]
  },
  5: {
    title: 'Precision Cattle Nutrition (TMR)',
    subtitle: 'Kolhapur, Maharashtra',
    headlineCopy: (
      <>
        Witness cutting-edge <strong>Total Mixed Ration (TMR) technology</strong> at Gokul Dairy, optimizing <strong>cattle feed precision</strong> for enhanced milk fat yield and herd health.
      </>
    ),
    institution: 'Gokul Dairy TMR Plant',
    image: img(P.milking, 800),
    timelineLabel: 'Day 5',
    subLabel: 'Gokul TMR',
    stateCode: 'MH',
    cards: [
      { id: 'gok-farm', src: img(P.pasture), badge: 'Herd Nutrition', title: 'Bio-Optimized Rations', subtitle: 'Rumen Health' },
      { id: 'gok-main', src: img(P.milking), badge: 'Day 05 Gokul Plant', title: 'TMR Automation Facility', subtitle: 'Kolhapur, MH' },
      { id: 'gok-tech', src: img(P.plant), badge: 'Quality Testing', title: 'Automated Feed Lab', subtitle: 'Fat & SNF Analytics' }
    ]
  },
  6: {
    title: 'Centre of Excellence in Dairy',
    subtitle: 'Baramati, Maharashtra',
    headlineCopy: (
      <>
        Examine <strong>integrated dairy production models</strong>, automated rotary milking machinery, and <strong>institutional extension frameworks</strong> training smallholders at scale.
      </>
    ),
    institution: 'Centre of Excellence in Dairy',
    image: img(P.cattle, 800),
    timelineLabel: 'Day 6',
    subLabel: 'Baramati',
    stateCode: 'MH',
    cards: [
      { id: 'bar-farm', src: img(P.soil), badge: 'Climate Barns', title: 'Ventilated Housing Sheds', subtitle: 'Herd Comfort' },
      { id: 'bar-main', src: img(P.cattle), badge: 'Day 06 Baramati CoE', title: 'Rotary Milking Parlor', subtitle: 'Institutional Model' },
      { id: 'bar-tech', src: img(P.lab), badge: 'Agri-Tech Hub', title: 'Smallholder Training Unit', subtitle: 'Smart Sensors' }
    ]
  },
  7: {
    title: 'Farmer Empowerment & Hydroponics',
    subtitle: 'Phaltan, Maharashtra',
    headlineCopy: (
      <>
        Gain insights into <strong>holistic farmer empowerment</strong> at Govind Dairy, including <strong>hydroponic green fodder cultivation</strong> and loose housing barn architecture.
      </>
    ),
    institution: 'Govind Dairy',
    image: img(P.soil, 800),
    timelineLabel: 'Day 7',
    subLabel: 'Govind Dairy',
    stateCode: 'MH',
    cards: [
      { id: 'gov-farm', src: img(P.pasture), badge: 'Hydroponics', title: 'Green Fodder Trays', subtitle: 'Water-Saving Feed' },
      { id: 'gov-main', src: img(P.soil), badge: 'Day 07 Govind Dairy', title: 'Farmer Empowerment Hub', subtitle: 'Phaltan, MH' },
      { id: 'gov-tech', src: img(P.plant), badge: 'Direct Payments', title: 'Village Chilling Network', subtitle: 'Instant Payout POS' }
    ]
  },
  8: {
    title: 'Value Chain Integration',
    subtitle: 'Shrirampur, Maharashtra',
    headlineCopy: (
      <>
        Understand <strong>value chain integration</strong> at Prabhat Dairy, commercial <strong>Skimmed Milk Powder (SMP)</strong> processing, and market-oriented enterprise scale.
      </>
    ),
    institution: 'Prabhat Dairy',
    image: img(P.lab, 800),
    timelineLabel: 'Day 8',
    subLabel: 'Prabhat Dairy',
    stateCode: 'MH',
    cards: [
      { id: 'prab-farm', src: img(P.milking), badge: 'Milk Procurement', title: 'Bulk Route Collection', subtitle: 'Maharashtra Supply' },
      { id: 'prab-main', src: img(P.lab), badge: 'Day 08 Prabhat Base', title: 'SMP Spray Towers', subtitle: 'Shrirampur, MH' },
      { id: 'prab-tech', src: img(P.plant), badge: 'Value Addition', title: 'Aseptic Packaging Plant', subtitle: 'Cheese & Powder Line' }
    ]
  },
  9: {
    title: 'The White Revolution Epicentre',
    subtitle: 'Anand, Gujarat',
    headlineCopy: (
      <>
        Walk the hallowed grounds of <strong>NDDB Anand</strong>, exploring national dairy policy, <strong>cooperative governance</strong>, and small-scale processing efficiency.
      </>
    ),
    institution: 'National Dairy Development Board (NDDB)',
    image: img(P.plant, 800),
    timelineLabel: 'Day 9',
    subLabel: 'NDDB Anand',
    stateCode: 'GJ',
    cards: [
      { id: 'nddb-farm', src: img(P.memorial), badge: 'Kurien Legacy', title: 'Operation Flood Memorial', subtitle: 'Cooperative Roots' },
      { id: 'nddb-main', src: img(P.plant), badge: 'Day 09 NDDB Anand', title: 'National Dairy Board HQ', subtitle: 'Anand, Gujarat' },
      { id: 'nddb-tech', src: img(P.biogas), badge: 'National Milk Grid', title: 'Policy & Automation Hub', subtitle: 'Sovereignty Scale' }
    ]
  },
  10: {
    title: 'Manure Bio-Economy (Mrida)',
    subtitle: 'Anand, Gujarat',
    headlineCopy: (
      <>
        Understand the <strong>Mrida dung-to-wealth initiative</strong>, converting cattle manure into <strong>circular bio-gas</strong>, electricity, and organic bio-fertilizers.
      </>
    ),
    institution: 'Mrida, NDDB',
    image: img(P.biogas, 800),
    timelineLabel: 'Day 10',
    subLabel: 'Mrida Bio-Gas',
    stateCode: 'GJ',
    cards: [
      { id: 'mri-farm', src: img(P.pasture), badge: 'Dung Economics', title: 'Cattle Waste Inflow', subtitle: 'Village Collection' },
      { id: 'mri-main', src: img(P.biogas), badge: 'Day 10 Mrida Plant', title: 'Circular Bio-Gas Digester', subtitle: 'NDDB Anand, GJ' },
      { id: 'mri-tech', src: img(P.cattle), badge: 'PROM Fertilizers', title: 'Organic Slurry Pellets', subtitle: 'Bio-CNG Bottling' }
    ]
  },
  11: {
    title: 'Regional Cooperative Immersion',
    subtitle: 'Anand, Gujarat',
    headlineCopy: (
      <>
        Observe <strong>regional cooperative practices</strong>, engage in reflective peer dialogues, and analyze <strong>micro-entrepreneur processing models</strong> across Gujarat.
      </>
    ),
    institution: 'Travel & Cultural Immersion',
    image: img(P.memorial, 800),
    timelineLabel: 'Day 11',
    subLabel: 'Gujarat Hub',
    stateCode: 'GJ',
    cards: [
      { id: 'guj-farm', src: img(P.village), badge: 'Women Cooperatives', title: 'Village Union Centers', subtitle: 'Gujarat Societies' },
      { id: 'guj-main', src: img(P.memorial), badge: 'Day 11 Gujarat Hub', title: 'Peer Synthesis Base', subtitle: 'Anand District' },
      { id: 'guj-tech', src: img(P.plant), badge: 'Micro Processing', title: 'Digital Chilling Centers', subtitle: 'Real-Time Fat Audit' }
    ]
  },
  12: {
    title: 'Alternative Dairying & Camel Milk',
    subtitle: 'Bikaner, Rajasthan',
    headlineCopy: (
      <>
        Unlock high-growth <strong>therapeutic camel and donkey milk</strong> commercialization at <strong>ICAR-NRC on Camel</strong> in the arid Thar Desert.
      </>
    ),
    institution: 'ICAR – NRC on Camel',
    image: img(P.camel, 800),
    timelineLabel: 'Day 12',
    subLabel: 'ICAR Camel',
    stateCode: 'RJ',
    cards: [
      { id: 'cam-farm', src: img(P.camel), badge: 'Thar Pastoralists', title: 'Arid Zone Camel Herds', subtitle: 'Bikaner Range' },
      { id: 'cam-main', src: img(P.desert), badge: 'Day 12 ICAR NRCC', title: 'Camel Research Campus', subtitle: 'Bikaner, Rajasthan' },
      { id: 'cam-tech', src: img(P.lab), badge: 'Therapeutic Milk', title: 'Freeze-Dried Powder Unit', subtitle: 'Insulin-Mimetic Tech' }
    ]
  },
  13: {
    title: 'Desert Cold Chains & Resilience',
    subtitle: 'Bikaner, Rajasthan',
    headlineCopy: (
      <>
        Explore <strong>drought-resilient dairy farming</strong> at Saras Dairy, extreme temperature cold chain logistics, and <strong>sheep farming integration</strong>.
      </>
    ),
    institution: 'Saras Dairy & CSWRI',
    image: img(P.desert, 800),
    timelineLabel: 'Day 13',
    subLabel: 'Saras Dairy',
    stateCode: 'RJ',
    cards: [
      { id: 'sar-farm', src: img(P.pasture), badge: 'Arid Integration', title: 'CSWRI Sheep & Fodder', subtitle: 'Drought Resilience' },
      { id: 'sar-main', src: img(P.desert), badge: 'Day 13 Saras Plant', title: 'Desert Dairy Facility', subtitle: 'Bikaner, RJ' },
      { id: 'sar-tech', src: img(P.plant), badge: 'Reefer Logistics', title: 'Desert Cold Chain Fleet', subtitle: 'Extreme Heat Shield' }
    ]
  },
  14: {
    title: 'Valedictory Synthesis Evening',
    subtitle: 'Jaipur, Rajasthan',
    headlineCopy: (
      <>
        Synthesize key learnings across 5 states, participate in the <strong>founder venture pitch session</strong>, and celebrate the <strong>Valedictory Evening in national attire</strong>.
      </>
    ),
    institution: 'Wrap-Up & Cultural Immersion',
    image: img(P.gala, 800),
    timelineLabel: 'Day 14',
    subLabel: 'Jaipur Gala',
    stateCode: 'RJ',
    cards: [
      { id: 'jai-farm', src: img(P.gala), badge: 'Heritage Gala', title: 'Cultural Valedictory', subtitle: 'Jaipur, Rajasthan' },
      { id: 'jai-main', src: img(P.pitch), badge: 'Day 14 Pitch Hall', title: 'Founder Venture Pitches', subtitle: 'Investor Jury' },
      { id: 'jai-tech', src: img(P.temple), badge: 'Cohort Honors', title: 'Impact Awards Banquet', subtitle: '40-Founder Syndicate' }
    ]
  },
  15: {
    title: 'Return & Knowledge Application',
    subtitle: 'Coimbatore, Tamil Nadu',
    headlineCopy: (
      <>
        Return flight to Coimbatore. Consolidate experiences, formulate <strong>venture execution roadmaps</strong>, and launch the <strong>Dairy Yatra Alumni Collaborative Syndicate</strong>.
      </>
    ),
    institution: 'Return Journey',
    image: img(P.pitch, 800),
    timelineLabel: 'Day 15',
    subLabel: 'Coimbatore',
    stateCode: 'CBE',
    cards: [
      { id: 'ret-farm', src: img(P.pitch), badge: 'Action Roadmaps', title: 'Venture Scaling Blueprints', subtitle: 'Execution Frameworks' },
      { id: 'ret-main', src: img(P.temple), badge: 'Day 15 Return Base', title: 'Coimbatore Homecoming', subtitle: 'Western Ghats Finale' },
      { id: 'ret-tech', src: img(P.train), badge: 'Alumni Network', title: 'Dairy Yatra Syndicate', subtitle: 'Lifelong Fellowship' }
    ]
  }
};

/* One place that decides the mode of transport from the text (case-insensitive).
   Flight/air -> plane, Train/rail -> train, everything else -> bus */
const getTransportKind = (t = '') => {
  const s = String(t).toLowerCase();
  if (/flight|air|plane/.test(s)) return 'flight';
  if (/train|rail/.test(s)) return 'train';
  return 'bus';
};

const TRANSPORT_STYLE = {
  flight: { Icon: Plane, text: 'text-sky-400', color: '#0284C7', ring: '#38BDF8', ping: 'bg-sky-400/40' },
  train: { Icon: Train, text: 'text-emerald-400', color: '#059669', ring: '#34D399', ping: 'bg-emerald-400/40' },
  bus: { Icon: Bus, text: 'text-amber-400', color: '#D97706', ring: '#FBBF24', ping: 'bg-amber-400/40' }
};

const getTransportIcon = (t = '') => {
  const { Icon, text } = TRANSPORT_STYLE[getTransportKind(t)];
  return <Icon className={`w-3.5 h-3.5 ${text}`} />;
};

export default function Itinerary() {
  const [selectedState, setSelectedState] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeDayIndex, setActiveDayIndex] = useState(0);
  const [direction, setDirection] = useState('next');
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [viewMode, setViewMode] = useState('journey'); // 'journey' | 'table'

  const scrollTrackRef = useRef(null);
  const timelineTrackRef = useRef(null);
  const isAutoScrolling = useRef(false);

  const states = ['All', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Gujarat', 'Rajasthan'];

  // Filter itinerary
  const filteredItinerary = FULL_ITINERARY.filter((item) => {
    const matchesState =
      selectedState === 'All' || item.location.toLowerCase().includes(selectedState.toLowerCase());
    const matchesSearch =
      item.institution.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.objective.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesState && matchesSearch;
  });

  // Ensure activeDayIndex remains in bounds
  useEffect(() => {
    if (activeDayIndex >= filteredItinerary.length) {
      setActiveDayIndex(0);
    }
  }, [filteredItinerary.length, activeDayIndex]);

  const currentItem = filteredItinerary[activeDayIndex] || filteredItinerary[0] || FULL_ITINERARY[0];
  const currentMastersData = MASTERS_JOURNEY_DATA[currentItem?.day] || MASTERS_JOURNEY_DATA[1];

  // Scroll to active node in timeline automatically
  useEffect(() => {
    if (timelineTrackRef.current) {
      const activeElement = timelineTrackRef.current.children[activeDayIndex];
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
      }
    }
  }, [activeDayIndex]);

  // Sticky scroll engine: advances the journey while the section is pinned
  useEffect(() => {
    if (viewMode !== 'journey') return;

    const handleWindowScroll = () => {
      if (!scrollTrackRef.current || isAutoScrolling.current) return;

      const rect = scrollTrackRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const totalScrollDistance = rect.height - windowHeight;

      if (totalScrollDistance <= 0) return;

      const currentScrollProgress = -rect.top;

      if (currentScrollProgress >= 0 && currentScrollProgress <= totalScrollDistance) {
        const fraction = currentScrollProgress / totalScrollDistance;
        const targetIndex = Math.min(
          Math.floor(fraction * filteredItinerary.length),
          filteredItinerary.length - 1
        );

        if (targetIndex !== activeDayIndex && targetIndex >= 0) {
          setDirection(targetIndex > activeDayIndex ? 'next' : 'prev');
          setIsTransitioning(true);
          setActiveDayIndex(targetIndex);

          setTimeout(() => {
            setIsTransitioning(false);
          }, 300);
        }
      }
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [activeDayIndex, filteredItinerary.length, viewMode]);

  // Programmatic jump to a specific day
  const scrollToDay = useCallback((targetIndex) => {
    if (targetIndex < 0 || targetIndex >= filteredItinerary.length) return;

    if (!scrollTrackRef.current || viewMode !== 'journey') {
      setActiveDayIndex(targetIndex);
      return;
    }

    const rect = scrollTrackRef.current.getBoundingClientRect();
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const trackTop = scrollTop + rect.top;
    const windowHeight = window.innerHeight;
    const totalScrollDistance = rect.height - windowHeight;

    setDirection(targetIndex > activeDayIndex ? 'next' : 'prev');
    setIsTransitioning(true);
    setActiveDayIndex(targetIndex);

    if (totalScrollDistance > 0) {
      isAutoScrolling.current = true;
      const targetScroll = trackTop + (targetIndex / Math.max(filteredItinerary.length - 1, 1)) * totalScrollDistance + 10;

      window.scrollTo({ top: targetScroll, behavior: 'smooth' });

      setTimeout(() => {
        isAutoScrolling.current = false;
        setIsTransitioning(false);
      }, 500);
    } else {
      setTimeout(() => setIsTransitioning(false), 300);
    }
  }, [activeDayIndex, filteredItinerary.length, viewMode]);

  const handleNextDay = () => {
    if (activeDayIndex < filteredItinerary.length - 1) scrollToDay(activeDayIndex + 1);
  };

  const handlePrevDay = () => {
    if (activeDayIndex > 0) scrollToDay(activeDayIndex - 1);
  };

  const scrollContainerHeight = viewMode === 'journey'
    ? `${Math.max(filteredItinerary.length * 28, 200)}vh`
    : 'auto';

  return (
    <section id="itinerary" className="py-16 md:py-24 bg-white text-[#172738] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* 1. SECTION HEADER & SEARCH */}
        <ScrollReveal animation="fade-up" duration={700}>
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-[2px] bg-[#3368A0]" />
                <span className="text-xs uppercase font-bold text-[#3368A0] tracking-widest">
                  Day-by-Day Roadmap
                </span>
              </div>
              <h2 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-[#172738]">
                The Complete 15-Day Schedule
              </h2>
            </div>

            {/* Search & View Toggle */}
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative w-full md:w-72">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#4E657D]" />
                <input
                  type="text"
                  placeholder="Search city, host, or keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#F2EFE7] border border-[#C8DFDB] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#172738] focus:outline-none focus:ring-2 focus:ring-[#3368A0] focus:bg-white transition-all shadow-sm"
                />
              </div>

              <div className="hidden sm:block shrink-0">
                <SlidingTabs
                  tabs={[
                    { id: 'journey', label: 'Journey', icon: <Compass className="w-3.5 h-3.5" /> },
                    { id: 'table', label: 'Table', icon: <LayoutList className="w-3.5 h-3.5" /> }
                  ]}
                  activeId={viewMode}
                  onChange={(id) => setViewMode(id)}
                  tabClassName="text-xs px-3.5 py-1.5 h-8"
                  pillClassName="h-8 shadow-sm"
                />
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* 2. STATE FILTER TABS */}
        <ScrollReveal animation="fade-up" delay={150} duration={600}>
          <div className="overflow-x-auto pb-4 mb-6 no-scrollbar">
            <SlidingTabs
              tabs={states.map((st) => ({
                id: st,
                label: st === 'All' ? 'All 15 Days (5 States)' : st
              }))}
              activeId={selectedState}
              onChange={(st) => {
                setSelectedState(st);
                setActiveDayIndex(0);
              }}
              className="bg-[#EAE5D9] p-1 border border-[#C8DFDB]"
              tabClassName="px-4 py-1.5 text-xs sm:text-sm font-semibold h-9"
              pillClassName="h-9 shadow-md bg-white text-[#172738]"
            />
          </div>
        </ScrollReveal>

        {/* 3. SCROLL-DRIVEN JOURNEY CONTAINER */}
        {viewMode === 'journey' ? (
          <div
            ref={scrollTrackRef}
            style={{ height: scrollContainerHeight }}
            className="relative w-full"
          >
            <div className="sticky top-20 w-full z-20">
              <div className="relative bg-[#142538] text-white rounded-3xl p-6 sm:p-10 lg:p-12 shadow-2xl border border-white/10 overflow-hidden min-h-[560px] flex flex-col justify-between select-none">

                {/* Ambient glow */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#66A3BF]/15 rounded-full blur-[100px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#3368A0]/20 rounded-full blur-[100px] pointer-events-none" />
                <div
                  className="absolute inset-0 opacity-[0.03] pointer-events-none"
                  style={{
                    backgroundImage: `linear-gradient(135deg, #ffffff 10%, transparent 10%), linear-gradient(225deg, #ffffff 10%, transparent 10%)`,
                    backgroundSize: '40px 40px'
                  }}
                />

                {filteredItinerary.length > 0 ? (
                  <div className="relative z-10 flex-1 flex flex-col justify-between">

                    {/* Main grid: single photo + narrative */}
                    <div className="grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-6 lg:gap-10 items-center my-auto py-4">

                      {/* Single day photo */}
                      <div className="flex items-center justify-center">
                        <img
                          key={`mu-img-${currentItem.day}`}
                          src={currentMastersData.image || currentMastersData.cards?.[1]?.src}
                          alt={currentMastersData.title}
                          className={`aspect-[4/5] w-[180px] lg:w-[220px] rounded-2xl object-cover ring-1 ring-white/20 shadow-[0_14px_30px_rgba(0,0,0,0.45)] transition-all duration-500 ${
                            isTransitioning ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
                          }`}
                        />
                      </div>

                      {/* Narrative */}
                      <div className="flex flex-col justify-center text-center lg:text-left overflow-hidden">
                        <div
                          key={`mu-content-${currentItem.day}`}
                          className={`transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                            isTransitioning
                              ? direction === 'next'
                                ? '-translate-x-6 opacity-0'
                                : 'translate-x-6 opacity-0'
                              : 'translate-x-0 opacity-100'
                          }`}
                        >
                          <div className="mb-2 text-xs font-bold text-[#C8DFDB]">Day {currentItem.day}</div>

                          <h4 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white mb-3">
                            {currentMastersData.title}
                          </h4>

                          <p className="text-sm sm:text-base text-[#F2EFE7]/85 leading-relaxed font-light mb-5">
                            {currentMastersData.headlineCopy}
                          </p>

                          <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                            <div className="flex items-center justify-center lg:justify-start gap-2 text-white/90">
                              <Building2 className="w-4 h-4 text-[#66A3BF] shrink-0" />
                              <span className="font-semibold">{currentItem.institution}</span>
                            </div>

                            <div className="flex items-center justify-center lg:justify-start gap-1.5">
                              {getTransportIcon(currentItem.transport)}
                              <span className="font-medium text-white/90">{currentItem.transport}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* 4. BOTTOM HORIZONTAL TIMELINE */}
                    <div className="pt-6 border-t border-white/15">

                      {/* Navigation controls */}
                      <div className="flex items-center justify-between mb-3 text-xs text-white/60">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={handlePrevDay}
                            disabled={activeDayIndex === 0}
                            className={`p-1.5 rounded-xl border flex items-center gap-1 transition-all ${
                              activeDayIndex === 0
                                ? 'opacity-20 border-white/10 cursor-not-allowed text-white/40'
                                : 'bg-white/10 hover:bg-white/20 border-white/20 text-white hover:scale-105 active:scale-95 cursor-pointer'
                            }`}
                            aria-label="Previous Day"
                          >
                            <ChevronLeft className="w-4 h-4" />
                            <span className="hidden sm:inline font-bold">Prev</span>
                          </button>

                          <button
                            onClick={handleNextDay}
                            disabled={activeDayIndex === filteredItinerary.length - 1}
                            className={`p-1.5 rounded-xl border flex items-center gap-1 transition-all ${
                              activeDayIndex === filteredItinerary.length - 1
                                ? 'opacity-20 border-white/10 cursor-not-allowed text-white/40'
                                : 'bg-[#3368A0] text-white border-[#3368A0] font-bold hover:bg-[#234974] hover:scale-105 active:scale-95 shadow-md cursor-pointer'
                            }`}
                            aria-label="Next Day"
                          >
                            <span className="hidden sm:inline font-bold">Next</span>
                            <ChevronRight className="w-4 h-4" />
                          </button>

                          <span className="hidden md:inline-block text-[11px] text-white/40 ml-2">
                            Scroll down to advance journey
                          </span>
                        </div>

                        <span className="text-[11px] text-[#C8DFDB] font-bold uppercase tracking-widest">
                          {Math.round(((activeDayIndex + 1) / filteredItinerary.length) * 100)}% Journey Traversed
                        </span>
                      </div>

                      {/* Timeline track */}
                      <div className="relative pt-4 pb-2">

                        <div className="relative h-1 bg-white/20 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-[#66A3BF] via-[#C8DFDB] to-[#3368A0] transition-all duration-500 rounded-full shadow-[0_0_10px_rgba(102,163,191,0.8)]"
                            style={{
                              width: `${(activeDayIndex / Math.max(filteredItinerary.length - 1, 1)) * 100}%`
                            }}
                          />
                        </div>

                        <div
                          ref={timelineTrackRef}
                          className="relative flex items-center justify-between -mt-4 overflow-x-auto no-scrollbar py-2"
                        >
                          {filteredItinerary.map((item, idx) => {
                            const isActive = idx === activeDayIndex;
                            const isCompleted = idx <= activeDayIndex;
                            const nodeData = MASTERS_JOURNEY_DATA[item.day] || {};
                            const { Icon, color, ring, ping } = TRANSPORT_STYLE[getTransportKind(item.transport)];

                            return (
                              <button
                                key={item.day}
                                onClick={() => scrollToDay(idx)}
                                className="group flex flex-col items-center focus:outline-none shrink-0 px-2 sm:px-3 py-1 cursor-pointer transition-all"
                                title={`Day ${item.day}: ${nodeData.title}`}
                              >
                                <div className="relative flex items-center justify-center">
                                  {isActive ? (
                                    <div className="relative flex items-center justify-center">
                                      <span className={`absolute w-9 h-9 sm:w-10 sm:h-10 rounded-full animate-ping pointer-events-none ${ping}`} />

                                      {/* Marker follows the mode of transport */}
                                      <div
                                        className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white ring-2 shadow-xl flex items-center justify-center z-10 scale-110"
                                        style={{ '--tw-ring-color': ring }}
                                      >
                                        <Icon className="w-4 h-4 sm:w-[18px] sm:h-[18px]" style={{ color }} strokeWidth={2.2} />
                                      </div>
                                    </div>
                                  ) : (
                                    <div
                                      className={`rounded-full transition-all duration-300 ${
                                        isCompleted
                                          ? 'w-3 h-3 bg-[#66A3BF] hover:scale-125'
                                          : 'w-2.5 h-2.5 bg-white/40 hover:bg-white group-hover:scale-125'
                                      }`}
                                    />
                                  )}
                                </div>

                                <div className="mt-2 text-center transition-all">
                                  <span
                                    className={`text-[11px] sm:text-xs font-bold block transition-colors ${
                                      isActive
                                        ? 'text-white font-extrabold underline decoration-[#66A3BF] decoration-2 underline-offset-4'
                                        : isCompleted
                                          ? 'text-white/80'
                                          : 'text-white/40 group-hover:text-white/70'
                                    }`}
                                  >
                                    {nodeData.timelineLabel || `Day ${item.day}`}
                                  </span>

                                  <span
                                    className={`text-[9px] sm:text-[10px] block transition-colors ${
                                      isActive
                                        ? 'text-[#C8DFDB] font-medium'
                                        : 'text-white/30 hidden md:block'
                                    }`}
                                  >
                                    {nodeData.subLabel || item.location}
                                  </span>
                                </div>
                              </button>
                            );
                          })}
                        </div>

                      </div>
                    </div>

                  </div>
                ) : (
                  <div className="text-center py-16 text-white/50">
                    No itinerary events match your search criteria. Try a different search keyword or state.
                  </div>
                )}

              </div>
            </div>
          </div>
        ) : (
          /* Table view with image reveal on hover */
          <ScrollReveal animation="fade-up" delay={200} duration={800}>
            <div className="relative xl:pl-28 transition-all duration-300">
              <div className="flex items-center justify-between text-xs text-[#4E657D] mb-3 px-2">
                <span className="flex items-center gap-1.5 font-medium">
                  <Sparkles className="w-3.5 h-3.5 text-[#3368A0]" />
                  Hover over any row to reveal location & farm preview
                </span>
                <span className="hidden sm:inline text-xs text-[#3368A0]/80">
                  Click any row to open in Journey interactive view
                </span>
              </div>

              <div className="bg-[#F2EFE7] rounded-3xl border border-[#C8DFDB] p-4 sm:p-6 shadow-sm overflow-visible">
                <div className="hidden md:grid grid-cols-12 gap-4 pb-4 px-4 text-xs font-bold uppercase tracking-wider text-[#3368A0] border-b border-[#C8DFDB]">
                  <div className="col-span-2">Day & State</div>
                  <div className="col-span-4">Institution / Industry / Farm</div>
                  <div className="col-span-4">Learning Objective</div>
                  <div className="col-span-2 text-right">Mode of Travel</div>
                </div>

                <div className="divide-y divide-[#C8DFDB]/60">
                  {filteredItinerary.map((item, idx) => {
                    const mastersData = MASTERS_JOURNEY_DATA[item.day] || {};
                    const imageUrl = mastersData.image || img(P.farm, 800);

                    return (
                      <div
                        key={item.day}
                        onClick={() => {
                          setActiveDayIndex(idx);
                          setViewMode('journey');
                        }}
                        className="relative py-4 sm:py-5 px-2 sm:px-4 grid grid-cols-1 md:grid-cols-12 gap-4 items-center hover:bg-white rounded-2xl transition-all duration-200 group hover:shadow-lg hover:translate-x-1 cursor-pointer"
                      >
                        {/* Floating preview on hover */}
                        <div className="absolute -left-[100px] top-1/2 -translate-y-1/2 scale-90 w-[84px] h-[112px] rounded-xl overflow-hidden shadow-2xl border-2 border-white bg-slate-900 opacity-0 pointer-events-none transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] z-[100] group-hover:opacity-100 group-hover:scale-100 group-hover:-left-[90px] hidden xl:block ring-4 ring-black/5">
                          <img
                            src={imageUrl}
                            alt={item.institution || item.location}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                          <div className="absolute bottom-1.5 left-1.5 right-1.5 text-center">
                            <span className="text-[8px] font-extrabold uppercase text-[#C8DFDB] tracking-wider block">
                              Day {item.day}
                            </span>
                            <span className="text-[9px] font-bold text-white truncate block leading-tight">
                              {item.location.split(',')[0]}
                            </span>
                          </div>
                        </div>

                        <div className="md:col-span-2 flex items-center gap-3">
                          <div className="relative">
                            <span className="w-10 h-10 rounded-xl bg-[#3368A0] text-white font-sans font-bold text-sm flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 group-hover:bg-[#234974] transition-all duration-300">
                              D{item.day}
                            </span>
                          </div>
                          <div>
                            <span className="font-bold text-[#172738] text-sm block group-hover:text-[#3368A0] transition-colors">
                              Day {item.day}
                            </span>
                            <span className="text-xs text-[#3368A0] font-semibold flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-[#66A3BF]" /> {item.location}
                            </span>
                          </div>
                        </div>

                        <div className="md:col-span-4">
                          <span className="font-sans font-bold text-base text-[#172738] group-hover:text-[#3368A0] transition-colors block">
                            {item.institution}
                          </span>
                        </div>

                        <div className="md:col-span-4 text-sm text-[#4E657D] leading-relaxed">
                          {item.objective}
                        </div>

                        <div className="md:col-span-2 flex items-center md:justify-end gap-1.5 text-xs font-bold text-[#3368A0] bg-white md:bg-transparent px-3 py-1.5 md:px-0 md:py-0 rounded-lg shrink-0">
                          {getTransportIcon(item.transport)}
                          <span>{item.transport}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollReveal>
        )}

      </div>
    </section>
  );
}