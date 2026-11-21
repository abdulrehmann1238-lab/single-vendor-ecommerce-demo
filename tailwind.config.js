/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Specific palette requested by PRD:
        ivory: '#F8F7F3',       // Primary background
        stone: '#F0EFE9',       // Secondary background
        charcoal: '#242820',    // Primary text
        muted: '#777970',       // Secondary text
        forest: {
          DEFAULT: '#52634F',   // Primary accent
          light: '#657a62',
          dark: '#3f4d3d',
        },
        sage: '#A8AA91',        // Secondary accent
        champagne: {
          DEFAULT: '#B49A72',   // Premium accent
          light: '#c7b28f',
          dark: '#9a815a',
        },
        delicate: '#E8E6DF',    // Borders
        success: '#55765B',
        warning: '#B68A4C',
        error: '#B65D56',
        dark: '#252923',        // Dark sections (e.g. footer)
      },
      fontFamily: {
        serif: ['"DM Serif Display"', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['Inter', 'Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'button': '6px',
        'card': '10px',
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(36, 40, 32, 0.04)',
        'elevated': '0 8px 30px rgba(36, 40, 32, 0.08)',
        'dropdown': '0 10px 40px rgba(36, 40, 32, 0.12)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'fade-up': 'fadeUp 0.4s ease-out forwards',
        'scale-in': 'scaleIn 0.25s ease-out forwards',
        'shimmer': 'shimmer 1.8s infinite linear',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
