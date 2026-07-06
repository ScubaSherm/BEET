/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        readiness: {
          ink: "#17202a",
          panel: "#f7f8f3",
          pine: "#1f5c4d",
          signal: "#d9442f",
          amber: "#d99025",
          steel: "#496579",
          water: "#2f7fa6"
        }
      }
    }
  },
  plugins: [],
};
