/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        eunry: {
          50: '#faf7f6',
          100: '#f6ecea',
          200: '#efdcd9',
          300: '#e2c4bf',
          400: '#cd9b93',
          500: '#bc8177',
          600: '#a6665c',
          700: '#8a544b',
          800: '#744740',
          900: '#62403a',
          950: '#331f1c',
        },
        template: {
          light: '#f6ecea',      // eunry-100
          dark: '#744740',       // eunry-800
          warm: '#cd9b93',       // eunry-400
          primary: '#bc8177',    // eunry-500
        },
        border: 'rgba(116, 71, 64, 0.2)',  // eunry-800 with opacity
        input: 'rgba(116, 71, 64, 0.2)',
        ring: '#bc8177',                   // eunry-500
        background: '#f6ecea',             // eunry-100
        foreground: '#744740',             // eunry-800
        primary: {
          DEFAULT: '#bc8177',              // eunry-500
          foreground: '#faf7f6',          // eunry-50
        },
        secondary: {
          DEFAULT: '#cd9b93',              // eunry-400
          foreground: '#faf7f6',          // eunry-50
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#fafafa',
        },
        muted: {
          DEFAULT: '#efdcd9',              // eunry-200
          foreground: '#744740',           // eunry-800
        },
        accent: {
          DEFAULT: '#a6665c',              // eunry-600
          foreground: '#faf7f6',          // eunry-50
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#744740',           // eunry-800
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#744740',           // eunry-800
        },
      },
      borderRadius: {
        lg: '0.5rem',
        md: 'calc(0.5rem - 2px)',
        sm: 'calc(0.5rem - 4px)',
      },
    },
  },
  plugins: [],
}
