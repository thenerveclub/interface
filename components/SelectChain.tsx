import styled from '@emotion/styled';
import { WarningAmber } from '@mui/icons-material';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAddChainParameters } from '../utils/chains';
import { metaMask } from '../utils/connectors/metaMask';
import EthereumLogo from '/public/svg/chains/ethereum.svg';
import PolygonLogo from '/public/svg/chains/polygon.svg';

const StyledSelect = styled(Select, {
	shouldForwardProp: (prop) => prop !== 'focus' && prop !== 'open', // add this line
})<{ theme: any; open: any; focus: any }>`
	color: ${({ theme }) => theme.palette.text.primary};
	font-weight: 500;
	background-color: ${({ theme, focus }) => (focus ? theme.palette.background.default : 'transparent')};
	border: 1px solid ${({ theme, open, focus }) => (open || focus ? theme.palette.warning.main : theme.palette.secondary.main)};
	border-radius: ${({ theme, open }) =>
		open ? `${theme.customShape.borderRadius} ${theme.customShape.borderRadius} 0px 0px` : theme.shape.borderRadius};
	min-height: 40px;
	height: 40px;
	min-width: 90%;
	max-width: 90%;
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

	@media (max-width: 680px) {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto 0 auto;
		min-width: 90%;
		max-width: 90%;
`;

const WarningAmberIcon = styled(WarningAmber)<{ theme: any }>`
	color: ${({ theme }) => theme.palette.error.main};
	font-size: 1.25rem;
	animation: blink 2s infinite;

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
		background-color: ${({ theme }) => theme.palette.warning.main};
	}

	a {
		visibility: visible;
	}

	@media (max-width: 680px) {
		display: flex;
		justify-content: center;
		align-items: center;
		margin: 0 auto 0 auto;
		width: 100%;
	}
`;

const SearchResultTitle = styled.div<{ theme: any }>`
	font-size: 0.75rem;
	color: ${({ theme }) => theme.palette.secondary.main};
	background-color: transparent;
	padding: 0.5rem;
	font-weight: bold;
	text-align: left;
	border-top-left-radius: 15px;
	border-top-right-radius: 15px;
`;

export default function SelectChain() {
	const theme = useTheme();
	const router = useRouter();
	const network = router.query.network as string;

	// Redux
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);
	const testnetsValue = useSelector((state: { testnets: boolean }) => state.testnets);

	// Network Check
	const isNetworkAvailable = availableChains?.includes(chainId);
	const [chain, setChain] = useState(chainId);
	// Update chain state variable whenever chainId changes
	useEffect(() => {
		setChain(chainId);
	}, [chainId]);

	const handleChange = async (event: SelectChangeEvent) => {
		const newChainId = event.target.value as unknown as number;
		setChain(newChainId);

		if (metaMask) {
			try {
				await metaMask.activate(newChainId);
			} catch (error) {
				console.error(error);
				setChain(chainId);
			}
		} else {
			try {
				await metaMask.activate(getAddChainParameters(newChainId));
			} catch (error) {
				console.error(error);
				setChain(chainId);
			}
		}
	};

	const [newNetwork, setNewNetwork] = useState(network);

	const handleChangePush = async (event: SelectChangeEvent) => {
		const chain = event.target.value as unknown as string;
		router.push(`/${chain}`);
		setNewNetwork(chain);
	};

	const [menuOpen, setMenuOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	const handleOpen = () => {
		setMenuOpen(true);
		setIsFocused(true);
	};

	const handleClose = () => {
		setMenuOpen(false);
		setIsFocused(false);
	};

	return (
		<>
			{/* {isNetworkAvailable ? ( */}
			<StyledSelect
				open={menuOpen}
				onOpen={handleOpen}
				onClose={handleClose}
				theme={theme}
				variant="outlined"
				value={newNetwork}
				onChange={handleChangePush}
				focus={isFocused}
				MenuProps={{
					PaperProps: {
						sx: {
							backgroundColor: theme.palette.background.default,
							outline: `1px solid ${theme.palette.warning.main}`,
							borderRadius: 0,
							// minWidth: '90%',
							// maxWidth: '90%',
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
				<SearchResultTitle theme={theme}>Mainnet</SearchResultTitle>
				<MenuItemStyled theme={theme} value={'polygon'} disabled={network === 'polygon'}>
					<PolygonLogo style={{ display: 'flex', marginRight: '8px' }} width="22" height="22" alt="Logo" />
					<a>Polygon</a>
				</MenuItemStyled>
				{testnetsValue && <SearchResultTitle theme={theme}>Testnet</SearchResultTitle>}
				{testnetsValue && (
					<MenuItemStyled theme={theme} value={'goerli'} disabled={network === 'goerli'}>
						<EthereumLogo style={{ display: 'flex', marginRight: '8px' }} width="22" height="22" alt="Logo" />
						<a>Goerli</a>
					</MenuItemStyled>
				)}
			</StyledSelect>
			{/* ) : (
				<StyledSelect
					open={menuOpen}
					onOpen={handleOpen}
					onClose={handleClose}
					theme={theme}
					value={chain}
					onChange={handleChangePush}
					focus={isFocused}
					MenuProps={{
						PaperProps: {
							sx: {
								backgroundColor: theme.palette.background.default,
								outline: `1px solid ${theme.palette.warning.main}`,
								borderRadius: 0,
								minWidth: '175px',
								maxWidth: '225px',
								padding: '0px',
								margin: '0 auto 0 auto',
								'& .MuiMenuItem-root': {
									backgroundColor: theme.palette.background.default,
								},
								'& .MuiMenuItem-root:hover': {
									backgroundColor: theme.palette.secondary.light,
								},
							},
						},
					}}
				>
					<MenuItemStyled theme={theme} value={chainId} disabled={true}>
						<WarningAmberIcon theme={theme} style={{ display: 'flex', marginRight: '8px' }} />
						<a>Unsupported</a>
					</MenuItemStyled>
					<SearchResultTitle theme={theme}>Mainnet</SearchResultTitle>
					<MenuItemStyled theme={theme} value={137} disabled={chainId === 137}>
						<PolygonLogo style={{ display: 'flex', marginRight: '8px' }} width="22" height="22" alt="Logo" />
						<a>Polygon</a>
					</MenuItemStyled>
					{testnetsValue && <SearchResultTitle theme={theme}>Testnet</SearchResultTitle>}
					{testnetsValue && (
						<MenuItemStyled theme={theme} value={5} disabled={chainId === 5}>
							<EthereumLogo style={{ display: 'flex', marginRight: '8px' }} width="22" height="22" alt="Logo" />
							<a>Goerli</a>
						</MenuItemStyled>
					)}
				</StyledSelect>
			)} */}
		</>
	);
}
