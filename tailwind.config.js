/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#818CF8', // indigo-400
          DEFAULT: '#6366F1', // indigo-500
          dark: '#4F46E5', // indigo-600
        },
        background: {
          light: '#FFFFFF',
          DEFAULT: '#1F2937', // gray-800
          dark: '#111827', // gray-900
        },
        text: {
          light: '#1F2937', // gray-800
          DEFAULT: '#F9FAFB', // gray-50
          muted: '#9CA3AF', // gray-400
        },
        'background-light': '#ffffff',
        'background-dark': '#0f172a',
        'primary-light': '#6366f1',
        'primary-dark': '#4f46e5',
        'primary': '#4338ca',
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'fade-in': 'fadeIn 1.5s ease-out forwards',
        loading: 'loading 1.5s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        loading: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(-100%)' }
        }
      },
      typography: {
        DEFAULT: {
          css: {
            color: '#9CA3AF',
            a: {
              color: '#818CF8',
              '&:hover': {
                color: '#A5B4FC',
              },
            },
            strong: {
              color: '#F9FAFB',
            },
            h1: {
              color: '#F9FAFB',
            },
            h2: {
              color: '#F9FAFB',
            },
            h3: {
              color: '#F9FAFB',
            },
            h4: {
              color: '#F9FAFB',
            },
            code: {
              color: '#E5E7EB',
              backgroundColor: '#374151',
              borderRadius: '0.25rem',
              padding: '0.125rem 0.25rem',
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};