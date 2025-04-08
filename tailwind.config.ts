
import { fontFamily } from "tailwindcss/defaultTheme";
import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
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
        "wizard-purple": "hsl(var(--wizard-purple))",
        "wizard-blue": "hsl(var(--wizard-blue))",
        "wizard-yellow": "hsl(var(--wizard-yellow))",
        "wizard-green": "hsl(var(--wizard-green))",
        "wizard-pink": "hsl(var(--wizard-pink))",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
        manga: ["Bangers", ...fontFamily.sans],
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
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-glow": {
          "0%, 100%": {
            opacity: "0.2",
            transform: "scale(1)",
          },
          "50%": {
            opacity: "0.4",
            transform: "scale(1.05)",
          },
        },
        "wiggle": {
          "0%, 100%": { transform: "rotate(0deg)" },
          "25%": { transform: "rotate(5deg)" },
          "75%": { transform: "rotate(-5deg)" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "bounce-light": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-5px)" },
        },
        "scale-in": {
          "0%": { 
            transform: "scale(0.95)", 
            opacity: "0" 
          },
          "100%": { 
            transform: "scale(1)", 
            opacity: "1" 
          }
        },
        "shimmer": {
          "0%": {
            transform: "translateX(-100%)"
          },
          "100%": {
            transform: "translateX(100%)"
          }
        },
        "fade-in": {
          "0%": { 
            opacity: "0",
            transform: "translateY(10px)"
          },
          "100%": { 
            opacity: "1",
            transform: "translateY(0)"
          }
        },
        "sakura-fall": {
          "0%": {
            transform: "translateY(-10px) rotate(0deg)",
            opacity: "0"
          },
          "10%": {
            opacity: "1"
          },
          "100%": {
            transform: "translateY(100vh) rotate(720deg)",
            opacity: "0"
          }
        },
        "magical-glow": {
          "0%, 100%": {
            boxShadow: "0 0 10px 2px rgba(139, 92, 246, 0.3)"
          },
          "50%": {
            boxShadow: "0 0 20px 5px rgba(139, 92, 246, 0.5)"
          }
        },
        "letter-pop": {
          "0%": {
            transform: "scale(0.8)",
            opacity: "0"
          },
          "100%": {
            transform: "scale(1)",
            opacity: "1"
          }
        },
        "rotate-border": {
          "0%": {
            backgroundPosition: "0% 50%"
          },
          "50%": {
            backgroundPosition: "100% 50%"
          },
          "100%": {
            backgroundPosition: "0% 50%"
          }
        }
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "float": "float 3s ease-in-out infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "wiggle": "wiggle 2s ease-in-out infinite",
        "spin-slow": "spin-slow 6s linear infinite",
        "bounce-light": "bounce-light 2s ease-in-out infinite",
        "scale-in": "scale-in 0.3s ease-out",
        "shimmer": "shimmer 2s infinite",
        "fade-in": "fade-in 0.3s ease-out",
        "sakura-fall": "sakura-fall 10s linear forwards",
        "magical-glow": "magical-glow 3s ease-in-out infinite",
        "letter-pop": "letter-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        "rotate-border": "rotate-border 3s linear infinite"
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
