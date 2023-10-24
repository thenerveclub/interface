import { useTheme } from '@emotion/react';
import styled from '@emotion/styled';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sortSlice } from '../state/sort/sortSlice';

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

export default function SelectSort() {
	// Redux
	const dispatch = useDispatch();
	const sort = useSelector((state: { sort: number }) => state.sort);

	const theme = useTheme();
	const [menuOpen, setMenuOpen] = useState(false);

	const handleChange = (event: SelectChangeEvent) => {
		dispatch(sortSlice.actions.updateSort(event.target.value));
	};

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
				value={sort}
				onChange={handleChange}
				MenuProps={{
					PaperProps: {
						sx: {
							backgroundColor: 'rgba(38, 38, 56, 1)',
							outline: `1px solid ${theme.palette.warning.main}`,
							borderRadius: 0,
							width: 'auto',
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
				<MenuItemStyled value={1} disabled={sort === 1 ? true : false}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.secondary.main, transform: 'scaleY(-1)' }} />
					<a>{sort === 1 ? 'Stake: Low to High' : 'Low to High'}</a>
				</MenuItemStyled>
				<MenuItemStyled value={2} disabled={sort === 2 ? true : false}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.secondary.main }} />
					<a>{sort === 2 ? 'Stake: High to Low' : 'High to Low'}</a>
				</MenuItemStyled>
				<SearchResultTitle theme={theme}>Participants</SearchResultTitle>
				<MenuItemStyled value={3} disabled={sort === 3 ? true : false}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.secondary.main, transform: 'scaleY(-1)' }} />
					<a>{sort === 3 ? 'Participants: Low to High' : 'Low to High'}</a>
				</MenuItemStyled>
				<MenuItemStyled value={4} disabled={sort === 4 ? true : false}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.secondary.main }} />
					<a>{sort === 4 ? 'Participants: High to Low' : 'High to Low'}</a>
				</MenuItemStyled>
				<SearchResultTitle theme={theme}>Entrance Amount</SearchResultTitle>
				<MenuItemStyled value={5} disabled={sort === 5 ? true : false}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.secondary.main, transform: 'scaleY(-1)' }} />
					<a>{sort === 5 ? 'Entrance Amount: Low to High' : 'Low to High'}</a>
				</MenuItemStyled>
				<MenuItemStyled value={6} disabled={sort === 6 ? true : false}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.secondary.main }} />
					<a>{sort === 6 ? 'Entrance Amount: High to Low' : 'High to Low'}</a>
				</MenuItemStyled>
			</StyledSelect>
		</>
	);
}
