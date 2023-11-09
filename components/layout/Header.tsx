import styled from '@emotion/styled';
import { AppBar } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import localFont from 'next/font/local';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';
import SearchBar from '../SearchBar';
import SelectChain from '../SelectChain';
import SelectLeaderboard from '../SelectLeaderboard';
import AccountModal from '../modal/menu/Account';
import Connect from '../modal/menu/Connect';
import Setting from '../modal/menu/Settings';

const TrueLies = localFont({ src: '../../public/fonts/TrueLies.woff2', display: 'swap' });

const StyledAppBar = styled(AppBar)<{ theme: any }>`
	flex-direction: row;
	height: 40px;
	padding: 2rem;
	position: fixed;
	background-color: 'transparent';
	box-shadow: none;
	top: 0;
	left: 0;
	right: 0;

	@media (max-width: 1280px) {
		flex-direction: column;
		height: auto;
		padding: 0.75rem;

		//switch order of middle and last section
		& > *:nth-of-type(2) {
			order: 2;
			margin-top: 1rem;
		}
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

	@media (max-width: 768px) {
		width: 100%;
		justify-content: rigth;

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

const MobileSettings = styled.div`
	display: none;
	visibility: hidden;

	@media (max-width: 480px) {
		display: block;
		visibility: visible;
	}
`;

const DesktopSettings = styled.div`
	display: block;
	visibility: visible;

	@media (max-width: 480px) {
		display: none;
		visibility: hidden;
	}
`;

export default function Header() {
	const theme = useTheme();
	const router = useRouter();
	const network = router.query.network as string;

	// Redux
	const account = useSelector((state: { account: string }) => state.account);

	// useEffect(() => {
	// 	const handleScroll = () => {
	// 		const scrollPosition = window.scrollY;
	// 		const header = document.getElementById('header');
	// 		const headerHeight = header ? header.clientHeight : 0;
	// 		const scrollThreshold = headerHeight / 2; // Speed of scroll
	// 		const opacity = Math.min(scrollPosition / scrollThreshold, 1);
	// 		const color = alpha('transparent', opacity);
	// 		const shadow = alpha('rgba(41, 50, 73, 1)', opacity);

	// 		header.style.backgroundColor = color;
	// 		header.style.boxShadow = `0px 1px 1px ${shadow}`;
	// 	};

	// 	window.addEventListener('scroll', handleScroll);

	// 	return () => {
	// 		window.removeEventListener('scroll', handleScroll);
	// 	};
	// }, []);

	return (
		<>
			<StyledAppBar theme={theme}>
				<StyledSectionLeft theme={theme}>
					<Link href={`/${network}`} passHref style={{ textDecoration: 'none' }}>
						<h1>NERVE GLOBAL</h1>
					</Link>
					<SelectLeaderboard />
				</StyledSectionLeft>
				<StyledSectionMiddle>
					<SearchBar network={network} />
					<MobileSettings>
						<Setting />
					</MobileSettings>
				</StyledSectionMiddle>
				<StyledSectionRight>
					<SelectChain />
					{account ? <AccountModal /> : <Connect />}
					<DesktopSettings>
						<Setting />
					</DesktopSettings>
				</StyledSectionRight>
			</StyledAppBar>
		</>
	);
}
