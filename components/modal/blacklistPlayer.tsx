import styled from '@emotion/styled';
import { ReportGmailerrorred, WarningAmber } from '@mui/icons-material';
import { Box, Button, Checkbox, CircularProgress, Grid, IconButton, Modal, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import { CHAINS } from '../../utils/chains';

const StatisticBox = styled(Box)`
	width: 100%;
	margin: 0 auto 0 auto;
	text-align: center;
`;

const StyledGridFirst = styled(Grid)`
	display: flex;
	flex-direction: column;
	width: 85%;
	margin: 0 auto 0 auto;
	font-size: 16px;
	color: #fff;
	justify-content: center;

	a {
		color: #fff;
		font-size: 16px;
		margin: 0.5rem auto 0 auto;

		&:hover {
			cursor: default;
	}
`;

const StyledGridSecond = styled(Grid)`
	display: flex;
	flex-direction: row;
	font-size: 16px;
	color: #fff;
	justify-content: center;
	min-width: 150px;
	margin: 3rem auto 0 auto;

	a {
		color: #fff;
		font-size: 16px;
		align-self: center;

		&:hover {
			cursor: default;
		}
	}
`;

const StyledGridThird = styled(Grid)`
	display: flex;
	flex-direction: row;
	font-size: 16px;
	color: #fff;
	justify-content: center;
	margin-top: 3rem;
	min-width: 150px;
	margin: 1rem auto 0 auto;

	a {
		color: rgba(152, 161, 192, 1);
		font-size: 16px;
	}
`;

const StyledIconButon = styled(IconButton)({
	display: 'flex',
	color: 'red',
	fontSize: 16,
	animation: 'blink 3s infinite',

	'@keyframes blink': {
		'0%': { opacity: 1 },
		'50%': { opacity: 0 },
		'100%': { opacity: 1 },
	},
});

const StyledIconButtonDisabled = styled(IconButton)({
	'&:disabled': {
		display: 'flex',
		color: 'red',
		animation: 'blink 3s infinite',

		'@keyframes blink': {
			'0%': { opacity: 1 },
			'50%': { opacity: 0 },
			'100%': { opacity: 1 },
		},
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
	height: 450,
	width: 350,
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

const BuyButton = styled(Button)({
	display: 'flex',
	color: '#fff',
	textTransform: 'none',
	width: '100px',
	fontSize: 16,
	fontWeight: 400,
	lineHeight: 1.5,
	height: '100%',
	backgroundColor: 'red',
	borderRadius: 5,

	'&:hover': {
		backgroundColor: 'red',
	},

	'&:disabled': {
		color: 'rgba(152, 161, 192, 1)',
		backgroundColor: 'rgba(255,0,0,0.5)',
	},
});

export default function BlacklistPlayer(checksumAddress, chainId) {
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

	const [checked, setChecked] = useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
	};

	// Blacklist Player
	async function userToBlacklist() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract(CHAINS[chainId]?.contract, NerveGlobalABI, signer);
		try {
			setPendingTx(true);
			const tx = await nerveGlobal.setBlacklistUser(checksumAddress);
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
			<StyledIconButon onClick={handleClickOpen}>
				<ReportGmailerrorred />
			</StyledIconButon>
			<Modal open={open} onClose={handleClose}>
				<ConnectBox>
					<Typography
						style={{ fontSize: '25px', color: '#fff', fontWeight: 'bold', margin: '1.5rem auto 2rem auto', cursor: 'default' }}
						align="center"
						id="modal-modal-title"
					>
						Blacklist Player
					</Typography>
					<StatisticBox>
						<StyledGridFirst>
							<StyledIconButtonDisabled disabled={true}>
								<WarningAmber style={{ fontSize: '50px', margin: '0 auto 0 auto' }} />
							</StyledIconButtonDisabled>
							<a>Blacklisting of users cannot be undone. You can never receive a dare from the blacklisted user again.</a>
						</StyledGridFirst>
						<StyledGridSecond>
							<Checkbox
								checked={checked}
								onChange={handleChange}
								inputProps={{ 'aria-label': 'controlled' }}
								style={{ display: 'flex', color: '#fff' }}
							/>
							<a>Understood</a>
						</StyledGridSecond>
						<StyledGridThird>
							{checked ? (
								pendingTx ? (
									<BuyButton startIcon={<CircularProgress thickness={2.5} size={20} />} disabled={true}>
										Pending
									</BuyButton>
								) : (
									<BuyButton onClick={userToBlacklist}>Blacklist</BuyButton>
								)
							) : (
								<BuyButton disabled={true}>Blacklist</BuyButton>
							)}
						</StyledGridThird>
					</StatisticBox>
				</ConnectBox>
			</Modal>
		</div>
	);
}
