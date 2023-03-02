import { useWeb3React } from '@web3-react/core';
import { memo, useCallback, useEffect } from 'react';
import { store } from '../index';
import { providerSlice } from './providerSlice';

const Child = memo(() => {
	const { provider } = useWeb3React();

	// const updateProvider = useCallback(
	// 	(provider) => {
	// 		store.dispatch(providerSlice.actions.updateProvider(provider));
	// 	},
	// 	[store]
	// );

	// useEffect(() => {
	// 	if (provider) {
	// 		updateProvider(provider);
	// 	}
	// }, [provider, updateProvider]);

	return null;
});

export default Child;
