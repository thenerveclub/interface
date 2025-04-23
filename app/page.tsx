'use client';

import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import Head from 'next/head';
import router, { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { SiEthereum, SiGooglemaps, SiPolygon } from 'react-icons/si';
import { useDispatch, useSelector } from 'react-redux';
import LoadingScreen from '../components/LoadingScreen';
import SelectFilter from '../components/SelectFilter';
import SelectSort from '../components/SelectSort';
import useGlobalStats from '../hooks/globalStats/useGlobalStats';
import useTrendingDareList from '../hooks/searchData/trending/useTrendingDareList';
import { currencySlice } from '../state/currency/currencySlice';
import { CHAINS } from '../utils/chains';

export default function IndexPage() {
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
			1: <SiEthereum size={32} color="#627EEA" />,
			11155111: <SiEthereum size={32} color="#627EEA" />,
			137: <SiPolygon size={32} color="#627EEA" />,
		}[chainId];

		return <LogoComponent style={{ display: 'flex', marginRight: '0.5rem' }} width="18" height="18" alt="Logo" />;
	}

	// Active Player Tasks
	const trendingDareList = useTrendingDareList();

	// Global Stats
	const { globalStats } = useGlobalStats();
	const { allChains } = globalStats || {};

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

		// console.log('trendingDareList', trendingDareList);

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

					{/* Landing Section */}
					<div className="flex flex-col h-screen md:flex-row items-center justify-center text-center w-[90%] mx-auto -mt-10">
						<div className="flex flex-col items-center md:items-start justify-center text-center w-[90%] mx-auto my-8">
							<div className="text-center text-6xl 2xl:text-9xl font-bold text-black dark:text-white">DARE.</div>
							<div className="text-center text-6xl 2xl:text-9xl font-bold text-black dark:text-white">PROVE.</div>
							<div className="text-center text-6xl 2xl:text-9xl font-bold text-accent">GET PAID.</div>
							<div className="flex flex-row justify-start w-full gap-32 mt-24">
								<div className="flex flex-col items-start w-auto gap-2">
									<h1 className="text-[2rem] font-thin">TOTAL USERS</h1>
									<h1 className="text-[2rem] font-normal">{allChains?.users}</h1>
								</div>
								<div className="flex flex-col items-start w-auto gap-0">
									<h1 className="text-[2rem] font-thin">TOTAL EARNINGS</h1>
									<h1 className="text-[2rem] font-normal">${allChains?.earnings}</h1>
								</div>
							</div>
						</div>
						<div className="hidden md:flex flex-col items-center md:items-end justify-center text-center w-[90%] mx-auto my-8">
							<img src="/logo.png" alt="The Nerve Club Logo" className="w-full h-full" />
						</div>
					</div>

					<div className="flex flex-col bg-background items-center justify-center text-center w-[90%] mx-auto my-8">
						<hr className="w-full border-t border-secondary" />
						<div className="flex flex-col lg:flex-row items-center justify-center w-full h-10 my-4 gap-4">
							{/* <ActiveTabLeftSection></ActiveTabLeftSection> */}
							<div className="flex flex-col lg:flex-row justify-end w-full">
								{/* // Filter StyledSection */}
								<SelectFilter />
								<SelectSort />
								{/* <div className="flex items-center justify-center">
									<ToggleButtonGroup
										className="h-9 w-40 cursor-not-allowed"
										value={currencyValue}
										exclusive
										onChange={handleToggle}
									>
										<ToggleButton className="text-secondary border-secondary font-medium" disabled={currencyValue === false} value={false}>
											ETH
										</ToggleButton>
										<ToggleButton className="text-secondary border-secondary font-medium" disabled={currencyValue === true} value={true}>
											USD
										</ToggleButton>
									</ToggleButtonGroup>
								</div> */}
							</div>
						</div>
						<div className="flex flex-wrap items-center justify-evenly gap-8 my-10 w-full">
							{filteredActiveTasks.map((tad) => (
								<li key={`${tad.chainId}-${tad.id}`} className="list-none">
									<div className="flex flex-col justify-between items-center mx-auto min-w-[450px] max-w-[450px] min-h-[300px] max-h-[300px] bg-background border border-secondary rounded-lg p-4">
										<div className="flex justify-between w-full">
											{tad?.latitude && tad?.longitude !== '0' && (
												<div
													onClick={() => handleMapClick(tad.latitude, tad.longitude)}
													className="flex justify-start items-center w-fit text-primary bg-secondary rounded-lg px-4 py-2 cursor-pointer"
												>
													<SiGooglemaps className="w-6 h-6 fill-current mr-2" />
													Google Map
												</div>
											)}
											<div className="flex items-center w-fit justify-end text-primary bg-secondary rounded-lg px-4 py-2">
												{getChainLogoComponent(tad?.chainId)}
												{CHAINS[tad?.chainId]?.name}
											</div>
										</div>
										<div className="flex flex-col justify-center text-center flex-grow">
											<p>{tad.description}</p>
										</div>
										<div className="flex flex-col justify-center items-center w-full">
											<div className="flex justify-between w-full h-6">
												<p>#{tad.id}</p>
												<p className="flex items-center">
													{tad.participants}
													<PeopleAltIcon className="ml-2 text-white text-lg" />
												</p>
											</div>
											<div className="flex justify-between w-full h-6">
												{currencyValue === false ? (
													<p>
														{formatCrypto(tad?.entranceAmount)} {CHAINS[tad?.chainId]?.nameToken}
													</p>
												) : (
													<p>${formatNumber(tad?.entranceAmount * currencyPrice[CHAINS[tad?.chainId]?.nameToken?.toLowerCase()])}</p>
												)}
												{currencyValue === false ? (
													<p>
														{formatCrypto(tad?.amount)} {CHAINS[tad?.chainId]?.nameToken}
													</p>
												) : (
													<p>${formatNumber(tad?.amount * currencyPrice[CHAINS[tad?.chainId]?.nameToken?.toLowerCase()])}</p>
												)}
											</div>
											<button
												onClick={() => router.push(`/dare/${tad.chainId}-${tad.id}`)}
												className="bg-secondary text-white py-2 px-4 rounded-lg mt-2 hover:bg-secondary"
											>
												View Task
											</button>
										</div>
									</div>
								</li>
							))}
						</div>
					</div>
				</>
			)}
		</>
	);
}
