import styled from '@emotion/styled';
import { OpenInNew } from '@mui/icons-material';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import LoadingScreen from '../../../components/LoadingScreen';
import usePlayerRankingData from '../../../hooks/rankingData/useTopEarners';
import { CHAINS } from '../../../utils/chains';

const StyledBox = styled(Box)`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	text-align: center;
	width: 100%;
	min-width: 1400px;
	max-width: 1400px;
	// height: 85vh;
	margin: 0 auto 5rem auto;
	background-color: transparent;

	@media (max-width: 1025px) {
		width: 95%;
		min-width: 100vw;
		max-width: 100vw;
	}

	@media (max-width: 680px) {
		width: 95%;
		min-width: 100vw;
		max-width: 100vw;
	}
`;

const StyledTable = styled(Table)<{ theme: any }>`
	width: 100%;
	min-width: 750px;
	max-width: 1400px;
	height: 100%;

	@media (max-width: 680px) {
		width: 100%;
		min-width: 0;
		max-width: 100%;
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
	cursor: default;

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
		// transform: scale(1.02);
		// box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
	width: 100%;
	display: flex;
	justify-content: center;

	@media (max-width: 1025px) {
		width: 95%;
	}

	@media (max-width: 680px) {
		width: 95%;
	}
`;

interface TopContributorsProps {
	topContributors: any;
	loading: any;
	error: any;
}

const TopContributors: React.FC<TopContributorsProps> = ({ topContributors, loading, error }) => {
	const theme = useTheme();
	const router = useRouter();

	// Redux

	// Player Ranking Data
	const [order, setOrder] = useState('desc');
	const [orderBy, setOrderBy] = useState('rankedBySpent');

	const createSortHandler = (property) => (event) => {
		const isAsc = orderBy === property && order === 'desc';
		setOrder(isAsc ? 'asc' : 'desc');
		setOrderBy(property);
	};

	// Determine which ranking list to use based on orderBy
	let sortedData = [];

	if (topContributors) {
		// Determine which ranking list to use based on orderBy
		sortedData = topContributors[orderBy] ? [...topContributors[orderBy]] : [];

		// If order is ascending, reverse the sorted data
		if (order === 'asc') {
			sortedData.reverse();
		}
	}

	const handlePlayer = (playerId) => {
		return () => {
			router.push(`/player/${playerId}`);
		};
	};

	const handleScrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	// Define a function to convert numbers to their ordinal representation in JavaScript
	function numberToOrdinal(n) {
		if (10 <= n % 100 && n % 100 <= 20) {
			return n + 'th';
		}
		switch (n % 10) {
			case 1:
				return n + 'st';
			case 2:
				return n + 'nd';
			case 3:
				return n + 'rd';
			default:
				return n + 'th';
		}
	}

	return (
		<>
			{loading || !sortedData ? (
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
						<StyledTableContainer theme={theme}>
							<StyledTable stickyHeader theme={theme}>
								<TableHead>
									<TableRow>
										<TableCell style={{ width: '2.5%', textAlign: 'left' }}>#</TableCell>
										<TableCell style={{ width: '50%', textAlign: 'left' }}>Address</TableCell>
										{/* <TableCell>
											<StyledButton theme={theme} onClick={createSortHandler('rankedByEarned')}>
												Earnings
												{orderBy === 'rankedByEarned' ? (
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
										</TableCell> */}
										<TableCell style={{ width: '47.5%', textAlign: 'right' }}>
											<StyledButton theme={theme} style={{ fontSize: '0.875rem' }}>
												Contributions
												{/* {orderBy === 'rankedBySpent' ? (
													order === 'asc' ? (
														<ArrowDropUpIcon style={{ color: theme.palette.text.primary }} />
													) : (
														<ArrowDropDownIcon style={{ color: theme.palette.text.primary }} />
													)
												) : order === 'asc' ? (
													<ArrowDropUpIcon style={{ color: theme.palette.secondary.main }} />
												) : (
													<ArrowDropDownIcon style={{ color: theme.palette.secondary.main }} />
												)} */}
											</StyledButton>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{sortedData.length > 0 ? (
										sortedData.map((row, index) => (
											<StyledTableRow theme={theme} key={index}>
												{/* <TableCell>{numberToOrdinal(index + 1)}</TableCell> */}
												<TableCell style={{ width: '2.5%', textAlign: 'left' }}>{index + 1}</TableCell>
												<TableCell style={{ width: '50%', textAlign: 'left' }}>
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
														<span>{window.innerWidth < 680 ? `${row.id.slice(0, 6)}...${row.id.slice(-4)}` : row.id}</span>
														<OpenInNew style={{ display: 'flex', fontSize: '14px', fill: 'rgba(128, 128, 138, 1)' }} />
													</a>
												</TableCell>
												{/* <TableCell style={{ textAlign: 'right' }}>
													<a>${row.earned}</a>
												</TableCell> */}
												<TableCell style={{ width: '47.5%', textAlign: 'right' }}>
													<a>${row.spent}</a>
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
};

export default TopContributors;
