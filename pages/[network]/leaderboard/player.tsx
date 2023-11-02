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
	max-width: 1400px;
	// height: 85vh;
	margin: 5rem auto 0 auto;
	background-color: transparent;

	@media (max-width: 600px) {
		width: 95%;
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
	height: 100%;

	@media (max-width: 600px) {
		font-size: 3rem;
	}
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

	@media (max-width: 600px) {
		font-size: 3rem;
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
	height: 40px;
	width: 150px;
	margin-left: 1rem;
	cursor: not-allowed;

	& .MuiToggleButton-root {
		&:hover {
			background-color: transparent;
			border: 1px solid ${({ theme }) => theme.palette.warning.main};
			border-left: 1px solid ${({ theme }) => theme.palette.warning.main};
		}
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

export default function RankingPage() {
	const theme = useTheme();
	const router = useRouter();
	const network = router.query.network as string;

	// Name to Chain ID
	const chainIdUrl = nameToChainId[network];

	// Redux
	const dispatch = useDispatch();
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const currencyPrice = useSelector((state: { currencyPrice: number }) => state.currencyPrice);
	const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);

	// Toogle Button For Token Price
	const handleToggle = (event, newCurrency) => {
		// update currencyValue in redux
		dispatch(currencySlice.actions.updateCurrency(newCurrency));
	};

	// Network Check
	const isNetworkAvailable = availableChains.includes(chainIdUrl);

	const [order, setOrder] = useState('desc');
	const [orderBy, setOrderBy] = useState('earned');
	const data = usePlayerRankingData(isNetworkAvailable ? chainIdUrl : 137, orderBy);

	const createSortHandler = (property) => (event) => {
		const isAsc = orderBy === property && order === 'desc';
		setOrder(isAsc ? 'asc' : 'desc');
		setOrderBy(property);
	};

	const sortedData = [...data].sort((a, b) => {
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
			router.push(`/${network}/player/${playerId}`);
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

	return (
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
				<Title theme={theme}>
					<a>Player Leaderboard</a>
				</Title>
				<StyledToggleButtonGroup theme={theme} value={currencyValue} exclusive onChange={handleToggle}>
					<StyledToggleButton theme={theme} disabled={currencyValue === false} value={false}>
						{isNetworkAvailable ? <a>{CHAINS[chainIdUrl]?.nameToken}</a> : <a>MATIC</a>}
					</StyledToggleButton>
					<StyledToggleButton theme={theme} disabled={currencyValue === true} value={true}>
						<a>USD</a>
					</StyledToggleButton>
				</StyledToggleButtonGroup>
				<StyledTable theme={theme}>
					<TableHead>
						<TableRow>
							<TableCell>#</TableCell>
							<TableCell>Name</TableCell>
							<TableCell>Address</TableCell>
							<TableCell style={{ textAlign: 'center' }}>Socials</TableCell>
							<TableCell>
								<StyledButton theme={theme} onClick={createSortHandler('earned')}>
									Earned
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
									Spent
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
						{data.length > 0 ? (
							sortedData.map((row, index) => (
								<StyledTableRow theme={theme} key={index}>
									<TableCell>{index + 1}</TableCell>
									<TableCell>
										<a style={{ cursor: 'pointer' }} onClick={handlePlayer(row.userName)}>
											{row.userName ? row.userName : 'N/A'}
										</a>
									</TableCell>
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
											href={CHAINS[isNetworkAvailable ? chainIdUrl : 137]?.blockExplorerUrls[0] + 'address/' + row.id}
											target="_blank"
										>
											{`${row.id.slice(0, 6)}...${row.id.slice(-4)}`}
											<OpenInNew style={{ display: 'flex', fontSize: '14px', fill: 'rgba(128, 128, 138, 1)' }} />
										</a>
									</TableCell>
									<TableCell
										style={{
											// display: 'flex',
											justifyContent: 'center',
											alignItems: 'center',
											gap: '15px',
											minHeight: '100%',
											textAlign: 'center',
											margin: '0 auto 0 auto',
										}}
									>
										{row.userSocialStat?.instagram && <StyledInstagram />}
										{row.userSocialStat?.twitter && <StyledTwitter />}
										{row.userSocialStat?.tiktok && <StyledTikTok />}
										{row.userSocialStat?.twitch && <StyledTwitch />}
										{row.userSocialStat?.youtube && <StyledYouTube />}
									</TableCell>
									<TableCell style={{ textAlign: 'right' }}>
										{currencyValue === false ? (
											<a>
												{formatNumber(row.earned)} {isNetworkAvailable ? CHAINS[chainIdUrl]?.nameToken : 'MATIC'}
											</a>
										) : (
											<a>${formatNumber(row.earned * currencyPrice[network]?.usd)}</a>
										)}
									</TableCell>
									<TableCell style={{ textAlign: 'right' }}>
										{currencyValue === false ? (
											<a>
												{formatNumber(row.spent)} {isNetworkAvailable ? CHAINS[chainIdUrl]?.nameToken : 'MATIC'}
											</a>
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
				<StyledArrowCircleUpOutlinedIcon theme={theme} onClick={handleScrollToTop} />
			</StyledBox>
		</>
	);
}
