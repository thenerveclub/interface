import styled from '@emotion/styled';
import { Box, CssBaseline } from '@mui/material/';
import { ThemeProvider } from '@mui/material/styles';
import { useRouter } from 'next/router';
import React, { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import { themeDark } from './styles';

type Props = {
	children?: ReactNode;
	title?: string;
};

const Main = styled.div<{ is404: boolean }>`
	line-height: 1.381002381;
	font-weight: 600;
	letter-spacing: 0.011em;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
	min-height: calc(100vh - ${({ is404 }) => (is404 ? '248px' : '248px')});

	@media (max-width: 768px) {
		margin: 10rem auto 0 auto;
	}
`;

const Layout = ({ children = 'This is the default title' }: Props) => {
	const router = useRouter();
	const is404 = router.pathname === '/404';
	console.log('is404', is404);

	return (
		<>
			<ThemeProvider theme={themeDark}>
				<CssBaseline />
				<Header />
				<Main is404={is404}>{children}</Main>
				<Footer />
			</ThemeProvider>
		</>
	);
};

export default Layout;
