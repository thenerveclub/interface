import styled from '@emotion/styled';
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import localFont from 'next/font/local';
import { useEffect, useState } from 'react';
import SelectChain from '../SelectChain';
import AccountModal from '../modal/Account';
import Connect from '../modal/Connect';

const roboto = localFont({ src: '../../public/fonts/TrueLies.woff2', display: 'swap' });

const StyledAppBar = styled(AppBar)`
	flex-direction: row;
	height: 40px;
	padding: 2rem;
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
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
