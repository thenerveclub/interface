import Link from 'next/link';
import React, { useState } from 'react';
import { IoIosContact } from 'react-icons/io';
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
		<>
			{/* Open Button */}
			<button
				className="hidden md:block border border-gray-500 rounded-md transition duration-300 hover:border-accent px-4 py-2 bg-transparent text-[#999999] dark:text-[#999999] hover:text-accent dark:hover:text-accent transition text-sm 3xl:text-lg"
				onClick={handleOpen}
			>
				Connect
			</button>
			<button className="flex md:hidden bg-transparent px-4 py-2" onClick={handleOpen}>
				<IoIosContact size={24} />
			</button>

			{/* Modal */}
			<PortalModal isOpen={open}>
				<div className="bg-background rounded-lg shadow-lg p-6 w-full md:w-96 md:border md:border-secondary h-screen md:h-auto justify-center items-center m-auto md:max-h-[90vh] overflow-hidden md:overflow-y-auto flex flex-col">
					<h2 className="text-3xl font-bold -mt-12 mb-4 text-gray-900 dark:text-white text-center">Connect</h2>

					{/* Wallet Connect Buttons */}
					<MetaMaskConnect />
					<CoinbaseWalletConnect />
					<WalletConnect />
					<p className="text-xs text-gray-400 text-center mt-4">
						By connecting a wallet, you agree to The Nerve Club&apos;s{' '}
						<Link href="https://www.app.nerve.club/terms" target="_blank" rel="noopener noreferrer" className="text-white font-bold">
							Terms
						</Link>{' '}
						and acknowledge that you have read and understand the{' '}
						<Link href="https://www.app.nerve.club/disclaimer" target="_blank" rel="noopener noreferrer" className="text-white font-bold">
							Disclaimer
						</Link>
						.
					</p>
				</div>

				{/* Close Button */}
				<div className="absolute bottom-5 mb-10 left-0 right-0 flex justify-center">
					<button onClick={handleClose} className="px-4 py-2 bg-accent text-white rounded-md transition">
						Close
					</button>
				</div>
			</PortalModal>
		</>
	);
};

export default ConnectModal;
