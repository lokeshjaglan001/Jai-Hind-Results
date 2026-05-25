// tailwind.config.js
const {heroui} = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/components/(accordion|button|card|input|modal|divider|ripple|spinner|form).js"
],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-poppins)", "sans-serif"],
      },
    },
  },
  darkMode: "class",
  plugins: [heroui()],
};