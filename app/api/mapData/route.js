import { NextResponse } from 'next/server';
import fetch from 'node-fetch';
import { CHAINS } from '../../../utils/chains'; // Adjust the path as needed

let cachedMapData;
let lastMapDataFetchTime;

const fetchCurrencyPrices = async () => {
	try {
		const response = await fetch('https://canary.nerveglobal.com/api/tokenPriceData');
		if (!response.ok) throw new Error('Failed to fetch currency prices');
		return response.json();
	} catch (error) {
		console.error('Error fetching currency prices:', error);
		return null;
	}
};

const formatBalance = (value) => {
	return (Number(value) / 1e18).toLocaleString('en-US', {
		minimumFractionDigits: 2,
		maximumFractionDigits: 2,
	});
};

const fetchStatsFromChain = async (chainId, chainData, timestamp) => {
	const query = `
    {
      tasks(first: 100, where: {
        endTask_gt: "${timestamp}",
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

const fetchMapData = async () => {
	const currencyPrice = await fetchCurrencyPrices();
	if (!currencyPrice) {
		return null;
	}

	const timestamp = Math.floor(Date.now() / 1000);
	const fetchPromises = Object.entries(CHAINS).map(([chainId, chainData]) => fetchStatsFromChain(chainId, chainData, timestamp));

	const allData = await Promise.all(fetchPromises);
	console.log('allData:', allData);

	const flattenedData = allData.filter((data) => data !== null).flatMap((data) => Object.values(data).flat());

	const top100Tasks = flattenedData.sort((a, b) => b.amount - a.amount).slice(0, 100);

	return top100Tasks;
};

export async function GET() {
	if (!cachedMapData || new Date().getTime() - lastMapDataFetchTime > 1 * 60 * 60 * 1000) {
		try {
			const mapData = await fetchMapData();
			if (mapData) {
				cachedMapData = mapData;
				lastMapDataFetchTime = new Date().getTime();
			}
			return NextResponse.json(cachedMapData || { error: 'Failed to fetch map data' });
		} catch (error) {
			console.error('Failed to fetch map data:', error);
			if (cachedMapData) {
				return NextResponse.json(cachedMapData);
			}
			return NextResponse.error();
		}
	}

	return NextResponse.json(cachedMapData);
}
