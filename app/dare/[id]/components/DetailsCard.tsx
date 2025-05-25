'use client';

import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { CHAINS } from '../../../../utils/chains';

interface DetailsCardProps {
	dareData: any;
	player: string;
}

const DetailsCard: React.FC<DetailsCardProps> = ({ dareData, player }) => {
	const router = useRouter();

	// Redux
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const currencyPrice = useSelector((state: { currencyPrice: number }) => state.currencyPrice);

	if (!dareData) return null;

	const handleClickUser = (user: string) => () => {
		router.push(`/player/${user}`);
	};

	const formatCrypto = (value: string | number) =>
		(Number(value) / 1e18).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 4 });

	const formatNumber = (value: string | number) =>
		(Number(value) / 1e18).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

	const task = dareData[0]?.task;
	const tokenName = CHAINS[task?.chainId]?.nameToken?.toLowerCase();

	return (
		<div className="flex flex-col w-full bg-background border border-secondary rounded-xl backdrop-blur-md">
			{/* Header */}
			<div className="flex flex-col">
				<div className="text-base font-medium px-4 py-3">Details</div>
				<hr className="border-b border-secondary w-full" />
			</div>

			{/* Content */}
			<div className="flex flex-col w-full px-4 py-4 text-sm text-white gap-8">
				{/* Player Row */}
				<div className="flex flex-row justify-start gap-8 flex-wrap">
					<div className="flex flex-col">
						<p className="text-white/75">Player</p>
						<p
							onClick={handleClickUser(player)}
							className="text-warning-main hover:underline cursor-pointer w-fit pt-2"
						>
							{player?.includes('.eth') ? player : `${player?.slice(0, 6)}...${player?.slice(-4)}`}
						</p>
					</div>

					<div className="flex flex-col">
						<p className="text-white/75">Total Participants</p>
						<p className="pt-2">{task?.participants}</p>
					</div>
				</div>

				{/* Amount Row */}
				<div className="flex flex-row justify-start gap-8 flex-wrap">
					{currencyValue === false ? (
						<>
							<div className="flex flex-col">
								<p className="text-white/75">Entry Amount</p>
								<p className="pt-2">
									{formatCrypto(task?.entranceAmount)} {CHAINS[task?.chainId]?.nameToken}
								</p>
							</div>
							<div className="flex flex-col">
								<p className="text-white/75">Total Amount</p>
								<p className="pt-2">
									{formatCrypto(task?.amount)} {CHAINS[task?.chainId]?.nameToken}
								</p>
							</div>
						</>
					) : (
						<>
							<div className="flex flex-col">
								<p className="text-white/75">Entry Amount</p>
								<p className="pt-2">
									${formatNumber(task?.entranceAmount * currencyPrice[tokenName])}
								</p>
							</div>
							<div className="flex flex-col">
								<p className="text-white/75">Total Amount</p>
								<p className="pt-2">${formatNumber(task?.amount * currencyPrice[tokenName])}</p>
							</div>
						</>
					)}
				</div>

				{/* Task ID + Network */}
				<div className="flex flex-row justify-start gap-8 flex-wrap">
					<div className="flex flex-col">
						<p className="text-white/75">Task ID</p>
						<p className="pt-2">{task?.id}</p>
					</div>
					<div className="flex flex-col">
						<p className="text-white/75">Network</p>
						<p className="pt-2 capitalize">{CHAINS[task?.chainId]?.name}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default DetailsCard;
