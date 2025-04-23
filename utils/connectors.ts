import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { Web3ReactHooks } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import { coinbaseWallet, hooks as coinbaseWalletHooks } from '../utils/connectors/coinbaseWallet';
import { metaMask, hooks as metaMaskHooks } from '../utils/connectors/metaMask';
import { walletConnectV2, hooks as walletConnectV2Hooks } from './connectors/walletConnectV2';

const connectors: [MetaMask | WalletConnectV2 | CoinbaseWallet, Web3ReactHooks][] = [
	[metaMask, metaMaskHooks],
	[walletConnectV2, walletConnectV2Hooks],
	[coinbaseWallet, coinbaseWalletHooks],
];

export default connectors;
