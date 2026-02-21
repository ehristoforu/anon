import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#f5f5f5',
        canvas: '#080808',
        panel: '#111111'
      }
    }
  },
  plugins: []
} satisfies Config;
