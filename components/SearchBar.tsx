import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import SearchIcon from '@mui/icons-material/Search';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Button, ClickAwayListener, IconButton, InputBase, List, Paper } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import local from 'next/font/local';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { SiEthereum, SiPolygon } from 'react-icons/si';
import useTrendingDareList from '../hooks/searchData/trending/useTrendingDareList';
import useTrendingPlayerList from '../hooks/searchData/trending/useTrendingPlayerList';
import useDareDataSearchList from '../hooks/searchData/useDareDataSearchList';
import usePlayerDataSearchList from '../hooks/searchData/usePlayerDataSearchList';
import { nameToChainId } from '../utils/chains';
import SearchBarMobile from './SearchBarMobile';

const SearchBarContainer = styled(Paper)<{ theme: any }>`
	display: flex;
	width: 100%;
	max-width: 25rem;
	align-items: center;
	background-color: transparent;
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	min-height: 40px;
	height: 40px;
	transition: all 0.5s ease-in-out;

	&:hover {
		border: 1px solid ${({ theme }) => theme.palette.warning.main};
	}
	&:focus-within {
		border-bottom-left-radius: 0px;
		border-bottom-right-radius: 0px;
		border: 1px solid ${({ theme }) => theme.palette.warning.main};
		background-color: ${({ theme }) => theme.palette.background.default};
	}
	& input {
		color: ${({ theme }) => theme.palette.text.primary};
	}
	& input::placeholder {
		color: ${({ theme }) => theme.palette.secondary.main};
	}
	& .MuiSvgIcon-root {
		color: ${({ theme }) => theme.palette.text.primary};
	}
	position: relative;

	@media (max-width: 1024px) {
		display: none;
		visibility: hidden;
	}
`;

const SearchResultList = styled(List)<{ theme: any }>`
	color: #000;
	background-color: ${({ theme }) => theme.palette.background.default};
	border-radius: ${({ theme }) => theme.shape.borderRadius};
	outline: 1px solid ${({ theme }) => theme.palette.warning.main};
	outline-offset: 0px;
	position: absolute;
	width: 100%;
	max-height: 500px;
	overflow-y: auto;
	top: 100%;
	left: 0;
	right: 0;
	border-top-left-radius: 0px;
	border-top-right-radius: 0px;

	&::-webkit-scrollbar {
		width: 4px;
	}
	&::-webkit-scrollbar-track {
		background: transparent;
	}
	&::-webkit-scrollbar-thumb {
		background: ${({ theme }) => theme.palette.warning.main};
		border-radius: 12px;
	}
	&::-webkit-scrollbar-thumb:hover {
		background: ${({ theme }) => theme.palette.secondary.main};
	}
`;

const SearchResultItemStyled = styled.div<{ theme: any }>`
	color: ${({ theme }) => theme.palette.text.primary};
	background-color: ${({ theme }) => theme.palette.background.default};
	vertical-align: middle;
	width: 100%;
	height: 100%;
	margin: 0 auto;
	padding: 1rem;
	cursor: pointer;
	display: flex;
	flex-direction: column;

	& a {
		font-size: 0.75rem;
		color: ${({ theme }) => theme.palette.text.secondary};
		text-decoration: none;
	}

	&:focus,
	&:hover {
		background-color: ${({ theme }) => theme.palette.warning.main};
	}

	& .item-top,
	& .item-bottom {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	& .item-bottom {
		font-size: 0.8rem;
		margin-top: 0.25rem;
	}

	@media (max-width: 1024px) {
		padding: 0.5rem 1rem;

		&:hover {
			background-color: transparent;
		}
	}
`;

const SearchResultTitle = styled.div<{ theme: any }>`
	display: flex;
	align-items: center;
	font-size: 0.75rem;
	color: ${({ theme }) => theme.palette.secondary.main};
	background-color: transparent;
	padding: 0.5rem;
	font-weight: bold;
	text-align: left;
	border-top-left-radius: 15px;
	border-top-right-radius: 15px;

	div {
		display: flex;
		margin-left: 0.5rem;
	}

	span {
		display: flex;
		flex: 1;
		justify-content: flex-end;
	}
`;

