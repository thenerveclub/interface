import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { MetaMask } from '@web3-react/metamask';
import type { Connector } from '@web3-react/types';
import { WalletConnect as WalletConnectV2 } from '@web3-react/walletconnect-v2';
import CoinbaseWalletLogo from '/public/svg/connectors/coinbaseWallet.svg';
import MetaMaskLogo from '/public/svg/connectors/metaMask.svg';
import WalletConnectV2Logo from '/public/svg/connectors/walletConnectV2.svg';

export function getName(connector: Connector) {
	if (connector instanceof MetaMask) return 'MetaMask';
	if (connector instanceof CoinbaseWallet) return 'Coinbase Wallet';
	if (connector instanceof WalletConnectV2) return 'WalletConnect V2';
	return 'Unknown';
}

export function getLogo(connector: Connector) {
	if (connector instanceof MetaMask) return <MetaMaskLogo style={{ marginRight: '0.9rem' }} width="40" height="40" alt="Logo" />;
	if (connector instanceof CoinbaseWallet) return <CoinbaseWalletLogo style={{ margin: '0 1rem 0 0.2rem' }} width="35" height="35" alt="Logo" />;
	if (connector instanceof WalletConnectV2) return <WalletConnectV2Logo style={{ marginRight: '0.8rem' }} width="42" height="42" alt="Logo" />;
	return undefined;
}
