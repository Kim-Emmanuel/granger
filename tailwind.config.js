/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          blue: '#4aa5d6',
          orange: '#ea580c',
          dark: '#0f0f11',
          gray: '#f3f4f6',
          mint: '#a3e635',
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      borderRadius: {
        '4xl': '2.5rem',
      }
    },
  },
  plugins: [],
}