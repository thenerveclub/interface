import fetch from 'node-fetch';
import { CHAINS } from '../../utils/chains'; // Assuming this path is correct

let cachedGlobalStats;
let lastGlobalStatsFetchTime;

// Function to fetch currency prices
const fetchCurrencyPrices = async () => {
	try {
		const response = await fetch('https://canary.nerveglobal.com/api/tokenPriceData'); // Update with the correct URL/path
		if (!response.ok) throw new Error('Failed to fetch currency prices');
		return response.json();
	} catch (error) {
		console.error('Error fetching currency prices:', error);
		return null;
	}
};

// Function to format balance
const formatBalance = (value) => {
	return (Number(value) / 1e18).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

// Function to fetch global stats from a specific chain
const fetchStatsFromChain = async (chainId, chainData, orderBy) => {
	const query = `
	{
		userStats(first: 100, orderBy: spent, orderDirection: desc) {
		  id
		  spent
		}
	 }
  `;

	try {
		const response = await fetch(chainData.graphApi, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query }),
		});

		const data = await response.json();
		return { [chainId]: data.data.userStats };
	} catch (error) {
		console.error(`Error fetching stats for chain ${chainId}:`, error);
		return null;
	}
};

// Main function to aggregate global stats
// Function to fetch and sort player ranking based on a criterion
const fetchAndAggregateData = async (orderBy) => {
	const currencyPrice = await fetchCurrencyPrices();
	if (!currencyPrice) {
		return null;
	}

	const fetchPromises = Object.entries(CHAINS).map(([chainId, chainData]) => fetchStatsFromChain(chainId, chainData));

	const allData = (await Promise.all(fetchPromises)).reduce((acc, current) => {
		const chainId = Object.keys(current)[0];
		acc[chainId] = current[chainId];
		return acc;
	}, {});

	const userData = {};
	Object.entries(allData).forEach(([chainId, users]) => {
		users.forEach((user) => {
			const { id, spent } = user;
			const tokenName = CHAINS[chainId].nameToken.toLowerCase();
			const rate = currencyPrice[tokenName] || 1;

			if (!userData[id]) {
				userData[id] = { spent: 0 };
			}
			userData[id].spent += Number(spent) * rate;
		});
	});

	const combinedData = Object.entries(userData).map(([id, data]) => ({
		id,
		spent: formatBalance(data.spent),
	}));

	combinedData.sort((a, b) => parseFloat(b.spent) - parseFloat(a.spent));

	// Slice to get top 100
	const top100 = combinedData.slice(0, 100);

	return top100;
};

export default async function handler(req, res) {
	// // Check the referer header
	// const referer = req.headers.referer;

	// // Allow requests only from your domain
	// if (!referer || !referer.includes('nerveglobal.com')) {
	// 	return res.status(403).json({ message: 'Access denied' });
	// }

	if (!cachedGlobalStats || new Date().getTime() - lastGlobalStatsFetchTime > 1 * 60 * 60 * 1000) {
		try {
			const aggregatedData = await fetchAndAggregateData();

			if (aggregatedData) {
				cachedGlobalStats = { rankedBySpent: aggregatedData };
				lastGlobalStatsFetchTime = new Date().getTime();
			}
			res.status(200).json(cachedGlobalStats || { error: 'Failed to fetch top contributors' });
			return;
		} catch (error) {
			console.error('Failed to fetch top contributors:', error);
			if (cachedGlobalStats) {
				res.status(200).json(cachedGlobalStats);
				return;
			}
			res.status(500).json({ error: 'Failed to fetch top contributors' });
			return;
		}
	}

	res.status(200).json(cachedGlobalStats);
}
