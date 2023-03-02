import { CoinbaseWallet } from '@web3-react/coinbase-wallet';
import { Web3ReactHooks } from '@web3-react/core';
import { MetaMask } from '@web3-react/metamask';
import { WalletConnect } from '@web3-react/walletconnect';
import { ConnectOnly } from './ConnectOnly';

interface Props {
	connector: MetaMask | WalletConnect | CoinbaseWallet;
	chainId: ReturnType<Web3ReactHooks['useChainId']>;
	isActivating: ReturnType<Web3ReactHooks['useIsActivating']>;
	isActive: ReturnType<Web3ReactHooks['useIsActive']>;
	error: Error | undefined;
	setError: (error: Error | undefined) => void;
}

export function Card({ connector, chainId, isActivating, isActive, error, setError }: Props) {
	return (
		<div
			style={{
				display: 'flex',
				width: '100%',
				flexDirection: 'column',
				justifyContent: 'space-between',
				padding: '0.5rem',
				overflow: 'auto',
			}}
		>
			<ConnectOnly connector={connector} chainId={chainId} isActivating={isActivating} isActive={isActive} error={error} setError={setError} />
		</div>
	);
}
