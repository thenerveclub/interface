import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import * as React from 'react';
import { useSelector } from 'react-redux';
import Identicon from '../../Identicon';

const ConnectButton = styled(Button)<{ theme: any }>`
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${({ theme }) => theme.palette.text.primary};
	font-size: 16px;
	text-transform: none;
	font-weight: 500;
	min-height: 40px;
	height: 40px;
	width: 100%;
	max-width: 175px;
	background-color: transparent;
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	cursor: default;
`;

function Account() {
	// Redux
	const account = useSelector((state: { account: string }) => state.account);

	return <div>{account === null ? '-' : account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : ''}</div>;
}

function AccountModal() {
	const theme = useTheme();

	return (
		<>
			<ConnectButton theme={theme}>
				<Identicon />
				<Account />
			</ConnectButton>
		</>
	);
}

export default AccountModal;
