/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    screens: {
      // small devices
      'xs': '360px',   // very small phones
      'sm': '640px',   // small phones
      'md': '768px',   // tablets
      'lg': '1024px',  // laptops
      'xl': '1280px',  // desktops
      // default tailwind had '2xl' at 1536px — keeping it
      '2xl': '1536px',

      // additional larger breakpoints beyond default
      '3xl': '1792px',  // large desktop / small TV screens
      '4xl': '2048px',  // 2K-ish
      '5xl': '2304px',  // large 2K / 4K small
      '6xl': '2560px',  // full 4K width (approx)
      '7xl': '2880px',  // very large ultra-wide monitors
    },
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: '#222470',
        'primary-light': '#B3B3FF',
        icon: '#899CC9',
        'text-light': '#ffffff',
        'text-dark': '#1a1a1a',
        'gray-light': '#f5f5f5',
      },
    },
    container: {
      center: true,
      padding: {
        DEFAULT: '1rem',
        sm: '1rem',
        lg: '2rem',
        xl: '3rem',
        '2xl': '4rem',
        '3xl': '4rem',
      },
      screens: {
        // container max widths per breakpoint (optional)
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
        '3xl': '1792px',
      },
    },
  },
  plugins: [],
}
