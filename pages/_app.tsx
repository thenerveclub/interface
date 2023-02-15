import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { useWeb3React, Web3ReactHooks, Web3ReactProvider } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import { WalletConnect } from '@web3-react/walletconnect';
import { SnackbarProvider } from 'notistack';
import React, { useEffect } from 'react';
import Layout from '../components/layout/Layout';
import { coinbaseWallet, hooks as coinbaseWalletHooks } from '../connectors/coinbaseWallet';
import { metaMask, hooks as metaMaskHooks } from '../connectors/metaMask';
import { walletConnect, hooks as walletConnectHooks } from '../connectors/walletConnect';
import { getName } from '../utils';

const connectors: [MetaMask | WalletConnect | CoinbaseWallet | Network, Web3ReactHooks][] = [
	[metaMask, metaMaskHooks],
	[walletConnect, walletConnectHooks],
	[coinbaseWallet, coinbaseWalletHooks],
];

function Child() {
	const { connector, account } = useWeb3React();
	console.log(`Priority Connector is: ${getName(connector)} and Account is ${account}`);
	return null;
}

export default function MyApp({ Component, pageProps }) {
	useEffect(() => {
		void metaMask.connectEagerly().catch(() => {
			console.debug('Failed to connect eagerly to MetaMask');
		});
		void coinbaseWallet.connectEagerly().catch(() => {
			console.debug('Failed to connect eagerly to Coinbase Wallet');
		});
		void walletConnect.connectEagerly().catch(() => {
			console.debug('Failed to connect eagerly to WalletConnect');
		});
	}, []);
	return (
		<>
			<Web3ReactProvider connectors={connectors}>
				<Child />
				<Layout>
					<SnackbarProvider maxSnack={3}>
						<Component {...pageProps} />
					</SnackbarProvider>
				</Layout>
			</Web3ReactProvider>
		</>
	);
}
