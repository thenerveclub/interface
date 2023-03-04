import { createSlice } from '@reduxjs/toolkit';
import { CHAINS } from '../../utils/chains';

export const chainIdSlice = createSlice({
	name: 'chainId',
	initialState: 137,
	reducers: {
		updateChainId: (state, action) => {
			return parseInt(action.payload, 10);
		},
	},
});

export const availableChainsSlice = createSlice({
	name: 'availableChains',
	initialState: Object.keys(CHAINS).map(Number),
	reducers: {
		updateAvailableChains: (state, action) => {
			return action.payload;
		},
	},
});
