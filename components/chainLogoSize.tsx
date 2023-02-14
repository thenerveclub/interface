// import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
// import React, { useState } from 'react';

// import EthereumLogo from '/public/svg/chains/ethereum.svg';
// import PolygonLogo from '/public/svg/chains/polygon.svg';

// const NetworkDropdown: React.FC<NetworkDropdownProps> = ({ switchChain }) => {
// 	const [selectedOption, setSelectedOption] = useState<string>('');

// 	const handleChange = (event: React.ChangeEvent<{ value: unknown }>) => {
// 		setSelectedOption(event.target.value as string);
// 		switchChain(event.target.value as number);
// 	};

// 	return (
// 		<FormControl variant="outlined">
// 			<InputLabel id="network-select-label">Network</InputLabel>
// 			<Select labelId="network-select-label" id="network-select" value={selectedOption}>
// 				<MenuItem value={1}>
// 					<EthereumLogo style={{ marginLeft: '0rem', marginRight: '0.9rem' }} width="25" height="25" alt="Logo" />
// 					Ethereum
// 				</MenuItem>
// 				<MenuItem value={137}>
// 					<PolygonLogo style={{ marginLeft: '0.25rem', marginRight: '0.9rem' }} width="22" height="22" alt="Logo" />
// 					Polygon
// 				</MenuItem>
// 			</Select>
// 		</FormControl>
// 	);
// };

// export default NetworkDropdown;
