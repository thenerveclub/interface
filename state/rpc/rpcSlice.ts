import { createSlice } from '@reduxjs/toolkit';

export const rpcSlice = createSlice({
	name: 'rpc',
	initialState: 'infura',
	reducers: {
		updateRPC: (state, action) => action.payload,
	},
});

export const { updateRPC } = rpcSlice.actions;

export default rpcSlice.reducer;
