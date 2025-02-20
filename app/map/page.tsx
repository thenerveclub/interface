'use client';

import { motion } from 'framer-motion';
import Head from 'next/head';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

// Web3 + Redux
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useDispatch, useSelector } from 'react-redux';

// Hooks & Utils
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import usePlayerDataSearchList from '../../hooks/searchData/usePlayerDataSearchList';
import useBalanceTracker from '../../hooks/useBalanceTracker';
import { createTriggerSlice } from '../../state/trigger/createTriggerSlice';
import { CHAINS, getAddChainParameters } from '../../utils/chains';
import { metaMask } from '../../utils/connectors/metaMask';

// Components
import GoogleMap from '../../components/GoogleMap';

// ------------------------------------------------------------------
// MAIN PAGE
// - Static left panel with "Create Task" (previously a modal).
// - Right side: GoogleMap
// - On map click => lat/lng is updated in the left panel states.
// - All MUI replaced with Tailwind/Framer Motion.
// ------------------------------------------------------------------

export default function IndexPage() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const dispatch = useDispatch();
	const { enqueueSnackbar } = useSnackbar();

	// Extract lat, lng from query params (unchanged from your code).
	const latParam = searchParams.get('lat');
	const lngParam = searchParams.get('lng');

	// For logging only
	const fullPath = `${pathname}?${searchParams.toString()}`;
	console.log('Current URL:', fullPath);

	// Default location if no params
	const defaultLat = 20;
	const defaultLng = 0;
	const defaultZoom = 3;

	// Store location in state (unchanged from your code).
	const [location, setLocation] = useState({
		latitude: defaultLat,
		longitude: defaultLng,
		zoom: defaultZoom,
	});

	// On mount or if lat/lng changes, re-set location.
	useEffect(() => {
		let latitude = defaultLat;
		let longitude = defaultLng;
		let zoom = defaultZoom;

		if (latParam && lngParam) {
			latitude = Number(latParam);
			longitude = Number(lngParam);
			zoom = 7; // Example zoom if lat/lng are present
		}

		setLocation({ latitude, longitude, zoom });
	}, [latParam, lngParam]);

	// Adjust viewport height on mobile devices
	useEffect(() => {
		const adjustHeight = () => {
			const vh = window.innerHeight * 0.01;
			document.documentElement.style.setProperty('--vh', `${vh}px`);
		};
		window.addEventListener('resize', adjustHeight);
		adjustHeight();
		return () => window.removeEventListener('resize', adjustHeight);
	}, []);

	// ------------------------------------------------------------------
	// The old "CreateMapDare" logic (converted to a static panel):
	// ------------------------------------------------------------------

	// Web3 + Redux states
	const { account, provider } = useWeb3React();
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	// Balances
	const balance = useBalanceTracker(provider, account);

	// Local form states
	const [network, setNetwork] = useState('');
	const [value, setValue] = useState('0.00');
	const [days, setDays] = useState('0');
	const [hours, setHours] = useState('0');
	const [minutes, setMinutes] = useState('0');
	const [description, setDescription] = useState('');
	const [pendingTx, setPendingTx] = useState(false);
	// const [reverseGeocoded, setReverseGeocoded] = useState('');

	// Player search
	const [searchValue, setSearchValue] = useState('');
	const playerSearchList = usePlayerDataSearchList(searchValue);
	const [isListVisible, setListVisible] = useState(false);

	// The lat/lng from the **map** click (instead of a modal):
	const [clickedLat, setClickedLat] = useState<number | null>(null);
	const [clickedLng, setClickedLng] = useState<number | null>(null);

	// Format balance
	function formatBalance(val: string | number) {
		return Number(val).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	// Validation for days/hours/minutes
	function validateInput(value: string, max: number) {
		const num = parseInt(value, 10);
		if (isNaN(num) || num < 0) return '0';
		if (num > max) return max.toString();
		return num.toString();
	}

	function convertToSeconds(d: string, h: string, m: string) {
		const ds = parseInt(d) * 86400;
		const hs = parseInt(h) * 3600;
		const ms = parseInt(m) * 60;
		return ds + hs + ms;
	}

	const handleNetworkSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setNetwork(e.target.value);
	};

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setSearchValue(e.target.value);
		setListVisible(true);
	};

	const handleListPlayerItemClick = (playerId: string, playerAddress: string) => {
		// e.g., setSearchValue to userName
		setSearchValue(playerId);
		setListVisible(false);
	};

	// onMapClick => user clicked the map, store lat/lng in state.
	const onMapClick = (lat: number, lng: number) => {
		setClickedLat(lat);
		setClickedLng(lng);
		// reverseGeocode(lat, lng);
	};

	// Set max value for the entry
	const handleSetMaxValue = () => {
		setValue(formatBalance(balance));
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value || '0.00');
	};

	// The "Create Task" action
	async function onCreateTask() {
		if (!provider) {
			enqueueSnackbar('No provider found. Connect your wallet.', { variant: 'error' });
			return;
		}
		try {
			setPendingTx(true);
			const signer = provider.getSigner();
			const nerveGlobal = new ethers.Contract(CHAINS[network]?.contract, NerveGlobalABI, signer);

			const recipientAddress = '0x52B28292846c59dA23114496d6e6BfC875f54FF5'; // same as your code
			const txValue = ethers.utils.parseEther(value || '0');
			const totalTime = convertToSeconds(days, hours, minutes);

			// lat/lng
			const latString = clickedLat ? clickedLat.toString() : '0';
			const lngString = clickedLng ? clickedLng.toString() : '0';

			const tx = await nerveGlobal.create(recipientAddress, description, totalTime, latString, lngString, { value: txValue });
			await tx.wait();

			if (tx.hash) {
				// Wait 2 seconds
				await new Promise((resolve) => setTimeout(resolve, 2000));
				dispatch(createTriggerSlice.actions.setCreateTrigger(true));
				enqueueSnackbar('Task created!', { variant: 'success' });

				// Reset states
				setValue('0.00');
				setDays('0');
				setHours('0');
				setMinutes('0');
				setDescription('');
				setClickedLat(null);
				setClickedLng(null);
			}
		} catch (err) {
			console.error(err);
			enqueueSnackbar('Failed to create task.', { variant: 'error' });
		} finally {
			setPendingTx(false);
		}
	}

	// Network switch
	const handleNetworkChange = async () => {
		if (!network) return;
		try {
			// If the user has MetaMask
			if (metaMask) {
				await metaMask.activate(Number(network));
			} else {
				// Or fallback to adding chain parameters
				await metaMask.activate(getAddChainParameters(Number(network)));
			}
		} catch (error) {
			console.error('Network change failed:', error);
		}
	};

	// Reverse geocoding
	// async function reverseGeocode(lat: number, lng: number) {
	// 	try {
	// 		const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
	// 		if (!apiKey) {
	// 			console.warn('No Google Maps API key found in NEXT_PUBLIC_GOOGLE_MAPS_API_KEY.');
	// 			return;
	// 		}

	// 		const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
	// 		const response = await fetch(url);
	// 		console.log('response', response);
	// 		const data = await response.json();
	// 		console.log('data', data);
	// 		if (data.status === 'OK' && data.results.length) {
	// 			// The "formatted_address" is usually something like "Los Angeles, CA, USA"
	// 			setReverseGeocoded(data.results[0].formatted_address);
	// 		} else {
	// 			setReverseGeocoded('');
	// 		}
	// 	} catch (err) {
	// 		console.error('Reverse geocoding error:', err);
	// 		setReverseGeocoded('');
	// 	}
	// }

	// ------------------------------------------------------------------
	// RENDER
	// ------------------------------------------------------------------
	return (
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

			{/* Fullscreen container => left panel + right map */}
			<div className="w-screen h-screen flex bg-transparent">
				{/* LEFT PANEL - replaced the old modal */}
				<motion.div
					// Slide in from left
					initial={{ x: '-500px', width: '0px', opacity: 0 }}
					animate={{ x: 0, width: '500px', opacity: 1 }}
					transition={{ duration: 0.75 }}
					className="h-full bg-background border-r border-gray-200 p-4 flex flex-col"
				>
					<h2 className="text-xl font-bold mt-16 mb-4">Create Task</h2>

					{/* Player */}
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-1">Player</label>
						<input
							type="text"
							placeholder="Search player..."
							className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
							value={searchValue}
							onChange={handleSearchChange}
							onFocus={() => setListVisible(true)}
						/>
						{/* Dropdown list */}
						{isListVisible && playerSearchList.length > 0 && (
							<div className="relative">
								<div className="absolute z-50 bg-white border border-amber-200 w-full rounded-md shadow-md max-h-48 overflow-y-auto">
									{playerSearchList.map((player) => (
										<div
											key={player.id}
											onClick={() => handleListPlayerItemClick(player.userName, player.userAddress)}
											className="px-3 py-2 hover:bg-amber-100 cursor-pointer text-sm"
										>
											{player.userName}
										</div>
									))}
								</div>
							</div>
						)}
					</div>

					{/* Select Network */}
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-1">Select Network</label>
						<div className="flex items-center space-x-2">
							<select
								className="border border-gray-300 rounded-md px-3 py-2 text-sm flex-1 focus:outline-none focus:ring-2 focus:ring-amber-500"
								value={network}
								onChange={handleNetworkSelect}
							>
								<option value="">-- Choose Network --</option>
								{Object.entries(CHAINS).map(([cId, cInfo]) => {
									if (cInfo && cInfo.name && cInfo.logo) {
										return (
											<option key={cId} value={cId}>
												{cInfo.name}
											</option>
										);
									}
									return null;
								})}
							</select>

							{/* Show "Change Network" button if chain doesn't match */}
							{network && chainId !== Number(network) && (
								<button
									className="px-3 py-2 bg-amber-500 text-white rounded-md text-sm hover:bg-amber-600 disabled:opacity-50"
									onClick={handleNetworkChange}
									disabled={pendingTx}
								>
									{pendingTx ? 'Switching...' : 'Change'}
								</button>
							)}
						</div>
					</div>

					{/* Entry Amount */}
					<div className="mb-4">
						<div className="flex justify-between text-sm mb-1">
							<label className="font-semibold">Entry Amount</label>
							<span className="text-gray-400">Balance: {formatBalance(balance)}</span>
						</div>
						<div className="flex">
							<input
								type="text"
								className="flex-1 rounded-l-md border border-gray-300 px-3 py-2 text-sm text-right focus:outline-none focus:ring-2 focus:ring-amber-500"
								placeholder="0.00"
								value={value}
								onChange={handleInputChange}
							/>
							<div className="border border-l-0 border-gray-300 rounded-r-md bg-gray-50 flex items-center px-2 space-x-2">
								<span className="text-sm text-gray-700">{CHAINS[network]?.nameToken ?? ''}</span>
								<button onClick={handleSetMaxValue} className="text-sm bg-amber-200 hover:bg-amber-300 rounded px-2 py-1">
									Max
								</button>
							</div>
						</div>
					</div>

					{/* Time (days, hours, minutes) */}
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-1">Time</label>
						<div className="grid grid-cols-3 gap-2">
							<input
								type="number"
								className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
								placeholder="Days"
								value={days}
								onChange={(e) => setDays(validateInput(e.target.value, 30))}
							/>
							<input
								type="number"
								className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
								placeholder="Hours"
								value={hours}
								onChange={(e) => setHours(validateInput(e.target.value, 23))}
							/>
							<input
								type="number"
								className="border border-gray-300 rounded-md px-2 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
								placeholder="Minutes"
								value={minutes}
								onChange={(e) => setMinutes(validateInput(e.target.value, 59))}
							/>
						</div>
					</div>

					{/* Description */}
					<div className="mb-4">
						<label className="block text-sm font-semibold mb-1">Task Description</label>
						<textarea
							className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
							rows={3}
							maxLength={100}
							placeholder="Do you dare..."
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
						<div className="text-right text-xs text-gray-400">{description.length}/100</div>
					</div>

					{/* Chosen Latitude/Longitude from map click */}
					<div className="mb-4 text-sm">
						<label className="font-semibold">Clicked Location</label>
						{/* <div className="mt-1 text-sm text-gray-700 font-medium">{reverseGeocoded}</div> */}
						<div className="mt-1">
							<div>
								<span className="text-gray-500">Latitude:</span> {clickedLat !== null ? clickedLat.toFixed(6) : '-'}
							</div>
							<div>
								<span className="text-gray-500">Longitude:</span> {clickedLng !== null ? clickedLng.toFixed(6) : '-'}
							</div>
						</div>
					</div>

					{/* Create Task Button */}
					<button
						onClick={onCreateTask}
						disabled={!network || value === '0' || value === '0.0' || value === '0.00' || !clickedLat || !clickedLng || pendingTx}
						className="w-full bg-backgroundReverse text-white text-sm font-medium py-2 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
					>
						{pendingTx ? 'Pending...' : 'Create Task'}
					</button>
				</motion.div>

				{/* Animate the map’s width from 100% → calc(100% - 500px) */}
				<motion.div
					initial={{ width: '100%', opacity: 1 }}
					animate={{ width: 'calc(100% - 500px)', opacity: 1 }}
					transition={{ duration: 0.75 }}
					className="h-full"
				>
					<GoogleMap
						location={location}
						onMapClick={onMapClick}
						// pass any other props you want
					/>
				</motion.div>
			</div>
		</>
	);
}
