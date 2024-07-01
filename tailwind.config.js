const getSpacing = () => {
  const space = 4;
  const increments = 112;
  const values = [];
  for (let i = 1; i < increments; i++) {
    values.push({ [i]: `${i * space}px` });
  }
  return values.reduce((acc, curr) => ({ ...acc, ...curr }), {});
};

module.exports = {
  content: ["src/**/*.jsx", "src/**/*.tsx"],
  darkMode: ["class", '[data-theme="dark"]'],
  theme: {
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    fontFamily: {
      title: ["Degular", "Helvetica", "sans-serif"],
      display: ["Inter", "Helvetica", "sans-serif"],
      body: ["Inter", "Helvetica", "sans-serif"],
    },
    fontSize: {
      xs: ["12px", "18px"],
      sm: ["14px", "21px"],
      base: ["16px", "24px"],
      lg: ["18px", "26px"],
      xl: ["24px", "32px"],
      "2xl": ["28px", "1"],
      "3xl": ["32px", "1"],
      "4xl": ["40px", "1"],
      "5xl": ["48px", "1"],
      "6xl": ["56px", "1"],
      "7xl": ["60px", "1"],
      "8xl": ["64px", "1"],
      "9xl": ["68px", "1"],
    },
    extend: {
      colors: {
        nextflow: {
          100: "#E2F7F3",
          200: "#B6ECE2",
          300: "#86E0CE",
          400: "#56D3BA",
          500: "#31C9AC",
          600: "#0DC09D",
          700: "#0CAE8E",
          800: "#0A967B",
          900: "#087F68",
          1000: "#065647",
          DEFAULT: "#0DC09D",
        },
        wave: {
          100: "#E8F2FF",
          200: "#C5DFFE",
          300: "#9ECAFE",
          400: "#77B5FE",
          500: "#5AA5FD",
          600: "#3D95FD",
          700: "#3787E5",
          800: "#3074C5",
          900: "#2863A7",
          1000: "#1B4372",
          DEFAULT: "#3D95FD",
        },
        fusion: {
          100: "#FEEDEC",
          200: "#FED2D0",
          300: "#FDB4B1",
          400: "#FC9592",
          500: "#FB7F7A",
          600: "#FA6863",
          700: "#E25E5A",
          800: "#C3514D",
          900: "#A64541",
          1000: "#712F2C",
          DEFAULT: "#FA6863",
        },
        multiqc: {
          100: "#FDF0E9",
          200: "#FBD9C8",
          300: "#F8C0A3",
          400: "#F5A67E",
          500: "#F39362",
          600: "#F18046",
          700: "#DA743F",
          800: "#BC6437",
          900: "#A0552F",
          1000: "#6C3A20",
          DEFAULT: "#F18046",
        },
        brand: {
          100: "#F3F3F4",
          200: "#E8E7E9",
          300: "#D0CFD4",
          400: "#B9B7BE",
          500: "#A29FA8",
          600: "#8A8792",
          700: "#736F7D",
          800: "#5C5767",
          900: "#453F51",
          1000: "#2D273C",
          1100: "#160F26",
          1200: "#151121",
          1300: "#141024",
          1400: "#110D1D",
          DEFAULT: "#160F26",
        },
        gray: {
          100: "#F7F7F7",
          200: "#EAEBEB",
          300: "#DDDEDE",
          400: "#CFD0D1",
          500: "#C4C6C7",
          600: "#BABCBD",
          700: "#A8AAAB",
          800: "#919393",
          900: "#7B7B7B",
          1000: "#545555",
        },
        product: {
          100: "#EAE8F1",
          200: "#CBC6DD",
          300: "#A9A1C6",
          400: "#867BAF",
          500: "#6C5E9D",
          600: "#52428C",
          700: "#4A3C7F",
          800: "#40346D",
          900: "#362C5D",
          1000: "#251E3F",
        },
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        full: "9999px",
      },
      margin: {
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
        "-1/12": "-8.333333%",
        "-2/12": "-16.666667%",
        "-3/12": "-25%",
        "-4/12": "-33.333333%",
        "-5/12": "-41.666667%",
        "-6/12": "-50%",
        "-7/12": "-58.333333%",
        "-8/12": "-66.666667%",
        "-9/12": "-75%",
        "-10/12": "-83.333333%",
        "-11/12": "-91.666667%",
      },
      flex: {
        "1/1": "0 0 100%",
        "1/12": "0 0 8.333333%",
        "2/12": "0 0 16.666667%",
        "3/12": "0 0 25%",
        "4/12": "0 0 33.333333%",
        "5/12": "0 0 41.666667%",
        "6/12": "0 0 50%",
        "7/12": "0 0 58.333333%",
        "8/12": "0 0 66.666667%",
        "9/12": "0 0 75%",
        "10/12": "0 0 83.333333%",
        "11/12": "0 0 91.666667%",
        "1/5": "0 0 20%",
      },
      height: {
        18: "4.5rem",
      },
      minWidth: {
        "1/12": "8.333333%",
        "2/12": "16.666667%",
        "3/12": "25%",
        "4/12": "33.333333%",
        "5/12": "41.666667%",
        "6/12": "50%",
        "7/12": "58.333333%",
        "8/12": "66.666667%",
        "9/12": "75%",
        "10/12": "83.333333%",
        "11/12": "91.666667%",
        "1/5": "20%",
      },
      shadow: {
        default: "0px 5px 10px rgba(0, 0, 0, 0.1)",
        xl: "0 2px 21px 11px rgba(0,0,0,0.05)",
      },
      spacing: getSpacing(),
      zIndex: {
        header: 100,
        sidebar: 150,
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      function extractColorVars(colorObj, colorGroup = "") {
        return Object.keys(colorObj).reduce((vars, colorKey) => {
          const value = colorObj[colorKey];

          const newVars =
            typeof value === "string"
              ? { [`--color${colorGroup}-${colorKey}`]: value }
              : extractColorVars(value, `-${colorKey}`);

          return { ...vars, ...newVars };
        }, {});
      }

      addUtilities({
        html: extractColorVars(theme("colors")),
      });
    },
  ],
};
