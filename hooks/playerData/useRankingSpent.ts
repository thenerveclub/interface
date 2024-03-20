import { useEffect, useState } from 'react';
import { CHAINS } from '../../utils/chains';

const useRankingSpent = (checksumAddress) => {
	const [rankingData, setRankingData] = useState<number | 'N/A'>(null);

	if (!checksumAddress) return null;

	useEffect(() => {
		const getTask = async () => {
			const QueryForPlayerRanking = `
      {
        userStats(where: {earned_gt: 1000000000000000}, orderBy:spent, orderDirection: desc, first: 1000) 
        {
          id
          spent
        }
       }			 
      `;

			try {
				const fetchPromises = Object.entries(CHAINS).map(([chainId, chainData]) => {
					return fetch(chainData.graphApi, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ query: QueryForPlayerRanking }),
					}).then((response) => response.json().then((data) => data.data.userStats));
				});

				const allData = await Promise.all(fetchPromises);
				const combinedData = allData.flat();

				// Optionally sort combinedData if it's not already sorted by your criteria
				const targetIndex = combinedData.findIndex((obj) => obj.id === checksumAddress);

				// Set the target number (+1 because indexes are 0-based)
				const targetNumber = targetIndex !== -1 ? targetIndex + 1 : 'N/A';
				setRankingData(targetNumber);
			} catch (error) {
				console.error(error);
			}
		};

		// Call the function on first page load
		getTask();
	}, [checksumAddress]);

	return rankingData;
};

export default useRankingSpent;
