import { useWeb3React } from '@web3-react/core';
import { memo, useCallback, useEffect } from 'react';
import { store } from '../index';
import { accountSlice } from './accountSlice';

const Child = memo(() => {
	const { account } = useWeb3React();

	const updateAccount = useCallback(
		(account) => {
			store.dispatch(accountSlice.actions.updateAccount(account));
		},
		[store]
	);

	useEffect(() => {
		if (account) {
			updateAccount(account);
		}
	}, [account, updateAccount]);

	return null;
});

export default Child;
