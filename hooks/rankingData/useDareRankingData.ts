import { useEffect, useState } from 'react';
import { CHAINS } from '../../utils/chains';

const useDareRankingData = (chainId: number, orderBy: string) => {
	const [rankingList, setRankingList] = useState<any[]>([]);

	useEffect(() => {
		const getTrendingPlayerList = async () => {
			const QueryForRankingList = `
			{
				tasks(first: 100, orderDirection: desc, orderBy: ${orderBy}) {
				  id
				  description
				  entranceAmount
				  amount
				  participants
				  negativeVotes
				  positiveVotes
				  proofLink
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
				setRankingList(data.data.tasks);
			} catch (error) {
				console.error(error);
			}
		};

		getTrendingPlayerList();
	}, [chainId, orderBy]);

	return rankingList;
};

export default useDareRankingData;
