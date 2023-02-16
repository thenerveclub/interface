import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { WalletConnect } from '@web3-react/walletconnect';
import dynamic from 'next/dynamic';
import { memo, useCallback, useEffect } from 'react';
import { Provider } from 'react-redux';
import logger from 'redux-logger';
import Layout from '../components/layout/Layout';
import { getName } from '../utils/connector';
import { coinbaseWallet, hooks as coinbaseWalletHooks } from '../utils/connectors/coinbaseWallet';
import { metaMask, hooks as metaMaskHooks } from '../utils/connectors/metaMask';
import { walletConnect, hooks as walletConnectHooks } from '../utils/connectors/walletConnect';

const chainIdSlice = createSlice({
	name: 'chainId',
	initialState: 137,
	reducers: {
		updateChainId: (state, action) => {
			return parseInt(action.payload, 10);
		},
	},
});

const store = configureStore({
	reducer: {
		chainId: chainIdSlice.reducer,
	},
	middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(logger),
});

const connectors: [MetaMask | WalletConnect | CoinbaseWallet | Network, Web3ReactHooks][] = [
	[metaMask, metaMaskHooks],
	[walletConnect, walletConnectHooks],
	[coinbaseWallet, coinbaseWalletHooks],
];

const Child = memo(() => {
	const { connector, account, chainId } = useWeb3React();

	useEffect(() => {
		if (typeof chainId === 'number') {
			store.dispatch(chainIdSlice.actions.updateChainId(chainId));
		}
	}, [chainId]);

	console.log(`Priority Connector is: ${getName(connector)}, ChainID is ${chainId} and Account is ${account}`);
	return null;
});

const SnackbarProvider = dynamic(() => import('notistack').then((module) => module.SnackbarProvider), {
	ssr: false,
});

export default function MyApp({ Component, pageProps }) {
	useEffect(() => {
		const connectorsToConnect = [metaMask, coinbaseWallet, walletConnect];
		connectorsToConnect.forEach(async (connector) => {
			try {
				await connector.connectEagerly();
			} catch (e) {
				console.debug(`Failed to connect eagerly to ${getName(connector)}`);
			}
		});
	}, []);

	return (
		<Provider store={store}>
			<Web3ReactProvider connectors={connectors}>
				<Child />
				<Layout>
					<SnackbarProvider maxSnack={3}>
						<Component {...pageProps} />
					</SnackbarProvider>
				</Layout>
			</Web3ReactProvider>
		</Provider>
	);
}
