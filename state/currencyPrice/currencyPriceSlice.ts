import { createSlice } from '@reduxjs/toolkit';

export const currencyPriceSlice = createSlice({
	name: 'currencyPrice',
	initialState: 0.0,
	reducers: {
		updateCurrencyPrice: (state, action) => {
			return action.payload;
		},
	},
});
