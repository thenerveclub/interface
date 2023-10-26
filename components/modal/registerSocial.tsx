import styled from '@emotion/styled';
import { Share } from '@mui/icons-material';
import { Box, Button, CircularProgress, IconButton, InputAdornment, Modal, OutlinedInput, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import { CHAINS } from '../../utils/chains';

const StatisticBox = styled(Box)`
	width: 90%;
	margin: 0 auto 0 auto;

	a {
		font-size: 16px;
		cursor: default;
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

const StyledIconButon = styled(IconButton)({
	display: 'flex',
	color: '#FF6B00',
	fontSize: 16,
	animation: 'blink 3s infinite',

	'@keyframes blink': {
		'0%': { opacity: 1 },
		'50%': { opacity: 0 },
		'100%': { opacity: 1 },
	},
});

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

export default function RegisterSocial() {
	const [open, setOpen] = useState(false);
	const { provider } = useWeb3React();
	const { enqueueSnackbar } = useSnackbar();
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	const handleClickOpen = () => {
		setOpen(true);
	};

	const handleClose = () => {
		setOpen(false);
	};
	const [pendingTx, setPendingTx] = useState(false);
	const [instagram, setInstagram] = useState(null);
	const [twitter, setTwitter] = useState(null);
	const [tiktok, setTikTok] = useState(null);
	const [twitch, setTwitch] = useState(null);
	const [youtube, setYoutube] = useState(null);

	// check changed values
	const [links, setLinks] = useState([]);
	const [indices, setIndices] = useState([]);

	useEffect(() => {
		let newLinks = [];
		let newIndices = [];

		if (instagram) {
			newLinks.push(`https://www.instagram.com/${instagram}`);
			newIndices.push('1');
		}

		if (twitter) {
			newLinks.push(`https://twitter.com/${twitter}`);
			newIndices.push('2');
		}

		if (tiktok) {
			newLinks.push(`https://www.tiktok.com/@${tiktok}`);
			newIndices.push('3');
		}

		if (twitch) {
			newLinks.push(`https://www.twitch.tv/${twitch}`);
			newIndices.push('4');
		}

		if (youtube) {
			newLinks.push(`https://www.youtube.com/@${youtube}`);
			newIndices.push('5');
		}

		setLinks(newLinks);
		setIndices(newIndices);
	}, [instagram, twitter, tiktok, twitch, youtube]);

	// Join Function
	async function onRegisterSocial() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract(CHAINS[chainId]?.contract, NerveGlobalABI, signer);
		try {
			setPendingTx(true);
			const tx = await nerveGlobal.registerSocial(links, indices);
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
				<Share />
			</StyledIconButon>
			<Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<ConnectBox>
					<Typography
						style={{ fontSize: '25px', color: '#fff', fontWeight: 'bold', margin: '1.5rem auto 2rem auto', cursor: 'default' }}
						align="center"
						id="modal-modal-title"
					>
						Register Socials
					</Typography>
					<StatisticBox>
						<a>Instagram</a>
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
									instagram.com/
								</InputAdornment>
							}
							onChange={(event) => setInstagram(event.target.value)}
						/>
						<a>Twitter</a>
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
									twitter.com/
								</InputAdornment>
							}
							onChange={(event) => setTwitter(event.target.value)}
						/>
						<a>TikTok</a>
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
									tiktok.com/@
								</InputAdornment>
							}
							onChange={(event) => setTikTok(event.target.value)}
						/>
						<a>Twitch</a>
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
									twitch.tv/
								</InputAdornment>
							}
							onChange={(event) => setTwitch(event.target.value)}
						/>
						<a>YouTube</a>
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
									youtube.com/@
								</InputAdornment>
							}
							onChange={(event) => setYoutube(event.target.value)}
						/>
						<StyledSection style={{ margin: '2rem auto 1.5rem auto' }}>
							<CancelButton onClick={handleClose}>Cancel</CancelButton>
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
		</div>
	);
}
