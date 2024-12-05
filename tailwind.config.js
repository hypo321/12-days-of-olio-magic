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
      gridTemplateColumns: {
        'calendar-landscape': 'repeat(4, minmax(0, 1fr))',
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
      },
      animation: {
        'music-ripple':
          'ripple 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
