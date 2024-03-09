import styled from '@emotion/styled';
import { OpenInNew } from '@mui/icons-material';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import localFont from 'next/font/local';
import Head from 'next/head';
import router, { useRouter } from 'next/router';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';
import usePlayerRankingData from '../../../hooks/rankingData/usePlayerRankingData';
import { currencySlice } from '../../../state/currency/currencySlice';
import { CHAINS, nameToChainId } from '../../../utils/chains';
import Instagram from '/public/svg/socials/instagram.svg';
import TikTok from '/public/svg/socials/tiktok.svg';
import Twitch from '/public/svg/socials/twitch.svg';
import Twitter from '/public/svg/socials/twitter.svg';
import Youtube from '/public/svg/socials/youtube.svg';

const TrueLies = localFont({ src: '../../../public/fonts/TrueLies.woff2', display: 'swap' });

const StyledTwitter = styled(Twitter)<{ theme: any }>`
	path {
		fill: ${({ theme }) => theme.palette.secondary.main};
		transition: fill 0.5s ease-in-out; // Add transition for fill color
	}

	cursor: pointer;
	width: 18px;
	height: 18px;
	transition: all 0.5s ease-in-out;

	&:hover {
		// transform: rotate(-10deg);
		path {
			fill: ${({ theme }) => theme.palette.secondary.contrastText};
		}
	}
`;

const StyledInstagram = styled(Instagram)<{ theme: any }>`
	path {
		fill: ${({ theme }) => theme.palette.secondary.main};
		transition: fill 0.5s ease-in-out; // Add transition for fill color
	}

	cursor: pointer;
	width: 18px;
	height: 18px;
	transition: all 0.5s ease-in-out;

	&:hover {
		// transform: rotate(-10deg);
		path {
			fill: ${({ theme }) => theme.palette.secondary.contrastText};
		}
	}
`;

const StyledTikTok = styled(TikTok)<{ theme: any }>`
	path {
		fill: ${({ theme }) => theme.palette.secondary.main};
		transition: fill 0.5s ease-in-out; // Add transition for fill color
	}

	cursor: pointer;
	width: 18px;
	height: 18px;
	transition: all 0.5s ease-in-out;

	&:hover {
		// transform: rotate(-10deg);
		path {
			fill: ${({ theme }) => theme.palette.secondary.contrastText};
		}
	}
`;

const StyledYouTube = styled(Youtube)<{ theme: any }>`
	path {
		fill: ${({ theme }) => theme.palette.secondary.main};
		transition: fill 0.5s ease-in-out; // Add transition for fill color
	}

	cursor: pointer;
	width: 18px;
	height: 18px;
	transition: all 0.5s ease-in-out;

	&:hover {
		// transform: rotate(-10deg);
		path {
			fill: ${({ theme }) => theme.palette.secondary.contrastText};
		}
	}
`;

const StyledTwitch = styled(Twitch)<{ theme: any }>`
	path {
		fill: ${({ theme }) => theme.palette.secondary.main};
		transition: fill 0.5s ease-in-out; // Add transition for fill color
	}

	cursor: pointer;
	width: 18px;
	height: 18px;
	transition: all 0.5s ease-in-out;

	&:hover {
		// transform: rotate(-10deg);
		path {
			fill: ${({ theme }) => theme.palette.secondary.contrastText};
		}
	}
`;

const StyledBox = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: 90%;
	min-width: 1400px;
	max-width: 1400px;
	// height: 85vh;
	margin: 5rem auto 0 auto;
	background-color: transparent;

	@media (max-width: 680px) {
		width: 100vw;

		min-width: 0;
		max-width: 100vw;
	}
`;

const Title = styled(Typography)<{ theme: any }>`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	font-family: ${TrueLies.style.fontFamily};
	text-transform: none;
	font-size: 5rem;
	cursor: default;
	margin-bottom: 2.5rem;

	a {
		color: ${({ theme }) => theme.palette.text.primary};
		text-decoration: none;
	}

	@media (max-width: 600px) {
		font-size: 3rem;
	}
`;

const StyledTable = styled(Table)<{ theme: any }>`
	width: 100%;
	min-width: 1400px;
	max-width: 1400px;
	height: 100%;
	// table-layout: fixed;

	@media (max-width: 680px) {
		// font-size: 1rem;
		width: 100vw;
		min-width: 0;
		max-width: 100vw;
	}
`;

// Style your TableCell specifically for the "#" column
const NumberCell = styled(TableCell)<{ theme: any }>`
	// width: 50px; // Set a fixed width appropriate for your numbers
	// max-width: 50px;
	// padding: 0 16px; // Adjust padding as needed
	// text-align: center; // Center the text if desired
`;

const StyledButton = styled(Button)<{ theme: any }>`
	display: flex-end;
	flex-direction: row;
	justify-content: right;
	align-items: right;
	color: ${({ theme }) => theme.palette.text.primary};
	background-color: transparent;
	text-transform: none;
	width: 100%;

	@media (max-width: 680px) {
		font-size: 1rem;
	}
