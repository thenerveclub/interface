import { createSlice } from '@reduxjs/toolkit';

export const networkSlice = createSlice({
	name: 'network',
	initialState: 'polygon',
	reducers: {
		updateNETWORK: (state, action) => action.payload,
	},
});

export const { updateNETWORK } = networkSlice.actions;

export default networkSlice.reducer;
