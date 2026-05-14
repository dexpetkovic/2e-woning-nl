/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Editorial Dutch palette — warm paper background, deep ink, terracotta accent.
        // The `appleGray` and `accent` names are retained so existing utility classes
        // (e.g. text-appleGray-700, bg-accent-500) carry over with the new visual language.
        paper: '#F5F2EB',
        'paper-2': '#EFEBE1',
        ink: '#161513',
        'ink-2': '#2B2823',
        muted: '#6E6A60',
        line: '#E0DDD2',
        'line-2': '#CFC9B9',
        appleGray: {
          50: '#F5F2EB',   // paper bg
          100: '#EFEBE1',  // paper-2
          200: '#E0DDD2',  // line
          300: '#CFC9B9',  // line-2
          400: '#8A8576',  // muted-light
          500: '#6E6A60',  // muted
          600: '#4A463E',  // body
          700: '#2B2823',  // ink-2
          800: '#1F1D1A',
          900: '#161513',  // ink
        },
        accent: {
          50:  '#FBF1E9',
          100: '#F4D8C2',
          200: '#E9B698',
          300: '#DD9472',
          400: '#D27E55',
          500: '#C76A3F',  // terracotta primary
          600: '#A95630',
          700: '#874426',
        },
        good: '#3A8A5E',
        warn: '#C58A2A',
      },
      fontFamily: {
        sans: [
          'Geist', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont',
          'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'
        ],
        display: [
          'Bricolage Grotesque', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'
        ],
        mono: [
          'Geist Mono', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'
        ],
      },
      letterSpacing: {
        'display': '-0.035em',
        'display-tight': '-0.045em',
      },
      borderRadius: {
        'xl': '0.625rem',
        '2xl': '0.875rem',
        '3xl': '1.125rem',
        'full': '9999px',
      },
      boxShadow: {
        sm: '0 1px 3px rgba(22,21,19,0.08)',
        DEFAULT: '0 4px 16px rgba(22,21,19,0.06), 0 1px 4px rgba(22,21,19,0.04)',
        lg: '0 8px 32px rgba(22,21,19,0.08)',
        card: '0 1px 0 rgba(255,255,255,.8) inset, 0 24px 60px -32px rgba(22,21,19,.25), 0 8px 18px -10px rgba(22,21,19,.12)',
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
