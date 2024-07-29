import styled from '@emotion/styled';
import { OpenInNew } from '@mui/icons-material';
import { Box, Button, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Head from 'next/head';
import Link from 'next/link';
import { FC, useState } from 'react';
import LoadingScreen from '../../../components/LoadingScreen';
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

	@media (max-width: 680px) {
		font-size: 1rem;
	}
`;

const StyledTableRow = styled(TableRow)`
	max-width: 100vw;
	transition: transform 0.3s, box-shadow 0.3s;

	&:nth-of-type(odd) {
		background-color: ${({ theme }) => theme.palette.background.default};
	}

	&:hover {
		background-color: ${({ theme }) => theme.palette.action.hover};
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

interface TopEarnerProps {
	topEarners: Record<string, any[]> | null;
	loading: boolean;
	error: any;
}

const TopEarners: FC<TopEarnerProps> = ({ topEarners, loading, error }) => {
	const theme = useTheme();

	const [order, setOrder] = useState<'asc' | 'desc'>('desc');
	const [orderBy, setOrderBy] = useState<string>('rankedByEarned');

	let sortedData: any[] = [];

	if (topEarners) {
		sortedData = topEarners[orderBy] ? [...topEarners[orderBy]] : [];
		if (order === 'asc') {
			sortedData.reverse();
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
						<title>Ranking | Nerve Global</title>
						<meta property="og:title" content="Ranking | Nerve Global" key="title" />
						<meta property="og:site_name" content="Ranking | Nerve Global" />
						<meta property="og:description" content="Ranking | Nerve Global" />
						<meta property="og:image" content="https://app.nerveglobal.com/favicon.ico" />
						<meta property="og:url" content="https://app.nerveglobal.com/" />
						<meta property="og:type" content="website" />
						<meta name="twitter:card" content="summary_large_image" />
						<meta name="twitter:site" content="@nerveglobal_" />
						<meta name="twitter:title" content="Ranking | Nerve Global" />
						<meta name="twitter:description" content="Ranking | Nerve Global" />
						<meta name="twitter:image" content="https://app.nerveglobal.com/favicon.ico" />
					</Head>
					<StyledBox>
						<StyledTableContainer theme={theme}>
							<StyledTable stickyHeader theme={theme}>
								<TableHead>
									<TableRow>
										<TableCell style={{ width: '2.5%', textAlign: 'left' }}>#</TableCell>
										<TableCell style={{ width: '50%', textAlign: 'left' }}>Address</TableCell>
										<TableCell style={{ width: '47.5%', textAlign: 'right' }}>
											<StyledButton theme={theme} style={{ fontSize: '0.875rem' }}>
												Earnings
											</StyledButton>
										</TableCell>
									</TableRow>
								</TableHead>
								<TableBody>
									{sortedData.length > 0 ? (
										sortedData.map((row, index) => (
											<StyledTableRow theme={theme} key={index}>
												<TableCell style={{ width: '2.5%', textAlign: 'left' }}>{index + 1}</TableCell>
												<TableCell style={{ width: '50%', textAlign: 'left', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
													<Link
														style={{
															cursor: 'pointer',
															textDecoration: 'none',
															color: theme.palette.text.primary,
															display: 'inline-flex',
															gap: '5px',
															alignItems: 'center',
															whiteSpace: 'nowrap',
															overflow: 'hidden',
															textOverflow: 'ellipsis',
															maxWidth: '100%',
														}}
														href={CHAINS[137]?.blockExplorerUrls[0] + 'address/' + row.id}
														target="_blank"
													>
														<span>{window.innerWidth < 680 ? `${row.id.slice(0, 6)}...${row.id.slice(-4)}` : row.id}</span>
														<OpenInNew style={{ display: 'flex', fontSize: '14px', fill: 'rgba(128, 128, 138, 1)' }} />
													</Link>
												</TableCell>
												<TableCell style={{ width: '47.5%', textAlign: 'right' }}>${row.earned}</TableCell>
											</StyledTableRow>
										))
									) : (
										<StyledTableRow theme={theme}>
											<TableCell colSpan={3} style={{ textAlign: 'center' }}>
												No data available on this chain
											</TableCell>
										</StyledTableRow>
									)}
								</TableBody>
							</StyledTable>
						</StyledTableContainer>
					</StyledBox>
				</>
			)}
		</>
	);
};

export default TopEarners;
