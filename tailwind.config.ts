import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [],
  theme: {
    extend: {
      animation: {
        'demo-icon': 'demo-icon-pulse 3s ease-in-out infinite',
      },
      keyframes: {
        'demo-icon-pulse': {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.7', transform: 'scale(1.1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
