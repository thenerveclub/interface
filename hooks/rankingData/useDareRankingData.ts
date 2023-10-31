import { useEffect, useState } from 'react';
import { CHAINS } from '../../utils/chains';

const useDareRankingData = (chainId: number, orderBy: string) => {
	const [rankingList, setRankingList] = useState<any[]>([]);

	useEffect(() => {
		const getTrendingPlayerList = async () => {
			const QueryForRankingList = `
			{
				userTasks(first: 100, orderBy: ${'task__' + orderBy}, orderDirection: desc) {
				  id
				  task {
					 id
					 description
					 entranceAmount
					 amount
					 participants
					 negativeVotes
					 positiveVotes
					 proofLink
				  }
				  endTask
				}
			 }
      `;

			try {
				const fetchPlayerData = await fetch(CHAINS[chainId]?.graphApi, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForRankingList }),
				});

				const data = await fetchPlayerData.json();
				setRankingList(data.data.userTasks);
			} catch (error) {
				console.error(error);
			}
		};

		getTrendingPlayerList();
	}, [chainId, orderBy]);

	return rankingList;
};

export default useDareRankingData;
