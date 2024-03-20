import { useEffect, useState } from 'react';

const useMapData = () => {
	const [mapData, setMapData] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchGlobalStats = async () => {
			try {
				const response = await fetch('/api/mapData');
				if (!response.ok) throw new Error('Network response was not ok');
				const data = await response.json();
				setMapData(data);
			} catch (e) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		};

		fetchGlobalStats();
	}, []);

	return { mapData, loading, error };
};

export default useMapData;
