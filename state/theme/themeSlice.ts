import { createSlice } from '@reduxjs/toolkit';

export const themeSlice = createSlice({
	name: 'theme',
	initialState: {
		currentTheme: 'dark',
		prefersSystemSetting: true,
	},
	reducers: {
		setTheme: (state, action) => {
			state.currentTheme = action.payload; // payload would be 'light' or 'dark'
			localStorage.setItem('theme', action.payload); // optional: save to localStorage
		},
		setUseSystemSetting: (state, action) => {
			state.prefersSystemSetting = action.payload; // payload would be true or false
			// Check if the payload is not undefined before calling toString
			if (action.payload !== undefined) {
				localStorage.setItem('prefersSystemSetting', action.payload.toString());
			} else {
				// Handle the case when payload is undefined
				console.error('Payload for setUseSystemSetting is undefined');
			}
		},
	},
});

// Action creators are generated for each case reducer function
export const { setTheme, setUseSystemSetting } = themeSlice.actions;

export default themeSlice.reducer;
