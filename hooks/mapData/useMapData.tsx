import { useEffect, useState } from 'react';
import { CHAINS } from '../../utils/chains';

const useMapData = (chainIdUrl: number) => {
	const [mapData, setMapData] = useState<any[]>([]);
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		setIsLoading(true);

		if (!chainIdUrl) {
			// Handle the case where the chainIdUrl is not ready or not valid
			setMapData([]);
			setIsLoading(false);
			return;
		}

		const getMapData = async () => {
			const QueryForMapData = `
      {
        tasks(first: 100) {
          id
          recipientAddress
          taskLatitude
          taskLongitude
          description
          recipientName
        }
      }
      `;

			try {
				const fetchMapData = await fetch(CHAINS[chainIdUrl]?.graphApi, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: QueryForMapData }),
				});

				const data = await fetchMapData.json();
				setMapData(data.data.tasks);
			} catch (error) {
				console.error(error);
				setMapData([]);
			} finally {
				setIsLoading(false);
			}
		};

		getMapData();
	}, [chainIdUrl]);

	return { mapData, isLoading };
};

export default useMapData;
