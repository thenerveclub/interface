import { useEffect, useState } from 'react';
import { CHAINS } from '../utils/chains';

const usePlayerData = (chainId: number, checksumAddress: string) => {
	const [playerData, setPlayerData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		setIsLoading(true);

		const getPlayerData = async () => {
			const graphApiEndpoint = CHAINS[chainId]?.graphApi;
			if (!graphApiEndpoint) {
				setPlayerData([]);
				setIsLoading(false);
				return;
			}

			const QueryForPlayerData = `
        {
          userDashStats(where: {id: "${checksumAddress}"}) {
            id
            earned
            spent
            userName
            userSocialStat {
              instagram
              tiktok
              twitch
              twitter
              youtube
            }
          }
        }
      `;

			try {
				const fetchTask = await fetch(graphApiEndpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForPlayerData }),
				});

				const data = await fetchTask.json();
				setPlayerData(data.data.userDashStats);
			} catch (error) {
				console.error(error);
				setPlayerData([]);
			} finally {
				setIsLoading(false);
			}
		};

		getPlayerData();
	}, [chainId, checksumAddress]);

	return { playerData, isLoading };
};

export default usePlayerData;
