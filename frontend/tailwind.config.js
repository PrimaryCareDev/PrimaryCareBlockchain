const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: 'class',
  theme: {
    extend: {
      width: {
        99: "calc(100% - 16rem);" /* get the width of the main content from lg:viewport by dividing
        (the total width by the width of the side navigation)*/,
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      
    },
  },
  plugins: [require('@tailwindcss/forms')],
}
