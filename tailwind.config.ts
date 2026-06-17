import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        accent: "#C4FF00",
        brandBg: "#000000",
        brandSecondary: "#202020",
        brandCard: "#111111",
        textPrimary: "#FFFFFF",
        textSecondary: "#A0A0A0",
        borderDark: "rgba(255, 255, 255, 0.08)",
        borderActive: "rgba(196, 255, 0, 0.5)",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
      },
      boxShadow: {
        glow: "0 0 16px rgba(196, 255, 0, 0.15)",
        glowStrong: "0 0 20px rgba(196, 255, 0, 0.4)",
      },
      animation: {
        pulseGlow: "pulseGlow 2s infinite ease-in-out",
        slideInRight: "slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        fadeIn: "fadeIn 0.4s ease-out forwards",
        slideUp: "slideUp 0.3s ease-out forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 5px rgba(196, 255, 0, 0.1), inset 0 0 5px rgba(196, 255, 0, 0.05)" },
          "50%": { boxShadow: "0 0 15px rgba(196, 255, 0, 0.25), inset 0 0 10px rgba(196, 255, 0, 0.1)" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
