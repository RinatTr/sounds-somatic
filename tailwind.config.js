/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Core palette from new design
        'void':       '#0B0D17',
        'surface':    '#11131d',
        'surface-lo': '#0c0e18',
        'navy':       '#161925',
        'navy-hi':    '#1d1f2a',
        'violet':     '#9D8DF1',
        'violet-dim': '#c9beff',
        'teal':       '#7CB9B5',
        'gold':       '#E8D196',
        // Text
        'on-surface':         '#e1e1f0',
        'on-surface-variant': '#c9c4d3',
        'outline':            '#938f9d',
        'outline-variant':    '#484552',
      },
      fontFamily: {
        mono:    ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
        display: ['Fraunces', 'Georgia', 'serif'],
        sans:    ['Inter', '-apple-system', 'sans-serif'],
      },
      borderRadius: {
        pad: '20px',
      },
      keyframes: {
        'pulse-violet': {
          '0%, 100%': { opacity: '0.4' },
          '50%':       { opacity: '0.8' },
        },
        'modal-in': {
          from: { opacity: '0', transform: 'translateY(10px) scale(0.98)' },
          to:   { opacity: '1', transform: 'translateY(0)   scale(1)' },
        },
      },
      animation: {
        'pulse-violet': 'pulse-violet 4s ease-in-out infinite',
        'modal-in':     'modal-in 0.35s ease forwards',
      },
    },
  },
  plugins: [],
}
