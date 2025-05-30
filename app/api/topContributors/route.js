import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { CHAINS } from '../../../utils/chains';

let cachedGlobalStats;
let lastGlobalStatsFetchTime;

// Function to fetch currency prices
const fetchCurrencyPrices = async () => {
	try {
		const response = await fetch('https://app.nerve.club/api/tokenPriceData'); // Update with the correct URL/path
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

// Function to fetch and sort player ranking based on a criterion
const fetchAndAggregateData = async () => {
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

export async function GET() {
	if (!cachedGlobalStats || new Date().getTime() - lastGlobalStatsFetchTime > 1 * 60 * 60 * 1000) {
		try {
			const aggregatedData = await fetchAndAggregateData();

			if (aggregatedData) {
				cachedGlobalStats = { rankedBySpent: aggregatedData };
				lastGlobalStatsFetchTime = new Date().getTime();
			}
			return NextResponse.json(cachedGlobalStats || { error: 'Failed to fetch top contributors' });
		} catch (error) {
			console.error('Failed to fetch top contributors:', error);
			if (cachedGlobalStats) {
				return NextResponse.json(cachedGlobalStats);
			}
			return NextResponse.json({ error: 'Failed to fetch top contributors' }, { status: 500 });
		}
	}

	return NextResponse.json(cachedGlobalStats);
}
