import { useEffect, useState } from 'react';
import { CHAINS } from '../../utils/chains';

const usePlayerRankingData = (chainId: number, orderBy: string) => {
	const [rankingList, setRankingList] = useState<any[]>([]);

	useEffect(() => {
		const getTrendingPlayerList = async () => {
			const graphApiEndpoint = CHAINS[chainId]?.graphApi;
			if (!graphApiEndpoint) {
				setRankingList([]);
				return;
			}

			const QueryForRankingList = `
      {
        userDashStats(first: 100, orderBy: ${orderBy}, orderDirection: desc) {
          id
          userName
          earned
          spent
          userSocialStat {
            instagram
            twitch
            tiktok
            twitter
            youtube
          }
        }
      }
      `;

			try {
				const fetchPlayerData = await fetch(graphApiEndpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForRankingList }),
					cache: 'no-cache',
				});

				const data = await fetchPlayerData.json();
				setRankingList(data.data.userDashStats);
			} catch (error) {
				console.error(`Error fetching data for chainId: ${chainId}`, error);
				setRankingList([]);
			}
		};

		getTrendingPlayerList();
	}, [chainId, orderBy]);

	return rankingList;
};

export default usePlayerRankingData;
