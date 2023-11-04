import { createSlice } from '@reduxjs/toolkit';

export const testnetsSlice = createSlice({
	name: 'testnets',
	initialState: true,
	reducers: {
		setShowTestnets: (state, action) => action.payload,
	},
});

export const { setShowTestnets } = testnetsSlice.actions;

export default testnetsSlice.reducer;
