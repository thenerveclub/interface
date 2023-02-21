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
				<Box
					sx={{
						minWidth: 120,
					}}
				>
					<FormControl fullWidth>
						<Select
							value={age}
							onChange={handleChange}
							sx={{
								color: '#fff',

								'& .MuiSelect-icon': {
									color: '#fff',
								},
							}}
						>
							<MenuItem sx={{ color: '#000', background: '#fff' }} value={137} disabled={chainId === 137}>
								<PolygonLogo style={{ margin: '0 0.9rem 0 0', verticalAlign: 'middle' }} width="22" height="22" alt="Logo" />
								Polygon
							</MenuItem>
							<MenuItem sx={{ color: '#000', background: '#fff' }} value={1}>
								<EthereumLogo style={{ margin: '0 0.81rem 0 0.1rem', verticalAlign: 'middle' }} width="22" height="22" alt="Logo" />
								Ethereum
							</MenuItem>
						</Select>
					</FormControl>
				</Box>
			) : (
				<Box
					sx={{
						minWidth: 120,
					}}
				>
					<FormControl fullWidth>
						<Select
							value={age}
							onChange={handleChange}
							sx={{
								color: '#fff',

								'& .MuiSelect-icon': {
									color: '#fff',
								},
							}}
						>
							<MenuItem sx={{ color: '#000' }} value={chainId} disabled={true}>
								<WarningAmber style={{ verticalAlign: 'middle' }} />
								Unsupported Chain
							</MenuItem>
							<MenuItem sx={{ color: '#000' }} value={137} disabled={chainId === 137}>
								<PolygonLogo style={{ margin: '0 0.9rem 0 0', verticalAlign: 'middle' }} width="22" height="22" alt="Logo" />
								Polygon
							</MenuItem>
							<MenuItem sx={{ color: '#000' }} value={1} disabled={chainId === 1}>
								<EthereumLogo style={{ margin: '0 0.81rem 0 0.1rem', verticalAlign: 'middle' }} width="22" height="22" alt="Logo" />
								Ethereum
							</MenuItem>
						</Select>
					</FormControl>
				</Box>
			)}
		</>
	);
}
