import { createSlice } from '@reduxjs/toolkit';

export const claimTriggerSlice = createSlice({
	name: 'claimTrigger',
	initialState: {
		triggered: false,
	},
	reducers: {
		setClaimTrigger: (state, action) => {
			state.triggered = action.payload;
		},
		resetClaimTrigger: (state) => {
			state.triggered = false;
		},
	},
});
