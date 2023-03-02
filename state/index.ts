import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { accountSlice } from './account/accountSlice';
import { chainIdSlice } from './chainId/chainIdSlice';

export const store = configureStore({
	reducer: {
		chainId: chainIdSlice.reducer,
		account: accountSlice.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
