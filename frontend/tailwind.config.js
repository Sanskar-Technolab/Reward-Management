/** @type {import('tailwindcss').Config} */
const colors = require("tailwindcss/colors");
const plugin = require("tailwindcss/plugin");
module.exports = {
  darkMode: ["class"],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
     './node_modules/preline/preline.js',
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    screens: {
      lg: "992px",
      md: "768px",
      sm: "480px",
      xl: "1200px",
      xxl: "1400px",
      xxxl: "1800px",
    },
    borderRadius: {
      none: "0",
      sm: "0.25rem",
      md: "0.5rem",
      lg: "0.75rem",
      xl: "1rem",
      full: "9999px",
    },
    fontFamily: {
      inter: ["Inter", "sans-serif"],
      Montserrat: ["Montserrat","sans-serif"],
    },
    fontSize: {
      defaultsize: '0.813rem',
      xs:'0.75rem',
      sm:'0.896rem',
      base:'1rem',
      lg:'1.125rem',
      xl:'1.25rem',
      '2xl':'1.5rem',
      '3xl':'1.875rem',
      '4xl':'2.25rem',
      '5xl':'3rem',
      '6xl':'3.75rem',
      '7xl':'4.5rem',
      '8xl':'6rem',
      '9xl':'8rem',
    },
    extend: {
      colors: {
        gray: {
          100: "#f9fafb",
          200: "#f2f4f5",
          300: "#e6eaeb",
          400: "#dbdfe1",
          500: "#949eb7",
          600: "#7987a1",
          700: "#4d5875",
          800: "#383853",
          900: "#323251",
        },
        bodybg:"rgb(var(--body-bg))",
        bodybg2:"rgb(var(--dark-bg))",
        primary: "rgb(var(--primary))",
        primaryrgb: "rgb(var(--primary-rgb))",
        secondary: "rgb(var(--secondary))",
        success: "rgb(var(--success))",
        info: "rgb(var(--info))",
        warning: "rgb(var(--warning))",
        danger: "rgb(var(--danger))",
        light:"rgb(var(--light))",
        orange:"rgb(var(--orange))",
        pink:"rgb(var(--pink))",
        teal:"rgb(var(-teal))",
        purple:"rgb(var(--purple))",
        defaulttextcolor:"rgb(var(--default-text-color))",
        defaultborder:"rgb(var(--default-border))",
        defaultbackground:"rgb(var(--default-background))",
        menuprimecolor:"rgb(var(--menu-prime-color))",
        menubordercolor:"rgb(var(--menu-border-color))",
        headerprimecolor:"rgb(var(--header-prime-color))",
        headerbordercolor:"rgb(var(--header-border-color))",
        listhoverfocusbg:"rgb(var(--list-hover-focus-bg))",
        textmuted:"rgb(var(--text-muted))",
        inputborder:"rgb(var(--input-border))",
        red:"rgb(var(--red))",
        blue:"rgb(var(--blue))",
        green:"rgb(var(--green))",
        cyan:"rgb(var(--cyan))",
        indigo:"rgb(var(--indigo))",
        yellow:"rgb(var(--yellow))",
        facebook:"rgb(var(--facebook))",
        twitter:"rgb(var(--twitter))",
        github:"rgb(var(--github))",
        google:"rgb(var(--google))",
        youtube:"rgb(var(--youtube))",

        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
       
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      gradientColorStops: {
        primary: 'rgb(var(--primary))',
        secondary: 'rgb(var(--secondary))',
        success: 'rgb(var(--success))',
        warning: 'rgb(var(--warning))',
        pink: 'rgb(var(--pink))',
        teal: 'rgb(var(--teal))',
        danger: 'rgb(var(--danger))',
        info: 'rgb(var(--info))',
        orange: 'rgb(var(--orange))',
        purple: 'rgb(var(--purple))',
        light: 'rgb(var(--light))',
        dark: 'rgb(var(--dark))',
      },

      linearGradientDirections: {
        'to-right': 'to right',
      },

      linearGradientColors: {
        'primary-to-blue': ['primary 0%', '#0086ed 100%'],
        'secondary-to-blue': ['secondary 0%', '#6789D8 100%'],
        'success-to-blue': ['success 0%', '#00A1C0 100%'],
        'warning-to-blue': ['warning 0%', '#7FA53A 100%'],
        'pink-to-blue': ['pink 0%', '#FFA795 100%'],
        'teal-to-blue': ['teal 0%', '#0695DD 100%'],
        'danger-to-blue': ['danger 0%', '#A34A88 100%'],
        'info-to-blue': ['info 0%', '#52F0CE 100%'],
        'orange-to-blue': ['orange 0%', '#9BA815 100%'],
        'purple-to-blue': ['purple 0%', '#FF496D 100%'],
        'light-to-blue': ['light 0%', '#D1D6DE 100%'],
        'dark-to-blue': ['dark 0%', '#54505D 100%'],
      },
      boxShadow: {
        defaultshadow:"0 0.125rem 0 rgba(10, 10, 10, .04)",
      },
      backgroundImage: {
        instagram:"linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-1": "linear-gradient(102deg,transparent 41%,primary/50 0)",
        "gradient-1": "linear-gradient(102deg,light 41%,transparent 0)",
      },

      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        particles: {
          "0%": {
            transform: " translateY(0) rotate(0)",
            opacity: 1,
          },
          "100%": {
            transform: "translateY(-90px) rotate(180deg)",
            opacity: " 0",
          },
        },
        pulse: {
          "0%, 100%": {
            opacity: 1,
          },
          "50%": {
            opacity: 0.5,
          },
        },
        ping:{
          "75%, 100%": {
            transform: "scale(2)",
            opacity: "0",
          }
        },
        bounce: {
          "0%, 100% ": {
            transform: "translateY(-25%)",
            " animation-timing-function": "cubic-bezier(0.8, 0, 1, 1)",
          },
          "50%": {
            transform: "translateY(0)",
            "animation-timing-function": "cubic-bezier(0, 0, 0.2, 1)",
          },
        },
        ring: {
          "0%": { transform: "rotateZ(0)" },
        "1%": { transform: "rotateZ(30deg)" },
        "3%": { transform: "rotateZ(-28deg)" },
        "5%": { transform: "rotateZ(34deg)" },
        "7%": { transform: "rotateZ(-32deg)" },
        "9%": { transform: "rotateZ(30deg)" },
        "11%": { transform: "rotateZ(-28deg)" },
        "13%": { transform: "rotateZ(26deg)" },
        "15%": { transform: "rotateZ(-24deg)" },
        "17%": { transform: "rotateZ(22deg)" },
        "19%": { transform: "rotateZ(-20deg)" },
        "21%": { transform: "rotateZ(18deg)" },
        "23%": { transform: "rotateZ(-16deg)" },
        "25%": { transform: "rotateZ(14deg)" },
        "27%": { transform: "rotateZ(-12deg)" },
        "29%": { transform: "rotateZ(10deg)" },
        "31%": { transform: "rotateZ(-8deg)" },
        "33%": { transform: "rotateZ(6deg)" },
        "35%": { transform: "rotateZ(-4deg)" },
        "37%": { transform: "rotateZ(2deg)" },
        "39%": { transform: "rotateZ(-1deg)" },
        "41%": { transform: "rotateZ(1deg)" },
        "43%": { transform: "rotateZ(0)" },
        "100%":{ transform: "rotateZ(0)" },
        },
        wase:{
          '0%, 100%': { transform: 'rotate(-3deg)' },
            '50%': { transform: 'rotate(3deg)' },
        },
        spin: {
          from: {
            transform: "rotate(0deg)",
          },
          to: {
            transform: "rotate(360deg)",
          },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      
          projects: "particles 2s linear infinite",
          spin: "spin 1s linear infinite",
          ping: "ping 1s cubic-bezier(0, 0, 0.2, 1) infinite",
          pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
          bounce: "bounce 1s infinite",
          bell:"ring 2s ease-in-out infinite",
          wase:"wase 4s linear infinite",
          'spin-slow': 'spin 3s linear infinite',
          'slow-ping':'ping 2s linear infinite',
          'animate-wase': 'wase 4s linear infinite',
      },
    },
  },
  variants: {},
  plugins: [require("tailwindcss-animate"),
    require("tailwindcss"),
  require("@tailwindcss/forms"),
  require("preline/plugin"),
  plugin(function ({ addComponents ,addBase}) {
    addComponents({
      ".dirrtl": {
        direction: "ltr",
      },
      ".dir-rtl": {
        direction: "rtl",
      },
      ".dir-ltr": {
        direction: "ltr",
      },
      '.h1': { fontSize: '2.5rem' },
      '.h2': { fontSize: '2rem' },
      '.h3': { fontSize: '1.75rem' },
      '.h4': { fontSize: '1.5rem' },
      '.h5': { fontSize: '1.25rem' },
      '.h6': { fontSize: '1rem' },
    });
    addBase({
      'h1': { fontSize: '2.5rem' },
      'h2': { fontSize: '2rem' },
      'h3': { fontSize: '1.75rem' },
      'h4': { fontSize: '1.5rem' },
      'h5': { fontSize: '1.25rem' },
      'h6': { fontSize: '1rem' },
    })
  }),
  ],
}