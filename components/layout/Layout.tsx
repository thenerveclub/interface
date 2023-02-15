import { ThemeProvider } from '@mui/material';
import React, { ReactNode } from 'react';
import Footer from './Footer';
import Header from './Header';

import { CssBaseline } from '@mui/material/';
import { themeDark } from './styles';

type Props = {
	children?: ReactNode;
	title?: string;
};

const Layout = ({ children = 'This is the default title' }: Props) => {
	return (
		<>
			<ThemeProvider theme={themeDark}>
				<CssBaseline />
				<Header />
				<main>{children}</main>
				<Footer />
			</ThemeProvider>
		</>
	);
};

export default Layout;
