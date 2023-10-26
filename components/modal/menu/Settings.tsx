import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import { Box, Button, ButtonGroup, Modal, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currencySlice } from '../../../state/currency/currencySlice';
import { setTheme, setUseSystemSetting } from '../../../state/theme/themeSlice';

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

const SettingsButton = styled(Button)<{ theme: any }>`
	display: flex;
	align-items: center;
	justify-content: center;
	color: rgba(128, 128, 138, 1);
	text-transform: none;
	font-weight: 400;
	min-height: 40px;
	height: 40px;
	background-color: transparent;
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	width: 100%;
	transition: all 0.5s ease-in-out;

	&:hover {
		border: 1px solid ${({ theme }) => theme.palette.warning.main};
	}
`;

const StyledButton = styled(Button)<{ theme: any; active: any }>`
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${({ theme, active }) => (active ? theme.palette.text.primary : theme.palette.secondary.main)};
	text-transform: none;
	font-weight: 400;
	height: 40px;
	background-color: transparent;
	border: none !important;
	border-radius: 15px;
	width: 100%;
	transition: all 0.5s ease-in-out;

	h1 {
		font-size: 1.125rem;
	}

	&:hover {
		color: ${({ theme }) => theme.palette.text.primary};
		background-color: transparent;
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
	padding: 1rem;
	height: 400px;
	width: 350px;
	background-color: ${({ theme }) => theme.palette.background.default};
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius}};
	box-shadow: 0 0 25px rgba(76, 130, 251, 0.25);

	animation: ${slideUp} 0.5s ease-in-out forwards;
	&.closing {
		animation: ${slideDown} 0.5s ease-in-out forwards;
	}
`;

const StyledButtonGroup = styled(ButtonGroup)<{ theme: any }>`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 90%;
	box-shadow: none;
	margin: 2rem auto 0 auto;
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
`;

function SettingsModal() {
	const theme = useTheme();
	// Redux
	const dispatch = useDispatch(); // Hook to dispatch actions
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const [currentTheme, setCurrentTheme] = React.useState('system'); // 'light', 'dark', or 'system'

	const handleSetLightTheme = () => {
		dispatch(setTheme('light')); // Dispatch setTheme action with 'light' payload
		dispatch(setUseSystemSetting(false)); // Ensure user's manual preference overrides system setting
		setCurrentTheme('light');
	};
	const handleSetDarkTheme = () => {
		dispatch(setTheme('dark')); // Dispatch setTheme action with 'dark' payload
		dispatch(setUseSystemSetting(false)); // Ensure user's manual preference overrides system setting
		setCurrentTheme('dark');
	};

	const handleUseSystemSetting = () => {
		dispatch(setUseSystemSetting(true)); // Dispatch setUseSystemSetting action
		setCurrentTheme('system');
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

	const handleUpdateCurrency = (newCurrency) => {
		// update currency in redux
		dispatch(currencySlice.actions.updateCurrency(newCurrency));
	};

	return (
		<div>
			<SettingsButton theme={theme} fullWidth={true} onClick={handleOpen}>
				<TuneIcon />
			</SettingsButton>
			<Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<ConnectBox theme={theme} className={isClosing ? 'closing' : ''}>
					<Typography
						style={{ fontWeight: 'bold', margin: '0.75rem auto 0.75rem auto' }}
						align="center"
						color={theme.palette.text.primary}
						id="modal-modal-title"
						variant="h6"
						component="h2"
					>
						Preferences
					</Typography>
					<StyledButtonGroup theme={theme} variant="contained" aria-label="outlined primary button group" fullWidth={true}>
						<StyledButton theme={theme} active={currentTheme === 'system'} onClick={handleUseSystemSetting}>
							<SettingsBrightnessOutlinedIcon />
						</StyledButton>
						<StyledButton theme={theme} active={currentTheme === 'light'} onClick={handleSetLightTheme}>
							<LightModeOutlinedIcon />
						</StyledButton>
						<StyledButton theme={theme} active={currentTheme === 'dark'} onClick={handleSetDarkTheme}>
							<DarkModeOutlinedIcon />
						</StyledButton>
					</StyledButtonGroup>

					<StyledButtonGroup theme={theme} variant="contained" aria-label="outlined primary button group" fullWidth={true}>
						<StyledButton theme={theme} active={currencyValue === true} onClick={() => handleUpdateCurrency(true)}>
							<h1>$</h1>
						</StyledButton>
						<StyledButton theme={theme} active={currencyValue === false} onClick={() => handleUpdateCurrency(false)}>
							<h1>Token</h1>
						</StyledButton>
					</StyledButtonGroup>
				</ConnectBox>
			</Modal>
		</div>
	);
}

export default SettingsModal;
