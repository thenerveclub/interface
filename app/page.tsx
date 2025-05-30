'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FaPeopleGroup } from 'react-icons/fa6';
import { IoIosBody } from 'react-icons/io';
import { SiEthereum, SiGooglemaps, SiPolygon } from 'react-icons/si';

import { useDispatch, useSelector } from 'react-redux';
import LoadingScreen from '../components/LoadingScreen';
import SelectFilter from '../components/SelectFilter';
import SelectSort from '../components/SelectSort';
import useGlobalStats from '../hooks/globalStats/useGlobalStats';
import useTrendingDareList from '../hooks/searchData/trending/useTrendingDareList';
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

	function getChainLogoComponent(chainId: number) {
		if (!chainId) return null;

		const LogoMap = {
			1: SiEthereum,
			11155111: SiEthereum,
			137: SiPolygon,
		};

		const Logo = LogoMap[chainId];

		if (!Logo) return null;

		return <Logo size={18} color="#627EEA" style={{ display: 'flex', marginRight: '0.5rem' }} />;
	}

	// Active Player Tasks
	const trendingDareList = useTrendingDareList();

	// Global Stats
	const { globalStats } = useGlobalStats();
	const { allChains } = globalStats || {};

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

		console.log('Aktive Dares', filteredActiveTasks);

		// Update the state with the filtered and sorted tasks
		setFilteredActiveTasks(filteredActiveTasks);
	}, [sort, trendingDareList, filter]); // Include 'selectedChains' in the dependencies array

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

	// Countdown Timer
	function useCountdown(endTimestamp: number): string {
		const [timeLeft, setTimeLeft] = useState(() => getFormattedTime(endTimestamp));

		useEffect(() => {
			const interval = setInterval(() => {
				setTimeLeft(getFormattedTime(endTimestamp));
			}, 1000);

			return () => clearInterval(interval);
		}, [endTimestamp]);

		return timeLeft;
	}

	function getFormattedTime(endTimestamp: number): string {
		const now = Math.floor(Date.now() / 1000);
		const diff = endTimestamp - now;

		if (diff <= 0) return 'Expired';

		const days = Math.floor(diff / 86400);
		const hours = Math.floor((diff % 86400) / 3600);
		const minutes = Math.floor((diff % 3600) / 60);
		const seconds = diff % 60;

		return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds
			.toString()
			.padStart(2, '0')}`;
	}

	const CountdownDisplay = ({ endTime }: { endTime: number }) => {
		const timeLeft = useCountdown(endTime);
		return (
			<span
				className="tabular-nums text-base md:text-lg"
				style={{ minWidth: '170px', display: 'inline-block' }} // adjust minWidth as needed
			>
				{timeLeft}
			</span>
		);
	};

	return (
		<>
			{isLoading ? (
				<LoadingScreen />
			) : (
				<>
					{/* Landing Section */}
					<div className="flex flex-col h-screen xl:flex-row items-center justify-center text-center w-full max-w-[90%] mx-auto -mt-10">
						<div className="relative flex flex-col items-center xl:items-start justify-center text-center w-[90%] mx-auto my-8">
							{/* Image behind text on mobile only */}
							<div className="absolute inset-0 xl:hidden opacity-25 z-0">
								<Image src="/logo.png" alt="The Nerve Club Logo" fill className="object-contain w-auto h-auto max-w-full max-h-full" />
							</div>

							{/* Foreground text */}
							<div className="z-10">
								<div className="text-center xl:text-left text-6xl md:text-9xl font-bold text-black dark:text-white">DARE.</div>
								<div className="text-center xl:text-left text-6xl md:text-9xl font-bold text-black dark:text-white">PROVE.</div>
								<div className="text-center xl:text-left text-6xl md:text-9xl font-bold text-accent">GET PAID.</div>
							</div>

							{/* Stats Section */}
							<div className="flex flex-row justify-center xl:justify-start w-full gap-32 mt-24 z-10">
								<div className="flex flex-col items-start text-start w-auto gap-0">
									<h1 className="text-[2rem] font-thin">TOTAL USERS</h1>
									<h1 className="text-[2rem] font-normal">{allChains?.users}</h1>
								</div>
								<div className="flex flex-col items-start text-start w-auto gap-0">
									<h1 className="text-[2rem] font-thin">TOTAL EARNINGS</h1>
									<h1 className="text-[2rem] font-normal">${allChains?.earnings}</h1>
								</div>
							</div>
						</div>

						<div className="hidden xl:flex items-center justify-center w-1/3 relative h-full w-full">
							<Image src="/logo.png" alt="The Nerve Club Logo" fill className="w-full h-full" />
						</div>
					</div>

					<div className="flex flex-col bg-background items-center justify-center text-center w-[90%] mx-auto my-8">
						<hr className="w-full border-t border-gray-400 dark:border-secondary" />
						<div className="flex flex-col lg:flex-row items-center justify-center w-full h-10 my-4 gap-4">
							<div className="flex flex-row justify-between md:justify-end w-full gap-2">
								<SelectFilter />
								<SelectSort />
							</div>
						</div>
						<div className="flex flex-wrap items-center justify-evenly gap-8 my-10 w-full">
							{filteredActiveTasks.map((tad) => (
								<li key={`${tad.chainId}-${tad.id}`} className="list-none">
									<div className="flex flex-col justify-between items-center mx-auto w-[90vw] md:min-w-[450px] md:max-w-[450px] min-h-[300px] max-h-[300px] bg-background border border-accent rounded-lg p-3">
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
											<div className="flex items-center w-fit justify-end text-black dark:text-white bg-secondary rounded-lg px-4 py-2">
												{getChainLogoComponent(tad?.chainId)}
												{CHAINS[tad?.chainId]?.name}
											</div>
										</div>
										<div className="flex justify-end w-full">
											<CountdownDisplay endTime={tad.endTask} />
										</div>
										<div className="flex flex-col justify-center text-center flex-grow">
											<p>{tad.description}</p>
										</div>
										<div className="flex flex-col justify-center items-center w-full">
											<div className="flex justify-between w-full h-6">
												<p>#{tad.id}</p>
												<p className="flex items-center">
													{tad.participants}
													<FaPeopleGroup className="ml-2 text-white text-lg" />
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
												className="bg-accent border border-accent text-white dark:text-white py-2 px-4 rounded-lg mt-2 w-full font-semibold"
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
