import { useEffect, useState } from 'react';

const useTrendingPlayerList = () => {
	const [trendingPlayerList, setTrendingPlayers] = useState(null);
	const [trendingPlayerListLoading, setTrendingPlayersLoading] = useState(true);
	const [trendingPlayerListError, setTrendingPlayersError] = useState(null);

	useEffect(() => {
		const fetchPlayerRanking = async () => {
			try {
				const response = await fetch('/api/topEarners');
				if (!response.ok) throw new Error('Network response was not ok');
				const data = await response.json();
				console.log('data', data);
				// Get only the top3 players from the list as new const
				const slicedData = data?.rankedByEarned.slice(0, 3);
				console.log('slicedData', slicedData);
				setTrendingPlayers(slicedData);
			} catch (e) {
				setTrendingPlayersLoading(e.message);
			} finally {
				setTrendingPlayersError(false);
			}
		};

		fetchPlayerRanking();
	}, []);

	return { trendingPlayerList, trendingPlayerListLoading, trendingPlayerListError };
};

export default useTrendingPlayerList;
