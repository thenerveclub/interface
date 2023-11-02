import { createSlice } from '@reduxjs/toolkit';

export const currencyPriceSlice = createSlice({
	name: 'currencyPrice',
	initialState: {
		ethereum: 0.0,
		goerli: 0.0,
		polygon: 0.0,
	},
	reducers: {
		updateCurrencyPrice: (state, action) => {
			// action.payload should be an object like { ethereum: newPrice, ... }
			// This will merge the new prices into the state
			return {
				...state,
				...action.payload,
			};
		},
	},
});
