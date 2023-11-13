import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';
import { Share } from '@mui/icons-material';
import { Box, Button, CircularProgress, IconButton, InputAdornment, Modal, OutlinedInput, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
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

const StyledOutlinedInput = styled(OutlinedInput)`
	height: 40px;
`;

const StatisticBox = styled(Box)`
	width: 90%;
	margin: 0 auto 0 auto;

	a {
		font-size: 16px;
		cursor: default;
	}

	// every next item gap top
	& > * + * {
		margin: 0.5rem auto 1rem auto;
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

const StyledIconButton = styled(IconButton)<{ theme: any }>`
	display: flex;
	color: ${({ theme }) => theme.palette.warning.main};
	background-color: transparent;
	font-size: 1rem;
	animation: blink 3s infinite;

	@keyframes blink {
		0% {
			opacity: 1;
		}
		50% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
`;

const RegisterButton = styled(Button)<{ theme: any }>`
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

interface RegisterSocialsProps {
	playerData: any;
	chainId: number;
	chainIdUrl: number;
}

const RegisterSocials: React.FC<RegisterSocialsProps> = ({ playerData, chainId, chainIdUrl }) => {
	const theme = useTheme();
	const { provider } = useWeb3React();
	const { enqueueSnackbar } = useSnackbar();
	const [open, setOpen] = useState(false);
	const [pendingTx, setPendingTx] = useState(false);

	// Modal toggles
	const handleClickOpen = () => setOpen(true);
	const handleClose = () => setOpen(false);

	// Extract the userSocialStat once for use in useState and useEffect
	const userSocialStat = playerData?.[0]?.userSocialStat;

	// Use a ref to track if the initial data has been loaded
	const initialDataLoaded = useRef(false);

	// State declarations
	const [socials, setSocials] = useState({
		instagram: userSocialStat?.instagram || '',
		twitter: userSocialStat?.twitter || '',
		tiktok: userSocialStat?.tiktok || '',
		twitch: userSocialStat?.twitch || '',
		youtube: userSocialStat?.youtube || '',
	});

	// Ref to keep track of the initial socials state for comparison
	const initialSocialsRef = useRef({});

	// Effect to update state when playerData prop changes
	useEffect(() => {
		// Use initialDataLoaded to ensure we only set the initial state once
		if (playerData?.[0]?.userSocialStat && !initialDataLoaded.current) {
			const userSocialStat = playerData[0].userSocialStat;
			const newSocials = {
				instagram: userSocialStat.instagram.split('/').pop() || '',
				twitter: userSocialStat.twitter.split('/').pop() || '',
				tiktok: userSocialStat.tiktok.split('/').pop() || '',
				twitch: userSocialStat.twitch.split('/').pop() || '',
				youtube: userSocialStat.youtube.split('/').pop() || '',
			};

			setSocials(newSocials);
			initialSocialsRef.current = newSocials; // Update the ref after setting the new state
			initialDataLoaded.current = true; // Indicate that the initial data has been loaded
		}
	}, [playerData]);

	// Function to compare current socials state with the initial state
	const hasChanges = useMemo(() => {
		return Object.keys(socials).some((platform) => socials[platform] !== initialSocialsRef.current[platform]);
	}, [socials]);

	// Handles input change for social media links
	const handleInputChange = (platform) => (event) => {
		setSocials((prevSocials) => ({
			...prevSocials,
			[platform]: event.target.value,
		}));
	};

	// Extract the social media links and indices
	const [links, indices] = Object.entries(socials).reduce(
		([linkList, indexList], [platform, handle], index) => {
			if (handle) {
				const baseUrl = `https://${platform}.com/` + (platform === 'tiktok' ? '@' : '');
				linkList.push(baseUrl + handle);
				indexList.push(index.toString());
			}
			return [linkList, indexList];
		},
		[[], []]
	);

	// Register Socials Function
	async function onRegisterSocial() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract(CHAINS[chainId]?.contract, NerveGlobalABI, signer);

		try {
			setPendingTx(true);
			const tx = await nerveGlobal.registerSocial(links, indices);
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
		<div>
			<StyledIconButton theme={theme} onClick={handleClickOpen}>
				<Share />
			</StyledIconButton>
			<StyledModal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<ConnectBox theme={theme}>
					<Typography
						style={{ fontWeight: 'bold', margin: '0.0 auto 1.75rem auto', cursor: 'default' }}
						align="center"
						color={theme.palette.text.primary}
						id="modal-modal-title"
						variant="h6"
						component="h2"
					>
						Register Socials
					</Typography>
					<StatisticBox>
						{['instagram', 'twitter', 'tiktok', 'twitch', 'youtube'].map((platform) => {
							const prefix = platform === 'tiktok' || platform === 'youtube' ? '@' : '';
							return (
								<div key={platform}>
									<a>{platform.charAt(0).toUpperCase() + platform.slice(1)}</a>
									<StyledOutlinedInput
										sx={{
											color: '#fff',
											'& .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: 'rgba(152, 161, 192, 1)' },
											'&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: 'rgba(152, 161, 192, 1)' },
										}}
										fullWidth={true}
										id={`outlined-adornment-${platform}`}
										type="text"
										required={false}
										value={socials[platform]}
										startAdornment={
											<InputAdornment
												sx={{ color: 'red', display: 'flex', cursor: 'default', '& .MuiTypography-root': { color: 'rgba(152, 161, 192, 1)' } }}
												position="start"
											>
												{`${platform}.com/${prefix}`}
											</InputAdornment>
										}
										onChange={handleInputChange(platform)}
									/>
								</div>
							);
						})}
						<StyledSection style={{ margin: '2rem auto 1.5rem auto' }}>
							{chainId === chainIdUrl ? (
								<RegisterButton
									theme={theme}
									onClick={!pendingTx ? onRegisterSocial : null}
									disabled={pendingTx || !hasChanges} // Disable if there is a pending transaction or no changes
									startIcon={pendingTx && <CircularProgress color="secondary" thickness={2.5} size={20} />}
								>
									{pendingTx ? 'Pending' : 'Register'}
								</RegisterButton>
							) : (
								<RegisterButton
									theme={theme}
									onClick={handleNetworkChange}
									startIcon={pendingTx && <CircularProgress color="secondary" thickness={2.5} size={20} />}
								>
									Change Network
								</RegisterButton>
							)}
						</StyledSection>
					</StatisticBox>
				</ConnectBox>
			</StyledModal>
		</div>
	);
};

export default RegisterSocials;
