import styled from '@emotion/styled';
import SwapVertIcon from '@mui/icons-material/SwapVert';
import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { sortSlice } from '../state/sort/sortSlice';

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
	min-width: 225px;
	max-width: 375px;
	transition: all 0.5s ease-in-out;
	margin-left: 1rem;
	cursor: pointer;

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
	}

	& .MuiSelect-icon {
		color: ${({ theme }) => theme.palette.text.primary};
	}

	& .MuiPaper-root {
		min-width: 225px;
		max-width: 375px;
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

export default function SelectSort() {
	const theme = useTheme();
	// Redux
	const dispatch = useDispatch();
	const sort = useSelector((state: { sort: number }) => state.sort);

	const handleChange = (event: SelectChangeEvent) => {
		dispatch(sortSlice.actions.updateSort(event.target.value));
	};

	// State
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
			<StyledSelect
				open={menuOpen}
				onOpen={handleOpen}
				onClose={handleClose}
				theme={theme}
				variant="outlined"
				value={sort}
				onChange={handleChange}
				focus={isFocused}
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
			>
				<SearchResultTitle theme={theme}>Stake</SearchResultTitle>
				<MenuItemStyled theme={theme} value={1} disabled={sort === 1 ? true : false}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.text.primary, transform: 'scaleY(-1)' }} />
					<a>{sort === 1 ? 'Stake: Low to High' : 'Low to High'}</a>
				</MenuItemStyled>
				<MenuItemStyled theme={theme} value={2} disabled={sort === 2 ? true : false}>
					{/* <SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.text.primary }} /> */}
					<a>{sort === 2 ? 'Stake: High to Low' : 'High to Low'}</a>
				</MenuItemStyled>
				<SearchResultTitle theme={theme}>Participants</SearchResultTitle>
				<MenuItemStyled theme={theme} value={3} disabled={sort === 3 ? true : false}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.text.primary, transform: 'scaleY(-1)' }} />
					<a>{sort === 3 ? 'Participants: Low to High' : 'Low to High'}</a>
				</MenuItemStyled>
				<MenuItemStyled theme={theme} value={4} disabled={sort === 4 ? true : false}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.text.primary }} />
					<a>{sort === 4 ? 'Participants: High to Low' : 'High to Low'}</a>
				</MenuItemStyled>
				<SearchResultTitle theme={theme}>Entry Amount</SearchResultTitle>
				<MenuItemStyled theme={theme} value={5} disabled={sort === 5 ? true : false}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.text.primary, transform: 'scaleY(-1)' }} />
					<a>{sort === 5 ? 'Entry Amount: Low to High' : 'Low to High'}</a>
				</MenuItemStyled>
				<MenuItemStyled theme={theme} value={6} disabled={sort === 6 ? true : false}>
					<SwapVertIcon style={{ marginRight: '0.5rem', color: theme.palette.text.primary }} />
					<a>{sort === 6 ? 'Entry Amount: High to Low' : 'High to Low'}</a>
				</MenuItemStyled>
			</StyledSelect>
		</>
	);
}
