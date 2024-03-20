import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';
import { accountSlice } from './account/accountSlice';
import { ensSlice } from './account/ensSlice';
import { availableChainsSlice, chainIdSlice } from './chainId/chainIdSlice';
import { currencySlice } from './currency/currencySlice';
import { currencyPriceSlice } from './currencyPrice/currencyPriceSlice';
import { customRPCSlice } from './customRPC/customRPCSlice';
import { filterSlice } from './filter/filterSlice';
import { networkSlice } from './network/networkSlice';
import { rpcSlice } from './rpc/rpcSlice';
import { sortSlice } from './sort/sortSlice';
import { testnetsSlice } from './testnets/testnetsSlice';
import { themeSlice } from './theme/themeSlice';
import { claimTriggerSlice } from './trigger/claimTriggerSlice';
import { createTriggerSlice } from './trigger/createTriggerSlice';
import { joinTriggerSlice } from './trigger/joinTriggerSlice';
import { proveTriggerSlice } from './trigger/proveTriggerSlice';
import { redeemTriggerSlice } from './trigger/redeemTriggerSlice';
import { voteTriggerSlice } from './trigger/voteTriggerSlice';

export const store = configureStore({
	reducer: {
		chainId: chainIdSlice.reducer,
		availableChains: availableChainsSlice.reducer,
		account: accountSlice.reducer,
		ens: ensSlice.reducer,
		theme: themeSlice.reducer,
		currency: currencySlice.reducer,
		currencyPrice: currencyPriceSlice.reducer,
		rpc: rpcSlice.reducer,
		network: networkSlice.reducer,
		customRPC: customRPCSlice.reducer,
		testnets: testnetsSlice.reducer,
		sort: sortSlice.reducer,
		filter: filterSlice.reducer,
		claimTrigger: claimTriggerSlice.reducer,
		createTrigger: createTriggerSlice.reducer,
		joinTrigger: joinTriggerSlice.reducer,
		proveTrigger: proveTriggerSlice.reducer,
		redeemTrigger: redeemTriggerSlice.reducer,
		voteTrigger: voteTriggerSlice.reducer,
	},
	// Redux middleware for logging actions and state changes in the console
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});
