import styled from '@emotion/styled';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import localFont from '@next/font/local';
import { useWeb3React } from '@web3-react/core';
import SelectChain from '../SelectChain';
import AccountModal from '../modal/Account';
import Connect from '../modal/Connect';

const roboto = localFont({ src: '../../public/fonts/TrueLies.woff2', display: 'swap' });

const StyledAppBar = styled(AppBar)`
	background: transparent;
	box-shadow: none;
	flex-direction: row;
	height: 80px;
	padding: 2rem;
`;

const StyledSectionLeft = styled.section`
	width: 25%;
	display: flex;
	justify-content: flex-start;
	align-items: center;

	& > *:first-of-type {
		margin-left: 1rem;
	}
`;

const StyledSectionRight = styled.section`
	width: 75%;
	display: flex;
	justify-content: flex-end;
	align-items: center;

	& > *:not(:last-child) {
		margin-right: 1rem;
	}

	& > *:last-child {
		margin-right: 1rem;
	}
`;

export default function Header() {
	const { account } = useWeb3React();

	return (
		<StyledAppBar position="static">
			<StyledSectionLeft>
				<Typography
					component="a"
					style={roboto.style}
					href="/"
					sx={{
						display: 'block',
						fontSize: '1.25rem',
						width: 'auto',
						color: '#fff',
						textDecoration: 'none',
					}}
				>
					NERVE GLOBAL
				</Typography>
			</StyledSectionLeft>
			<StyledSectionRight>
				<SelectChain />
				{account ? <AccountModal /> : <Connect />}
			</StyledSectionRight>
		</StyledAppBar>
	);
}
