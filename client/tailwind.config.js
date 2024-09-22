/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        customCancel: "#FF5154",
        customView: "#00B0FF",
        customSubmit: "#97C95C",
        sidebarBg: "#1F2937",
        sidebarHighlight: "#2190F6",
        customHighlight: "#2190F6" 
      }
    },
  },
  plugins: [],
}