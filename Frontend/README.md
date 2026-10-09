# 🥛 Dairy Yatra 2025 — Beyond the Farm

> **An experiential 15-day national learning journey across India's dairy ecosystem for 40 visionary entrepreneurs, innovators, and sector leaders.**

[![React](https://img.shields.io/badge/React-18.2-blue.svg?logo=react&style=flat-square)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.1-purple.svg?logo=vite&style=flat-square)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC.svg?logo=tailwind-css&style=flat-square)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-13.1-black.svg?logo=framer&style=flat-square)](https://www.framer.com/motion/)
[![Three.js](https://img.shields.io/badge/Three.js-0.185-orange.svg?logo=three.js&style=flat-square)](https://threejs.org/)

---

## 🧭 Executive Overview

**Dairy Yatra** is a flagship 15-day immersion program connecting **40 selected founders and innovators** directly with the pioneers shaping Indian agriculture, animal husbandry, and dairy technology. Traveling **6,000+ km across 5 states** (Tamil Nadu, Karnataka, Maharashtra, Gujarat, and Rajasthan), participants experience the entire spectrum of dairy—from regenerative grazing and indigenous genetics to automated mega-plants and arid bio-economies.

### Key Program Metrics
- **15 Days** of on-ground immersion
- **5 Indian States** traversed (TN ➔ KA ➔ MH ➔ GJ ➔ RJ)
- **40 Selected Entrepreneurs** in the cohort
- **6,000+ Kilometers** traversed via Special Yatra Train & road links
- **15+ Host Institutions & Pioneering Dairies**
- **150+ Hours** of structured masterclasses, field diagnostics & venture synthesis

---

## ✨ Core Features & Architectural Highlights

### 1. 🃏 Interactive 3-Card "Fan-Out / Stack" Hover Deck
- **Hand-of-Cards Deck Animation:** Centerpiece interactive visual displaying 3 simultaneous perspectives for each journey day:
  - 🌿 **Left Card:** Farm & Rural Immersion (pastures, herd health, loose housing)
  - 🏛️ **Center Card:** Primary Cohort & Host Organization (flag-off bases, research campuses)
  - ⚙️ **Right Card:** Processing & Agri-Tech (cold-chain, robotics, spray drying)
- **Spring Physics:** Smooth `cubic-bezier(0.34, 1.56, 0.64, 1)` transitions on hover/focus.
- **Active Tap Elevation:** Tapping/clicking any card in the fanned deck elevates it to `z-index: 10` with a 1.1x scale preview.
- **Accessibility:** Fully supports `@media (prefers-reduced-motion: reduce)` and keyboard navigation.

### 2. 🗺️ Scrollytelling 15-Day Roadmap & Timeline
- **Sticky Scroll Progress:** Smoothly advances day-by-day as the user scrolls down the page.
- **Dual View Modes:** Toggle seamlessly between the immersive **Journey View** and a searchable, state-filtered **Table View**.
- **Stage Navigation:** Interactive bottom timeline with custom node markers and percentage completion tracker.

### 3. 🗺️ Interactive Route & India Map
- High-fidelity interactive map visualizing the route path across Coimbatore, Tiptur, Kolhapur, Baramati, Phaltan, Shrirampur, Anand, Bikaner, and Jaipur.
- Hover tooltips detailing stop highlights, regional dairy dynamics, and transport modes (Train, Bus, Flight).

### 4. 🏢 Host Institutions Showcase
- Dedicated profiles for all partner institutions, including:
  - **Akshayakalpa Organic Farm** (Robotic milking, organic soil-to-table traceability)
  - **BAIF Development Research Foundation** (Livestock genetics & AI networks)
  - **Gokul Dairy** (Precision Total Mixed Ration feed technology)
  - **Centre of Excellence in Dairy, Baramati** (Automated rotary milking systems)
  - **Govind Dairy** (Hydroponic green fodder & smallholder empowerment)
  - **Prabhat Dairy** (SMP processing & commercial value chains)
  - **National Dairy Development Board (NDDB Anand)** (Cooperative epicentre & Dr. Kurien legacy)
  - **Mrida, NDDB** (Dung-to-wealth bio-gas & PROM bio-fertilizers)
  - **ICAR-NRC on Camel, Bikaner** (Therapeutic camel & donkey milk innovations)
  - **Saras Dairy & CSWRI** (Desert cold-chain resilience & sheep integration)

### 5. 📝 Multi-Step Application Portal & PDF Generator
- **Multi-Step Application Flow:**
  - *Step 1:* Personal & Venture Demographics
  - *Step 2:* Venture Stage, Traction & Focus Area
  - *Step 3:* Motivation Statement & Learning Objectives
  - *Step 4:* Cohort Value-Add & Experience
- **Auto-Save:** Browser `localStorage` persistence so applicants never lose progress.
- **Instant PDF Summary:** Generates structured client-side application PDFs via `jspdf` and `jspdf-autotable`.

### 6. 🎨 Premium Design System & Micro-Interactions
- **Color Palette:** Warm cream (`#F2EFE7`), deep navy (`#142538`), heritage denim blue (`#3368A0`), ocean mist (`#66A3BF`), and soft parchment accents (`#C8DFDB`).
- **Typography:** DM Sans (clean, modern interface body) paired with Cormorant Garamond (refined editorial serif headings).
- **Cinematic Preloader:** Full-screen video intro with sound control and seamless page entrance.
- **Transitions.dev Utilities:** Cursor-tracked 3D card tilt and smooth pill sliding tabs.

---

## 📁 Repository Structure

```tree
Dairy Yatra Web/
└── Dairy Yatra/
    ├── public/                     # Static public assets
    ├── src/
    │   ├── assets/                 # Icons, maps, videos, and static images
    │   │   ├── images/             # Background and immersion photography
    │   │   ├── logos/              # Partner & institutional logos
    │   │   └── cow.png             # Custom timeline marker icon
    │   ├── components/             # React application components
    │   │   ├── application/        # Application modal & step forms
    │   │   ├── portal/             # Application portal tracker & steps
    │   │   ├── ui/                 # Reusable UI primitives (FanOutCardDeck, BentoGrid, etc.)
    │   │   ├── ApplicationModal.jsx
    │   │   ├── ApplicationTimeline.jsx
    │   │   ├── BackToTop.jsx
    │   │   ├── BottomNav.jsx
    │   │   ├── CinematicPreloader.jsx
    │   │   ├── DayDetailsModal.jsx
    │   │   ├── ExpandableBentoGrid.jsx
    │   │   ├── FanOutCardDeck.jsx   # 3-Card Fan-Out / Stack Deck component
    │   │   ├── Footer.jsx
    │   │   ├── FullOverviewModal.jsx
    │   │   ├── Header.jsx
    │   │   ├── Hero.jsx
    │   │   ├── HostOrganizations.jsx
    │   │   ├── InteractiveMap.jsx
    │   │   ├── Itinerary.jsx        # 15-Day sticky scrollytelling itinerary
    │   │   ├── JourneyHeader.jsx
    │   │   ├── Overview.jsx         # Program vision & 6 core pillars
    │   │   ├── PreparationGuide.jsx # Packing checklist & travel FAQ
    │   │   ├── RouteExperienceCanvas.jsx
    │   │   ├── ScrollProgress.jsx
    │   │   ├── ScrollReveal.jsx
    │   │   ├── SlidingTabs.jsx      # Transitions.dev animated sliding tabs
    │   │   ├── SpinningReelCounter.jsx
    │   │   ├── SpotlightModal.jsx
    │   │   ├── TiltCard.jsx         # 3D mouse-tracking card tilt
    │   │   └── VolumetricSpotlightBackground.jsx
    │   ├── data/
    │   │   └── yatraData.js         # Full itinerary dataset, stats, stops & hosts
    │   ├── hooks/
    │   │   └── use-outside-click.js # Custom React hooks
    │   ├── lib/
    │   │   └── utils.js             # Utility functions & class mergers
    │   ├── utils/
    │   │   └── applicationStorage.js# LocalStorage handlers & schema
    │   ├── App.jsx                  # Main root application component
    │   ├── index.css                # Tailwind base + custom spring & deck CSS
    │   └── main.jsx                 # React entry point
    ├── index.html                   # HTML template & web fonts
    ├── package.json                 # Dependencies & scripts
    ├── postcss.config.js            # PostCSS configuration
    ├── tailwind.config.js           # Custom color tokens & typography config
    └── vite.config.js               # Vite server config & path aliases
```

---

## 🛠️ Technology Stack & Dependencies

| Category | Technology | Purpose |
| :--- | :--- | :--- |
| **Framework** | [React 18](https://react.dev/) | Component-driven declarative UI |
| **Build Tool** | [Vite 5](https://vitejs.dev/) | Ultra-fast HMR dev server & production bundler |
| **Styling** | [Tailwind CSS 3](https://tailwindcss.com/) | Utility-first CSS framework |
| **Motion** | [Framer Motion 13](https://www.framer.com/motion/) | Component layout animations & gestures |
| **Icons** | [Lucide React](https://lucide.dev/) | Crisp SVG interface iconography |
| **3D & Canvas** | [Three.js](https://threejs.org/) | Volumetric background lighting & WebGL effects |
| **PDF Export** | [jsPDF](https://github.com/parallax/jsPDF) & [AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) | Client-side application document generation |

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (version `18.x` or later recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Navigate to the project directory:
   ```bash
   cd "Dairy Yatra"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:3000/
   ```

### Production Build

To compile a production-ready optimized build:
```bash
npm run build
```

To preview the production bundle locally:
```bash
npm run preview
```

---

## 📑 15-Day Route Roadmap

```text
Day 01  🚩 Coimbatore, Tamil Nadu       — Orientation, Western Ghats flag-off & Special Train departure
Day 02  🌿 Tiptur, Karnataka            — Akshayakalpa Organic Farm & robotic milking systems
Day 03  🧬 Tiptur, Karnataka            — BAIF Development Research Foundation & breed genetics
Day 04  🏛️ Kolhapur, Maharashtra        — Regional pastoral immersion & buffalo milk economics
Day 05  ⚙️ Kolhapur, Maharashtra        — Gokul Dairy automated Total Mixed Ration (TMR) feed plant
Day 06  🔬 Baramati, Maharashtra        — Centre of Excellence in Dairy & rotary parlor mechanics
Day 07  🌱 Phaltan, Maharashtra         — Govind Dairy hydroponic fodder & smallholder empowerment
Day 08  📦 Shrirampur, Maharashtra      — Prabhat Dairy Skimmed Milk Powder (SMP) & value-addition
Day 09  🥛 Anand, Gujarat               — NDDB Anand headquarters & the White Revolution epicentre
Day 10  ⚡ Anand, Gujarat               — Mrida NDDB dung-to-wealth circular bio-gas & PROM fertilizers
Day 11  🤝 Anand, Gujarat               — Gujarat cooperative society immersion & digital chilling units
Day 12  🐪 Bikaner, Rajasthan           — ICAR-NRC on Camel & therapeutic alternative milk research
Day 13  ❄️ Bikaner, Rajasthan           — Saras Dairy desert cold-chain logistics & CSWRI sheep models
Day 14  🏆 Jaipur, Rajasthan            — Founder venture pitch session & Valedictory Gala Evening
Day 15  🛫 Return & Scaling             — Knowledge synthesis, venture roadmaps & Alumni Syndicate launch
```

---

## 📄 License & Ownership

© 2025–2026 **Dairy Yatra**. All rights reserved. Designed and developed for the Dairy Yatra experiential entrepreneurship initiative.
