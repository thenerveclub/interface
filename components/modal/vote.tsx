import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Box, Button, CircularProgress, Modal, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import { voteTriggerSlice } from '../../state/trigger/voteTriggerSlice';
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

const StyledSwitchSection = styled.section`
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
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

const BuyButton = styled(Button)<{ theme: any }>`
	color: #fff;
	text-transform: none;
	font-size: 16px;
	border: none;
	line-height: 1.5;
	background-color: ${({ theme }) => theme.palette.warning.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	height: 40px;
	width: 125px;
	margin-left: 1rem;

	&:hover {
		background-color: ${({ theme }) => theme.palette.warning.main};
	}

	&:disabled {
		// color: ${({ theme }) => theme.palette.secondary.main};
		background-color: ${({ theme }) => theme.palette.warning.dark};
	}
`;

const ChangeNetworkButton = styled(Button)<{ theme: any }>`
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
		background-color: ${({ theme }) => theme.palette.warning.dark};
	}
`;

interface VoteTaskProps {
	dareData: any;
}

const VoteTask: React.FC<VoteTaskProps> = ({ dareData }) => {
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

	// Vote Function -> True
	async function voteFunctionTrue() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract(CHAINS[dareData[0]?.task?.chainId]?.contract, NerveGlobalABI, signer);
		try {
			setPendingTx(true);
			const tx = await nerveGlobal.vote(dareData[0]?.task?.id, true);
			await tx.wait();
			if (tx.hash) {
				// wait 2 seconds
				await new Promise((resolve) => setTimeout(resolve, 2000));
				dispatch(voteTriggerSlice.actions.setVoteTrigger(true));
				handleClose();
				setPendingTx(false);
			}
		} catch (error) {
			setPendingTx(false);
			console.log(error);
		}
	}

	// Vote Function -> False
	async function voteFunctionFalse() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract(CHAINS[dareData[0]?.task?.chainId]?.contract, NerveGlobalABI, signer);
		try {
			setPendingTx(true);
			const tx = await nerveGlobal.vote(dareData[0]?.task?.id, false);
			await tx.wait();
			if (tx.hash) {
				// wait 2 seconds
				await new Promise((resolve) => setTimeout(resolve, 2000));
				dispatch(voteTriggerSlice.actions.setVoteTrigger(true));
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
				Vote Task
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
						Vote Task
					</Typography>
					{chainId !== Number(dareData[0]?.task?.chainId) ? (
						<StyledSwitchSection style={{ margin: '2rem auto 1.5rem auto' }}>
							<Typography
								style={{ margin: '0.0 auto 1.75rem auto', cursor: 'default' }}
								align="center"
								color={theme.palette.text.primary}
								id="modal-modal-title"
								variant="body1"
								component="h2"
							>
								Please switch to the correct network to vote on this task.
							</Typography>
							<ChangeNetworkButton
								theme={theme}
								onClick={handleNetworkChange}
								startIcon={pendingTx && <CircularProgress color="secondary" thickness={2.5} size={20} />}
							>
								Change Network
							</ChangeNetworkButton>
						</StyledSwitchSection>
					) : (
						<StyledSection style={{ margin: '2rem auto 1.5rem auto' }}>
							{pendingTx ? (
								<BuyButton theme={theme} disabled>
									Pending
								</BuyButton>
							) : (
								<BuyButton theme={theme} onClick={voteFunctionTrue}>
									True
								</BuyButton>
							)}
							{pendingTx ? (
								<BuyButton theme={theme} disabled>
									Pending
								</BuyButton>
							) : (
								<BuyButton theme={theme} onClick={voteFunctionFalse}>
									False
								</BuyButton>
							)}
						</StyledSection>
					)}
				</ConnectBox>
			</StyledModal>
		</>
	);
};

export default VoteTask;
