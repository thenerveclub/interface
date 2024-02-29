import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import HomeIcon from '@mui/icons-material/Home';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MenuIcon from '@mui/icons-material/Menu';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import PersonIcon from '@mui/icons-material/Person';
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

// Define the keyframes for the slide-down animation
const slideDown = keyframes`
  from {
    transform: translateY(0); // Start from the top
  }
  to {
    transform: translateY(100%); // End below the screen
  }
`;

// Define the keyframes for the slide-up animation
const slideUp = keyframes`
  from {
    transform: translateY(100%); // Start from below the screen
  }
  to {
    transform: translateY(0); // End at the top
  }
`;

const StyledAppBar = styled(AppBar)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin: 0 auto 0 auto;
	padding: 0;
	height: 4rem;
	position: fixed;
	background-color: transparent;
	box-shadow: none;
	top: 0;
	left: 0;
	right: 0;

	@media (max-width: 1024px) {
		height: 4rem;
		position: fixed;
		background-color: ${({ theme }) => theme.palette.background.default} !important;
		border-top: 0.25px solid ${({ theme }) => theme.palette.secondary.main} !important;
		box-shadow: none !important;

		top: auto;
		left: 0;
		right: 0;
		bottom: 1rem;

		&::after {
			content: '';
			position: absolute;
			left: 0;
			right: 0;
			bottom: -1rem;
			height: 1rem;
			background-color: ${({ theme }) => theme.palette.background.default} !important;
		}
	}
`;

const StyledAppBarMobile = styled(AppBar)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin: 0 auto 0 auto;
	padding: 0;
	height: 4rem;
	position: fixed;
	background-color: transparent;
	box-shadow: none;
	top: 0;
	left: 0;
	right: 0;
`;

const StyledDiv = styled.div`
	display: flex;
	width: 95%;

	@media (max-width: 1280px) {
		width: 95%;
	}

	@media (max-width: 1024px) {
		width: 95%;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}
`;

const StyledDivMobile = styled.div`
	display: flex;
	width: 95%;

	@media (max-width: 1280px) {
		width: 95%;
	}

	@media (max-width: 1024px) {
		width: 80%;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	@media (max-width: 680px) {
		width: 95%;
	}
`;

const StyledSectionLeft = styled.section<{ theme: any }>`
	min-width: 35%;
	display: flex;
	justify-content: flex-start;
	align-items: center;

	h1 {
		display: flex;
		width: object-fit;
		font-family: ${TrueLies.style.fontFamily};
		font-size: 1.75rem;
		font-weight: 500;
		color: ${(props) => props.theme.palette.text.primary};
		text-decoration: none;
		cursor: pointer;
	}

	h3 {
		display: flex;
		width: object-fit;
		font-size: 1rem;
		font-weight: 500;
		color: ${(props) => props.theme.palette.text.primary};
		text-decoration: none;
		cursor: pointer;
	}

	& > *:first-of-type {
		margin-left: 1rem;
		margin-right: 3rem;
	}

	& > *:last-child {
		margin-left: 1rem;
		margin-right: 1rem;
	}

	@media (max-width: 1024px) {
		h1 {
			font-size: 1.75rem;
		}
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

	@media (max-width: 1024px) {
		width: 100%;
		justify-content: right;

		& > *:not(:last-child) {
			margin-left: 1rem;
		}

		& > *:last-child {
			margin-left: 1rem;
		}
	}

	@media (max-width: 680px) {
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
	// border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	// border-radius: ${({ theme }) => theme.shape.borderRadius};
	width: 3rem;
	transition: all 0.5s ease-in-out;

	&:hover {
		border: none;
	}
`;

const StyledButtonMobile = styled(Button)<{ theme: any }>`
	display: flex;
	justify-content: center;
	align-items: center;
	text-align: center;
	// border: 1px solid rgba(0, 0, 40, 1);
	border: 1px solid #fff;
	border-radius: 0;
	padding: 0.5rem 1rem;
	background-color: transparent;
	transition: all 0.5s ease-in-out;
	color: #fff;
	font-size: 0.8rem;
	font-weight: bold;
	box-shadow: none;

	&:hover {
		color: #000;
		background-color: rgba(255, 255, 255, 1);
		box-shadow: none;
	}
`;

const MobileMenuButton = styled.div<{ theme: any }>`
	display: none;
	visibility: hidden;

	@media (max-width: 1024px) {
		display: flex;
		visibility: visible;
		justify-content: center;
		align-items: center;
		width: 3rem;

		color: ${({ theme }) => theme.palette.text.primary};
		text-transform: none;
		font-weight: 400;
		min-height: 40px;
		height: 40px;
		background-color: transparent;
		// border: 1px solid ${({ theme }) => theme.palette.secondary.main};
		// border-radius: ${({ theme }) => theme.shape.borderRadius};
	}
`;

