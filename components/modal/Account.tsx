import styled from '@emotion/styled';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Box, Button, Divider, LinearProgress, Modal, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CHAINS } from '../../utils/chains';
import { hooks, metaMask } from '../../utils/connectors/metaMask';
import { getProvider } from '../../utils/nerveGlobalProvider';
import Identicon from '../Identicon';

const style = {
	position: 'absolute' as 'absolute',
	top: '25%',
	left: '90%',
	transform: 'translate(-50%, -50%)',
	width: 325,
	bgcolor: '#000014',
	border: '0.5px solid #fff',
	borderRadius: '10px',
	boxShadow: 24,
	p: 1,
};

const ConnectBox = styled(Box)({
	display: 'flex',
	justifyContent: 'flex-start',
	backgroundColor: 'rgba(152, 161, 192, 0.5)',
	borderRadius: 10,
	minWidth: '150px',
	color: 'white',
	height: '40px',
	alignContent: 'center',
	alignItems: 'center',

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

const StyledItemRowIntern = styled.nav`
	display: flex;
	flex: 1;
	flex-direction: row;
	font-size: 16px;
	font-weight: 500;
	justify-content: space-between;
	width: 100%;
	margin: 0 auto 0 auto;
	position: relative;
	vertical-align: middle;
	line-height: 200px;

	p {
		font-size: 16px;
		justify-content: space-between;
	}

	a {
		font-size: 16px;
	}

	negative {
		color: red;
	}

	positive {
		font-size: 16px;
		color: green;
	}

	@media (max-width: 960px) {
		font-size: 16px;
		justify-content: space-between;
		width: 100%;
		margin: 0 auto 0 auto;

		p {
			font-size: 12px;
		}

		& > * {
			margin-top: 1px;
			margin-bottom: 1px;
		}
		& > *:not(:first-of-type) {
			margin-top: 0;
			align-items: right;
		}
	}
`;

function usePrice() {
	const [maticPrice, setPrice] = useState<number[]>([]);

	useEffect(() => {
		fetch('https://api.coingecko.com/api/v3/simple/price?ids=matic-network&vs_currencies=usd', {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(Object),
		})
			.then((response) => response.json())
			.then((data) => setPrice(data['matic-network'].usd));
	}, []);

	return maticPrice;
}

function Account() {
	const { account } = useWeb3React();

	return <div>{account === null ? '-' : account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : ''}</div>;
}

function useBalance() {
	const { account } = useWeb3React();

	if (!account) {
		return '0.00';
	}

	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const { networkProvider } = getProvider(chainId);
	const [balance, setBalance] = useState('0.00');

	useEffect(() => {
		const getBalance = async () => {
			try {
				const balance = await networkProvider?.getBalance(account);
				const etherBalance = ethers.utils.formatEther(balance).toString();
				setBalance(etherBalance);
			} catch (error) {
				console.log(error);
			}
		};

		getBalance();
	}, [account]);

	return balance;
}

function AccountModal() {
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);
	const matic = Number(usePrice());
	const etherBalance = useBalance();

	return (
		<div>
			<ConnectBox onClick={handleOpen}>
				<Identicon />
				<Account />
			</ConnectBox>
			<Modal
				open={open}
				onClose={handleClose}
				sx={{ color: '#white' }}
				aria-labelledby="modal-modal-title"
				aria-describedby="modal-modal-description"
			>
				<Box sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						<Account />
					</Typography>

					<Typography id="modal-modal-title" variant="h6" component="h2">
						{etherBalance ? <p>{etherBalance.substring(0, 6)} ETH</p> : <LinearProgress />}
					</Typography>

					<Typography id="modal-modal-title" variant="h6" component="h2">
						{etherBalance ? <p>${(Number(etherBalance) * matic).toFixed(2)} USD</p> : <LinearProgress />}
					</Typography>
					<Divider variant="fullWidth" color={'#fff'} />
					<StyledItemRowIntern>
						Disconnect
						<PowerSettingsNewIcon
							style={{
								height: 'auto',
								cursor: 'pointer',
								color: '#fff',
							}}
							onClick={() => {
								if (metaMask?.deactivate) {
									metaMask.deactivate();
								} else {
									metaMask.resetState();
								}
							}}
						/>
					</StyledItemRowIntern>
				</Box>
			</Modal>
		</div>
	);
}

export default AccountModal;
