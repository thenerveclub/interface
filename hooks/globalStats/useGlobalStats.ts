import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CHAINS } from '../../utils/chains';

interface ChainStats {
	count: number;
	earnings: string;
	users: number;
}

interface GlobalStats {
	individualChains: { [chainId: string]: ChainStats[] };
	allChains: ChainStats;
}

const useGlobalStats = (currencyPrice) => {
	// const [globalStats, setGlobalStats] = useState({ individualChains: {}, allChains: {} });
	const [globalStats, setGlobalStats] = useState<GlobalStats>({ individualChains: {}, allChains: { count: 0, earnings: '0', users: 0 } });

	// console.log('checksumAddress', checksumAddress);

	// Format Balance
	function formatBalance(value) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

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

				console.log('check');
				console.log('currencyPrice', currencyPrice);

				// Aggregating stats for all chains with conversion to USD
				const allChainsStats = Object.entries(combinedData).reduce(
					(acc, [chainId, chainStatsArray]) => {
						const chainCurrency = CHAINS[chainId]?.nameToken?.toLowerCase();
						console.log('Processing Chain:', chainId, chainCurrency);

						chainStatsArray.forEach((chainStats) => {
							console.log('Chain Stats:', chainStats);
							acc.count += Number(chainStats.count) || 0;
							acc.users += Number(chainStats.users) || 0;
							let earningsInUSD = 0;

							if (chainCurrency === 'eth') {
								earningsInUSD = Number(chainStats.earnings) * currencyPrice.eth;
							} else if (chainCurrency === 'matic') {
								earningsInUSD = Number(chainStats.earnings) * currencyPrice.matic;
							}
							console.log('Earnings in USD:', earningsInUSD);
							acc.earnings += formatBalance(earningsInUSD);
						});

						return acc;
					},
					{ count: 0, earnings: '0', users: 0 }
				);

				console.log('check2');
				console.log('allChainsStats', allChainsStats);
				console.log('combinedData', combinedData);

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
	}, [currencyPrice]);

	return globalStats;
};

export default useGlobalStats;
