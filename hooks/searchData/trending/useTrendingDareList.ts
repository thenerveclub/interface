import { useEffect, useState } from 'react';
import { CHAINS } from '../../../utils/chains';

const useTrendingDareList = (chainId: number) => {
	const [trendingDareList, setTrendingDareList] = useState<any[]>([]);

	useEffect(() => {
		const getTrendingDareData = async () => {
			const QueryForTrendingDareList = `
			{
				tasks(
				  first: 3
				  orderBy: amount
				  orderDirection: desc
				  where: {finished: false, executed: false}
				) {
				  id
				  amount
				  description
				  entranceAmount
				  participants
				}
			 }
      `;

			try {
				const fetchDareData = await fetch(CHAINS[chainId]?.graphApi, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForTrendingDareList }),
				});

				const data = await fetchDareData.json();
				setTrendingDareList(data.data.tasks);
			} catch (error) {
				console.error(error);
			}
		};

		getTrendingDareData();
	}, [chainId]);

	return trendingDareList;
};

export default useTrendingDareList;
