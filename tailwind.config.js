const colors = require('tailwindcss/colors');

module.exports = {
    mode: 'jit',
    purge: ['./index.html', './src/**/*.{ts,tsx}'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            colors: {
                green: colors.green,
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [
        require('@tailwindcss/forms'),
    ],
};
