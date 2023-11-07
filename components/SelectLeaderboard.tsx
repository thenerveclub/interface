import styled from '@emotion/styled';
import { MenuItem, Select } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import router from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';

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
	min-width: 175px;
	max-width: 225px;
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

export default function SelectLeaderboard() {
	const theme = useTheme();

	// Redux
	const testnetsValue = useSelector((state: { testnets: boolean }) => state.testnets);

	// Local state
	const [menuOpen, setMenuOpen] = useState(false);
	const [isFocused, setIsFocused] = useState(false);

	// Open/close menu
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
				displayEmpty // To allow for the placeholder even when no value is selected
				value="" // No value is selected by default
				renderValue={() => 'Leaderboards'} // Always display "Leaderboards" as the value
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
								backgroundColor: theme.palette.warning.main,
							},
						},
					},
				}}
			>
				<SearchResultTitle theme={theme}>Polygon</SearchResultTitle>
				<MenuItemStyled theme={theme} onClick={() => router.push(`/polygon/leaderboard/player`)}>
					<a>Player</a>
				</MenuItemStyled>
				<MenuItemStyled theme={theme} onClick={() => router.push(`/polygon/leaderboard/dare`)}>
					<a>Dare</a>
				</MenuItemStyled>
				{testnetsValue && (
					<span>
						<SearchResultTitle theme={theme}>Goerli</SearchResultTitle>
						<MenuItemStyled theme={theme} onClick={() => router.push(`/goerli/leaderboard/player`)}>
							<a>Player</a>
						</MenuItemStyled>
						<MenuItemStyled theme={theme} onClick={() => router.push(`/goerli/leaderboard/dare`)}>
							<a>Dare</a>
						</MenuItemStyled>
					</span>
				)}
			</StyledSelect>
		</>
	);
}
