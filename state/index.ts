import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { accountSlice } from './account/accountSlice';
import { chainIdSlice } from './chainId/chainIdSlice';
import { providerSlice } from './provider/providerSlice';

export const store = configureStore({
	reducer: {
		chainId: chainIdSlice.reducer,
		account: accountSlice.reducer,
		provider: providerSlice.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
