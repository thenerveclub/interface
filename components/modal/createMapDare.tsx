import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import {
	Box,
	Button,
	CircularProgress,
	ClickAwayListener,
	InputAdornment,
	InputBase,
	List,
	Modal,
	OutlinedInput,
	Paper,
	TextField,
	Tooltip,
	Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import router from 'next/router';
import { useSnackbar } from 'notistack';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import NerveGlobalABI from '../../constants/abi/nerveGlobal.json';
import usePlayerDataSearchList from '../../hooks/searchData/usePlayerDataSearchList';
import useBalanceTracker from '../../hooks/useBalanceTracker';
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
	outline: none;

	animation: ${slideUp} 0.5s ease-in-out forwards;

	&.closing {
		animation: ${slideDown} 0.5s ease-in-out forwards;
	}
`;

const StyledSection = styled.section`
	display: flex;
	align-items: center;
	justify-content: space-evenly;
	align-content: center;
	margin: 0 auto 0 auto;

	@media (max-width: 960px) {
		display: flex;
		align-items: center;
		margin: 0 auto 0 auto;
		grid-template-columns: 1fr;
		grid-gap: 2em;
	}
`;

const BuyButton = styled(Button)<{ theme: any }>`
	color: #fff;
	text-transform: none;
	font-size: 16px;
	border: none;
	line-height: 1.5;
	background-color: ${({ theme }) => theme.palette.warning.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	height: 40px;
	width: 125px;
	margin-left: 1rem;

	&:hover {
		background-color: ${({ theme }) => theme.palette.warning.main};
	}
`;

const MaxButton = styled(Button)<{ theme: any }>`
	color: ${({ theme }) => theme.palette.text.primary};
	text-transform: none;
	font-size: 1rem;
	border: none;
	margin-left: 1rem;
	line-height: 1.5;
	background-color: ${({ theme }) => theme.palette.success.contrastText};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	height: 40px;

	&:hover {
		background-color: ${({ theme }) => theme.palette.warning.main};
	}
`;

const StatisticBox = styled(Box)`
	width: 90%;
	margin: 0 auto 0 auto;

	a {
		font-size: 16px;
		cursor: default;
	}
`;

const StyledTitle = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	width: 100%;
`;

const ChangeNetworkButton = styled(Button)<{ theme: any }>`
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

const StyledTime = styled(Box)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	margin: 0.5rem auto 1rem auto;
`;

const StyledTextField = styled(TextField)<{ theme: any }>`
	border-radius: ${({ theme }) => theme.customShape.borderRadius};

	&:nth-of-type(2) {
		margin: 0 0.5rem 0 0.5rem;
	}

	& .MuiOutlinedInput-notchedOutline {
		border: 1px solid ${({ theme }) => theme.palette.secondary.main};

		&:hover {
			border: 1px solid ${({ theme }) => theme.palette.warning.main};
		}
	}
`;

const SearchBarContainer = styled(Paper)<{ theme: any }>`
	display: flex;
	width: 100%;
	max-width: 25rem;
	align-items: center;
	background-color: transparent;
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	min-height: 40px;
	height: 40px;
	transition: all 0.5s ease-in-out;

	&:hover {
		border: 1px solid ${({ theme }) => theme.palette.warning.main};
	}
	&:focus-within {
		border-bottom-left-radius: 0px;
		border-bottom-right-radius: 0px;
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
		width: 75%;
	}
`;

const SearchResultList = styled(List)<{ theme: any }>`
	color: #000;
	background-color: ${({ theme }) => theme.palette.background.default};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	outline: 1px solid ${({ theme }) => theme.palette.warning.main};
	outline-offset: 0px;
	position: absolute;
	width: 100%;
	max-height: 500px;
	overflow-y: auto;
	top: 100%;
	left: 0;
	right: 0;
	border-top-left-radius: 0px;
	border-top-right-radius: 0px;
	z-index: 9999;

	&::-webkit-scrollbar {
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background: transparent;
	}
	&::-webkit-scrollbar-thumb {
		background: ${({ theme }) => theme.palette.warning.main};
		border-radius: 12px;
	}
	&::-webkit-scrollbar-thumb:hover {
		background: ${({ theme }) => theme.palette.secondary.main};
	}
`;

const SearchResultItemStyled = styled.div<{ theme: any }>`
	color: ${({ theme }) => theme.palette.text.primary};
	background-color: ${({ theme }) => theme.palette.background.default};
	vertical-align: middle;
	width: 100%;
	height: 100%;
	margin: 0 auto;
	padding: 1rem;
	cursor: pointer;
	display: flex;
	flex-direction: column;

	& a {
		font-size: 0.75rem;
		color: ${({ theme }) => theme.palette.text.secondary};
		text-decoration: none;
	}

	&:focus,
	&:hover {
		background-color: ${({ theme }) => theme.palette.warning.main};
	}

	& .item-top,
	& .item-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	& .item-bottom {
		font-size: 0.8rem;
		margin-top: 0.25rem;
	}
`;

interface CreateMapDareProps {
	modalCoords: any;
	onClose: any;
}

const CreateMapDare: React.FC<CreateMapDareProps> = ({ modalCoords, onClose }) => {
	const theme = useTheme();
	const { account, provider } = useWeb3React();
	const { enqueueSnackbar } = useSnackbar();
	const balance = useBalanceTracker(provider, account);

	// Redux
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	// State declaration
	const [searchValue, setSearchValue] = useState('');
	const playerSearchList = usePlayerDataSearchList(searchValue);
	const [open, setOpen] = useState(true);
	const [pendingTx, setPendingTx] = useState(false);
	const [value, setValue] = useState('0.00');
	const [description, setDescription] = useState('');
	const [isMax, setIsMax] = useState(false);
	const [isClosing, setIsClosing] = useState(false); // <-- New state to track closing status
	const [days, setDays] = useState('0');
	const [hours, setHours] = useState('0');
	const [minutes, setMinutes] = useState('0');
	const [isListVisible, setListVisible] = useState(false);
	const [network, setNetwork] = useState(137);

	const registerStatus = 'XXX';

	const handleSearchChange = (e) => {
		setSearchValue(e.target.value);
		setListVisible(true); // Show search results when typing
	};

	const handleFocus = () => {
		setListVisible(true); // Show search results when input is focused
	};

	// Validation function
	const validateInput = (value, max) => {
		const num = parseInt(value, 10);
		if (isNaN(num) || num < 0) return '0';
		if (num > max) return max.toString();
		return num.toString();
	};

	function convertToSeconds(days, hours, minutes) {
		const daysInSeconds = parseInt(days) * 86400; // 86400 seconds in a day
		const hoursInSeconds = parseInt(hours) * 3600; // 3600 seconds in an hour
		const minutesInSeconds = parseInt(minutes) * 60; // 60 seconds in a minute

		return daysInSeconds + hoursInSeconds + minutesInSeconds;
	}

	// Function to set max value
	const setMaxValue = () => {
		setValue(formatBalance(balance));
		setIsMax(true);
	};

	// Update the value state and reset isMax flag when the input value changes
	const handleInputChange = (event) => {
		setValue(event.target.value || '0.00');
		setIsMax(false);
	};

	// Value
	const txValue = ethers.utils.parseEther(value || '0');

	// Handle open and close modal
	const handleOpen = () => setOpen(true);

	const handleClose = () => {
		setIsClosing(true); // <-- Set closing status to true

		// Wait for the animation to complete before closing the modal
		setTimeout(() => {
			setOpen(false);
			setIsClosing(false); // <-- Reset closing status for the next cycle
			onClose();
		}, 500); // <-- Length of the slide-down animation
	};

	const handleListPlayerItemClick = (playerId, playerAddress) => {
		setSearchValue('');
		setListVisible(false);
	};

	// Format Balance
	function formatBalance(value) {
		return Number(value).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	// Format Number
	function formatNumber(value) {
		return Number(value / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	// Create Dare Function
	async function onCreateTask() {
		const signer = provider.getSigner();
		const nerveGlobal = new ethers.Contract(CHAINS[chainId]?.contract, NerveGlobalABI, signer);
		try {
			setPendingTx(true);
			const tx = await nerveGlobal.createTask(
				registerStatus,
				description,
				convertToSeconds(days, hours, minutes),
				'en',
				modalCoords.lat,
				modalCoords.lng,
				{
					value: txValue,
				}
			);
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
				await metaMask.activate(network);
			} catch (error) {
				console.error(error);
			}
		} else {
			try {
				await metaMask.activate(getAddChainParameters(network));
			} catch (error) {
				console.error(error);
			}
		}
	};

	return (
		<ClickAwayListener
			onClickAway={() => {
				setListVisible(false);
				// setChainListVisible(false);
			}}
		>
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
						Create Task
					</Typography>
					<StatisticBox>
						<StyledTitle theme={theme}>
							<div>
								<a style={{ color: theme.palette.text.primary, marginRight: '0.25rem' }}>Player</a>
								<Tooltip title="The 'Player' is the one who will be dared to complete your challenge." placement="top">
									<InfoOutlinedIcon style={{ fontSize: '1rem', color: theme.palette.secondary.main, cursor: 'default' }} />
								</Tooltip>
							</div>
						</StyledTitle>
						<SearchBarContainer theme={theme} onSubmit={(e) => e.preventDefault()} elevation={0}>
							<InputBase
								fullWidth={true}
								style={{ fontSize: '0.875rem' }}
								placeholder={`Search player`}
								inputProps={{ 'aria-label': 'search' }}
								value={searchValue}
								onChange={handleSearchChange}
								onFocus={handleFocus}
							/>
							{isListVisible && (
								<SearchResultList theme={theme}>
									{playerSearchList.map((player) => (
										<SearchResultItemStyled
											theme={theme}
											key={player.id}
											onClick={() => handleListPlayerItemClick(player.userName, player.userAddress)}
										>
											<div className="item-top">
												<span className="player-name">{player.userName}</span>
											</div>
										</SearchResultItemStyled>
									))}
								</SearchResultList>
							)}
						</SearchBarContainer>

						<StyledTitle theme={theme}>
							<div>
								<a style={{ color: theme.palette.text.primary, marginRight: '0.25rem' }}>Entry amount</a>
								<Tooltip title="Mandatory contribution for participation." placement="top">
									<InfoOutlinedIcon style={{ fontSize: '1rem', color: theme.palette.secondary.main, cursor: 'default' }} />
								</Tooltip>
							</div>
							<a>Balance: {formatBalance(balance)}</a>
						</StyledTitle>
						<OutlinedInput
							id="outlined-adornment-amount"
							onChange={handleInputChange}
							endAdornment={
								<InputAdornment position="end">
									<a style={{ color: theme.palette.text.primary }}>ETH</a>
									<MaxButton theme={theme} onClick={setMaxValue}>
										Max
									</MaxButton>
								</InputAdornment>
							}
							placeholder={'0.00'}
							value={value}
							type="string"
							style={{ display: 'flex', margin: '0.5rem 0 1rem 0' }}
							inputProps={{
								style: {
									textAlign: 'right',
									fontSize: '1rem',
									color: theme.palette.text.primary,
								},
							}}
							sx={{
								color: theme.palette.text.primary,
								'& .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: theme.palette.secondary.main },
								'&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: theme.palette.warning.main },
							}}
						/>

						<StyledTitle theme={theme}>
							<div>
								<a style={{ color: theme.palette.text.primary, marginRight: '0.25rem' }}>Time</a>
								<Tooltip
									title="Set the time allowed to complete the task in days, hours, and minutes. Maximum allowed is 30 days, 23 hours, and 59 minutes."
									placement="top"
								>
									<InfoOutlinedIcon style={{ fontSize: '1rem', color: theme.palette.secondary.main, cursor: 'default' }} />
								</Tooltip>
							</div>
						</StyledTitle>
						<StyledTime theme={theme}>
							<StyledTextField
								theme={theme}
								color="warning"
								label="Days"
								value={days}
								onChange={(event) => setDays(validateInput(event.target.value, 30))}
							/>
							<StyledTextField
								theme={theme}
								color="warning"
								label="Hours"
								value={hours}
								onChange={(event) => setHours(validateInput(event.target.value, 23))}
							/>
							<StyledTextField
								theme={theme}
								color="warning"
								label="Minutes"
								value={minutes}
								onChange={(event) => setMinutes(validateInput(event.target.value, 59))}
							/>
						</StyledTime>
						<StyledTitle theme={theme}>Task description</StyledTitle>
						<div>
							<OutlinedInput
								sx={{
									color: theme.palette.text.primary,
									'& .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: theme.palette.secondary.main },
									'&.Mui-focused .MuiOutlinedInput-notchedOutline': { border: '1px solid', borderColor: theme.palette.warning.main },
								}}
								placeholder="Do you dare..."
								id="outlined-adornment-name"
								multiline={true}
								rows={3}
								type="string"
								style={{ display: 'flex', margin: '0.5rem 0 0 0' }}
								onChange={(event) => setDescription(event.target.value)}
								inputProps={{
									maxLength: 100,
								}}
								value={description}
							/>
							<div style={{ textAlign: 'right', margin: '0 0.5rem 1rem 0', color: theme.palette.text.secondary }}>{`${
								description?.length === 0 ? 0 : description?.length
							}/100`}</div>
						</div>

						<StyledTitle theme={theme}>
							<div>
								<a style={{ color: theme.palette.text.primary, marginRight: '0.25rem' }}>Latitude</a>
								<Tooltip title="Mandatory contribution for participation." placement="top">
									<InfoOutlinedIcon style={{ fontSize: '1rem', color: theme.palette.secondary.main, cursor: 'default' }} />
								</Tooltip>
							</div>

							<a>{modalCoords.lat}</a>
						</StyledTitle>

						<StyledTitle theme={theme}>
							<div>
								<a style={{ color: theme.palette.text.primary, marginRight: '0.25rem' }}>Longitude</a>
								<Tooltip title="Mandatory contribution for participation." placement="top">
									<InfoOutlinedIcon style={{ fontSize: '1rem', color: theme.palette.secondary.main, cursor: 'default' }} />
								</Tooltip>
							</div>

							<a>{modalCoords.lng}</a>
						</StyledTitle>

						<StyledSection style={{ margin: '2rem auto 1.5rem auto' }}>
							{chainId === network ? (
								pendingTx ? (
									<BuyButton theme={theme}>Pending</BuyButton>
								) : (
									<BuyButton theme={theme} onClick={onCreateTask} disabled={value === '0' || value === '0.0' || value === '0.00' || value === '0.'}>
										Create Task
									</BuyButton>
								)
							) : (
								<ChangeNetworkButton
									theme={theme}
									onClick={handleNetworkChange}
									startIcon={pendingTx && <CircularProgress color="secondary" thickness={2.5} size={20} />}
								>
									Change Network
								</ChangeNetworkButton>
							)}
						</StyledSection>
					</StatisticBox>
				</ConnectBox>
			</StyledModal>
		</ClickAwayListener>
	);
};

export default CreateMapDare;
