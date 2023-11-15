import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { ReportGmailerrorred, WarningAmber } from '@mui/icons-material';
import { Box, Button, Checkbox, CircularProgress, Grid, IconButton, Modal, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
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

const StatisticBox = styled(Box)`
	width: 100%;
	margin: 0 auto 0 auto;
	text-align: center;
`;

const StyledGridFirst = styled(Grid)<{ theme: any }>`
	display: flex;
	flex-direction: column;
	margin: 0 auto 0 auto;
	font-size: 16px;
	color: ${({ theme }) => theme.palette.text.primary};

	a {
		color: ${({ theme }) => theme.palette.text.primary};
		font-size: 0.9375rem;
		padding: 2rem 1rem;
		text-decoration: none;
		text-transform: none;

		&:hover {
			cursor: default;
		}
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

const StyledIconButton = styled(IconButton)<{ theme: any }>`
	display: flex;
	color: ${({ theme }) => theme.palette.error.main};
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

const BlacklistButton = styled(Button)<{ theme: any }>`
	display: flex;
	color: ${({ theme }) => theme.palette.text.primary};
	text-transform: none;
	width: 150px;
	font-size: 1rem;
	font-weight: 400;
	line-height: 1.5;
	height: 100%;
	background-color: ${({ theme }) => theme.palette.error.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};

	&:hover {
		background-color: ${({ theme }) => theme.palette.error.main};
	}

	&:disabled {
		color: ${({ theme }) => theme.palette.secondary.main};
		background-color: ${({ theme }) => theme.palette.error.dark};
	}
`;

interface BlacklistPlayerProps {
	checksumAddress: string;
	chainId: number;
	chainIdUrl: number;
}

const BlacklistPlayer: React.FC<BlacklistPlayerProps> = ({ checksumAddress, chainId, chainIdUrl }) => {
	const theme = useTheme();

	// State
	const [open, setOpen] = useState(false);
	const { provider } = useWeb3React();
	const { enqueueSnackbar } = useSnackbar();
	const [isClosing, setIsClosing] = useState(false);

	const handleOpen = () => setOpen(true);

	const handleClose = () => {
		setIsClosing(true); // <-- Set closing status to true
		// Wait for the animation to complete before closing the modal
		setTimeout(() => {
			setOpen(false);
			setIsClosing(false); // <-- Reset closing status for the next cycle
		}, 500); // <-- Length of the slide-down animation
	};

	const [pendingTx, setPendingTx] = useState(false);

	const [checked, setChecked] = useState(false);

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		setChecked(event.target.checked);
	};

	// Blacklist Player
	async function userToBlacklist() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract(CHAINS[chainIdUrl]?.contract, NerveGlobalABI, signer);
		try {
			setPendingTx(true);
			const tx = await nerveGlobal.setBlacklistUser(checksumAddress);
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
			<StyledIconButton theme={theme} onClick={handleOpen}>
				<ReportGmailerrorred />
			</StyledIconButton>
			<StyledModal open={open} onClose={handleClose}>
				<ConnectBox theme={theme} className={isClosing ? 'closing' : ''}>
					<Typography
						style={{ fontWeight: 'bold', margin: '0.0 auto 1.75rem auto', cursor: 'default' }}
						align="center"
						color={theme.palette.text.primary}
						id="modal-modal-title"
						variant="h6"
						component="h2"
					>
						Blacklist Player
					</Typography>
					<StatisticBox>
						<StyledGridFirst theme={theme}>
							<StyledIconButtonDisabled disabled={true}>
								<WarningAmber style={{ fontSize: '50px', margin: '0 auto 0 auto', color: theme.palette.error.main }} />
							</StyledIconButtonDisabled>
							<a>
								Please be advised that blacklisting a user is a final action. After implementation, it will no longer be possible to receive dares
								from the blacklisted individual.
							</a>
						</StyledGridFirst>
						<StyledGridSecond>
							<Checkbox
								checked={checked}
								onChange={handleChange}
								inputProps={{ 'aria-label': 'controlled' }}
								style={{ display: 'flex', color: '#fff', backgroundColor: 'transparent' }}
							/>
							<a>Understood</a>
						</StyledGridSecond>
						<StyledGridThird>
							{chainId === chainIdUrl ? (
								<BlacklistButton
									theme={theme}
									onClick={!pendingTx && checked ? userToBlacklist : null}
									disabled={!checked || pendingTx}
									startIcon={pendingTx && <CircularProgress color="secondary" thickness={2.5} size={20} />}
								>
									{pendingTx ? 'Pending' : 'Blacklist'}
								</BlacklistButton>
							) : (
								<BlacklistButton
									theme={theme}
									onClick={handleNetworkChange}
									startIcon={pendingTx && <CircularProgress color="secondary" thickness={2.5} size={20} />}
								>
									Change Network
								</BlacklistButton>
							)}
						</StyledGridThird>
					</StatisticBox>
				</ConnectBox>
			</StyledModal>
		</div>
	);
};

export default BlacklistPlayer;
