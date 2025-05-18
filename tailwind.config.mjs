/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Logo based custom colors
        primary: "#44b59c", // logo-teal
        primaryLight: "#6ac7b3",
        primaryLighter: "#c5ebe2",
        primaryDark: "#44b59c", // same as base teal
        primaryDarker: "#44b59c", // same as base teal
        logoGold: "#f9bc4a", // golden yellow from logo

        // Existing colors preserved (optional)
        background: "var(--background)",
        foreground: "var(--foreground)",
        secondary: "#F7F7F7",
        tertiary: "#223142",
        inputField: "#454545CC",
        textColor: "#454545",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "serif"],
        nunito: ["Nunito Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
