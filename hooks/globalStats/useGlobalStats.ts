import { useEffect, useState } from 'react';
import { CHAINS } from '../../utils/chains';

interface ChainStats {
	count: number;
	earnings: number;
	users: number;
}

interface GlobalStats {
	individualChains: { [chainId: string]: ChainStats[] };
	allChains: ChainStats;
}

const useGlobalStats = () => {
	// const [globalStats, setGlobalStats] = useState({ individualChains: {}, allChains: {} });
	const [globalStats, setGlobalStats] = useState<GlobalStats>({ individualChains: {}, allChains: { count: 0, earnings: 0, users: 0 } });

	// console.log('checksumAddress', checksumAddress);

	useEffect(() => {
		const getGlobalStats = async () => {
			const QueryForGlobalStats = `
			{
				globalStats {
				  count
				  earnings
				  users
				}
			 }
  `;

			try {
				const fetchPromises = Object.entries(CHAINS).map(([chainId, chainData]) => {
					return fetch(chainData.graphApi, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ query: QueryForGlobalStats }),
					}).then((response) => response.json().then((data) => ({ [chainId]: data.data.globalStats })));
				});

				const allData = await Promise.all(fetchPromises);
				const combinedData = allData.reduce((acc, data) => ({ ...acc, ...data }), {});

				// Aggregating stats for all chains
				const allChainsStats = Object.values(combinedData).reduce(
					(acc, chainStatsArray) => {
						if (chainStatsArray && Array.isArray(chainStatsArray)) {
							chainStatsArray.forEach((chainStats) => {
								acc.count += Number(chainStats.count) || 0;
								acc.earnings += Number(chainStats.earnings) || 0;
								acc.users += Number(chainStats.users) || 0;
							});
						}
						return acc;
					},
					{ count: 0, earnings: 0, users: 0 }
				);

				setGlobalStats({ individualChains: combinedData, allChains: allChainsStats });
			} catch (error) {
				console.log(error);
				console.log('Error fetching TAD');
			}
		};

		// Refresh every 60 seconds
		// const interval = setInterval(getTAD, 60000);

		// Call the function on first page load
		getGlobalStats();

		// Clear the interval on unmount
		// return () => clearInterval(interval);

		// Refresh the data when the chainId or checksumAddress changes
	}, []);

	return globalStats;
};

export default useGlobalStats;
