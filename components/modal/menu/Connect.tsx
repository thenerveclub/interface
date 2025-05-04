import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import CoinbaseWalletConnect from '../../connectorButtons/CoinbaseWalletConnect';
import MetaMaskConnect from '../../connectorButtons/MetaMaskConnect';
import { WalletConnect } from '../../connectorButtons/WalletConnect';
import PortalModal from '../../PortalModal';

const ConnectModal = () => {
	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		const newState = !open;
		setOpen(newState);

		if (newState) {
			document.body.style.overflow = 'hidden';
		} else {
			document.body.style.overflow = '';
		}
	};

	const handleClose = () => {
		setOpen(false);
		document.body.style.overflow = '';
	};

	return (
		<div className="flex justify-center items-center">
			<button
				className="border border-gray-500 bg-transparent rounded-md transition duration-300 hover:border-accent px-4 py-2 bg-transparent text-[#999999] dark:text-[#999999] hover:text-accent dark:hover:text-accent transition text-sm 3xl:text-lg"
				onClick={handleOpen}
			>
				Connect
			</button>

			<AnimatePresence>
				<PortalModal isOpen={open}>
					<div className="bg-background rounded-lg shadow-lg p-6 w-96 border border-secondary max-h-[90vh] overflow-y-auto">
						<h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white text-center">Connect</h2>

						{/* Divider */}
						<hr className="w-full border-t border-secondary" />

						{/* Wallet Connect Buttons */}
						<MetaMaskConnect />
						<CoinbaseWalletConnect />
						<WalletConnect />
						<p className="text-xs text-gray-400 text-center mt-4">
							By connecting a wallet, you agree to Nerve Global&apos;s
							<a href="https://www.nerveglobal.com/disclaimer" target="_blank" rel="noopener noreferrer" className="text-white font-bold">
								Terms of Service
							</a>
							and acknowledge that you have read and understand the
							<a href="https://www.nerveglobal.com/disclaimer" target="_blank" rel="noopener noreferrer" className="text-white font-bold">
								Disclaimer
							</a>
							.
						</p>
						{/* Close Button */}
						<div className="text-center">
							<button onClick={handleClose} className="px-4 py-2 bg-accent text-white rounded-md transition">
								Close
							</button>
						</div>
					</div>
				</PortalModal>
			</AnimatePresence>
		</div>
	);
};

export default ConnectModal;
