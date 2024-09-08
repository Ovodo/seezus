/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#EFB082",
        secondary: "#253366",
        secondary_light: "#087BC7",
        secondary_dark: "#063B84",
        appLight: "#7EBBE2",
      },
    },
  },
  plugins: [],
};
