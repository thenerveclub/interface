import { createSlice } from '@reduxjs/toolkit';

export const filterSlice = createSlice({
	name: 'filter',
	initialState: [1, 137, 11155111],
	reducers: {
		toggleFilterItem: (state, action) => {
			const item = action.payload;
			const index = state.indexOf(item);
			if (index === -1) {
				// Item not in array, add it
				state.push(item);
			} else {
				// Item in array, remove it
				state.splice(index, 1);
			}
		},
		updateFilter: (state, action) => {
			return action.payload;
		},
	},
});
