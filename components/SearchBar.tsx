import styled from '@emotion/styled';
import SearchIcon from '@mui/icons-material/Search';
import { ClickAwayListener, IconButton, InputBase, List, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import useDareDataSearchList from '../hooks/useDareDataSearchList';
import usePlayerDataSearchList from '../hooks/usePlayerDataSearchList';
import EthereumLogo from '/public/svg/chains/ethereum.svg';
import PolygonLogo from '/public/svg/chains/polygon.svg';

const SearchBarContainer = styled(Paper)({
	display: 'flex',
	width: '50%',
	alignItems: 'center',
	backgroundColor: 'rgba(38, 38, 56, 1)',
	border: '1px solid rgba(74, 74, 98, 1)',
	borderRadius: 15,
	padding: '0 8px',
	minHeight: '40px',
	height: '40px',
	transition: 'all 0.5s ease-in-out',

	'&:hover': {
		backgroundColor: 'rgba(58, 58, 76, 1)',
	},
	'& input': {
		color: '#fff',
		// marginLeft: '8px', // Added margin for a little spacing between the icon and text input
	},
	'& input::placeholder': {
		// fontSize: '0.875rem',
		color: 'rgba(128, 128, 138, 1)',
	},
	'& .MuiSvgIcon-root': {
		color: '#fff',
	},
	position: 'relative', // Added relative positioning to act as a reference for the absolute positioning of the results list

	'@media (max-width: 768px)': {
		width: '75%', // Set width to 100% for smaller screens
	},
});

const SearchResultList = styled(List)({
	color: '#000',
	backgroundColor: 'rgba(38, 38, 56, 1)',
	border: '1px solid rgba(74, 74, 98, 1)',
	borderRadius: 15,
	position: 'absolute',
	width: '100%',
	maxHeight: '500px',
	overflowY: 'auto',
	top: '100%', // Position the top of the list right at the bottom of the input
	left: '0', // Align left edge with the search bar
	right: '0', // Align right edge with the search bar
	borderTopLeftRadius: '15px', // Add top left border radius
	borderTopRightRadius: '15px', // Add top right border radius
});

const SearchResultItemStyled = styled.div({
	color: '#fff',
	backgroundColor: 'rgba(38, 38, 56, 1)',
	verticalAlign: 'middle',
	width: '100%',
	margin: '0 auto 0 auto',
	padding: '0.5rem',
	cursor: 'pointer',
	display: 'flex',
	flexDirection: 'column',

	a: {
		fontSize: '0.75rem',
		color: 'rgba(128, 128, 138, 1)',
		textDecoration: 'none',
	},

	'&:focus, &:hover': {
		backgroundColor: 'rgba(58, 58, 76, 1)',
	},

	'& .item-top': {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	'& .item-bottom': {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		fontSize: '0.8rem',
		marginTop: '0.25rem',
	},
});

const SearchResultTitle = styled.div({
	fontSize: '0.75rem',
	color: 'rgba(255, 255, 255, 1)',
	backgroundColor: 'transparent', // Or whatever background color you'd like
	padding: '0.5rem',
	fontWeight: 'bold',
	textAlign: 'left',
	borderTopLeftRadius: '15px', // If you want rounded corners on the top
	borderTopRightRadius: '15px', // If you want rounded corners on the top
	// borderTop: '1px solid #ddd', // Optional: A line to separate from previous items
	// marginTop: '1rem', // Added margin-top for spacing
});

export default function SearchBar() {
	// Redux
	const chainId = useSelector((state: { chainId: number }) => state.chainId);

	const [searchValue, setSearchValue] = useState('');
	const playerSearchList = usePlayerDataSearchList(137, searchValue);
	const dareSearchList = useDareDataSearchList(137, searchValue); // New hook to get dares based on search value
	const [isListVisible, setListVisible] = useState(false);
	const router = useRouter();

	const handleSearchChange = (e) => {
		setSearchValue(e.target.value);
		setListVisible(true); // Show search results when typing
	};

	const handleFocus = () => {
		if (searchValue.trim()) {
			setListVisible(true); // Show search results when input is focused and there's a term to search
		}
	};

	const handleListPlayerItemClick = (playerId) => {
		router.push(`/player/${playerId}`);
		setSearchValue(''); // clear input
		setListVisible(false); // Hide the result list
	};

	const handleListDareItemClick = (dareId) => {
		router.push(`/dare/${dareId}`);
		setSearchValue(''); // clear input
		setListVisible(false); // Hide the result list
	};

	function formatNumber(value) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	return (
		<ClickAwayListener onClickAway={() => setListVisible(false)}>
			<SearchBarContainer component="form" onSubmit={(e) => e.preventDefault()}>
				<IconButton type="submit" aria-label="search" style={{ cursor: 'default' }} disableRipple>
					<SearchIcon style={{ color: 'rgba(128, 128, 138, 1)' }} />
				</IconButton>
				<InputBase
					fullWidth={true}
					placeholder="Search players…"
					inputProps={{ 'aria-label': 'search' }}
					value={searchValue}
					onChange={handleSearchChange}
					onFocus={handleFocus}
				/>
				{isListVisible && (
					<SearchResultList>
						{playerSearchList.length > 0 && (
							<>
								<SearchResultTitle>Players</SearchResultTitle>
								{playerSearchList.map((player) => (
									<SearchResultItemStyled key={player.id} onClick={() => handleListPlayerItemClick(player.userName)}>
										<div className="item-top">
											<span className="player-name">{player.userName}</span>
											{/* <span className="player-number">{player.someNumber}</span> */}
										</div>
										<div className="item-bottom">
											<a>{player.userAddress}</a>
											{/* <span className="player-additional-text">Earned</span> */}
										</div>
									</SearchResultItemStyled>
								))}
							</>
						)}
						{dareSearchList.length > 0 && (
							<>
								<SearchResultTitle style={{ marginTop: playerSearchList.length > 0 ? '1rem' : '0px' }}>Dares</SearchResultTitle>
								{dareSearchList.map((dare) => (
									<SearchResultItemStyled key={dare.id} onClick={() => handleListDareItemClick(dare.id)}>
										<div className="item-top">
											<span>{dare.description.length > 25 ? `${dare.description.substring(0, 25)}...` : dare.description}</span>

											<span>
												{formatNumber(dare.amount)}{' '}
												{chainId === 137 ? (
													<PolygonLogo
														style={{
															display: 'inline-block',
															verticalAlign: 'middle',
														}}
														width="16"
														height="16"
														alt="Logo"
													/>
												) : (
													<EthereumLogo style={{ display: 'flex', marginRight: '8px' }} width="22" height="22" alt="Logo" />
												)}
											</span>
										</div>
										<div className="item-bottom">
											<a>{dare.participants} participants</a>
											<a>Stake</a>
										</div>
									</SearchResultItemStyled>
								))}
							</>
						)}
						{playerSearchList.length === 0 && dareSearchList.length === 0 && searchValue.trim() !== '' && (
							<SearchResultTitle style={{ display: 'flex', justifyContent: 'center' }}>No players or dares were found.</SearchResultTitle>
						)}
					</SearchResultList>
				)}
			</SearchBarContainer>
		</ClickAwayListener>
	);
}
