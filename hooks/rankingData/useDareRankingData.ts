import { useEffect, useState } from 'react';
import { CHAINS } from '../../utils/chains';

const useDareRankingData = (chainId: number, orderBy: string) => {
	const [rankingList, setRankingList] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		setIsLoading(true);

		const getTrendingPlayerList = async () => {
			const graphApiEndpoint = CHAINS[chainId]?.graphApi;
			if (!graphApiEndpoint) {
				setRankingList([]);
				setIsLoading(false);
				return;
			}

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
		  }`;

			try {
				const fetchPlayerData = await fetch(graphApiEndpoint, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForRankingList }),
					cache: 'no-cache',
				});

				const data = await fetchPlayerData.json();
				setRankingList(data.data.tasks);
			} catch (error) {
				console.error(`Error fetching data for chainId: ${chainId}`, error);
				setRankingList([]);
			} finally {
				setIsLoading(false);
			}
		};

		getTrendingPlayerList();
	}, [chainId, orderBy]);

	return { rankingList, isLoading };
};

export default useDareRankingData;
