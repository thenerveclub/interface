import styled from '@emotion/styled';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import localFont from 'next/font/local';
import SelectChain from '../SelectChain';
import AccountModal from '../modal/Account';
import Connect from '../modal/Connect';

const roboto = localFont({ src: '../../public/fonts/TrueLies.woff2', display: 'swap' });

const StyledAppBar = styled(AppBar)`
	background: transparent;
	box-shadow: none;
	flex-direction: row;
	height: 40px;
	padding: 2rem;
`;

const StyledSectionLeft = styled.section`
	min-width: 25%;
	display: flex;
	justify-content: flex-start;
	align-items: center;

	& > *:first-of-type {
		margin-left: 1rem;
	}
`;

const StyledSectionMiddle = styled.section`
	min-width: 50%;
	display: flex;
	justify-content: center;
	align-items: center;

	@media (max-width: 768px) {
		display: none;
		visibility: hidden;
	}
`;

const StyledSectionRight = styled.section`
	min-width: 25%;
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

const SearchBoxMobile = styled(Box)`
	display: none;
	visibility: hidden;

	@media (max-width: 768px) {
		display: flex;
		visibility: visible;
		min-height: 50px;
		text-align: center;
		align-items: center;
		justify-content: center;

		a {
			font-size: 30px;
			cursor: default;

			&:not(:last-child) {
				margin-right: 1rem;
			}
		}
	}
`;

export default function Header() {
	const { account } = useWeb3React();

	return (
		<>
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
				<StyledSectionMiddle>Search Bar</StyledSectionMiddle>

				<StyledSectionRight>
					<SelectChain />
					{account ? <AccountModal /> : <Connect />}
				</StyledSectionRight>
			</StyledAppBar>
			<SearchBoxMobile>Search Bar</SearchBoxMobile>
		</>
	);
}
