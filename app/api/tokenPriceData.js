let cachedData;
let lastFetchTime;

export default async function handler(req, res) {
	// // Check the referer header
	// const referer = req.headers.referer;

	// // Allow requests only from your domain
	// if (!referer || !referer.includes('nerveglobal.com')) {
	// 	return res.status(403).json({ message: 'Access denied' });
	// }

	const cmcBaseUrl = 'https://pro-api.coinmarketcap.com/v1/cryptocurrency';
	const cmcHeaders = {
		'X-CMC_PRO_API_KEY': process.env.CMC_API_KEY, // Store API key in environment variables
	};

	const fetchETHPrice = async () => {
		try {
			const tokenId = 1027; // ETH ID

			const response = await fetch(`${cmcBaseUrl}/quotes/latest?id=${tokenId}`, { headers: cmcHeaders });
			const data = await response.json(); // Convert response to JSON

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
			const tokenId = 3890; // MATIC ID

			const response = await fetch(`${cmcBaseUrl}/quotes/latest?id=${tokenId}`, { headers: cmcHeaders });
			const data = await response.json(); // Convert response to JSON

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

	// Check if we have valid cached data and it's not older than 2 hours
	if (!cachedData || new Date().getTime() - lastFetchTime > 2 * 60 * 60 * 1000) {
		try {
			const responseETH = await fetchETHPrice();
			const responseMATIC = await fetchMATICPrice();
			if (responseETH !== null && responseMATIC !== null) {
				// Update the cache and last fetched time
				cachedData = {
					lastFetched: new Date().toISOString(),
					eth: responseETH,
					matic: responseMATIC,
				};
				lastFetchTime = new Date().getTime();
			}
			res.status(200).json(cachedData || { error: 'Failed to fetch data' });
			return;
		} catch (error) {
			console.error('Failed to fetch CoinMarketCap data:', error);
			// Optionally return old cached data here if it exists
			if (cachedData) {
				res.status(200).json(cachedData);
				return;
			}
			res.status(500).json({ error: 'Failed to fetch data' });
			return;
		}
	}

	// Send the cached data along with the last fetched time
	res.status(200).json(cachedData);
}
