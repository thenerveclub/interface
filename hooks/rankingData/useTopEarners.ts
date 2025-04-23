import { useEffect, useState } from 'react';

const useTopEarners = () => {
	const [topEarners, setTopEarners] = useState(null);
	const [topEarnersLoading, setLoading] = useState(true);
	const [topEarnersError, setError] = useState(null);

	useEffect(() => {
		const fetchPlayerRanking = async () => {
			try {
				const response = await fetch('/api/topEarners');
				if (!response.ok) throw new Error('Network response was not ok');
				const data = await response.json();
				setTopEarners(data);
			} catch (e) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPlayerRanking();
	}, []);

	return { topEarners, topEarnersLoading, topEarnersError };
};

export default useTopEarners;
