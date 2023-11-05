import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { accountSlice } from './account/accountSlice';
import { availableChainsSlice, chainIdSlice } from './chainId/chainIdSlice';
import { currencySlice } from './currency/currencySlice';
import { currencyPriceSlice } from './currencyPrice/currencyPriceSlice';
import { customRPCSlice } from './customRPC/customRPCSlice';
import { rpcSlice } from './rpc/rpcSlice';
import { sortSlice } from './sort/sortSlice';
import { testnetsSlice } from './testnets/testnetsSlice';
import { themeSlice } from './theme/themeSlice';

export const store = configureStore({
	reducer: {
		chainId: chainIdSlice.reducer,
		account: accountSlice.reducer,
		availableChains: availableChainsSlice.reducer,
		theme: themeSlice.reducer,
		currency: currencySlice.reducer,
		currencyPrice: currencyPriceSlice.reducer,
		rpc: rpcSlice.reducer,
		customRPC: customRPCSlice.reducer,
		testnets: testnetsSlice.reducer,
		sort: sortSlice.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
