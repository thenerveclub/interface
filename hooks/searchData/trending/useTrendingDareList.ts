import { useEffect, useState } from 'react';
import { CHAINS } from '../../../utils/chains';

const useTrendingDareList = () => {
	const [trendingDareList, setTrendingDareList] = useState<{ [chainId: string]: any[] }>({});

	useEffect(() => {
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
				  chainId
				  latitude
				  longitude
				}
			 }
      `;

			try {
				const fetchPromises = Object.entries(CHAINS).map(([chainId, chainData]) => {
					return fetch(chainData.graphApi, {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ query: QueryForTrendingDareList }),
					}).then((response) => response.json().then((data) => ({ [chainId]: data.data.tasks })));
				});

				const allData = await Promise.all(fetchPromises);
				const combinedData = allData.reduce((acc, data) => ({ ...acc, ...data }), {});
				setTrendingDareList(combinedData);
			} catch (error) {
				console.error(error);
			}
		};

		getTrendingDareData();
	}, []);

	return trendingDareList;
};

export default useTrendingDareList;
