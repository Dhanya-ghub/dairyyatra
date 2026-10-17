/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: '#3368A0',
          primaryDark: '#234974',
          secondary: '#66A3BF',
          secondaryDark: '#4D8EA8',
          mist: '#C8DFDB',
          mistLight: '#E3EFEF',
          cream: '#F2EFE7',
          creamLow: '#E5E1D5',
          creamCard: '#FFFFFF',
          dark: '#142538',
          navy: '#1B3550',
          forest: '#3368A0',
          olive: '#66A3BF',
          terracotta: '#3368A0',
          amber: '#66A3BF',
          gold: '#66A3BF',
          accent: '#66A3BF',
          textDark: '#172738',
          textMuted: '#4E657D',
          border: '#C8DFDB',
          borderLight: '#D8E8E5',
          soft: '#C8DFDB',
          pale: '#F2EFE7',
        }
      },
      fontFamily: {
        // The site uses one sans-serif family. The old serif names now point to it,
        // so any leftover font-serif / font-playfair class still renders in DM Sans.
        serif: ['"DM Sans"', 'system-ui', 'sans-serif'],
        playfair: ['"DM Sans"', 'system-ui', 'sans-serif'],
        cinzel: ['"DM Sans"', 'system-ui', 'sans-serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Big Shoulders Display"', '"Bebas Neue"', 'sans-serif'],
        condensed: ['"Bebas Neue"', '"Big Shoulders Display"', 'sans-serif'],
        editorial: ['"DM Sans"', 'system-ui', 'sans-serif'],
        syne: ['"Syne"', 'sans-serif'],
        script: ['"Caveat"', '"Alex Brush"', 'cursive'],
        handwriting: ['"Alex Brush"', '"Caveat"', 'cursive'],
        typewriter: ['"DM Mono"', 'monospace'],
      },
      colors: {
        artisanal: {
          terracotta: '#D83A24',
          terracottaDark: '#B82814',
          olive: '#858B47',
          oliveDark: '#6A7032',
          parchment: '#F7F3EB',
          parchmentDark: '#EAE2D2',
          espresso: '#1D1A18',
          espressoLight: '#2A2522',
          gold: '#D4A359',
        }
      },
      letterSpacing: {
        tightest: '-0.035em',
        tight: '-0.025em',
        widest: '0.2em',
        extreme: '0.35em',
      }
    },
  },
  plugins: [],
}
