import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import * as React from 'react';
import CoinbaseWalletConnect from '../connectorButtons/CoinbaseWalletConnect';
import MetaMaskConnect from '../connectorButtons/MetaMaskConnect';
import { WalletConnect } from '../connectorButtons/WalletConnect';

// Define the keyframes for the slide-down animation
const slideDown = keyframes`
  0% {
    transform: translate(-50%, -50%);
  }
  100% {
    transform: translate(-50%, 125%);
  }
`;

// Define the keyframes for the slide-up animation
const slideUp = keyframes`
  0% {
    transform: translate(-50%, 125%);
  }
  100% {
    transform: translate(-50%, -50%);
  }
`;

const ConnectButton = styled(Button)({
	display: 'flex',
	alignItems: 'center', // Vertically aligns all content
	justifyContent: 'center',
	color: '#fff',
	textTransform: 'none',
	fontSize: 16,
	fontWeight: 400,
	minHeight: 0,
	height: 40,
	backgroundColor: 'rgba(38, 38, 56, 1)',
	border: '1px solid rgba(74, 74, 98, 1)',
	borderRadius: 15,
	width: '150px',
	transition: 'all 0.5s ease-in-out',

	'&:hover': {
		backgroundColor: 'rgba(58, 58, 76, 1)',
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
	border: '1px solid rgba(255, 255, 255, 0.2)', // Subtle border
	borderRadius: '15px',
	boxShadow: '0 0 25px rgba(76,130,251,0.25)',
	pt: 4,
	px: 2,
	pb: 2,

	animation: `${slideUp} 0.5s ease-in-out forwards`, // Default animation
	'&.closing': {
		animation: `${slideDown} 0.5s ease-in-out forwards`, // Animation when closing
	},
});

function ConnectHeader() {
	const [open, setOpen] = React.useState(false);
	const [isClosing, setIsClosing] = React.useState(false); // <-- New state to track closing status
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setIsClosing(true); // <-- Set closing status to true
		// Wait for the animation to complete before closing the modal
		setTimeout(() => {
			setOpen(false);
			setIsClosing(false); // <-- Reset closing status for the next cycle
		}, 500); // <-- Length of the slide-down animation
	};

	return (
		<div>
			{!open ? (
				<ConnectButton fullWidth={true} sx={{ color: 'white', display: 'block', fontSize: '16px' }} onClick={handleOpen}>
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
				<ConnectBox className={isClosing ? 'closing' : ''}>
					{' '}
					{/* Apply the 'closing' class conditionally */}
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
