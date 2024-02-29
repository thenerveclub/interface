import { useWeb3React } from '@web3-react/core';
import { memo, useCallback, useEffect } from 'react';
import { store } from '../index';
import { accountSlice } from './accountSlice';
import { ensSlice } from './ensSlice';

const AccountUpdater = memo(() => {
	const { account, ENSNames } = useWeb3React();

	const updateAccount = useCallback(() => {
		if (account) {
			store.dispatch(accountSlice.actions.updateAccount(account));
		}
	}, [account]);

	const updateENS = useCallback(() => {
		// if (ENSNames[0] && ENSNames[0].length > 0) {
		// 	store.dispatch(ensSlice.actions.updateENS(ENSNames[0]));
		// }
		store.dispatch(ensSlice.actions.updateENS(ENSNames[0] ? ENSNames[0] : ''));
	}, [ENSNames]);

	useEffect(() => {
		updateAccount();
		updateENS();
	}, [account, ENSNames]);

	return null;
});

export default AccountUpdater;
