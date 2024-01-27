import styled from '@emotion/styled';
import { CssBaseline, useMediaQuery } from '@mui/material/';
import { ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
import React, { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Footer from './Footer';
import Header from './Header';
import { darkTheme, lightTheme } from './styles';

type Props = {
	children?: ReactNode;
	title?: string;
};

const Main = styled.div<{ is404: boolean; dynamicHeight: number | string }>`
	line-height: 1.381002381;
	font-weight: 600;
	letter-spacing: 0.011em;
	// font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	min-height: calc(100vh - ${({ is404 }) => (is404 ? '248px' : '248px')});
	// min-height: ${(props) => props.dynamicHeight}px; // Use dynamic height

	@media (max-width: 768px) {
		// margin: 4 auto 0 auto;
	}
`;

const Layout = ({ children = 'This is the default title' }: Props) => {
	// Access the Redux store's theme state
	const { currentTheme, prefersSystemSetting } = useSelector((state: any) => state.theme);

	// Determine if the user's system prefers dark mode
	const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

	// Determine which theme to use
	let appliedTheme;
	if (prefersSystemSetting) {
		appliedTheme = prefersDarkMode ? darkTheme : lightTheme;
	} else {
		appliedTheme = currentTheme === 'light' ? lightTheme : darkTheme;
	}

	// Router
	const router = useRouter();
	const is404 = router.pathname === '/404';
	const isMap = router.pathname.includes('/map');

	// Dynamic height
	const [dynamicHeight, setDynamicHeight] = useState(0); // Initialize to 0 or a default height

	useEffect(() => {
		// Update the height once the component mounts
		setDynamicHeight(window.innerHeight);

		const adjustHeight = () => {
			setDynamicHeight(window.innerHeight);
		};

		window.addEventListener('resize', adjustHeight);

		// Cleanup
		return () => {
			window.removeEventListener('resize', adjustHeight);
		};
	}, []);

	return (
		<>
			<ThemeProvider theme={appliedTheme}>
				<CssBaseline />
				<Header />
				<Main is404={is404} dynamicHeight={dynamicHeight || '100vh'}>
					{children}
				</Main>
				{/* {!isMap && <Footer />} */}
			</ThemeProvider>
		</>
	);
};

export default Layout;
