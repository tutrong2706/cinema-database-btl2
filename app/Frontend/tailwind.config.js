// tailwind.config.js
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Đảm bảo quét tất cả các component của bạn
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}