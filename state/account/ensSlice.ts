import { createSlice } from '@reduxjs/toolkit';

export const ensSlice = createSlice({
	name: 'ens',
	initialState: '',
	reducers: {
		updateENS: (state, action) => {
			return action.payload;
		},
	},
});
