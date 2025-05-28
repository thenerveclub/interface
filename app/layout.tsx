'use client';

import { Web3ReactProvider } from '@web3-react/core';
import { Suspense, useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import Layout from '../components/layout/Layout';
import Account from '../state/account/accountUpdater';
import ChainId from '../state/chainId/chainIdUpdater';
import { currencyPriceSlice } from '../state/currencyPrice/currencyPriceSlice';
import { customRPCSlice } from '../state/customRPC/customRPCSlice';
import { filterSlice } from '../state/filter/filterSlice';
import { store } from '../state/index';
import { rpcSlice } from '../state/rpc/rpcSlice';
import { testnetsSlice } from '../state/testnets/testnetsSlice';
import { themeSlice } from '../state/theme/themeSlice';
import connectors from '../utils/connectors';
import { coinbaseWallet } from '../utils/connectors/coinbaseWallet';
import { metaMask } from '../utils/connectors/metaMask';
import { walletConnectV2 } from '../utils/connectors/walletConnectV2';
import { getName } from '../utils/connectorsNameAndLogo';

// CSS
import './globals.css';

function Updaters() {
	const dispatch = useDispatch();

	useEffect(() => {
		// Load the theme, prefersSystemSetting, and testnets settings from localStorage when the app starts
		const savedTheme = localStorage.getItem('theme');
		const prefersSystemSetting = localStorage.getItem('prefersSystemSetting') === 'true'; // Convert string to boolean

		if (savedTheme) {
			dispatch(themeSlice.actions.setTheme(savedTheme));
		}

		// Dispatch the prefersSystemSetting from localStorage
		dispatch(themeSlice.actions.setUseSystemSetting(prefersSystemSetting));

		const savedTestnets = localStorage.getItem('testnets');
		if (savedTestnets !== null) {
			dispatch(testnetsSlice.actions.setShowTestnets(savedTestnets === 'true'));
		}

		// Load RPC setting from localStorage
		const savedRPC = localStorage.getItem('rpc');
		if (savedRPC) {
			dispatch(rpcSlice.actions.updateRPC(savedRPC));
		}

		// Load custom RPC setting from localStorage
		const savedCustomRPC = localStorage.getItem('customRPC');
		if (savedCustomRPC) {
			dispatch(customRPCSlice.actions.updateCustomRPC(savedCustomRPC));
		}

		// Load filter setting from localStorage
		const savedFilter = localStorage.getItem('filter');
		if (savedFilter) {
			dispatch(filterSlice.actions.updateFilter(JSON.parse(savedFilter)));
		}

		// Subscribe to store changes and persist them to localStorage
		const unsubscribe = store.subscribe(() => {
			const state = store.getState();
			localStorage.setItem('theme', state.theme.currentTheme);
			localStorage.setItem('prefersSystemSetting', state.theme.prefersSystemSetting.toString());
			localStorage.setItem('testnets', state.testnets.toString());
			localStorage.setItem('rpc', state.rpc);
			localStorage.setItem('customRPC', state.customRPC);
			localStorage.setItem('filter', JSON.stringify(state.filter));
		});

		// Fetch token data
		const fetchTokenData = async () => {
			try {
				const response = await fetch('/api/tokenPriceData');
				const data = await response.json();
				dispatch(currencyPriceSlice.actions.updateCurrencyPrice(data));
			} catch (error) {
				console.error('Failed to fetch token data:', error);
				// Handle error appropriately
			}
		};

		fetchTokenData();

		// Unsubscribe from the store when the component unmounts
		return () => unsubscribe();
	}, [dispatch]);

	return (
		<>
			<Account />
			<ChainId />
		</>
	);
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
	useEffect(() => {
		const connectorsToConnect = [metaMask, walletConnectV2, coinbaseWallet];
		connectorsToConnect.forEach(async (connector) => {
			try {
				await connector.connectEagerly();
			} catch (e) {
				console.debug(`Failed to connect eagerly to ${getName(connector)}`);
			}
		});
	}, []);

	return (
		<html lang="en" className="min-h-full bg-background">
			<body>
				<Provider store={store}>
					<Web3ReactProvider connectors={connectors}>
						<Updaters />
						<Suspense fallback={<div>Loading...</div>}>
							<Layout>{children}</Layout>
						</Suspense>
					</Web3ReactProvider>
				</Provider>
			</body>
		</html>
	);
}
