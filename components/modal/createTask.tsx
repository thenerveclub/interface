import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import { Box, Button, CircularProgress, InputAdornment, Modal, OutlinedInput, Tooltip, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import useBalanceTracker from '../../hooks/useBalanceTracker';
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
`;

const MaxButton = styled(Button)<{ theme: any }>`
	color: ${({ theme }) => theme.palette.text.primary};
	text-transform: none;
	font-size: 1rem;
	border: none;
	margin-left: 1rem;
	line-height: 1.5;
	background-color: ${({ theme }) => theme.palette.success.contrastText};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	height: 40px;
`;

const StatisticBox = styled(Box)`
	width: 90%;
	margin: 0 auto 0 auto;

	a {
		font-size: 16px;
		cursor: default;
	}
`;

const StyledTitle = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
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

interface CreateTaskProps {
	registerStatus: any;
	chainIdUrl: number;
	isNetworkAvailable: boolean;
}

const CreateTask: React.FC<CreateTaskProps> = ({ registerStatus, chainIdUrl, isNetworkAvailable }) => {
	const theme = useTheme();
	const { provider } = useWeb3React();
	const { enqueueSnackbar } = useSnackbar();
	const balance = useBalanceTracker();

	// Redux
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	// State
	const [open, setOpen] = useState(false);
	const [pendingTx, setPendingTx] = useState(false);
	const [value, setValue] = useState('0.00');
	const [description, setDescription] = useState(null);
	const [duration, setDuration] = useState(null);
	const [isMax, setIsMax] = useState(false);

	// Function to set max value
	const setMaxValue = () => {
		setValue(formatBalance(balance));
		setIsMax(true);
	};

	// Update the value state and reset isMax flag when the input value changes
	const handleInputChange = (event) => {
		setValue(event.target.value || '0.00');
		setIsMax(false);
	};

	// Value
	const txValue = ethers.utils.parseEther(value || '0');

	// Handle open and close modal
	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
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

	// Create Dare Function
	async function onCreateTask() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract(CHAINS[chainId]?.contract, NerveGlobalABI, signer);
		try {
			setPendingTx(true);
			const tx = await nerveGlobal.createTask(registerStatus, description, duration, 'en', '0', '0', {
				value: txValue,
			});
			enqueueSnackbar('Transaction signed succesfully!', {
				variant: 'success',
			});
			await tx.wait();
			if (tx.hash) {
				enqueueSnackbar('Transaction mined succesfully!', {
					variant: 'success',
				});
				setPendingTx(false);
			}
		} catch (error) {
			enqueueSnackbar('Transaction failed!', {
				variant: 'error',
			});
			setPendingTx(false);
			console.log(error);
		}
	}

	// Change Network
	const handleNetworkChange = async () => {
		if (metaMask) {
			try {
				await metaMask.activate(chainIdUrl);
			} catch (error) {
				console.error(error);
			}
		} else {
			try {
				await metaMask.activate(getAddChainParameters(chainIdUrl));
			} catch (error) {
				console.error(error);
			}
		}
	};

	return (
		<>
			<ModalButton theme={theme} onClick={handleClickOpen}>
				Create Dare
			</ModalButton>
			<StyledModal open={open} onClose={handleClose}>
				<ConnectBox theme={theme}>
					<Typography
						style={{ fontWeight: 'bold', margin: '0.0 auto 1.75rem auto', cursor: 'default' }}
						align="center"
						color={theme.palette.text.primary}
						id="modal-modal-title"
						variant="h6"
						component="h2"
					>
						Create Task
					</Typography>
					<StatisticBox>
						<StyledTitle theme={theme}>
							<div>
								<a style={{ color: theme.palette.text.primary, marginRight: '0.25rem' }}>Entry amount</a>
								<Tooltip title="Mandatory contribution for participation." placement="top">
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
									<a style={{ color: theme.palette.text.primary }}>{isNetworkAvailable ? CHAINS[chainIdUrl]?.nameToken : 'MATIC'}</a>
									<MaxButton theme={theme} onClick={setMaxValue}>
										Max
									</MaxButton>
								</InputAdornment>
							}
							placeholder={'0.00'}
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

						<a>Time in minutes</a>
						<OutlinedInput
							sx={{
								color: '#fff',
								'& .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: 'rgba(152, 161, 192, 1)' },
								'&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: 'rgba(152, 161, 192, 1)' },
							}}
							fullWidth={true}
							id="outlined-adornment-name"
							type="name"
							required={false}
							onChange={(event) => setDuration(event.target.value)}
						/>
						<a>Task description</a>
						<OutlinedInput
							sx={{
								color: '#fff',
								'& .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: 'rgba(152, 161, 192, 1)' },
								'&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: 'rgba(152, 161, 192, 1)' },
							}}
							fullWidth={true}
							id="outlined-adornment-name"
							type="name"
							required={false}
							multiline={true}
							rows={3}
							onChange={(event) => setDescription(event.target.value)}
						/>
						<StyledSection style={{ margin: '2rem auto 1.5rem auto' }}>
							{chainId === chainIdUrl ? (
								pendingTx ? (
									<BuyButton theme={theme}>Pending</BuyButton>
								) : (
									<BuyButton theme={theme} onClick={onCreateTask} disabled={value === '0' || value === '0.0' || value === '0.00' || value === '0.'}>
										Create Task
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
					</StatisticBox>
				</ConnectBox>
			</StyledModal>
		</>
	);
};

export default CreateTask;
