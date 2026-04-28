/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './compo/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './lib/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    fontFamily: {
      sans: [
        'var(--font-inter)',
        'var(--font-geist-sans)',
        ...defaultTheme.fontFamily.sans,
      ],
      serif: [
        'var(--font-instrument-serif)',
        'var(--font-playfair)',
        ...defaultTheme.fontFamily.serif,
      ],
      mono: [
        'var(--font-space-mono)',
        'var(--font-geist-mono)',
        ...defaultTheme.fontFamily.mono,
      ],
    },
    extend: {
      colors: {
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        destructive: 'var(--destructive)',
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',

        // Landing page tokens
        lime: {
          DEFAULT: '#C8F135',
          dark: '#b8e020',
        },
        violet: {
          DEFAULT: '#7C3AED',
          light: '#9d6df3',
        },
        red: {
          DEFAULT: '#FF4D6D',
        },
        ink: {
          DEFAULT: '#0A0A0F',
        },
      },
      fontFamily: {
        bebas: ['var(--font-bebas)', ...defaultTheme.fontFamily.sans],
        syne: ['var(--font-syne)', ...defaultTheme.fontFamily.sans],
        dm: ['var(--font-dm)', ...defaultTheme.fontFamily.sans],
        cabinet: ['var(--font-geist-sans)', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
