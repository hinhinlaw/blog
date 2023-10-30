/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            color: 'rgb(113 113 122 )',
            strong: {
              color: 'rgb(113 113 122 )',
            }
          }
        }
      }
    },
    fontFamily: {
      'SometypeMono': ['SometypeMono'],
      'robotoBold': ['robotoBold'],
      'lato': ['lato'],
    }
  },
  plugins: [
    require("@tailwindcss/typography")
  ],
};
