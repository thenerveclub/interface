import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import AttachMoneyOutlinedIcon from '@mui/icons-material/AttachMoneyOutlined';
import CurrencyBitcoinOutlinedIcon from '@mui/icons-material/CurrencyBitcoinOutlined';
import DarkModeOutlinedIcon from '@mui/icons-material/DarkModeOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';
import SettingsBrightnessOutlinedIcon from '@mui/icons-material/SettingsBrightnessOutlined';
import TuneIcon from '@mui/icons-material/Tune';
import {
	Box,
	Button,
	ButtonGroup,
	Fade,
	IconButton,
	InputBase,
	MenuItem,
	Modal,
	Paper,
	Select,
	Switch,
	SwitchProps,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { currencySlice } from '../../../state/currency/currencySlice';
import { customRPCSlice } from '../../../state/customRPC/customRPCSlice';
import { rpcSlice } from '../../../state/rpc/rpcSlice';
import { testnetsSlice } from '../../../state/testnets/testnetsSlice';
import { setTheme, setUseSystemSetting } from '../../../state/theme/themeSlice';
import SelectChain from '../../SelectChain';

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

const SettingsButton = styled(Button)<{ theme: any }>`
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${({ theme }) => theme.palette.text.primary};
	text-transform: none;
	font-weight: 400;
	min-height: 40px;
	height: 40px;
	background-color: transparent;
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	width: 3rem;
	transition: all 0.5s ease-in-out;

	&:hover {
		border: 1px solid ${({ theme }) => theme.palette.warning.main};
	}

	@media (max-width: 680px) {
		// border: none;
		// border-radius: 0px;
		width: 3rem;

		&:hover {
			border: none;
		}
	}
`;

const StyledButton = styled(({ active, ...otherProps }) => <Button {...otherProps} />)<{
	theme: any;
	active: boolean;
}>`
	display: flex;
	align-items: center;
	justify-content: center;
	color: ${({ theme, active }) => (active ? theme.palette.text.primary : theme.palette.secondary.main)};
	text-transform: none;
	font-weight: 400;
	height: 40px;
	background-color: ${({ active, theme }) => (active ? theme.palette.action.selected : 'transparent')};
	border: none !important;
	border-radius: 15px;
	width: 100%;
	transition: all 0.5s ease-in-out;

	&:hover {
		color: ${({ theme }) => theme.palette.text.primary};
		background-color: ${({ active, theme }) => (active ? theme.palette.action.hover : 'transparent')};
	}

	h1 {
		font-size: 1.125rem;
	}
`;

const StyledButtonRPC = styled(Button)<{ theme: any }>`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 1rem auto 0 auto;
	color: ${({ theme }) => theme.palette.text.primary};
	text-transform: none;
	font-size: 16px;
	border: none;
	line-height: 1.5;
	background-color: ${({ theme }) => theme.palette.warning.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	height: 40px;
	width: 125px;

	&:hover {
		background-color: ${({ theme }) => theme.palette.warning.main};
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

const StyledButtonGroup = styled(ButtonGroup)<{ theme: any }>`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 90%;
	box-shadow: none;
	margin: 0 auto 0 auto;
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
`;

const StyledDiv = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 0 auto 0 auto;
	width: 100%;
`;

const StyledTitles = styled.div<{ theme: any }>`
	display: flex;
	justify-content: space-between;
	width: 95%;
	margin: 1rem auto 0 auto;
	padding: 0.5rem;
	font-weight: bold;
`;

const StyledTitle = styled(Typography)<{ theme: any }>`
	display: flex;
	width: 95%;
	align-items: center;
	font-size: 1rem;
	color: ${({ theme }) => theme.palette.text.primary};
	background-color: transparent;
	margin: 1rem auto 0 auto;
	padding: 0.5rem;
	font-weight: bold;
	text-align: left;
	cursor: default;
`;

const StyledDuoTitle = styled(Typography)<{ theme: any }>`
	display: flex;
	width: 100%;
	justify-content: left;
	align-items: left;
	font-size: 1rem;
	color: ${({ theme }) => theme.palette.text.primary};
	background-color: transparent;
	margin: 0 auto 0 auto;
	padding: 0;
	font-weight: bold;
	text-align: left;
	cursor: default;
`;

const StyledSelect = styled(Select, {
	shouldForwardProp: (prop) => prop !== 'focus' && prop !== 'open', // add this line
})<{ theme: any; open: any; focus: any }>`
	display: flex;
	margin: 0 auto 0 auto;
	color: ${({ theme }) => theme.palette.text.primary};
	font-weight: 500;
	background-color: ${({ theme, focus }) => (focus ? theme.palette.background.default : 'transparent')};
	border: 1px solid ${({ theme, open, focus }) => (open || focus ? theme.palette.warning.main : theme.palette.secondary.main)};
	border-radius: ${({ theme, open }) =>
		open ? `${theme.customShape.borderRadius} ${theme.customShape.borderRadius} 0px 0px` : theme.shape.borderRadius};
	min-height: 40px;
	height: 40px;
	width: 90%;
	transition: all 0.5s ease-in-out;

	&:hover {
		border: 1px solid ${({ theme }) => theme.palette.warning.main};
	}

	& .MuiOutlinedInput-notchedOutline {
		border: none;
	}

	& .MuiSelect-select {
		display: flex;
		align-items: center;
		justify-content: center;
		align-content: center;
		vertical-align: middle;
		height: 40px;
		text-align: center;
	}

	& .MuiSelect-icon {
		color: ${({ theme }) => theme.palette.text.primary};
	}
`;

const MenuItemStyled = styled(MenuItem)<{ theme: any }>`
	color: ${({ theme }) => theme.palette.text.primary};
	font-weight: 500;
	font-size: 1rem;
	background-color: rgba(38, 38, 56, 1);
	vertical-align: middle;
	margin: 0 auto 0 auto;
	padding: 0.5rem;
	cursor: pointer;

	& a:last-of-type {
		margin-left: 0.5rem;
	}

	&:focus {
		background-color: rgba(38, 38, 56, 1);
	}
`;

const SearchBarContainer = styled(Paper)<{ theme: any }>`
	display: flex;
	width: 90%;
	max-width: 90%;
	margin: 1rem auto 0 auto;
	align-items: center;
	background-color: transparent;
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	min-height: 42px;
	height: 42px;
	padding: 0;
	transition: all 0.5s ease-in-out;

	&:hover {
		border: 1px solid ${({ theme }) => theme.palette.warning.main};
	}
	&:focus-within {
		border: 1px solid ${({ theme }) => theme.palette.warning.main};
		background-color: ${({ theme }) => theme.palette.background.default};
	}

	& input {
		color: ${({ theme }) => theme.palette.text.primary};
	}
	& input::placeholder {
		color: ${({ theme }) => theme.palette.secondary.main};
	}
	& .MuiSvgIcon-root {
		color: ${({ theme }) => theme.palette.text.primary};
	}
	position: relative;

	@media (max-width: 768px) {
		width: 90%;
	}
`;

const StyledSwitchContainer = styled('div')`
	display: flex;
	justify-content: center;
	align-items: center;
`;

const IOSSwitch = styled((props: SwitchProps) => <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />)<{ theme: any }>`
	width: 42px;
	height: 26px;
	padding: 0;
	& .MuiSwitch-switchBase {
		padding: 0;
		margin: 2px;
		transition-duration: 300ms;
		&.Mui-checked {
			transform: translateX(16px);
			color: #fff;
			& + .MuiSwitch-track {
				background-color: ${({ theme }) => theme.palette.success.main};
				opacity: 1;
				border: 0;
			}
			&.Mui-disabled + .MuiSwitch-track {
				opacity: 0.5;
			}
		}
		&.Mui-focusVisible .MuiSwitch-thumb {
			color: #33cf4d;
			border: 6px solid #fff;
		}
		&.Mui-disabled .MuiSwitch-thumb {
			color: ${({ theme }) => theme.palette.secondary.main};
		}
		&.Mui-disabled + .MuiSwitch-track {
			opacity: ${(props) => (props.theme.palette.mode === 'light' ? 0.7 : 0.3)};
		}
	}
	& .MuiSwitch-thumb {
		box-sizing: border-box;
		width: 22px;
		height: 22px;
	}
	& .MuiSwitch-track {
		border-radius: 13px;
		background-color: ${({ theme }) => theme.palette.secondary.main};
		opacity: 1;
		transition: ${(props) =>
			props.theme.transitions.create(['background-color'], {
				duration: 500,
			})};
	}
`;

function SettingsModal() {
	const theme = useTheme();

	// Redux
	const dispatch = useDispatch();
	const account = useSelector((state: { account: string }) => state.account);
	const userTheme = useSelector((state: { theme: any }) => state.theme);
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const testnetsValue = useSelector((state: { testnets: boolean }) => state.testnets);
	const rpcValue = useSelector((state: { rpc: string }) => state.rpc);
	const customRPCValue = useSelector((state: { customRPC: string }) => state.customRPC);

	// Local state
	const [currentTheme, setCurrentTheme] = useState(userTheme.prefersSystemSetting === true ? 'system' : userTheme.currentTheme);
	const [showTestnets, setShowTestnets] = useState(testnetsValue);
	const [showCurrency, setShowCurrency] = useState(currencyValue);

	// Handle switch toggle
	const handleChangeTestnets = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newTestnetsValue = event.target.checked;
		setShowTestnets(newTestnetsValue); // Update local state
		dispatch(testnetsSlice.actions.setShowTestnets(newTestnetsValue)); // Update redux state
	};

	// Handle switch toggle currency
	const handleChangeCurrency = (event: React.ChangeEvent<HTMLInputElement>) => {
		const newCurrency = event.target.checked;
		setShowCurrency(newCurrency); // Update local state
		dispatch(currencySlice.actions.updateCurrency(newCurrency));
	};

	// Update local state when redux state changes
	useEffect(() => {
		setCurrentTheme(userTheme.prefersSystemSetting ? 'system' : userTheme.currentTheme);
		setShowTestnets(testnetsValue);
		setShowCurrency(currencyValue);
		setSelectedRpc(rpcValue);
		setAppliedRpcUrl(customRPCValue);
		setCustomRpcUrl(customRPCValue);
	}, [userTheme, testnetsValue, currencyValue, rpcValue, customRPCValue]);

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

	const [open, setOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false); // <-- New state to track closing status
	const handleOpen = () => setOpen(true);
	const handleClose = () => {
		setIsClosing(true); // <-- Set closing status to true
		// Wait for the animation to complete before closing the modal
		setTimeout(() => {
			setOpen(false);
			setIsClosing(false); // <-- Reset closing status for the next cycle
		}, 500); // <-- Length of the slide-down animation
	};

	// Local state
	const [menuOpen, setMenuOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	// Open/close menu
	const handleOpenSelect = () => {
		setMenuOpen(true);
		setIsFocused(true);
	};

	const handleCloseSelect = () => {
		setMenuOpen(false);
		setIsFocused(false);
	};

	// RPC endpoint
	const [selectedRpc, setSelectedRpc] = useState(rpcValue);
	const [customRpcUrl, setCustomRpcUrl] = useState(customRPCValue);
	const [appliedRpcUrl, setAppliedRpcUrl] = useState(customRPCValue);

	const handleCustomRpcChange = (event) => {
		setCustomRpcUrl(event.target.value);
	};

	const handleChange = (event) => {
		setSelectedRpc(event.target.value);
		// console.log('event.target.value', event.target.value);
		dispatch(rpcSlice.actions.updateRPC(event.target.value));
	};

	const handleSubmitCustomRpc = () => {
		setAppliedRpcUrl(customRpcUrl);
		dispatch(customRPCSlice.actions.updateCustomRPC(customRpcUrl));
	};

	return (
		<>
			<SettingsButton theme={theme} fullWidth={true} onClick={handleOpen}>
				<TuneIcon />
			</SettingsButton>
			<StyledModal open={open} onClose={handleClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
				<ConnectBox theme={theme} className={isClosing ? 'closing' : ''}>
					<Typography
						style={{ fontWeight: 'bold', margin: '0.0 auto 0.75rem auto', cursor: 'default' }}
						align="center"
						color={theme.palette.text.primary}
						id="modal-modal-title"
						variant="h6"
						component="h2"
					>
						Preferences
					</Typography>

					<StyledTitle theme={theme}>Theme</StyledTitle>
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

					{/* {account && (
						<> */}
					{/* <StyledTitle theme={theme}>Chain</StyledTitle>
					<StyledDiv>
						<SelectChain />
					</StyledDiv> */}
					{/* </>
					)} */}

					<StyledTitles theme={theme}>
						<StyledDuoTitle theme={theme}>Show currency</StyledDuoTitle>
						<StyledSwitchContainer>
							<IOSSwitch theme={theme} checked={showCurrency} onChange={handleChangeCurrency} />
						</StyledSwitchContainer>
					</StyledTitles>

					<StyledTitles theme={theme}>
						<StyledDuoTitle theme={theme}>Show testnets</StyledDuoTitle>
						<StyledSwitchContainer>
							<IOSSwitch theme={theme} checked={showTestnets} onChange={handleChangeTestnets} />
						</StyledSwitchContainer>
					</StyledTitles>

					<StyledTitles theme={theme}>
						<StyledDuoTitle theme={theme}>RPC endpoint</StyledDuoTitle>
						<Tooltip
							title="Choose Infura, Alchemy, or your own RPC endpoint."
							placement="top"
							disableInteractive
							TransitionComponent={Fade}
							TransitionProps={{ timeout: 600 }}
						>
							<HelpOutlineOutlinedIcon style={{ display: 'flex', color: theme.palette.secondary.main }} />
						</Tooltip>
					</StyledTitles>
					<StyledSelect
						open={menuOpen}
						onOpen={handleOpenSelect}
						onClose={handleCloseSelect}
						theme={theme}
						variant="outlined"
						value={selectedRpc} // Set the value to the state variable
						onChange={handleChange} // Add an onChange handler to set the state
						focus={isFocused}
						MenuProps={{
							PaperProps: {
								sx: {
									backgroundColor: theme.palette.background.default,
									outline: `1px solid ${theme.palette.warning.main}`,
									borderRadius: 0,
									// width: '90%',
									padding: '0px',
									margin: '0 auto 0 auto',
									'& .MuiMenuItem-root': {
										backgroundColor: theme.palette.background.default,
									},
									'& .MuiMenuItem-root:hover': {
										backgroundColor: theme.palette.warning.main,
									},
								},
							},
						}}
					>
						<MenuItemStyled theme={theme} value="infura" disabled={selectedRpc === 'infura'}>
							<a>Infura</a>
						</MenuItemStyled>
						<MenuItemStyled theme={theme} value="alchemy" disabled={selectedRpc === 'alchemy'}>
							<a>Alchemy</a>
						</MenuItemStyled>
						<MenuItemStyled theme={theme} value="custom" disabled={selectedRpc === 'custom'}>
							<a>Custom</a>
						</MenuItemStyled>
					</StyledSelect>
					{selectedRpc === 'custom' && (
						<>
							<SearchBarContainer theme={theme} variant="outlined">
								<InputBase
									style={{ display: 'flex', width: '100%', marginLeft: '1rem', color: theme.palette.text.primary }}
									placeholder="Paste your custom RPC"
									inputProps={{ 'aria-label': 'search' }}
									value={customRpcUrl}
									onChange={handleCustomRpcChange}
								/>
							</SearchBarContainer>
							{customRpcUrl === appliedRpcUrl && customRpcUrl !== '' ? (
								<Typography
									style={{
										fontSize: '1rem',
										color: theme.palette.text.primary,
										fontWeight: 'bold',
										margin: '1rem auto 0 auto',
										cursor: 'default',
									}}
									align="center"
									id="modal-modal-title"
								>
									Custom RPC applied.
								</Typography>
							) : customRpcUrl !== '' ? (
								<StyledButtonRPC theme={theme} onClick={handleSubmitCustomRpc}>
									Apply RPC
								</StyledButtonRPC>
							) : (
								<StyledButtonRPC theme={theme} disabled style={{ cursor: 'not-allowed' }}>
									Apply RPC
								</StyledButtonRPC>
							)}
						</>
					)}
				</ConnectBox>
			</StyledModal>
		</>
	);
}

export default SettingsModal;
