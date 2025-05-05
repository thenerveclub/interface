'use client';

import Head from 'next/head';
import { useState } from 'react';
import useTopContributors from '../../hooks/rankingData/useTopContributors';
import useTopDares from '../../hooks/rankingData/useTopDares';
import useTopEarners from '../../hooks/rankingData/useTopEarners';
// import TopContributors from './boards/topContributors';
// import TopDares from './boards/topDares';
import TopEarners from './boards/topEarners';

export default function LeaderboardPage() {
	// Hooks for data fetching
	const { topEarners, topEarnersLoading, topEarnersError } = useTopEarners();
	const { topContributors, topContributorsLoading, topContributorsError } = useTopContributors();
	const { topDares, topDaresLoading, topDaresError } = useTopDares();

	// State for toggle button group
	const [leaderboardType, setLeaderboardType] = useState('topEarners');

	// Handle leaderboard toggle change
	const handleToggleChange = (type) => {
		setLeaderboardType(type);
	};

	return (
		<>
			<Head>
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<meta name="robots" content="noindex" />
				<title>Ranking | Nerve Global</title>
				<meta property="og:title" content="Ranking | Nerve Global" key="title" />
				<meta property="og:site_name" content="Ranking | Nerve Global" />
				<meta property="og:description" content="Ranking | Nerve Global" />
				<meta property="og:image" content="https://app.nerveglobal.com/favicon.ico" />
				<meta property="og:url" content="https://app.nerveglobal.com/" />
				<meta property="og:type" content="website" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:site" content="@nerveglobal_" />
				<meta name="twitter:title" content="Ranking | Nerve Global" />
				<meta name="twitter:description" content="Ranking | Nerve Global" />
				<meta name="twitter:image" content="https://app.nerveglobal.com/favicon.ico" />
			</Head>
			<div className="flex flex-col items-center w-full mt-32">
				{/* Foreground text */}
				<div className="z-10">
					<div className="text-center text-4xl md:text-6xl 2xl:text-9xl font-bold text-black dark:text-white">LEADERBOARD</div>
				</div>

				{/* Leaderboard Buttons */}
				<div className="flex justify-center items-center space-x-4 mt-10 mb-10">
					<button
						onClick={() => handleToggleChange('topEarners')}
						className={`px-4 py-2 rounded-md text-sm font-medium border ${
							leaderboardType === 'topEarners'
								? 'bg-accent text-white border-accent'
								: 'bg-transparent text-gray-400 dark:text-gray-400 border-gray-400 hover:border-accent hover:text-accent dark:hover:text-accent'
						}`}
					>
						Earnings
					</button>
					<button
						onClick={() => handleToggleChange('topContributors')}
						className={`px-4 py-2 rounded-md text-sm font-medium border ${
							leaderboardType === 'topContributors'
								? 'bg-accent text-white border-accent'
								: 'bg-transparent text-gray-400 dark:text-gray-400 border-gray-400 hover:border-accent hover:text-accent dark:hover:text-accent'
						}`}
					>
						Contributions
					</button>
					<button
						onClick={() => handleToggleChange('topDares')}
						className={`px-4 py-2 rounded-md text-sm font-medium border ${
							leaderboardType === 'topDares'
								? 'bg-accent text-white border-accent'
								: 'bg-transparent text-gray-400 dark:text-gray-400 border-gray-400 hover:border-accent hover:text-accent dark:hover:text-accent'
						}`}
					>
						Dares
					</button>
				</div>
				{/* Leaderboard Content */}
				<div className="w-full">
					{leaderboardType === 'topEarners' && <TopEarners topEarners={topEarners} loading={topEarnersLoading} error={topEarnersError} />}
					{/* {leaderboardType === 'topContributors' && (
					<TopContributors topContributors={topContributors} loading={topContributorsLoading} error={topContributorsError} />
				)} */}
					{/* {leaderboardType === 'topDares' && <TopDares topDares={topDares} loading={topDaresLoading} error={topDaresError} />} */}
				</div>
			</div>
		</>
	);
}
