module.exports = {
  mode: 'jit',
  theme: {
    extend: {
      colors: {
        primary: {
          light: 'var(--primary-light)',
          default: 'var(--primary-default)',
          dark: 'var(--primary-dark)',
          disabled: 'var(--primary-disabled)',
        },
        secondary: {
          light: 'var(--secondary-light)',
          default: 'var(--secondary-default)',
          dark: 'var(--secondary-dark)',
        },
        warn: {
          light: 'var(--warn-light)',
          default: 'var(--warn-default)',
          dark: 'var(--warn-dark)',
        },
        success: {
          light: 'var(--success-light)',
          default: 'var(--success-default)',
          dark: 'var(--success-dark)',
        },
        error: {
          light: 'var(--error-light)',
          default: 'var(--error-default)',
          dark: 'var(--error-dark)',
        },
        white: 'var(--white)',
        black: 'var(--black)',
      },
    },
  },
  variants: [],
  plugins: [],
};
