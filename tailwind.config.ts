
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        manga: ["Comic Sans MS", "Comic Neue", "cursive"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Enhanced anime theme colors
        wizard: {
          purple: "#9b87f5",  // Enhanced purple for anime theme
          blue: "#38bdf8",
          pink: "#f472b6",
          green: "#22c55e",
          yellow: "#fde047"
        },
        // Enhanced palette for puzzle letters
        emerald: {
          500: "#10B981",
          600: "#059669",
          700: "#047857"
        },
        amber: {
          400: "#FBBF24",
          500: "#F59E0B",
          600: "#D97706"
        },
        // New anime-themed colors
        anime: {
          purple: "#9b87f5",
          darkPurple: "#7E69AB",
          lightPurple: "#D6BCFA",
          pink: "#f472b6",
          blue: "#38bdf8",
        }
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" }
        },
        "glow": {
          "0%, 100%": { textShadow: "0 0 5px #9b87f5, 0 0 10px #9b87f5" },
          "50%": { textShadow: "0 0 15px #9b87f5, 0 0 20px #9b87f5" }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 5s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite"
      },
      boxShadow: {
        'anime': '0 0 15px rgba(155, 135, 245, 0.5)',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
