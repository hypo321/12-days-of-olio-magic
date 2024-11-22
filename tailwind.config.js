/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'calendar-landscape': 'repeat(4, minmax(0, 1fr))',
        'calendar-portrait': 'repeat(3, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
}
