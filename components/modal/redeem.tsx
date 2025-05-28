'use client';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import { redeemTriggerSlice } from '../../state/trigger/redeemTriggerSlice';
import { CHAINS } from '../../utils/chains';
import { metaMask } from '../../utils/connectors/metaMask';
import PortalModal from '../PortalModal';

interface RedeemUserProps {
	dareData: any;
}

export default function RedeemRecipient({ dareData }: RedeemUserProps) {
	const { provider } = useWeb3React();
	const dispatch = useDispatch();
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	const [open, setOpen] = useState(false);
	const [pendingTx, setPendingTx] = useState(false);

	const network = dareData[0]?.task?.chainId;

	const handleOpen = () => {
		setOpen(true);
		document.body.style.overflow = 'hidden';
	};

	const handleClose = () => {
		if (pendingTx) return;
		setOpen(false);
		document.body.style.overflow = '';
	};

	const redeem = async () => {
		try {
			setPendingTx(true);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(CHAINS[network]?.contract, NerveGlobalABI, signer);
			const tx = await contract.redeem(dareData[0]?.task?.id);
			await tx.wait();
			await new Promise((resolve) => setTimeout(resolve, 2000));
			dispatch(redeemTriggerSlice.actions.setRedeemTrigger(true));
			handleClose();
		} catch (err) {
			console.error(err);
		} finally {
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
		<>
			{/* Trigger Button */}
			<div className="w-full flex justify-center">
				<button
					onClick={handleOpen}
					className="w-11/12 h-10 text-white text-base font-medium rounded-md bg-yellow-500 hover:bg-yellow-500 transition"
				>
					Redeem Recipient
				</button>
			</div>

			{/* Modal */}
			<PortalModal isOpen={open} onClose={handleClose}>
				<div className="bg-background rounded-lg shadow-lg p-6 w-full md:w-[25vw] md:border md:border-secondary h-screen md:h-auto justify-center items-center m-auto md:max-h-[90vh] overflow-hidden md:overflow-y-auto flex flex-col">
					<h2 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white text-center">Redeem Task</h2>

					{chainId === Number(network) ? (
						<button
							onClick={redeem}
							disabled={pendingTx}
							className="w-[150px] h-10 bg-yellow-500 text-white rounded-md flex items-center justify-center gap-2 disabled:opacity-60"
						>
							{pendingTx ? (
								<>
									<FaSpinner className="animate-spin h-4 w-4" />
									Pending
								</>
							) : (
								'Redeem Recipient'
							)}
						</button>
					) : (
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
					)}

					{/* Close Button on mobile */}
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
