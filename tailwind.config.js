import plugin from "tailwindcss/plugin";

export default {
  content: ["./src/**/*.{vue,js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "1rem",
      screens: {
        sm: "540px",
        md: "720px",
        lg: "960px",
        xl: "1140px",
        "2xl": "1320px"
      }
    }
  },
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("tw-dark", ".body--dark &");
    })
  ]
};
