import { useWeb3React } from '@web3-react/core';
import { memo, useCallback, useEffect } from 'react';
import { store } from '../index';
import { chainIdSlice } from './chainIdSlice';

const Child = memo(() => {
	const { chainId } = useWeb3React();

	const updateChainId = useCallback(
		(chainId) => {
			store.dispatch(chainIdSlice.actions.updateChainId(chainId));
		},
		[store]
	);

	useEffect(() => {
		if (typeof chainId === 'number') {
			updateChainId(chainId);
		}
	}, [chainId, updateChainId]);

	return null;
});

export default Child;
