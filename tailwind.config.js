/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#4F46E5", // Indigo
        secondary: "#10B981", // Emerald
        background: "#F9FAFB", // Light gray
        completed: "#D1FAE5", // Light green
      },
      animation: {
        "bounce-slow": "bounce 1.5s infinite",
      },
    },
  },
  plugins: [],
};
