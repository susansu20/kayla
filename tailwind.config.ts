import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        midnight: "#0A0E27",
        "midnight-2": "#11173A",
        gold: "#D4AF37",
        "gold-soft": "#E8C76A",
        rose: "#F5C6D6",
        ivory: "#FAF6F0",
        burgundy: "#5B0A19",
        "burgundy-2": "#3D0710",
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Georgia", "serif"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui"],
        script: ["var(--font-vibes)", "cursive"],
      },
      boxShadow: {
        gold: "0 0 30px rgba(212,175,55,0.45)",
        "gold-lg": "0 0 80px rgba(212,175,55,0.55)",
      },
      keyframes: {
        heartbeat: {
          "0%, 100%": { transform: "scale(1)", boxShadow: "0 0 30px rgba(212,175,55,0.45)" },
          "50%": { transform: "scale(1.04)", boxShadow: "0 0 60px rgba(212,175,55,0.75)" },
        },
        drift: {
          "0%": { transform: "translateY(0) translateX(0)", opacity: "0" },
          "10%": { opacity: "1" },
          "100%": { transform: "translateY(-120vh) translateX(40px)", opacity: "0" },
        },
        sway: {
          "0%, 100%": { transform: "translateX(0) skewY(0deg)" },
          "50%": { transform: "translateX(-4px) skewY(0.3deg)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        heartbeat: "heartbeat 1.6s ease-in-out infinite",
        drift: "drift 18s linear infinite",
        sway: "sway 6s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
