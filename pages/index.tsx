import styled from '@emotion/styled';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import localFont from 'next/font/local';
import Head from 'next/head';
import router, { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import LoadingScreen from '../components/LoadingScreen';
import useTrendingDareList from '../hooks/searchData/trending/useTrendingDareList';
import useActivePlayerTasks from '../hooks/useActivePlayerTasks';
import { CHAINS, nameToChainId } from '../utils/chains';

const TrueLies = localFont({ src: '../public/fonts/TrueLies.woff2', display: 'swap' });

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

const ActiveTabSection = styled(Box)`
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	align-items: center;
	justify-content: space-evenly;
	margin: 1rem auto 5rem auto;
	gap: 2rem;
	min-width: 100%;

	@media (max-width: 680px) {
		flex-direction: column;
		margin: 1rem auto 5rem auto;
		width: 100%;
	}
`;

const TaskCard = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	margin: 0 auto 0 auto;
	min-width: 450px;
	max-width: 450px;
	min-height: 300px;
	max-height: 300px;
	background-color: ${({ theme }) => theme.palette.background.default};
	border: 0.5px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};
	padding: 1rem;

	@media (max-width: 1000px) {
		min-width: 350px;
		max-width: 350px;
	}

	@media (max-width: 680px) {
		min-width: 90vw;
		max-width: 90vw;
	}
`;

const TaskBoxSection = styled(Box)`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 auto 0 auto;
	height: 100%;
	flex-grow: 1;

	p {
		font-size: 1rem;
		text-align: center;
	}

	@media (max-width: 1200px) {
	}
`;

const TaskBoxSectionOne = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	height: 25px;
	width: 100%;
	margin: 0 auto 0 auto;
	padding: 0;

	p {
		display: flex;
		height: 25px;
		font-size: 1rem;
		cursor: default;
		margin: 0;
	}

	@media (max-width: 1200px) {
	}
`;

const TaskBoxSectionTwo = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	height: 25px;
	width: 100%;
	margin: 0 auto 0 auto;
	padding: 0;

	p {
		display: flex;
		height: 25px;
		font-size: 1rem;
		cursor: default;
		margin: 0;
	}

	@media (max-width: 1200px) {
	}
`;

const BottomContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	width: 100%;
	margin: 0 auto 0 auto;
`;

const TaskButton = styled(Button)`
	color: #fff;
	width: 100%;
	font-size: 16px;
	margin: 0.5rem auto 0 auto;
	text-transform: none;
	background-color: rgba(255, 127.5, 0, 1);

	&:hover {
		background-color: rgba(255, 127.5, 0, 1);
	}
`;

export default function IndexPage() {
	const theme = useTheme();
	const router = useRouter();
	const network = router.query.network as string;
	const isLoading = false;

	// Redux
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const currencyPrice = useSelector((state: { currencyPrice: number }) => state.currencyPrice);
	const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);

	// Network Check
	const isNetworkAvailable = availableChains.includes(chainId);

	// Name to Chain ID
	const chainIdUrl = nameToChainId[network];

	// Active Player Tasks
	const trendingDareList = useTrendingDareList(chainIdUrl);

	// Function to send a notification
	// const sendNotification = () => {
	// 	// Check if the Notification API is supported
	// 	if (!('Notification' in window)) {
	// 		alert('This browser does not support desktop notification');
	// 	} else if (Notification.permission === 'granted') {
	// 		// If permission was already granted
	// 		new Notification('Nerve Global Dapp Notification', {
	// 			body: 'Check out the latest dares and players!',
	// 			icon: 'https://canary.nerveglobal.com/favicon.ico',
	// 		});
	// 	} else if (Notification.permission !== 'denied') {
	// 		// Request permission from the user
	// 		Notification.requestPermission().then(function (permission) {
	// 			if (permission === 'granted') {
	// 				new Notification('Nerve Global Dapp Notification', {
	// 					body: 'Check out the latest dares and players!',
	// 					icon: 'https://dapp.nerveglobal.com/favicon.ico',
	// 				});
	// 			}
	// 		});
	// 	}
	// };

	// // Use useEffect to handle visibility change
	// useEffect(() => {
	// 	const handleVisibilityChange = () => {
	// 		if (document.visibilityState === 'hidden') {
	// 			sendNotification();
	// 		}
	// 	};

	// 	document.addEventListener('visibilitychange', handleVisibilityChange);

	// 	// Clean up the event listener when the component unmounts
	// 	return () => {
	// 		document.removeEventListener('visibilitychange', handleVisibilityChange);
	// 	};
	// }, []);

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
						<ActiveTabSection>
							{trendingDareList.map((trendingDare) => (
								<li style={{ listStyle: 'none' }} key={trendingDare}>
									<TaskCard theme={theme}>
										<TaskBoxSection>
											<p>{trendingDare.description}</p>
										</TaskBoxSection>
										<BottomContainer>
											<TaskBoxSectionOne>
												<p>#{trendingDare.id}</p>
												<p>
													{trendingDare.participants}{' '}
													<PeopleAltIcon style={{ display: 'felx', fontSize: '18px', fill: 'white', height: '100%', marginLeft: '0.5rem' }} />
												</p>
											</TaskBoxSectionOne>
											<TaskBoxSectionTwo>
												{currencyValue === false ? (
													<p>
														{((trendingDare?.amount / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
													</p>
												) : (
													<p>${((trendingDare?.amount / 1e18) * currencyPrice[network]?.usd).toFixed(2)}</p>
												)}
												{currencyValue === false ? (
													<p>
														{((trendingDare?.entranceAmount / 1e18) * 1).toFixed(2)} {isNetworkAvailable ? CHAINS[chainId]?.nameToken : 'MATIC'}
													</p>
												) : (
													<p>${((trendingDare?.entranceAmount / 1e18) * currencyPrice[network]?.usd).toFixed(2)}</p>
												)}
											</TaskBoxSectionTwo>
											<TaskButton onClick={() => router.push(`/dare/` + trendingDare.id)}>View Task</TaskButton>
										</BottomContainer>
									</TaskCard>
								</li>
							))}
						</ActiveTabSection>
					</StyledLayout>
				</>
			)}
		</>
	);
}
