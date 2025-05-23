import { NextResponse } from 'next/server';

let cachedData;
let lastFetchTime;

const cmcBaseUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency';
const cmcHeaders = {
	'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY,
};

const fetchETHPrice = async () => {
	try {
		const tokenId = 1027; // ETH ID
		const response = await fetch(`${cmcBaseUrl}/quotes/latest?id=${tokenId}`, { headers: cmcHeaders });
		const data = await response.json();
		if (!data || !data.data || !data.data[tokenId]) {
			console.error('Invalid data structure from CMC:', data);
			return null;
		}
		return data.data[tokenId].quote.USD.price;
	} catch (error) {
		console.error('Error fetching price from CoinMarketCap:', error);
		return null;
	}
};

const fetchMATICPrice = async () => {
	try {
		const tokenId = 28321; // POL ID
		const response = await fetch(`${cmcBaseUrl}/quotes/latest?id=${tokenId}`, { headers: cmcHeaders });
		const data = await response.json();
		if (!data || !data.data || !data.data[tokenId]) {
			console.error('Invalid data structure from CMC:', data);
			return null;
		}
		return data.data[tokenId].quote.USD.price;
	} catch (error) {
		console.error('Error fetching price from CoinMarketCap:', error);
		return null;
	}
};

export async function GET() {
	if (!cachedData || new Date().getTime() - lastFetchTime > 2 * 60 * 60 * 1000) {
		try {
			const responseETH = await fetchETHPrice();
			const responseMATIC = await fetchMATICPrice();

			if (responseETH !== null && responseMATIC !== null) {
				cachedData = {
					lastFetched: new Date().toISOString(),
					eth: responseETH,
					matic: responseMATIC,
				};
				lastFetchTime = new Date().getTime();
			} else {
				console.warn('One or both prices are null. Skipping cache update.');
			}
		} catch (error) {
			console.error('Error while fetching data:', error);
			if (cachedData) {
				return NextResponse.json(cachedData);
			}
			return NextResponse.json({ error: 'Failed to fetch data and no cache available' });
		}
	}

	if (!cachedData) {
		console.warn('No cached data available');
		return NextResponse.json({ error: 'No data available' });
	}

	return NextResponse.json(cachedData);
}
