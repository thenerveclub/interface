'use client';

import { usePathname } from 'next/navigation';
import { FaTelegram, FaWhatsapp, FaXTwitter } from 'react-icons/fa6';

interface ShareCardProps {
	dareData: any;
	player: string;
}

const ShareCard: React.FC<ShareCardProps> = ({ dareData, player }) => {
	const pathname = usePathname();
	const path = `https://app.nerve.club${pathname}`;

	return (
		<div className="flex flex-col w-full mx-auto bg-background border border-secondary rounded-xl backdrop-blur-md md:w-[95%]">
			{/* Header */}
			<div className="flex flex-col">
				<div className="flex flex-row justify-end items-center gap-4 w-full h-12 pr-4">
					<p className="text-base pl-4 pr-auto">Share</p>
				</div>
				<hr className="border-b border-secondary w-full" />
			</div>

			{/* Icon Links */}
			<div className="flex justify-center items-center flex-row px-4 py-4 gap-4 text-xl text-secondary hover:[&>a:hover]:text-warning">
				<a
					href={`https://twitter.com/intent/tweet?text=The stakes have never been higher! 💰 Dive into the excitement on %23Nerve 🚀 How much is at stake for ${player}? Check it out and spread the word! ➡️ %20${path}%20%23DoYouDare`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<FaXTwitter className="hover:text-warning transition-colors duration-150" />
				</a>
				<a
					href={`https://telegram.me/share/url?url=${path}&text=The stakes have never been higher! 💰 Dive into the excitement on %23Nerve 🚀 How much is at stake for ${player}? Check it out and spread the word! ➡️ %20${path}%20%23DoYouDare`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<FaTelegram className="hover:text-warning transition-colors duration-150" />
				</a>
				<a
					href={`https://api.whatsapp.com/send?text=The stakes have never been higher! 💰 Dive into the excitement on %23Nerve 🚀 How much is at stake for ${player}? Check it out and spread the word! ➡️%20${path}%20%23DoYouDare`}
					target="_blank"
					rel="noopener noreferrer"
				>
					<FaWhatsapp className="hover:text-warning transition-colors duration-150" />
				</a>
			</div>
		</div>
	);
};

export default ShareCard;
