/** @type {import('tailwindcss').Config} */

module.exports = {
	darkMode: 'class', // Enable dark mode via "class"
	content: [
		'./app/**/*.{js,ts,jsx,tsx}', // Next.js App Directory
		'./components/**/*.{js,ts,jsx,tsx}', // Shared Components
		'./pages/**/*.{js,ts,jsx,tsx}', // Pages Directory
		'./styles/**/*.{css}', // Global CSS
	],
	theme: {
		screens: {
			xs: '480px', // Extra small screens
			sm: '640px', // Small screens
			md: '768px', // Medium screens
			lg: '1024px', // Large screens
			xl: '1280px', // Extra large screens
			'2xl': '1536px', // Ultra large screens
		},
		extend: {
			colors: {
				primary: 'var(--color-primary)', // Map primary color variable
				secondary: 'var(--color-secondary)', // Map secondary color variable
				background: 'var(--color-background)', // Map background color
				backgroundReverse: 'var(--color-background-reverse)', // Map background reverse color
				text: 'var(--color-text)', // Map text color
				accent: 'var(--color-accent)', // Accent color
				muted: 'var(--color-muted)', // Muted/gray text
			},
			fontFamily: {
				sans: ['Inter', 'sans-serif'], // Clean, modern font
				display: ['Manrope', 'sans-serif'], // Bold, display font
				mono: ['Fira Code', 'monospace'], // Monospace font for accents/code
			},
			spacing: {
				18: '4.5rem',
				72: '18rem',
				96: '24rem',
				128: '32rem',
				144: '36rem', // Extra-large spacings
			},
			borderRadius: {
				xl: '1rem',
				'2xl': '1.5rem',
				'3xl': '2rem', // Smooth modern borders
			},
			boxShadow: {
				soft: '0 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadows
				hard: '0 8px 16px rgba(0, 0, 0, 0.2)', // Key UI shadows
			},
			gradientColorStops: {
				'framer-start': 'var(--color-gradient-start)', // Gradient start
				'framer-end': 'var(--color-gradient-end)', // Gradient end
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'), // Typography plugin
		require('@tailwindcss/forms'), // Forms styling
		require('@tailwindcss/aspect-ratio'), // Aspect ratio for images/videos
		require('@tailwindcss/container-queries'), // Advanced responsive layouts
	],
};
