const plugin = require('tailwindcss/plugin')

module.exports = plugin(function({ addUtilities, theme }) {
  addUtilities({
    '.animate-accordion-down': {
      'animation': 'accordion-down 0.2s ease-out',
    },
    '.animate-accordion-up': {
      'animation': 'accordion-up 0.2s ease-out',
    },
    '.animate-float-up': {
      'animation': 'float-up 3s ease-out forwards',
    },
  })
}, {
  theme: {
    extend: {
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        'float-up': {
          '0%': {
            transform: 'translateY(0) scale(1)',
            opacity: '1',
          },
          '100%': {
            transform: 'translateY(-200px) scale(1.5)',
            opacity: '0',
          },
        },
      },
    },
  },
})
