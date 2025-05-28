'use client';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import { AiOutlineInfoCircle } from 'react-icons/ai';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import useBalanceTracker from '../../hooks/useBalanceTracker';
import { joinTriggerSlice } from '../../state/trigger/joinTriggerSlice';
import { CHAINS } from '../../utils/chains';
import { metaMask } from '../../utils/connectors/metaMask';
import PortalModal from '../PortalModal';

interface JoinDareProps {
	dareData: any;
}

export default function JoinDare({ dareData }: JoinDareProps) {
	const dispatch = useDispatch();
	const { provider } = useWeb3React();
	const account = useSelector((state: { account: string }) => state.account);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const balance = useBalanceTracker(provider, account);

	const [open, setOpen] = useState(false);
	const [value, setValue] = useState('0.00');
	const [pendingTx, setPendingTx] = useState(false);

	const formatNumber = (val: number | string) =>
		(Number(val) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 4,
		});

	const formatBalance = (val: number | string) =>
		Number(val).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 4,
		});

	const entrance = dareData?.[0]?.task.entranceAmount;
	const chain = dareData?.[0]?.task.chainId;
	const formattedBalance = formatBalance(balance);
	const tokenSymbol = CHAINS[chain]?.nameToken;

	useEffect(() => {
		if (entrance) setValue(formatNumber(entrance));
	}, [entrance]);

	const setMaxValue = () => setValue(formatBalance(balance));
	const setMinValue = () => setValue(formatNumber(entrance));

	const isInputValid = () => {
		const val = parseFloat(value);
		return val >= parseFloat(formatNumber(entrance)) && val <= parseFloat(formattedBalance);
	};

	const isOverBalance = () => parseFloat(value) > parseFloat(formattedBalance);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setValue(e.target.value);
	};

	const handleNetworkChange = async () => {
		try {
			await metaMask.activate(Number(chain));
		} catch (e) {
			console.error(e);
		}
	};

	const onJoin = async () => {
		try {
			setPendingTx(true);
			const signer = provider.getSigner();
			const nerveGlobal = new ethers.Contract(CHAINS[chain]?.contract, NerveGlobalABI, signer);
			const tx = await nerveGlobal.join(dareData[0]?.task?.id, {
				value: ethers.utils.parseEther(value),
			});
			await tx.wait();
			await new Promise((r) => setTimeout(r, 2000));
			dispatch(joinTriggerSlice.actions.setJoinTrigger(true));
			setOpen(false);
		} catch (e) {
			console.error(e);
		} finally {
			setPendingTx(false);
		}
	};

	return (
		<>
			<button
				onClick={() => setOpen(true)}
				className="bg-yellow-500 text-black text-base font-medium px-6 py-2 rounded-md hover:bg-yellow-500 transition"
			>
				Join Task
			</button>

			<PortalModal isOpen={open} onClose={() => setOpen(false)}>
				<div className="bg-background rounded-lg shadow-lg p-6 w-full md:w-[350px] md:border md:border-secondary h-screen md:h-auto justify-center items-center m-auto md:max-h-[90vh] overflow-hidden md:overflow-y-auto flex flex-col">
					<h2 className="text-lg font-semibold text-center mb-4 text-black dark:text-white">Join Dare</h2>

					<div className="flex justify-between items-center w-full mb-1 text-sm text-gray-700 dark:text-gray-300">
						<span className="flex items-center gap-1">
							<span>Amount</span>
							<AiOutlineInfoCircle title={`${entrance} mandatory contribution`} />
						</span>
						<span>Balance: {formattedBalance}</span>
					</div>

					<div className="flex w-full gap-1 items-center mb-2">
						<input
							type="text"
							value={value}
							onChange={handleInputChange}
							className="w-full px-3 py-2 text-right border border-gray-300 dark:border-zinc-700 rounded-md bg-transparent text-black dark:text-white"
						/>
						<span className="text-sm">{tokenSymbol}</span>
						<button onClick={setMaxValue} className="px-2 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 rounded-md">
							Max
						</button>
						<button onClick={setMinValue} className="px-2 py-1 text-sm bg-zinc-100 dark:bg-zinc-800 rounded-md">
							Min
						</button>
					</div>

					{!isInputValid() && (
						<p className="text-red-500 text-sm mb-2 w-full text-left">
							{isOverBalance() ? 'Value exceeds your balance' : `Minimum amount is ${formatNumber(entrance)}`}
						</p>
					)}

					<div className="flex justify-center w-full mt-4">
						{chainId === Number(chain) ? (
							<button
								onClick={onJoin}
								disabled={!isInputValid() || pendingTx}
								className="bg-yellow-500 text-white px-6 py-2 rounded-md w-[125px] flex justify-center items-center gap-2 disabled:opacity-60"
							>
								{pendingTx ? <FaSpinner className="animate-spin h-4 w-4" /> : 'Join'}
							</button>
						) : (
							<button
								onClick={handleNetworkChange}
								disabled={pendingTx}
								className="bg-yellow-500 text-black px-6 py-2 rounded-md w-[150px] flex justify-center items-center gap-2 disabled:opacity-60"
							>
								{pendingTx ? <FaSpinner className="animate-spin h-4 w-4" /> : 'Change Network'}
							</button>
						)}
					</div>
				</div>
			</PortalModal>
		</>
	);
}
