import styled from '@emotion/styled';
import { AppBar, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import localFont from 'next/font/local';
import { useEffect } from 'react';
import SearchBar from '../SearchBar';
import SelectChain from '../SelectChain';
import AccountModal from '../modal/Account';
import Connect from '../modal/Connect';

const TrueLies = localFont({ src: '../../public/fonts/TrueLies.woff2', display: 'swap' });

const StyledAppBar = styled(AppBar)`
	flex-direction: row;
	height: 40px;
	padding: 2rem;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;

	@media (max-width: 768px) {
		flex-direction: column;
		height: auto;

		//switch order of middle and last section
		& > *:nth-of-type(2) {
			order: 2;
			margin-top: 1rem;
		}
	}
`;

const StyledSectionLeft = styled.section`
	min-width: 25%;
	display: flex;
	justify-content: flex-start;
	align-items: center;

	& > *:first-of-type {
		margin-left: 1rem;
	}

	@media (max-width: 768px) {
		display: none;
		visibility: hidden;
	}
`;

const StyledSectionMiddle = styled.section`
	min-width: 50%;
	display: flex;
	justify-content: center;
	align-items: center;

	@media (max-width: 768px) {
		width: 100%;
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

	@media (max-width: 768px) {
		width: 100%;
		justify-content: space-between;

		& > *:not(:last-child) {
			margin-right: 0;
		}

		& > *:last-child {
			margin-right: 0;
		}
	}
`;

export default function Header() {
	const { account } = useWeb3React();

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const header = document.getElementById('header');
			const headerHeight = header ? header.clientHeight : 0;
			const scrollThreshold = headerHeight / 2; // Speed of scroll
			const opacity = Math.min(scrollPosition / scrollThreshold, 1);
			const color = alpha('#000014', opacity);
			const shadow = alpha('rgba(41, 50, 73, 1)', opacity);

			header.style.backgroundColor = color;
			header.style.boxShadow = `0px 1px 1px ${shadow}`;
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, []);

	return (
		<>
			<StyledAppBar id="header">
				<StyledSectionLeft>
					<Typography
						component="a"
						style={TrueLies.style}
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
				<StyledSectionMiddle>
					<SearchBar />
				</StyledSectionMiddle>
				<StyledSectionRight>
					<SelectChain />
					{account ? <AccountModal /> : <Connect />}
				</StyledSectionRight>
			</StyledAppBar>
		</>
	);
}