`;

const StyledTableRow = styled(TableRow)<{ theme: any }>`
	transition: transform 0.3s, box-shadow 0.3s;

	&:nth-of-type(odd) {
		background-color: ${({ theme }) => theme.palette.background.default};
		// filter: blur(2px);
	}

	&:hover {
		// background-color: ${({ theme }) => theme.palette.primary.dark};
		transform: scale(1.02);
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}
`;

const StyledToggleButtonGroup = styled(ToggleButtonGroup)<{ theme: any }>`
	display: flex;
	align-self: flex-end;
	background-color: transparent;
	height: 35px;
	width: 150px;
	margin: 0 0 1rem 4rem;
	cursor: not-allowed;

	& .MuiToggleButton-root {
		&:hover {
			background-color: transparent;
			border: 1px solid ${({ theme }) => theme.palette.warning.main};
			border-left: 1px solid ${({ theme }) => theme.palette.warning.main};
		}
	}

	@media (max-width: 680px) {
		display: flex;
		justify-content: center;
		margin: 0 auto 1rem auto;
		// width: 100%;
	}
`;

const StyledToggleButton = styled(ToggleButton)<{ theme: any }>`
	color: ${({ theme }) => theme.palette.secondary.main};
	background-color: transparent;
	border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	border-radius: ${({ theme }) => theme.customShape.borderRadius};
	cursor: pointer;
	// font-size: 1rem;
	font-weight: 500;
	width: 150px;

	&.Mui-selected {
		color: ${({ theme }) => theme.palette.text.primary};
		background-color: transparent;
		border: 1px solid ${({ theme }) => theme.palette.secondary.main};
	}
`;

const StyledArrowCircleUpOutlinedIcon = styled(ArrowCircleUpOutlinedIcon)<{ theme: any }>`
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 3rem auto 0 auto;
	// position: fixed;
	// bottom: 1rem;
	// right: 1rem;
	cursor: pointer;
	font-size: 2rem;
	color: ${({ theme }) => theme.palette.secondary.main};
	transition: all 0.5s ease-in-out;

	&:hover {
		transform: scale(1.1);
		color: ${({ theme }) => theme.palette.text.primary};
	}
`;

const StyledTableContainer = styled(Box)<{ theme: any }>`
	height: 100vh;
	overflow-y: auto;

	@media (max-width: 680px) {
		width: 100vw;
		overflow: scroll;
	}
