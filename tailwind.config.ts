module.exports = {
  theme: {
    extend: {
      keyframes: {
        fadeOut: {
          "0%, 90%": { opacity: "1" }, // Show for 1.8s
          "100%": { opacity: "0" }, // Fade out at 2s
        },
      },
      animation: {
        fadeOut: "fadeOut 2s forwards",
      },
    },
  },
  plugins: [],
};
