import { useWeb3React } from '@web3-react/core';
import * as React from 'react';
import AccountModal from './modal/Account';
import Connect from './modal/Connect';

function ConnectHeader() {
	const { account } = useWeb3React();

	return <>{account ? <AccountModal /> : <Connect />}</>;
}

export default ConnectHeader;
