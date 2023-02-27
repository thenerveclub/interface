import { useEffect, useState } from 'react';
import { CHAINS } from '../utils/chains';

const usePlayerData = (checksumAddress: string, chainId: number) => {
	const [playerData, setPlayerData] = useState<any[]>([]);

	useEffect(() => {
		const getTask = async () => {
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

		// Refresh every 60 seconds
		const interval = setInterval(getTask, 60000);

		// Call the function on first page load
		getTask();

		// Clear the interval on unmount
		return () => clearInterval(interval);

		// Refresh the data when the chainId or checksumAddress changes
	}, [chainId, checksumAddress]);

	return playerData;
};

export default usePlayerData;
