import styled from '@emotion/styled';
import { Box, Button, CircularProgress, InputAdornment, Modal, OutlinedInput, Typography } from '@mui/material';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
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
			await nerveGlobal.registerSocial(links, indices, { gasLimit: 250000 });
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
				Register Socials
			</ModalButton>
			<Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<ConnectBox>
					<Typography
						style={{ fontSize: '25px', color: '#fff', fontWeight: 'bold', margin: '0 auto 2.5rem auto' }}
						align="center"
						id="modal-modal-title"
					>
						Register Name
					</Typography>
					<OutlinedInput
						fullWidth={true}
						id="outlined-adornment-name"
						type="name"
						required={false}
						onChange={(event) => setInstagram(event.target.value)}
					/>
					<OutlinedInput
						fullWidth={true}
						id="outlined-adornment-name"
						type="name"
						required={false}
						onChange={(event) => setTwitter(event.target.value)}
					/>
					<OutlinedInput
						fullWidth={true}
						id="outlined-adornment-name"
						type="name"
						required={false}
						startAdornment={<InputAdornment position="start">@</InputAdornment>}
						onChange={(event) => setTikTok(event.target.value)}
					/>
					<OutlinedInput
						fullWidth={true}
						id="outlined-adornment-name"
						type="name"
						required={false}
						onChange={(event) => setTwitch(event.target.value)}
					/>
					<OutlinedInput
						fullWidth={true}
						id="outlined-adornment-name"
						type="name"
						required={false}
						title='Please enter your youtube channel name. Example: "NerveGlobal"'
						startAdornment={<InputAdornment position="start">@</InputAdornment>}
						onChange={(event) => setYoutube(event.target.value)}
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
