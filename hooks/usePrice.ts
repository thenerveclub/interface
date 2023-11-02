import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currencyPriceSlice } from '../state/currencyPrice/currencyPriceSlice';
import { CHAINS } from '../utils/chains';

const usePrice = () => {
	// Redux
	const dispatch = useDispatch();
	// const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);
	// const coingeckoID = CHAINS[chainId]?.coingeckoApiId;

	const coingeckoID = availableChains.map((chainId) => CHAINS[chainId]?.coingeckoApiId);
	const idsString = coingeckoID.join(',');

	const [price, setPrice] = useState<number>(0);

	useEffect(() => {
		if (!coingeckoID) return;

		const url = `https://api.coingecko.com/api/v3/simple/price?ids=${idsString}&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false&precision=full
		`;

		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				// Clone the original data to a new object
				let newData = { ...data };

				// Add a new key 'goerli' with the same value as 'ethereum'
				if (data.ethereum) {
					newData.goerli = data.ethereum;
				}

				// Rename 'matic-network' to 'polygon', keeping the same value
				if (data['matic-network']) {
					newData.polygon = data['matic-network'];
					delete newData['matic-network']; // Remove the old key if you don't need it
				}

				// Use the newData object with the added and renamed keys
				setPrice(newData);
				dispatch(currencyPriceSlice.actions.updateCurrencyPrice(newData));
			})
			.catch((error) => console.error(error));
	}, []);

	return price;
};

export default usePrice;
