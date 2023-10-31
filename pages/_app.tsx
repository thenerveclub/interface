import { Web3ReactProvider } from '@web3-react/core';
import { SnackbarProvider } from 'notistack';
import { useEffect } from 'react';
import { Provider, useDispatch } from 'react-redux';
import Layout from '../components/layout/Layout';
import usePrice from '../hooks/usePrice';
import Account from '../state/account/accountUpdater';
import ChainId from '../state/chainId/chainIdUpdater';
import { store } from '../state/index';
import { themeSlice } from '../state/theme/themeSlice';
import connectors from '../utils/connectors';
import { coinbaseWallet } from '../utils/connectors/coinbaseWallet';
import { metaMask } from '../utils/connectors/metaMask';
import { walletConnectV2 } from '../utils/connectors/walletConnectV2';
import { getName } from '../utils/connectorsNameAndLogo';

function Updaters() {
	const dispatch = useDispatch();
	usePrice();

	useEffect(() => {
		const savedTheme = localStorage.getItem('theme');
		if (savedTheme) {
			dispatch(themeSlice.actions.setTheme(savedTheme));
		}
	}, [dispatch]);

	return (
		<>
			<Account />
			<ChainId />
		</>
	);
}

export default function MyApp({ Component, pageProps }) {
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
