import { Web3ReactProvider } from '@web3-react/core';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import { Provider } from 'react-redux';
import Layout from '../components/layout/Layout';
import Account from '../state/account/accountUpdater';
import ChainId from '../state/chainId/chainIdUpdater';
import { store } from '../state/index';
import connectors from '../utils/connectors';
import { coinbaseWallet } from '../utils/connectors/coinbaseWallet';
import { metaMask } from '../utils/connectors/metaMask';
import { walletConnect } from '../utils/connectors/walletConnect';
import { getName } from '../utils/connectorsNameAndLogo';

function Updaters() {
	return (
		<>
			<Account />
			<ChainId />
		</>
	);
}

export default function MyApp({ Component, pageProps }) {
	useEffect(() => {
		const connectorsToConnect = [metaMask, walletConnect, coinbaseWallet];
		connectorsToConnect.forEach(async (connector) => {
			try {
				// if (connector.connectEagerly) {
				await connector.connectEagerly();
				// } else {
				// 	const chainId = await connector.getChainId();
				// 	await connector.activate(chainId);
				// }
			} catch (e) {
				console.debug(`Failed to connect eagerly to ${getName(connector)}`);
			}
		});
	}, []);

	return (
		<Provider store={store}>
			<Web3ReactProvider connectors={connectors}>
				<Updaters />
				<Layout>
					<SnackbarProvider maxSnack={3}>
						<Component {...pageProps} />
					</SnackbarProvider>
				</Layout>
			</Web3ReactProvider>
		</Provider>
	);
}
