import { createSlice } from '@reduxjs/toolkit';

export const createTriggerSlice = createSlice({
	name: 'createTrigger',
	initialState: {
		triggered: false,
	},
	reducers: {
		setCreateTrigger: (state, action) => {
			state.triggered = action.payload;
		},
		resetCreateTrigger: (state) => {
			state.triggered = false;
		},
	},
});
