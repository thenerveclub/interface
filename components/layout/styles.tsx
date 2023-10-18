import { createTheme } from '@mui/material/styles';

export const themeLight = createTheme({
	components: {
		MuiCssBaseline: {
			styleOverrides: {
				body: {
					backgroundColor: '#F2F2F7',
					backgroundImage: 'none',
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
				root: {
					backgroundColor: '#FFFFFF',
					color: '#1A1A1A',
					'&:hover': {
						backgroundColor: '#F0F0F3',
					},
				},
			},
		},
	},
	palette: {
		background: {
			default: '#FFFFFF',
			paper: '#FFFFFF',
		},
		text: {
			primary: '#1A1A1A',
			secondary: '#8E8E93',
			disabled: '#D1D1D6',
		},
		primary: {
			main: '#007AFF',
			light: '#60A5FA',
			dark: '#075BB3',
			contrastText: '#FFFFFF',
		},
		secondary: {
			main: '#34C759',
			light: '#6FE086',
			dark: '#008A2E',
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
				root: {
					backgroundColor: '#202020',
				},
			},
		},
	},
	palette: {
		background: {
			default: '#000014',
			paper: '#000014',
		},
		text: {
			primary: '#FFFFFF',
			secondary: '#8E8E93',
			disabled: '#D1D1D6',
		},
		primary: {
			main: '#007AFF',
			light: '#60A5FA',
			dark: '#075BB3',
			contrastText: '#FFFFFF',
		},
		secondary: {
			main: '#34C759',
			light: '#6FE086',
			dark: '#008A2E',
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
});
