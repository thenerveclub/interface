import { useEffect, useState } from 'react';
import { CHAINS } from '../../../utils/chains';

const useTrendingPlayerList = (chainIdUrl: number) => {
	const [trendingPlayerList, setTrendingPlayerList] = useState<any[]>([]);

	useEffect(() => {
		if (!chainIdUrl) {
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
				const fetchPlayerData = await fetch(CHAINS[chainIdUrl]?.graphApi, {
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
	}, [chainIdUrl]);

	return trendingPlayerList;
};

export default useTrendingPlayerList;
