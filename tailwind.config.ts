import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          base: '#0A1017',
          elevated: '#0F1923',
        },
        surface: '#121C27',
        'surface-hi': '#1A2736',
        line: '#263445',
        ink: {
          DEFAULT: '#ECE8E1',
          muted: '#96A4B3',
        },
        val: {
          red: '#FF4655',
          'red-dim': '#D13644',
          teal: '#00E5C0',
          gold: '#F5C453',
          navy: '#0F1923',
          offwhite: '#ECE8E1',
          dark: '#0A1017',
          bg: '#0A1017',
          surface: '#121C27',
          border: '#263445',
          text: '#ECE8E1',
          muted: '#96A4B3',
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
        glow: '0 6px 20px rgba(255, 70, 85, 0.25)',
        'glow-teal': '0 6px 20px rgba(0, 229, 192, 0.22)',
        card: '0 10px 28px rgba(0, 0, 0, 0.5)',
        tactical: '0 8px 24px rgba(0, 0, 0, 0.45)',
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
        'fade-up': 'fade-up 260ms cubic-bezier(0.16, 1, 0.3, 1) both',
        'pulse-ring': 'pulse-ring 600ms ease-out',
        scan: 'scan 1.4s linear infinite',
        flash: 'flash 0.3s ease-in-out 2',
      },
    },
  },
  plugins: [],
};

export default config;
