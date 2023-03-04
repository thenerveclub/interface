import { useEffect, useState } from 'react';
import { CHAINS } from '../utils/chains';

const usePlayerData = (checksumAddress: string, chainId: number) => {
	const [playerData, setPlayerData] = useState<any[]>([]);

	useEffect(() => {
		const getTask = async () => {
			const QueryForPlayerData = `
			{
				userDashStats(where: {spent_gt: 1000000000000000}, orderBy:spent, orderDirection: desc, first: 1000) 
				{
				  id
				  spent
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

				// Find the index of the target address
				const targetId = checksumAddress;
				const targetIndex = data.data.userDashStats.findIndex((obj) => obj.id === targetId);
				const targetNumber = targetIndex !== -1 ? targetIndex + 1 : 'N/A';
				setPlayerData(targetNumber);
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
