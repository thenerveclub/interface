import styled from '@emotion/styled';
import { CssBaseline } from '@mui/material/';
import { ThemeProvider } from '@mui/material/styles';
import React, { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';
import { themeDark } from './styles';

type Props = {
	children?: ReactNode;
	title?: string;
};

const Main = styled.div`
	min-height: calc(100vh - 248px);
`;

const Layout = ({ children = 'This is the default title' }: Props) => {
	return (
		<>
			<ThemeProvider theme={themeDark}>
				<CssBaseline />
				<Header />
				<Main>{children}</Main>
				<Footer />
			</ThemeProvider>
		</>
	);
};

export default Layout;
