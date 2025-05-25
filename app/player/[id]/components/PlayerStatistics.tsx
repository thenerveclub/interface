'use client';

import { useSelector } from 'react-redux';
import useRankingEarned from '../../../../hooks/playerData/useRankingEarned';
import useRankingSpent from '../../../../hooks/playerData/useRankingSpent';

interface PlayerStatisticsProps {
	playerData: any;
	checksumAddress: string;
}

export default function PlayerStatistics({ playerData, checksumAddress }: PlayerStatisticsProps) {
	const rankingEarned = useRankingEarned(checksumAddress);
	const rankingSpent = useRankingSpent(checksumAddress);

	if (!playerData) return null;

	return (
		<div className="flex flex-row w-full justify-start gap-10 flex-wrap sm:flex-nowrap sm:w-full sm:justify-start sm:gap-8 mt-6">
			<div className="flex flex-col pr-4">
				<p className="text-lg font-semibold text-primary">${playerData?.allChains.earnedInUSD}</p>
				<p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Earnings</p>
			</div>

			<div className="flex flex-col pr-4">
				<p className="text-lg font-semibold text-primary">${playerData?.allChains.spentInUSD}</p>
				<p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Contributions</p>
			</div>

			<div className="flex flex-col pr-4">
				<p className="text-lg font-semibold text-primary flex items-center">
					{rankingEarned} | {rankingSpent}
					<span className="ml-2 text-gray-500 dark:text-gray-300 cursor-help text-sm" title="Player Ranking: Most Earned | Most Spent">
						ℹ️
					</span>
				</p>
				<p className="text-sm text-gray-500 dark:text-gray-300 mt-1">Rank</p>
			</div>
		</div>
	);
}
