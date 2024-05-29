import styled from '@emotion/styled';
import ArrowCircleUpOutlinedIcon from '@mui/icons-material/ArrowCircleUpOutlined';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import localFont from 'next/font/local';
import Head from 'next/head';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import LoadingScreen from '../../../components/LoadingScreen';
import { currencySlice } from '../../../state/currency/currencySlice';
import { CHAINS, nameToChainId } from '../../../utils/chains';

const TrueLies = localFont({ src: '../../../public/fonts/TrueLies.woff2', display: 'swap' });

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
	margin: 2.5rem auto 5rem auto;
	background-color: transparent;

	@media (max-width: 680px) {
		width: 95%;
		min-width: 100vw;
		max-width: 100vw;
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
	min-width: 1200px;
	max-width: 1400px;
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
	cursor: default;

	@media (max-width: 600px) {
		font-size: 3rem;
	}
`;

const StyledTableRow = styled(TableRow)<{ theme: any }>`
	transition: transform 0.3s;
	box-shadow 0.3s;
	cursor: pointer;

	&:nth-of-type(odd) {
		background-color: ${({ theme }) => theme.palette.background.default};
	}

	&:hover {
		// transform: scale(1.02);
		// box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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
	// height: 100vh;
	overflow-y: auto;
`;

interface TopDaresProps {
	topDares: any;
	loading: any;
	error: any;
}

const TopDares: React.FC<TopDaresProps> = ({ topDares, loading, error }) => {
	const theme = useTheme();
	const router = useRouter();

	// Redux
	const dispatch = useDispatch();
	const currencyValue = useSelector((state: { currency: boolean }) => state.currency);
	const currencyPrice = useSelector((state: { currencyPrice: any }) => state.currencyPrice);

	// Toogle Button For Token Price
	const handleToggle = (event, newCurrency) => {
		// update currencyValue in redux
		dispatch(currencySlice.actions.updateCurrency(newCurrency));
	};

	const [order, setOrder] = useState('desc');
	const [orderBy, setOrderBy] = useState('amount');

	const createSortHandler = (property) => (event) => {
		const isAsc = orderBy === property && order === 'desc';
		setOrder(isAsc ? 'asc' : 'desc');
		setOrderBy(property);
	};

	const handleDare = (chainID, dareID) => {
		return () => {
			router.push(`/dare/${chainID}-${dareID}`);
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

	const handleScrollToTop = () => {
		window.scrollTo({
			top: 0,
			behavior: 'smooth',
		});
	};

	return (
		<>
			{loading || !topDares ? (
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
							<a>Dare Leaderboard</a>
						</Title> */}
						{/* <StyledToggleButtonGroup theme={theme} value={currencyValue} exclusive onChange={handleToggle}>
							<StyledToggleButton theme={theme} disabled={currencyValue === false} value={false}>
								{isNetworkAvailable ? <a>{CHAINS[chainIdUrl]?.nameToken}</a> : <a>MATIC</a>}
							</StyledToggleButton>
							<StyledToggleButton theme={theme} disabled={currencyValue === true} value={true}>
								<a>USD</a>
							</StyledToggleButton>
						</StyledToggleButtonGroup> */}
						<StyledTableContainer theme={theme}>
							<StyledTable stickyHeader theme={theme}>
								<TableHead>
									<TableRow>
										<TableCell>#</TableCell>
										<TableCell>Description</TableCell>
										<TableCell>
											<StyledButton theme={theme}>
												Entry Amount
												{/* {orderBy === 'entranceAmount' ? (
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

										<TableCell>
											<StyledButton theme={theme}>
												Total Amount
												{/* {orderBy === 'amount' ? (
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

										<TableCell>
											<StyledButton theme={theme}>
												Participants
												{/* {orderBy === 'participants' ? (
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

										<TableCell>
											<StyledButton theme={theme}>
												Voters
												{/* {orderBy === 'voters' ? (
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

										<TableCell>
											<StyledButton theme={theme}>
												Voting
												{/* {orderBy === 'voting' ? (
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
									{topDares.length > 0 ? (
										topDares.map((row, index) => (
											<StyledTableRow theme={theme} key={index} onClick={handleDare(row.chainId, row.id)}>
												<TableCell>{index + 1}</TableCell>
												<TableCell>
													<a style={{ cursor: 'pointer' }}>
														{row.description.length > 75 ? row.description.substring(0, 75) + '...' : row.description}
													</a>
												</TableCell>
												<TableCell style={{ textAlign: 'right' }}>
													{currencyValue === false ? (
														<a style={{ cursor: 'pointer' }}>
															{formatNumber(row.entranceAmount)} {CHAINS[row.chainId]?.nameToken}
														</a>
													) : (
														<a style={{ cursor: 'pointer' }}>
															${formatNumber(row.entranceAmount * currencyPrice[CHAINS[row.chainId]?.nameToken.toLowerCase()])}
														</a>
													)}
												</TableCell>
												<TableCell style={{ textAlign: 'right' }}>
													{currencyValue === false ? (
														<a style={{ cursor: 'pointer' }}>
															{formatNumber(row.amount)} {CHAINS[row.chainId]?.nameToken}
														</a>
													) : (
														<a style={{ cursor: 'pointer' }}>
															${formatNumber(row.amount * currencyPrice[CHAINS[row.chainId]?.nameToken.toLowerCase()])}
														</a>
													)}
												</TableCell>
												<TableCell style={{ textAlign: 'right' }}>{row.participants}</TableCell>
												<TableCell style={{ textAlign: 'right' }}>{Number(row.positiveVotes) + Number(row.negativeVotes)}</TableCell>
												<TableCell style={{ textAlign: 'right' }}>{calculatePositivePercentage(row.positiveVotes, row.negativeVotes)}</TableCell>
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

export default TopDares;
