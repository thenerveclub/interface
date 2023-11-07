import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as React from 'react';
import CoinbaseWalletConnect from '../../connectorButtons/CoinbaseWalletConnect';
import MetaMaskConnect from '../../connectorButtons/MetaMaskConnect';
import { WalletConnect } from '../../connectorButtons/WalletConnect';

const StyledModal = styled(Modal)`
	.MuiModal-backdrop {
		backdrop-filter: blur(5px);
	}
`;

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
	background-color: transparent;
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	width: 150px;
	transition: all 0.5s ease-in-out;

	&:hover {
		color: ${({ theme }) => theme.palette.text.primary};
		border: 1px solid ${({ theme }) => theme.palette.warning.main};
	}
`;

const ConnectBox = styled(Box)<{ theme: any }>`
	position: absolute;
	top: 50%;
	left: 50%;
	transform: translate(-50%, -50%);
	margin: 0 auto 0 auto;
	justify-content: center;
	align-items: center;
	padding: 3rem 1rem;
	height: auto;
	width: 350px;
	background-color: ${({ theme }) => theme.palette.background.default};
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};

	animation: ${slideUp} 0.5s ease-in-out forwards;

	&.closing {
		animation: ${slideDown} 0.5s ease-in-out forwards;
	}
`;

function ConnectModal() {
	const theme = useTheme();
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
				<ConnectButton theme={theme} fullWidth={true} onClick={handleOpen}>
					Connect
				</ConnectButton>
			) : (
				<ConnectButton
					theme={theme}
					fullWidth={true}
					sx={{ my: 2, color: theme.palette.text.primary, fontSize: '12px' }}
					startIcon={<CircularProgress color="warning" thickness={2.5} size={18} />}
				>
					Connecting
				</ConnectButton>
			)}

			<StyledModal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<ConnectBox theme={theme} className={isClosing ? 'closing' : ''}>
					{' '}
					<Typography
						style={{ fontWeight: 'bold', margin: '0.0 auto 1.75rem auto', cursor: 'default' }}
						align="center"
						color={theme.palette.text.primary}
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
							color: theme.palette.text.secondary,
							cursor: 'default',
						}}
					>
						By connecting a wallet, you agree to Nerve Global's{' '}
						<a
							target="_blank"
							rel="noreferrer"
							href={'https://www.nerveglobal.com/disclaimer'}
							style={{ color: theme.palette.text.primary, fontWeight: 'bold' }}
						>
							Terms of Service
						</a>{' '}
						and acknowledge that you have read and understand the{' '}
						<a
							target="_blank"
							rel="noreferrer"
							href={'https://www.nerveglobal.com/disclaimer'}
							style={{ color: theme.palette.text.primary, fontWeight: 'bold' }}
						>
							Disclaimer
						</a>
						{'.'}
					</Typography>
				</ConnectBox>
			</StyledModal>
		</div>
	);
}

export default ConnectModal;
