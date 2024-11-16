/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'calendar': 'repeat(5, minmax(0, 1fr))',
      },
    },
  },
  plugins: [],
}
