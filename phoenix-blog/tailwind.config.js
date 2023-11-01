module.exports = {
    content: ['**/*.{tsx,jsx,handlebars}'],
    theme: {
      extend: {
        colors: {},
        fontFamily: {
          'serif-better': ['Iowan Old Style', 'Iowan', 'Charter', 'Palatino Linotype', 'Palatino', 'Book Antiqua', 'Palatino LT STD', 'Times New Roman', 'Times', 'serif'],
        },
      },
    },
    plugins: [
      require('@tailwindcss/typography'),
    ],
  }
