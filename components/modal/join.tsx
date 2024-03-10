import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Button, CircularProgress, InputAdornment, Modal, OutlinedInput, Slide, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { forwardRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import useBalanceTracker from '../../hooks/useBalanceTracker';
import { CHAINS, getAddChainParameters } from '../../utils/chains';
import { metaMask } from '../../utils/connectors/metaMask';
import Connect from './menu/Connect';

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

const ModalButton = styled(Button)<{ theme: any }>`
	color: ${({ theme }) => theme.palette.text.primary};
	text-transform: none;
	font-size: 16px;
	border: none;
	line-height: 1.5;
	background-color: ${({ theme }) => theme.palette.warning.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	height: 40px;
	width: 90%;
	max-width: 350px;
	margin: 0 auto 0 auto;

	&:hover {
		background-color: ${({ theme }) => theme.palette.warning.main};
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
		background-color: ${({ theme }) => theme.palette.warning.dark};
	}
`;

const StyledTitle = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
`;

const MaxButton = styled(Button)<{ theme: any }>`
	color: ${({ theme }) => theme.palette.text.primary};
	text-transform: none;
	font-size: 1rem;
	border: none;
	line-height: 1.5;
	background-color: ${({ theme }) => theme.palette.success.contrastText};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	height: 40px;
`;

const MinButton = styled(Button)<{ theme: any }>`
	color: ${({ theme }) => theme.palette.text.primary};
	text-transform: none;
	font-size: 1rem;
	border: none;
	line-height: 1.5;
	background-color: ${({ theme }) => theme.palette.success.contrastText};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	height: 40px;
	margin-left: 1rem;
	margin-right: 0;
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

interface JoinDareProps {
	dareData: any;
}

const JoinDare: React.FC<JoinDareProps> = ({ dareData }) => {
	const theme = useTheme();
	const [open, setOpen] = useState(false);
	const { provider } = useWeb3React();
	const { enqueueSnackbar } = useSnackbar();

	// Redux
	const account = useSelector((state: { account: string }) => state.account);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const balance = useBalanceTracker(provider, account);

	// Handle open and close
	const handleClose = () => {
		setIsClosing(true); // <-- Set closing status to true
		// Wait for the animation to complete before closing the modal
		setTimeout(() => {
			setOpen(false);
			setIsClosing(false); // <-- Reset closing status for the next cycle
		}, 500); // <-- Length of the slide-down animation
	};

	const handleOpen = () => setOpen(true);

	// State
	const [value, setValue] = useState('0.00');
	const [isMax, setIsMax] = useState(false);
	const [isMin, setIsMin] = useState(true);
	const [pendingTx, setPendingTx] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	// Function to set max value
	const setMaxValue = () => {
		setValue(formatBalance(balance));
		setIsMax(true);
	};

	// Function to set min value
	const setMinValue = () => {
		setValue(formatNumber(dareData?.[0]?.task.entranceAmount));
		setIsMin(true);
	};

	// Update the value state and reset isMax flag when the input value changes
	const handleInputChange = (event) => {
		setValue(event.target.value);
		setIsMax(false);
	};

	// Set initial value
	useEffect(() => {
		if (dareData?.[0]?.task.entranceAmount) {
			setValue(formatNumber(dareData[0].task.entranceAmount));
		}
	}, [dareData]);

	// Determine if the input value is valid (not less than the minimum and not more than the balance)
	const isInputValid = () => {
		const numericValue = parseFloat(value);
		const minimumAmount = parseFloat(formatNumber(dareData?.[0]?.task.entranceAmount));
		const userBalance = parseFloat(formatBalance(balance));
		return numericValue >= minimumAmount && numericValue <= userBalance;
	};

	// Check if the input value exceeds the user's balance
	const isOverBalance = () => {
		return parseFloat(value) > parseFloat(formatNumber(balance));
	};

	// Format Balance
	function formatBalance(value) {
		return Number(value).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	// Format Number
	function formatNumber(value) {
		return Number(value / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	// Value
	const txValue = ethers.utils.parseEther(value || '0');

	// Join Function
	async function onJoin() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract(CHAINS[dareData[0]?.task?.chainId]?.contract, NerveGlobalABI, signer);
		try {
			setPendingTx(true);
			const tx = await nerveGlobal.join(dareData[0]?.task?.id, { value: txValue });
			await tx.wait();
			if (tx.hash) {
				setPendingTx(false);
				handleClose();
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
			{/* {account ? ( */}
			<ModalButton theme={theme} onClick={handleOpen}>
				Join Task
			</ModalButton>
			{/* ) : (
				<Connect />
			)} */}
			<StyledModal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<ConnectBox theme={theme} className={isClosing ? 'closing' : ''}>
					<Typography
						style={{ fontWeight: 'bold', margin: '0.0 auto 0.75rem auto', cursor: 'default' }}
						align="center"
						color={theme.palette.text.primary}
						id="modal-modal-title"
						variant="h6"
						component="h2"
					>
						Join Dare
					</Typography>

					<StyledTitle theme={theme}>
						<div>
							<a style={{ color: theme.palette.text.primary, marginRight: '0.25rem' }}>Amount</a>
							<Tooltip title={`${dareData?.[0]?.task.entranceAmount} mandatory contribution for participation.`} placement="top">
								<InfoOutlinedIcon style={{ fontSize: '1rem', color: theme.palette.secondary.main, cursor: 'default' }} />
							</Tooltip>
						</div>

						<a>Balance: {formatBalance(balance)}</a>
					</StyledTitle>
					<OutlinedInput
						id="outlined-adornment-amount"
						onChange={handleInputChange}
						endAdornment={
							<InputAdornment position="end">
								<a style={{ color: theme.palette.text.primary }}>{CHAINS[dareData[0]?.task?.chainId]?.nameToken}</a>
								<MaxButton theme={theme} onClick={setMaxValue}>
									Max
								</MaxButton>
								<MinButton theme={theme} onClick={setMinValue}>
									Min
								</MinButton>
							</InputAdornment>
						}
						placeholder={formatNumber(dareData?.[0]?.task.entranceAmount)}
						value={value}
						type="string"
						style={{ display: 'flex', margin: '0.5rem 0 1rem 0' }}
						inputProps={{
							style: {
								textAlign: 'right',
								fontSize: '1rem',
								color: theme.palette.text.primary,
							},
						}}
						sx={{
							color: theme.palette.text.primary,
							'& .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: theme.palette.secondary.main },
							'&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: theme.palette.secondary.main },
						}}
					/>

					{!isInputValid() &&
						(isOverBalance() ? (
							<Typography color="error">Value exceeds your balance</Typography>
						) : (
							<Typography color="error">Minimum amount is {formatNumber(dareData?.[0]?.task.entranceAmount)}</Typography>
						))}

					<StyledSection style={{ margin: '2rem auto 1.5rem auto' }}>
						{chainId !== Number(dareData[0]?.task?.chainId) ? (
							pendingTx ? (
								<BuyButton theme={theme} disabled>
									Pending
								</BuyButton>
							) : (
								<BuyButton theme={theme} onClick={onJoin} disabled={!isInputValid()}>
									Join
								</BuyButton>
							)
						) : (
							<ChangeNetworkButton
								theme={theme}
								onClick={handleNetworkChange}
								startIcon={pendingTx && <CircularProgress color="secondary" thickness={2.5} size={20} />}
							>
								Change Network
							</ChangeNetworkButton>
						)}
					</StyledSection>
				</ConnectBox>
			</StyledModal>
		</>
	);
};

export default JoinDare;
