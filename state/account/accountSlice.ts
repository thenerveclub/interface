import { createSlice } from '@reduxjs/toolkit';

export const accountSlice = createSlice({
	name: 'account',
	initialState: '',
	reducers: {
		updateAccount: (state, action) => {
			return action.payload;
		},
	},
});
