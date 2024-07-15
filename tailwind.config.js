const windmill = require("@roketid/windmill-react-ui/config");
module.exports = windmill({
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./pages/admin/**/*.{js,ts,jsx,tsx}",
    "./app/components/**/*.{js,ts,jsx,tsx}",
    "./app/containers/**/*.{js,ts,jsx,tsx}",
  ],
  extend: {},
  plugins: [],
});
