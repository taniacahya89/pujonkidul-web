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
          dark:    '#41431B', // Olive gelap — teks utama, navbar bg
          sage:    '#AEB784', // Sage muda — border, secondary bg
          forest:  '#4C5C2D', // Hijau hutan — hover state
          green:   '#237227', // Hijau utama — CTA, active
          cream:   '#E3DBBB', // Krem — card bg, section bg
          ivory:   '#F8F3E1', // Ivory — page background
          lime:    '#AEB877', // Lime — badge, highlight
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
