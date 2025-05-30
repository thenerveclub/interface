'use client';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import NerveGlobalABI from '../../../constants/abi/nerveGlobal.json';
import useBalanceTracker from '../../../hooks/useBalanceTracker';
import { createTriggerSlice } from '../../../state/trigger/createTriggerSlice';
import { CHAINS } from '../../../utils/chains';
import { metaMask } from '../../../utils/connectors/metaMask';
import PortalModal from '../../PortalModal';

interface CreateTaskProps {
	recipientENS: string;
}

export default function CreateTask({ recipientENS }: CreateTaskProps) {
	const { provider } = useWeb3React();
	const router = useRouter();
	const dispatch = useDispatch();

	const account = useSelector((state: { account: string }) => state.account);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const availableChains = useSelector((state: { availableChains: any }) => state.availableChains);

	const balance = useBalanceTracker(provider, account);

	const [open, setOpen] = useState(false);
	const [pendingTx, setPendingTx] = useState(false);
	const [value, setValue] = useState('0.00');
	const [description, setDescription] = useState('');
	const [days, setDays] = useState('0');
	const [hours, setHours] = useState('0');
	const [minutes, setMinutes] = useState('0');
	const [network, setNetwork] = useState('');

	const handleClose = () => {
		if (pendingTx) return;
		setOpen(false);
		document.body.style.overflow = '';
	};

	const handleOpen = () => {
		setOpen(true);
		document.body.style.overflow = 'hidden';
	};

	const handleChangeNetwork = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setNetwork(e.target.value);
	};

	const formatBalance = (val: number | string) => Number(val).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	const setMaxValue = () => setValue(formatBalance(balance));

	const validateInput = (value: string, max: number) => {
		const num = parseInt(value, 10);
		if (isNaN(num) || num < 0) return '0';
		if (num > max) return max.toString();
		return num.toString();
	};

	const convertToSeconds = (d: string, h: string, m: string) => parseInt(d) * 86400 + parseInt(h) * 3600 + parseInt(m) * 60;

	const txValue = ethers.utils.parseEther(value || '0');
	const recipientAddress = '0x';

	const onCreateTask = async () => {
		try {
			setPendingTx(true);
			const signer = provider.getSigner();
			const nerveGlobal = new ethers.Contract(CHAINS[Number(network)]?.contract, NerveGlobalABI, signer);
			const tx = await nerveGlobal.create(recipientAddress, description, convertToSeconds(days, hours, minutes), '0', '0', {
				value: txValue,
			});
			await tx.wait();
			await new Promise((r) => setTimeout(r, 2000));
			dispatch(createTriggerSlice.actions.setCreateTrigger(true));
			handleClose();
		} catch (err) {
			console.error(err);
		} finally {
			setPendingTx(false);
		}
	};

	const handleNetworkSwitch = async () => {
		try {
			await metaMask.activate(Number(network));
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			{/* Desktop Button */}
			<button onClick={handleOpen} className="bg-yellow-500 text-white text-sm px-4 py-2 rounded-md hover:bg-yellow-500 hidden lg:inline-block">
				Create Dare
			</button>

			{/* Mobile Button */}
			<button onClick={handleOpen} className="lg:hidden fixed bottom-32 right-10 z-50 bg-yellow-500 text-white w-14 h-14 rounded-full shadow-lg">
				+
			</button>

			<PortalModal isOpen={open} onClose={handleClose}>
				<div className="bg-background rounded-lg shadow-lg p-6 w-full md:w-[25vw] md:border md:border-secondary h-screen md:h-auto justify-center items-center m-auto md:max-h-[90vh] overflow-hidden md:overflow-y-auto flex flex-col">
					<h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white text-center">Create Task</h2>

					{/* Network Select */}
					<div className="mb-4 w-full">
						<label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">Select Network</label>
						<select className="w-full px-3 py-2 border rounded-md text-sm bg-transparent" value={network} onChange={handleChangeNetwork}>
							<option value="">Select...</option>
							<option value="11155111">Sepolia</option>
							<option value="137">Polygon</option>
						</select>
					</div>

					{/* Entry Amount */}
					<div className="mb-4 w-full">
						<div className="flex justify-between text-sm mb-1">
							<span className="text-gray-700 dark:text-white">Entry Amount</span>
							<span className="text-gray-500 dark:text-gray-300">Balance: {formatBalance(balance)}</span>
						</div>
						<div className="flex gap-2 items-center">
							<input type="text" value={value} onChange={(e) => setValue(e.target.value)} className="w-full px-3 py-2 border rounded-md text-right" />
							<button onClick={setMaxValue} className="text-sm px-2 py-1 bg-gray-100 rounded-md">
								Max
							</button>
						</div>
					</div>

					{/* Time Inputs */}
					<div className="mb-4 w-full">
						<label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">Time (D / H / M)</label>
						<div className="flex gap-2">
							<input
								type="number"
								value={days}
								onChange={(e) => setDays(validateInput(e.target.value, 30))}
								className="w-full px-2 py-1 border rounded-md text-center"
								placeholder="Days"
							/>
							<input
								type="number"
								value={hours}
								onChange={(e) => setHours(validateInput(e.target.value, 23))}
								className="w-full px-2 py-1 border rounded-md text-center"
								placeholder="Hours"
							/>
							<input
								type="number"
								value={minutes}
								onChange={(e) => setMinutes(validateInput(e.target.value, 59))}
								className="w-full px-2 py-1 border rounded-md text-center"
								placeholder="Minutes"
							/>
						</div>
					</div>

					{/* Task Description */}
					<div className="mb-4 w-full">
						<label className="block text-sm font-medium mb-1 text-gray-700 dark:text-white">Task Description</label>
						<textarea
							value={description || ''}
							onChange={(e) => setDescription(e.target.value)}
							rows={3}
							className="w-full px-3 py-2 border rounded-md resize-none"
							placeholder="Do you dare..."
						/>
					</div>

					{/* Create Button */}
					<div className="mt-6 flex justify-center w-full">
						{chainId === Number(network) ? (
							<button
								onClick={onCreateTask}
								disabled={!value || value === '0.00' || pendingTx}
								className="bg-yellow-500 text-white w-[125px] h-10 rounded-md flex items-center justify-center gap-2 disabled:opacity-60"
							>
								{pendingTx ? (
									<>
										<FaSpinner className="animate-spin h-4 w-4" />
										Pending
									</>
								) : (
									'Create Task'
								)}
							</button>
						) : (
							<button
								onClick={handleNetworkSwitch}
								disabled={pendingTx}
								className="w-[150px] h-10 bg-yellow-500 text-black rounded-md flex items-center justify-center gap-2 disabled:opacity-60"
							>
								{pendingTx ? (
									<>
										<FaSpinner className="animate-spin h-4 w-4" />
										Switching...
									</>
								) : (
									'Change Network'
								)}
							</button>
						)}
					</div>

					{/* Close Button Mobile */}
					<div className="absolute md:hidden bottom-0 mb-10 left-0 right-0 flex justify-center">
						<button onClick={handleClose} className="py-2 px-4 bg-accent text-white rounded-md transition font-semibold">
							Close
						</button>
					</div>
				</div>
			</PortalModal>
		</>
	);
}
