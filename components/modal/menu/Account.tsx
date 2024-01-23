import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
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

	@media (max-width: 600px) {
		border: none;
	}
`;

const StyledDiv = styled.div`
	display: flex;
	width: 100vw;
	height: 100vh;
	max-width: 100%;
	max-height: 100%;
	border: none;
	background-color: transparent;
	margin-left: 0.5rem;

	@media (max-width: 600px) {
		display: none;
		visibility: hidden;
	}
`;

function AccountModal() {
	const theme = useTheme();

	// Redux
	const account = useSelector((state: { account: string }) => state.account);

	return (
		<>
			<ConnectButton theme={theme}>
				<Identicon />
				<StyledDiv>{account === null ? '-' : account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : ''}</StyledDiv>
			</ConnectButton>
		</>
	);
}

export default AccountModal;
