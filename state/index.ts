import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { accountSlice } from './account/accountSlice';
import { availableChainsSlice, chainIdSlice } from './chainId/chainIdSlice';
import { themeSlice } from './theme/themeSlice';
import { currencySlice } from './currency/currencySlice';
import { currencyPriceSlice } from './currencyPrice/currencyPriceSlice';
import { sortSlice } from './sort/sortSlice';

export const store = configureStore({
	reducer: {
		chainId: chainIdSlice.reducer,
		account: accountSlice.reducer,
		availableChains: availableChainsSlice.reducer,
		theme: themeSlice.reducer,
		currency: currencySlice.reducer,
		currencyPrice: currencyPriceSlice.reducer,
		sort: sortSlice.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
