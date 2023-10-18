import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import { Box, Button, ButtonGroup, Modal, Typography } from '@mui/material';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { setTheme, setUseSystemSetting } from '../../state/theme/themeSlice';

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

const ConnectButton = styled(Button)({
	display: 'flex',
	alignItems: 'center', // Vertically aligns all content
	justifyContent: 'center',
	color: 'rgba(128, 128, 138, 1)',
	textTransform: 'none',
	fontWeight: 400,
	height: 40,
	backgroundColor: 'rgba(38, 38, 56, 1)',
	border: '1px solid rgba(74, 74, 98, 1)',
	borderRadius: 15,
	width: '100%',
	transition: 'all 0.5s ease-in-out',

	'&:hover': {
		backgroundColor: 'rgba(58, 58, 76, 1)',
	},
});

const StyledButton = styled(Button)({
	display: 'flex',
	alignItems: 'center', // Vertically aligns all content
	justifyContent: 'center',
	color: 'rgba(128, 128, 138, 1)',
	textTransform: 'none',
	fontWeight: 400,
	height: 40,
	backgroundColor: 'transparent',
	border: 'none !important',
	borderRadius: 15,
	width: '100%',
	transition: 'all 0.5s ease-in-out',

	'&:hover': {
		color: 'rgba(255, 255, 255, 1)',
		backgroundColor: 'transparent',
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
	height: 400,
	width: 350,
	backgroundColor: 'rgba(6, 16, 25, 1)',
	border: '1px solid rgba(255, 255, 255, 0.2)', // Subtle border
	borderRadius: '15px',
	boxShadow: '0 0 25px rgba(76,130,251,0.25)',
	pt: 4,
	px: 2,
	pb: 2,

	animation: `${slideUp} 0.5s ease-in-out forwards`, // Default animation
	'&.closing': {
		animation: `${slideDown} 0.5s ease-in-out forwards`, // Animation when closing
	},
});

const StyledButtonGroup = styled(ButtonGroup)({
	display: 'flex',
	justifyContent: 'center',
	alignItems: 'center',
	width: '90%',
	margin: '2rem auto 0 auto',
	border: '1px solid rgba(74, 74, 98, 1)',
	borderRadius: '15px',
});

function ConnectHeader() {
	// Redux
	const dispatch = useDispatch(); // Hook to dispatch actions

	const handleSetLightTheme = () => {
		dispatch(setTheme('light')); // Dispatch setTheme action with 'light' payload
		dispatch(setUseSystemSetting(false)); // Ensure user's manual preference overrides system setting
	};
	const handleSetDarkTheme = () => {
		dispatch(setTheme('dark')); // Dispatch setTheme action with 'dark' payload
		dispatch(setUseSystemSetting(false)); // Ensure user's manual preference overrides system setting
	};

	const handleUseSystemSetting = () => {
		dispatch(setUseSystemSetting(true)); // Dispatch setUseSystemSetting action
	};

	const [open, setOpen] = React.useState(false);
	const [isClosing, setIsClosing] = React.useState(false); // <-- New state to track closing status
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setIsClosing(true); // <-- Set closing status to true
		// Wait for the animation to complete before closing the modal
		setTimeout(() => {
			setOpen(false);
			setIsClosing(false); // <-- Reset closing status for the next cycle
		}, 500); // <-- Length of the slide-down animation
	};

	return (
		<div>
			{!open ? (
				<ConnectButton fullWidth={true} onClick={handleOpen}>
					<TuneIcon />
				</ConnectButton>
			) : (
				<ConnectButton fullWidth={true}>
					<TuneIcon />
				</ConnectButton>
			)}
			<Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<ConnectBox className={isClosing ? 'closing' : ''}>
					{' '}
					{/* Apply the 'closing' class conditionally */}
					<Typography
						style={{ fontWeight: 'bold', margin: '0.75rem auto 0.75rem auto' }}
						align="center"
						color={'#fff'}
						id="modal-modal-title"
						variant="h6"
						component="h2"
					>
						Preferences
					</Typography>
					<StyledButtonGroup variant="contained" aria-label="outlined primary button group" fullWidth={true}>
						<StyledButton onClick={handleUseSystemSetting}>
							<SettingsBrightnessOutlinedIcon />
						</StyledButton>
						<StyledButton onClick={handleSetLightTheme}>
							<LightModeOutlinedIcon />
						</StyledButton>
						<StyledButton onClick={handleSetDarkTheme}>
							<DarkModeOutlinedIcon />
						</StyledButton>
					</StyledButtonGroup>
				</ConnectBox>
			</Modal>
		</div>
	);
}

export default ConnectHeader;
