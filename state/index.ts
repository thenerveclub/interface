import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { accountSlice } from './account/accountSlice';
import { availableChainsSlice, chainIdSlice } from './chainId/chainIdSlice';
import { themeSlice } from './theme/themeSlice';
import { currencySlice } from './currency/currencySlice';

export const store = configureStore({
	reducer: {
		chainId: chainIdSlice.reducer,
		account: accountSlice.reducer,
		availableChains: availableChainsSlice.reducer,
		theme: themeSlice.reducer,
		currency: currencySlice.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
