import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { WarningAmber } from '@mui/icons-material';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getAddChainParameters } from '../utils/chains';
import { metaMask } from '../utils/connectors/metaMask';
import EthereumLogo from '/public/svg/chains/ethereum.svg';
import PolygonLogo from '/public/svg/chains/polygon.svg';

const StyledSelect = styled(Select)<{ theme: any; open: any }>`
	color: #fff;
	background-color: transparent;
	border: 1px solid ${({ theme, open }) => (open ? theme.palette.warning.main : theme.palette.secondary.main)};
	border-radius: ${({ theme, open }) =>
		open ? `${theme.customShape.borderRadius} ${theme.customShape.borderRadius} 0px 0px` : theme.shape.borderRadius};
	min-height: 40px;
	height: 40px;
	min-width: 150px;
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
		color: #fff;
	}
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

const MenuItemStyled = styled(MenuItem)`
	color: rgba(255, 255, 255, 1);
	background-color: rgba(38, 38, 56, 1);
	vertical-align: middle;
	width: 100%;
	margin: 0 auto 0 auto;
	padding: 0.5rem;
	cursor: pointer; // Adding a pointer cursor for hover state

	& a:last-of-type {
		margin-left: 0.5rem;
	}

	&:focus {
		background-color: rgba(38, 38, 56, 1);
	}
`;

const SearchResultTitle = styled.div<{ theme: any }>`
	font-size: 0.75rem;
	color: rgba(255, 255, 255, 1);
	background-color: transparent;
	padding: 0.5rem;
	font-weight: bold;
	text-align: left;
	border-top-left-radius: 15px;
	border-top-right-radius: 15px;
`;

export default function SelectChain() {
	const theme = useTheme();
	// Redux
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);

	// Network Check
	const isNetworkAvailable = availableChains.includes(chainId);
	const [age, setAge] = useState(chainId);
	// Update age state variable whenever chainId changes
	useEffect(() => {
		setAge(chainId);
	}, [chainId]);

	const handleChange = async (event: SelectChangeEvent) => {
		const newChainId = event.target.value as unknown as number;
		setAge(newChainId);

		if (metaMask) {
			try {
				await metaMask.activate(newChainId);
			} catch (error) {
				console.error(error);
				setAge(chainId);
			}
		} else {
			try {
				await metaMask.activate(getAddChainParameters(newChainId));
			} catch (error) {
				console.error(error);
				setAge(chainId);
			}
		}
	};

	const [menuOpen, setMenuOpen] = useState(false);

	const handleOpen = () => {
		setMenuOpen(true);
	};

	const handleClose = () => {
		setMenuOpen(false);
	};

	return (
		<>
			{isNetworkAvailable ? (
				<StyledSelect
					open={menuOpen}
					onOpen={handleOpen}
					onClose={handleClose}
					theme={theme}
					variant="outlined"
					value={age}
					onChange={handleChange}
					MenuProps={{
						PaperProps: {
							sx: {
								backgroundColor: 'rgba(38, 38, 56, 1)',
								// border: `1px solid ${theme.palette.warning.main}`,
								outline: `1px solid ${theme.palette.warning.main}`,
								borderRadius: 0,
								width: 'auto',
								// '& .MuiMenuItem-root.Mui-selected': {
								// 	backgroundColor: 'rgba(128, 128, 138, 1)',
								// },
								'& .MuiMenuItem-root': {
									backgroundColor: 'rgba(38, 38, 56, 1)',
								},
								'& .MuiMenuItem-root:hover': {
									backgroundColor: 'rgba(58, 58, 76, 1)',
								},
							},
						},
					}}
				>
					<SearchResultTitle theme={theme}>Mainnet</SearchResultTitle>
					<MenuItemStyled value={137} disabled={chainId === 137}>
						<PolygonLogo style={{ display: 'flex', marginRight: '8px' }} width="22" height="22" alt="Logo" />
						<a>Polygon</a>
					</MenuItemStyled>
					<SearchResultTitle theme={theme}>Testnet</SearchResultTitle>
					<MenuItemStyled value={5} disabled={chainId === 5}>
						<EthereumLogo style={{ display: 'flex', marginRight: '8px' }} width="22" height="22" alt="Logo" />
						<a>Goerli</a>
					</MenuItemStyled>
				</StyledSelect>
			) : (
				<StyledSelect
					open={menuOpen}
					onOpen={handleOpen}
					onClose={handleClose}
					theme={theme}
					value={age}
					onChange={handleChange}
					MenuProps={{
						PaperProps: {
							sx: {
								'& .MuiMenuItem-root.Mui-selected': {
									backgroundColor: '#fff',
								},
								'& .MuiMenuItem-root': {
									backgroundColor: '#fff',
								},
								'& .MuiMenuItem-root:hover': {
									backgroundColor: 'rgba(200, 200, 200, 0.5)',
								},
							},
						},
					}}
				>
					<MenuItemStyled value={chainId} disabled={true}>
						<WarningAmberIcon theme={theme} style={{ display: 'flex', marginRight: '0.5rem' }} />
						<a>Unsupported Chain</a>
					</MenuItemStyled>
					<SearchResultTitle theme={theme}>Mainnet</SearchResultTitle>
					<MenuItemStyled value={137} disabled={chainId === 137}>
						<PolygonLogo style={{ display: 'flex' }} width="22" height="22" alt="Logo" />
						<a>Polygon</a>
					</MenuItemStyled>
					<SearchResultTitle theme={theme}>Testnet</SearchResultTitle>
					<MenuItemStyled value={5} disabled={chainId === 5}>
						<EthereumLogo style={{ display: 'flex' }} width="22" height="22" alt="Logo" />
						<a>Goerli</a>
					</MenuItemStyled>
				</StyledSelect>
			)}
		</>
	);
}
