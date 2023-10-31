import styled from '@emotion/styled';
import { OpenInNew } from '@mui/icons-material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import localFont from 'next/font/local';
import Head from 'next/head';
import router from 'next/router';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import useDareRankingData from '../../hooks/rankingData/useDareRankingData';
import { CHAINS } from '../../utils/chains';
import Instagram from '/public/svg/socials/instagram.svg';
import TikTok from '/public/svg/socials/tiktok.svg';
import Twitch from '/public/svg/socials/twitch.svg';
import Twitter from '/public/svg/socials/twitter.svg';
import Youtube from '/public/svg/socials/youtube.svg';

const TrueLies = localFont({ src: '../../public/fonts/TrueLies.woff2', display: 'swap' });

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
	color: #fff;
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
	cursor: pointer;

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

export default function RankingDaresPage() {
	const theme = useTheme();

	// Redux
	const chainId = useSelector((state: { chainId: number }) => state.chainId);
	const availableChains = useSelector((state: { availableChains: number[] }) => state.availableChains);

	// Network Check
	const isNetworkAvailable = availableChains.includes(chainId);

	const [order, setOrder] = useState('desc');
	const [orderBy, setOrderBy] = useState('amount');
	const data = useDareRankingData(isNetworkAvailable ? chainId : 137, orderBy);

	const createSortHandler = (property) => (event) => {
		const isAsc = orderBy === property && order === 'desc';
		setOrder(isAsc ? 'asc' : 'desc');
		setOrderBy(property);
	};

	const sortedData = [...data].sort((a, b) => {
		let aValue, bValue;

		if (orderBy === 'voters') {
			aValue = Number(a.positiveVotes) + Number(a.negativeVotes);
			bValue = Number(b.positiveVotes) + Number(b.negativeVotes);
		} else if (orderBy === 'voting') {
			const totalVotesA = Number(a.positiveVotes) + Number(a.negativeVotes);
			const totalVotesB = Number(b.positiveVotes) + Number(b.negativeVotes);
			aValue = totalVotesA === 0 ? -1 : (Number(a.positiveVotes) / totalVotesA) * 100;
			bValue = totalVotesB === 0 ? -1 : (Number(b.positiveVotes) / totalVotesB) * 100;
		} else {
			aValue = Number(a[orderBy]);
			bValue = Number(b[orderBy]);
		}

		if (aValue === -1 && bValue !== -1) return 1; // Move a to the middle
		if (bValue === -1 && aValue !== -1) return -1; // Move b to the middle

		if (order === 'asc') {
			return aValue - bValue;
		} else {
			return bValue - aValue;
		}
	});

	const handleDare = (dareID) => {
		return () => {
			router.push(`/dare/${dareID}`);
		};
	};

	function formatNumber(value) {
		return (Number(value) / 1e18).toLocaleString('en-US', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2,
		});
	}

	function calculatePositivePercentage(positiveVotes, negativeVotes) {
		const numPositiveVotes = Number(positiveVotes);
		const numNegativeVotes = Number(negativeVotes);

		const totalVotes = numPositiveVotes + numNegativeVotes;

		// Handle cases with no votes
		if (totalVotes === 0) return <span style={{ color: theme.palette.text.primary }}>0.00%</span>;

		const percentage = (numPositiveVotes / totalVotes) * 100;
		const formattedPercentage = percentage.toFixed(2) + '%';

		// Determine color and value based on the percentage
		if (percentage > 50) {
			return <span style={{ color: 'green' }}>{formattedPercentage}</span>;
		} else if (percentage === 50) {
			return <span style={{ color: 'green' }}>{formattedPercentage}</span>;
		} else {
			const negativePercentage = (100 - percentage).toFixed(2) + '%';
			return <span style={{ color: 'red' }}>{negativePercentage}</span>;
		}
	}

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
					<a>Ranking</a>
				</Title>
				<StyledTable theme={theme}>
					<TableHead>
						<TableRow>
							<TableCell>#</TableCell>
							<TableCell>Description</TableCell>
							<TableCell>
								<StyledButton theme={theme} onClick={createSortHandler('entranceAmount')}>
									Entry Amount
									{orderBy === 'entranceAmount' ? (
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
								<StyledButton theme={theme} onClick={createSortHandler('amount')}>
									Total Amount
									{orderBy === 'amount' ? (
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
								<StyledButton theme={theme} onClick={createSortHandler('participants')}>
									Participants
									{orderBy === 'participants' ? (
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
								<StyledButton theme={theme} onClick={createSortHandler('voters')}>
									Voters
									{orderBy === 'voters' ? (
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
								<StyledButton theme={theme} onClick={createSortHandler('voting')}>
									Voting
									{orderBy === 'voting' ? (
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
						{sortedData.map((row, index) => (
							<StyledTableRow theme={theme} key={index} onClick={handleDare(row.id)}>
								<TableCell>{index + 1}</TableCell>
								<TableCell>
									<a style={{ cursor: 'pointer' }}>
										{row.description.length > 75 ? row.description.substring(0, 75) + '...' : row.description}
									</a>
								</TableCell>
								<TableCell style={{ textAlign: 'right' }}>
									<a style={{ cursor: 'pointer' }}>{formatNumber(row.entranceAmount)} MATIC</a>
								</TableCell>
								<TableCell style={{ textAlign: 'right' }}>
									<a style={{ cursor: 'pointer' }}>{formatNumber(row.amount)} MATIC</a>
								</TableCell>
								<TableCell style={{ textAlign: 'right' }}>{row.participants}</TableCell>
								<TableCell style={{ textAlign: 'right' }}>{Number(row.positiveVotes) + Number(row.negativeVotes)}</TableCell>
								<TableCell style={{ textAlign: 'right' }}>{calculatePositivePercentage(row.positiveVotes, row.negativeVotes)}</TableCell>
							</StyledTableRow>
						))}
					</TableBody>
				</StyledTable>
			</StyledBox>
		</>
	);
}
