import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Modal from '@mui/material/Modal';
import Typography from '@mui/material/Typography';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import * as React from 'react';
import { useEffect, useState } from 'react';
import { hooks } from '../../connectors/metaMask';
import Identicon from '../Identicon';

const { useChainId } = hooks;

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

const StyledItemRowIntern = styled.nav`
	display: flex;
	flex: 1;
	flex-direction: row;
	font-size: 16px;
	font-weight: 500;
	justify-content: space-between;
	width: 100%;
	margin: 0 auto 0 auto;

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

	return (
		<>
			<a>
				<Identicon />
				{account === null ? '-' : account ? `${account.substring(0, 6)}...${account.substring(account.length - 4)}` : ''}
			</a>
		</>
	);
}

function useBalance() {
	const { account } = useWeb3React();
	const chainId = useChainId();
	var chain = chainId === undefined ? 1 : chainId;
	var provider = ethers.getDefaultProvider(chain, {
		etherscan: '-',
		infura: process.env.infuraKey,
		alchemy: '-',
		pocket: '-',
		ankr: '-',
	});

	const [balance, setBalance] = useState('');

	useEffect(() => {
		// setInterval(() => {
		// Get Account Balance in ether
		const getBalance = async () => {
			try {
				const balance = await (await provider?.getBalance(account)).toString();
				const etherBalance = ethers.utils.formatEther(balance).toString();
				setBalance(etherBalance);
			} catch (error) {}
		};
		getBalance();
		// }, 1000);
	}, []);

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
			<Button fullWidth={true} sx={{ my: 2, color: 'white', display: 'block' }} onClick={handleOpen}>
				<Account />
			</Button>
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
						{etherBalance === '' ? <LinearProgress /> : etherBalance ? etherBalance.substring(0, 6) : <LinearProgress />}
					</Typography>

					<Typography id="modal-modal-title" variant="h6" component="h2">
						{etherBalance === '' ? <LinearProgress /> : etherBalance ? <p>${(Number(etherBalance) * matic).toFixed(2)} USD</p> : <LinearProgress />}
					</Typography>
					<Divider variant="fullWidth" color={'#fff'} />
					<StyledItemRowIntern>
						<p>Disconnect</p>
						<Button sx={{ my: 2, color: 'white', display: 'block' }}>Button</Button>
					</StyledItemRowIntern>
					<StyledItemRowIntern>
						<p>Light Theme</p>
						<Button sx={{ my: 2, color: 'white', display: 'block' }}>Button</Button>
					</StyledItemRowIntern>
				</Box>
			</Modal>
		</div>
	);
}

export default AccountModal;
