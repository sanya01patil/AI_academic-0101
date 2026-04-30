/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background))',
        surface: {
          DEFAULT: 'hsl(var(--surface))',
          light: 'hsl(var(--surface-light))',
        },
        brand: {
          DEFAULT: 'hsl(var(--brand))',
          light: 'hsl(var(--brand-light))',
        },
        'risk-high': {
          DEFAULT: 'hsl(var(--risk-high))',
          bg: 'hsl(var(--risk-high-bg))',
        },
        'risk-medium': {
          DEFAULT: 'hsl(var(--risk-medium))',
          bg: 'hsl(var(--risk-medium-bg))',
        },
        'risk-low': {
          DEFAULT: 'hsl(var(--risk-low))',
          bg: 'hsl(var(--risk-low-bg))',
        },
        text: {
          primary: 'hsl(var(--text-primary))',
          secondary: 'hsl(var(--text-secondary))',
          muted: 'hsl(var(--text-muted))',
        },
        border: 'hsl(var(--border))',
      },
      borderRadius: {
        card: '8px',
        panel: '12px',
        modal: '20px',
        lg: '8px',
        md: '6px',
        sm: '4px',
      },
      borderWidth: {
        '0.5': '0.5px',
        '2': '2px',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      keyframes: {
        gridFade: {
          'from': { opacity: '0' },
          'to': { opacity: '1' },
        },
        orbPulse: {
          '0%, 100%': { transform: 'translate(-50%, -50%) scale(1)', opacity: '0.7' },
          '50%': { transform: 'translate(-50%, -50%) scale(1.12)', opacity: '1.0' },
        },
        ringExpand: {
          'from': { transform: 'translate(-50%, -50%) scale(0.4)', opacity: '0' },
          'to': { transform: 'translate(-50%, -50%) scale(1.0)', opacity: '1' },
        },
        shieldDrop: {
          'from': { transform: 'translateY(-30px) scale(0.7)', opacity: '0' },
          'to': { transform: 'translateY(0) scale(1)', opacity: '1' },
        },
        wordIn: {
          'from': { transform: 'translateY(16px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeUp: {
          'from': { transform: 'translateY(8px)', opacity: '0' },
          'to': { transform: 'translateY(0)', opacity: '1' },
        },
        scan: {
          '0%': { top: '0%', opacity: '0' },
          '10%': { top: '5%', opacity: '1' },
          '90%': { top: '95%', opacity: '1' },
          '100%': { top: '100%', opacity: '0' },
        },
        shimmer: {
          'from': { transform: 'translateX(-100%)' },
          'to': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        gridFade: 'gridFade 1.2s ease forwards',
        orbPulse: 'orbPulse 3s ease-in-out infinite',
        ringExpand: 'ringExpand 2s ease-out both',
        shieldDrop: 'shieldDrop 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.2s both',
        wordIn: 'wordIn 0.7s cubic-bezier(0.22, 1, 0.36, 1) 0.6s both',
        fadeUp: 'fadeUp 0.5s ease both',
        scan: 'scan 2.4s ease-in-out infinite',
        shimmer: 'shimmer 0.5s ease forwards',
      },
    },
  },
  plugins: [],
}
