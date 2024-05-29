'use client';

import styled from '@emotion/styled';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Box, Button, Divider, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import localFont from 'next/font/local';
import Head from 'next/head';
import router, { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingScreen from '../components/LoadingScreen';
import SelectFilter from '../components/SelectFilter';
import SelectSort from '../components/SelectSort';
import useGlobalStats from '../hooks/globalStats/useGlobalStats';
import useActivePlayerTasks from '../hooks/playerData/useActivePlayerTasks';
import useTrendingDareList from '../hooks/searchData/trending/useTrendingDareList';
import { currencySlice } from '../state/currency/currencySlice';
import { CHAINS, nameToChainId } from '../utils/chains';
import EthereumLogo from '/public/svg/chains/ethereum.svg';
import PolygonLogo from '/public/svg/chains/polygon.svg';
import GoogleMaps from '/public/svg/tech/googlemaps.svg';

const TrueLies = localFont({ src: '../public/fonts/TrueLies.woff2', display: 'swap' });

const StyledLayout = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: 90%;
	height: auto;
	margin: 2% auto;
	background-color: transparent;

	@media (max-width: 750px) {
		width: 100%;
	}
`;

const StyledTitle = styled.h1<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	font-family: ${TrueLies.style.fontFamily};
	text-transform: none;
	font-size: 4rem;
	cursor: default;
	margin: 5rem auto 0 auto;
	width: 100%;
	font-weight: 100;

	@media (max-width: 680px) {
		font-size: 3rem;
	}
`;

const StyledGlobalStats = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: space-evenly;
	margin: 2.5rem auto 2.5rem auto;
	width: 75%;
	max-width: 1280px;

	@media (max-width: 750px) {
		flex-direction: row;
		width: 95%;
	}
`;

const StyledGlobalStat = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin: 0 auto 0 auto;
	width: 100%;

	h1 {
		margin: 0 auto 0 auto;
		font-size: 2rem;
		font-weight: 100;
		font-family: ${TrueLies.style.fontFamily};
		color: ${(props) => props.theme.palette.text.primary};
	}

	@media (max-width: 750px) {
		h1 {
			font-size: 1.125rem;
			color: ${(props) => props.theme.palette.text.primary};
		}
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

	@media (max-width: 750px) {
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

	@media (max-width: 750px) {
		min-width: 350px;
		max-width: 350px;
	}

	@media (max-width: 680px) {
		min-width: 90vw;
		max-width: 90vw;
	}
`;

const StyledInfo = styled.div<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	margin: 0 auto 0 auto;

	@media (max-width: 750px) {
	}
`;

const StyledMap = styled.div<{ theme: any }>`
	display: flex;
	justify-content: left;
	align-items: center;
	width: fit-content;
	margin: 0 auto 0 0;
	height: 35px;
	color: rgba(255, 255, 255, 0.75);
	font-size: 0.925rem;
	background-color: rgba(134, 134, 139, 0.25);
	border-radius: 12px;
	padding: 0.5rem;
	color: ${({ theme }) => theme.palette.text.primary};
	cursor: default;

	&:hover {
		cursor: pointer;
	}
`;

const StyledNetwork = styled.div<{ theme: any }>`
	display: flex;
	justify-content: right;
	align-items: center;
	width: fit-content;
	margin: 0 0 0 auto;
	height: 35px;
	color: rgba(255, 255, 255, 0.75);
	font-size: 0.925rem;
	background-color: rgba(134, 134, 139, 0.25);
	border-radius: 12px;
	padding: 0.5rem;
	color: ${({ theme }) => theme.palette.text.primary};
	cursor: default;
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

	@media (max-width: 750px) {
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

	@media (max-width: 750px) {
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

	@media (max-width: 750px) {
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

const StyledDivider = styled(Divider)<{ theme: any }>`
	width: 100%;
	backgroundcolor: ${({ theme }) => theme.palette.secondary.main};

	@media (max-width: 750px) {
		width: 90%;
	}
`;

const ActiveFilterBox = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	width: 100%;
	height: 40px;
	margin: 1rem auto 0 auto;

	@media (max-width: 750px) {
		flex-direction: column;
		height: auto;
	}
`;

const ActiveTabRightSection = styled(Box)`
	display: flex;
	flex-direction: row;
	justify-content: flex-end;
	min-width: 100%;

	@media (max-width: 750px) {
		flex-direction: column;
		justify-content: center;
	}
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)<{ theme: any }>`
	background-color: transparent;
	height: 35px;
	width: 150px;
	margin-left: 1rem;
	cursor: not-allowed;

	& .MuiToggleButton-root {
		&:hover {
			background-color: transparent;
			border: 1px solid ${({ theme }) => theme.palette.warning.main};
			border-left: 1px solid ${({ theme }) => theme.palette.warning.main};
		}
	}

	@media (max-width: 750px) {
		display: flex;
		justify-content: center;
		margin: 0.5rem auto 0 auto;
	}
`;

const StyledToggleButton = styled(ToggleButton)<{ theme: any }>`
	color: ${({ theme }) => theme.palette.secondary.main};
	background-color: transparent;
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};
	cursor: pointer;
	// font-size: 1rem;
	font-weight: 500;
	width: 150px;

	&.Mui-selected {
		color: ${({ theme }) => theme.palette.text.primary};
		background-color: transparent;
		border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	}
`;

export default function IndexPage() {
	const theme = useTheme();
	const router = useRouter();
	const isLoading = false;

	// Redux
	const dispatch = useDispatch();
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const currencyPrice = useSelector((state: { currencyPrice: number }) => state.currencyPrice);
	const sort = useSelector((state: { sort: number }) => state.sort);
	const filter = useSelector((state: { filter: number[] }) => state.filter);

	// console.log('filter', selectedChains);
	function getChainLogoComponent(chainId) {
		if (!chainId) return null;

		const LogoComponent = {
			1: EthereumLogo,
			11155111: EthereumLogo,
			137: PolygonLogo,
		}[chainId];

		return <LogoComponent style={{ display: 'flex', marginRight: '0.5rem' }} width="18" height="18" alt="Logo" />;
	}

	// Active Player Tasks
	const trendingDareList = useTrendingDareList();

	// Global Stats
	const { globalStats, loading, error } = useGlobalStats();
	const { allChains, individualChains } = globalStats || {};

	// Toogle Button For Token Price
	const handleToggle = (event, newCurrency) => {
		// update currencyValue in redux
		dispatch(currencySlice.actions.updateCurrency(newCurrency));
	};

	const [filteredActiveTasks, setFilteredActiveTasks] = useState([]);

	useEffect(() => {
		// Combine tasks from all chains into a single array
		const combineTasks = (allTasks) => {
			return Object.values(allTasks).flat();
		};

		// Create a function that returns sorted tasks based on the sort option
		const sortTasks = (tasks, sortOption) => {
			if (!tasks) return [];
			switch (sortOption) {
				case 1:
					return [...tasks].sort((a, b) => a.amount - b.amount);
				case 2:
					return [...tasks].sort((a, b) => b.amount - a.amount);
				case 3:
					return [...tasks].sort((a, b) => a.participants - b.participants);
				case 4:
					return [...tasks].sort((a, b) => b.participants - a.participants);
				case 5:
					return [...tasks].sort((a, b) => a.entranceAmount - b.entranceAmount);
				case 6:
					return [...tasks].sort((a, b) => b.entranceAmount - a.entranceAmount);
				default:
					return tasks; // return original tasks if no sort option matches
			}
		};

		// Filter tasks by selected chains
		const filterBySelectedChains = (tasks, selectedChains) => {
			return tasks.filter((task) => {
				const taskChainIdNum = Number(task.chainId); // Convert to number
				return selectedChains?.includes(taskChainIdNum);
			});
		};

		// Combine, sort, and then filter tasks
		const combinedActiveTasks = combineTasks(trendingDareList);
		const sortedActiveTasks = sortTasks(combinedActiveTasks, sort);
		const filteredActiveTasks = filterBySelectedChains(sortedActiveTasks, filter);

		// Update the state with the filtered and sorted tasks
		setFilteredActiveTasks(filteredActiveTasks);
	}, [sort, trendingDareList, filter]); // Include 'selectedChains' in the dependencies array

	// console.log('filteredActiveTasks', filteredActiveTasks);

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

	function formatCrypto(value) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 4,
		});
	}

	function formatNumber(value) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	// Function to handle map click
	const handleMapClick = (latitude, longitude) => {
		router.push(`/map?lat=${latitude}&lng=${longitude}`);
	};

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
						<StyledTitle theme={theme}>Global Stats</StyledTitle>
						<StyledGlobalStats theme={theme}>
							<StyledGlobalStat theme={theme}>
								<h1>${allChains?.earnings}</h1>
								<h1>Earnings</h1>
							</StyledGlobalStat>
							<StyledGlobalStat theme={theme}>
								<h1>{allChains?.count}</h1>
								<h1>Tasks</h1>
							</StyledGlobalStat>
							<StyledGlobalStat theme={theme}>
								<h1>{allChains?.users}</h1>
								<h1>Users</h1>
							</StyledGlobalStat>
						</StyledGlobalStats>
						<StyledDivider theme={theme} />
						<ActiveFilterBox>
							{/* <ActiveTabLeftSection></ActiveTabLeftSection> */}
							<ActiveTabRightSection>
								{/* // Filter StyledSection */}
								<SelectFilter />
								<SelectSort />

								<StyledToggleButtonGroup theme={theme} value={currencyValue} exclusive onChange={handleToggle}>
									<StyledToggleButton theme={theme} disabled={currencyValue === false} value={false}>
										ETH
									</StyledToggleButton>
									<StyledToggleButton theme={theme} disabled={currencyValue === true} value={true}>
										<a>USD</a>
									</StyledToggleButton>
								</StyledToggleButtonGroup>
							</ActiveTabRightSection>
						</ActiveFilterBox>
						<ActiveTabSection>
							{filteredActiveTasks.map((tad) => (
								<li style={{ listStyle: 'none' }} key={tad.id}>
									<TaskCard theme={theme}>
										<StyledInfo theme={theme}>
											{tad?.latitude && tad?.longitude !== '0' && (
												<StyledMap theme={theme} onClick={() => handleMapClick(tad.latitude, tad.longitude)}>
													<GoogleMaps style={{ fill: theme.palette.text.primary, display: 'flex', fontSize: '20px', marginRight: '0.5rem' }} />
													Google Map
												</StyledMap>
											)}
											<StyledNetwork theme={theme}>
												{getChainLogoComponent(tad?.chainId)}
												{CHAINS[tad.chainId].name}
											</StyledNetwork>
										</StyledInfo>
										<TaskBoxSection>
											<p>{tad.description}</p>
										</TaskBoxSection>
										<BottomContainer>
											<TaskBoxSectionOne>
												<p>#{tad.id}</p>
												<p>
													{tad.participants}{' '}
													<PeopleAltIcon style={{ display: 'felx', fontSize: '18px', fill: 'white', height: '100%', marginLeft: '0.5rem' }} />
												</p>
											</TaskBoxSectionOne>
											<TaskBoxSectionTwo>
												{currencyValue === false ? (
													<p>
														{formatCrypto(tad?.entranceAmount)} {CHAINS[tad?.chainId].nameToken}
													</p>
												) : (
													<p>${formatNumber(tad?.entranceAmount * currencyPrice[CHAINS[tad?.chainId]?.nameToken?.toLowerCase()])}</p>
												)}
												{currencyValue === false ? (
													<p>
														{formatCrypto(tad?.amount)} {CHAINS[tad?.chainId].nameToken}
													</p>
												) : (
													<p>${formatNumber(tad?.amount * currencyPrice[CHAINS[tad?.chainId]?.nameToken?.toLowerCase()])}</p>
												)}
											</TaskBoxSectionTwo>
											<TaskButton onClick={() => router.push(`/dare/${tad.chainId}-` + tad.id)}>View Task</TaskButton>
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
