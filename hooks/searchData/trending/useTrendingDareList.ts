import { useEffect, useState } from 'react';
import { CHAINS } from '../../../utils/chains';

const useTrendingDareList = (chainIdUrl: number) => {
	const [trendingDareList, setTrendingDareList] = useState<any[]>([]);

	useEffect(() => {
		if (!chainIdUrl) {
			// Handle the case where the chainIdUrl is not ready or not valid
			setTrendingDareList([]);
			return;
		}

		const getTrendingDareData = async () => {
			const QueryForTrendingDareList = `
			{
				tasks(
				  first: 3
				  orderBy: amount
				  orderDirection: desc
				  where: {finished: false, executed: false, endTask_gt: ${Math.floor(Date.now() / 1000)}}
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
				const response = await fetch(CHAINS[chainIdUrl]?.graphApi, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForTrendingDareList }),
				});

				const data = await response.json();
				setTrendingDareList(data.data.tasks);
			} catch (error) {
				console.error(error);
			}
		};

		getTrendingDareData();
	}, [chainIdUrl]);

	return trendingDareList;
};

export default useTrendingDareList;
