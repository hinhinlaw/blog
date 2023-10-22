/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./styles/**/*.css",
  ],
  theme: {
    extend: {},
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
