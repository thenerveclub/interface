import styled from '@emotion/styled';
import CheckIcon from '@mui/icons-material/Check';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { Box, FormControl, InputLabel, MenuItem, Select, SelectChangeEvent, keyframes } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { CHAINS, getAddChainParameters } from '../utils/chains';
import { coinbaseWallet } from '../utils/connectors/coinbaseWallet';
import { metaMask } from '../utils/connectors/metaMask';
import EthereumLogo from '/public/svg/chains/ethereum.svg';
import PolygonLogo from '/public/svg/chains/polygon.svg';

const WarningAmber = styled(WarningAmberIcon)({
	margin: '0 0.75rem 0 0',
	color: 'red',
	animation: 'blink 2s infinite',

	'@keyframes blink': {
		'0%': { opacity: 1 },
		'50%': { opacity: 0 },
		'100%': { opacity: 1 },
	},
});

const MenuItemStyled = styled(MenuItem)({
	color: '#000',
	backgroundColor: '#fff',
	verticalAlign: 'middle',
	width: '90%',
	margin: '0 auto 0 auto',
	padding: '0.5rem',
	borderRadius: '12px',

	'&:focus': {
		background: '#fff',
	},
});

export default function BasicSelect() {
	const chainId = useSelector((state: { chainId: number }) => {
		return state.chainId;
	});
	const availableNetworks = [137, 1];
	const isNetworkAvailable = availableNetworks.includes(chainId);
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

	return (
		<>
			{isNetworkAvailable ? (
				<Select
					variant="outlined"
					value={age}
					onChange={handleChange}
					sx={{
						color: '#fff',
						height: '100%',
						verticalAlign: 'middle',

						'& .MuiOutlinedInput-notchedOutline': {
							border: 'none',
						},

						'& .MuiSelect-icon': {
							color: '#fff',
						},
					}}
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
									backgroundColor: 'rgba(152, 161, 192, 0.5)',
								},
							},
						},
					}}
				>
					<MenuItemStyled value={137} disabled={chainId === 137}>
						<PolygonLogo style={{ margin: '0 0.9rem 0 0', verticalAlign: 'middle' }} width="22" height="22" alt="Logo" />
						Polygon
					</MenuItemStyled>
					<MenuItemStyled value={5} disabled={chainId === 5}>
						<EthereumLogo style={{ margin: '0 0.81rem 0 0.1rem', verticalAlign: 'middle' }} width="22" height="22" alt="Logo" />
						Goerli
					</MenuItemStyled>
				</Select>
			) : (
				<Select
					value={age}
					onChange={handleChange}
					sx={{
						color: '#fff',
						height: '100%',
						verticalAlign: 'middle',

						'& .MuiOutlinedInput-notchedOutline': {
							border: 'none',
						},

						'& .MuiSelect-icon': {
							color: '#fff',
						},
					}}
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
									backgroundColor: 'rgba(152, 161, 192, 0.5)',
								},
							},
						},
					}}
				>
					<MenuItemStyled value={chainId} disabled={true}>
						<WarningAmber style={{ verticalAlign: 'middle' }} />
						Unsupported Chain
					</MenuItemStyled>
					<MenuItemStyled value={137} disabled={chainId === 137}>
						<PolygonLogo style={{ margin: '0 0.9rem 0 0', verticalAlign: 'middle' }} width="22" height="22" alt="Logo" />
						Polygon
					</MenuItemStyled>
					<MenuItemStyled value={5} disabled={chainId === 5}>
						<EthereumLogo style={{ margin: '0 0.81rem 0 0.1rem', verticalAlign: 'middle' }} width="22" height="22" alt="Logo" />
						Goerli
					</MenuItemStyled>
				</Select>
			)}
		</>
	);
}
