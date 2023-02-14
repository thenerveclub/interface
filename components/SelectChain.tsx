import styled from '@emotion/styled';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import * as React from 'react';

const SelectButton = styled(Select)({
	color: '#fff',
	boxShadow: '0 0 5px #00f2fc',
	textTransform: 'none',
	border: '0.5px solid',
	lineHeight: 1.5,
	height: 40,
	backgroundColor: 'transparent',
	borderColor: '#00f2fc',
	borderRadius: 5,
	'&:hover': {
		backgroundColor: 'transparent',
		borderColor: 'rgba(59, 59, 134, 0.5)',
		boxShadow: '0 0 0.5px #00f2fc',
		transition: 'all 0.75s ease',
	},
});

export default function BasicSelect() {
	let [age, setAge] = React.useState('137');
	console.log('Number', age);

	const handleChange = (event: SelectChangeEvent) => {
		setAge(event.target.value as string);
	};

	return (
		<Box>
			<FormControl fullWidth>
				<SelectButton variant="filled" labelId="demo-simple-select-label" id="demo-simple-select" value={age} label="Age" onChange={handleChange}>
					<MenuItem value={137}>Polygon</MenuItem>
				</SelectButton>
			</FormControl>
		</Box>
	);
}
