import styled from '@emotion/styled';
import { Box } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import * as React from 'react';
import Identicon from '../Identicon';

const ConnectBox = styled(Box)({
	display: 'flex',
	justifyContent: 'flex-start',
	backgroundColor: 'rgba(255, 255, 255, 0.15)', // Slightly less transparent
	border: '1px solid rgba(255, 255, 255, 0.2)', // Subtle border
	backdropFilter: 'blur(20px)', // Blurring the background
	borderRadius: 15,
	minWidth: '150px',
	color: 'white',
	height: '40px',
	alignContent: 'center',
	alignItems: 'center',
	cursor: 'default',

	// gap to the left of the button icon first child
	'& > *:first-of-type': {
		marginLeft: '0.5rem',
	},

	// gap to the right of the button
	'& > *:not(:first-of-type)': {
		marginLeft: '0.5rem',
	},

	// gap to the right of the button last item
	'& > *:last-of-type': {
		marginRight: '0.5rem',
	},
});

function Account() {
	const { account } = useWeb3React();

	return <div>{account === null ? '-' : account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : ''}</div>;
}

function AccountModal() {
	return (
		<>
			<ConnectBox>
				<Identicon />
				<Account />
			</ConnectBox>
		</>
	);
}

export default AccountModal;
