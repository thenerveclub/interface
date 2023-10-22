import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import { WarningAmber } from '@mui/icons-material';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useCallback, useEffect, useState } from 'react';

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

export default function SelectFilter() {
	const theme = useTheme();
	const [selectedValue, setSelectedValue] = useState('1');

	const handleChange = (event: SelectChangeEvent) => {
		setSelectedValue(event.target.value as string);
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
			<StyledSelect
				open={menuOpen}
				onOpen={handleOpen}
				onClose={handleClose}
				theme={theme}
				variant="outlined"
				value={selectedValue}
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
				<SearchResultTitle theme={theme}>Stake</SearchResultTitle>
				<MenuItemStyled value={1}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.secondary.main, transform: 'scaleY(-1)' }} />

					<a>Low to High</a>
				</MenuItemStyled>
				<MenuItemStyled value={2}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.secondary.main }} />
					<a>High to Low</a>
				</MenuItemStyled>
				<SearchResultTitle theme={theme}>Participants</SearchResultTitle>
				<MenuItemStyled value={3}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.secondary.main, transform: 'scaleY(-1)' }} />
					<a>Low to High</a>
				</MenuItemStyled>
				<MenuItemStyled value={4}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.secondary.main }} />
					<a>High to Low</a>
				</MenuItemStyled>
				<SearchResultTitle theme={theme}>Entrance Amount</SearchResultTitle>
				<MenuItemStyled value={3}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.secondary.main, transform: 'scaleY(-1)' }} />
					<a>Low to High</a>
				</MenuItemStyled>
				<MenuItemStyled value={4}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.secondary.main }} />
					<a>High to Low</a>
				</MenuItemStyled>
			</StyledSelect>
		</>
	);
}
