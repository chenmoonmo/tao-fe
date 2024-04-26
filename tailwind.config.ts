import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        system: "#1F2127",
        secondary: "#9699A3",
      },
      borderWidth: {
        px: "1px",
      },
      borderColor: {
        primary: "#313235",
      },
      textColor: {
        primary: "#e0e0e0",
        secondary: "#737884",
      },
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
