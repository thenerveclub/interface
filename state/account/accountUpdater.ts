import { useWeb3React } from '@web3-react/core';
import { memo, useCallback, useEffect } from 'react';
import { store } from '../index';
import { accountSlice } from './accountSlice';

const AccountUpdater = memo(() => {
	const { account } = useWeb3React();

	const updateAccount = useCallback(() => {
		if (account) {
			store.dispatch(accountSlice.actions.updateAccount(account));
		}
	}, [account]);

	useEffect(() => {
		updateAccount();
	}, [account]);

	return null;
});

export default AccountUpdater;
