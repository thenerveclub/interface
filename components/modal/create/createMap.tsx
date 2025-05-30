'use client';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NerveGlobalABI from '../../../constants/abi/nerveGlobal.json';
import usePlayerDataSearchList from '../../../hooks/searchData/usePlayerDataSearchList';
import useBalanceTracker from '../../../hooks/useBalanceTracker';
import { createTriggerSlice } from '../../../state/trigger/createTriggerSlice';
import { CHAINS } from '../../../utils/chains';
import { metaMask } from '../../../utils/connectors/metaMask';
import PortalModal from '../../PortalModal';
import ConnectModal from '../menu/ConnectModal';

export default function CreateMapDare({ modalCoords, onClose }: { modalCoords: any; onClose: () => void }) {
	const { account, provider } = useWeb3React();
	const dispatch = useDispatch();
	const balance = useBalanceTracker(provider, account);
	const chainId = useSelector((state: any) => state.chainId);

	const [searchValue, setSearchValue] = useState('');
	const playerSearchList = usePlayerDataSearchList(searchValue);
	const [pendingTx, setPendingTx] = useState(false);
	const [value, setValue] = useState('0.00');
	const [description, setDescription] = useState('');
	const [days, setDays] = useState('0');
	const [hours, setHours] = useState('0');
	const [minutes, setMinutes] = useState('0');
	const [network, setNetwork] = useState('');
	const [showModal, setShowModal] = useState(true);
	const recipientAddress = '0x52B28292846c59dA23114496d6e6BfC875f54FF5';

	const closeModal = () => {
		if (pendingTx) return;
		setShowModal(false);
		setTimeout(onClose, 300);
	};

	const formatBalance = (val: any) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	const setMaxValue = () => {
		setValue(formatBalance(balance));
	};

	const validateInput = (val: string, max: number) => {
		const n = parseInt(val, 10);
		if (isNaN(n) || n < 0) return '0';
		return Math.min(n, max).toString();
	};

	const convertToSeconds = (d: string, h: string, m: string) => parseInt(d) * 86400 + parseInt(h) * 3600 + parseInt(m) * 60;

	const onCreateTask = async () => {
		try {
			setPendingTx(true);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(CHAINS[network]?.contract, NerveGlobalABI, signer);
			const tx = await contract.create(
				recipientAddress,
				description,
				convertToSeconds(days, hours, minutes),
				modalCoords.lat.toString(),
				modalCoords.lng.toString(),
				{ value: ethers.utils.parseEther(value || '0') }
			);
			await tx.wait();
			await new Promise((res) => setTimeout(res, 2000));
			dispatch(createTriggerSlice.actions.setCreateTrigger(true));
			closeModal();
			setPendingTx(false);
		} catch (err) {
			console.error(err);
			setPendingTx(false);
		}
	};

	const handleNetworkChange = async () => {
		try {
			await metaMask.activate(Number(network));
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<PortalModal isOpen={showModal} onClose={closeModal}>
			<div
				onClick={(e) => e.stopPropagation()}
				className="bg-background rounded-lg shadow-lg p-6 w-full md:w-[25vw] md:border md:border-secondary h-screen md:h-auto justify-center items-center m-auto md:max-h-[90vh] overflow-hidden md:overflow-y-auto flex flex-col"
			>
				<h2 className="text-3xl font-bold mb-4 text-black dark:text-white text-center -mt-24 md:-mt-0">Create Task</h2>

				<div className="mb-4 w-full">
					<label className="flex mb-1 text-sm font-medium text-black dark:text-white w-full">Player</label>
					<input
						type="text"
						value={searchValue}
						onChange={(e) => setSearchValue(e.target.value)}
						className="w-full px-3 py-3 border border-gray-400 rounded-lg bg-white dark:bg-black text-sm focus:outline-none focus:ring-accent focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-400 placeholder:text-sm text-black dark:text-white"
						placeholder="Search player"
					/>
					{searchValue && (
						<ul className="mt-2 max-h-full border border-accent rounded-lg bg-white dark:bg-black text-sm">
							{playerSearchList.map((player) => (
								<li
									key={player.id}
									className="px-3 py-3 cursor-pointer text-black dark:text-white hover:text-accent dark:hover:text-accent"
									onClick={() => {
										setSearchValue(player.userName);
									}}
								>
									{player.userName}
								</li>
							))}
						</ul>
					)}
				</div>

				<div className="mb-4 w-full">
					<label className="flex mb-1 text-sm font-medium text-black dark:text-white w-full">Select Network</label>
					<select
						value={network}
						onChange={(e) => setNetwork(e.target.value)}
						className="w-full px-3 py-3 border border-gray-400 rounded-lg bg-white dark:bg-black text-sm focus:outline-none focus:ring-accent focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-400 placeholder:text-sm text-black dark:text-white"
					>
						<option value="" disabled>
							Select a chain
						</option>
						{Object.entries(CHAINS).map(([id, chain]) => (
							<option key={id} value={id}>
								{chain.name}
							</option>
						))}
					</select>
				</div>

				<div className="mb-4 w-full">
					<label className="flex mb-1 text-sm font-medium text-black dark:text-white w-full">
						<div className="flex items-center justify-between w-full">
							<span>Entry Amount</span>
							<span>Balance: {formatBalance(balance)}</span>
						</div>
					</label>
					<div className="flex items-center">
						<input
							type="text"
							value={value}
							onChange={(e) => setValue(e.target.value)}
							className="flex-1 px-3 py-3 border border-gray-400 rounded-l-lg bg-white dark:bg-black text-sm text-right focus:outline-none focus:ring-accent focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-400 placeholder:text-sm text-black dark:text-white"
						/>
						<button type="button" onClick={setMaxValue} className="text-black dark:text-white bg-accent text-sm font-semibold px-3 py-3 rounded-r-lg">
							Max
						</button>
					</div>
				</div>

				<div className="mb-4 w-full">
					<label className="flex items-center justify-between mb-1 text-sm font-medium text-black dark:text-white w-full">
						Duration
						<span className="text-xs text-gray-400">Max 30 days</span>
					</label>
					<div className="grid grid-cols-3 gap-2">
						<input
							type="number"
							placeholder="Days"
							value={days}
							onChange={(e) => setDays(validateInput(e.target.value, 30))}
							className="px-3 py-3 border border-gray-400 rounded-l-lg bg-white dark:bg-black text-sm text-right focus:outline-none focus:ring-accent focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-400 placeholder:text-sm text-black dark:text-white"
						/>
						<input
							type="number"
							placeholder="Hours"
							value={hours}
							onChange={(e) => setHours(validateInput(e.target.value, 23))}
							className="px-3 py-3 border border-gray-400 bg-white dark:bg-black text-sm text-right focus:outline-none focus:ring-accent focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-400 placeholder:text-sm text-black dark:text-white"
						/>
						<input
							type="number"
							placeholder="Minutes"
							value={minutes}
							onChange={(e) => setMinutes(validateInput(e.target.value, 59))}
							className="px-3 py-3 border border-gray-400 rounded-r-lg bg-white dark:bg-black text-sm text-right focus:outline-none focus:ring-accent focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-400 placeholder:text-sm text-black dark:text-white"
						/>
					</div>
				</div>

				<div className="mb-4 w-full">
					<label className="flex mb-1 text-sm font-medium text-black dark:text-white w-full">Description</label>
					<textarea
						rows={3}
						maxLength={100}
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						className="w-full px-3 py-3 border border-gray-400 rounded-lg bg-white dark:bg-black text-sm focus:outline-none focus:ring-accent focus:border-transparent placeholder:text-gray-400 dark:placeholder:text-gray-400 placeholder:text-sm text-black dark:text-white"
						placeholder="Do you dare..."
					/>
					<div className="text-right text-xs text-gray-400">{description.length}/100</div>
				</div>

				<div className="mb-4 w-full text-black dark:text-white">
					<label className="flex mb-1 text-sm font-medium">Location</label>
					<div className="mb-2 text-sm">Lat: {modalCoords.lat}</div>
					<div className="mb-4 text-sm">Lng: {modalCoords.lng}</div>
				</div>

				<div className="flex justify-center">
					{account ? (
						chainId === Number(network) ? (
							<button
								onClick={onCreateTask}
								disabled={pendingTx || !value || value === '0'}
								className={`px-4 py-3 rounded-lg text-white font-semibold ${
									pendingTx ? 'bg-gray-400 cursor-not-allowed' : 'bg-accent hover:bg-accent/80'
								}`}
							>
								{pendingTx ? 'Pending...' : 'Create Task'}
							</button>
						) : (
							<button onClick={handleNetworkChange} className="px-4 py-3 rounded-lg bg-accent hover:bg-accent/80 text-white font-semibold">
								Change Network
							</button>
						)
					) : (
						<ConnectModal />
					)}
				</div>
			</div>

			{/* Mobile Close Button */}
			<div className="absolute md:hidden bottom-5 mb-10 left-0 right-0 flex justify-center w-fit m-auto">
				<button onClick={closeModal} className="py-2 px-4 bg-accent text-white rounded-md transition font-semibold">
					Close
				</button>
			</div>
		</PortalModal>
	);
}
