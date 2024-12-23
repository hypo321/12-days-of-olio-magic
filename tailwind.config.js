/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        olio: {
          lilac: '#DDDBEC',
          yellow: '#FFCE00',
          pink: '#F75996',
        },
      },
      fontFamily: {
        heading: ['Cosmica', 'system-ui', 'sans-serif'],
        body: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        ripple: {
          '0%': {
            transform: 'scale(1)',
            opacity: 0.4,
          },
          '100%': {
            transform: 'scale(2)',
            opacity: 0,
          },
        },
        pulseGentle: {
          '0%, 100%': {
            transform: 'scale(1)',
          },
          '50%': {
            transform: 'scale(1.2)',
          },
        },
        snowGrowFast: {
          '0%': { transform: 'scaleY(0)' },
          '30%': { transform: 'scaleY(0.7)' },
          '100%': { transform: 'scaleY(1)' },
        },
        snowGrowMedium: {
          '0%': { transform: 'scaleY(0)' },
          '50%': { transform: 'scaleY(0.5)' },
          '100%': { transform: 'scaleY(1)' },
        },
        snowGrowSlow: {
          '0%': { transform: 'scaleY(0)' },
          '70%': { transform: 'scaleY(0.3)' },
          '100%': { transform: 'scaleY(1)' },
        },
        driftGrow: {
          '0%': { transform: 'scaleY(0) scaleX(0.8)' },
          '100%': { transform: 'scaleY(1) scaleX(1)' },
        },
      },
      animation: {
        'music-ripple':
          'ripple 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'pulse-gentle': 'pulseGentle 1s ease-in-out infinite',
        'snow-fast': 'snowGrowFast 40s ease-out forwards',
        'snow-medium': 'snowGrowMedium 40s ease-out forwards',
        'snow-slow': 'snowGrowSlow 40s ease-out forwards',
        'drift-grow': 'driftGrow 40s ease-out forwards',
      },
    },
  },
  plugins: [],
};
