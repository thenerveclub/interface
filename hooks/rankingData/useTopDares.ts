import { useEffect, useState } from 'react';

const useTopDares = () => {
	const [topDares, setTopDares] = useState(null);
	const [topDaresLoading, setLoading] = useState(true);
	const [topDaresError, setError] = useState(null);

	useEffect(() => {
		const fetchPlayerRanking = async () => {
			try {
				const response = await fetch('/api/topDares');
				if (!response.ok) throw new Error('Network response was not ok');
				const data = await response.json();
				setTopDares(data);
			} catch (e) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPlayerRanking();
	}, []);

	return { topDares, topDaresLoading, topDaresError };
};

export default useTopDares;
