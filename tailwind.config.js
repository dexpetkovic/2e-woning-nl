/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f7ff',
          100: '#e0eefe',
          200: '#bae0fd',
          300: '#7cc8fb',
          400: '#36aaf5',
          500: '#0c8ee0',
          600: '#0071bd',
          700: '#005a9a',
          800: '#004c80',
          900: '#00406b',
        },
        secondary: {
          50: '#fdf2f8',
          100: '#fce7f3',
          200: '#fbcfe8',
          300: '#f9a8d4',
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
          700: '#be185d',
          800: '#9d174d',
          900: '#831843',
        },
        neutral: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
        },
        appleGray: {
          50: '#f5f5f7',
          100: '#e5e5ea',
          200: '#d1d1d6',
          300: '#aeaeb2',
          400: '#8e8e93',
          500: '#636366',
          600: '#48484a',
          700: '#3a3a3c',
          800: '#2c2c2e',
          900: '#1c1c1e',
        },
        accent: {
          400: '#4da8ff',
          500: '#2997ff',
          600: '#0077ed',
        },
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'
        ],
      },
      borderRadius: {
        'xl': '0.5rem',
        '2xl': '0.75rem',
        'full': '9999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(0,0,0,0.08)',
        DEFAULT: '0 4px 16px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
        lg: '0 8px 32px rgba(0,0,0,0.10)',
        apple: '0 20px 60px rgba(0,0,0,0.15)',
      },
      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '16px',
      },
    },
  },
  plugins: [],
} 