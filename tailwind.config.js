/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'neon-pink': '#ff00ff',
        'neon-cyan': '#00ffff',
        'neon-purple': '#9d00ff',
        'neon-blue': '#0066ff',
        'retro-dark': '#0a0e27',
        'retro-darker': '#050816',
      },
      fontFamily: {
        'retro': ['Courier New', 'monospace'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
    },
  },
  plugins: [],
};
