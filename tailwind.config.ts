import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        'dark-900': '#000510',
        'dark-700': '#0f1316',
        'dark-500': '#1a2027',
        'dark-400': '#1e2833',
        'purple-600': '#1b254b',
        'purple-100': '#a3aed0',
        'green-500': '#76da44',
        'green-400': '#2ebe7b',
        'green-300': '#99e39e',
        'red-500': '#ff685f',
        'yellow-500': '#dabe44',
      },
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      container: {
        center: true,
        padding: '1rem',
        screens: {
          'sm': '640px',
          'md': '768px',
          'lg': '1024px',
          'xl': '1280px',
          '2xl': '1536px',
        },
      },
      maxWidth: {
        '7xl': '80rem', // 1280px
        '6xl': '72rem', // 1152px
        '5xl': '64rem', // 1024px
      },
    },
  },
  plugins: [],
  darkMode: 'class',
};

export default config;