const MobileSettings = styled.div<{ theme: any }>`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	min-width: 100vw;
	min-height: 100vh;
	max-height: 100vh; // Set a maximum height
	overflow-y: scroll;
	background-color: ${({ theme }) => theme.palette.background.default};
	z-index: 9999;
	position: fixed;
	top: 0;
	left: 0;
	padding: 1rem;
	animation: ${(props) => (props.isClosing ? slideDown : slideUp)} 0.5s ease-out;
`;

const MenuContainer = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
`;

const CloseButton = styled.button<{ theme: any }>`
	display: flex;
	justify-content: center;
	border: none;
	color: ${({ theme }) => theme.palette.text.primary};
	background-color: transparent;
	margin-top: auto;
	margin-bottom: 10rem;
`;

export default function Header() {
	const theme = useTheme();
	const router = useRouter();
	const isMap = router.pathname.includes('/map');
	const network = router.query.network as string;
	const headerRef = useRef(null);

	// Redux
	const account = useSelector((state: { account: string }) => state.account);
	const ens = useSelector((state: { ens: string }) => state.ens);

	// State
	const [windowWidth, setWindowWidth] = useState(undefined);
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	const disableScrolling = () => {
		const body = document.body;
		body.style.overflow = 'hidden';
	};

	const enableScrolling = () => {
		const body = document.body;
		body.style.overflow = 'auto';
	};

	const toggleMenu = () => {
		if (isMenuOpen) {
			setIsClosing(true);
			setTimeout(() => {
				setIsMenuOpen(false);
				setIsClosing(false);
				enableScrolling();
			}, 500); // 500ms for the slide down duration
		} else {
			setIsMenuOpen(true);
			disableScrolling();
		}
	};

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
			{windowWidth > 1024 ? (
				<StyledAppBar theme={theme} ref={headerRef}>
					<StyledDiv>
						<StyledSectionLeft theme={theme}>
							<Link href={`/`} passHref style={{ textDecoration: 'none' }}>
								<h1>Nerve</h1>
							</Link>
							{/* <SelectLeaderboard /> */}
							<Link href={`/leaderboard`} passHref style={{ textDecoration: 'none' }}>
								<h3>Leaderboard</h3>
							</Link>
							<Link href={`/map`} passHref style={{ textDecoration: 'none' }}>
								<h3>Map</h3>
							</Link>
						</StyledSectionLeft>
						<StyledSectionMiddle>
							<SearchBar network={network} />
						</StyledSectionMiddle>
						<StyledSectionRight>
							{/* {account && <SelectChain />} */}
							{account ? <AccountModal account={account} ens={ens} network={network} /> : <Connect />}
							<Setting />
						</StyledSectionRight>
					</StyledDiv>
				</StyledAppBar>
			) : (
				<>
					<StyledAppBarMobile theme={theme} ref={headerRef}>
						<StyledDiv>
							{!isMap && (
								<>
									<StyledSectionLeft theme={theme}>
										<Link href={`/`} passHref style={{ textDecoration: 'none' }}>
											<h1>Nerve</h1>
										</Link>
									</StyledSectionLeft>
									<StyledSectionMiddle></StyledSectionMiddle>
									<StyledSectionRight>
										{/* {account && <SelectChain />} */}
										{!account && <Connect />}
										<Setting />
									</StyledSectionRight>
								</>
							)}
						</StyledDiv>
					</StyledAppBarMobile>
					<StyledAppBar theme={theme}>
						<StyledDivMobile>
							<Link href={`/`} passHref style={{ textDecoration: 'none' }}>
								<StyledLink theme={theme}>
									<HomeIcon sx={{ color: theme.palette.text.primary }} />
								</StyledLink>
							</Link>
							<Link href={`/map`} passHref style={{ textDecoration: 'none' }}>
								<StyledLink theme={theme}>
									<LocationOnIcon sx={{ color: theme.palette.text.primary }} />
								</StyledLink>
							</Link>
							<SearchBar network={network} />
							{/* <Setting /> */}
							<Link href={`/leaderboard`} passHref style={{ textDecoration: 'none' }}>
								<StyledLink theme={theme}>
									<LeaderboardIcon sx={{ color: theme.palette.text.primary }} />
								</StyledLink>
							</Link>

							{account ? (
								<Link href={`/player/${account}`} passHref style={{ textDecoration: 'none' }}>
									<StyledLink theme={theme}>
										{/* <PersonIcon sx={{ color: theme.palette.text.primary }} /> */}
										<AccountModal account={account} ens={ens} network={network} />
									</StyledLink>
								</Link>
							) : (
								<StyledLink theme={theme}>
									<PersonIcon sx={{ color: theme.palette.secondary.main }} />
								</StyledLink>
							)}
						</StyledDivMobile>
					</StyledAppBar>
				</>
			)}
		</>
	);
}
