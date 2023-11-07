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
import { CHAINS } from '../../utils/chains';

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
	height: 40px;
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

const StatisticBox = styled(Box)`
	width: 90%;
	margin: 0 auto 0 auto;

	a {
		font-size: 16px;
		cursor: default;
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
	height: auto;
	width: 400px;
	background-color: ${({ theme }) => theme.palette.background.default};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};
	box-shadow: 0 0 25px rgba(76, 130, 251, 0.25);
	padding: 2rem;
	animation: slide-up 0.25s ease-out forwards;

	@keyframes slide-up {
		0% {
			transform: translateX(-50%) translateY(100%);
		}
		150% {
			transform: translateX(-50%) translateY(0);
		}
	}
`;

interface CreateTaskProps {
	registerStatus: any;
};

const CreateTask: React.FC<CreateTaskProps> = ({ registerStatus }) => {
	const theme = useTheme();
	const [open, setOpen] = useState(false);
	const { provider } = useWeb3React();
	const { enqueueSnackbar } = useSnackbar();
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const [pendingTx, setPendingTx] = useState(false);
	const [minimumValue, setMinimumValue] = useState('0');
	const [description, setDescription] = useState(null);
	const [duration, setDuration] = useState(null);
	const balance = useBalanceTracker();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const value = ethers.utils.parseEther(minimumValue);

	// Create Dare Function
	async function onCreateTask() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract(CHAINS[chainId]?.contract, NerveGlobalABI, signer);
		try {
			setPendingTx(true);
			const tx = await nerveGlobal.createTask(registerStatus, description, duration, 'en', '0', '0', {
				value: value,
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

	return (
		<>
			<ModalButton theme={theme} onClick={handleClickOpen}>
				Create Dare
			</ModalButton>
			<Modal open={open} onClose={handleClose}>
				<ConnectBox theme={theme}>
					<Typography
						style={{ fontSize: '25px', color: theme.palette.text.primary, fontWeight: 'bold', margin: '1.5rem auto 2rem auto', cursor: 'default' }}
						align="center"
						id="modal-modal-title"
					>
						Create Task
					</Typography>
					<StatisticBox>
						<a>Entry amount</a>
						<Tooltip title="Mandatory contribution for participation." placement="top">
							<InfoOutlinedIcon style={{ fontSize: '1rem', color: theme.palette.secondary.main, cursor: 'default' }} />
						</Tooltip>

						<a>balance: {balance}</a>
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
							startAdornment={
								<InputAdornment
									sx={{ color: 'red', display: 'flex', cursor: 'default', '& .MuiTypography-root': { color: 'rgba(152, 161, 192, 1)' } }}
									position="start"
								>
									$
								</InputAdornment>
							}
							onChange={(event) => setMinimumValue(event.target.value)}
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
							{pendingTx ? (
								<BuyButton theme={theme} startIcon={<CircularProgress thickness={2.5} size={20} />} disabled={true}>
									Pending
								</BuyButton>
							) : (
								<BuyButton theme={theme} onClick={onCreateTask}>
									Create Task
								</BuyButton>
							)}
						</StyledSection>
					</StatisticBox>
				</ConnectBox>
			</Modal>
		</>
	);
};

export default CreateTask;
