import { createSlice } from '@reduxjs/toolkit';

export const redeemTriggerSlice = createSlice({
	name: 'redeemTrigger',
	initialState: {
		triggered: false,
	},
	reducers: {
		setRedeemTrigger: (state, action) => {
			state.triggered = action.payload;
		},
		resetRedeemTrigger: (state) => {
			state.triggered = false;
		},
	},
});
