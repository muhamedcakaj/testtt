/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html"
    , "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
module.exports = {
  mode: 'jit',
  purge: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {},
  },
  variants: {},
  plugins: [],
};

