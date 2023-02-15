import styled from '@emotion/styled';
import { Box, CircularProgress, Modal, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import NerveGlobalABI from '../../abi/NerveGlobal.json';
import { CheckNameRegister } from '../CheckNameRegister';

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
	boxShadow: '0 0 5px #03A11F',
	textTransform: 'none',
	fontSize: 16,
	border: '1px solid',
	lineHeight: 1.5,
	backgroundColor: 'transparent',
	borderColor: '#03A11F',
	borderRadius: 5,
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

const CancelButton = styled(Button)({
	color: '#fff',
	textTransform: 'none',
	width: '100px',
	fontSize: 16,
	fontWeight: 400,
	lineHeight: 1.5,
	height: '100%',
	backgroundColor: 'rgba(161, 31, 3, 1)',
	borderRadius: 5,
	'&:hover': {
		backgroundColor: 'rgba(161, 31, 3, 1)',
		transition: 'all 0.75s ease',
	},
	'&:active': {
		boxShadow: 'none',
		backgroundColor: '#0062cc',
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
	height: 500,
	width: 350,
	backgroundColor: 'grey',
	border: '0.25px solid rgba(76, 76, 90, 1)',
	borderRadius: '10px',
	boxShadow: '0 0 25px rgba(76,130,251,0.25)',
	pt: 4,
	px: 2,
	pb: 2,
});

export default function CreateTask() {
	const [open, setOpen] = useState(false);
	const { provider } = useWeb3React();
	const { enqueueSnackbar } = useSnackbar();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const [pendingTx, setPendingTx] = useState(false);
	const [minimumValue, setMinimumValue] = useState('0');
	const [registerStatus] = CheckNameRegister();
	const [description, setDescription] = useState(null);
	const [duration, setDuration] = useState(null);

	const value = ethers.utils.parseEther(minimumValue);

	// Join Function
	async function onRegisterSocial() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract('0x91596B44543016DDb5D410A51619D5552961a23b', NerveGlobalABI, signer);
		try {
			setPendingTx(true);
			await nerveGlobal.createTask(registerStatus, description, duration, 'en', '0', '0', {
				value: value,
				gasLimit: 250000,
			});
			enqueueSnackbar('Transaction signed succesfully!', {
				variant: 'success',
			});
		} catch (error) {
			enqueueSnackbar('Transaction failed!', {
				variant: 'error',
			});
			setPendingTx(false);
		}
	}

	return (
		<div>
			<ModalButton disabled={false} variant="outlined" onClick={handleClickOpen}>
				Create Task
			</ModalButton>
			<Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<ConnectBox>
					<Typography
						style={{ fontSize: '25px', color: '#fff', fontWeight: 'bold', margin: '0 auto 2.5rem auto' }}
						align="center"
						id="modal-modal-title"
					>
						Create Task
					</Typography>
					<OutlinedInput
						fullWidth={true}
						id="outlined-adornment-name"
						type="name"
						required={false}
						startAdornment={<InputAdornment position="start">$</InputAdornment>}
						onChange={(event) => setMinimumValue(event.target.value)}
					/>
					<OutlinedInput
						fullWidth={true}
						id="outlined-adornment-name"
						type="name"
						required={false}
						onChange={(event) => setDescription(event.target.value)}
					/>
					<OutlinedInput
						fullWidth={true}
						id="outlined-adornment-name"
						type="name"
						required={false}
						onChange={(event) => setDuration(event.target.value)}
					/>
					<StyledSection style={{ margin: '2.5rem auto 0 auto' }}>
						<CancelButton onClick={handleClose}>Cancel</CancelButton>
						{pendingTx ? (
							<BuyButton startIcon={<CircularProgress thickness={2.5} size={20} />} disabled={true}>
								Pending
							</BuyButton>
						) : (
							<BuyButton onClick={onRegisterSocial}>Register</BuyButton>
						)}
					</StyledSection>
				</ConnectBox>
			</Modal>
		</div>
	);
}
