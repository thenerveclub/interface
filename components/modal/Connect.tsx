import styled from '@emotion/styled';
import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import * as React from 'react';
import CoinbaseWalletConnect from '../connectorButtons/CoinbaseWalletConnect';
import MetaMaskConnect from '../connectorButtons/MetaMaskConnect';
import { WalletConnect } from '../connectorButtons/WalletConnect';

const ConnectButton = styled(Button)({
	color: '#fff',
	textTransform: 'none',
	justifyContent: 'flex-start',
	fontSize: 16,
	fontWeight: 400,
	height: 50,
	backgroundColor: 'transparent',

	'&:hover': {
		color: '#FF6B00',
		transition: 'all 0.75s ease',
	},
});

const ConnectBox = styled(Box)({
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	margin: '0 auto 0 auto',
	justifyContent: 'center',
	alignItems: 'center',
	padding: '1rem',
	height: 400,
	width: 350,
	backgroundColor: 'rgba(6, 16, 25, 1)',
	border: '0.25px solid rgba(76, 76, 90, 1)',
	borderRadius: '10px',
	boxShadow: '0 0 25px rgba(76,130,251,0.25)',
	pt: 4,
	px: 2,
	pb: 2,
});

function ConnectHeader() {
	const [open, setOpen] = React.useState(false);
	const handleOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	return (
		<div>
			{!open ? (
				<ConnectButton fullWidth={true} sx={{ my: 2, color: 'white', display: 'block', fontSize: '16px' }} onClick={handleOpen}>
					Connect
				</ConnectButton>
			) : (
				<ConnectButton
					fullWidth={true}
					sx={{ my: 2, color: 'white', fontSize: '12px' }}
					startIcon={<CircularProgress color="secondary" thickness={2.5} size={18} />}
				>
					Connecting
				</ConnectButton>
			)}
			<Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<ConnectBox>
					<Typography
						style={{ fontWeight: 'bold', margin: '0.75rem auto 0.75rem auto' }}
						align="center"
						color={'#fff'}
						id="modal-modal-title"
						variant="h6"
						component="h2"
					>
						Connect a wallet
					</Typography>
					<MetaMaskConnect />
					<CoinbaseWalletConnect />
					<WalletConnect />
					<Typography
						id="modal-modal-description"
						sx={{
							fontSize: '12px',
							margin: '0.75rem auto 0 auto',
							textAlign: 'center',
							padding: '1rem',
						}}
					>
						By connecting a wallet, you agree to Nerve Global's{' '}
						<a target="_blank" rel="noreferrer" href={'https://www.nerveglobal.com/disclaimer'}>
							Terms of Service
						</a>{' '}
						and acknowledge that you have read and understand the{' '}
						<a target="_blank" rel="noreferrer" href={'https://www.nerveglobal.com/disclaimer'}>
							Disclaimer
						</a>
						{'.'}
					</Typography>
				</ConnectBox>
			</Modal>
		</div>
	);
}

export default ConnectHeader;
