import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ["Montserrat", "sans-serif"],
        orbitron: ["Orbitron", "sans-serif"],
      },
      colors: {
        neon: {
          cyan: "#00CFFF",
          blue: "#0077FF",
        },
        dark: {
          900: "#000000",
          800: "#050D1A",
          700: "#0A1A2F",
          600: "#0D2440",
          500: "#102B4E",
        },
        brand: {
          primary: "#00CFFF",
          secondary: "#0077FF",
          dark: "#0A1A2F",
        },
      },
      boxShadow: {
        neon: "0 0 20px rgba(0, 207, 255, 0.5), 0 0 40px rgba(0, 207, 255, 0.2)",
        "neon-sm": "0 0 10px rgba(0, 207, 255, 0.4), 0 0 20px rgba(0, 207, 255, 0.15)",
        "neon-lg": "0 0 30px rgba(0, 207, 255, 0.6), 0 0 60px rgba(0, 207, 255, 0.3)",
        card: "0 4px 24px rgba(0, 207, 255, 0.15), 0 1px 4px rgba(0,0,0,0.5)",
      },
      animation: {
        "pulse-neon": "pulseNeon 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
        "slide-up": "slideUp 0.4s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
      },
      keyframes: {
        pulseNeon: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0,207,255,0.4), 0 0 20px rgba(0,207,255,0.2)" },
          "50%": { boxShadow: "0 0 25px rgba(0,207,255,0.8), 0 0 50px rgba(0,207,255,0.4)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        slideUp: {
          from: { opacity: "0", transform: "translateY(20px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      backgroundImage: {
        "grid-pattern": "linear-gradient(rgba(0,207,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(0,207,255,0.05) 1px, transparent 1px)",
        "glow-radial": "radial-gradient(ellipse at center, rgba(0,207,255,0.15) 0%, transparent 70%)",
        "hero-gradient": "linear-gradient(135deg, #000000 0%, #0A1A2F 50%, #050D1A 100%)",
        "card-gradient": "linear-gradient(135deg, #0D2440 0%, #050D1A 100%)",
        "btn-gradient": "linear-gradient(135deg, #0077FF 0%, #00CFFF 100%)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
