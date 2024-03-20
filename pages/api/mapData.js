import fetch from 'node-fetch';
import { CHAINS } from '../../utils/chains'; // Assuming this path is correct

let cachedMapData;
let lastMapDataFetchTime;

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
const fetchStatsFromChain = async (chainId, chainData, timestamp) => {
	const query = `
	{
		tasks(first: 100, where: {
			endTask_gt:"${timestamp}",
			 latitude_not: "0", 
			 longitude_not: "0",
		}) {
			 id
			 recipientAddress
			 latitude
			 longitude
			 description
			 chainId
			 amount
			 participants
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
		return { [chainId]: data.data.tasks };
	} catch (error) {
		console.error(`Error fetching stats for chain ${chainId}:`, error);
		return null;
	}
};

// Main function to aggregate map data
const fetchMapData = async () => {
	const currencyPrice = await fetchCurrencyPrices();
	if (!currencyPrice) {
		return null;
	}
	// Get the current timestamp
	const timestamp = Math.floor(Date.now() / 1000);

	// Fetch the global stats from all chains
	const fetchPromises = Object.entries(CHAINS).map(([chainId, chainData]) => fetchStatsFromChain(chainId, chainData, timestamp));

	// Fetch the data from all chains
	const allData = await Promise.all(fetchPromises);
	console.log('allData:', allData);

	// Flatten the data from all chains into a single array
	const flattenedData = allData
		.filter((data) => data !== null) // Filter out any null responses
		.flatMap((data) => Object.values(data).flat());

	// Sort the combined data by amount in descending order and take the top 100
	const top100Tasks = flattenedData.sort((a, b) => b.amount - a.amount).slice(0, 100);

	return top100Tasks;
};

export default async function handler(req, res) {
	// // Check the referer header
	// const referer = req.headers.referer;

	// // Allow requests only from your domain
	// if (!referer || !referer.includes('nerveglobal.com')) {
	// 	return res.status(403).json({ message: 'Access denied' });
	// }

	if (!cachedMapData || new Date().getTime() - lastMapDataFetchTime > 1 * 60 * 60 * 1000) {
		try {
			const mapData = await fetchMapData();
			if (mapData) {
				cachedMapData = mapData;
				lastMapDataFetchTime = new Date().getTime();
			}
			res.status(200).json(cachedMapData || { error: 'Failed to fetch map data' });
			return;
		} catch (error) {
			console.error('Failed to fetch map data:', error);
			if (cachedMapData) {
				res.status(200).json(cachedMapData);
				return;
			}
			res.status(500).json({ error: 'Failed to fetch map data' });
			return;
		}
	}

	res.status(200).json(cachedMapData);
}
