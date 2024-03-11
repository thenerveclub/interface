import { createSlice } from '@reduxjs/toolkit';

export const joinTriggerSlice = createSlice({
	name: 'joinTrigger',
	initialState: {
		triggered: false,
	},
	reducers: {
		setJoinTrigger: (state, action) => {
			state.triggered = action.payload;
		},
		resetJoinTrigger: (state) => {
			state.triggered = false;
		},
	},
});
