const { emerald, orange } = require("tailwindcss/colors");
const typography = require("@tailwindcss/typography");
const forms = require("@tailwindcss/forms");
const aspectRatio = require("@tailwindcss/aspect-ratio");
const lineClamp = require("@tailwindcss/line-clamp");

const plugin = require("tailwindcss/plugin");
const utils = plugin(({ addUtilities }) => {
  addUtilities({
    ".clickable": {
      "touch-action": "manipulation",
      "-webkit-tap-highlight-color": "transparent",
      "user-select": "none",
      cursor: "pointer"
    },
    ".pixelated": {
      "-ms-interpolation-mode": "nearest-neighbor",
      "image-rendering": "pixelated"
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
      },
      fontFamily: {
        default: "Nunito, ui-sans-serif, sans-serif",
        heading: "Montserrat Alternates, ui-sans-serif, Apple Color Emoji, sans-serif"
      }
    }
  },
  plugins: [typography, forms, lineClamp, aspectRatio, utils]
};
