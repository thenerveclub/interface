'use client';

import { useEffect, useState } from 'react';
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
			{/* Open Button */}
			<button
				onClick={handleModalToggle}
				className="py-1 bg-transparent text-[#999999] dark:text-[#999999] hover:text-accent dark:hover:text-accent transition text-sm 3xl:text-lg"
			>
				Settings
			</button>

			{/* Modal */}
			<PortalModal isOpen={open}>
				<div className="bg-background rounded-lg shadow-lg p-6 w-full md:w-96 md:border md:border-secondary h-screen md:h-auto justify-center items-center m-auto md:max-h-[90vh] overflow-hidden md:overflow-y-auto flex flex-col">
					<h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white text-center">Settings</h2>

					{/* Divider */}
					<hr className="w-full border-t border-secondary" />

					{/* Theme Toggle Buttons */}
					<div className="mt-6 mb-6 flex flex-col items-center justify-center">
						<h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Theme</h3>
						<div className="flex items-center justify-between gap-2">
							<button
								onClick={handleUseSystemSetting}
								className={`px-4 py-2 rounded-md text-sm font-medium border ${
									currentTheme === 'system'
										? 'bg-accent text-white border-accent'
										: 'bg-transparent text-gray-400 dark:text-gray-400 border-gray-400 hover:border-accent hover:text-accent dark:hover:text-accent'
								} transition`}
							>
								System
							</button>
							<button
								onClick={handleSetLightTheme}
								className={`px-4 py-2 rounded-md text-sm font-medium border ${
									currentTheme === 'light'
										? 'bg-accent text-white border-accent'
										: 'bg-transparent text-gray-400 dark:text-gray-400 border-gray-400 hover:border-accent hover:text-accent dark:hover:text-accent'
								} transition`}
							>
								Light
							</button>
							<button
								onClick={handleSetDarkTheme}
								className={`px-4 py-2 rounded-md text-sm font-medium border ${
									currentTheme === 'dark'
										? 'bg-accent text-white border-accent'
										: 'bg-transparent text-gray-400 dark:text-gray-400 border-gray-400 hover:border-accent hover:text-accent dark:hover:text-accent'
								} transition`}
							>
								Dark
							</button>
						</div>
					</div>

					{/* Divider */}
					<hr className="w-full border-t border-secondary" />

					{/* Testnets Toggle */}
					<div className="mt-6 mb-6 flex flex-col items-center justify-center">
						<h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Show Testnets</h3>
						<label className="flex items-center gap-2">
							<input type="checkbox" checked={showTestnets} onChange={handleChangeTestnets} className="toggle-input" />
							<span className="text-gray-800 dark:text-gray-200">Enable Testnets</span>
						</label>
					</div>

					{/* Divider */}
					<hr className="w-full border-t border-secondary" />

					{/* Currency Toggle */}
					<div className="mt-6 mb-6 flex flex-col items-center justify-center">
						<h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">Show Currency</h3>
						<label className="flex items-center gap-2">
							<input type="checkbox" checked={showCurrency} onChange={handleChangeCurrency} className="toggle-input" />
							<span className="text-gray-800 dark:text-gray-200">Enable Currency</span>
						</label>
					</div>

					{/* Divider */}
					<hr className="w-full border-t border-secondary" />

					{/* RPC Selector */}
					<div className="mt-6 mb-6 flex flex-col items-center justify-center">
						<h3 className="text-lg font-semibold mb-2 text-gray-800 dark:text-gray-200">RPC Endpoint</h3>
						<select
							value={rpcValue}
							onChange={(e) => dispatch(rpcSlice.actions.updateRPC(e.target.value))}
							className="bg-transparent text-gray-400 dark:text-gray-400 border-gray-400 hover:border-accent hover:text-accent dark:hover:text-accent rounded-md px-3 py-2 focus:outline-none focus:ring-0 focus:border-accent"
						>
							<option value="infura">Infura</option>
							<option value="alchemy">Alchemy</option>
							<option value="custom">Custom</option>
						</select>
						{rpcValue === 'custom' && (
							<div className="mt-4">
								<input
									type="text"
									value={customRpcUrl}
									onChange={handleCustomRpcChange}
									className="w-full px-3 py-2 bg-transparent text-gray-400 dark:text-gray-400 border-gray-400 hover:border-accent hover:text-accent dark:hover:text-accent rounded-md focus:outline-none focus:ring-0 focus:border-accent"
									placeholder="Enter custom RPC URL"
								/>
								<button onClick={handleApplyCustomRpc} className="mt-2 px-4 py-2 bg-accent text-white rounded-md hover:bg-accent/80 transition">
									Apply
								</button>
							</div>
						)}
					</div>

					{/* Close Button */}
					<div className="text-center">
						<button onClick={handleModalToggle} className="px-4 py-2 bg-accent text-white rounded-md transition">
							Close
						</button>
					</div>
				</div>
			</PortalModal>
		</>
	);
}