`;

export default function RankingPage() {
	const theme = useTheme();
	const router = useRouter();

	// Redux
	const dispatch = useDispatch();
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const currencyPrice = useSelector((state: { currencyPrice: number }) => state.currencyPrice);

	// Toogle Button For Token Price
	const handleToggle = (event, newCurrency) => {
		// update currencyValue in redux
		dispatch(currencySlice.actions.updateCurrency(newCurrency));
	};

	const [order, setOrder] = useState('desc');
	const [orderBy, setOrderBy] = useState('earned');
	const { rankingList, isLoading } = usePlayerRankingData(137, orderBy);
	const network = 137;

	const createSortHandler = (property) => (event) => {
		const isAsc = orderBy === property && order === 'desc';
		setOrder(isAsc ? 'asc' : 'desc');
		setOrderBy(property);
	};

	const sortedData = [...rankingList].sort((a, b) => {
		let aValue = Number(a[orderBy]);
		let bValue = Number(b[orderBy]);

		if (order === 'asc') {
			return aValue - bValue;
		} else {
			return bValue - aValue;
		}
	});

	const handlePlayer = (playerId) => {
		return () => {
			router.push(`/player/${playerId}`);
		};
	};

	function formatNumber(value) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	const handleScrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	// Define a function to convert numbers to their ordinal representation in JavaScript
	function numberToOrdinal(n) {
		if (10 <= n % 100 && n % 100 <= 20) {
			return n + 'TH';
		}
		switch (n % 10) {
			case 1:
				return n + 'ST';
			case 2:
				return n + 'ND';
			case 3:
				return n + 'RD';
			default:
				return n + 'TH';
		}
	}

	return (
		<>
			{isLoading ? (
				<LoadingScreen />
			) : (
				<>
					<Head>
						<meta name="viewport" content="width=device-width, initial-scale=1" />
						<meta name="robots" content="noindex" />
						<title>Ranking | Nerve Gloabl</title>
						<meta property="og:title" content="Ranking | Nerve Gloabl" key="title" />
						<meta property="og:site_name" content="Ranking | Nerve Gloabl" />
						<meta property="og:description" content="Ranking | Nerve Gloabl" />
						<meta property="og:image" content="https://app.nerveglobal.com/favicon.ico" />
						<meta property="og:url" content="https://app.nerveglobal.com/" />
						<meta property="og:type" content="website" />
						<meta name="twitter:card" content="summary_large_image" />
						<meta name="twitter:site" content="@nerveglobal_" />
						<meta name="twitter:title" content="Ranking | Nerve Gloabl" />
						<meta name="twitter:description" content="Ranking | Nerve Gloabl" />
						<meta name="twitter:image" content="https://app.nerveglobal.com/favicon.ico" />
					</Head>
					<StyledBox>
						{/* <Title theme={theme}>
							<a>Player Leaderboard</a>
						</Title> */}
						<StyledToggleButtonGroup theme={theme} value={currencyValue} exclusive onChange={handleToggle}>
							<StyledToggleButton theme={theme} disabled={currencyValue === false} value={false}>
								ETH
							</StyledToggleButton>
							<StyledToggleButton theme={theme} disabled={currencyValue === true} value={true}>
								<a>USD</a>
							</StyledToggleButton>
						</StyledToggleButtonGroup>
						<StyledTableContainer theme={theme}>
							<StyledTable stickyHeader theme={theme}>
								<TableHead>
									<TableRow>
										<NumberCell theme={theme}>RANK</NumberCell>
										<TableCell>NAME</TableCell>
										<TableCell>ADDRESS</TableCell>
										{/* <TableCell style={{ textAlign: 'center' }}>Socials</TableCell> */}
										<TableCell>
											<StyledButton theme={theme} onClick={createSortHandler('earned')}>
												EARNINGS
												{orderBy === 'earned' ? (
													order === 'asc' ? (
														<ArrowDropUpIcon style={{ color: theme.palette.text.primary }} />
													) : (
														<ArrowDropDownIcon style={{ color: theme.palette.text.primary }} />
													)
												) : order === 'asc' ? (
													<ArrowDropUpIcon style={{ color: theme.palette.secondary.main }} />
												) : (
													<ArrowDropDownIcon style={{ color: theme.palette.secondary.main }} />
												)}
											</StyledButton>
										</TableCell>
										<TableCell>
											<StyledButton theme={theme} onClick={createSortHandler('spent')}>
												CONTRIBUTIONS
												{orderBy === 'spent' ? (
													order === 'asc' ? (
														<ArrowDropUpIcon style={{ color: theme.palette.text.primary }} />
													) : (
														<ArrowDropDownIcon style={{ color: theme.palette.text.primary }} />
													)
												) : order === 'asc' ? (
													<ArrowDropUpIcon style={{ color: theme.palette.secondary.main }} />
												) : (
													<ArrowDropDownIcon style={{ color: theme.palette.secondary.main }} />
												)}
											</StyledButton>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{rankingList.length > 0 ? (
										sortedData.map((row, index) => (
											<StyledTableRow theme={theme} key={index}>
												<NumberCell theme={theme}>{numberToOrdinal(index + 1)}</NumberCell>
												{row.userName ? (
													<TableCell>
														<a style={{ cursor: 'pointer', color: theme.palette.warning.main }} onClick={handlePlayer(row.userName)}>
															{row.userName}
														</a>
													</TableCell>
												) : (
													<TableCell>
														<a style={{ cursor: 'default' }}>N/A</a>
													</TableCell>
												)}
												<TableCell>
													<a
														style={{
															cursor: 'pointer',
															textDecoration: 'none',
															color: theme.palette.text.primary,
															display: 'inline-flex',
															gap: '5px',
															alignItems: 'center',
														}}
														href={CHAINS[137]?.blockExplorerUrls[0] + 'address/' + row.id}
														target="_blank"
													>
														{`${row.id.slice(0, 6)}...${row.id.slice(-4)}`}
														<OpenInNew style={{ display: 'flex', fontSize: '14px', fill: 'rgba(128, 128, 138, 1)' }} />
													</a>
												</TableCell>
												{/* <TableCell
													style={{
														display: 'flex',
														justifyContent: 'center',
														alignItems: 'center',
														minHeight: '100%',
														textAlign: 'center',
														margin: '0 auto 0 auto',
													}}
												>
													<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem' }}>
														{row.userSocialStat?.instagram && <StyledInstagram />}
														{row.userSocialStat?.twitter && <StyledTwitter />}
														{row.userSocialStat?.tiktok && <StyledTikTok />}
														{row.userSocialStat?.twitch && <StyledTwitch />}
														{row.userSocialStat?.youtube && <StyledYouTube />}
													</div>
												</TableCell> */}
												<TableCell style={{ textAlign: 'right' }}>
													{currencyValue === false ? (
														<a>{formatNumber(row.earned)} ETH</a>
													) : (
														<a>${formatNumber(row.earned * currencyPrice[network]?.usd)}</a>
													)}
												</TableCell>
												<TableCell style={{ textAlign: 'right' }}>
													{currencyValue === false ? (
														<a>{formatNumber(row.spent)} ETH</a>
													) : (
														<a>${formatNumber(row.spent * currencyPrice[network]?.usd)}</a>
													)}
												</TableCell>
											</StyledTableRow>
										))
									) : (
										<StyledTableRow theme={theme}>
											<TableCell colSpan={7} style={{ textAlign: 'center' }}>
												No data available on this chain
											</TableCell>
										</StyledTableRow>
									)}
								</TableBody>
							</StyledTable>
						</StyledTableContainer>
						{/* <StyledArrowCircleUpOutlinedIcon theme={theme} onClick={handleScrollToTop} /> */}
					</StyledBox>
				</>
			)}
		</>
	);
}