interface SearchBarProps {
	network: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ network }) => {
	const theme = useTheme();
	const router = useRouter();

	// Name to Chain ID
	const chainIdUrl = nameToChainId[network];

	// State declarations
	const [searchValue, setSearchValue] = useState('');
	const [searchValueQuery, setSearchValueQuery] = useState('');
	const typingTimeoutRef = useRef(null);
	const playerSearchList = usePlayerDataSearchList(searchValueQuery);
	const { trendingPlayerList, trendingPlayerListLoading, trendingPlayerListError } = useTrendingPlayerList();
	const trendingDareList = useTrendingDareList(chainIdUrl);
	const dareSearchList = useDareDataSearchList(chainIdUrl, searchValueQuery);
	const [isListVisible, setListVisible] = useState(false);

	// Initialize the searchHistory state as an empty array
	const [searchHistory, setSearchHistory] = useState([]);

	// Update searchHistory from localStorage when the component mounts
	useEffect(() => {
		try {
			const savedHistory = window.localStorage.getItem('searchHistory');
			setSearchHistory(savedHistory ? JSON.parse(savedHistory) : []);
		} catch (error) {
			console.error('Failed to parse search history from localStorage', error);
			setSearchHistory([]);
		}
	}, []);

	// Call this function when a search item is clicked to add to history
	const addToSearchHistory = (searchItem) => {
		setSearchHistory((prevHistory) => {
			const newHistory = [searchItem, ...prevHistory.filter((item) => item.id !== searchItem.id)].slice(0, 3); // Keep only the first 3 items
			localStorage.setItem('searchHistory', JSON.stringify(newHistory));
			return newHistory;
		});
	};

	const clearSearchHistory = () => {
		setSearchHistory([]);
		localStorage.removeItem(`searchHistory`);
	};

	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchValue(value); // Update the input field immediately
		setListVisible(true); // Make the list visible immediately with no delay

		// Clear the existing timeout every time the user types to reset the delay
		if (typingTimeoutRef.current) {
			clearTimeout(typingTimeoutRef.current);
		}

		// Set a new timeout to delay the proceeding actions (like fetching data)
		typingTimeoutRef.current = setTimeout(() => {
			// Delayed actions here
			setSearchValueQuery(value);
		}, 1000); // 1-second delay
	};

	// Cleanup the timeout when the component unmounts
	useEffect(() => {
		return () => {
			if (typingTimeoutRef.current) {
				clearTimeout(typingTimeoutRef.current);
			}
		};
	}, []);

	const handleFocus = () => {
		setListVisible(true); // Show search results when input is focused
	};

	const handleListPlayerItemClick = (playerId, playerAddress, searchValue) => {
		if (playerId && playerAddress === '') {
			router.push(`/player/${searchValue}`);
		} else if (playerId === '' && playerAddress !== '') {
			router.push(`/player/${playerAddress}`);
		} else {
			router.push(`/player/${playerId}`);
		}
		setSearchValue('');
		setListVisible(false);
		addToSearchHistory({ type: 'player', id: playerId, address: playerAddress }); // Update to store an object with type and id
	};

	const handleListDareItemClick = (dareId, dareAmount, dareParticipants) => {
		router.push(`/dare/${dareId}`);
		setSearchValue('');
		setListVisible(false);
		addToSearchHistory({ type: 'dare', id: dareId, amount: dareAmount, participants: dareParticipants }); // Same as above for dares
	};

	function formatNumber(value) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	// Mobile Search Menu
	// State declarations
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [isClosing, setIsClosing] = useState(false);

	const disableScrolling = () => {
		const body = document.body;
		body.style.overflow = 'hidden';
	};

	const enableScrolling = () => {
		const body = document.body;
		body.style.overflow = 'auto';
	};

	const toggleMenu = () => {
		if (isMenuOpen) {
			setIsClosing(true);
			setTimeout(() => {
				setIsMenuOpen(false);
				setIsClosing(false);
				enableScrolling();
			}, 500); // 500ms for the slide down duration
		} else {
			setIsMenuOpen(true);
			disableScrolling();
		}
	};

	return (
		<>
			<ClickAwayListener
				onClickAway={() => {
					setListVisible(false);
				}}
			>
				<SearchBarContainer theme={theme} onSubmit={(e) => e.preventDefault()} elevation={0}>
					<IconButton type="submit" aria-label="search" style={{ cursor: 'default', backgroundColor: 'transparent' }} disableRipple>
						<SearchIcon style={{ color: theme.palette.secondary.main }} />
					</IconButton>
					<InputBase
						fullWidth={true}
						style={{ fontSize: '0.875rem' }}
						placeholder={`Search players and dares…`}
						inputProps={{ 'aria-label': 'search' }}
						value={searchValue}
						onChange={handleSearchChange}
						onFocus={handleFocus}
					/>
					{isListVisible && (
						<SearchResultList theme={theme}>
							{searchValue.trim() === '' && (
								<>
									{searchHistory.length > 0 && (
										<>
											<SearchResultTitle theme={theme}>
												<AccessTimeOutlinedIcon style={{ marginRight: '0.5rem', color: theme.palette.secondary.main }} />
												Recent searches
												<span>
													<CloseOutlinedIcon
														fontSize={'small'}
														onClick={clearSearchHistory}
														style={{ cursor: 'pointer', color: theme.palette.error.main }}
													/>
												</span>
											</SearchResultTitle>
											{searchHistory.map((item) => (
												<SearchResultItemStyled
													theme={theme}
													key={item.id}
													onClick={() => {
														if (item.type === 'player' || searchValue.includes('0x')) {
															handleListPlayerItemClick(item.id, item.address, searchValue.toLowerCase());
														} else {
															handleListDareItemClick(item.id, item.amount, item.participants);
														}
													}}
												>
													{item.type === 'player' ? (
														<>
															<div className="item-top">
																<span className="player-name">{item.id}</span>
																{/* <span className="player-number">{player.someNumber}</span> */}
															</div>
															<div className="item-bottom">
																<a>{item.address}</a>
																{/* <span className="player-additional-text">Earned</span> */}
															</div>
														</>
													) : (
														<>
															<div className="item-top">
																<span>{item.id.length > 25 ? `${item.id.substring(0, 25)}...` : item.id}</span>

																<span>
																	{formatNumber(item.amount)}{' '}
																	{chainIdUrl === 137 ? (
																		<SiPolygon
																			style={{
																				display: 'inline-block',
																				verticalAlign: 'middle',
																			}}
																			width="16"
																			height="16"
																		/>
																	) : (
																		<SiEthereum
																			style={{
																				display: 'flex',
																				marginRight: '8px',
																			}}
																			width="22"
																			height="22"
																		/>
																	)}
																</span>
															</div>
															<div className="item-bottom">
																<a>{item.participants} participants</a>
																<a>Stake</a>
															</div>
														</>
													)}
												</SearchResultItemStyled>
											))}
										</>
									)}
									<SearchResultTitle theme={theme}>
										<TrendingUpIcon style={{ marginRight: '0.5rem', color: theme.palette.secondary.main }} />
										Trending Players
									</SearchResultTitle>
									{trendingPlayerList.length > 0 ? (
										trendingPlayerList.map((trendingPlayer) => (
											<SearchResultItemStyled
												theme={theme}
												key={trendingPlayer.id}
												onClick={() => handleListPlayerItemClick(trendingPlayer.userName, trendingPlayer.id)}
											>
												<div className="item-top">
													<span className="player-name">{trendingPlayer.ensName}</span>
													{/* <span className="player-number">{trendingPlayer.earned}</span> */}
												</div>
												<div className="item-bottom">
													<a>{trendingPlayer.id}</a>
													{/* <span className="player-additional-text">Earned</span> */}
												</div>
											</SearchResultItemStyled>
										))
									) : (
										<SearchResultTitle theme={theme} style={{ display: 'flex', justifyContent: 'left' }}>
											<div>No trending players were found.</div>
										</SearchResultTitle>
									)}
									<SearchResultTitle theme={theme}>
										<TrendingUpIcon style={{ marginRight: '0.5rem', color: theme.palette.secondary.main }} />
										Trending Dares
									</SearchResultTitle>
									{trendingDareList.length > 0 ? (
										trendingDareList.map((trendingDare) => (
											<SearchResultItemStyled
												theme={theme}
												key={trendingDare.id}
												onClick={() => handleListDareItemClick(trendingDare.description, trendingDare.amount, trendingDare.participants)}
											>
												<div className="item-top">
													<span>
														{trendingDare.description.length > 25 ? `${trendingDare.description.substring(0, 25)}...` : trendingDare.description}
													</span>

													<span>
														{formatNumber(trendingDare.amount)}{' '}
														{chainIdUrl === 137 ? (
															<SiPolygon
																style={{
																	display: 'inline-block',
																	verticalAlign: 'middle',
																}}
																width="16"
																height="16"
															/>
														) : (
															<SiEthereum
																style={{
																	display: 'flex',
																	marginRight: '8px',
																}}
																width="22"
																height="22"
															/>
														)}
													</span>
												</div>
												<div className="item-bottom">
													<a>{trendingDare.participants} participants</a>
													<a>Stake</a>
												</div>
											</SearchResultItemStyled>
										))
									) : (
										<SearchResultTitle theme={theme} style={{ display: 'flex', justifyContent: 'left' }}>
											<div>No trending dares were found.</div>
										</SearchResultTitle>
									)}
								</>
							)}
							{searchValue.trim() !== '' && playerSearchList.length > 0 && (
								<>
									<SearchResultTitle theme={theme}>Players</SearchResultTitle>
									{playerSearchList.map((player) => (
										<SearchResultItemStyled
											theme={theme}
											key={player.id}
											onClick={() => handleListPlayerItemClick(player.name, player.resolver?.addr?.id)}
										>
											<div className="item-top">
												<span className="player-name">{player.name}</span>
												{/* <span className="player-number">{player.someNumber}</span> */}
											</div>
											<div className="item-bottom">
												<a>{player.resolver?.addr?.id}</a>
												{/* <span className="player-additional-text">Earned</span> */}
											</div>
										</SearchResultItemStyled>
									))}
								</>
							)}
							{searchValue.trim() !== '' && dareSearchList.length > 0 && (
								<>
									<SearchResultTitle theme={theme} style={{ marginTop: playerSearchList.length > 0 ? '1rem' : '0px' }}>
										Dares
									</SearchResultTitle>
									{dareSearchList.map((dare) => (
										<SearchResultItemStyled
											theme={theme}
											key={dare.id}
											onClick={() => handleListDareItemClick(dare.description, dare.amount, dare.participants)}
										>
											<div className="item-top">
												<span>{dare.description.length > 25 ? `${dare.description.substring(0, 25)}...` : dare.description}</span>

												<span>
													{formatNumber(dare.amount)}{' '}
													{chainIdUrl === 137 ? (
														<SiPolygon
															style={{
																display: 'inline-block',
																verticalAlign: 'middle',
															}}
															width="16"
															height="16"
														/>
													) : (
														<SiEthereum
															style={{
																display: 'flex',
																marginRight: '8px',
															}}
															width="22"
															height="22"
														/>
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
							{searchValue.trim() !== '' && playerSearchList.length === 0 && dareSearchList.length === 0 && searchValue.trim() !== '' && (
								<SearchResultTitle theme={theme} style={{ display: 'flex', justifyContent: 'center' }}>
									No players or dares were found.
								</SearchResultTitle>
							)}
						</SearchResultList>
					)}
				</SearchBarContainer>
			</ClickAwayListener>
			<SearchBarMobile network={network} />
		</>
	);
};

export default SearchBar;
