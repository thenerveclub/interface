import { useEffect, useState } from 'react';
import { coinbaseWallet, hooks } from '../../connectors/coinbaseWallet';
import { Card } from '../connectOnlyCard';

const { useChainId, useIsActivating, useIsActive } = hooks;

export default function CoinbaseWalletConnect() {
	const chainId = useChainId();
	const isActivating = useIsActivating();
	const isActive = useIsActive();
	const [error, setError] = useState(undefined);

	// attempt to connect eagerly on mount
	useEffect(() => {
		void coinbaseWallet.connectEagerly().catch(() => {
			console.debug('Failed to connect eagerly to coinbase wallet');
		});
	}, []);

	return <Card connector={coinbaseWallet} chainId={chainId} isActivating={isActivating} isActive={isActive} error={error} setError={setError} />;
}
