import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas: '#090d16',
        card: '#111827',
        elevated: '#1a2332',
        accent: {
          DEFAULT: '#10b981',
          hover: '#059669',
          soft: 'rgba(16, 185, 129, 0.12)',
        },
        ink: {
          DEFAULT: '#f3f4f6',
          muted: '#9ca3af',
          faint: '#6b7280',
        },
        danger: '#ef4444',
        warning: '#f59e0b',
        info: '#3b82f6',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.35)',
      },
    },
  },
  plugins: [],
};

export default config;
