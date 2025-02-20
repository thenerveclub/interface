'use client';

import Head from 'next/head';
import { useState } from 'react';
import useTopContributors from '../../hooks/rankingData/useTopContributors';
import useTopDares from '../../hooks/rankingData/useTopDares';
import useTopEarners from '../../hooks/rankingData/useTopEarners';
// import TopContributors from './boards/topContributors';
// import TopDares from './boards/topDares';
// import TopEarners from './boards/topEarners';

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
			<div className="flex flex-col items-center w-full px-4 mt-20">
				<h1 className="text-5xl font-extrabold text-center mb-10 text-white">Leaderboard</h1>
				<div className="flex justify-center items-center space-x-4 mb-10">
					{/* Toggle Buttons */}
					<button
						onClick={() => handleToggleChange('topEarners')}
						className={`px-4 py-2 rounded-md text-sm font-medium border ${
							leaderboardType === 'topEarners' ? 'bg-white text-black border-white' : 'bg-transparent text-white border-gray-400'
						}`}
					>
						Earnings
					</button>
					<button
						onClick={() => handleToggleChange('topContributors')}
						className={`px-4 py-2 rounded-md text-sm font-medium border ${
							leaderboardType === 'topContributors' ? 'bg-white text-black border-white' : 'bg-transparent text-white border-gray-400'
						}`}
					>
						Contributions
					</button>
					<button
						onClick={() => handleToggleChange('topDares')}
						className={`px-4 py-2 rounded-md text-sm font-medium border ${
							leaderboardType === 'topDares' ? 'bg-white text-black border-white' : 'bg-transparent text-white border-gray-400'
						}`}
					>
						Dares
					</button>
				</div>
				{/* Leaderboard Content */}
				{/* {leaderboardType === 'topEarners' && <TopEarners topEarners={topEarners} loading={topEarnersLoading} error={topEarnersError} />}
				{leaderboardType === 'topContributors' && (
					<TopContributors topContributors={topContributors} loading={topContributorsLoading} error={topContributorsError} />
				)}
				{leaderboardType === 'topDares' && <TopDares topDares={topDares} loading={topDaresLoading} error={topDaresError} />} */}
			</div>
		</>
	);
}
