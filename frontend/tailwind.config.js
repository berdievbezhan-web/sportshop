/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: '#111827',
          accent: '#ef4444',
        },
      },
    },
  },
  plugins: [],
};
