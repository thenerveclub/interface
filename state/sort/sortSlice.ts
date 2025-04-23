import { createSlice } from '@reduxjs/toolkit';

export const sortSlice = createSlice({
	name: 'sort',
	initialState: 2,
	reducers: {
		updateSort: (state, action) => {
			return action.payload;
		},
	},
});
