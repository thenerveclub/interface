'use client';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NerveGlobalABI from '../../../constants/abi/nerveGlobal.json';
import useBalanceTracker from '../../../hooks/useBalanceTracker';
import { createTriggerSlice } from '../../../state/trigger/createTriggerSlice';
import { CHAINS, getAddChainParameters } from '../../../utils/chains';
import { metaMask } from '../../../utils/connectors/metaMask';
import PortalModal from '../../PortalModal';

interface CreateAtPlayerProps {
	recipientAddress: any;
	recipientENS: any;
}

export default function CreateAtPlayer({ recipientAddress, recipientENS }: CreateAtPlayerProps) {
	const { provider } = useWeb3React();
	const dispatch = useDispatch();
	const router = useRouter();

	const account = useSelector((state: any) => state.account);
	const chainId = useSelector((state: any) => state.chainId);
	const availableChains = useSelector((state: any) => state.availableChains);

	const balance = useBalanceTracker(provider, account);

	const [open, setOpen] = useState(false);
	const [pendingTx, setPendingTx] = useState(false);
	const [value, setValue] = useState('0.00');
	const [description, setDescription] = useState('');
	const [isMax, setIsMax] = useState(false);
	const [days, setDays] = useState('0');
	const [hours, setHours] = useState('0');
	const [minutes, setMinutes] = useState('0');
	const [network, setNetwork] = useState('');

	const validateInput = (value: string, max: number) => {
		const num = parseInt(value, 10);
		if (isNaN(num) || num < 0) return '0';
		if (num > max) return max.toString();
		return num.toString();
	};

	const convertToSeconds = (d: string, h: string, m: string) => parseInt(d) * 86400 + parseInt(h) * 3600 + parseInt(m) * 60;

	const formatBalance = (val: any) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	const txValue = ethers.utils.parseEther(value || '0');

	const setMaxValue = () => {
		setValue(formatBalance(balance));
		setIsMax(true);
	};

	const handleNetworkChange = async () => {
		if (!network) return;
		try {
			await metaMask.activate(getAddChainParameters(Number(network)));
		} catch (error) {
			console.error(error);
		}
	};

	const handleCreate = async () => {
		if (!provider || !network || !value) return;
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract(CHAINS[network]?.contract, NerveGlobalABI, signer);
		try {
			setPendingTx(true);
			const tx = await nerveGlobal.create(recipientAddress, description, convertToSeconds(days, hours, minutes), '0', '0', { value: txValue });
			await tx.wait();
			dispatch(createTriggerSlice.actions.setCreateTrigger(true));
			setOpen(false);
			setPendingTx(false);
		} catch (err) {
			console.error(err);
			setPendingTx(false);
		}
	};

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="hidden md:flex bg-accent text-black dark:text-white px-3 py-3 rounded-md text-sm justify-center items-center"
			>
				Create Dare
			</button>

			{/* SpeedDial for mobile */}
			<button
				onClick={() => setOpen(true)}
				className="md:hidden fixed bottom-28 right-5 z-50 bg-accent p-4 rounded-full shadow-lg hover:bg-accent/90 transition"
			>
				+
			</button>

			<PortalModal isOpen={open} onClose={() => !pendingTx && setOpen(false)}>
				<div className="bg-background border border-secondary rounded-xl w-full max-w-md p-6 max-h-[90vh] overflow-y-auto">
					<h2 className="text-xl font-bold mb-4 text-center text-gray-900 dark:text-white">Create Task</h2>

					{/* Network Select */}
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Network</label>
						<select
							value={network}
							onChange={(e) => setNetwork(e.target.value)}
							className="w-full rounded-md border border-secondary bg-transparent text-sm px-3 py-2 text-gray-900 dark:text-white focus:outline-none"
						>
							<option value="" disabled>
								Select network
							</option>
							{Object.entries(CHAINS).map(([chainId, chainInfo]: any) => (
								<option key={chainId} value={chainId}>
									{chainInfo.name}
								</option>
							))}
						</select>
					</div>

					{/* Value Input */}
					<div className="mb-4">
						<div className="flex justify-between text-sm mb-1">
							<span className="text-gray-700 dark:text-gray-300">Entry Amount</span>
							<span className="text-gray-500">Balance: {formatBalance(balance)}</span>
						</div>
						<div className="flex items-center">
							<input
								type="text"
								value={value}
								onChange={(e) => setValue(e.target.value || '0.00')}
								className="flex-1 rounded-md border border-secondary bg-transparent text-right px-3 py-2 text-sm text-gray-900 dark:text-white"
								placeholder="0.00"
							/>
							<button
								onClick={setMaxValue}
								className="ml-2 px-3 py-2 bg-gray-200 dark:bg-gray-800 rounded-md text-sm text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700"
							>
								Max
							</button>
						</div>
					</div>

					{/* Time Selection */}
					<div className="mb-4">
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Duration</label>
						<div className="flex gap-2">
							<input
								type="number"
								value={days}
								onChange={(e) => setDays(validateInput(e.target.value, 30))}
								className="w-1/3 rounded-md border border-secondary bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white"
								placeholder="Days"
							/>
							<input
								type="number"
								value={hours}
								onChange={(e) => setHours(validateInput(e.target.value, 23))}
								className="w-1/3 rounded-md border border-secondary bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white"
								placeholder="Hours"
							/>
							<input
								type="number"
								value={minutes}
								onChange={(e) => setMinutes(validateInput(e.target.value, 59))}
								className="w-1/3 rounded-md border border-secondary bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white"
								placeholder="Minutes"
							/>
						</div>
					</div>

					{/* Description */}
					<div className="mb-6">
						<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Task Description</label>
						<textarea
							rows={3}
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							className="w-full rounded-md border border-secondary bg-transparent px-3 py-2 text-sm text-gray-900 dark:text-white"
							placeholder="Do you dare..."
						></textarea>
					</div>

					{/* CTA Buttons */}
					{chainId === Number(network) ? (
						<button
							disabled={pendingTx || value === '0.00' || value === '0'}
							onClick={handleCreate}
							className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition disabled:opacity-50"
						>
							{pendingTx ? 'Pending...' : 'Create Task'}
						</button>
					) : (
						<button
							onClick={handleNetworkChange}
							className="w-full py-3 bg-yellow-500 text-white font-semibold rounded-lg hover:bg-yellow-600 transition"
						>
							Change Network
						</button>
					)}
				</div>
			</PortalModal>
		</>
	);
}
