/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        light: "#FCFCFC",
        dark: "#181818",
        graydarker: "#494949",
        graylighter: "#6B6B6B",
        opacity: "rgba(0, 0, 0, 0.89)",
        opacity2: "rgba(48, 48, 48, 0.58)",
        lightblue: "#04b290",
        green: "#bbff15",
        pink: "#e206f4",
        orange: "#fa8f42",
      },
      backdropFilter: {
        blur: "blur(5px)",
      },
      fontFamily: {
        primary: ["Poppins", "sans-serif"],
        accent: ["Prompt", "sans-serif"],
      },
      screens: {
        xs: "320px",
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1700px",
      },
    },
  },
  darkmode: "class",
};

export default config;
