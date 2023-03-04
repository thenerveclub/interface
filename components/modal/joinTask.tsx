import { Box, Button, InputAdornment, Modal, OutlinedInput, Slide, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { forwardRef, useState } from 'react';
import { useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
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

const Transition = forwardRef(function Transition(
	props: TransitionProps & {
		children: React.ReactElement<any, any>;
	},
	ref: React.Ref<unknown>
) {
	return <Slide direction="up" ref={ref} {...props} />;
});

export default function JoinTask() {
	const [open, setOpen] = useState(false);
	const { provider } = useWeb3React();
	const { enqueueSnackbar } = useSnackbar();
	const [value, setValue] = useState(null);
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

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
			const tx = await nerveGlobal.joinTask(Id, { value: value, gasLimit: 250000 });
			enqueueSnackbar('Transaction signed succesfully!', {
				variant: 'success',
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
		<div>
			<Button fullWidth={true} variant="outlined" onClick={handleClickOpen}>
				Join Task
			</Button>
			<Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<Box sx={style}>
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
				</Box>
			</Modal>
		</div>
	);
}
