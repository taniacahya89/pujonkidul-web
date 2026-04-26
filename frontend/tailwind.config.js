/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      // Design token palette Pujon Kidul Explore
      // Sumber kebenaran tunggal untuk semua warna UI
      colors: {
        brand: {
          bg:          '#F7F2E3',
          surface:     '#EDE8D0',
          'surface-2': '#DDD6BC',
          text1:       '#1E200A',
          text2:       '#4A4E28',
          text3:       '#7A7E52',
          accent:      '#3D6B35',
          'accent-h':  '#2E5228',
          'accent-l':  '#EBF2E8',
          warm:        '#8B6914',
          'warm-l':    '#F5EDD4',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-down': 'slideDown 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideDown: {
          '0%': { maxHeight: '0', opacity: '0' },
          '100%': { maxHeight: '2000px', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
