import { useEffect, useState } from 'react';

const useGlobalStats = () => {
	const [globalStats, setGlobalStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchGlobalStats = async () => {
			try {
				const response = await fetch('/api/globalStats');
				if (!response.ok) throw new Error('Network response was not ok');
				const data = await response.json();
				setGlobalStats(data);
			} catch (e) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		};

		fetchGlobalStats();
	}, []);

	return { globalStats, loading, error };
};

export default useGlobalStats;
