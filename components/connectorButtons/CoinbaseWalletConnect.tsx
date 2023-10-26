import { useState } from 'react';
import { coinbaseWallet, hooks } from '../../utils/connectors/coinbaseWallet';
import { Card } from '../ConnectOnlyCard';

const { useChainId, useIsActivating, useIsActive } = hooks;

export default function CoinbaseWalletConnect() {
	const chainId = useChainId();
	const isActivating = useIsActivating();
	const isActive = useIsActive();
	const [error, setError] = useState(undefined);

	return <Card connector={coinbaseWallet} chainId={chainId} isActivating={isActivating} isActive={isActive} error={error} setError={setError} />;
}
