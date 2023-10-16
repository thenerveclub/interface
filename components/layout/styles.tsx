import { createTheme } from '@mui/material/styles';

const colors = {
	primary: '#00adb5',
	secondary: '#95defb',
	success: '#4CAF50',
	info: '#eb6133',
	danger: '#FF5722',
	warning: '#FFC107',
	dark: '#0e1b20',
	light: '#aaa',
	muted: '#abafb3',
	border: '#DDDFE1',
	inverse: '#2F3D4A',
	shaft: '#333',
	dove_gray: '#d5d5d5',
	body_bg: '#f3f6f9',
	///////////////
	// Solid Color
	///////////////
	white: '#fff',
	black: '#000',
};

export const themeLight = createTheme({
	typography: {
		fontFamily: 'TrueLies',
	},
	palette: {
		background: {
			default: '#e4f0e2',
		},
	},
});

export const themeDark = createTheme({
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					backgroundColor: '#000014',
					backgroundImage: 'radial-gradient(#00f2fc -250%, #000014 70%)',
					backgroundRepeat: 'no-repeat',
					backgroundAttachment: 'fixed',
				},
			},
		},
		MuiButton: {
			defaultProps: {
				disableRipple: true,
			},
			styleOverrides: {
				// Name of the slot
				root: {
					// Some CSS
					backgroundColor: '#202020',
				},
			},
		},
	},
	palette: {
		primary: {
			main: '#000014',
		},
		secondary: {
			main: '#00f2fc',
		},
		info: {
			main: colors.info,
		},
		background: {
			default: `#000014`,
		},
		text: {
			primary: '#ffffff',
			secondary: '#000014',
			disabled: '#5D6785',
		},
	},
});
