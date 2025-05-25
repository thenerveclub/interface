'use client';

import { useRouter } from 'next/navigation';

interface DescriptionCardProps {
	dareData: any;
}

const DescriptionCard: React.FC<DescriptionCardProps> = ({ dareData }) => {
	const router = useRouter();

	if (!dareData) return null;

	const address = dareData[0]?.task.initiatorAddress;
	const formattedAddress = `(${address?.slice(0, 6)}...${address?.slice(-4).toLowerCase()})`;

	return (
		<div className="flex flex-col w-full max-w-full mx-auto bg-background border border-secondary rounded-xl backdrop-blur-md">
			{/* Header */}
			<div className="flex flex-col">
				<div className="flex flex-row justify-between items-center h-12 pr-4">
					<p className="text-base font-medium px-4">Description</p>
				</div>
				<hr className="border-b border-secondary w-full" />
			</div>

			{/* Content */}
			<div className="flex flex-col justify-center p-4 text-white text-sm h-[250px]">
				<div className="flex justify-center items-center grow text-center text-base mb-4">
					{dareData[0]?.task.description}
				</div>

				<div className="flex justify-center items-center gap-1 text-secondary">
					<p className="m-0">By</p>
					<a
						onClick={() => router.push(`/player/${address}`)}
						className="cursor-pointer hover:underline text-secondary"
					>
						{formattedAddress}
					</a>
				</div>
			</div>
		</div>
	);
};

export default DescriptionCard;
