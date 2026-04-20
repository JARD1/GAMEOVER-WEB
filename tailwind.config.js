/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./lib/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        background: "#09090B",
        panel: "#121218",
        border: "#27272A",
        text: "#FAFAFA",
        muted: "#A1A1AA",
        neon: "#A855F7",
        neonSoft: "#D8B4FE"
      },
      boxShadow: {
        neon: "0 0 30px rgba(168, 85, 247, 0.18)"
      },
      backgroundImage: {
        "hero-grid":
          "linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)"
      },
      backgroundSize: {
        grid: "48px 48px"
      },
      fontFamily: {
        display: ["Orbitron", "sans-serif"],
        body: ["Rajdhani", "sans-serif"]
      }
    }
  },
  plugins: []
};
