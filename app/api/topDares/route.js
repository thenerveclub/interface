import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { CHAINS } from '../../../utils/chains';

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
		tasks(first: 100, orderDirection: desc, orderBy: amount) {
		  id
		  description
		  entranceAmount
		  amount
		  participants
		  negativeVotes
		  positiveVotes
		  proofLink
		  endTask
		  chainId
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

// Function to fetch and sort tasks based on a criterion
const fetchAndAggregateData = async () => {
	const currencyPrice = await fetchCurrencyPrices();
	if (!currencyPrice) {
		return null;
	}

	const fetchPromises = Object.entries(CHAINS).map(([chainId, chainData]) => fetchStatsFromChain(chainId, chainData));

	// Fetch the data from all chains
	const allData = await Promise.all(fetchPromises);

	// Flatten the data from all chains into a single array
	const flattenedData = allData
		.filter((data) => data !== null) // Filter out any null responses
		.flatMap((data) => Object.values(data).flat());

	// Sort the combined data by amount in descending order and take the top 100
	const top100Tasks = flattenedData.sort((a, b) => b.amount - a.amount).slice(0, 100);

	return top100Tasks;
};

export async function GET() {
	if (!cachedGlobalStats || new Date().getTime() - lastGlobalStatsFetchTime > 1 * 60 * 60 * 1000) {
		try {
			const aggregatedData = await fetchAndAggregateData();

			if (aggregatedData) {
				cachedGlobalStats = aggregatedData;
				lastGlobalStatsFetchTime = new Date().getTime();
			}
			return NextResponse.json(cachedGlobalStats || { error: 'Failed to fetch top tasks' });
		} catch (error) {
			console.error('Failed to fetch top tasks:', error);
			if (cachedGlobalStats) {
				return NextResponse.json(cachedGlobalStats);
			}
			return NextResponse.json({ error: 'Failed to fetch top tasks' }, { status: 500 });
		}
	}

	return NextResponse.json(cachedGlobalStats);
}
