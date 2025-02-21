import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";
import { withUt } from "uploadthing/tw";

const config: Config = withUt({
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/layouts/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      container: {
        center: true,
        padding: "1rem",
      },
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        descurative: "var(--descurative)",
        primary: {
          DEFAULT: "#3b82f6",
          // You can also define different shades if needed
          light: "#60a5fa",
          dark: "#2563eb",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        /**
         * Original source:
         * @see https://github.com/juliusmarminge/acme-corp/blob/main/tooling/tailwind/index.ts
         */
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "75%": {
            opacity: "0.6",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
        "fade-down": {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "75%": {
            opacity: "0.6",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-up": "fade-up 0.5s ease-out",
        "fade-down": "fade-down 0.5s ease-out",
      },
    },
  },
  plugins: [animate],
});

export default config;
