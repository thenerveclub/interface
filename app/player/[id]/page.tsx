'use client';

import Image from 'next/image';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FiExternalLink } from 'react-icons/fi';
import { IoCopyOutline } from 'react-icons/io5';
import { useSelector } from 'react-redux';

import usePlayerData from '../../../hooks/playerData/usePlayerData';
import useENSAvatar from '../../../hooks/useENSAvatar';
import useENSName from '../../../hooks/useENSName';

import LoadingScreen from '../../../components/LoadingScreen';
import QRCodeModal from '../../../components/modal/QRCodeModal';
import CreateAtPlayer from '../../../components/modal/create/createAtPlayer';
import PlayerDares from './components/PlayerDares';
import PlayerStatistics from './components/PlayerStatistics';

export default function PlayerPage({ params }: { params: { id: string } }) {
	const router = useRouter();
	const pathname = usePathname();
	const id = params.id;

	const account = useSelector((state: any) => state.account);
	const currencyPrice = useSelector((state: any) => state.currencyPrice);
	const checksumAccount = account?.toLowerCase();

	const [qrModalOpen, setQrModalOpen] = useState(false);
	const qrCodeUrl = `http://localhost:3003/player/${id}`;

	const { ensName, address, error } = useENSName(id?.toLowerCase());
	const { ensAvatar } = useENSAvatar(ensName);
	const { playerData, isLoading } = usePlayerData(address, currencyPrice);

	const [copied, setCopied] = useState(false);
	function handleCopyAddress() {
		navigator.clipboard.writeText(address);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	}

	if (isLoading) return <LoadingScreen />;

	return (
		<div className="mt-32 mx-auto w-[90%] max-w-6xl px-4 sm:mt-20 flex flex-col">
			{/* Player Header */}
			<div className="relative flex flex-col sm:flex-row items-center sm:items-start w-full text-center sm:text-left">
				{/* Blurred Background */}
				<div
					className="absolute top-0 left-0 w-full h-full bg-cover bg-center blur-md opacity-50 rounded-xl -z-10"
					style={{ backgroundImage: `url(https://euc.li/${ensName})` }}
				></div>

				{/* Avatar + Name */}
				{ensName && <Image src={`https://euc.li/${ensName}`} alt="ENS Avatar" width={100} height={100} className="rounded-lg z-10" />}
				<p className="text-2xl font-semibold mt-4 sm:mt-0 sm:ml-4 z-10">
					{ensName || (address && `${address.substring(0, 6)}...${address.substring(address.length - 4)}`)}
				</p>
			</div>

			{/* Actions */}
			<div className="flex flex-col sm:flex-row items-center sm:justify-start gap-4 mt-6">
				<button onClick={() => setQrModalOpen(true)} className="px-4 py-2 text-sm rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
					Show QR Code
				</button>

				<div className="flex items-center text-sm text-gray-500 gap-3">
					<p className="select-none">
						({address?.substring(0, 6)}...{address?.substring(address?.length - 4)})
					</p>
					<button onClick={handleCopyAddress} title={copied ? 'Copied!' : 'Copy Address'}>
						<IoCopyOutline className="w-4 h-4 hover:text-blue-600 transition" />
					</button>
					<a href={`https://etherscan.io/address/${address}#asset-multichain`} target="_blank" rel="noopener noreferrer" title="View on Explorer">
						<FiExternalLink className="w-4 h-4 hover:text-blue-600 transition" />
					</a>
				</div>
			</div>

			{/* Player Stats */}
			<div className="mt-6">
				<PlayerStatistics playerData={playerData} checksumAddress={address} />
			</div>

			{/* Player Dares */}
			<div className="mt-10">
				<PlayerDares recipientAddress={address} recipientENS={ensName} error={error} />
			</div>

			{/* Create Dare */}
			{!error && account && checksumAccount !== address && (
				<div className="mt-6 block sm:hidden">
					<CreateAtPlayer recipientAddress={address} recipientENS={ensName} />
				</div>
			)}

			{/* QR Code Modal */}
			<QRCodeModal open={qrModalOpen} handleClose={() => setQrModalOpen(false)} qrCodeUrl={qrCodeUrl} />
		</div>
	);
}
