import { useEffect, useState } from 'react';
import { CHAINS } from '../utils/chains';

const usePrice = (chainId: number) => {
	const [price, setPrice] = useState<number>(0);

	useEffect(() => {
		const coingeckoApiId = CHAINS[chainId]?.coingeckoApiId;
		if (!coingeckoApiId) return; // Exit early if chain ID is not valid

		const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoApiId}&vs_currencies=usd`;

		fetch(url, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(Object),
		})
			.then((response) => response.json())
			.then((data) => setPrice(data[coingeckoApiId].usd));
	}, [chainId]);

	return price;
};

export default usePrice;
