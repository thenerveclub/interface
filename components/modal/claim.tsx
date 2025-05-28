'use client';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import { claimTriggerSlice } from '../../state/trigger/claimTriggerSlice';
import { CHAINS, getAddChainParameters } from '../../utils/chains';
import { metaMask } from '../../utils/connectors/metaMask';
import PortalModal from '../PortalModal';

interface RedeemUserProps {
	dareData: any;
}

export default function RedeemUser({ dareData }: RedeemUserProps) {
	const { provider } = useWeb3React();
	const dispatch = useDispatch();
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	const [pendingTx, setPendingTx] = useState(false);
	const [open, setOpen] = useState(false);

	const network = dareData[0]?.task.chainId;

	const claim = async () => {
		try {
			setPendingTx(true);
			const signer = provider.getSigner();
			const nerveGlobal = new ethers.Contract(CHAINS[network]?.contract, NerveGlobalABI, signer);
			const tx = await nerveGlobal.claim(dareData[0]?.task.id);
			await tx.wait();
			await new Promise((resolve) => setTimeout(resolve, 2000));
			dispatch(claimTriggerSlice.actions.setClaimTrigger(true));
			setOpen(false);
		} catch (error) {
			console.error(error);
		} finally {
			setPendingTx(false);
		}
	};

	const handleNetworkChange = async () => {
		try {
			await metaMask.activate(metaMask ? Number(network) : getAddChainParameters(Number(network)));
		} catch (error) {
			console.error(error);
		}
	};

	const handleModalToggle = () => {
		setOpen(!open);
		document.body.style.overflow = !open ? 'hidden' : '';
	};

	return (
		<>
			<button
				onClick={handleModalToggle}
				className="w-11/12 h-10 text-white text-base font-medium rounded-md bg-yellow-500 hover:bg-yellow-500 transition"
			>
				Claim Reward
			</button>

			<PortalModal isOpen={open} onClose={handleModalToggle}>
				<div className="bg-background rounded-lg shadow-lg p-6 w-full md:w-[25vw] md:border md:border-secondary h-screen md:h-auto justify-center items-center m-auto md:max-h-[90vh] overflow-hidden md:overflow-y-auto flex flex-col">
					<h2 className="text-2xl font-semibold mb-6 text-black dark:text-white text-center">Claim Reward</h2>

					{chainId === Number(network) ? (
						<button
							onClick={claim}
							disabled={pendingTx}
							className="w-full h-10 bg-yellow-500 text-white rounded-md flex items-center justify-center gap-2 disabled:opacity-60"
						>
							{pendingTx ? (
								<>
									<FaSpinner className="animate-spin h-4 w-4" />
									Pending
								</>
							) : (
								'Claim Now'
							)}
						</button>
					) : (
						<button
							onClick={handleNetworkChange}
							disabled={pendingTx}
							className="w-full h-10 bg-yellow-500 text-black rounded-md flex items-center justify-center gap-2 disabled:opacity-60"
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

					{/* Mobile Close */}
					<div className="absolute md:hidden bottom-0 mb-10 left-0 right-0 flex justify-center">
						<button onClick={handleModalToggle} className="px-4 py-3 bg-accent text-white rounded-md transition font-semibold">
							Close
						</button>
					</div>
				</div>
			</PortalModal>
		</>
	);
}
