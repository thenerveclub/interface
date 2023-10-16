import { initializeConnector } from '@web3-react/core';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';

export const [walletConnectV2, hooks] = initializeConnector<WalletConnectV2>(
	(actions) =>
		new WalletConnectV2({
			actions,
			options: {
				projectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID as string,
				// optionalChains,
				chains: [43113, 97, 80001, 4002, 599, 1, 43114, 56, 137, 250, 42161, 10, 1088, 100],

				showQrModal: true,
				// rpc: ChainInfoMap['AVAX'].testnet.rpcUrlArray,
				// rpcMap:
				optionalMethods: ['eth_signTypedData', 'eth_signTypedData_v4', 'eth_sign'],
				qrModalOptions: {
					chainImages: undefined,
					desktopWallets: undefined,
					enableExplorer: true,
					explorerExcludedWalletIds: undefined,
					explorerRecommendedWalletIds: undefined,
					mobileWallets: undefined,
					privacyPolicyUrl: undefined,
					termsOfServiceUrl: undefined,
					//  themeMode: darkmode ? 'dark' : 'light',
					themeVariables: {
						'--w3m-z-index': '9999',
					},
					tokenImages: undefined,
					walletImages: undefined,
				},
			},
		})
);
