import { createSlice } from '@reduxjs/toolkit';

export const voteTriggerSlice = createSlice({
	name: 'voteTrigger',
	initialState: {
		triggered: false,
	},
	reducers: {
		setVoteTrigger: (state, action) => {
			state.triggered = action.payload;
		},
		resetVoteTrigger: (state) => {
			state.triggered = false;
		},
	},
});
