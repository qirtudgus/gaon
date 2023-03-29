/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blue: { 100: "yellow", 500: "#e5005a" },
      },
    },
  },
  plugins: [],
};
