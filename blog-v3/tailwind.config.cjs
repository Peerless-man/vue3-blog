/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    extend: {},
    colors: {
      "primary-blue": "#5cbfef",
    },
  },
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};
