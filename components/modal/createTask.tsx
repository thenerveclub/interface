import styled from '@emotion/styled';
import { Box, Button, CircularProgress, InputAdornment, Modal, OutlinedInput, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import { CHAINS } from '../../utils/chains';
import { CheckNameRegister } from '../../utils/validation/checkNameRegister';

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

const ModalButton = styled(Button)({
	color: '#fff',
	textTransform: 'none',
	fontSize: 16,
	border: 'none',
	lineHeight: 1.5,
	backgroundColor: 'rgba(255, 127.5,0, 1)	',
	borderRadius: 15,
	height: '40px',
	width: '125px',
	marginLeft: '1rem',

	'&:hover': {
		backgroundColor: 'transparent',
		borderColor: 'rgba(3, 161, 31, 0.5)',
		boxShadow: '0 0 0.5px #03A11F',
		transition: 'all 0.75s ease',
	},

	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#0062cc',
	},
});

const BuyButton = styled(Button)({
	color: '#000',
	textTransform: 'none',
	width: '100px',
	fontSize: 16,
	fontWeight: 400,
	lineHeight: 1.5,
	height: '100%',
	backgroundColor: 'rgba(3, 161, 31, 0.75)',
	borderRadius: 5,
	'&:hover': {
		backgroundColor: 'rgba(3, 161, 31, 0.75)',
		transition: 'all 0.75s ease',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#0062cc',
	},
});

const StatisticBox = styled(Box)`
	width: 90%;
	margin: 0 auto 0 auto;

	a {
		font-size: 16px;
		cursor: default;
	}
`;

const ConnectBox = styled(Box)({
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	margin: '0 auto 0 auto',
	justifyContent: 'center',
	alignItems: 'center',
	padding: '1rem',
	height: 'auto',
	width: 400,
	backgroundColor: 'rgba(6, 16, 25, 1)',
	border: '0.25px solid rgba(76, 76, 90, 1)',
	borderRadius: '10px',
	boxShadow: '0 0 25px rgba(76,130,251,0.25)',
	pt: 4,
	px: 2,
	pb: 2,

	animation: 'slide-up 0.25s ease-out forwards',
	'@keyframes slide-up': {
		'0%': {
			transform: 'translateX(-50%) translateY(100%)',
		},
		'150%': {
			transform: 'translateX(-50%) translateY(0)',
		},
	},
});

export default function CreateTask() {
	const [open, setOpen] = useState(false);
	const { provider } = useWeb3React();
	const { enqueueSnackbar } = useSnackbar();
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const [pendingTx, setPendingTx] = useState(false);
	const [minimumValue, setMinimumValue] = useState('0');
	const [registerStatus] = CheckNameRegister();
	const [description, setDescription] = useState(null);
	const [duration, setDuration] = useState(null);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};

	const value = ethers.utils.parseEther(minimumValue);

	// Join Function
	async function onRegisterSocial() {
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
			<ModalButton onClick={handleClickOpen}>Create Task</ModalButton>
			<Modal open={open} onClose={handleClose}>
				<ConnectBox>
					<Typography
						style={{ fontSize: '25px', color: '#fff', fontWeight: 'bold', margin: '1.5rem auto 2rem auto', cursor: 'default' }}
						align="center"
						id="modal-modal-title"
					>
						Create Task
					</Typography>
					<StatisticBox>
						<a>Start amount</a>
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
								<BuyButton startIcon={<CircularProgress thickness={2.5} size={20} />} disabled={true}>
									Pending
								</BuyButton>
							) : (
								<BuyButton onClick={onRegisterSocial}>Register</BuyButton>
							)}
						</StyledSection>
					</StatisticBox>
				</ConnectBox>
			</Modal>
		</>
	);
}
