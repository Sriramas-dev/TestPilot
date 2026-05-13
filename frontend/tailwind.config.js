/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Geist", "system-ui", "sans-serif"],
        serif: ["Instrument Serif", "Georgia", "serif"],
        mono: ["DM Mono", "Menlo", "monospace"],
      },
      colors: {
        stone: {
          25: "#FAFAF8",
          50: "#F4F3EF",
        },
      },
      borderRadius: {
        "2xl": "16px",
        "3xl": "20px",
      },
      boxShadow: {
        card: "0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)",
        float: "0 4px 16px rgba(0,0,0,0.08), 0 2px 6px rgba(0,0,0,0.04)",
        lift: "0 20px 40px rgba(0,0,0,0.10), 0 8px 16px rgba(0,0,0,0.05)",
      },
    },
  },
  plugins: [],
};
