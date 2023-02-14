import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { GnosisSafe } from '@web3-react/gnosis-safe';
import { MetaMask } from '@web3-react/metamask';
import { Network } from '@web3-react/network';
import type { Connector } from '@web3-react/types';
import { WalletConnect } from '@web3-react/walletconnect';
import Image from 'next/image';
import CoinbaseWalletLogo from '/public/svg/coinbaseWallet.svg';
import MetaMaskLogo from '/public/svg/metaMask.svg';
import WalletConnectLogo from '/public/svg/walletConnect.svg';

export function getName(connector: Connector) {
	if (connector instanceof MetaMask) return 'MetaMask';
	if (connector instanceof CoinbaseWallet) return 'Coinbase Wallet';
	if (connector instanceof WalletConnect) return 'WalletConnect';
	return 'Unknown';
}

export function getLogo(connector: Connector) {
	if (connector instanceof MetaMask) return <MetaMaskLogo style={{ marginRight: '0.9rem' }} width="40" height="40" alt="Logo" />;
	if (connector instanceof CoinbaseWallet) return <CoinbaseWalletLogo style={{ margin: '0 1rem 0 0.2rem' }} width="35" height="35" alt="Logo" />;
	if (connector instanceof WalletConnect) return <WalletConnectLogo style={{ marginRight: '0.8rem' }} width="42" height="42" alt="Logo" />;
	return undefined;
}
