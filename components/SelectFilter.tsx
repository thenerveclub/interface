import styled from '@emotion/styled';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import { Checkbox, MenuItem, Select } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { filterSlice } from '../state/filter/filterSlice';
import { CHAINS } from '../utils/chains';

const StyledSelect = styled(Select, {
	shouldForwardProp: (prop) => prop !== 'focus' && prop !== 'open', // add this line
})<{ theme: any; open: any; focus: any }>`
	color: ${({ theme }) => theme.palette.text.primary};
	font-weight: 500;
	background-color: ${({ theme, focus }) => (focus ? theme.palette.background.default : 'transparent')};
	border: 1px solid ${({ theme, open, focus }) => (open || focus ? theme.palette.warning.main : theme.palette.secondary.main)};
	border-radius: ${({ theme, open }) =>
		open ? `${theme.customShape.borderRadius} ${theme.customShape.borderRadius} 0px 0px` : theme.shape.borderRadius};
	min-height: 35px;
	height: 35px;
	min-width: 150px;
	max-width: 375px;
	transition: all 0.5s ease-in-out;
	cursor: pointer;
	z-index: 10;

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
		text-align: center;
		background-color: transparent;
		width: 100%;
		z-index: 999;
		// min-height: 5px;
		// height: 5px;
	}

	& .MuiSelect-icon {
		color: ${({ theme }) => theme.palette.text.primary};
	}

	@media (max-width: 960px) {
		display: flex;
		justify-content: center;
		margin: 0.5rem auto 0 auto;
		min-width: 175px;
		max-width: 275px;

		& .MuiPaper-root {
			min-width: 175px;
			max-width: 275px;
		}
	}
`;

const MenuItemStyled = styled(MenuItem)<{ theme: any }>`
	color: ${({ theme }) => theme.palette.text.primary};
	background-color: rgba(38, 38, 56, 1);
	vertical-align: middle;
	width: 100%;
	// font-size: 1rem;
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

export default function SelectFilter() {
	const theme = useTheme();

	// Redux
	const dispatch = useDispatch();
	const filter = useSelector((state: { filter: number[] }) => state.filter);

	// State
	const [menuOpen, setMenuOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	// Updated handleOpen and handleClose functions
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
			<StyledSelect
				open={menuOpen}
				onOpen={handleOpen}
				onClose={handleClose}
				focus={isFocused}
				theme={theme}
				variant="outlined"
				// value={filter}
				// onChange={handleChange}
				MenuProps={{
					PaperProps: {
						sx: {
							backgroundColor: theme.palette.background.default,
							outline: `1px solid ${theme.palette.warning.main}`,
							borderRadius: 0,
							// minWidth: '225px',
							// maxWidth: '375px',
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
				startAdornment={
					<div style={{ display: 'flex' }}>
						<FilterAltIcon style={{ color: theme.palette.text.primary, marginRight: '8px' }} />
						Filter
					</div>
				}
			>
				{Object.entries(CHAINS).map(([chainId, chainInfo]) => {
					if (chainInfo && chainInfo.name && chainInfo.logo) {
						return (
							<MenuItemStyled key={chainId} theme={theme} onClick={() => dispatch(filterSlice.actions.toggleFilterItem(Number(chainId)))}>
								<Checkbox checked={filter.includes(Number(chainId))} style={{ backgroundColor: 'transparent', color: theme.palette.text.primary }} />
								<img src={chainInfo.logo} style={{ display: 'flex', marginRight: '8px' }} width="22" height="22" alt={`${chainInfo.name} Logo`} />
								{chainInfo.name}
							</MenuItemStyled>
						);
					}
					return null;
				})}
			</StyledSelect>
		</>
	);
}
