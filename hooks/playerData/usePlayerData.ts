import { useEffect, useState } from 'react';
import { CHAINS } from '../../utils/chains';

interface ChainStats {
	earnedInUSD: number;
	spentInUSD: number;
}

interface GlobalStats {
	individualChains: { [chainId: string]: ChainStats[] };
	allChains: { earnedInUSD: string; spentInUSD: string }; // Changed to string
}

const usePlayerData = (address: string, currencyPrice: number) => {
	const [playerData, setPlayerData] = useState<GlobalStats>({
		individualChains: {},
		allChains: { earnedInUSD: '0', spentInUSD: '0' },
	});
	const [isLoading, setIsLoading] = useState<boolean>(true);

	// Format Balances
	function formatBalance(value) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	useEffect(() => {
		// setIsLoading(true);

		if (!address) {
			setPlayerData({ individualChains: {}, allChains: { earnedInUSD: '0', spentInUSD: '0' } });
			// setIsLoading(false);
			return;
		}

		const getPlayerData = async () => {
			const QueryForPlayerData = `
        {
          userStats(where: {id: "${address}"}) {
            id
            earned
            spent
          }
        }
      `;

			try {
				const fetchPromises = Object.entries(CHAINS).map(([chainId, chainData]) => {
					return fetch(chainData.graphApi, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ query: QueryForPlayerData }),
					}).then((response) => response.json().then((data) => ({ [chainId]: data.data.userStats })));
				});

				const allData = await Promise.all(fetchPromises);
				const combinedData = allData.reduce((acc, data) => ({ ...acc, ...data }), {});

				// Aggregating stats for all chains
				const allChainsStats = Object.entries(combinedData).reduce(
					(acc, [chainId, chainStatsArray]) => {
						const chainCurrency = CHAINS[chainId]?.nameToken?.toLowerCase();

						chainStatsArray.forEach((chainStats) => {
							let earnedInUSD = 0;
							let spentInUSD = 0;

							if (chainCurrency === 'eth') {
								if (chainStats.earned) {
									earnedInUSD = Number(chainStats.earned) * currencyPrice.eth;
								}
								if (chainStats.spent) {
									spentInUSD = Number(chainStats.spent) * currencyPrice.eth;
								}
							} else if (chainCurrency === 'matic') {
								if (chainStats.earned) {
									earnedInUSD = Number(chainStats.earned) * currencyPrice.matic;
								}
								if (chainStats.spent) {
									spentInUSD = Number(chainStats.spent) * currencyPrice.matic;
								}
							}

							acc.earnedInUSD += Number(earnedInUSD);
							acc.spentInUSD += Number(spentInUSD);
						});

						return acc;
					},
					{ earnedInUSD: 0, spentInUSD: 0 }
				);

				setPlayerData({
					individualChains: combinedData,
					allChains: {
						earnedInUSD: formatBalance(allChainsStats.earnedInUSD),
						spentInUSD: formatBalance(allChainsStats.spentInUSD),
					},
				});
			} catch (error) {
				console.error(error);
			} finally {
				setIsLoading(false);
			}
		};

		getPlayerData();
	}, [address, currencyPrice]);

	return { playerData, isLoading };
};

export default usePlayerData;
