import { createSlice } from '@reduxjs/toolkit';

export const currencyPriceSlice = createSlice({
	name: 'currencyPrice',
	initialState: {
		eth: 0.0,
		matic: 0.0,
	},
	reducers: {
		updateCurrencyPrice: (state, action) => {
			state.eth = action.payload.eth;
			state.matic = action.payload.matic;
		},
	},
});
