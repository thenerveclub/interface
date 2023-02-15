import { useEffect, useState } from 'react';
import { hooks, metaMask } from '../../connectors/metaMask';
import { Card } from '../ConnectOnlyCard';

const { useChainId, useIsActivating, useIsActive } = hooks;

export default function MetaMaskConnect() {
	const chainId = useChainId();
	const isActivating = useIsActivating();
	const isActive = useIsActive();
	const [error, setError] = useState(undefined);

	// attempt to connect eagerly on mount
	useEffect(() => {
		void metaMask.connectEagerly().catch(() => {
			console.debug('Failed to connect eagerly to metamask');
		});
	}, []);

	return <Card connector={metaMask} chainId={chainId} isActivating={isActivating} isActive={isActive} error={error} setError={setError} />;
}
