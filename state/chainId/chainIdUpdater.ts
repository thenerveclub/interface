import { useWeb3React } from '@web3-react/core';
import { memo, useCallback, useEffect, useRef } from 'react';
import { store } from '../index';
import { chainIdSlice } from './chainIdSlice';

const ChainIdUpdater = memo(() => {
	const { chainId } = useWeb3React();
	// Use the initial state of the chainId slice
	const initialChainId = store.getState().chainId;

	const updateChainId = useCallback(
		(chainId) => {
			store.dispatch(chainIdSlice.actions.updateChainId(chainId));
		},
		[store]
	);

	useEffect(() => {
		// If the chainId changes, update the chainId slice
		if (typeof chainId === 'number' && chainId !== initialChainId) {
			updateChainId(chainId);
		}
	}, [chainId, updateChainId]);

	return null;
});

export default ChainIdUpdater;
