import { useState } from 'react';
import { hooks, metaMask } from '../../utils/connectors/metaMask';
import { Card } from '../ConnectOnlyCard';

const { useChainId, useIsActivating, useIsActive } = hooks;

export default function MetaMaskConnect() {
	const chainId = useChainId();
	const isActivating = useIsActivating();
	const isActive = useIsActive();
	const [error, setError] = useState(undefined);

	return <Card connector={metaMask} chainId={chainId} isActivating={isActivating} isActive={isActive} error={error} setError={setError} />;
}
