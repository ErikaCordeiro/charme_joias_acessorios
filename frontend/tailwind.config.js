export default {
    content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
                serif: ['Playfair Display', 'ui-serif', 'Georgia', 'serif'],
            },
            boxShadow: {
                soft: '0 26px 70px -34px rgba(0, 0, 0, 0.9)',
            },
            colors: {
                brand: {
                    light: '#e2e8f0',
                    DEFAULT: '#cbd5e1',
                    dark: '#94a3b8',
                },
            },
        },
    },
    plugins: [],
}
