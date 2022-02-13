const { emerald, orange } = require("tailwindcss/colors");
const typography = require("@tailwindcss/typography");
const plugin = require("tailwindcss/plugin");
const utils = plugin(({ addUtilities }) => {
  addUtilities({
    ".clickable": {
      "touch-action": "manipulation",
      "-webkit-tap-highlight-color": "transparent",
      "user-select": "none",
      cursor: "pointer"
    }
  });
});

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      borderRadius: {
        "4xl": "2rem"
      },
      boxShadow: {
        smooth: "0px 4px 32px rgba(0, 0, 0, 0.07);"
      },
      colors: {
        primary: orange,
        action: emerald
      }
    }
  },
  plugins: [typography, utils]
};
