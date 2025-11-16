/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        template: {
          light: '#E7DFE2',
          dark: '#94727E',
          warm: '#CD9B93',
          primary: '#88D7BA',
        },
        border: 'rgba(148, 114, 126, 0.2)',
        input: 'rgba(148, 114, 126, 0.2)',
        ring: '#88D7BA',
        background: '#E7DFE2',
        foreground: '#94727E',
        primary: {
          DEFAULT: '#88D7BA',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#CD9B93',
          foreground: '#ffffff',
        },
        destructive: {
          DEFAULT: '#ef4444',
          foreground: '#fafafa',
        },
        muted: {
          DEFAULT: '#E7DFE2',
          foreground: '#94727E',
        },
        accent: {
          DEFAULT: '#94727E',
          foreground: '#ffffff',
        },
        popover: {
          DEFAULT: '#ffffff',
          foreground: '#94727E',
        },
        card: {
          DEFAULT: '#ffffff',
          foreground: '#94727E',
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
