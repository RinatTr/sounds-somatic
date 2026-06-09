/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        charcoal:    '#1c1c1c',
        gold:        '#E8D196',
        'teal-pad':  '#7CB9B5',
        'teal-dark': '#68A39F',
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'sans-serif'],
      },
      keyframes: {
        modalFadeIn: {
          from: { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
      },
      animation: {
        'modal-in': 'modalFadeIn 0.35s ease',
      },
    },
  },
  plugins: [],
}