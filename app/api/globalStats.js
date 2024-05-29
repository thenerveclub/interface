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
const fetchStatsFromChain = async (chainId, chainData) => {
	const query = `
    {
      globalStats {
        count
        earnings
        users
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
		return { [chainId]: data.data.globalStats };
	} catch (error) {
		console.error(`Error fetching stats for chain ${chainId}:`, error);
		return null;
	}
};

// Main function to aggregate global stats
const fetchGlobalStats = async () => {
	const currencyPrice = await fetchCurrencyPrices();
	if (!currencyPrice) {
		return null;
	}
	const fetchPromises = Object.entries(CHAINS).map(([chainId, chainData]) => fetchStatsFromChain(chainId, chainData));

	const allData = await Promise.all(fetchPromises);
	const combinedData = allData.reduce((acc, data) => ({ ...acc, ...data }), {});

	// Aggregating stats for all chains with conversion to USD
	const allChainsStats = Object.entries(combinedData).reduce(
		(acc, [chainId, chainStatsArray]) => {
			const chainCurrency = CHAINS[chainId]?.nameToken?.toLowerCase();

			chainStatsArray.forEach((chainStats) => {
				acc.count += Number(chainStats.count) || 0;
				acc.users += Number(chainStats.users) || 0;
				let earningsInUSD = 0;

				if (chainCurrency === 'eth') {
					earningsInUSD = Number(chainStats.earnings) * currencyPrice.eth;
				} else if (chainCurrency === 'matic') {
					earningsInUSD = Number(chainStats.earnings) * currencyPrice.matic;
				}
				acc.earnings += Number(earningsInUSD);
			});

			return acc;
		},
		{ count: 0, earnings: 0, users: 0 }
	);

	return {
		individualChains: combinedData,
		allChains: {
			count: allChainsStats.count,
			earnings: formatBalance(allChainsStats.earnings),
			users: allChainsStats.users,
		},
	};
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
			const globalStatsData = await fetchGlobalStats();
			if (globalStatsData) {
				cachedGlobalStats = globalStatsData;
				lastGlobalStatsFetchTime = new Date().getTime();
			}
			res.status(200).json(cachedGlobalStats || { error: 'Failed to fetch global stats' });
			return;
		} catch (error) {
			console.error('Failed to fetch global stats:', error);
			if (cachedGlobalStats) {
				res.status(200).json(cachedGlobalStats);
				return;
			}
			res.status(500).json({ error: 'Failed to fetch global stats' });
			return;
		}
	}

	res.status(200).json(cachedGlobalStats);
}
