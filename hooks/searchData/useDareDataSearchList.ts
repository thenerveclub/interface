import { useEffect, useState } from 'react';
import { CHAINS } from '../../utils/chains';

const useTrendingDareDataSearchList = (chainIdUrl: number, keyWord: string) => {
	const [dareSearchList, setDareSearchList] = useState<any[]>([]);

	useEffect(() => {
		if (!chainIdUrl) {
			// Handle the case where the chainIdUrl is not ready or not valid
			setDareSearchList([]);
			return;
		}

		const getDareData = async () => {
			const QueryForDareSearchList = `
			{
				tasks(first: 10, where: {finished: false, executed: false, description_starts_with_nocase: "${keyWord}"}) {
				  id
				  participants
				  finished
				  executed
				  entranceAmount
				  amount
				  description
				  endTask
				}
			 }
      `;

			try {
				const fetchDareData = await fetch(CHAINS[chainIdUrl]?.graphApi, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForDareSearchList }),
				});

				const data = await fetchDareData.json();
				setDareSearchList(data.data.tasks);
			} catch (error) {
				console.error(error);
			}
		};

		getDareData();
	}, [chainIdUrl, keyWord]);

	return dareSearchList;
};

export default useTrendingDareDataSearchList;
