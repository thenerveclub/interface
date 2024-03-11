import { createSlice } from '@reduxjs/toolkit';

export const proveTriggerSlice = createSlice({
	name: 'proveTrigger',
	initialState: {
		triggered: false,
	},
	reducers: {
		setProveTrigger: (state, action) => {
			state.triggered = action.payload;
		},
		resetProveTrigger: (state) => {
			state.triggered = false;
		},
	},
});
