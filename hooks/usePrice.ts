import { useEffect, useState } from 'react';
import { CHAINS } from '../utils/chains';

const usePrice = (chainId: number) => {
	const [price, setPrice] = useState<number>(0);

	useEffect(() => {
		const coingeckoApiId = CHAINS[chainId]?.coingeckoApiId;
		if (!coingeckoApiId) return;

		const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoApiId}&vs_currencies=usd`;

		fetch(url)
			.then((response) => response.json())
			.then((data) => setPrice(data[coingeckoApiId]?.usd || 0))
			.catch((error) => console.error(error));
	}, [chainId]);

	return price;
};

export default usePrice;
