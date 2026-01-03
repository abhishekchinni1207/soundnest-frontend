/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",

  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}"
  ],

  theme: {
    extend: {
      colors: {
        primary: "#1bfab7",      // SoundNest / Spotify-style accent
        darkBg: "#0F172A",
        darkCard: "#020617",
        accent: "#1bfab7",       // alias for consistency
      },
    },
  },

  plugins: [],
};
