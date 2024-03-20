import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, Button, CircularProgress, InputAdornment, Modal, OutlinedInput, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import { proveTriggerSlice } from '../../state/trigger/proveTriggerSlice';
import { CHAINS, getAddChainParameters } from '../../utils/chains';
import { metaMask } from '../../utils/connectors/metaMask';

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

const ModalButton = styled(Button)<{ theme: any }>`
	color: #fff;
	text-transform: none;
	font-size: 16px;
	border: none;
	line-height: 1.5;
	background-color: ${({ theme }) => theme.palette.warning.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	height: 35px;
	width: 125px;
	margin-left: 1rem;

	&:hover {
		background-color: ${({ theme }) => theme.palette.warning.main};
	}

	&:disabled {
		background-color: ${({ theme }) => theme.palette.warning.main};
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

const StyledSection = styled.section`
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	align-content: center;
	margin: 0 auto 0 auto;

	@media (max-width: 960px) {
		display: grid;
		align-items: center;
		margin: 0 auto 0 auto;
		grid-template-columns: 1fr;
		grid-gap: 2em;
	}
`;

const StatisticBox = styled(Box)`
	width: 90%;
	margin: 0 auto 0 auto;

	a {
		font-size: 16px;
		cursor: default;
	}
`;

const RegisterNameButton = styled(Button)<{ theme: any }>`
	display: flex;
	color: ${({ theme }) => theme.palette.text.primary};
	text-transform: none;
	width: 150px;
	font-size: 1rem;
	font-weight: 400;
	line-height: 1.5;
	height: 100%;
	background-color: ${({ theme }) => theme.palette.warning.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};

	&:hover {
		background-color: ${({ theme }) => theme.palette.warning.main};
	}

	&:disabled {
		color: ${({ theme }) => theme.palette.secondary.main};
		background-color: ${({ theme }) => theme.palette.warning.main};
	}
`;

interface ProveDareProps {
	dareData: any;
}

const ProveDare: React.FC<ProveDareProps> = ({ dareData }) => {
	const theme = useTheme();
	const { provider } = useWeb3React();
	const { enqueueSnackbar } = useSnackbar();

	// Redux
	const dispatch = useDispatch();
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	// State
	const [open, setOpen] = useState(false);
	const [pendingTx, setPendingTx] = useState(false);
	const [isClosing, setIsClosing] = useState(false); // <-- New state to track closing status
	const [proveLink, setProveLink] = useState('');

	// Handle open and close modal
	const handleOpen = () => setOpen(true);

	const handleClose = () => {
		// Prevent closing the modal if there's a pending transaction
		if (pendingTx) return;
		
		setIsClosing(true); // <-- Set closing status to true
		// Wait for the animation to complete before closing the modal
		setTimeout(() => {
			setOpen(false);
			setIsClosing(false); // <-- Reset closing status for the next cycle
		}, 500); // <-- Length of the slide-down animation
	};

	// console.log('proveLink', proveLink);

	// Prove Function
	async function proveFunction() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract(CHAINS[dareData[0]?.task.chainId]?.contract, NerveGlobalABI, signer);
		try {
			setPendingTx(true);
			const tx = await nerveGlobal.prove(dareData[0]?.task.id, proveLink);
			await tx.wait();
			if (tx.hash) {
				// wait 2 seconds
				await new Promise((resolve) => setTimeout(resolve, 2000));
				dispatch(proveTriggerSlice.actions.setProveTrigger(true));
				handleClose();
				setPendingTx(false);
			}
		} catch (error) {
			setPendingTx(false);
			console.log(error);
		}
	}

	// Change Network
	const handleNetworkChange = async () => {
		if (metaMask) {
			try {
				await metaMask.activate(Number(dareData[0]?.task?.chainId));
			} catch (error) {
				console.error(error);
			}
		} else {
			try {
				await metaMask.activate(getAddChainParameters(Number(dareData[0]?.task?.chainId)));
			} catch (error) {
				console.error(error);
			}
		}
	};

	return (
		<>
			<ModalButton theme={theme} onClick={handleOpen}>
				Prove Dare
			</ModalButton>
			<StyledModal open={open} onClose={handleClose}>
				<ConnectBox theme={theme} className={isClosing ? 'closing' : ''}>
					<Typography
						style={{ fontWeight: 'bold', margin: '0.0 auto 1.75rem auto', cursor: 'default' }}
						align="center"
						color={theme.palette.text.primary}
						id="modal-modal-title"
						variant="h6"
						component="h2"
					>
						Prove Dare
					</Typography>
					<StatisticBox>
						<OutlinedInput
							sx={{
								color: '#fff',
								height: '40px',
								'& .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: 'rgba(152, 161, 192, 1)' },
								'&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: 'rgba(152, 161, 192, 1)' },
							}}
							fullWidth={true}
							id="outlined-adornment-name"
							type="string"
							required={false}
							// value={name}
							// startAdornment={
							// 	<InputAdornment position="start" sx={{ color: 'gray' }}>
							// 		player/
							// 	</InputAdornment>
							// }
							onChange={(event) => setProveLink(event.target.value)}
						/>

						<StyledSection style={{ margin: '2rem auto 1.5rem auto' }}>
							{chainId !== dareData[0]?.task.chainId ? (
								<RegisterNameButton
									theme={theme}
									onClick={!pendingTx ? proveFunction : null}
									disabled={pendingTx} // Disable if pending or no changes
									startIcon={pendingTx && <CircularProgress color="secondary" thickness={2.5} size={20} />}
								>
									{pendingTx ? 'Pending' : 'Prove Dare'}
								</RegisterNameButton>
							) : (
								<RegisterNameButton
									theme={theme}
									onClick={handleNetworkChange}
									startIcon={pendingTx && <CircularProgress color="secondary" thickness={2.5} size={20} />}
								>
									Change Network
								</RegisterNameButton>
							)}
						</StyledSection>
					</StatisticBox>
				</ConnectBox>
			</StyledModal>
		</>
	);
};

export default ProveDare;
