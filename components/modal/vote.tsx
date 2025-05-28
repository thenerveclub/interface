'use client';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import PortalModal from '../../components/PortalModal';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import { voteTriggerSlice } from '../../state/trigger/voteTriggerSlice';
import { CHAINS } from '../../utils/chains';
import { metaMask } from '../../utils/connectors/metaMask';

interface VoteTaskProps {
	dareData: any;
}

export default function VoteTask({ dareData }: VoteTaskProps) {
	const { provider } = useWeb3React();
	const dispatch = useDispatch();
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	const [open, setOpen] = useState(false);
	const [pendingTx, setPendingTx] = useState(false);

	const chain = dareData?.[0]?.task?.chainId;

	const handleOpen = () => {
		setOpen(true);
		document.body.style.overflow = 'hidden';
	};

	const handleClose = () => {
		if (pendingTx) return;
		setOpen(false);
		document.body.style.overflow = '';
	};

	const vote = async (voteValue: boolean) => {
		try {
			setPendingTx(true);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(CHAINS[chain]?.contract, NerveGlobalABI, signer);
			const tx = await contract.vote(dareData[0]?.task?.id, voteValue);
			await tx.wait();
			await new Promise((r) => setTimeout(r, 2000));
			dispatch(voteTriggerSlice.actions.setVoteTrigger(true));
			handleClose();
		} catch (err) {
			console.error(err);
		} finally {
			setPendingTx(false);
		}
	};

	const handleNetworkChange = async () => {
		try {
			await metaMask.activate(Number(chain));
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<>
			{/* Trigger button */}
			<button onClick={handleOpen} className="bg-yellow-500 text-white px-4 py-2 text-sm rounded-md hover:bg-yellow-500 transition">
				Vote Task
			</button>

			{/* PortalModal */}
			<PortalModal isOpen={open} onClose={handleClose}>
				<div className="bg-background rounded-lg shadow-lg p-6 w-full md:w-[25vw] md:border md:border-secondary h-screen md:h-auto justify-center items-center m-auto md:max-h-[90vh] overflow-hidden md:overflow-y-auto flex flex-col">
					<h2 className="text-3xl font-bold mb-4 text-gray-900 dark:text-white text-center">Vote Task</h2>

					{chainId !== Number(chain) ? (
						<div className="flex flex-col items-center gap-4">
							<p className="text-center text-sm text-gray-700 dark:text-gray-300">Please switch to the correct network to vote on this task.</p>
							<button
								onClick={handleNetworkChange}
								disabled={pendingTx}
								className="w-[150px] h-10 text-base font-normal rounded-md bg-yellow-500 text-black flex items-center justify-center gap-2 disabled:opacity-60"
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
						</div>
					) : (
						<div className="flex justify-evenly items-center mt-4 w-full">
							<button
								onClick={() => vote(true)}
								disabled={pendingTx}
								className="w-[125px] h-10 text-white bg-yellow-500 rounded-md flex items-center justify-center gap-2 disabled:opacity-60"
							>
								{pendingTx ? (
									<>
										<FaSpinner className="animate-spin h-4 w-4" />
										Pending
									</>
								) : (
									'True'
								)}
							</button>
							<button
								onClick={() => vote(false)}
								disabled={pendingTx}
								className="w-[125px] h-10 text-white bg-yellow-500 rounded-md flex items-center justify-center gap-2 disabled:opacity-60"
							>
								{pendingTx ? (
									<>
										<FaSpinner className="animate-spin h-4 w-4" />
										Pending
									</>
								) : (
									'False'
								)}
							</button>
						</div>
					)}

					{/* Close button for mobile */}
					<div className="absolute md:hidden bottom-0 mb-10 left-0 right-0 flex justify-center">
						<button onClick={handleClose} className="px-4 py-3 bg-accent text-white rounded-md transition font-semibold">
							Close
						</button>
					</div>
				</div>
			</PortalModal>
		</>
	);
}
