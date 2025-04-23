import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';
import CoinbaseWalletConnect from '../../connectorButtons/CoinbaseWalletConnect';
import MetaMaskConnect from '../../connectorButtons/MetaMaskConnect';
import { WalletConnect } from '../../connectorButtons/WalletConnect';

const ConnectModal = () => {
	const [open, setOpen] = useState(false);

	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<div className="flex justify-center items-center">
			<button
				className="px-6 py-2 border border-gray-500 text-white bg-transparent rounded-md transition duration-300 hover:border-yellow-500"
				onClick={handleOpen}
			>
				Connect
			</button>

			<AnimatePresence>
				{open && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<motion.div
							initial={{ opacity: 0, y: 50 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: 50 }}
							transition={{ duration: 0.4 }}
							className="bg-gray-900 text-white p-6 rounded-lg w-96 shadow-xl relative"
						>
							<h2 className="text-xl font-semibold text-center mb-4">Connect a wallet</h2>
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
							<button className="absolute top-4 right-4 text-gray-400 hover:text-white transition" onClick={handleClose}>
								&times;
							</button>
						</motion.div>
					</div>
				)}
			</AnimatePresence>
		</div>
	);
};

export default ConnectModal;
