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
			main: '#007AFF',
			light: '#60A5FA',
			dark: '#075BB3',
			contrastText: '#000000',
		},
		secondary: {
			main: '#86868b',
			light: '#6FE086',
			dark: '#333333',
			contrastText: '#000000',
		},
		error: {
			main: '#FF3B30',
			light: '#FF665E',
			dark: '#C70000',
			contrastText: '#000000',
		},
		warning: {
			main: '#FF9500',
			light: '#FFB84D',
			dark: '#C76F00',
			contrastText: '#000000',
		},
		info: {
			main: '#5AC8FA',
			light: '#8DD5FF',
			dark: '#0095D5',
			contrastText: '#000000',
		},
		success: {
			main: '#34C759',
			light: '#6FE086',
			dark: '#008A2E',
			contrastText: '#000000',
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
					backgroundColor: '#131313',
					backgroundImage: 'radial-gradient(#0147f2 -250%, #131313 70%)',
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
			default: '#131313',
			paper: '#FFFFFF',
		},
		text: {
			primary: '#FFFFFF',
			secondary: '#8F8F8F',
			disabled: '#D1D1D6',
		},
		primary: {
			main: '#007AFF',
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
			main: '#FF3B30',
			light: '#FF665E',
			dark: '#C70000',
			contrastText: '#FFFFFF',
		},
		warning: {
			main: '#FF9500',
			light: '#FFB84D',
			dark: '#C76F00',
			contrastText: '#FFFFFF',
		},
		info: {
			main: '#5AC8FA',
			light: '#8DD5FF',
			dark: '#0095D5',
			contrastText: '#FFFFFF',
		},
		success: {
			main: '#34C759',
			light: '#6FE086',
			dark: '#008A2E',
			contrastText: '#FFFFFF',
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
