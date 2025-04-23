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
			'3xl': '1920px', // Ultra large screens
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
				trueLies: ['"True Lies"', 'sans-serif'],
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
