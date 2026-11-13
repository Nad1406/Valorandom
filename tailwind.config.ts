import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0B0F14',
          elevated: '#11161D',
        },
        surface: '#1A2029',
        'surface-hi': '#232B36',
        line: '#2A333F',
        ink: {
          DEFAULT: '#E8EDF2',
          muted: '#8A97A6',
        },
        val: {
          red: '#FF4655',
          'red-dim': '#C6333F',
          teal: '#00E5C0',
          gold: '#F5C453',
          navy: '#0F1923',
          offwhite: '#ECE8E1',
          dark: '#0B1118',
        },
        role: {
          duelist: '#FF4655',
          initiator: '#F5C453',
          controller: '#8B7CF6',
          sentinel: '#00E5C0',
          flex: '#5AA9E6',
        },
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', '"Chakra Petch"', 'system-ui', 'sans-serif'],
        tactical: ['"Barlow Condensed"', '"DIN Next"', 'system-ui', 'sans-serif'],
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(255, 70, 85, 0.35)',
        'glow-teal': '0 0 24px rgba(0, 229, 192, 0.3)',
        card: '0 8px 30px rgba(0, 0, 0, 0.45)',
        tactical: '0 0 0 1px rgba(255, 255, 255, 0.1), 0 8px 24px rgba(0, 0, 0, 0.5)',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pulse-ring': {
          '0%': { boxShadow: '0 0 0 0 rgba(255, 70, 85, 0.45)' },
          '100%': { boxShadow: '0 0 0 12px rgba(255, 70, 85, 0)' },
        },
        scan: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' },
        },
        flash: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.4' },
        },
      },
      animation: {
        'fade-up': 'fade-up 300ms ease-out both',
        'pulse-ring': 'pulse-ring 600ms ease-out',
        scan: 'scan 1.5s linear infinite',
        flash: 'flash 0.3s ease-in-out 2',
      },
    },
  },
  plugins: [],
};

export default config;
