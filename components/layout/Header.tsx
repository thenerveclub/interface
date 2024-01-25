import styled from '@emotion/styled';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuIcon from '@mui/icons-material/Menu';
import { AppBar, Button } from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import localFont from 'next/font/local';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { use, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import SearchBar from '../SearchBar';
import SelectChain from '../SelectChain';
import SelectLeaderboard from '../SelectLeaderboard';
import AccountModal from '../modal/menu/Account';
import Connect from '../modal/menu/Connect';
import Setting from '../modal/menu/Settings';

const TrueLies = localFont({ src: '../../public/fonts/TrueLies.woff2', display: 'swap' });

const StyledAppBar = styled(AppBar)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin: 0 auto 0 auto;
	height: 4rem;
	position: fixed;
	background-color: transparent;
	box-shadow: none;
	top: 0;
	left: 0;
	right: 0;

	@media (max-width: 680px) {
		position: fixed;
		background-color: ${({ theme }) => theme.palette.background.default} !important;
		border-top: 0.25px solid ${({ theme }) => theme.palette.secondary.main} !important;
		box-shadow: 0px 0.25px 0.25px ${({ theme }) => theme.palette.secondary.main} !important;

		top: auto;
		left: 0;
		right: 0;
		bottom: 0;
	}
`;

const StyledDiv = styled.div`
	display: flex;
	width: 100%;

	@media (max-width: 1280px) {
		width: 95%;
	}

	@media (max-width: 680px) {
		width: 95%;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
`;

const StyledSectionLeft = styled.section<{ theme: any }>`
	min-width: 35%;
	display: flex;
	justify-content: flex-start;
	align-items: center;

	h2 {
		display: flex;
		// font-family: ${TrueLies.style.fontFamily};
		font-size: 1rem;
		font-weight: 500;
		color: ${(props) => props.theme.palette.text.primary};
		margin-left: 3rem;
		text-decoration: none;
		cursor: pointer;
	}

	h1 {
		display: flex;
		width: 150px;
		font-family: ${TrueLies.style.fontFamily};
		font-size: 1.25rem;
		font-weight: 500;
		color: ${(props) => props.theme.palette.text.primary};
		text-decoration: none;
		cursor: pointer;
	}

	h3 {
		display: flex;
		width: 150px;
		font-size: 1rem;
		font-weight: 500;
		color: ${(props) => props.theme.palette.text.primary};
		text-decoration: none;
		cursor: pointer;
	}

	& > *:first-of-type {
		margin-left: 1rem;
		margin-right: 1rem;
	}

	@media (max-width: 1280px) {
		display: none;
		visibility: hidden;
	}
`;

const StyledSectionMiddle = styled.section`
	min-width: 30%;
	display: flex;
	justify-content: center;
	align-items: center;

	@media (max-width: 1280px) {
		width: 100%;
		justify-content: right;

		& > *:not(:last-child) {
			margin-left: 0;
		}

		& > *:last-child {
			margin-left: 0;
		}
	}

	@media (max-width: 768px) {
		width: 100%;
		justify-content: right;

		& > *:not(:last-child) {
			margin-left: 1rem;
		}

		& > *:last-child {
			margin-left: 1rem;
		}
	}

	@media (max-width: 480px) {
		width: 100%;
		justify-content: space-between;

		& > *:not(:last-child) {
			margin-left: 0;
		}

		& > *:last-child {
			margin-left: 0;
		}
	}
`;

const StyledSectionRight = styled.section`
	min-width: 35%;
	display: flex;
	justify-content: flex-end;
	align-items: center;

	& > *:not(:last-child) {
		margin-left: 1rem;
	}

	& > *:last-child {
		margin-left: 1rem;
	}

	@media (max-width: 1280px) {
		width: 100%;
		justify-content: right;

		& > *:not(:last-child) {
			margin-left: 1rem;
		}

		& > *:last-child {
			margin-left: 1rem;
		}
	}

	@media (max-width: 1000px) {
		display: none;
		visibility: hidden;
	}
`;

const StyledLink = styled(Button)<{ theme: any }>`
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${({ theme }) => theme.palette.text.primary};
	text-transform: none;
	font-weight: 400;
	min-height: 40px;
	height: 40px;
	background-color: transparent;
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	width: object-fit;
	transition: all 0.5s ease-in-out;

	&:hover {
		border: 1px solid ${({ theme }) => theme.palette.warning.main};
	}
`;

export default function Header() {
	const theme = useTheme();
	const router = useRouter();
	const network = router.query.network as string;
	const headerRef = useRef(null);

	// Redux
	const account = useSelector((state: { account: string }) => state.account);

	// State
	const [windowWidth, setWindowWidth] = useState(undefined);

	useEffect(() => {
		function handleResize() {
			setWindowWidth(window.innerWidth);
		}
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => window.removeEventListener('resize', handleResize);
	}, []);

	useEffect(() => {
		const handleScroll = () => {
			const scrollPosition = window.scrollY;
			const header = headerRef.current;
			if (header) {
				const headerHeight = header.clientHeight;
				const scrollThreshold = headerHeight / 2;
				const opacity = Math.min(scrollPosition / scrollThreshold, 1);
				const color = alpha(theme.palette.background.default, opacity);
				const shadow = alpha(theme.palette.secondary.main, opacity);

				header.style.backgroundColor = color;
				header.style.boxShadow = `0px 0.25px 0.25px ${shadow}`;
			}
		};

		window.addEventListener('scroll', handleScroll);

		return () => {
			window.removeEventListener('scroll', handleScroll);
		};
	}, [theme]);

	return (
		<>
			<StyledAppBar theme={theme} ref={headerRef}>
				<StyledDiv>
					{windowWidth > 680 ? (
						<>
							<StyledSectionLeft theme={theme}>
								<Link href={`/${network}`} passHref style={{ textDecoration: 'none' }}>
									<h1>NERVE GLOBAL</h1>
								</Link>
								<SelectLeaderboard />
								<Link href={`/${network}/map`} passHref style={{ textDecoration: 'none' }}>
									<h3>Map</h3>
								</Link>
							</StyledSectionLeft>
							<StyledSectionMiddle>
								<SearchBar network={network} />
							</StyledSectionMiddle>
							<StyledSectionRight>
								{/* {account && <SelectChain />} */}
								{account ? <AccountModal /> : <Connect />}
								<Setting />
							</StyledSectionRight>
						</>
					) : (
						<>
							<Link href={`/${network}/map`} passHref style={{ textDecoration: 'none' }}>
							<StyledLink theme={theme}>
								<LocationOnIcon sx={{ fontSize: 30, color: theme.palette.text.primary }} />
							</StyledLink>
							</Link>

							<SearchBar network={network} />

							<Setting />
							<div>
								{/* {account && <SelectChain />} */}
								{account ? <AccountModal /> : <Connect />}
							</div>
						</>
					)}
				</StyledDiv>
			</StyledAppBar>
		</>
	);
}
