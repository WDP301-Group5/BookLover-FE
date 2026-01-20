/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class", '[data-mantine-color-scheme="dark"]'],
  plugins: [],
  theme: {
    extend: {
      colors: {
        primary: "#2563EB",
        secondary: "#60A5FA",
        cta: "#F43F5E",
        border: "#DBEAFE",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        heading: ["Montserrat", "sans-serif"],
      },
    },
  },
};
