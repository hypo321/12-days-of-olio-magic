/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'olio': {
          lilac: '#DDDBEC',
          yellow: '#FFCE00',
        },
      },
      fontFamily: {
        'heading': ['Cosmica', 'system-ui', 'sans-serif'],
        'body': ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      gridTemplateColumns: {
        'calendar-landscape': 'repeat(4, minmax(0, 1fr))',
        'calendar-portrait': 'repeat(3, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
}
