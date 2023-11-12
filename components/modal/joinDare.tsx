import styled from '@emotion/styled';
import { Box, Button, InputAdornment, Modal, OutlinedInput, Slide, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { forwardRef, useState } from 'react';
import { useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import useBalanceTracker from '../../hooks/useBalanceTracker';
import { CHAINS } from '../../utils/chains';

const style = {
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: '#292929',
	border: '0.5px solid rgba(152, 161, 192, 0.1)',
	borderRadius: '20px',
	boxShadow: 24,
	pt: 2,
	px: 4,
	pb: 3,
};

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

const StyledBox = styled(Box)<{ theme: any }>`
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

export default function JoinDare() {
	const theme = useTheme();
	const [open, setOpen] = useState(false);
	const { provider } = useWeb3React();
	const { enqueueSnackbar } = useSnackbar();
	const [value, setValue] = useState(null);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const balance = useBalanceTracker();

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const [pendingTx, setPendingTx] = useState(false);

	// Get Task ID
	const path = (global.window && window.location.pathname)?.toString() || '';
	const taskNumber = path.split('/').pop();
	const Id = '0x'.concat(taskNumber);

	// Join Function
	async function onJoin() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract(CHAINS[chainId]?.contract, NerveGlobalABI, signer);
		try {
			setPendingTx(true);
			const tx = await nerveGlobal.joinTask(Id, { value: value });
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
				Join Task
			</ModalButton>
			<Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<StyledBox theme={theme} sx={style}>
					<Typography id="modal-modal-title" variant="h6" component="h2">
						Connect a wallet
					</Typography>
					<OutlinedInput
						id="outlined-adornment-amount"
						onChange={(event) => setValue(event.target.value)}
						startAdornment={<InputAdornment position="start">$</InputAdornment>}
						label="Amount"
					/>
					<Typography id="modal-modal-description" sx={{ fontSize: '12px', mt: 2 }}>
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
					<Button onClick={handleClose}>Cancel</Button>
					{pendingTx ? <Button>Pending</Button> : <Button onClick={onJoin}>Join</Button>}
				</StyledBox>
			</Modal>
		</>
	);
}
