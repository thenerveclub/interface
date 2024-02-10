import styled from '@emotion/styled';
import { Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/router';
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
	cursor: pointer;

	&:hover {
		border: 1px solid ${({ theme }) => theme.palette.warning.main};
	}

	@media (max-width: 1024px) {
		border: none;
		width: object-fit;
		margin: 0 auto 0 auto;
		padding: 0;

		&:hover {
			border: none;
		}
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

	@media (max-width: 1024px) {
		display: none;
		visibility: hidden;
	}
`;

interface AccountModalProps {
	account: any;
	network: any;
}

const AccountModal: React.FC<AccountModalProps> = ({ account, network }) => {
	const theme = useTheme();
	const router = useRouter();

	return (
		<>
			<ConnectButton theme={theme} onClick={() => router.push(`/${network}/player/${account}`)}>
				<Identicon />
				<StyledDiv>{account === null ? '-' : account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : ''}</StyledDiv>
			</ConnectButton>
		</>
	);
};

export default AccountModal;
