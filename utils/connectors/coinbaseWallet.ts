import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { initializeConnector } from '@web3-react/core';
import { URLS } from '../chains';

export const [coinbaseWallet, hooks] = initializeConnector<CoinbaseWallet>(
	(actions) =>
		new CoinbaseWallet({
			actions,
			options: {
				url: URLS[0],
				appName: 'web3-react',
			},
		})
);
