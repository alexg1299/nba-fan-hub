import type { Config } from "tailwindcss";
const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Barlow Condensed'", "sans-serif"],
        hero: ["'Anton'", "'Barlow Condensed'", "sans-serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        court: {
          50:  "#FFF8F0",
          100: "#FFE9CC",
          200: "#FFD099",
          300: "#FFAD47",
          400: "#FF8C00",
          500: "#E07800",
          600: "#B85F00",
          700: "#8A4500",
          800: "#5C2E00",
          900: "#2E1700",
        },
        hardwood: {
          50:  "#F7F5F0",
          100: "#EDE8DC",
          200: "#D9CEB8",
          300: "#BEB090",
          400: "#9E9070",
          500: "#807055",
          600: "#635440",
          700: "#483C2E",
          800: "#2E261C",
          900: "#17130E",
        }
      },
      animation: {
        "slide-up": "slideUp 0.4s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "score-flash": "scoreFlash 0.6s ease-out",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        scoreFlash: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)", color: "#FF8C00" },
          "100%": { transform: "scale(1)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
