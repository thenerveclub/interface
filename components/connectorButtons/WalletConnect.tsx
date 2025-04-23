import { useState } from 'react';
import { hooks, walletConnectV2 } from '../../utils/connectors/walletConnectV2';
import { Card } from '../ConnectOnlyCard';

const { useChainId, useIsActivating, useIsActive } = hooks;

export function WalletConnect() {
	const chainId = useChainId();
	const isActivating = useIsActivating();
	const isActive = useIsActive();
	const [error, setError] = useState(undefined);

	return <Card connector={walletConnectV2} chainId={chainId} isActivating={isActivating} isActive={isActive} error={error} setError={setError} />;
}
