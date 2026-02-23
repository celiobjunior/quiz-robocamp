import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brandWine: "var(--color-wine)",
        brandBlack: "var(--color-black)",
        brandWhite: "var(--color-white)"
      },
      boxShadow: {
        brut: "var(--shadow-offset) var(--shadow-offset) 0 var(--color-black)",
        brutSoft: "4px 4px 0 var(--color-black)"
      },
      borderWidth: {
        brut: "4px"
      },
      fontFamily: {
        display: ['"Archivo Black"', "sans-serif"],
        body: ['"IBM Plex Mono"', "monospace"]
      },
      keyframes: {
        rise: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      },
      animation: {
        rise: "rise 0.45s ease-out both"
      }
    }
  },
  plugins: []
} satisfies Config;
