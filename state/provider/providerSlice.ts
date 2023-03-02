import { createSlice } from '@reduxjs/toolkit';

export const providerSlice = createSlice({
	name: 'provider',
	initialState: null,
	reducers: {
		updateProvider: (state, action) => {
			return action.payload;
		},
	},
});
