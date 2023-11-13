import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					backgroundColor: '#F1F8FF',
					backgroundImage: 'radial-gradient(#0147f2 -250%, #F1F8FF 100%)',
					backgroundRepeat: 'no-repeat',
					backgroundAttachment: 'fixed',
				},
			},
		},
		MuiButtonBase: {
			defaultProps: {
				disableRipple: true,
			},
		},
		MuiButtonGroup: {
			defaultProps: {
				disableRipple: true,
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: 'transparent',
				},
			},
		},
	},
	palette: {
		background: {
			default: '#F1F8FF',
			paper: '#FFFFFF',
		},
		text: {
			primary: '#000000',
			secondary: '#333333',
			disabled: '#D1D1D6',
		},
		primary: {
			main: '#F9F9F9',
			light: '#60A5FA',
			dark: '#075BB3',
			contrastText: '#000000',
		},
		secondary: {
			main: '#86868b',
			light: '#A8A8AC',
			dark: '#333333',
			contrastText: '#000000',
		},
		error: {
			main: 'red',
			light: '#FF665E',
			dark: '#C70000',
			contrastText: '#BDB8FA',
		},
		warning: {
			main: '#FF9500',
			light: '#FFB84D',
			dark: '#C76F00',
			contrastText: '#000000',
		},
		info: {
			main: '#000000',
			light: '#8DD5FF',
			dark: '#0095D5',
			contrastText: '#000000',
		},
		success: {
			main: '#34C759',
			light: '#6FE086',
			dark: '#008A2E',
			contrastText: '#89CFF0',
		},
		divider: '#D1D1D6',
	},
	typography: {
		fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
	},
	shape: {
		borderRadius: 12,
	},
	customShape: {
		borderRadius: '12px', // custom property with units
	},
});

export const darkTheme = createTheme({
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					// backgroundColor: '#000014',
					// backgroundImage: 'radial-gradient(#00f2fc -250%, #000014 70%)',
					backgroundColor: '#0A1015',
					backgroundImage: 'radial-gradient(#0147f2 -250%, #0A1015 70%)',
					backgroundRepeat: 'no-repeat',
					backgroundAttachment: 'fixed',
				},
			},
		},
		MuiButtonBase: {
			defaultProps: {
				disableRipple: true,
			},
			styleOverrides: {
				root: {
					backgroundColor: '#202020',
				},
			},
		},
		MuiButtonGroup: {
			defaultProps: {
				disableRipple: true,
			},
		},
		MuiAppBar: {
			styleOverrides: {
				root: {
					backgroundColor: 'transparent',
				},
			},
		},
	},
	palette: {
		background: {
			default: '#0A1015',
			paper: '#FFFFFF',
		},
		text: {
			primary: '#FFFFFF',
			secondary: '#8F8F8F',
			disabled: '#D1D1D6',
		},
		primary: {
			main: '#1b1b1b',
			light: '#60A5FA',
			dark: '#075BB3',
			contrastText: '#FFFFFF',
		},
		secondary: {
			main: '#86868b',
			light: '#6FE086',
			dark: '#333333',
			contrastText: '#FFFFFF',
		},
		error: {
			main: 'red',
			light: '#FF665E',
			dark: '#7f0000',
			contrastText: '#BDB8FA',
		},
		warning: {
			main: '#FF9500',
			light: '#FFB84D',
			dark: '#C76F00',
			contrastText: '#FFFFFF',
		},
		info: {
			main: '#FFFFFF',
			light: '#8DD5FF',
			dark: '#0095D5',
			contrastText: '#FFFFFF',
		},
		success: {
			main: '#34C759',
			light: '#6FE086',
			dark: '#008A2E',
			contrastText: '#89CFF0',
		},
		divider: '#D1D1D6',
	},
	typography: {
		fontFamily: '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Helvetica Neue, Arial, sans-serif',
	},
	shape: {
		borderRadius: 12,
	},
	customShape: {
		borderRadius: '12px', // custom property with units
	},
});
