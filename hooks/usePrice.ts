import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currencyPriceSlice } from '../state/currencyPrice/currencyPriceSlice';
import { CHAINS } from '../utils/chains';

const usePrice = () => {
	// Redux
	const dispatch = useDispatch();
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	// const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);
	const coingeckoID = CHAINS[chainId]?.coingeckoApiId;

	// const coingeckoID = availableChains.map((chainId) => CHAINS[chainId]?.coingeckoApiId);
	// const idsString = coingeckoIDs.join(',');

	const [price, setPrice] = useState<number>(0);

	useEffect(() => {
		if (!coingeckoID) return;

		const url = `https://api.coingecko.com/api/v3/simple/price?ids=${coingeckoID}&vs_currencies=usd&include_market_cap=false&include_24hr_vol=false&include_24hr_change=false&include_last_updated_at=false&precision=full
		`;

		fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setPrice(data[coingeckoID].usd || 0);
				dispatch(currencyPriceSlice.actions.updateCurrencyPrice(data[coingeckoID].usd));
			})
			.catch((error) => console.error(error));
	}, []);

	return price;
};

export default usePrice;
