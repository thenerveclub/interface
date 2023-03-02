import { createSlice } from '@reduxjs/toolkit';

export const chainIdSlice = createSlice({
	name: 'chainId',
	initialState: 137,
	reducers: {
		updateChainId: (state, action) => {
			return parseInt(action.payload, 10);
		},
	},
});
