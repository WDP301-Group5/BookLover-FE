/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class", // hoặc 'media' nếu muốn tự động theo hệ thống
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
        sans: ["Open Sans", "sans-serif"],
        heading: ["Poppins", "sans-serif"],
      },
    },
  },
};
