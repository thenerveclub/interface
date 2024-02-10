import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import localFont from 'next/font/local';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import LoadingScreen from '../../components/LoadingScreen';
import { CHAINS } from '../../utils/chains';

const TrueLies = localFont({ src: '../../public/fonts/TrueLies.woff2', display: 'swap' });

const StyledLayout = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: 90%;
	max-width: 1280px;
	height: auto;
	margin: 2% auto;
	background-color: transparent;

	@media (max-width: 600px) {
		width: 95%;
	}
`;

const StyledBox = styled(Box)<{ theme: any }>`
	margin: 7.5rem auto 0 auto;

	h1 {
		margin: 0 auto 0 auto;
		font-size: 5rem;
		font-weight: 100;
		font-family: ${TrueLies.style.fontFamily};
		color: ${(props) => props.theme.palette.text.primary};
	}

	h4 {
		margin: 1rem auto 0 auto;
		font-size: 1.3125rem;
		width: 70%;
	}

	@media (max-width: 680px) {
		margin: 10rem auto 0 auto;

		h1 {
			font-size: 4rem;
			color: ${(props) => props.theme.palette.text.primary};
		}

		h4 {
			font-size: 1.3125rem;
			width: 90%;
		}
	}
`;

const StyledTrending = styled(Box)`
	display: flex;
	margin: 7.5rem auto 0 auto;
	width: 100%;

	h2 {
		text-align: left;
		font-size: 2.25rem;
	}

	@media (max-width: 680px) {
		justify-content: center;
		margin: 5rem auto 0 auto;
	}
`;

const StyledTrendingGrid = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: flex-start;
	align-items: center;
	margin: 0 auto 0 auto;
	width: 100%;
	height: auto;

	h2 {
		text-align: left;
		font-size: 2.25rem;
	}

	@media (max-width: 680px) {
		margin: 5rem 1rem auto 1rem;
	}
`;

export default function IndexPage() {
	const theme = useTheme();
	// const router = useRouter();
	// const { network } = router.query;
	const isLoading = false;

	// Function to send a notification
	const sendNotification = () => {
		// Check if the Notification API is supported
		if (!('Notification' in window)) {
			alert('This browser does not support desktop notification');
		} else if (Notification.permission === 'granted') {
			// If permission was already granted
			new Notification('Nerve Global Dapp Notification', {
				body: 'Check out the latest dares and players!',
				icon: 'https://canary.nerveglobal.com/favicon.ico',
			});
		} else if (Notification.permission !== 'denied') {
			// Request permission from the user
			Notification.requestPermission().then(function (permission) {
				if (permission === 'granted') {
					new Notification('Nerve Global Dapp Notification', {
						body: 'Check out the latest dares and players!',
						icon: 'https://dapp.nerveglobal.com/favicon.ico',
					});
				}
			});
		}
	};

	// Use useEffect to handle visibility change
	useEffect(() => {
		const handleVisibilityChange = () => {
			if (document.visibilityState === 'hidden') {
				sendNotification();
			}
		};

		document.addEventListener('visibilitychange', handleVisibilityChange);

		// Clean up the event listener when the component unmounts
		return () => {
			document.removeEventListener('visibilitychange', handleVisibilityChange);
		};
	}, []);

	return (
		<>
			{isLoading ? (
				<LoadingScreen />
			) : (
				<>
					<Head>
						<meta name="viewport" content="width=device-width, initial-scale=1" />
						<title>Nerve Global Dapp</title>
						<meta property="og:title" content="Nerve Global Dapp" key="title" />
						<meta property="og:site_name" content="Nerve Global Dapp" />
						<meta property="og:description" content="Nerve Global Dapp." />
						<meta property="og:image" content="https://dapp.nerveglobal.com/favicon.ico" />
						<meta property="og:url" content="https://dapp.nerveglobal.com/" />
						<meta property="og:type" content="website" />
						<meta name="twitter:card" content="summary_large_image" />
						<meta name="twitter:site" content="@nerveglobal_" />
						<meta name="twitter:title" content="Nerve Global Dapp" />
						<meta name="twitter:description" content="Nerve Global Dapp." />
						<meta name="twitter:image" content="https://dapp.nerveglobal.com/favicon.ico" />
					</Head>
					<StyledLayout>
						<StyledBox theme={theme}>
							<h1>Shape the Stream</h1>
							{/* <h4>
								The ultimate playground where spectators fuel content with financial rewards, empowering players to push boundaries and foster vibrant
								communities.
							</h4> */}
						</StyledBox>
						<StyledTrending>
							<h2>Trending Dares</h2>
						</StyledTrending>
						<StyledTrendingGrid>hii hiii</StyledTrendingGrid>
						<StyledTrending>
							<h2>Trending Players</h2>
						</StyledTrending>
						<StyledTrendingGrid>hii hiii</StyledTrendingGrid>
					</StyledLayout>
				</>
			)}
		</>
	);
}
