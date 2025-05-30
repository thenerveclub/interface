'use client';

import { useEffect, useState } from 'react';
import { IoSettingsOutline } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';
import { currencySlice } from '../../../state/currency/currencySlice';
import { customRPCSlice } from '../../../state/customRPC/customRPCSlice';
import { rpcSlice } from '../../../state/rpc/rpcSlice';
import { testnetsSlice } from '../../../state/testnets/testnetsSlice';
import { setTheme, setUseSystemSetting } from '../../../state/theme/themeSlice';
import PortalModal from '../../PortalModal';

export default function SettingsModal() {
	const dispatch = useDispatch();

	// Redux state
	const themeState = useSelector((state: any) => state.theme);
	const currencyValue = useSelector((state: any) => state.currency);
	const testnetsValue = useSelector((state: any) => state.testnets);
	const rpcValue = useSelector((state: any) => state.rpc);
	const customRPCValue = useSelector((state: any) => state.customRPC);

	// Local states
	const [currentTheme, setCurrentTheme] = useState(themeState.prefersSystemSetting ? 'system' : themeState.currentTheme);
	const [showTestnets, setShowTestnets] = useState(testnetsValue);
	const [showCurrency, setShowCurrency] = useState(currencyValue);
	const [menuOpen, setMenuOpen] = useState(false);
	const [customRpcUrl, setCustomRpcUrl] = useState(customRPCValue);

	// Sync local states with Redux
	useEffect(() => {
		setCurrentTheme(themeState.prefersSystemSetting ? 'system' : themeState.currentTheme);
		setShowTestnets(testnetsValue);
		setShowCurrency(currencyValue);
		setCustomRpcUrl(customRPCValue);
	}, [themeState, testnetsValue, currencyValue, customRPCValue]);

	// Theme toggle handlers
	const handleSetLightTheme = () => {
		dispatch(setTheme('light'));
		dispatch(setUseSystemSetting(false));
		setCurrentTheme('light');
		document.documentElement.classList.remove('dark');
	};

	const handleSetDarkTheme = () => {
		dispatch(setTheme('dark'));
		dispatch(setUseSystemSetting(false));
		setCurrentTheme('dark');
		document.documentElement.classList.add('dark');
	};

	const handleUseSystemSetting = () => {
		dispatch(setUseSystemSetting(true));
		setCurrentTheme('system');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		document.documentElement.classList.toggle('dark', prefersDark);
	};

	// Testnets toggle
	const handleChangeTestnets = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.checked;
		setShowTestnets(newValue);
		dispatch(testnetsSlice.actions.setShowTestnets(newValue));
	};

	// Currency toggle
	const handleChangeCurrency = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = event.target.checked;
		setShowCurrency(newValue);
		dispatch(currencySlice.actions.updateCurrency(newValue));
	};

	// RPC handling
	const handleCustomRpcChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setCustomRpcUrl(event.target.value);
	};

	const handleApplyCustomRpc = () => {
		dispatch(customRPCSlice.actions.updateCustomRPC(customRpcUrl));
	};

	// Modal visibility
	const [open, setOpen] = useState(false);
	const handleModalToggle = () => {
		const newState = !open;
		setOpen(newState);

		if (newState) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	};

	return (
		<>
			{/* Settings Button */}
			<button onClick={handleModalToggle} className="py-1 bg-transparent hover:text-accent dark:hover:text-accent transition text-sm 3xl:text-lg">
				<span className="hidden md:flex">Settings</span>
				<div className="flex md:hidden items-center justify-center">
					<IoSettingsOutline size={24} className="text-black dark:text-white" />
				</div>
			</button>

			{/* Modal */}
			<PortalModal isOpen={open} onClose={handleModalToggle}>
				<div className="bg-background rounded-lg shadow-lg p-6 w-full md:w-[25vw] md:border md:border-secondary h-screen md:h-auto justify-center items-center m-auto md:max-h-[90vh] overflow-hidden md:overflow-y-auto flex flex-col">
					<h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white text-center -mt-24 md:-mt-0">Settings</h2>

					{/* Theme Toggle Buttons */}
					<div className="mt-6 mb-6 flex flex-col items-center justify-center">
						<h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Theme</h3>
						<div className="flex items-center justify-between gap-2">
							<button
								onClick={handleUseSystemSetting}
								className={`px-4 py-3 rounded-md text-sm font-medium border ${
									currentTheme === 'system'
										? 'bg-accent text-white border-accent'
										: 'bg-transparent text-gray-400 dark:text-gray-400 border-gray-400 hover:border-accent hover:text-accent dark:hover:text-accent'
								} transition`}
							>
								System
							</button>
							<button
								onClick={handleSetLightTheme}
								className={`px-4 py-3 rounded-md text-sm font-medium border ${
									currentTheme === 'light'
										? 'bg-accent text-white border-accent'
										: 'bg-transparent text-gray-400 dark:text-gray-400 border-gray-400 hover:border-accent hover:text-accent dark:hover:text-accent'
								} transition`}
							>
								Light
							</button>
							<button
								onClick={handleSetDarkTheme}
								className={`px-4 py-3 rounded-md text-sm font-medium border ${
									currentTheme === 'dark'
										? 'bg-accent text-white border-accent'
										: 'bg-transparent text-gray-400 dark:text-gray-400 border-gray-400 hover:border-accent hover:text-accent dark:hover:text-accent'
								} transition`}
							>
								Dark
							</button>
						</div>
					</div>

					{/* Testnets Toggle */}
					<div className="mt-6 mb-6 flex flex-col items-center justify-center">
						<h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Show Testnets</h3>
						<label className="flex items-center gap-2">
							<input type="checkbox" checked={showTestnets} onChange={handleChangeTestnets} className="sr-only peer" />
							<div className="relative w-11 h-6 bg-gray-400 rounded-full peer-checked:bg-accent">
								<span
									className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-all ${showTestnets ? 'translate-x-[20px]' : ''}`}
								/>
							</div>
						</label>
					</div>

					{/* Currency Toggle */}
					<div className="mt-6 mb-6 flex flex-col items-center justify-center">
						<h3 className="text-lg font-semibold mb-2 text-black dark:text-white">Show Currency</h3>
						<label className="flex items-center gap-2">
							<input type="checkbox" checked={showCurrency} onChange={handleChangeCurrency} className="sr-only peer" />
							<div className="relative w-11 h-6 bg-gray-400 rounded-full peer-checked:bg-accent">
								<span
									className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-all ${showCurrency ? 'translate-x-[20px]' : ''}`}
								/>
							</div>
						</label>
					</div>

					{/* RPC Selector */}
					<div className="mt-6 mb-6 flex flex-col items-center justify-center">
						<h3 className="text-lg font-semibold mb-2 text-black dark:text-white">RPC Endpoint</h3>
						<div className="relative w-full md:w-[250px] group z-10">
							{/* Toggle Dropdown Button */}
							<button
								onClick={() => setMenuOpen(!menuOpen)}
								className={`flex justify-between items-center w-full px-4 py-3 text-sm font-medium bg-transparent border rounded-lg shadow-lg transition-all hover:text-accent hover:border-accent dark:hover:text-accent dark:hover:border-accent ${
									menuOpen
										? 'border-accent text-accent dark:text-accent dark:border-accent'
										: 'text-gray-400 dark:text-gray-400 border-gray-400 dark:border-gray-400'
								}`}
							>
								<span>{rpcValue === 'infura' ? 'Infura' : rpcValue === 'alchemy' ? 'Alchemy' : rpcValue === 'custom' ? 'Custom' : 'Select RPC'}</span>
								<svg
									className={`w-5 h-5 transform transition-transform ${menuOpen ? 'rotate-180 text-accent' : 'rotate-0'}`}
									xmlns="http://www.w3.org/2000/svg"
									viewBox="0 0 20 20"
									fill="currentColor"
								>
									<path
										fillRule="evenodd"
										d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
										clipRule="evenodd"
									/>
								</svg>
							</button>

							{/* Dropdown Menu */}
							{menuOpen && (
								<div className="absolute z-20 w-full mt-2 bg-white dark:bg-black border border-accent rounded-lg shadow-md text-black dark:text-white">
									{['infura', 'alchemy', 'custom'].map((val) => (
										<button
											key={val}
											onClick={() => {
												dispatch(rpcSlice.actions.updateRPC(val));
												setMenuOpen(false);
											}}
											className={`w-full text-left px-4 py-2 text-sm hover:bg-accent/10 hover:text-accent dark:hover:text-accent transition-all ${
												rpcValue === val ? 'text-accent font-semibold' : ''
											}`}
										>
											{val.charAt(0).toUpperCase() + val.slice(1)}
										</button>
									))}
								</div>
							)}

							{/* Custom Input */}
							<div className="mt-4 flex flex-col gap-2">
								<input
									type="text"
									value={customRpcUrl}
									onChange={handleCustomRpcChange}
									className="w-full px-3 py-3 bg-transparent text-accent dark:text-accent border border-accent hover:border-accent hover:text-accent dark:hover:text-accent rounded-md focus:outline-none focus:ring-0 focus:border-accent disabled:opacity-50 disabled:cursor-not-allowed"
									placeholder="Enter custom RPC URL"
									disabled={rpcValue !== 'custom'}
								/>
								<button
									onClick={handleApplyCustomRpc}
									className="mt-2 px-4 py-3 bg-accent text-white rounded-md hover:bg-accent/80 transition disabled:opacity-50 disabled:cursor-not-allowed"
									disabled={customRpcUrl === customRPCValue || customRpcUrl === ''}
								>
									{customRpcUrl === '' ? 'Enter RPC' : customRpcUrl === customRPCValue ? 'Applied' : 'Apply'}
								</button>
							</div>
						</div>
					</div>

					{/* Close Button */}
					<div className="absolute md:hidden bottom-0 mb-10 left-0 right-0 flex justify-center">
						<button onClick={handleModalToggle} className="py-2 px-4 bg-accent text-white rounded-md transition font-semibold">
							Close
						</button>
					</div>
				</div>
			</PortalModal>
		</>
	);
}
