import { createSlice } from '@reduxjs/toolkit';

export const customRPCSlice = createSlice({
	name: 'customRPC',
	initialState: '',
	reducers: {
		updateCustomRPC: (state, action) => action.payload,
	},
});

export const { updateCustomRPC } = customRPCSlice.actions;

export default customRPCSlice.reducer;
