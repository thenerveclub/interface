import { useEffect, useState } from 'react';
import { CHAINS } from '../utils/chains';

const usePlayerData = (checksumAddress: string, chainId: number) => {
	const [playerData, setPlayerData] = useState<any[]>([]);

	useEffect(() => {
		const getPlayerData = async () => {
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
				const fetchTask = await fetch(CHAINS[chainId]?.graphApi, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForPlayerData }),
				});

				const data = await fetchTask.json();
				setPlayerData(data.data.userDashStats);
			} catch (error) {
				console.error(error);
			}
		};

		getPlayerData();

	}, [chainId, checksumAddress]);

	return playerData;
};

export default usePlayerData;
