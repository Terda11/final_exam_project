import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./store/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          300: "#93c5fd",
          400: "#60a5fa",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          800: "#1e40af",
          900: "#1e3a8a",
          950: "#172554",
        },
      },

      fontFamily: {
        sans:  ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        mono:  ["var(--font-jetbrains)", "monospace"],
      },

      boxShadow: {
        card:       "0 1px 4px 0 rgb(0 0 0 / .06), 0 1px 2px -1px rgb(0 0 0 / .04)",
        "card-hover": "0 8px 30px 0 rgb(37 99 235 / .12), 0 2px 8px -2px rgb(0 0 0 / .08)",
        "price-glow": "0 2px 12px 0 rgb(37 99 235 / .2)",
      },

      animation: {
        "fade-in":   "fadeIn .25s ease-out",
        "slide-up":  "slideUp .3s cubic-bezier(.16,1,.3,1)",
        "scale-in":  "scaleIn .2s ease-out",
        shimmer:     "shimmer 1.6s linear infinite",
      },

      keyframes: {
        fadeIn:   { from: { opacity: "0" }, to: { opacity: "1" } },
        slideUp:  { from: { opacity: "0", transform: "translateY(10px)" }, to: { opacity: "1", transform: "translateY(0)" } },
        scaleIn:  { from: { opacity: "0", transform: "scale(.95)" }, to: { opacity: "1", transform: "scale(1)" } },
        shimmer:  { from: { backgroundPosition: "-200% 0" }, to: { backgroundPosition: "200% 0" } },
      },

      screens: { xs: "475px" },
    },
  },
  plugins: [],
};

export default config;
