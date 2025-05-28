'use client';

import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { useDispatch, useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import { proveTriggerSlice } from '../../state/trigger/proveTriggerSlice';
import { CHAINS } from '../../utils/chains';
import { metaMask } from '../../utils/connectors/metaMask';
import PortalModal from '../PortalModal';

interface ProveDareProps {
	dareData: any;
}

export default function ProveDare({ dareData }: ProveDareProps) {
	const { provider } = useWeb3React();
	const dispatch = useDispatch();
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	const [open, setOpen] = useState(false);
	const [pendingTx, setPendingTx] = useState(false);
	const [proveLink, setProveLink] = useState('');

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

	const handleNetworkChange = async () => {
		try {
			await metaMask.activate(Number(chain));
		} catch (err) {
			console.error(err);
		}
	};

	const proveFunction = async () => {
		try {
			setPendingTx(true);
			const signer = provider.getSigner();
			const contract = new ethers.Contract(CHAINS[chain]?.contract, NerveGlobalABI, signer);
			const tx = await contract.prove(dareData[0]?.task?.id, proveLink);
			await tx.wait();
			await new Promise((r) => setTimeout(r, 2000));
			dispatch(proveTriggerSlice.actions.setProveTrigger(true));
			handleClose();
		} catch (err) {
			console.error(err);
		} finally {
			setPendingTx(false);
		}
	};

	return (
		<>
			<button onClick={handleOpen} className="bg-yellow-500 text-white px-5 py-2 text-sm font-medium rounded-md hover:bg-yellow-500 transition">
				Prove Dare
			</button>

			<PortalModal isOpen={open} onClose={handleClose}>
				<div className="bg-white dark:bg-zinc-900 text-black dark:text-white w-full md:w-[350px] border border-zinc-400 rounded-xl p-6 m-auto flex flex-col justify-center items-center">
					<h2 className="text-lg font-semibold text-center mb-6">Prove Dare</h2>

					<div className="w-full mb-6">
						<input
							type="text"
							value={proveLink}
							onChange={(e) => setProveLink(e.target.value)}
							className="w-full px-3 py-2 border border-gray-300 rounded-md bg-transparent text-sm"
							placeholder="Enter proof link"
						/>
					</div>

					<div className="flex justify-center w-full">
						{chainId === Number(chain) ? (
							<button
								onClick={proveFunction}
								disabled={pendingTx}
								className="w-[150px] h-10 bg-yellow-500 text-black rounded-md flex items-center justify-center gap-2 disabled:opacity-60"
							>
								{pendingTx ? (
									<>
										<FaSpinner className="animate-spin h-4 w-4" />
										Pending
									</>
								) : (
									'Prove Dare'
								)}
							</button>
						) : (
							<button
								onClick={handleNetworkChange}
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
				</div>
			</PortalModal>
		</>
	);
}
