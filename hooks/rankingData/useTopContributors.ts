import { useEffect, useState } from 'react';

const useTopContributors = () => {
	const [topContributors, setTopContributors] = useState(null);
	const [topContributorsLoading, setLoading] = useState(true);
	const [topContributorsError, setError] = useState(null);

	useEffect(() => {
		const fetchPlayerRanking = async () => {
			try {
				const response = await fetch('/api/topContributors');
				if (!response.ok) throw new Error('Network response was not ok');
				const data = await response.json();
				setTopContributors(data);
			} catch (e) {
				setError(e.message);
			} finally {
				setLoading(false);
			}
		};

		fetchPlayerRanking();
	}, []);

	return { topContributors, topContributorsLoading, topContributorsError };
};

export default useTopContributors;
