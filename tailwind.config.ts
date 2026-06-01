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
      },
    },
  },
  plugins: [],
};
export default config;
