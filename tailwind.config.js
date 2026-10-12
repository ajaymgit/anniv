/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        pop: {
          bg: "#f7faf8",          // Fresh vanilla matcha cream
          surface: "#ffffff",     // Clean pearl white
          card: "#ffffff",
          cardSoft: "#f0fdf4",    // Soft honeydew mint surface
          border: "#bbf7d0",      // Pastel mint lace border
          borderLight: "#dcfce7",
          bubblegum: "#4ade80",   // Soft fresh pastel green
          strawberry: "#86efac",  // Mint matcha pastel
          cottonCandy: "#a7f3d0", // Pastel seafoam
          blush: "#dcfce7",       // Soft sage blush
          lavenderHaze: "#d1fae5",// Soft tea haze
          lilac: "#a7f3d0",
          lemonGlaze: "#fef9c3",  // Buttercup glaze
          butter: "#fef9c3",
          matchaMilk: "#dcfce7",  // Soft matcha latte mint
          mint: "#bbf7d0",
          powderSky: "#e0f2fe",   // Pastel daydream sky
          periwinkle: "#e0e7ff",
          peachCream: "#ffedd5",  // Peaches and cream
          apricot: "#fed7aa",
          text: "#132e22",        // Deep forest/pine slate (warm, high contrast)
          textMuted: "#3d6350",   // Muted moss sage
          textLight: "#6e9981",   // Dusty sage accent
          accentPink: "#10b981",  // Emerald accent
          accentCherry: "#059669"
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', "system-ui", "-apple-system", "sans-serif"],
        serif: ['"Cormorant Garamond"', "Georgia", "serif"],
        script: ['"Caveat"', '"Dancing Script"', "cursive"]
      },
      boxShadow: {
        pop: "0 10px 30px -5px rgba(74, 222, 128, 0.15), 0 4px 12px -2px rgba(134, 239, 172, 0.10)",
        popHover: "0 18px 40px -8px rgba(74, 222, 128, 0.22), 0 8px 20px -3px rgba(110, 231, 183, 0.15)",
        card: "0 6px 20px -3px rgba(30, 60, 45, 0.06), 0 2px 6px -1px rgba(30, 60, 45, 0.03)"
      }
    },
  },
  plugins: [],
}
