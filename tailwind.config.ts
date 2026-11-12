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
        },
        role: {
          duelist: '#FF6B6B',
          initiator: '#F5C453',
          controller: '#8B7CF6',
          sentinel: '#3DDC97',
          flex: '#5AA9E6',
        },
      },
      fontFamily: {
        display: ['"Chakra Petch"', '"Rajdhani"', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 24px rgba(255, 70, 85, 0.35)',
        'glow-teal': '0 0 24px rgba(0, 229, 192, 0.3)',
        card: '0 8px 30px rgba(0, 0, 0, 0.45)',
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
      },
      animation: {
        'fade-up': 'fade-up 300ms ease-out both',
        'pulse-ring': 'pulse-ring 600ms ease-out',
      },
    },
  },
  plugins: [],
};

export default config;
