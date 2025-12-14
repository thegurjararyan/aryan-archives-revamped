/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        paper: '#efe6d5',
        ink: '#1a1a1a',
        accent: '#c0392b',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        hand: ['"Reenie Beanie"', 'cursive'],
        hindi: ['"Tiro Devanagari Hindi"', 'serif'],
      },
      animation: {
        'draw': 'draw 1s ease-out forwards',
      },
      keyframes: {
        draw: {
          '0%': { strokeDasharray: '0, 1000' },
          '100%': { strokeDasharray: '1000, 0' },
        }
      }
    },
  },
  plugins: [],
}