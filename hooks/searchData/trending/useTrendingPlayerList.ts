import { useEffect, useState } from 'react';
import { CHAINS } from '../../../utils/chains';

const useTrendingPlayerList = (chainId: number) => {
	const [trendingPlayerList, setTrendingPlayerList] = useState<any[]>([]);

	useEffect(() => {
		if (!chainId) {
			// Handle the case where the chainIdUrl is not ready or not valid
			setTrendingPlayerList([]);
			return;
		}

		const getTrendingPlayerList = async () => {
			const QueryForTrendingPlayers = `
			{
				userDashStats(first: 3, orderBy: earned, orderDirection: desc) {
				  userName
				  earned
				  id
				}
			 }
      `;

			try {
				const fetchPlayerData = await fetch(CHAINS[chainId]?.graphApi, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForTrendingPlayers }),
				});

				const data = await fetchPlayerData.json();
				setTrendingPlayerList(data.data.userDashStats);
			} catch (error) {
				console.error(error);
			}
		};

		getTrendingPlayerList();
	}, [chainId]);

	return trendingPlayerList;
};

export default useTrendingPlayerList;
