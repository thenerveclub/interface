import { createSlice } from '@reduxjs/toolkit';

export const currencySlice = createSlice({
	name: 'currency',
	initialState: true,
	reducers: {
		updateCurrency: (state, action) => {
			return action.payload;
		},
	},
});
